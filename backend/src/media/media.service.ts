import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { ReplaceMediaDto } from './dto/replace-media.dto';

export const DEFAULT_MEDIA_ITEMS = [
  // 1. Homepage Hero / Banners
  {
    key: 'home_hero_banner',
    section: 'homepage_hero',
    title: 'Homepage Hero Master Banner',
    altText: 'Aranyak Jewellers - Royal Bridal Masterpiece Collection in Tripura',
    url: '/uploads/hero_timeless_elegance.webp',
    usageLocation: 'Homepage Top Hero Banner & Atmosphere Backdrop',
    order: 0,
  },
  {
    key: 'home_hero_necklace',
    section: 'homepage_hero',
    title: 'Featured Masterpiece Royal Choker',
    altText: 'Handcrafted 22K Royal Bengal Bridal Choker',
    url: '/uploads/top_picks_traditional_heritage.webp',
    usageLocation: 'Homepage Hero Floating Jewel Display',
    order: 1,
  },

  // 2. Top Picks and Jewellery Collections
  {
    key: 'top_picks_royal_heirloom',
    section: 'top_picks',
    title: 'Royal Bengal Bridal Heirloom Collection',
    altText: 'Royal Bengal Bridal Heirloom Collection',
    url: '/uploads/cat_bridal_heritage.webp',
    usageLocation: 'Homepage > Curated Top Picks Grid (Card 1)',
    order: 0,
  },
  {
    key: 'top_picks_temple_nakshi',
    section: 'top_picks',
    title: 'Temple & Nakshi Heritage Gold Ornaments',
    altText: '22K Hallmarked Gold Royal Choker',
    url: '/uploads/top_picks_traditional_heritage.webp',
    usageLocation: 'Homepage > Curated Top Picks Grid (Card 2)',
    order: 1,
  },
  {
    key: 'top_picks_diamond_solitaires',
    section: 'top_picks',
    title: 'Certified Diamond Solitaires & Emerald Sets',
    altText: 'Colombian Emerald & Certified Diamond Bridal Choker',
    url: '/uploads/cat_certified_diamonds.webp',
    usageLocation: 'Homepage > Curated Top Picks Grid (Card 3)',
    order: 2,
  },
  {
    key: 'top_picks_artisanal_craft',
    section: 'top_picks',
    title: 'Handcrafted Heritage Silver & Filigree Craft',
    altText: 'Handcrafted Heritage Silver Filigree Necklace with Diya Flame',
    url: '/uploads/cat_antique_silver_heritage.webp',
    usageLocation: 'Homepage > Curated Top Picks Grid (Card 4)',
    order: 3,
  },

  // 3. Bridal Jewellery & Product Features
  {
    key: 'home_bridal_image',
    section: 'bridal_editorial',
    title: 'Bridal Trousseau Editorial Showcase',
    altText: 'Royal Bridal Trousseau in 22K Hallmark Gold',
    url: '/uploads/gallery_royal_bridal_feature.webp',
    usageLocation: 'Homepage > The Bridal Edit Feature Section',
    order: 0,
  },
  {
    key: 'home_editorial_image',
    section: 'bridal_editorial',
    title: 'Heirloom Jewellery Editorial Portrait',
    altText: 'Heirloom 22K Gold Choker on Banarasi Silk',
    url: '/uploads/top_picks_traditional_heritage.webp',
    usageLocation: 'Homepage > Editorial Narrative (Right Showcase Column)',
    order: 1,
  },

  // 4. Craftsmanship and Brand Story
  {
    key: 'home_craftsmanship_image',
    section: 'craftsmanship',
    title: 'Master Artisans Workshop Video Poster',
    altText: 'Master Goldsmith Handcrafting 22K Gold Filigree Ornaments',
    url: '/uploads/craftsmanship_poster.webp',
    usageLocation: 'Homepage > Craftsmanship Video Poster & Narrative',
    order: 0,
  },
  {
    key: 'brand_heritage_emblem',
    section: 'craftsmanship',
    title: 'Heritage Brand Emblem',
    altText: 'Aranyak Jewellers Tripura Heritage Since 1995',
    url: '/logo-transparent.png',
    usageLocation: 'Heritage Narrative & Footer Brand Mark',
    order: 1,
  },

  // 5. About Us Section
  {
    key: 'about_md_image',
    section: 'about_us',
    title: 'Managing Director / Founder Portrait',
    altText: 'Founder & Managing Director - Aranyak Jewellers',
    url: '/md.jpg',
    usageLocation: 'About Us Page > Leadership & Legacy Portrait',
    order: 0,
  },
  {
    key: 'about_hero_image',
    section: 'about_us',
    title: 'About Us Page Hero Backdrop',
    altText: 'Aranyak Jewellers Artisanal Heritage',
    url: '/uploads/hero_timeless_elegance.webp',
    usageLocation: 'About Us Page > Top Header Background',
    order: 1,
  },

  // 6. Showroom and Branch Images (Boutique feature only - store locator cards remain photo-free)
  {
    key: 'home_showroom_image',
    section: 'showrooms',
    title: 'Flagship Showroom Hero Feature',
    altText: 'Aranyak Jewellers Luxury Boutique Showroom in Tripura',
    url: '/showroom.jpg',
    usageLocation: 'Homepage > Bottom Showroom Editorial Feature',
    order: 0,
  },

  // 7. Promotional Banners
  {
    key: 'promo_banner_puja_special',
    section: 'promotional_banners',
    title: 'Festive & Bridal Season Banner',
    altText: 'Aranyak Jewellers Special Festive Gold & Diamond Offer',
    url: '/uploads/banner_bridal_gold.webp',
    usageLocation: 'Promotional Banners Carousel & Offer Sections',
    order: 0,
  },

  // 8. Other Website Gallery Images
  {
    key: 'gallery_royal_set',
    section: 'gallery',
    title: 'Royal Long Conch Haar on Kanjeevaram Silk',
    altText: 'Royal Long Conch-Link Haar on Maroon Kanjeevaram Silk',
    url: '/uploads/lookbook_bridal_sitahar.webp',
    usageLocation: 'Master Gallery & Homepage Social Showcase (Item 1)',
    order: 0,
  },
  {
    key: 'gallery_earring_drop',
    section: 'gallery',
    title: 'Handcrafted Chandbali Jhumkas on Heirloom Box',
    altText: 'Pure Handcrafted Filigree Chandbali Jhumkas',
    url: '/uploads/lookbook_filigree_jhumkas.webp',
    usageLocation: 'Master Gallery & Homepage Social Showcase (Item 2)',
    order: 1,
  },
  {
    key: 'gallery_diamond_ring',
    section: 'gallery',
    title: 'Sparkling Diamond Flower Cocktail Ring',
    altText: 'Diamond Flower Cocktail Ring',
    url: '/uploads/gallery_solitaire_feature.webp',
    usageLocation: 'Master Gallery & Homepage Social Showcase (Item 3)',
    order: 2,
  },
  {
    key: 'gallery_sapphire_ring',
    section: 'gallery',
    title: 'Pure Silver Lion-Head Makara Kadas with Enamel',
    altText: 'Handcrafted Pure Silver Makara Bangles with Ruby and Emerald Enamel',
    url: '/uploads/lookbook_silver_bangles.webp',
    usageLocation: 'Master Gallery & Homepage Social Showcase (Item 4)',
    order: 3,
  },
  {
    key: 'gallery_necklace_closeup',
    section: 'gallery',
    title: 'Royal Silver Necklace on Carved Chest',
    altText: 'Fine Handcrafted Silver Filigree Necklace',
    url: '/uploads/lookbook_heritage_filigree.webp',
    usageLocation: 'Master Gallery Curated Showcase (Item 5)',
    order: 4,
  },
  {
    key: 'gallery_heirloom_box',
    section: 'gallery',
    title: 'Heirloom Pure Silver Bangles Pair',
    altText: 'Handcrafted Silver Bangles on Carved Wooden Chest',
    url: '/uploads/silver_bangles_makara_pair.webp',
    usageLocation: 'Master Gallery Curated Showcase (Item 6)',
    order: 5,
  },
];

