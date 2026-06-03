import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GoldPriceService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.goldPrice.findMany({
      orderBy: { purity: 'asc' },
    });
  }

  async upsert(purity: number, pricePer10g: number) {
    return this.prisma.goldPrice.upsert({
      where: { purity },
      update: { pricePer10g },
      create: { purity, pricePer10g },
    });
  }
}
