const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORIES = [
  {
    name: "Gold",
    slug: "gold",
    imageUrl: "/hero-necklace.png",
    subcategories: [
      { name: "Necklace Sets", slug: "necklace-sets", imageUrl: "/hero-necklace.png" },
      { name: "Pendant Sets", slug: "pendant-sets", imageUrl: "/IMG_20260603_130343.png" },
      { name: "Lady's Rings", slug: "ladys-rings", imageUrl: "/IMG_20260603_134643.png" },
      { name: "Gent's Rings", slug: "gents-rings", imageUrl: "/IMG_20260603_133507.png" },
      { name: "Eartops", slug: "eartops", imageUrl: "/featured-earrings.png" },
      { name: "Bracelets", slug: "bracelets", imageUrl: "/IMG_20260603_132136.png" },
      { name: "Bangles", slug: "bangles", imageUrl: "/IMG_20260603_123905.png" },
      { name: "Noa", slug: "noa", imageUrl: "/IMG_20260603_133228.png" },
      { name: "Chains", slug: "chains", imageUrl: "/IMG_20260603_134842.png" },
      { name: "Rakhi", slug: "rakhi", imageUrl: "/IMG_20260603_141310.png" },
    ],
  },
  {
    name: "Diamond",
    slug: "diamond",
    imageUrl: "/diamond_solitaire_ring.jpg",
    subcategories: [
      { name: "Chains with Pendant", slug: "chains-with-pendant", imageUrl: "/diamond_pendant_chain.jpg" },
      { name: "Rings", slug: "rings", imageUrl: "/diamond_solitaire_ring.jpg" },
      { name: "Earrings", slug: "earrings", imageUrl: "/IMG_20260603_141216.png" },
      { name: "Nosepins", slug: "nosepins", imageUrl: "/IMG_20260603_135005.png" },
    ],
  },
  {
    name: "Silver",
    slug: "silver",
    imageUrl: "/silver_luxury_necklace.jpg",
    subcategories: [
      { name: "Necklaces", slug: "necklaces", imageUrl: "/silver_luxury_necklace.jpg" },
      { name: "Rings", slug: "rings", imageUrl: "/silver_rings_luxury.jpg" },
      { name: "Nosepins", slug: "nosepins", imageUrl: "/silver_nosepin_luxury.jpg" },
      { name: "Rakhi", slug: "rakhi", imageUrl: "/silver_rakhi_luxury.jpg" },
    ],
  },
  {
    name: "Astrological Stones",
    slug: "astrological-stones",
    imageUrl: "/stone_sapphire_nila.jpg",
    subcategories: [
      { name: "Nila", slug: "nila", imageUrl: "/stone_sapphire_nila.jpg" },
      { name: "Opal", slug: "opal", imageUrl: "/stone_fire_opal.jpg" },
      { name: "Emerald", slug: "emerald", imageUrl: "/stone_emerald_panna.jpg" },
      { name: "Ruby", slug: "ruby", imageUrl: "/stone_ruby_manik.jpg" },
    ],
  },
  {
    name: "Costume Jewellery",
    slug: "costume-jewellery",
    imageUrl: "/IMG_20260603_141414.png",
  },
  {
    name: "Offers & Deals",
    slug: "offers-deals",
    imageUrl: "/bridal-edit.png",
  },
];

