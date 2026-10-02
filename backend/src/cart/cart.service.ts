import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }

    // Calculate totals using gold pricing
    const goldRates = await this.prisma.goldPrice.findMany();
    const goldRateMap = new Map<number, number>(
      goldRates.map((r) => [r.purity, r.pricePer10g]),
    );

    const enrichedItems = cart.items.map((item) => {
      const goldRate = goldRateMap.get(item.product.goldPurity) || 0;
      const goldValue = (goldRate / 10) * item.product.goldWeight;
      const makingCharges = (goldValue * 12) / 100;
      const taxable = goldValue + makingCharges;
      const gst = (taxable * 3) / 100;
      const price = Math.round(taxable + gst);

      return {
        ...item,
        calculatedPrice: price,
        total: price * item.quantity,
      };
    });

    const total = enrichedItems.reduce((sum, item) => sum + item.total, 0);

    return {
      ...cart,
      items: enrichedItems,
      cartTotal: total,
    };
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    const cart = await this.getCart(userId);

    const existingItem = cart.items.find((i) => i.productId === productId);

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
  }

  async updateCartItem(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(userId, itemId);
    }
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async removeFromCart(userId: string, itemId: string) {
    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) return;
    return this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}
