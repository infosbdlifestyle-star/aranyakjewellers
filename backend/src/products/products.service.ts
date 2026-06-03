import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: any) {
    // Auto-generate SKU if not provided
    if (!data.sku) {
      const prefix = data.category
        ? data.category.substring(0, 3).toUpperCase()
        : 'ARK';
      const timestamp = Date.now().toString().substring(6);
      const random = Math.floor(Math.random() * 1000);
      data.sku = `ARK-${prefix}-${timestamp}-${random}`;
    }

    return this.prisma.product.create({ data });
  }

  async updateProduct(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }

  async findAll(filters?: {
    category?: string;
    subCategory?: string;
    tag?: string;
    minPrice?: number;
    maxPrice?: number;
    purity?: number;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    const where: any = { isActive: true };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.subCategory) {
      where.subCategory = filters.subCategory;
    }

    if (filters?.tag) {
      where.tags = { has: filters.tag };
    }

    if (filters?.purity) {
      where.goldPurity = filters.purity;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Fetch products
    const products = await this.prisma.product.findMany({
      where,
      skip: filters?.skip || 0,
      take: filters?.take || 100,
      orderBy: { createdAt: 'desc' },
    });

    if (products.length === 0) return [];

    // Fetch gold rates to calculate pricing
    const goldRates = await this.prisma.goldPrice.findMany();
    const goldRateMap = new Map<number, number>(
      goldRates.map((r) => [r.purity, r.pricePer10g]),
    );

    // Enrich products with dynamic pricing
    const enriched = products.map((product) => {
      const goldPricePer10g = goldRateMap.get(product.goldPurity) || 0;
      return this.calculatePricing(product, goldPricePer10g);
    });

    // Client-side price filtering
    let result = enriched;
    if (filters?.minPrice || filters?.maxPrice) {
      result = enriched.filter((p) => {
        const price = p.pricing?.finalPrice || 0;
        if (filters.minPrice && price < filters.minPrice) return false;
        if (filters.maxPrice && price > filters.maxPrice) return false;
        return true;
      });
    }

    return result;
  }

  async findOne(slugOrId: string) {
    let product;

    if (/^[0-9a-fA-F]{24}$/.test(slugOrId)) {
      product = await this.prisma.product.findUnique({
        where: { id: slugOrId },
      });
    }

    if (!product) {
      product = await this.prisma.product.findFirst({
        where: { slug: slugOrId },
      });
    }

    if (!product) throw new NotFoundException('Product not found');

    // Fetch gold rate for single product pricing
    const goldRate = await this.prisma.goldPrice.findUnique({
      where: { purity: product.goldPurity },
    });

    return this.calculatePricing(product, goldRate?.pricePer10g || 0);
  }

  // Dynamic pricing: Gold rate × weight + making charges + GST
  private calculatePricing(product: any, goldRate: number) {
    try {
      const goldValue = (goldRate / 10) * product.goldWeight;
      const makingChargePercent = 12; // 12% default making charges
      const makingCharges = (goldValue * makingChargePercent) / 100;
      const taxableValue = goldValue + makingCharges;
      const gst = (taxableValue * 3) / 100; // 3% GST on gold
      const finalPrice = taxableValue + gst;

      return {
        ...product,
        pricing: {
          validAsOf: new Date(),
          goldRate,
          components: {
            goldValue: Math.round(goldValue),
            makingCharges: Math.round(makingCharges),
            gst: Math.round(gst),
          },
          finalPrice: Math.round(finalPrice),
        },
      };
    } catch (e: any) {
      console.error(`[ProductsService] Pricing failed for ${product?.id}:`, e.message);
      return { ...product, pricing: null };
    }
  }
}