const SAMPLE_PRODUCTS = [
  // GOLD
  {
    name: "Royal Heritage Bridal Choker",
    slug: "royal-heritage-bridal-choker",
    sku: "AR-GLD-NK-001",
    description: "An opulent 22KT BIS 916 hallmarked bridal choker set with cascading filigree drops.",
    goldPurity: 22,
    goldWeight: 45.5,
    category: "Gold",
    subCategory: "Necklace Sets",
    stockCount: 2,
    images: ["/hero-necklace.png", "/master_gallery_royal_set.jpg"]
  },
  {
    name: "Artisanal Peacock & Leaf Gold Choker",
    slug: "artisanal-peacock-leaf-gold-choker",
    sku: "AR-GLD-NK-002",
    description: "Intricate hand-embossed peacock motifs interwoven with traditional Bengali Tarakasi filigree.",
    goldPurity: 22,
    goldWeight: 38.2,
    category: "Gold",
    subCategory: "Necklace Sets",
    stockCount: 3,
    images: ["/master_gallery_necklace_closeup.jpg", "/hero-banner.png"]
  },
  {
    name: "Grand Bengali Sitahar Haar",
    slug: "grand-bengali-sitahar-haar",
    sku: "AR-GLD-NK-003",
    description: "Multi-layered long royal Sitahar necklace showcasing ornate gold medallions.",
    goldPurity: 22,
    goldWeight: 52.0,
    category: "Gold",
    subCategory: "Necklace Sets",
    stockCount: 1,
    images: ["/IMG_20260603_130220.png", "/master_gallery_royal_set.jpg"]
  },
  {
    name: "Antiquity Peacock Gold Pendant & Chain",
    slug: "antiquity-peacock-gold-pendant",
    sku: "AR-GLD-PD-001",
    description: "Sculpted antique finish gold medallion engraved with divine peacocks on a 22KT link chain.",
    goldPurity: 22,
    goldWeight: 14.5,
    category: "Gold",
    subCategory: "Pendant Sets",
    stockCount: 4,
    images: ["/IMG_20260603_130343.png"]
  },
  {
    name: "Antique Floral Carved Gold Lady's Ring",
    slug: "antique-floral-carved-gold-ring",
    sku: "AR-GLD-LR-001",
    description: "Graceful open-work blooming floral statement ring in high-polish 22KT hallmarked gold.",
    goldPurity: 22,
    goldWeight: 6.8,
    category: "Gold",
    subCategory: "Lady's Rings",
    stockCount: 6,
    images: ["/IMG_20260603_134643.png"]
  },
  {
    name: "Traditional Royal Lion Gent's Signet Ring",
    slug: "traditional-royal-lion-gents-ring",
    sku: "AR-GLD-GR-001",
    description: "Solid 22KT gold signet ring featuring a boldly embossed lion emblem.",
    goldPurity: 22,
    goldWeight: 9.4,
    category: "Gold",
    subCategory: "Gent's Rings",
    stockCount: 4,
    images: ["/IMG_20260603_133507.png"]
  },
  {
    name: "Royal Peacock Jhumka",
    slug: "royal-peacock-jhumka",
    sku: "AR-GLD-ER-001",
    description: "Exquisite hand-enamelled gold earrings with bell jhumka domes and micro-beads.",
    goldPurity: 22,
    goldWeight: 18.2,
    category: "Gold",
    subCategory: "Eartops",
    stockCount: 2,
    images: ["/featured-earrings.png", "/master_gallery_earring_drop.jpg"]
  },
  {
    name: "Sacred Iconography Nakshi Kada",
    slug: "sacred-iconography-nakshi-kada",
    sku: "AR-GLD-BG-001",
    description: "Heavy solid 22KT gold temple kada bangle embossed with sacred iconography.",
    goldPurity: 22,
    goldWeight: 32.5,
    category: "Gold",
    subCategory: "Bangles",
    stockCount: 2,
    images: ["/IMG_20260603_123905.png", "/gold_temple_nakshi.jpg"]
  },
  {
    name: "Bengali Heirloom Filigree Bala Bangles",
    slug: "bengali-heirloom-filigree-bala-bangles",
    sku: "AR-GLD-BG-002",
    description: "Traditional Bengali gold Balas with ornate floral terminals. Sold as a pair.",
    goldPurity: 22,
    goldWeight: 24.0,
    category: "Gold",
    subCategory: "Bangles",
    stockCount: 2,
    images: ["/IMG_20260603_133127.png"]
  },
  {
    name: "Traditional Gold Sankha & Pola Bandha (Noa)",
    slug: "traditional-gold-noa-bandha",
    sku: "AR-GLD-NOA-001",
    description: "Hand-wrapped 22KT gold wire framing an auspicious iron core with leaf accents.",
    goldPurity: 22,
    goldWeight: 8.5,
    category: "Gold",
    subCategory: "Noa",
    stockCount: 5,
    images: ["/IMG_20260603_133228.png"]
  },
  {
    name: "Solid Gold Link Chain",
    slug: "solid-gold-link-chain",
    sku: "AR-GLD-CH-001",
    description: "Sturdy interlocking BIS 916 hallmarked link chain for daily elegance.",
    goldPurity: 22,
    goldWeight: 16.0,
    category: "Gold",
    subCategory: "Chains",
    stockCount: 4,
    images: ["/IMG_20260603_134842.png"]
  },
  {
    name: "Auspicious Floral Gold Rakhi",
    slug: "auspicious-floral-gold-rakhi",
    sku: "AR-GLD-RK-001",
    description: "Sacred Om and floral engraved gold medallion convertible into a lifestyle bracelet.",
    goldPurity: 22,
    goldWeight: 4.8,
    category: "Gold",
    subCategory: "Rakhi",
    stockCount: 7,
    images: ["/IMG_20260603_141310.png"]
  },
  {
    name: "Artisanal Byzantine Gold Bracelet",
    slug: "artisanal-byzantine-gold-bracelet",
    sku: "AR-GLD-BR-001",
    description: "Flexible handcrafted Byzantine chain links with safety box clasp.",
    goldPurity: 22,
    goldWeight: 15.2,
    category: "Gold",
    subCategory: "Bracelets",
    stockCount: 3,
    images: ["/IMG_20260603_132136.png"]
  },

  // DIAMOND
  {
    name: "Imperial Solitaire & Ruby Halo Necklace",
    slug: "imperial-solitaire-ruby-necklace",
    sku: "AR-DIA-NK-001",
    description: "Precision-cut certified diamonds encircled by deep vivid Burmese rubies.",
    goldPurity: 18,
    goldWeight: 22.0,
    diamondClarity: "VVS-VS",
    diamondCarat: 1.25,
    category: "Diamond",
    subCategory: "Chains with Pendant",
    stockCount: 1,
    images: ["/diamond_pendant_chain.jpg", "/hero-necklace.png"]
  },
  {
    name: "Radiant Solitaire Engagement Ring",
    slug: "radiant-solitaire-engagement-ring",
    sku: "AR-DIA-RG-001",
    description: "Flawless 1.02 ct round brilliant diamond set in signature 6-prong crown.",
    goldPurity: 18,
    goldWeight: 3.8,
    diamondClarity: "VVS1 GIA",
    diamondCarat: 1.02,
    category: "Diamond",
    subCategory: "Rings",
    stockCount: 2,
    images: ["/diamond_solitaire_ring.jpg"]
  },
  {
    name: "Eternal Diamond Band",
    slug: "eternal-diamond-band",
    sku: "AR-DIA-RG-002",
    description: "Continuous circle of micro-pavé diamonds set in delicate 18KT rose gold.",
    goldPurity: 18,
    goldWeight: 4.2,
    diamondClarity: "VS-SI",
    diamondCarat: 0.65,
    category: "Diamond",
    subCategory: "Rings",
    stockCount: 4,
    images: ["/diamond_solitaire_ring.jpg"]
  },
  {
    name: "Cascading Diamond Floral Drop Earrings",
    slug: "cascading-diamond-floral-drop-earrings",
    sku: "AR-DIA-ER-001",
    description: "Graceful floral clusters suspended on diamond line drops in 18KT white gold.",
    goldPurity: 18,
    goldWeight: 9.8,
    diamondClarity: "VVS-VS",
    diamondCarat: 1.80,
    category: "Diamond",
    subCategory: "Earrings",
    stockCount: 2,
    images: ["/IMG_20260603_141216.png"]
  },
  {
    name: "Traditional Diamond Nosepin",
    slug: "traditional-diamond-nosepin",
    sku: "AR-DIA-NP-001",
    description: "Classic 7-stone diamond floral nosepin in 18KT yellow gold.",
    goldPurity: 18,
    goldWeight: 1.1,
    diamondClarity: "VVS",
    diamondCarat: 0.18,
    category: "Diamond",
    subCategory: "Nosepins",
    stockCount: 8,
    images: ["/IMG_20260603_135005.png"]
  },

  // SILVER
  {
    name: "Royal Sterling Silver Hasli Choker",
    slug: "royal-sterling-silver-hasli-choker",
    sku: "AR-SLV-NK-001",
    description: "Authentic 92.5 hallmarked sterling silver rigid Hasli neckpiece with oxidized filigree bells.",
    goldPurity: 925,
    goldWeight: 68.0,
    category: "Silver",
    subCategory: "Necklaces",
    stockCount: 4,
    images: ["/silver_luxury_necklace.jpg", "/silver_bangles_craft.jpg"]
  },
  {
    name: "Handcrafted Oxidized Silver Floral Haar",
    slug: "handcrafted-oxidized-silver-floral-haar",
    sku: "AR-SLV-NK-002",
    description: "Multi-strand silver beaded necklace with an ornate mandala pendant.",
    goldPurity: 925,
    goldWeight: 54.0,
    category: "Silver",
    subCategory: "Necklaces",
    stockCount: 3,
    images: ["/silver_luxury_necklace.jpg"]
  },
  {
    name: "Tribal Carved Silver Statement Ring",
    slug: "tribal-carved-silver-statement-ring",
    sku: "AR-SLV-RG-001",
    description: "Bold circular mirror-work silver ring crowned with oxidized granulation.",
    goldPurity: 925,
    goldWeight: 14.5,
    category: "Silver",
    subCategory: "Rings",
    stockCount: 6,
    images: ["/silver_rings_luxury.jpg"]
  },
  {
    name: "Traditional Silver Mookuthi Nosepin",
    slug: "traditional-silver-mookuthi-nosepin",
    sku: "AR-SLV-NP-001",
    description: "Handmade sterling silver nosepin accented with tribal ball clusters and antique patina.",
    goldPurity: 925,
    goldWeight: 2.8,
    category: "Silver",
    subCategory: "Nosepins",
    stockCount: 12,
    images: ["/silver_nosepin_luxury.jpg"]
  },
  {
    name: "Auspicious Handcrafted Silver Rakhi",
    slug: "auspicious-handcrafted-silver-rakhi",
    sku: "AR-SLV-RK-001",
    description: "Pure 92.5 silver filigree motif mounted on a braided soft silk thread.",
    goldPurity: 925,
    goldWeight: 8.5,
    category: "Silver",
    subCategory: "Rakhi",
    stockCount: 15,
    images: ["/silver_rakhi_luxury.jpg"]
  }
];

