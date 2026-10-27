import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export const INITIAL_GALLERY_ITEMS = [
  {
    title: 'The Royal Mayur Sitahar',
    subtitle: '22K Handcrafted Filigree Masterpiece',
    description: 'An iconic Bengali peacock motif handcrafted with ancient granulation technique.',
    imageUrl: '/uploads/lookbook_bridal_sitahar.webp',
    category: 'bridal',
    metal: 'gold',
    purity: '22K',
    tags: ['bridal', 'sitahar', 'peacock', 'hallmarked'],
    isFeatured: true,
    order: 0,
    isActive: true,
  },
  {
    title: 'Chandbali Peacock Jhumkas',
    subtitle: 'Heritage Bridal Ear Ornaments',
    description: 'Intricate nakshi carved jhumkas with ruby and emerald accents.',
    imageUrl: '/uploads/lookbook_filigree_jhumkas.webp',
    category: 'earrings',
    metal: 'gold',
    purity: '22K',
    tags: ['jhumka', 'antique', 'bridal'],
    isFeatured: true,
    order: 1,
    isActive: true,
  },
  {
    title: 'Solitaire Diamond Blossom Ring',
    subtitle: 'VVS Certified Natural Diamond',
    description: 'A brilliant cut natural solitaire diamond encircled by micro-pavé petals in 18K white gold.',
    imageUrl: '/uploads/gallery_solitaire_feature.webp',
    category: 'solitaires',
    metal: 'diamond',
    purity: '18K',
    tags: ['solitaire', 'diamond', 'ring', 'certified'],
    isFeatured: true,
    order: 2,
    isActive: true,
  },
  {
    title: 'Royal Makara Antique Silver Kadas',
    subtitle: '925 Sterling Silver Masterpiece',
    description: 'Traditional Bengali openable silver kadas with oxidized temple finish.',
    imageUrl: '/uploads/lookbook_silver_bangles.webp',
    category: 'silver',
    metal: 'silver',
    purity: '925',
    tags: ['silver', 'kadas', 'antique', 'bangles'],
    isFeatured: false,
    order: 3,
    isActive: true,
  },
  {
    title: 'Royal Bridal Trousseau Choker Set',
    subtitle: 'Complete Wedding Heritage Collection',
    description: 'Handcrafted bridal choker, matching kanpashas, tikli, and ratanchur.',
    imageUrl: '/uploads/gallery_royal_bridal_feature.webp',
    category: 'bridal',
    metal: 'gold',
    purity: '22K',
    tags: ['bridal', 'choker', 'wedding-set'],
    isFeatured: true,
    order: 4,
    isActive: true,
  },
  {
    title: 'Haute Joaillerie Chandelier Drops',
    subtitle: 'Marquise & Pear Cut Diamonds',
    description: 'Cascading diamond drop earrings designed for high society galas.',
    imageUrl: '/uploads/gallery_chandeliers_feature.webp',
    category: 'earrings',
    metal: 'diamond',
    purity: '18K',
    tags: ['diamond', 'chandelier', 'earrings'],
    isFeatured: false,
    order: 5,
    isActive: true,
  },
];

@Injectable()
export class GalleryService {
  private readonly logger = new Logger(GalleryService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaults();
  }

  async seedDefaults() {
    const count = await this.prisma.galleryItem.count();
    if (count === 0) {
      this.logger.log('Seeding initial master gallery showcase...');
      for (const item of INITIAL_GALLERY_ITEMS) {
        await this.prisma.galleryItem.create({ data: item });
      }
      this.logger.log('Seeded gallery items successfully.');
    }
  }

  async findAll(category?: string, metal?: string) {
    const where: any = { isActive: true };
    if (category && category !== 'all') where.category = category;
    if (metal && metal !== 'all') where.metal = metal;

    return this.prisma.galleryItem.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.galleryItem.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.galleryItem.findUnique({ where: { id } });
  }

  async create(data: any) {
    if (typeof data.order === 'string') data.order = parseInt(data.order, 10) || 0;
    if (typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }
    return this.prisma.galleryItem.create({ data });
  }

  async update(id: string, data: any) {
    if (typeof data.order === 'string') data.order = parseInt(data.order, 10) || 0;
    if (typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }
    return this.prisma.galleryItem.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.galleryItem.delete({ where: { id } });
  }

  async reorder(items: { id: string; order: number }[]) {
    const updates = items.map((item) =>
      this.prisma.galleryItem.update({
        where: { id: item.id },
        data: { order: item.order },
      }),
    );
    await Promise.all(updates);
    return { success: true, count: items.length };
  }
}
