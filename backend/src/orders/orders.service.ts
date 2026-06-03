import {
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  async createOrder(
    userId: string,
    shippingAddress: any,
    items?: any[],
    totalAmount?: number,
  ) {
    // 1. Get Cart if items not provided
    let orderItems = items;
    let finalTotal = totalAmount;

    if (!orderItems) {
      const cart = await this.cartService.getCart(userId);
      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }
      orderItems = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.calculatedPrice || 0,
        name: item.product.name,
      }));
      finalTotal = cart.cartTotal;
    }

    // 2. Check Stock
    for (const item of orderItems) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) throw new BadRequestException(`Product not found`);
      if (product.stockCount < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.stockCount}`,
        );
      }
    }

    // 3. Create Order
    const order = await this.prisma.order.create({
      data: {
        userId,
        totalAmount: finalTotal || 0,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        shippingAddress,
        items: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
          })),
        },
      },
    });

    // 4. Deduct Stock
    for (const item of orderItems) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stockCount: { decrement: item.quantity } },
      });
    }

    // 5. Clear Backend Cart if it was used
    if (!items) {
      await this.cartService.clearCart(userId);
    }

    return order;
  }

  async getMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  async getAllOrders(
    status?: string,
    search?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async updateOrderStatus(id: string, status: string) {
    const updateData: any = { status };

    if (status === 'CANCELLED') {
      // Restore stock
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (order) {
        for (const item of order.items) {
          await this.prisma.product.update({
            where: { id: item.productId },
            data: { stockCount: { increment: item.quantity } },
          });
        }
      }
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
    });
  }

  async markAsPaid(orderId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
      },
    });
  }
}