async function main() {
  console.log('Seeding categories with images...');
  for (const cat of CATEGORIES) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        imageUrl: cat.imageUrl,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        imageUrl: cat.imageUrl,
        isActive: true,
      },
    });

    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        const subSlug = `${cat.slug}-${sub.slug}`;
        await prisma.category.upsert({
          where: { slug: subSlug },
          update: {
            imageUrl: sub.imageUrl,
            isActive: true,
          },
          create: {
            name: `${cat.name} ${sub.name}`,
            slug: subSlug,
            parentId: parent.id,
            imageUrl: sub.imageUrl,
            isActive: true,
          },
        });
      }
    }
  }

  // Seed Gold Rates
  console.log('Seeding gold rates...');
  const purities = [9, 18, 22, 24];
  const basePrices = { 9: 25000, 18: 48000, 22: 58000, 24: 63000 };
  for (const p of purities) {
    await prisma.goldPrice.upsert({
      where: { purity: p },
      update: { pricePer10g: basePrices[p] },
      create: {
        purity: p,
        pricePer10g: basePrices[p],
      },
    });
  }

  // Seed Admin User
  console.log('Seeding admin user...');
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@aranyak.com' },
    update: {},
    create: {
      name: 'Master Admin',
      email: 'admin@aranyak.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  // Seed Comprehensive Products
  console.log(`Seeding ${SAMPLE_PRODUCTS.length} verified products for Gold, Diamond, and Silver...`);
  for (const p of SAMPLE_PRODUCTS) {
    try {
      await prisma.product.upsert({
        where: { slug: p.slug },
        update: {
          sku: p.sku,
          images: p.images,
          stockCount: p.stockCount,
          category: p.category,
          subCategory: p.subCategory,
          goldPurity: p.goldPurity,
          goldWeight: p.goldWeight,
          diamondClarity: p.diamondClarity || null,
          diamondCarat: p.diamondCarat || null,
          isActive: true,
        },
        create: {
          ...p,
          isActive: true,
        },
      });
    } catch (err) {
      console.warn(`Product ${p.slug} error:`, err.message);
    }
  }

  // Seed Showroom Stores
  const STORES = [
    {
      name: "Agartala Branch",
      address: "B. Chowmuhani, M.B, Motor Stand Rd, near Kamaan Chowmuhani, Dhaleswar, Agartala, Tripura 799001",
      phone: "03812981506",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Aranyak+Jewellers+B.+Chowmuhani,+M.B,+Motor+Stand+Rd,+near+Kamaan+Chowmuhani,+Dhaleswar,+Agartala,+Tripura+799001",
      isActive: true,
      order: 0,
    },
    {
      name: "Dharmanagar Branch",
      address: "DNV Road, Power House Quater Complex, Dharmanagar, Tripura 799250, India",
      phone: "",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=ARANYAK+JEWELLERS%2C+DNV+Road%2C+Dharmanagar%2C+Tripura+799250",
      isActive: true,
      order: 1,
    },
    {
      name: "Kailashahar Branch",
      address: "GIRLS SCHOOL ROAD, Kailashahar, Tripura 799277",
      phone: "03812981506",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Aranyak+Jewellers+GIRLS+SCHOOL+ROAD,+Kailashahar,+Tripura+799277",
      isActive: true,
      order: 2,
    },
    {
      name: "Khowai Branch",
      address: "3J93+FHJ Subhash Park, Suhash Park, Khowai, Tripura 799202",
      phone: "094365 89901",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Aranyak+Jewellers+3J93%2BFHJ+Subhash+Park,+Suhash+Park,+Khowai,+Tripura+799202",
      isActive: true,
      order: 3,
    },
  ];

  console.log(`Seeding ${STORES.length} showroom stores...`);
  for (const store of STORES) {
    try {
      const existing = await prisma.store.findFirst({
        where: { name: store.name },
      });
      if (existing) {
        await prisma.store.update({
          where: { id: existing.id },
          data: store,
        });
      } else {
        await prisma.store.create({
          data: store,
        });
      }
    } catch (err) {
      console.warn(`Store ${store.name} error:`, err.message);
    }
  }

  console.log('✅ Full Seeding complete! Database is populated with Gold, Diamond, and Silver collections.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
