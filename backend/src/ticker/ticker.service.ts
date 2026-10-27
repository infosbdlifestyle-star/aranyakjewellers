import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export const INITIAL_TICKER_MESSAGES = [
  {
    textBn: 'আরণ্যক জুয়েলার্স বিশেষ অফার ২০২৬',
    textEn: 'Aranyak Jewellers Celebration Offers 2026',
    speed: 40,
    direction: 'rtl',
    separator: '—',
    order: 0,
    isActive: true,
  },
  {
    textBn: 'সোনার গয়না: ১০০০/- টাকা ছাড় প্রতিগ্রাম সোনার গয়না কেনাকাটায় (₹1000 OFF/GM)',
    textEn: 'Gold Jewellery: ₹1000 Off per gram on all gold ornaments',
    speed: 40,
    direction: 'rtl',
    separator: '—',
    order: 1,
    isActive: true,
  },
  {
    textBn: 'পুরোনো গয়না পরিবর্তন: ১০০% মূল্য হলমার্কযুক্ত পুরোনো গয়নার পরিবর্তে (ZERO LOSS EXCHANGE)',
    textEn: 'Old Gold Exchange: 100% full valuation with zero loss',
    speed: 40,
    direction: 'rtl',
    separator: '—',
    order: 2,
    isActive: true,
  },
  {
    textBn: 'হীরের গয়না: ১০০% ছাড় হীরের গয়নার মজুরিতে (100% FREE MAKING)',
    textEn: 'Diamond Jewellery: 100% off making charges on certified solitaires',
    speed: 40,
    direction: 'rtl',
    separator: '—',
    order: 3,
    isActive: true,
  },
  {
    textBn: 'রুপোর গয়না: ২৫% ছাড় রূপোর গয়নার MRP-র ওপর (25% FLAT DISCOUNT)',
    textEn: 'Silver Ornaments: Flat 25% discount on MRP',
    speed: 40,
    direction: 'rtl',
    separator: '—',
    order: 4,
    isActive: true,
  },
  {
    textBn: 'প্রতিদিন লাকি ড্র: প্রতিদিনের লাকি ড্র-তে হোম অ্যাপ্লায়েন্স (DAILY PRIZES)',
    textEn: 'Daily Lucky Draw: Win branded home appliances daily',
    speed: 40,
    direction: 'rtl',
    separator: '—',
    order: 5,
    isActive: true,
  },
  {
    textBn: 'নিশ্চিত উপহার: নিশ্চিত উপহার প্রতি কেনাকাটায় (FREE GIFTS)',
    textEn: 'Assured Gift: Assured gift on every single purchase',
    speed: 40,
    direction: 'rtl',
    separator: '—',
    order: 6,
    isActive: true,
  },
  {
    textBn: 'মেগা লাকি ড্র: MEGA LUCKY DRAW ৩টি স্কুটি (3X SCOOTY BUMPER)',
    textEn: 'Mega Lucky Draw: 3 Scooties bumper grand prizes',
    speed: 40,
    direction: 'rtl',
    separator: '—',
    order: 7,
    isActive: true,
  },
  {
    textBn: 'ত্রিপুরা শোরুম: আগরতলা • ধর্মনগর • কৈলাশহর • খোয়াই',
    textEn: 'Tripura Boutiques: Agartala • Dharmanagar • Kailashahar • Khowai',
    speed: 40,
    direction: 'rtl',
    separator: '—',
    order: 8,
    isActive: true,
  },
];

@Injectable()
export class TickerService {
  private readonly logger = new Logger(TickerService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaults();
  }

  async seedDefaults() {
    const count = await this.prisma.tickerMessage.count();
    if (count === 0) {
      this.logger.log('Seeding initial announcement ticker messages...');
      for (const msg of INITIAL_TICKER_MESSAGES) {
        await this.prisma.tickerMessage.create({ data: msg });
      }
      this.logger.log('Seeded ticker messages successfully.');
    }
  }

  async findActive() {
    const now = new Date();
    const messages = await this.prisma.tickerMessage.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return messages.filter((m) => {
      if (m.startDate && new Date(m.startDate) > now) return false;
      if (m.endDate && new Date(m.endDate) < now) return false;
      return true;
    });
  }

  async findAllAdmin() {
    return this.prisma.tickerMessage.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.tickerMessage.findUnique({ where: { id } });
  }

  async create(data: any) {
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    if (typeof data.order === 'string') data.order = parseInt(data.order, 10) || 0;
    if (typeof data.speed === 'string') data.speed = parseInt(data.speed, 10) || 40;

    return this.prisma.tickerMessage.create({ data });
  }

  async update(id: string, data: any) {
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    if (typeof data.order === 'string') data.order = parseInt(data.order, 10) || 0;
    if (typeof data.speed === 'string') data.speed = parseInt(data.speed, 10) || 40;

    return this.prisma.tickerMessage.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.tickerMessage.delete({ where: { id } });
  }

  async reorder(items: { id: string; order: number }[]) {
    const updates = items.map((item) =>
      this.prisma.tickerMessage.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );
    await Promise.all(updates);
    return { success: true, count: items.length };
  }
}
