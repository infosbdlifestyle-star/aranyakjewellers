import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export const INITIAL_PROMOTIONAL_OFFERS = [
  {
    titleBn: 'সোনার গয়না (Gold Jewellery)',
    titleEn: 'Gold Jewellery Offer',
    descBn: '১০০০/- টাকা ছাড় প্রতিগ্রাম সোনার গয়না কেনাকাটায়',
    descEn: 'Flat ₹1000 off per gram on all handcrafted gold jewellery purchases.',
    tag: '₹1000 OFF/GM',
    badge: 'Festive Special',
    icon: 'coins',
    discountValue: '1000',
    discountType: 'FLAT_PER_GRAM',
    placement: 'both',
    highlight: false,
    order: 0,
    isActive: true,
  },
  {
    titleBn: 'পুরোনো গয়না পরিবর্তন (Exchange)',
    titleEn: 'Zero-Loss Gold Exchange',
    descBn: '১০০% মূল্য হলমার্ক যুক্ত পুরোনো গয়নার পরিবর্তে',
    descEn: '100% full valuation on BIS hallmarked old gold exchange with zero deductions.',
    tag: 'ZERO LOSS EXCHANGE',
    badge: 'Lifetime Benefit',
    icon: 'refresh',
    discountValue: '100%',
    discountType: 'PERCENT',
    placement: 'both',
    highlight: false,
    order: 1,
    isActive: true,
  },
  {
    titleBn: 'হীরের গয়না (Diamond Jewellery)',
    titleEn: 'Diamond Jewellery Making Waiver',
    descBn: '১০০% ছাড় হীরের গয়নার মজুরিতে',
    descEn: '100% complete waiver on craftsmanship & making charges for certified solitaires.',
    tag: '100% FREE MAKING',
    badge: 'Diamond Edit',
    icon: 'diamond',
    discountValue: '100%',
    discountType: 'FREE_MAKING',
    placement: 'both',
    highlight: false,
    order: 2,
    isActive: true,
  },
  {
    titleBn: 'রুপোর গয়না (Silver Ornaments)',
    titleEn: 'Silver Ornaments Discount',
    descBn: '২৫% ছাড় রূপোর গয়নার MRP-র উপর',
    descEn: 'Flat 25% discount across all 925 sterling silver ornaments & utensils.',
    tag: '25% FLAT DISCOUNT',
    badge: 'Silver Heritage',
    icon: 'percent',
    discountValue: '25%',
    discountType: 'PERCENT',
    placement: 'both',
    highlight: false,
    order: 3,
    isActive: true,
  },
  {
    titleBn: 'প্রতিদিন লাকি ড্র (Daily Lucky Draw)',
    titleEn: 'Daily Lucky Draw Prizes',
    descBn: 'প্রতিদিন লাকি ড্র-তে হোম অ্যাপ্লায়েন্স',
    descEn: 'Exciting daily lucky draw wins featuring premium branded home appliances.',
    tag: 'DAILY PRIZES',
    badge: 'Daily Assured',
    icon: 'gift',
    placement: 'both',
    highlight: false,
    order: 4,
    isActive: true,
  },
  {
    titleBn: 'নিশ্চিত উপহার (Assured Gifts)',
    titleEn: 'Assured Surprise Gift',
    descBn: 'নিশ্চিত উপহার প্রতি কেনাকাটায়',
    descEn: 'An assured auspicious gift with every single purchase across all boutiques.',
    tag: 'FREE GIFTS',
    badge: 'Every Purchase',
    icon: 'sparkles',
    placement: 'both',
    highlight: false,
    order: 5,
    isActive: true,
  },
  {
    titleBn: 'মেগা লাকি ড্র (Mega Lucky Draw)',
    titleEn: 'Mega Festival Bumper Draw',
    descBn: 'MEGA LUCKY DRAW ৩টি স্কুটি জেতার সুযোগ',
    descEn: 'Mega lucky draw bumper opportunity to win 3 brand-new Scooties.',
    tag: '3X SCOOTY BUMPER',
    badge: 'Bumper Grand Prize',
    icon: 'trophy',
    placement: 'both',
    highlight: true,
    order: 6,
    isActive: true,
  },
];

@Injectable()
export class OffersService {
  private readonly logger = new Logger(OffersService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaults();
  }

  async seedDefaults() {
    const count = await this.prisma.promotionalOffer.count();
    if (count === 0) {
      this.logger.log('Seeding initial 7 verified promotional offers...');
      for (const offer of INITIAL_PROMOTIONAL_OFFERS) {
        await this.prisma.promotionalOffer.create({ data: offer });
      }
      this.logger.log('Seeded 7 promotional offers successfully.');
    }
  }

  async findActive(placement?: string) {
    const now = new Date();
    const offers = await this.prisma.promotionalOffer.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return offers.filter((o) => {
      if (o.startDate && new Date(o.startDate) > now) return false;
      if (o.endDate && new Date(o.endDate) < now) return false;
      if (placement && placement !== 'all' && o.placement !== 'both' && o.placement !== placement) return false;
      return true;
    });
  }

  async findAllAdmin() {
    return this.prisma.promotionalOffer.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.promotionalOffer.findUnique({ where: { id } });
  }

  async create(data: any) {
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    if (typeof data.order === 'string') data.order = parseInt(data.order, 10) || 0;

    return this.prisma.promotionalOffer.create({ data });
  }

  async update(id: string, data: any) {
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    if (typeof data.order === 'string') data.order = parseInt(data.order, 10) || 0;

    return this.prisma.promotionalOffer.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.promotionalOffer.delete({ where: { id } });
  }

  async reorder(items: { id: string; order: number }[]) {
    const updates = items.map((item) =>
      this.prisma.promotionalOffer.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );
    await Promise.all(updates);
    return { success: true, count: items.length };
  }
}