@Injectable()
export class MediaService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaults();
  }

  async seedDefaults() {
    for (const item of DEFAULT_MEDIA_ITEMS) {
      try {
        const existing = await this.prisma.websiteMedia.findUnique({
          where: { key: item.key },
        });
        if (!existing) {
          await this.prisma.websiteMedia.create({
            data: {
              ...item,
              isActive: true,
            },
          });
          // Also sync to SiteSetting for seamless backwards-compatibility
          await this.syncToSetting(item.key, item.url);
        }
      } catch (e) {
        console.warn(`[MediaService] Seed skipping for ${item.key}:`, (e as any)?.message);
      }
    }
  }

  private async syncToSetting(key: string, value: string) {
    try {
      await this.prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    } catch {
      // Safe ignore
    }
  }

  async findAll(section?: string) {
    const where: any = { isActive: true };
    if (section && section !== 'all') {
      where.section = section;
    }
    return this.prisma.websiteMedia.findMany({
      where,
      orderBy: [{ section: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findMap(): Promise<Record<string, string>> {
    const items = await this.prisma.websiteMedia.findMany({
      where: { isActive: true },
    });
    const map: Record<string, string> = {};
    items.forEach((item) => {
      map[item.key] = item.url;
    });
    return map;
  }

  async findOne(id: string) {
    const media = await this.prisma.websiteMedia.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media item with ID ${id} not found`);
    }
    return media;
  }

  async findByKey(key: string) {
    const media = await this.prisma.websiteMedia.findUnique({ where: { key } });
    if (!media) {
      throw new NotFoundException(`Media item with key "${key}" not found`);
    }
    return media;
  }

  async create(dto: CreateMediaDto) {
    const existing = await this.prisma.websiteMedia.findUnique({
      where: { key: dto.key },
    });
    if (existing) {
      throw new BadRequestException(`Media item with key "${dto.key}" already exists`);
    }

    const created = await this.prisma.websiteMedia.create({
      data: {
        ...dto,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
        order: dto.order || 0,
      },
    });

    await this.syncToSetting(dto.key, dto.url);
    return created;
  }

  async update(id: string, dto: UpdateMediaDto) {
    const existing = await this.findOne(id);
    const updated = await this.prisma.websiteMedia.update({
      where: { id },
      data: dto,
    });

    if (dto.url && dto.url !== existing.url) {
      await this.syncToSetting(updated.key, dto.url);
    }
    return updated;
  }

  async replace(id: string, replaceDto: ReplaceMediaDto) {
    const existing = await this.findOne(id);
    
    // Store old URL into previousUrl for 1-click restore/rollback
    const updated = await this.prisma.websiteMedia.update({
      where: { id },
      data: {
        previousUrl: existing.url,
        url: replaceDto.url,
        altText: replaceDto.altText || existing.altText,
        updatedAt: new Date(),
      },
    });

    await this.syncToSetting(updated.key, replaceDto.url);
    return updated;
  }

  async restore(id: string) {
    const existing = await this.findOne(id);
    if (!existing.previousUrl) {
      throw new BadRequestException('No previous image available to restore');
    }

    const previousUrl = existing.previousUrl;
    const currentUrl = existing.url;

    // Swap current and previous URL
    const restored = await this.prisma.websiteMedia.update({
      where: { id },
      data: {
        url: previousUrl,
        previousUrl: currentUrl,
        updatedAt: new Date(),
      },
    });

    await this.syncToSetting(restored.key, previousUrl);
    return restored;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.websiteMedia.delete({
      where: { id },
    });
  }
}
