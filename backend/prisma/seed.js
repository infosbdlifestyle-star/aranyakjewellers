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
    imageUrl: "/uploads/diamond-bypass-solitaire-ring-1.webp",
    subcategories: [
      { name: "Necklaces", slug: "necklaces", imageUrl: "/uploads/diamond-regal-floral-arch-mangalsutra-1.webp" },
      { name: "Rings", slug: "rings", imageUrl: "/uploads/diamond-bypass-solitaire-ring-1.webp" },
      { name: "Bangles", slug: "bangles", imageUrl: "/uploads/diamond-marquise-blossom-cluster-bangle-1.webp" },
      { name: "Chains with Pendant", slug: "chains-with-pendant", imageUrl: "/uploads/diamond_pendant_chain.webp" },
      { name: "Nosepins", slug: "nosepins", imageUrl: "/uploads/IMG_20260603_135005.webp" },
      { name: "Earrings", slug: "earrings", imageUrl: "/uploads/IMG_20260603_141216.webp" },
    ],
  },
  {
    name: "Silver",
    slug: "silver",
    imageUrl: "/silver_luxury_necklace.jpg",
    subcategories: [
      { name: "Necklaces", slug: "necklaces", imageUrl: "/uploads/silver-filigree-sitahar-diya-1.webp" },
      { name: "Bangles", slug: "bangles", imageUrl: "/uploads/silver-makara-lion-kadas-pair-1.webp" },
      { name: "Earrings", slug: "earrings", imageUrl: "/uploads/lookbook_heritage_filigree.webp" },
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
  {
    "name": "Royal Heritage Bridal Choker",
    "slug": "royal-heritage-bridal-choker",
    "sku": "AR-GLD-NK-001",
    "description": "An opulent 22KT BIS 916 hallmarked bridal choker set with cascading filigree drops.",
    "goldPurity": 22,
    "goldWeight": 45.5,
    "category": "Gold",
    "subCategory": "Necklace Sets",
    "stockCount": 2,
    "images": [
      "/IMG_20260603_132847.png",
      "/master_gallery_royal_set.jpg"
    ]
  },
  {
    "name": "Artisanal Peacock & Leaf Gold Choker",
    "slug": "artisanal-peacock-leaf-gold-choker",
    "sku": "AR-GLD-NK-002",
    "description": "Intricate hand-embossed peacock motifs interwoven with traditional Bengali Tarakasi filigree.",
    "goldPurity": 22,
    "goldWeight": 38.2,
    "category": "Gold",
    "subCategory": "Necklace Sets",
    "stockCount": 3,
    "images": [
      "/master_gallery_necklace_closeup.jpg"
    ]
  },
  {
    "name": "Grand Bengali Sitahar Haar",
    "slug": "grand-bengali-sitahar-haar",
    "sku": "AR-GLD-NK-003",
    "description": "Multi-layered long royal Sitahar necklace showcasing ornate gold medallions.",
    "goldPurity": 22,
    "goldWeight": 52,
    "category": "Gold",
    "subCategory": "Necklace Sets",
    "stockCount": 1,
    "images": [
      "/IMG_20260603_141906.png"
    ]
  },
  {
    "name": "Antiquity Peacock Gold Pendant & Chain",
    "slug": "antiquity-peacock-gold-pendant",
    "sku": "AR-GLD-PD-001",
    "description": "Sculpted antique finish gold medallion engraved with divine peacocks on a 22KT link chain.",
    "goldPurity": 22,
    "goldWeight": 14.5,
    "category": "Gold",
    "subCategory": "Pendant Sets",
    "stockCount": 4,
    "images": []
  },
  {
    "name": "Antique Floral Carved Gold Lady's Ring",
    "slug": "antique-floral-carved-gold-ring",
    "sku": "AR-GLD-LR-001",
    "description": "Graceful open-work blooming floral statement ring in high-polish 22KT hallmarked gold.",
    "goldPurity": 22,
    "goldWeight": 6.8,
    "category": "Gold",
    "subCategory": "Lady's Rings",
    "stockCount": 6,
    "images": [
      "/IMG_20260603_125514.png",
      "/IMG_20260603_142357.png"
    ]
  },
  {
    "name": "Traditional Royal Lion Gent's Signet Ring",
    "slug": "traditional-royal-lion-gents-ring",
    "sku": "AR-GLD-GR-001",
    "description": "Solid 22KT gold signet ring featuring a boldly embossed lion emblem.",
    "goldPurity": 22,
    "goldWeight": 9.4,
    "category": "Gold",
    "subCategory": "Gent's Rings",
    "stockCount": 4,
    "images": [
      "/IMG_20260603_142513.png"
    ]
  },
  {
    "name": "Royal Peacock Jhumka",
    "slug": "royal-peacock-jhumka",
    "sku": "AR-GLD-ER-001",
    "description": "Exquisite hand-enamelled gold earrings with bell jhumka domes and micro-beads.",
    "goldPurity": 22,
    "goldWeight": 18.2,
    "category": "Gold",
    "subCategory": "Eartops",
    "stockCount": 2,
    "images": [
      "/IMG_20260603_191918.png",
      "/master_gallery_heirloom_box.jpg"
    ]
  },
  {
    "name": "Sacred Iconography Nakshi Kada",
    "slug": "sacred-iconography-nakshi-kada",
    "sku": "AR-GLD-BG-001",
    "description": "Heavy solid 22KT gold temple kada bangle embossed with sacred iconography.",
    "goldPurity": 22,
    "goldWeight": 32.5,
    "category": "Gold",
    "subCategory": "Bangles",
    "stockCount": 2,
    "images": [
      "/IMG_20260603_130513.png"
    ]
  },
  {
    "name": "Bengali Heirloom Filigree Bala Bangles",
    "slug": "bengali-heirloom-filigree-bala-bangles",
    "sku": "AR-GLD-BG-002",
    "description": "Traditional Bengali gold Balas with ornate floral terminals. Sold as a pair.",
    "goldPurity": 22,
    "goldWeight": 24,
    "category": "Gold",
    "subCategory": "Bangles",
    "stockCount": 2,
    "images": []
  },
  {
    "name": "Traditional Gold Sankha & Pola Bandha (Noa)",
    "slug": "traditional-gold-noa-bandha",
    "sku": "AR-GLD-NOA-001",
    "description": "Hand-wrapped 22KT gold wire framing an auspicious iron core with leaf accents.",
    "goldPurity": 22,
    "goldWeight": 8.5,
    "category": "Gold",
    "subCategory": "Sankha & Pola",
    "stockCount": 5,
    "images": [
      "/IMG_20260603_142625.jpg",
      "/IMG_20260603_143103.jpg"
    ]
  },
  {
    "name": "Solid Gold Link Chain",
    "slug": "solid-gold-link-chain",
    "sku": "AR-GLD-CH-001",
    "description": "Sturdy interlocking BIS 916 hallmarked link chain for daily elegance.",
    "goldPurity": 22,
    "goldWeight": 16,
    "category": "Gold",
    "subCategory": "Chains",
    "stockCount": 4,
    "images": [
      "/IMG_20260603_130726.png"
    ]
  },
  {
    "name": "Auspicious Floral Gold Rakhi",
    "slug": "auspicious-floral-gold-rakhi",
    "sku": "AR-GLD-RK-001",
    "description": "Sacred Om and floral engraved gold medallion convertible into a lifestyle bracelet.",
    "goldPurity": 22,
    "goldWeight": 4.8,
    "category": "Gold",
    "subCategory": "Gold Rakhi",
    "stockCount": 7,
    "images": []
  },
  {
    "name": "Artisanal Byzantine Gold Bracelet",
    "slug": "artisanal-byzantine-gold-bracelet",
    "sku": "AR-GLD-BR-001",
    "description": "Flexible handcrafted Byzantine chain links with safety box clasp.",
    "goldPurity": 22,
    "goldWeight": 15.2,
    "category": "Gold",
    "subCategory": "Bracelets",
    "stockCount": 3,
    "images": [
      "/IMG_20260603_141759.png"
    ]
  },
  {
    "name": "Imperial Solitaire & Ruby Halo Necklace",
    "slug": "imperial-solitaire-ruby-necklace",
    "sku": "AR-DIA-NK-001",
    "description": "Precision-cut certified diamonds encircled by deep vivid Burmese rubies.",
    "goldPurity": 18,
    "goldWeight": 22,
    "diamondClarity": "VVS-VS",
    "diamondCarat": 1.25,
    "category": "Diamond",
    "subCategory": "Chains with Pendant",
    "stockCount": 1,
    "images": []
  },
  {
    "name": "Radiant Solitaire Engagement Ring",
    "slug": "radiant-solitaire-engagement-ring",
    "sku": "AR-DIA-RG-001",
    "description": "Flawless 1.02 ct round brilliant diamond set in signature 6-prong crown.",
    "goldPurity": 18,
    "goldWeight": 3.8,
    "diamondClarity": "VVS1 GIA",
    "diamondCarat": 1.02,
    "category": "Diamond",
    "subCategory": "Rings",
    "stockCount": 2,
    "images": [
      "/uploads/diamond_solitaire_ring.webp"
    ]
  },
  {
    "name": "Eternal Diamond Band",
    "slug": "eternal-diamond-band",
    "sku": "AR-DIA-RG-002",
    "description": "Continuous circle of micro-pavé diamonds set in delicate 18KT rose gold.",
    "goldPurity": 18,
    "goldWeight": 4.2,
    "diamondClarity": "VS-SI",
    "diamondCarat": 0.65,
    "category": "Diamond",
    "subCategory": "Rings",
    "stockCount": 4,
    "images": []
  },
  {
    "name": "Cascading Diamond Floral Drop Earrings",
    "slug": "cascading-diamond-floral-drop-earrings",
    "sku": "AR-DIA-ER-001",
    "description": "Graceful floral clusters suspended on diamond line drops in 18KT white gold.",
    "goldPurity": 18,
    "goldWeight": 9.8,
    "diamondClarity": "VVS-VS",
    "diamondCarat": 1.8,
    "category": "Diamond",
    "subCategory": "Earrings",
    "stockCount": 2,
    "images": [
      "/uploads/IMG_20260603_141216.webp"
    ]
  },
  {
    "name": "Traditional Diamond Nosepin",
    "slug": "traditional-diamond-nosepin",
    "sku": "AR-DIA-NP-001",
    "description": "Classic 7-stone diamond floral nosepin in 18KT yellow gold.",
    "goldPurity": 18,
    "goldWeight": 1.1,
    "diamondClarity": "VVS",
    "diamondCarat": 0.18,
    "category": "Diamond",
    "subCategory": "Nosepins",
    "stockCount": 8,
    "images": [
      "/uploads/IMG_20260603_135005.webp"
    ]
  },
  {
    "name": "Royal Sterling Silver Hasli Choker",
    "slug": "royal-sterling-silver-hasli-choker",
    "sku": "AR-SLV-NK-001",
    "description": "Authentic 92.5 hallmarked sterling silver rigid Hasli neckpiece with oxidized filigree bells.",
    "goldPurity": 925,
    "goldWeight": 68,
    "category": "Silver",
    "subCategory": "Necklaces",
    "stockCount": 4,
    "images": []
  },
  {
    "name": "Handcrafted Oxidized Silver Floral Haar",
    "slug": "handcrafted-oxidized-silver-floral-haar",
    "sku": "AR-SLV-NK-002",
    "description": "Multi-strand silver beaded necklace with an ornate mandala pendant.",
    "goldPurity": 925,
    "goldWeight": 54,
    "category": "Silver",
    "subCategory": "Necklaces",
    "stockCount": 3,
    "images": []
  },
  {
    "name": "Antique Silver Jhumka with Pearl Drops",
    "slug": "antique-silver-jhumka-pearls",
    "sku": "AR-SLV-ER-001",
    "description": "Oxidized sterling silver temple jhumkas featuring delicate floral filigree and freshwater seed pearls.",
    "goldPurity": 925,
    "goldWeight": 24,
    "category": "Silver",
    "subCategory": "Earrings",
    "stockCount": 4,
    "images": []
  },
  {
    "name": "Tribal Carved Silver Statement Ring",
    "slug": "tribal-carved-silver-statement-ring",
    "sku": "AR-SLV-RG-001",
    "description": "Bold circular mirror-work silver ring crowned with oxidized granulation.",
    "goldPurity": 925,
    "goldWeight": 14.5,
    "category": "Silver",
    "subCategory": "Rings",
    "stockCount": 6,
    "images": []
  },
  {
    "name": "Traditional Silver Mookuthi Nosepin",
    "slug": "traditional-silver-mookuthi-nosepin",
    "sku": "AR-SLV-NP-001",
    "description": "Handmade sterling silver nosepin accented with tribal ball clusters and antique patina.",
    "goldPurity": 925,
    "goldWeight": 2.8,
    "category": "Silver",
    "subCategory": "Nosepins",
    "stockCount": 12,
    "images": []
  },
  {
    "name": "Auspicious Handcrafted Silver Rakhi",
    "slug": "auspicious-handcrafted-silver-rakhi",
    "sku": "AR-SLV-RK-001",
    "description": "Pure 92.5 silver filigree motif mounted on a braided soft silk thread.",
    "goldPurity": 925,
    "goldWeight": 8.5,
    "category": "Silver",
    "subCategory": "Silver Rakhi",
    "stockCount": 15,
    "images": []
  },
  {
    "name": "Handcrafted 22K Gold Filigree Bala Bangles Pair",
    "slug": "gold-bala-filigree-pair",
    "sku": "AR-GLD-BAN-011",
    "description": "An exceptional pair of traditional Bengali 22K BIS hallmarked gold Balas adorned with intricate Mayur peacock filigree and polished wire craftsmanship.",
    "goldPurity": 22,
    "goldWeight": 36.4,
    "category": "Gold",
    "subCategory": "Bangles",
    "stockCount": 3,
    "images": [
      "/uploads/gold-bala-filigree-pair-1.webp",
      "/uploads/gold-bala-filigree-pair-2.webp",
      "/uploads/gold-bala-filigree-pair-3.webp",
      "/uploads/gold-bala-filigree-pair-4.webp"
    ]
  },
  {
    "name": "22K Gold Floral Filigree Ratanchoor Bracelet",
    "slug": "gold-ratanchoor-bracelet",
    "sku": "AR-GLD-BRA-012",
    "description": "Grand royal 22K gold Ratanchoor hand ornament featuring an elaborate blooming lotus medallion with delicate connecting gold link chains.",
    "goldPurity": 22,
    "goldWeight": 24.8,
    "category": "Gold",
    "subCategory": "Bracelets",
    "stockCount": 3,
    "images": [
      "/uploads/gold-ratanchoor-bracelet-1.webp",
      "/uploads/gold-ratanchoor-bracelet-2.webp",
      "/uploads/gold-ratanchoor-bracelet-3.webp"
    ]
  },
  {
    "name": "Vintage 22K Gold Filigree Jhumka Drop Earrings",
    "slug": "gold-filigree-jhumkas-vintage",
    "sku": "AR-GLD-EAR-013",
    "description": "Handcrafted vintage 22K gold chandelier jhumka drop earrings featuring multi-tiered bell motifs and cascading gold droplets.",
    "goldPurity": 22,
    "goldWeight": 16.5,
    "category": "Gold",
    "subCategory": "Eartops",
    "stockCount": 3,
    "images": [
      "/uploads/gold-filigree-jhumkas-vintage-1.webp",
      "/uploads/gold-filigree-jhumkas-vintage-2.webp",
      "/uploads/gold-filigree-jhumkas-vintage-3.webp"
    ]
  },
  {
    "name": "Royal 22K Gold Dome Filigree Cocktail Ring",
    "slug": "gold-dome-cocktail-ring",
    "sku": "AR-GLD-LAD-014",
    "description": "Majestic royal dome filigree cocktail ring in 22K hallmarked gold, sculpted with an intricate openwork floral dome and beaded borders.",
    "goldPurity": 22,
    "goldWeight": 9.8,
    "category": "Gold",
    "subCategory": "Lady's Rings",
    "stockCount": 3,
    "images": [
      "/uploads/gold-dome-cocktail-ring-1.webp",
      "/uploads/gold-dome-cocktail-ring-2.webp",
      "/uploads/gold-dome-cocktail-ring-3.webp"
    ]
  },
  {
    "name": "Opulent 22K Gold Floral Bridal Choker & Jhumkas Set",
    "slug": "gold-floral-bridal-choker-set",
    "sku": "AR-GLD-NEC-015",
    "description": "Opulent 22K gold bridal choker necklace set featuring cascading floral medallions, embossed leaf borders, and matching royal jhumka earrings.",
    "goldPurity": 22,
    "goldWeight": 48.6,
    "category": "Gold",
    "subCategory": "Necklace Sets",
    "stockCount": 3,
    "images": [
      "/uploads/gold-floral-bridal-choker-set-1.webp",
      "/uploads/gold-floral-bridal-choker-set-2.webp",
      "/uploads/gold-floral-bridal-choker-set-3.webp",
      "/uploads/gold-floral-bridal-choker-set-4.webp"
    ]
  },
  {
    "name": "Grand Royal 22K Gold Bridal Trousseau Choker Set",
    "slug": "gold-royal-bridal-trousseau-choker",
    "sku": "AR-GLD-NEC-016",
    "description": "Regal Bengali bridal trousseau choker set sculpted with layered gold lace and traditional Nakshi scrollwork, paired with ornate chandelier earrings.",
    "goldPurity": 22,
    "goldWeight": 52.2,
    "category": "Gold",
    "subCategory": "Necklace Sets",
    "stockCount": 3,
    "images": [
      "/uploads/gold-royal-bridal-trousseau-choker-1.webp",
      "/uploads/gold-royal-bridal-trousseau-choker-2.webp",
      "/uploads/gold-royal-bridal-trousseau-choker-3.webp",
      "/uploads/gold-royal-bridal-trousseau-choker-4.webp"
    ]
  },
  {
    "name": "Sculpted 22K Gold Chur Bangles Pair",
    "slug": "gold-carved-chur-bangles-pair",
    "sku": "AR-GLD-BAN-017",
    "description": "Heavy pair of broad 22K gold Chur bangles showcasing deeply hand-chased floral scrollwork and solid die-stamped hinge closures.",
    "goldPurity": 22,
    "goldWeight": 42,
    "category": "Gold",
    "subCategory": "Bangles",
    "stockCount": 3,
    "images": [
      "/uploads/gold-carved-chur-bangles-pair-1.webp",
      "/uploads/gold-carved-chur-bangles-pair-2.webp",
      "/uploads/gold-carved-chur-bangles-pair-3.webp"
    ]
  },
  {
    "name": "Heritage Peacock 22K Gold Filigree Necklace Set",
    "slug": "gold-peacock-filigree-necklace-set",
    "sku": "AR-GLD-NEC-018",
    "description": "Centuries-old Bengali filigree gold necklace set highlighting twin peacock terminals, delicate floral links, and matching peacock dangle earrings.",
    "goldPurity": 22,
    "goldWeight": 34.5,
    "category": "Gold",
    "subCategory": "Necklace Sets",
    "stockCount": 3,
    "images": [
      "/uploads/gold-peacock-filigree-necklace-set-1.webp",
      "/uploads/gold-peacock-filigree-necklace-set-2.webp",
      "/uploads/gold-peacock-filigree-necklace-set-3.webp"
    ]
  },
  {
    "name": "Artisanal 22K Gold Chandelier Statement Earrings",
    "slug": "gold-chandelier-earrings-pair",
    "sku": "AR-GLD-EAR-019",
    "description": "Artisanal 22K gold statement chandelier earrings designed with tiered filigree arches and swaying gold fringe droplets.",
    "goldPurity": 22,
    "goldWeight": 14.8,
    "category": "Gold",
    "subCategory": "Eartops",
    "stockCount": 3,
    "images": [
      "/uploads/gold-chandelier-earrings-pair-1.webp",
      "/uploads/gold-chandelier-earrings-pair-2.webp",
      "/uploads/gold-chandelier-earrings-pair-3.webp"
    ]
  },
  {
    "name": "Traditional 22K Gold Chandbali Crescent Earrings",
    "slug": "gold-chandbali-crescent-earrings",
    "sku": "AR-GLD-EAR-020",
    "description": "Timeless 22K gold Chandbali crescent earrings showcasing blooming flower centers and rhythmic tassel fringe beads.",
    "goldPurity": 22,
    "goldWeight": 18.2,
    "category": "Gold",
    "subCategory": "Eartops",
    "stockCount": 3,
    "images": [
      "/uploads/gold-chandbali-crescent-earrings-1.webp",
      "/uploads/gold-chandbali-crescent-earrings-2.webp",
      "/uploads/gold-chandbali-crescent-earrings-3.webp",
      "/uploads/gold-chandbali-crescent-earrings-4.webp"
    ]
  },
  {
    "name": "Engraved Peacock 22K Gold Pendant & Chain Set",
    "slug": "gold-peacock-pendant-chain-set",
    "sku": "AR-GLD-PEN-021",
    "description": "Exquisite 22K gold filigree medallion pendant featuring a dancing peacock crest and dangling bell tassel, suspended on an heirloom link chain.",
    "goldPurity": 22,
    "goldWeight": 15.6,
    "category": "Gold",
    "subCategory": "Pendant Sets",
    "stockCount": 3,
    "images": [
      "/uploads/gold-peacock-pendant-chain-set-1.webp",
      "/uploads/gold-peacock-pendant-chain-set-2.webp",
      "/uploads/gold-peacock-pendant-chain-set-3.webp"
    ]
  },
  {
    "name": "Radiant Sunlight 22K Gold Bridal Necklace",
    "slug": "gold-radiant-bridal-necklace",
    "sku": "AR-GLD-NEC-022",
    "description": "Sunburst-inspired 22K gold bridal necklace sculpted with radiating filigree rays and polished gold spears that frame the neckline.",
    "goldPurity": 22,
    "goldWeight": 38,
    "category": "Gold",
    "subCategory": "Necklace Sets",
    "stockCount": 3,
    "images": [
      "/uploads/gold-radiant-bridal-necklace-1.webp",
      "/uploads/gold-radiant-bridal-necklace-2.webp",
      "/uploads/gold-radiant-bridal-necklace-3.webp"
    ]
  },
  {
    "name": "Heirloom 22K Gold Grand Bridal Choker & Earrings",
    "slug": "gold-grand-bridal-choker-set",
    "sku": "AR-GLD-NEC-023",
    "description": "Monumental 22K gold bridal choker with dense filigree latticework, cascading dewdrop tassels, and matching grand earrings.",
    "goldPurity": 22,
    "goldWeight": 56.5,
    "category": "Gold",
    "subCategory": "Necklace Sets",
    "stockCount": 3,
    "images": [
      "/uploads/gold-grand-bridal-choker-set-1.webp",
      "/uploads/gold-grand-bridal-choker-set-2.webp",
      "/uploads/gold-grand-bridal-choker-set-3.webp"
    ]
  },
  {
    "name": "Sculpted 22K Gold Filigree Necklace & Earring Set",
    "slug": "gold-sculpted-filigree-necklace-set",
    "sku": "AR-GLD-NEC-024",
    "description": "Delicately sculpted 22K gold necklace set featuring curving ribbon filigree and sparkling flower cluster pendants.",
    "goldPurity": 22,
    "goldWeight": 32.8,
    "category": "Gold",
    "subCategory": "Necklace Sets",
    "stockCount": 3,
    "images": [
      "/uploads/gold-sculpted-filigree-necklace-set-1.webp",
      "/uploads/gold-sculpted-filigree-necklace-set-2.webp",
      "/uploads/gold-sculpted-filigree-necklace-set-3.webp"
    ]
  },
  {
    "name": "Grand Layered 22K Gold Sitahar Haar & Jhumkas",
    "slug": "gold-royal-layered-sitahar-haar",
    "sku": "AR-GLD-NEC-025",
    "description": "Multi-strand long royal 22K gold Sitahar haar with triple medallions, hand-carved floral links, and matching chandelier jhumkas.",
    "goldPurity": 22,
    "goldWeight": 58.4,
    "category": "Gold",
    "subCategory": "Necklace Sets",
    "stockCount": 3,
    "images": [
      "/uploads/gold-royal-layered-sitahar-haar-1.webp",
      "/uploads/gold-royal-layered-sitahar-haar-2.webp",
      "/uploads/gold-royal-layered-sitahar-haar-3.webp",
      "/uploads/gold-royal-layered-sitahar-haar-4.webp"
    ]
  },
  {
    "name": "Heavy 22K Gold Nakshi Floral Bangles Pair",
    "slug": "gold-heavy-nakshi-bangles-pair",
    "sku": "AR-GLD-BAN-026",
    "description": "Opulent pair of 22K gold Nakshi bridal bangles embossed with sacred floral vines and scalloped imperial borders.",
    "goldPurity": 22,
    "goldWeight": 44.6,
    "category": "Gold",
    "subCategory": "Bangles",
    "stockCount": 3,
    "images": [
      "/uploads/gold-heavy-nakshi-bangles-pair-1.webp",
      "/uploads/gold-heavy-nakshi-bangles-pair-2.webp",
      "/uploads/gold-heavy-nakshi-bangles-pair-3.webp"
    ]
  },
  {
    "name": "Aesthetic 22K Gold Floral Pendant & Earrings Set",
    "slug": "gold-floral-pendant-earrings-set",
    "sku": "AR-GLD-PEN-027",
    "description": "Graceful 22K gold floral pendant and matching drop earrings set accented with multi-strand bead tassels and polished gold floret.",
    "goldPurity": 22,
    "goldWeight": 16.2,
    "category": "Gold",
    "subCategory": "Pendant Sets",
    "stockCount": 3,
    "images": [
      "/uploads/gold-floral-pendant-earrings-set-1.webp",
      "/uploads/gold-floral-pendant-earrings-set-2.webp",
      "/uploads/gold-floral-pendant-earrings-set-3.webp",
      "/uploads/gold-floral-pendant-earrings-set-4.webp"
    ]
  },
  {
    "name": "Cascading Leaf 22K Gold Filigree Necklace Set",
    "slug": "gold-filigree-leaf-necklace-set",
    "sku": "AR-GLD-NEC-028",
    "description": "Contemporary 22K gold necklace and earring set featuring alternating satin-finish and polished filigree leaves.",
    "goldPurity": 22,
    "goldWeight": 28.5,
    "category": "Gold",
    "subCategory": "Necklace Sets",
    "stockCount": 3,
    "images": [
      "/uploads/gold-filigree-leaf-necklace-set-1.webp",
      "/uploads/gold-filigree-leaf-necklace-set-2.webp"
    ]
  },
  {
    "name": "Traditional Bengali 22K Gold Noa Bandha Bangles",
    "slug": "gold-noa-bandha-bridal-bangles",
    "sku": "AR-GLD-NOA-029",
    "description": "Sacred Bengali wedding 22K gold-embossed Noa Bandha bangles paired with hand-cut white conch Sankha and red Pola bracelets.",
    "goldPurity": 22,
    "goldWeight": 12.5,
    "category": "Gold",
    "subCategory": "Noa",
    "stockCount": 3,
    "images": [
      "/uploads/gold-noa-bandha-bridal-bangles-1.webp",
      "/uploads/gold-noa-bandha-bridal-bangles-2.webp"
    ]
  },
  {
    "name": "Sacred Lotus 22K Gold Bridal Necklace Set",
    "slug": "gold-regal-lotus-necklace-set",
    "sku": "AR-GLD-NEC-030",
    "description": "Regal 22K gold necklace set inspired by sacred pond lotuses, featuring hand-textured petal crescents and matching floral ear-hangers.",
    "goldPurity": 22,
    "goldWeight": 35.8,
    "category": "Gold",
    "subCategory": "Necklace Sets",
    "stockCount": 3,
    "images": [
      "/uploads/gold-regal-lotus-necklace-set-1.webp",
      "/uploads/gold-regal-lotus-necklace-set-2.webp",
      "/uploads/gold-regal-lotus-necklace-set-3.webp"
    ]
  },
  {
    "name": "Triple-Strand 22K Gold Peacock Sitahar Haar",
    "slug": "gold-peacock-triple-sitahar-haar",
    "sku": "AR-GLD-NEC-031",
    "description": "Masterpiece triple-strand 22K gold Sitahar necklace with hand-engraved peacock shoulders and graduated temple bead chains.",
    "goldPurity": 22,
    "goldWeight": 62,
    "category": "Gold",
    "subCategory": "Necklace Sets",
    "stockCount": 3,
    "images": [
      "/uploads/gold-peacock-triple-sitahar-haar-1.webp",
      "/uploads/gold-peacock-triple-sitahar-haar-2.webp",
      "/uploads/gold-peacock-triple-sitahar-haar-3.webp"
    ]
  },
  {
    "name": "Pure Handcrafted Silver Filigree Sitahar Necklace",
    "slug": "silver-filigree-sitahar-diya",
    "sku": "AR-SLV-NEC-011",
    "description": "Pure 92.5 handcrafted fine silver filigree sitahar necklace, sculpted with traditional Bengali lace art and centered with sacred emerald and ruby enamel.",
    "goldPurity": 925,
    "goldWeight": 85,
    "category": "Silver",
    "subCategory": "Necklaces",
    "stockCount": 3,
    "images": [
      "/uploads/silver-filigree-sitahar-diya-1.webp",
      "/uploads/silver-filigree-sitahar-diya-2.webp",
      "/uploads/silver-filigree-sitahar-diya-3.webp"
    ]
  },
  {
    "name": "Royal Silver Heritage Sitahar on Heirloom Chest",
    "slug": "silver-royal-necklace-heirloom-box",
    "sku": "AR-SLV-NEC-012",
    "description": "Royal antique silver sitahar necklace draped with tiered silver bells and floral filigree medallion, crafted in pure hallmarked silver.",
    "goldPurity": 925,
    "goldWeight": 92,
    "category": "Silver",
    "subCategory": "Necklaces",
    "stockCount": 3,
    "images": [
      "/uploads/silver-royal-necklace-heirloom-box-1.webp",
      "/uploads/silver-royal-necklace-heirloom-box-2.webp",
      "/uploads/silver-royal-necklace-heirloom-box-3.webp",
      "/uploads/silver-royal-necklace-heirloom-box-4.webp"
    ]
  },
  {
    "name": "Pure Silver Enamel Necklace & Jhumkas Set",
    "slug": "silver-enamel-necklace-earrings-set",
    "sku": "AR-SLV-NEC-013",
    "description": "Fine 92.5 silver necklace and matching chandelier jhumkas set detailed with royal blue and green Meenakari enamel artwork.",
    "goldPurity": 925,
    "goldWeight": 68,
    "category": "Silver",
    "subCategory": "Necklaces",
    "stockCount": 3,
    "images": [
      "/uploads/silver-enamel-necklace-earrings-set-1.webp",
      "/uploads/silver-enamel-necklace-earrings-set-2.webp"
    ]
  },
  {
    "name": "Pure Handcrafted Silver Makara Lion-Head Kadas Pair",
    "slug": "silver-makara-lion-kadas-pair",
    "sku": "AR-SLV-BAN-014",
    "description": "Handcrafted pair of heavy pure silver Makara kadas featuring sculpted lion-head terminals, hand-chased scales, and ruby enamel accents.",
    "goldPurity": 925,
    "goldWeight": 110,
    "category": "Silver",
    "subCategory": "Bangles",
    "stockCount": 3,
    "images": [
      "/uploads/silver-makara-lion-kadas-pair-1.webp",
      "/uploads/silver-makara-lion-kadas-pair-2.webp",
      "/uploads/silver-makara-lion-kadas-pair-3.webp",
      "/uploads/silver-makara-lion-kadas-pair-4.webp"
    ]
  },
  {
    "name": "Heirloom Pure Silver Traditional Saree Necklace",
    "slug": "silver-traditional-necklace-saree",
    "sku": "AR-SLV-NEC-015",
    "description": "Heirloom pure silver traditional festive necklace showcasing triple-tiered filigree arches and shimmering silver droplet tassels.",
    "goldPurity": 925,
    "goldWeight": 76,
    "category": "Silver",
    "subCategory": "Necklaces",
    "stockCount": 3,
    "images": [
      "/uploads/silver-traditional-necklace-saree-1.webp",
      "/uploads/silver-traditional-necklace-saree-2.webp"
    ]
  },
  {
    "name": "Heritage Paisley Filigree Drop Earrings",
    "slug": "heritage-paisley-filigree-earrings",
    "sku": "AR-GLD-ER-002",
    "description": "Intricately woven 22KT gold filigree paisley ear-hangers detailed with granulated drop beads.",
    "goldPurity": 22,
    "goldWeight": 12.4,
    "category": "Gold",
    "subCategory": "Eartops",
    "stockCount": 5,
    "images": [
      "/master_gallery_earring_drop.jpg",
      "/IMG_20260603_191636.png"
    ]
  },
  {
    "name": "Emerald & Diamond Cocktail Ring",
    "slug": "emerald-diamond-cocktail-ring",
    "sku": "AR-DIA-RG-003",
    "description": "Fine 18KT gold cocktail ring set with a brilliant natural Colombian emerald surrounded by a double halo of round brilliant diamonds.",
    "goldPurity": 18,
    "goldWeight": 6.2,
    "diamondCarat": 0.85,
    "diamondClarity": "VVS-VS",
    "category": "Diamond",
    "subCategory": "Rings",
    "stockCount": 2,
    "images": []
  },
  {
    "name": "Minimalist Solitaire Pendant Set",
    "slug": "minimalist-solitaire-pendant-set",
    "sku": "AR-DIA-PD-001",
    "description": "Timeless 18KT white and yellow gold solitaire diamond pendant with a four-prong setting, paired with delicate diamond studs.",
    "goldPurity": 18,
    "goldWeight": 4.8,
    "diamondCarat": 0.65,
    "diamondClarity": "VVS1",
    "category": "Diamond",
    "subCategory": "Chains with Pendant",
    "stockCount": 5,
    "images": [
      "/uploads/diamond_pendant_chain.webp"
    ]
  },
  {
    "name": "Contemporary Multi-Row Diamond Choker",
    "slug": "contemporary-multi-row-diamond-choker",
    "sku": "AR-DIA-NK-002",
    "description": "Striking 18KT white gold multi-tier choker meticulously encrusted with certified natural brilliant-cut diamonds.",
    "goldPurity": 18,
    "goldWeight": 28.5,
    "diamondCarat": 2.45,
    "diamondClarity": "VVS",
    "category": "Diamond",
    "subCategory": "Chains with Pendant",
    "stockCount": 1,
    "images": []
  },
  {
    "name": "Artisanal Silver Filigree Bangle Pair",
    "slug": "artisanal-silver-filigree-bangles",
    "sku": "AR-SLV-BG-001",
    "description": "Pair of pure 92.5 sterling silver filigree bangles hand-woven in open lattice patterns with a smooth anti-tarnish protective finish.",
    "goldPurity": 925,
    "goldWeight": 48,
    "category": "Silver",
    "subCategory": "Bangles",
    "stockCount": 4,
    "images": []
  },
  {
    "name": "Silver Crown Adjustable Solitaire Ring",
    "slug": "silver-crown-adjustable-solitaire-ring",
    "sku": "AR-SLV-RG-002",
    "description": "Charming 92.5 hallmark sterling silver adjustable ring with a royal tiara crest and shimmering solitaire gemstone.",
    "goldPurity": 925,
    "goldWeight": 4.5,
    "category": "Silver",
    "subCategory": "Rings",
    "stockCount": 7,
    "images": []
  },
  {
    "name": "Flawless Solitaire Wave Diamond Mangalsutra Necklace",
    "slug": "flawless-solitaire-wave-diamond-mangalsutra-necklace",
    "sku": "AR-DIA-NEC-011",
    "description": "Contemporary 18K yellow gold wave pendant crowned with a certified brilliant-cut solitaire diamond on a double black-bead mangalsutra chain.",
    "goldPurity": 18,
    "goldWeight": 7.8,
    "diamondCarat": 0.75,
    "diamondClarity": "VVS-VS",
    "diamondColor": "F-G",
    "category": "Diamond",
    "subCategory": "Necklaces",
    "stockCount": 3,
    "images": [
      "/uploads/diamond-wave-solitaire-mangalsutra-1.webp",
      "/uploads/diamond-wave-solitaire-mangalsutra-2.webp",
      "/uploads/diamond-wave-solitaire-mangalsutra-3.webp"
    ]
  },
  {
    "name": "Regal Floral Arch Diamond Mangalsutra Necklace",
    "slug": "regal-floral-arch-diamond-mangalsutra-necklace",
    "sku": "AR-DIA-NEC-012",
    "description": "Intricately crafted floral arch diamond pendant suspended from auspicious traditional black beads and 18K yellow gold links.",
    "goldPurity": 18,
    "goldWeight": 9.4,
    "diamondCarat": 1.15,
    "diamondClarity": "VVS1",
    "diamondColor": "E-F",
    "category": "Diamond",
    "subCategory": "Necklaces",
    "stockCount": 2,
    "images": [
      "/uploads/diamond-regal-floral-arch-mangalsutra-1.webp",
      "/uploads/diamond-regal-floral-arch-mangalsutra-2.webp",
      "/uploads/diamond-regal-floral-arch-mangalsutra-3.webp"
    ]
  },
  {
    "name": "Modern Bypass Solitaire Diamond Engagement Ring",
    "slug": "modern-bypass-solitaire-diamond-engagement-ring",
    "sku": "AR-DIA-RNG-013",
    "description": "Graceful bypass swirl band in polished 18K yellow gold cradling a brilliant round solitaire diamond in a secure tension setting.",
    "goldPurity": 18,
    "goldWeight": 4.2,
    "diamondCarat": 0.65,
    "diamondClarity": "VVS2",
    "diamondColor": "F-G",
    "category": "Diamond",
    "subCategory": "Rings",
    "stockCount": 4,
    "images": [
      "/uploads/diamond-bypass-solitaire-ring-1.webp",
      "/uploads/diamond-bypass-solitaire-ring-2.webp",
      "/uploads/diamond-bypass-solitaire-ring-3.webp",
      "/uploads/diamond-bypass-solitaire-ring-4.webp"
    ]
  },
  {
    "name": "Artisanal Floral Filigree Swirl Diamond Ring",
    "slug": "artisanal-floral-filigree-swirl-diamond-ring",
    "sku": "AR-DIA-RNG-014",
    "description": "Delicate flower swirl ring set with round brilliant diamonds along an open filigree shank in hallmarked 18K gold.",
    "goldPurity": 18,
    "goldWeight": 5.1,
    "diamondCarat": 0.85,
    "diamondClarity": "VS1",
    "diamondColor": "G-H",
    "category": "Diamond",
    "subCategory": "Rings",
    "stockCount": 3,
    "images": [
      "/uploads/diamond-floral-filigree-swirl-ring-1.webp",
      "/uploads/diamond-floral-filigree-swirl-ring-2.webp",
      "/uploads/diamond-floral-filigree-swirl-ring-3.webp"
    ]
  },
  {
    "name": "Open Heart Solitaire Diamond Kada Bangle",
    "slug": "open-heart-solitaire-diamond-kada-bangle",
    "sku": "AR-DIA-BAN-015",
    "description": "Romantic open heart centerpiece studded with pave diamonds and a floating solitaire on a sleek 18K solid gold kada band.",
    "goldPurity": 18,
    "goldWeight": 14.5,
    "diamondCarat": 0.92,
    "diamondClarity": "VVS-VS",
    "diamondColor": "F-G",
    "category": "Diamond",
    "subCategory": "Bangles",
    "stockCount": 2,
    "images": [
      "/uploads/diamond-open-heart-solitaire-bangle-1.webp",
      "/uploads/diamond-open-heart-solitaire-bangle-2.webp",
      "/uploads/diamond-open-heart-solitaire-bangle-3.webp"
    ]
  },
  {
    "name": "Marquise Blossom Cluster Diamond Bangle",
    "slug": "marquise-blossom-cluster-diamond-bangle",
    "sku": "AR-DIA-BAN-016",
    "description": "Radiant blossom cluster composed of natural marquise and brilliant-cut diamonds on an articulated 18K yellow gold bangle.",
    "goldPurity": 18,
    "goldWeight": 16.2,
    "diamondCarat": 1.45,
    "diamondClarity": "VVS2",
    "diamondColor": "E-F",
    "category": "Diamond",
    "subCategory": "Bangles",
    "stockCount": 2,
    "images": [
      "/uploads/diamond-marquise-blossom-cluster-bangle-1.webp",
      "/uploads/diamond-marquise-blossom-cluster-bangle-2.webp",
      "/uploads/diamond-marquise-blossom-cluster-bangle-3.webp"
    ]
  },
  {
    "name": "Entwined Triple Heart Diamond Bangle Bracelet",
    "slug": "entwined-triple-heart-diamond-bangle-bracelet",
    "sku": "AR-DIA-BAN-017",
    "description": "Three interlocking heart motifs pavé-encrusted with sparkling diamonds, transitioning into an ergonomic flexible 18K gold bangle.",
    "goldPurity": 18,
    "goldWeight": 15.8,
    "diamondCarat": 1.2,
    "diamondClarity": "VS1",
    "diamondColor": "F-G",
    "category": "Diamond",
    "subCategory": "Bangles",
    "stockCount": 2,
    "images": [
      "/uploads/diamond-entwined-triple-heart-bangle-1.webp",
      "/uploads/diamond-entwined-triple-heart-bangle-2.webp",
      "/uploads/diamond-entwined-triple-heart-bangle-3.webp",
      "/uploads/diamond-entwined-triple-heart-bangle-4.webp"
    ]
  },
  {
    "name": "Butterfly Petal Marquise Diamond Bangle",
    "slug": "butterfly-petal-marquise-diamond-bangle",
    "sku": "AR-DIA-BAN-018",
    "description": "Whimsical butterfly wings composed of fine marquise diamonds nestled alongside shimmering round accents in 18K yellow gold.",
    "goldPurity": 18,
    "goldWeight": 14.8,
    "diamondCarat": 1.3,
    "diamondClarity": "VVS-VS",
    "diamondColor": "E-F",
    "category": "Diamond",
    "subCategory": "Bangles",
    "stockCount": 2,
    "images": [
      "/uploads/diamond-butterfly-petal-marquise-bangle-1.webp",
      "/uploads/diamond-butterfly-petal-marquise-bangle-2.webp",
      "/uploads/diamond-butterfly-petal-marquise-bangle-3.webp"
    ]
  },
  {
    "name": "Four-Leaf Clover Filigree Diamond Bangle Bracelet",
    "slug": "four-leaf-clover-filigree-diamond-bangle-bracelet",
    "sku": "AR-DIA-BAN-019",
    "description": "Auspicious four-leaf clover medallion accented with round brilliant diamonds and beaded gold filigree on a hinged 18K gold bangle.",
    "goldPurity": 18,
    "goldWeight": 17.2,
    "diamondCarat": 1.1,
    "diamondClarity": "VVS2",
    "diamondColor": "F-G",
    "category": "Diamond",
    "subCategory": "Bangles",
    "stockCount": 2,
    "images": [
      "/uploads/diamond-four-leaf-clover-filigree-bangle-1.webp",
      "/uploads/diamond-four-leaf-clover-filigree-bangle-2.webp",
      "/uploads/diamond-four-leaf-clover-filigree-bangle-3.webp"
    ]
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
      phone: "298 1506",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Aranyak+Jewellers+B.+Chowmuhani,+M.B,+Motor+Stand+Rd,+near+Kamaan+Chowmuhani,+Dhaleswar,+Agartala,+Tripura+799001",
      isActive: true,
      order: 0,
    },
    {
      name: "Dharmanagar Branch",
      address: "DNV Road, Power House Quater Complex, Dharmanagar, Tripura 799250, India",
      phone: "235 336",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=ARANYAK+JEWELLERS%2C+DNV+Road%2C+Dharmanagar%2C+Tripura+799250",
      isActive: true,
      order: 1,
    },
    {
      name: "Kailashahar Branch",
      address: "GIRLS SCHOOL ROAD, Kailashahar, Tripura 799277",
      phone: "232 323",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Aranyak+Jewellers+GIRLS+SCHOOL+ROAD,+Kailashahar,+Tripura+799277",
      isActive: true,
      order: 2,
    },
    {
      name: "Khowai Branch",
      address: "3J93+FHJ Subhash Park, Suhash Park, Khowai, Tripura 799202",
      phone: "222 379",
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
