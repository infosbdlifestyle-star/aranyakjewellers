const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CATEGORIES = [
  {
    name: "Gold",
    slug: "gold",
    subcategories: [
      { name: "Necklace Sets", slug: "necklace-sets" },
      { name: "Pendant Sets", slug: "pendant-sets" },
      { name: "Lady's Rings", slug: "ladys-rings" },
      { name: "Gent's Rings", slug: "gents-rings" },
      { name: "Eartops", slug: "eartops" },
      { name: "Bracelets", slug: "bracelets" },
      { name: "Bangles", slug: "bangles" },
      { name: "Noa", slug: "noa" },
      { name: "Chains", slug: "chains" },
      { name: "Rakhi", slug: "rakhi" },
    ],
  },
  {
    name: "Diamond",
    slug: "diamond",
    subcategories: [
      { name: "Chains with Pendant", slug: "chains-with-pendant" },
      { name: "Rings", slug: "rings" },
      { name: "Earrings", slug: "earrings" },
      { name: "Nosepins", slug: "nosepins" },
    ],
  },
  {
    name: "Silver",
    slug: "silver",
    subcategories: [
      { name: "Nosepins", slug: "nosepins" },
      { name: "Rakhi", slug: "rakhi" },
      { name: "Rings", slug: "rings" },
      { name: "Necklaces", slug: "necklaces" },
    ],
  },
  {
    name: "Astrological Stones",
    slug: "astrological-stones",
    subcategories: [
      { name: "Nila", slug: "nila" },
      { name: "Opal", slug: "opal" },
      { name: "Emerald", slug: "emerald" },
      { name: "Ruby", slug: "ruby" },
    ],
  },
  {
    name: "Costume Jewellery",
    slug: "costume-jewellery",
  },
  {
    name: "Offers & Deals",
    slug: "offers-deals",
  },
];

async function main() {
  console.log('Seeding categories...');
  
  for (const cat of CATEGORIES) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        isActive: true,
      },
    });

    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        const subSlug = `${cat.slug}-${sub.slug}`;
        await prisma.category.upsert({
          where: { slug: subSlug },
          update: {},
          create: {
            name: sub.name,
            slug: subSlug,
            parentId: parent.id,
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
      update: {},
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

  // Seed Sample Products
  console.log('Seeding sample products...');
  const sampleProducts = [
    {
      name: "Heritage Bridal Choker",
      slug: "heritage-bridal-choker",
      description: "A timeless 22KT gold choker inspired by traditional motifs.",
      goldPurity: 22,
      goldWeight: 45.5,
      category: "Gold",
      subCategory: "Necklace Sets",
      stockCount: 1,
      images: ["https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800"]
    },
    {
      name: "Eternal Diamond Band",
      slug: "eternal-diamond-band",
      description: "Elegant 18KT rose gold band with VS-SI quality diamonds.",
      goldPurity: 18,
      goldWeight: 4.2,
      category: "Diamond",
      subCategory: "Rings",
      stockCount: 5,
      images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800"]
    },
    {
      name: "Royal Peacock Jhumka",
      slug: "royal-peacock-jhumka",
      description: "Exquisite hand-enamelled gold earrings with intricate peacock details.",
      goldPurity: 22,
      goldWeight: 18.2,
      category: "Gold",
      subCategory: "Eartops",
      stockCount: 2,
      images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"]
    }
  ];

  for (const p of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        isActive: true,
      },
    });
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
