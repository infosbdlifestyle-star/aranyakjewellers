/**
 * Aaranyak Jewellers - Verified Master Catalogue
 * Comprehensive, verified luxury jewellery collection for Gold, Diamond, and Silver.
 */

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'Gold' | 'Diamond' | 'Silver' | 'Astrological Stones';
  subCategory: string;
  categorySlug: 'gold' | 'diamond' | 'silver' | 'astrological-stones';
  subCategorySlug: string;
  goldPurity: number; // 22, 18, or 925 for silver
  goldWeight: number; // in grams
  diamondClarity?: string;
  diamondCarat?: number;
  tags: string[];
  images: string[];
  coverImage?: string;
  stockCount: number;
  sku: string;
  isActive: boolean;
  isFeatured?: boolean;
  pricing?: {
    goldRate?: number;
    components?: {
      goldValue: number;
      makingCharges: number;
      gst: number;
    };
    finalPrice: number;
  };
}

export const VERIFIED_PRODUCTS: ProductItem[] = [
  // ==========================================
  // 1. GOLD COLLECTION (22KT BIS 916)
  // ==========================================
  {
    id: "prod-gld-1",
    name: "Royal Heritage Bridal Choker",
    slug: "royal-heritage-bridal-choker",
    description: "An opulent 22KT BIS 916 hallmarked bridal choker set with cascading filigree drops, delicate pearls, and matching chandelier earrings.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Necklace Sets",
    subCategorySlug: "necklace-sets",
    goldPurity: 22,
    goldWeight: 45.5,
    tags: ["Bridal Trousseau", "22KT BIS 916", "Filigree", "Royal"],
    images: ["/hero-necklace.png", "/master_gallery_royal_set.jpg"],
    stockCount: 2,
    sku: "AR-GLD-NK-001",
    isActive: true,
    isFeatured: true,
    pricing: {
      finalPrice: 345000,
      components: { goldValue: 318500, makingCharges: 18000, gst: 8500 }
    }
  },
  {
    id: "prod-gld-2",
    name: "Artisanal Peacock & Leaf Gold Choker",
    slug: "artisanal-peacock-leaf-gold-choker",
    description: "Intricate hand-embossed peacock motifs interwoven with traditional Bengali Tarakasi filigree leaf lace.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Necklace Sets",
    subCategorySlug: "necklace-sets",
    goldPurity: 22,
    goldWeight: 38.2,
    tags: ["Heritage", "22KT Gold", "Handcrafted", "Peacock"],
    images: ["/master_gallery_necklace_closeup.jpg", "/hero-banner.png"],
    stockCount: 3,
    sku: "AR-GLD-NK-002",
    isActive: true,
    isFeatured: true,
    pricing: {
      finalPrice: 289000,
      components: { goldValue: 267400, makingCharges: 14500, gst: 7100 }
    }
  },
  {
    id: "prod-gld-3",
    name: "Grand Bengali Sitahar Haar",
    slug: "grand-bengali-sitahar-haar",
    description: "Multi-layered long royal Sitahar necklace showcasing ornate gold medallions and hand-polished spherical beads.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Necklace Sets",
    subCategorySlug: "necklace-sets",
    goldPurity: 22,
    goldWeight: 52.0,
    tags: ["Royal Bridal", "Sitahar", "Long Necklace", "Traditional"],
    images: ["/IMG_20260603_130220.png", "/master_gallery_royal_set.jpg"],
    stockCount: 1,
    sku: "AR-GLD-NK-003",
    isActive: true,
    pricing: {
      finalPrice: 395000,
      components: { goldValue: 364000, makingCharges: 21000, gst: 10000 }
    }
  },
  {
    id: "prod-gld-4",
    name: "Antiquity Peacock Gold Pendant & Chain",
    slug: "antiquity-peacock-gold-pendant",
    description: "Sculpted antique finish gold medallion engraved with divine peacocks, suspended on a 22KT solid link chain.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Pendant Sets",
    subCategorySlug: "pendant-sets",
    goldPurity: 22,
    goldWeight: 14.5,
    tags: ["Antique", "Pendant", "Daily Luxury", "22KT"],
    images: ["/IMG_20260603_130343.png", "/master_gallery_heirloom_box.jpg"],
    stockCount: 4,
    sku: "AR-GLD-PD-001",
    isActive: true,
    pricing: {
      finalPrice: 110500,
      components: { goldValue: 101500, makingCharges: 6200, gst: 2800 }
    }
  },
  {
    id: "prod-gld-5",
    name: "Antique Floral Carved Gold Lady's Ring",
    slug: "antique-floral-carved-gold-ring",
    description: "Graceful open-work blooming floral statement ring in high-polish 22KT hallmarked gold.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Lady's Rings",
    subCategorySlug: "ladys-rings",
    goldPurity: 22,
    goldWeight: 6.8,
    tags: ["Lady Ring", "Floral", "22KT", "Cocktail"],
    images: ["/IMG_20260603_134643.png", "/master_gallery_vintage_earrings.jpg"],
    stockCount: 6,
    sku: "AR-GLD-LR-001",
    isActive: true,
    pricing: {
      finalPrice: 51800,
      components: { goldValue: 47600, makingCharges: 2900, gst: 1300 }
    }
  },
  {
    id: "prod-gld-6",
    name: "Traditional Royal Lion Gent's Signet Ring",
    slug: "traditional-royal-lion-gents-ring",
    description: "Solid 22KT gold signet ring featuring a boldly embossed lion emblem and geometric satin-finished borders.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Gent's Rings",
    subCategorySlug: "gents-rings",
    goldPurity: 22,
    goldWeight: 9.4,
    tags: ["Gent Ring", "Signet", "Royal", "Solid Gold"],
    images: ["/IMG_20260603_133507.png"],
    stockCount: 4,
    sku: "AR-GLD-GR-001",
    isActive: true,
    pricing: {
      finalPrice: 71500,
      components: { goldValue: 65800, makingCharges: 3900, gst: 1800 }
    }
  },
  {
    id: "prod-gld-7",
    name: "Royal Peacock Jhumka",
    slug: "royal-peacock-jhumka",
    description: "Exquisite hand-enamelled gold earrings with bell jhumka domes and delicate micro-bead fringe.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Eartops",
    subCategorySlug: "eartops",
    goldPurity: 22,
    goldWeight: 18.2,
    tags: ["Eartops", "Jhumka", "Bridal", "22KT"],
    images: ["/featured-earrings.png", "/master_gallery_earring_drop.jpg"],
    stockCount: 2,
    sku: "AR-GLD-ER-001",
    isActive: true,
    pricing: {
      finalPrice: 138500,
      components: { goldValue: 127400, makingCharges: 7600, gst: 3500 }
    }
  },
  {
    id: "prod-gld-8",
    name: "Heritage Paisley Filigree Drop Earrings",
    slug: "heritage-paisley-filigree-drop-earrings",
    description: "Handcrafted traditional gold drop earrings with delicate leaf motifs and intricate filigree paisley art.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Eartops",
    subCategorySlug: "eartops",
    goldPurity: 22,
    goldWeight: 12.5,
    tags: ["Drop Earrings", "Filigree", "Paisley", "Bespoke"],
    images: ["/master_gallery_earring_drop.jpg", "/featured-earrings.png"],
    stockCount: 3,
    sku: "AR-GLD-ER-002",
    isActive: true,
    pricing: {
      finalPrice: 95500,
      components: { goldValue: 87500, makingCharges: 5500, gst: 2500 }
    }
  },
  {
    id: "prod-gld-9",
    name: "Sacred Iconography Nakshi Kada",
    slug: "sacred-iconography-nakshi-kada",
    description: "Heavy solid 22KT gold temple kada bangle embossed with sacred iconography by master Bengali craftsmen.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Bangles",
    subCategorySlug: "bangles",
    goldPurity: 22,
    goldWeight: 32.5,
    tags: ["Temple Kada", "Nakshi", "Solid Gold", "Bangles"],
    images: ["/IMG_20260603_123905.png", "/gold_temple_nakshi.jpg"],
    stockCount: 2,
    sku: "AR-GLD-BG-001",
    isActive: true,
    isFeatured: true,
    pricing: {
      finalPrice: 247000,
      components: { goldValue: 227500, makingCharges: 13500, gst: 6000 }
    }
  },
  {
    id: "prod-gld-10",
    name: "Bengali Heirloom Filigree Bala Bangles (Pair)",
    slug: "bengali-heirloom-filigree-bala-bangles",
    description: "Traditional Bengali gold Balas with ornate floral terminals and hand-carved leaf bands. Sold as a pair.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Bangles",
    subCategorySlug: "bangles",
    goldPurity: 22,
    goldWeight: 24.0,
    tags: ["Bala", "Bengali Tradition", "Pair", "Filigree"],
    images: ["/IMG_20260603_133127.png"],
    stockCount: 2,
    sku: "AR-GLD-BG-002",
    isActive: true,
    pricing: {
      finalPrice: 182500,
      components: { goldValue: 168000, makingCharges: 10000, gst: 4500 }
    }
  },
  {
    id: "prod-gld-11",
    name: "Traditional Gold Sankha & Pola Bandha (Noa)",
    slug: "traditional-gold-noa-bandha",
    description: "Hand-wrapped 22KT gold wire framing an auspicious iron core, featuring diamond-cut leaf accents.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Noa",
    subCategorySlug: "noa",
    goldPurity: 22,
    goldWeight: 8.5,
    tags: ["Noa", "Bengali Bridal", "Auspicious", "Daily Wear"],
    images: ["/IMG_20260603_133228.png"],
    stockCount: 5,
    sku: "AR-GLD-NOA-001",
    isActive: true,
    pricing: {
      finalPrice: 64800,
      components: { goldValue: 59500, makingCharges: 3700, gst: 1600 }
    }
  },
  {
    id: "prod-gld-12",
    name: "Solid Gold Link Chain (Biswa)",
    slug: "solid-gold-link-chain-biswa",
    description: "Sturdy interlocking BIS 916 hallmarked link chain suitable for everyday wear with or without pendants.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Chains",
    subCategorySlug: "chains",
    goldPurity: 22,
    goldWeight: 16.0,
    tags: ["Chains", "22KT", "Unisex", "Solid Gold"],
    images: ["/IMG_20260603_134842.png"],
    stockCount: 4,
    sku: "AR-GLD-CH-001",
    isActive: true,
    pricing: {
      finalPrice: 121900,
      components: { goldValue: 112000, makingCharges: 6900, gst: 3000 }
    }
  },
  {
    id: "prod-gld-13",
    name: "Auspicious Floral Gold Rakhi Bracelet",
    slug: "auspicious-floral-gold-rakhi",
    description: "Sacred Om and floral engraved gold medallion convertible into a timeless lifestyle bracelet.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Rakhi",
    subCategorySlug: "rakhi",
    goldPurity: 22,
    goldWeight: 4.8,
    tags: ["Rakhi", "Auspicious", "Gold Bracelet", "Gift"],
    images: ["/IMG_20260603_141310.png"],
    stockCount: 7,
    sku: "AR-GLD-RK-001",
    isActive: true,
    pricing: {
      finalPrice: 36800,
      components: { goldValue: 33600, makingCharges: 2300, gst: 900 }
    }
  },
  {
    id: "prod-gld-14",
    name: "Artisanal Byzantine Gold Bracelet",
    slug: "artisanal-byzantine-gold-bracelet",
    description: "Flexible handcrafted Byzantine chain links with safety box clasp and satin gold highlights.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Bracelets",
    subCategorySlug: "bracelets",
    goldPurity: 22,
    goldWeight: 15.2,
    tags: ["Bracelets", "22KT", "Luxury", "Evening Wear"],
    images: ["/IMG_20260603_132136.png"],
    stockCount: 3,
    sku: "AR-GLD-BR-001",
    isActive: true,
    pricing: {
      finalPrice: 115900,
      components: { goldValue: 106400, makingCharges: 6600, gst: 2900 }
    }
  },

  // ==========================================
  // 2. DIAMOND COLLECTION (18KT / IGI & GIA)
  // ==========================================
  {
    id: "prod-dia-1",
    name: "Imperial Solitaire & Ruby Halo Necklace",
    slug: "imperial-solitaire-ruby-necklace",
    description: "Precision-cut certified natural diamonds (1.25 ct total weight, VVS clarity) encircled by deep vivid Burmese rubies in 18KT white gold.",
    category: "Diamond",
    categorySlug: "diamond",
    subCategory: "Chains with Pendant",
    subCategorySlug: "chains-with-pendant",
    goldPurity: 18,
    goldWeight: 22.0,
    diamondClarity: "VVS-VS",
    diamondCarat: 1.25,
    tags: ["Haute Joaillerie", "Certified", "Ruby Halo", "Solitaire"],
    images: ["/diamond_pendant_chain.jpg", "/hero-necklace.png"],
    stockCount: 1,
    sku: "AR-DIA-NK-001",
    isActive: true,
    isFeatured: true,
    pricing: {
      finalPrice: 285000,
      components: { goldValue: 130000, makingCharges: 25000, gst: 7000 }
    }
  },
  {
    id: "prod-dia-2",
    name: "Radiant Solitaire Engagement Ring",
    slug: "radiant-solitaire-engagement-ring",
    description: "Flawless 1.02 ct round brilliant diamond set in a signature 6-prong platinum crown on an 18KT yellow gold band.",
    category: "Diamond",
    categorySlug: "diamond",
    subCategory: "Rings",
    subCategorySlug: "rings",
    goldPurity: 18,
    goldWeight: 3.8,
    diamondClarity: "VVS1 (GIA Certified)",
    diamondCarat: 1.02,
    tags: ["Solitaire", "Engagement", "GIA", "18KT"],
    images: ["/diamond_solitaire_ring.jpg", "/IMG_20260603_125514.png"],
    stockCount: 2,
    sku: "AR-DIA-RG-001",
    isActive: true,
    isFeatured: true,
    pricing: {
      finalPrice: 245000,
      components: { goldValue: 22500, makingCharges: 18000, gst: 6000 }
    }
  },
  {
    id: "prod-dia-3",
    name: "Eternal Diamond Eternity Band",
    slug: "eternal-diamond-eternity-band",
    description: "Continuous circle of micro-pavé diamonds (0.65 ct total) set in delicate 18KT rose gold for effortless stackable glamour.",
    category: "Diamond",
    categorySlug: "diamond",
    subCategory: "Rings",
    subCategorySlug: "rings",
    goldPurity: 18,
    goldWeight: 4.2,
    diamondClarity: "VS-SI",
    diamondCarat: 0.65,
    tags: ["Eternity Band", "Rose Gold", "Stackable", "Daily Luxury"],
    images: ["/diamond_solitaire_ring.jpg"],
    stockCount: 4,
    sku: "AR-DIA-RG-002",
    isActive: true,
    pricing: {
      finalPrice: 68500,
      components: { goldValue: 25000, makingCharges: 7500, gst: 1700 }
    }
  },
  {
    id: "prod-dia-4",
    name: "Emerald & Diamond Cocktail Ring",
    slug: "emerald-diamond-cocktail-ring",
    description: "Natural deep-green Zambian emerald framed by two tiers of baguette and brilliant-cut certified diamonds.",
    category: "Diamond",
    categorySlug: "diamond",
    subCategory: "Rings",
    subCategorySlug: "rings",
    goldPurity: 18,
    goldWeight: 6.5,
    diamondClarity: "VVS",
    diamondCarat: 0.85,
    tags: ["Emerald", "Cocktail Ring", "Collector", "18KT"],
    images: ["/IMG_20260603_125514.png", "/stone_emerald_panna.jpg"],
    stockCount: 1,
    sku: "AR-DIA-RG-003",
    isActive: true,
    pricing: {
      finalPrice: 195000,
      components: { goldValue: 38500, makingCharges: 15000, gst: 4800 }
    }
  },
  {
    id: "prod-dia-5",
    name: "Cascading Diamond Floral Drop Earrings",
    slug: "cascading-diamond-floral-drop-earrings",
    description: "Graceful floral clusters suspended on diamond line drops, articulating softly with every movement.",
    category: "Diamond",
    categorySlug: "diamond",
    subCategory: "Earrings",
    subCategorySlug: "earrings",
    goldPurity: 18,
    goldWeight: 9.8,
    diamondClarity: "VVS-VS",
    diamondCarat: 1.80,
    tags: ["Earrings", "Diamond Drop", "Red Carpet", "White Gold"],
    images: ["/IMG_20260603_141216.png", "/featured-earrings.png"],
    stockCount: 2,
    sku: "AR-DIA-ER-001",
    isActive: true,
    pricing: {
      finalPrice: 175000,
      components: { goldValue: 58000, makingCharges: 16000, gst: 4300 }
    }
  },
  {
    id: "prod-dia-6",
    name: "Minimalist Solitaire Pendant Set",
    slug: "minimalist-solitaire-pendant-set",
    description: "Classic bezel-set round diamond (0.50 ct, IGI certified) with matching minimalist solitaire stud earrings.",
    category: "Diamond",
    categorySlug: "diamond",
    subCategory: "Chains with Pendant",
    subCategorySlug: "chains-with-pendant",
    goldPurity: 18,
    goldWeight: 5.6,
    diamondClarity: "IGI Certified VS1",
    diamondCarat: 0.50,
    tags: ["Pendant", "Solitaire", "Everyday Wear", "IGI"],
    images: ["/IMG_20260603_130513.png", "/diamond_pendant_chain.jpg"],
    stockCount: 3,
    sku: "AR-DIA-PD-001",
    isActive: true,
    pricing: {
      finalPrice: 88000,
      components: { goldValue: 33000, makingCharges: 9000, gst: 2200 }
    }
  },
  {
    id: "prod-dia-7",
    name: "Traditional Diamond Nosepin (Mookuthi)",
    slug: "traditional-diamond-nosepin",
    description: "Classic 7-stone diamond floral nosepin in 18KT yellow gold with traditional screw-back fitting.",
    category: "Diamond",
    categorySlug: "diamond",
    subCategory: "Nosepins",
    subCategorySlug: "nosepins",
    goldPurity: 18,
    goldWeight: 1.1,
    diamondClarity: "VVS",
    diamondCarat: 0.18,
    tags: ["Nosepin", "Mookuthi", "Traditional", "18KT"],
    images: ["/IMG_20260603_135005.png"],
    stockCount: 8,
    sku: "AR-DIA-NP-001",
    isActive: true,
    pricing: {
      finalPrice: 24500,
      components: { goldValue: 6500, makingCharges: 3500, gst: 600 }
    }
  },
  {
    id: "prod-dia-8",
    name: "Contemporary Multi-Row Diamond Choker",
    slug: "contemporary-multi-row-diamond-choker",
    description: "Sleek multi-row flexible diamond choker set in 18KT white gold with brilliant-cut pave halos.",
    category: "Diamond",
    categorySlug: "diamond",
    subCategory: "Chains with Pendant",
    subCategorySlug: "chains-with-pendant",
    goldPurity: 18,
    goldWeight: 28.5,
    diamondClarity: "VVS-VS",
    diamondCarat: 3.20,
    tags: ["Choker", "Haute Joaillerie", "Modern", "White Gold"],
    images: ["/IMG_20260603_130726.png"],
    stockCount: 1,
    sku: "AR-DIA-NK-002",
    isActive: true,
    pricing: {
      finalPrice: 485000,
      components: { goldValue: 168000, makingCharges: 35000, gst: 12000 }
    }
  },

  // ==========================================
  // 3. SILVER COLLECTION (92.5 STERLING SILVER)
  // ==========================================
  {
    id: "prod-slv-1",
    name: "Royal Sterling Silver Hasli Choker",
    slug: "royal-sterling-silver-hasli-choker",
    description: "Authentic 92.5 hallmarked sterling silver rigid Hasli neckpiece featuring fine floral repoussé and oxidized filigree bells.",
    category: "Silver",
    categorySlug: "silver",
    subCategory: "Necklaces",
    subCategorySlug: "necklaces",
    goldPurity: 925,
    goldWeight: 68.0,
    tags: ["92.5 Silver", "Hasli", "Oxidized", "Tribal Royal"],
    images: ["/silver_luxury_necklace.jpg", "/silver_bangles_craft.jpg"],
    stockCount: 4,
    sku: "AR-SLV-NK-001",
    isActive: true,
    isFeatured: true,
    pricing: {
      finalPrice: 18500,
      components: { goldValue: 12500, makingCharges: 4800, gst: 550 }
    }
  },
  {
    id: "prod-slv-2",
    name: "Handcrafted Oxidized Silver Floral Haar",
    slug: "handcrafted-oxidized-silver-floral-haar",
    description: "Multi-strand silver beaded necklace with an ornate mandala pendant and antique dual-tone polish.",
    category: "Silver",
    categorySlug: "silver",
    subCategory: "Necklaces",
    subCategorySlug: "necklaces",
    goldPurity: 925,
    goldWeight: 54.0,
    tags: ["92.5 Silver", "Mandala", "Haar", "Ethnic"],
    images: ["/silver_luxury_necklace.jpg", "/IMG_20260603_141414.png"],
    stockCount: 3,
    sku: "AR-SLV-NK-002",
    isActive: true,
    pricing: {
      finalPrice: 14800,
      components: { goldValue: 9800, makingCharges: 4200, gst: 440 }
    }
  },
  {
    id: "prod-slv-3",
    name: "Artisanal Silver Filigree Bangle Pair",
    slug: "artisanal-silver-filigree-bangles",
    description: "Pair of intricately handcrafted sterling silver bangles in traditional Bengali silver filigree with clasp mechanism.",
    category: "Silver",
    categorySlug: "silver",
    subCategory: "Necklaces",
    subCategorySlug: "necklaces",
    goldPurity: 925,
    goldWeight: 42.0,
    tags: ["92.5 Silver", "Bangles", "Filigree", "Pair"],
    images: ["/silver_bangles_craft.jpg", "/silver_luxury_necklace.jpg"],
    stockCount: 5,
    sku: "AR-SLV-BG-001",
    isActive: true,
    pricing: {
      finalPrice: 12200,
      components: { goldValue: 8000, makingCharges: 3500, gst: 360 }
    }
  },
  {
    id: "prod-slv-4",
    name: "Tribal Carved Silver Statement Ring",
    slug: "tribal-carved-silver-statement-ring",
    description: "Bold circular mirror-work silver ring crowned with oxidized granulation and tribal floral carvings.",
    category: "Silver",
    categorySlug: "silver",
    subCategory: "Rings",
    subCategorySlug: "rings",
    goldPurity: 925,
    goldWeight: 14.5,
    tags: ["92.5 Silver", "Statement Ring", "Tribal", "Oxidized"],
    images: ["/silver_rings_luxury.jpg"],
    stockCount: 6,
    sku: "AR-SLV-RG-001",
    isActive: true,
    pricing: {
      finalPrice: 4200,
      components: { goldValue: 2600, makingCharges: 1400, gst: 120 }
    }
  },
  {
    id: "prod-slv-5",
    name: "Silver Crown Adjustable Solitaire Ring",
    slug: "silver-crown-adjustable-solitaire-ring",
    description: "925 hallmarked rhodium-plated sterling silver band set with a brilliant sparkling cubic zirconia crown.",
    category: "Silver",
    categorySlug: "silver",
    subCategory: "Rings",
    subCategorySlug: "rings",
    goldPurity: 925,
    goldWeight: 6.2,
    tags: ["92.5 Silver", "Rhodium", "Solitaire", "Adjustable"],
    images: ["/silver_rings_luxury.jpg"],
    stockCount: 8,
    sku: "AR-SLV-RG-002",
    isActive: true,
    pricing: {
      finalPrice: 2800,
      components: { goldValue: 1500, makingCharges: 1100, gst: 80 }
    }
  },
  {
    id: "prod-slv-6",
    name: "Traditional Silver Mookuthi Nosepin",
    slug: "traditional-silver-mookuthi-nosepin",
    description: "Handmade sterling silver clip-on / pierced nosepin accented with tribal ball clusters and antique patina.",
    category: "Silver",
    categorySlug: "silver",
    subCategory: "Nosepins",
    subCategorySlug: "nosepins",
    goldPurity: 925,
    goldWeight: 2.8,
    tags: ["92.5 Silver", "Nosepin", "Ethnic", "Antique"],
    images: ["/silver_nosepin_luxury.jpg"],
    stockCount: 12,
    sku: "AR-SLV-NP-001",
    isActive: true,
    pricing: {
      finalPrice: 1150,
      components: { goldValue: 550, makingCharges: 520, gst: 35 }
    }
  },
  {
    id: "prod-slv-7",
    name: "Auspicious Handcrafted Silver Rakhi Bracelet",
    slug: "auspicious-handcrafted-silver-rakhi",
    description: "Pure 92.5 silver filigree motif mounted on a braided soft silk thread with silver extension chain.",
    category: "Silver",
    categorySlug: "silver",
    subCategory: "Rakhi",
    subCategorySlug: "rakhi",
    goldPurity: 925,
    goldWeight: 8.5,
    tags: ["92.5 Silver", "Rakhi", "Auspicious", "Silk Thread"],
    images: ["/silver_rakhi_luxury.jpg"],
    stockCount: 15,
    sku: "AR-SLV-RK-001",
    isActive: true,
    pricing: {
      finalPrice: 2400,
      components: { goldValue: 1400, makingCharges: 900, gst: 70 }
    }
  },
  {
    id: "prod-slv-8",
    name: "Antique Silver Jhumka with Pearl Drops",
    slug: "antique-silver-jhumka-pearls",
    description: "Oxidized sterling silver temple jhumkas featuring delicate floral filigree and freshwater seed pearls.",
    category: "Silver",
    categorySlug: "silver",
    subCategory: "Necklaces",
    subCategorySlug: "necklaces",
    goldPurity: 925,
    goldWeight: 24.0,
    tags: ["92.5 Silver", "Jhumka", "Pearls", "Temple Art"],
    images: ["/silver_luxury_necklace.jpg", "/featured-earrings.png"],
    stockCount: 4,
    sku: "AR-SLV-ER-001",
    isActive: true,
    pricing: {
      finalPrice: 7500,
      components: { goldValue: 4600, makingCharges: 2600, gst: 220 }
    }
  },

  // ==========================================
  // GOOGLE DRIVE OFFICIAL IMPORTS (GOLD & SILVER)
  // ==========================================
  {
    id: "gdrive-gld-1",
    name: "Handcrafted 22K Gold Filigree Bala Bangles Pair",
    slug: "gold-bala-filigree-pair",
    description: "An exceptional pair of traditional Bengali 22K BIS hallmarked gold Balas adorned with intricate Mayur peacock filigree and polished wire craftsmanship.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Bangles",
    subCategorySlug: "bangles",
    goldPurity: 22,
    goldWeight: 36.4,
    tags: ["22KT BIS 916", "Traditional Bala", "Bridal", "Bengali Karigari"],
    images: ["/uploads/gold-bala-filigree-pair-1.webp", "/uploads/gold-bala-filigree-pair-2.webp", "/uploads/gold-bala-filigree-pair-3.webp", "/uploads/gold-bala-filigree-pair-4.webp"],
    coverImage: "/uploads/gold-bala-filigree-pair-1.webp",
    stockCount: 3,
    sku: "AR-GLD-BAN-011",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 275000,
      components: {
        goldValue: 247500,
        makingCharges: 19250,
        gst: 8250
      }
    }
  },
  {
    id: "gdrive-gld-2",
    name: "22K Gold Floral Filigree Ratanchoor Bracelet",
    slug: "gold-ratanchoor-bracelet",
    description: "Grand royal 22K gold Ratanchoor hand ornament featuring an elaborate blooming lotus medallion with delicate connecting gold link chains.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Bracelets",
    subCategorySlug: "bracelets",
    goldPurity: 22,
    goldWeight: 24.8,
    tags: ["Ratanchoor", "Hathphool", "Bridal Luxury", "22KT Gold"],
    images: ["/uploads/gold-ratanchoor-bracelet-1.webp", "/uploads/gold-ratanchoor-bracelet-2.webp", "/uploads/gold-ratanchoor-bracelet-3.webp"],
    coverImage: "/uploads/gold-ratanchoor-bracelet-1.webp",
    stockCount: 3,
    sku: "AR-GLD-BRA-012",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 188000,
      components: {
        goldValue: 169200,
        makingCharges: 13160,
        gst: 5640
      }
    }
  },
  {
    id: "gdrive-gld-3",
    name: "Vintage 22K Gold Filigree Jhumka Drop Earrings",
    slug: "gold-filigree-jhumkas-vintage",
    description: "Handcrafted vintage 22K gold chandelier jhumka drop earrings featuring multi-tiered bell motifs and cascading gold droplets.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Eartops",
    subCategorySlug: "eartops",
    goldPurity: 22,
    goldWeight: 16.5,
    tags: ["Jhumkas", "22KT BIS 916", "Filigree", "Festive Sparkle"],
    images: ["/uploads/gold-filigree-jhumkas-vintage-1.webp", "/uploads/gold-filigree-jhumkas-vintage-2.webp", "/uploads/gold-filigree-jhumkas-vintage-3.webp"],
    coverImage: "/uploads/gold-filigree-jhumkas-vintage-1.webp",
    stockCount: 3,
    sku: "AR-GLD-EAR-013",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 126000,
      components: {
        goldValue: 113400,
        makingCharges: 8820,
        gst: 3780
      }
    }
  },
  {
    id: "gdrive-gld-4",
    name: "Royal 22K Gold Dome Filigree Cocktail Ring",
    slug: "gold-dome-cocktail-ring",
    description: "Majestic royal dome filigree cocktail ring in 22K hallmarked gold, sculpted with an intricate openwork floral dome and beaded borders.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Lady's Rings",
    subCategorySlug: "ladys-rings",
    goldPurity: 22,
    goldWeight: 9.8,
    tags: ["Cocktail Ring", "22KT Gold", "Floral Dome", "Statement Jewel"],
    images: ["/uploads/gold-dome-cocktail-ring-1.webp", "/uploads/gold-dome-cocktail-ring-2.webp", "/uploads/gold-dome-cocktail-ring-3.webp"],
    coverImage: "/uploads/gold-dome-cocktail-ring-1.webp",
    stockCount: 3,
    sku: "AR-GLD-LAD-014",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 76000,
      components: {
        goldValue: 68400,
        makingCharges: 5320,
        gst: 2280
      }
    }
  },
  {
    id: "gdrive-gld-5",
    name: "Opulent 22K Gold Floral Bridal Choker & Jhumkas Set",
    slug: "gold-floral-bridal-choker-set",
    description: "Opulent 22K gold bridal choker necklace set featuring cascading floral medallions, embossed leaf borders, and matching royal jhumka earrings.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Necklace Sets",
    subCategorySlug: "necklace-sets",
    goldPurity: 22,
    goldWeight: 48.6,
    tags: ["Bridal Choker", "22KT BIS 916", "Royal Trousseau", "Complete Set"],
    images: ["/uploads/gold-floral-bridal-choker-set-1.webp", "/uploads/gold-floral-bridal-choker-set-2.webp", "/uploads/gold-floral-bridal-choker-set-3.webp", "/uploads/gold-floral-bridal-choker-set-4.webp"],
    coverImage: "/uploads/gold-floral-bridal-choker-set-1.webp",
    stockCount: 3,
    sku: "AR-GLD-NEC-015",
    isActive: true,
    isFeatured: true,
    pricing: {
      finalPrice: 368000,
      components: {
        goldValue: 331200,
        makingCharges: 25760,
        gst: 11040
      }
    }
  },
  {
    id: "gdrive-gld-6",
    name: "Grand Royal 22K Gold Bridal Trousseau Choker Set",
    slug: "gold-royal-bridal-trousseau-choker",
    description: "Regal Bengali bridal trousseau choker set sculpted with layered gold lace and traditional Nakshi scrollwork, paired with ornate chandelier earrings.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Necklace Sets",
    subCategorySlug: "necklace-sets",
    goldPurity: 22,
    goldWeight: 52.2,
    tags: ["Heritage Bridal", "Royal Choker", "22KT Gold", "Masterpiece"],
    images: ["/uploads/gold-royal-bridal-trousseau-choker-1.webp", "/uploads/gold-royal-bridal-trousseau-choker-2.webp", "/uploads/gold-royal-bridal-trousseau-choker-3.webp", "/uploads/gold-royal-bridal-trousseau-choker-4.webp"],
    coverImage: "/uploads/gold-royal-bridal-trousseau-choker-1.webp",
    stockCount: 3,
    sku: "AR-GLD-NEC-016",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 395000,
      components: {
        goldValue: 355500,
        makingCharges: 27650,
        gst: 11850
      }
    }
  },
  {
    id: "gdrive-gld-7",
    name: "Sculpted 22K Gold Chur Bangles Pair",
    slug: "gold-carved-chur-bangles-pair",
    description: "Heavy pair of broad 22K gold Chur bangles showcasing deeply hand-chased floral scrollwork and solid die-stamped hinge closures.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Bangles",
    subCategorySlug: "bangles",
    goldPurity: 22,
    goldWeight: 42.0,
    tags: ["Chur Bangles", "22KT BIS 916", "Traditional Gold", "Heavy Kadas"],
    images: ["/uploads/gold-carved-chur-bangles-pair-1.webp", "/uploads/gold-carved-chur-bangles-pair-2.webp", "/uploads/gold-carved-chur-bangles-pair-3.webp"],
    coverImage: "/uploads/gold-carved-chur-bangles-pair-1.webp",
    stockCount: 3,
    sku: "AR-GLD-BAN-017",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 318000,
      components: {
        goldValue: 286200,
        makingCharges: 22260,
        gst: 9540
      }
    }
  },
  {
    id: "gdrive-gld-8",
    name: "Heritage Peacock 22K Gold Filigree Necklace Set",
    slug: "gold-peacock-filigree-necklace-set",
    description: "Centuries-old Bengali filigree gold necklace set highlighting twin peacock terminals, delicate floral links, and matching peacock dangle earrings.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Necklace Sets",
    subCategorySlug: "necklace-sets",
    goldPurity: 22,
    goldWeight: 34.5,
    tags: ["Peacock Art", "Filigree", "22KT Gold", "Necklace Set"],
    images: ["/uploads/gold-peacock-filigree-necklace-set-1.webp", "/uploads/gold-peacock-filigree-necklace-set-2.webp", "/uploads/gold-peacock-filigree-necklace-set-3.webp"],
    coverImage: "/uploads/gold-peacock-filigree-necklace-set-1.webp",
    stockCount: 3,
    sku: "AR-GLD-NEC-018",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 262000,
      components: {
        goldValue: 235800,
        makingCharges: 18340,
        gst: 7860
      }
    }
  },
  {
    id: "gdrive-gld-9",
    name: "Artisanal 22K Gold Chandelier Statement Earrings",
    slug: "gold-chandelier-earrings-pair",
    description: "Artisanal 22K gold statement chandelier earrings designed with tiered filigree arches and swaying gold fringe droplets.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Eartops",
    subCategorySlug: "eartops",
    goldPurity: 22,
    goldWeight: 14.8,
    tags: ["Chandeliers", "Evening Elegance", "22KT Gold", "Drop Earrings"],
    images: ["/uploads/gold-chandelier-earrings-pair-1.webp", "/uploads/gold-chandelier-earrings-pair-2.webp", "/uploads/gold-chandelier-earrings-pair-3.webp"],
    coverImage: "/uploads/gold-chandelier-earrings-pair-1.webp",
    stockCount: 3,
    sku: "AR-GLD-EAR-019",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 114000,
      components: {
        goldValue: 102600,
        makingCharges: 7980,
        gst: 3420
      }
    }
  },
  {
    id: "gdrive-gld-10",
    name: "Traditional 22K Gold Chandbali Crescent Earrings",
    slug: "gold-chandbali-crescent-earrings",
    description: "Timeless 22K gold Chandbali crescent earrings showcasing blooming flower centers and rhythmic tassel fringe beads.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Eartops",
    subCategorySlug: "eartops",
    goldPurity: 22,
    goldWeight: 18.2,
    tags: ["Chandbali", "Crescent Moon", "22KT BIS 916", "Festive Elegance"],
    images: ["/uploads/gold-chandbali-crescent-earrings-1.webp", "/uploads/gold-chandbali-crescent-earrings-2.webp", "/uploads/gold-chandbali-crescent-earrings-3.webp", "/uploads/gold-chandbali-crescent-earrings-4.webp"],
    coverImage: "/uploads/gold-chandbali-crescent-earrings-1.webp",
    stockCount: 3,
    sku: "AR-GLD-EAR-020",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 139000,
      components: {
        goldValue: 125100,
        makingCharges: 9730,
        gst: 4170
      }
    }
  },
  {
    id: "gdrive-gld-11",
    name: "Engraved Peacock 22K Gold Pendant & Chain Set",
    slug: "gold-peacock-pendant-chain-set",
    description: "Exquisite 22K gold filigree medallion pendant featuring a dancing peacock crest and dangling bell tassel, suspended on an heirloom link chain.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Pendant Sets",
    subCategorySlug: "pendant-sets",
    goldPurity: 22,
    goldWeight: 15.6,
    tags: ["Pendant Set", "22KT Gold", "Peacock Medallion", "Daily Heritage"],
    images: ["/uploads/gold-peacock-pendant-chain-set-1.webp", "/uploads/gold-peacock-pendant-chain-set-2.webp", "/uploads/gold-peacock-pendant-chain-set-3.webp"],
    coverImage: "/uploads/gold-peacock-pendant-chain-set-1.webp",
    stockCount: 3,
    sku: "AR-GLD-PEN-021",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 119000,
      components: {
        goldValue: 107100,
        makingCharges: 8330,
        gst: 3570
      }
    }
  },
  {
    id: "gdrive-gld-12",
    name: "Radiant Sunlight 22K Gold Bridal Necklace",
    slug: "gold-radiant-bridal-necklace",
    description: "Sunburst-inspired 22K gold bridal necklace sculpted with radiating filigree rays and polished gold spears that frame the neckline.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Necklace Sets",
    subCategorySlug: "necklace-sets",
    goldPurity: 22,
    goldWeight: 38.0,
    tags: ["Sunburst", "Bridal Luxury", "22KT BIS 916", "Royal Trousseau"],
    images: ["/uploads/gold-radiant-bridal-necklace-1.webp", "/uploads/gold-radiant-bridal-necklace-2.webp", "/uploads/gold-radiant-bridal-necklace-3.webp"],
    coverImage: "/uploads/gold-radiant-bridal-necklace-1.webp",
    stockCount: 3,
    sku: "AR-GLD-NEC-022",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 288000,
      components: {
        goldValue: 259200,
        makingCharges: 20160,
        gst: 8640
      }
    }
  },
  {
    id: "gdrive-gld-13",
    name: "Heirloom 22K Gold Grand Bridal Choker & Earrings",
    slug: "gold-grand-bridal-choker-set",
    description: "Monumental 22K gold bridal choker with dense filigree latticework, cascading dewdrop tassels, and matching grand earrings.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Necklace Sets",
    subCategorySlug: "necklace-sets",
    goldPurity: 22,
    goldWeight: 56.5,
    tags: ["Grand Bridal", "22KT Gold", "Choker Set", "Imperial Trousseau"],
    images: ["/uploads/gold-grand-bridal-choker-set-1.webp", "/uploads/gold-grand-bridal-choker-set-2.webp", "/uploads/gold-grand-bridal-choker-set-3.webp"],
    coverImage: "/uploads/gold-grand-bridal-choker-set-1.webp",
    stockCount: 3,
    sku: "AR-GLD-NEC-023",
    isActive: true,
    isFeatured: true,
    pricing: {
      finalPrice: 428000,
      components: {
        goldValue: 385200,
        makingCharges: 29960,
        gst: 12840
      }
    }
  },
  {
    id: "gdrive-gld-14",
    name: "Sculpted 22K Gold Filigree Necklace & Earring Set",
    slug: "gold-sculpted-filigree-necklace-set",
    description: "Delicately sculpted 22K gold necklace set featuring curving ribbon filigree and sparkling flower cluster pendants.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Necklace Sets",
    subCategorySlug: "necklace-sets",
    goldPurity: 22,
    goldWeight: 32.8,
    tags: ["Sculpted Gold", "Necklace Set", "22KT BIS 916", "Fine Filigree"],
    images: ["/uploads/gold-sculpted-filigree-necklace-set-1.webp", "/uploads/gold-sculpted-filigree-necklace-set-2.webp", "/uploads/gold-sculpted-filigree-necklace-set-3.webp"],
    coverImage: "/uploads/gold-sculpted-filigree-necklace-set-1.webp",
    stockCount: 3,
    sku: "AR-GLD-NEC-024",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 249000,
      components: {
        goldValue: 224100,
        makingCharges: 17430,
        gst: 7470
      }
    }
  },
  {
    id: "gdrive-gld-15",
    name: "Grand Layered 22K Gold Sitahar Haar & Jhumkas",
    slug: "gold-royal-layered-sitahar-haar",
    description: "Multi-strand long royal 22K gold Sitahar haar with triple medallions, hand-carved floral links, and matching chandelier jhumkas.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Necklace Sets",
    subCategorySlug: "necklace-sets",
    goldPurity: 22,
    goldWeight: 58.4,
    tags: ["Sitahar", "Long Haar", "22KT Gold", "Royal Bengal Bridal"],
    images: ["/uploads/gold-royal-layered-sitahar-haar-1.webp", "/uploads/gold-royal-layered-sitahar-haar-2.webp", "/uploads/gold-royal-layered-sitahar-haar-3.webp", "/uploads/gold-royal-layered-sitahar-haar-4.webp"],
    coverImage: "/uploads/gold-royal-layered-sitahar-haar-1.webp",
    stockCount: 3,
    sku: "AR-GLD-NEC-025",
    isActive: true,
    isFeatured: true,
    pricing: {
      finalPrice: 442000,
      components: {
        goldValue: 397800,
        makingCharges: 30940,
        gst: 13260
      }
    }
  },
  {
    id: "gdrive-gld-16",
    name: "Heavy 22K Gold Nakshi Floral Bangles Pair",
    slug: "gold-heavy-nakshi-bangles-pair",
    description: "Opulent pair of 22K gold Nakshi bridal bangles embossed with sacred floral vines and scalloped imperial borders.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Bangles",
    subCategorySlug: "bangles",
    goldPurity: 22,
    goldWeight: 44.6,
    tags: ["Nakshi", "Bridal Bangles", "22KT BIS 916", "Heirloom Bala"],
    images: ["/uploads/gold-heavy-nakshi-bangles-pair-1.webp", "/uploads/gold-heavy-nakshi-bangles-pair-2.webp", "/uploads/gold-heavy-nakshi-bangles-pair-3.webp"],
    coverImage: "/uploads/gold-heavy-nakshi-bangles-pair-1.webp",
    stockCount: 3,
    sku: "AR-GLD-BAN-026",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 338000,
      components: {
        goldValue: 304200,
        makingCharges: 23660,
        gst: 10140
      }
    }
  },
  {
    id: "gdrive-gld-17",
    name: "Aesthetic 22K Gold Floral Pendant & Earrings Set",
    slug: "gold-floral-pendant-earrings-set",
    description: "Graceful 22K gold floral pendant and matching drop earrings set accented with multi-strand bead tassels and polished gold floret.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Pendant Sets",
    subCategorySlug: "pendant-sets",
    goldPurity: 22,
    goldWeight: 16.2,
    tags: ["Pendant Set", "Floral Art", "22KT Gold", "Matching Earrings"],
    images: ["/uploads/gold-floral-pendant-earrings-set-1.webp", "/uploads/gold-floral-pendant-earrings-set-2.webp", "/uploads/gold-floral-pendant-earrings-set-3.webp", "/uploads/gold-floral-pendant-earrings-set-4.webp"],
    coverImage: "/uploads/gold-floral-pendant-earrings-set-1.webp",
    stockCount: 3,
    sku: "AR-GLD-PEN-027",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 124000,
      components: {
        goldValue: 111600,
        makingCharges: 8680,
        gst: 3720
      }
    }
  },
  {
    id: "gdrive-gld-18",
    name: "Cascading Leaf 22K Gold Filigree Necklace Set",
    slug: "gold-filigree-leaf-necklace-set",
    description: "Contemporary 22K gold necklace and earring set featuring alternating satin-finish and polished filigree leaves.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Necklace Sets",
    subCategorySlug: "necklace-sets",
    goldPurity: 22,
    goldWeight: 28.5,
    tags: ["Leaf Motifs", "Modern Filigree", "22KT Gold", "Necklace Set"],
    images: ["/uploads/gold-filigree-leaf-necklace-set-1.webp", "/uploads/gold-filigree-leaf-necklace-set-2.webp"],
    coverImage: "/uploads/gold-filigree-leaf-necklace-set-1.webp",
    stockCount: 3,
    sku: "AR-GLD-NEC-028",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 216000,
      components: {
        goldValue: 194400,
        makingCharges: 15120,
        gst: 6480
      }
    }
  },
  {
    id: "gdrive-gld-19",
    name: "Traditional Bengali 22K Gold Noa Bandha Bangles",
    slug: "gold-noa-bandha-bridal-bangles",
    description: "Sacred Bengali wedding 22K gold-embossed Noa Bandha bangles paired with hand-cut white conch Sankha and red Pola bracelets.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Noa",
    subCategorySlug: "noa",
    goldPurity: 22,
    goldWeight: 12.5,
    tags: ["Noa Bandha", "Sankha Pola", "Bengali Bridal", "Sacred Gold"],
    images: ["/uploads/gold-noa-bandha-bridal-bangles-1.webp", "/uploads/gold-noa-bandha-bridal-bangles-2.webp"],
    coverImage: "/uploads/gold-noa-bandha-bridal-bangles-1.webp",
    stockCount: 3,
    sku: "AR-GLD-NOA-029",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 96000,
      components: {
        goldValue: 86400,
        makingCharges: 6720,
        gst: 2880
      }
    }
  },
  {
    id: "gdrive-gld-20",
    name: "Sacred Lotus 22K Gold Bridal Necklace Set",
    slug: "gold-regal-lotus-necklace-set",
    description: "Regal 22K gold necklace set inspired by sacred pond lotuses, featuring hand-textured petal crescents and matching floral ear-hangers.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Necklace Sets",
    subCategorySlug: "necklace-sets",
    goldPurity: 22,
    goldWeight: 35.8,
    tags: ["Sacred Lotus", "22KT Gold", "Necklace Set", "Heritage"],
    images: ["/uploads/gold-regal-lotus-necklace-set-1.webp", "/uploads/gold-regal-lotus-necklace-set-2.webp", "/uploads/gold-regal-lotus-necklace-set-3.webp"],
    coverImage: "/uploads/gold-regal-lotus-necklace-set-1.webp",
    stockCount: 3,
    sku: "AR-GLD-NEC-030",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 272000,
      components: {
        goldValue: 244800,
        makingCharges: 19040,
        gst: 8160
      }
    }
  },
  {
    id: "gdrive-gld-21",
    name: "Triple-Strand 22K Gold Peacock Sitahar Haar",
    slug: "gold-peacock-triple-sitahar-haar",
    description: "Masterpiece triple-strand 22K gold Sitahar necklace with hand-engraved peacock shoulders and graduated temple bead chains.",
    category: "Gold",
    categorySlug: "gold",
    subCategory: "Necklace Sets",
    subCategorySlug: "necklace-sets",
    goldPurity: 22,
    goldWeight: 62.0,
    tags: ["Triple Sitahar", "Peacock Haar", "22KT BIS 916", "Heirloom"],
    images: ["/uploads/gold-peacock-triple-sitahar-haar-1.webp", "/uploads/gold-peacock-triple-sitahar-haar-2.webp", "/uploads/gold-peacock-triple-sitahar-haar-3.webp"],
    coverImage: "/uploads/gold-peacock-triple-sitahar-haar-1.webp",
    stockCount: 3,
    sku: "AR-GLD-NEC-031",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 469000,
      components: {
        goldValue: 422100,
        makingCharges: 32830,
        gst: 14070
      }
    }
  },
  {
    id: "gdrive-slv-1",
    name: "Pure Handcrafted Silver Filigree Sitahar Necklace",
    slug: "silver-filigree-sitahar-diya",
    description: "Pure 92.5 handcrafted fine silver filigree sitahar necklace, sculpted with traditional Bengali lace art and centered with sacred emerald and ruby enamel.",
    category: "Silver",
    categorySlug: "silver",
    subCategory: "Necklaces",
    subCategorySlug: "necklaces",
    goldPurity: 925,
    goldWeight: 85.0,
    tags: ["Pure Silver 925", "Filigree Sitahar", "Handcrafted", "Heritage"],
    images: ["/uploads/silver-filigree-sitahar-diya-1.webp", "/uploads/silver-filigree-sitahar-diya-2.webp", "/uploads/silver-filigree-sitahar-diya-3.webp"],
    coverImage: "/uploads/silver-filigree-sitahar-diya-1.webp",
    stockCount: 3,
    sku: "AR-SLV-NEC-011",
    isActive: true,
    isFeatured: true,
    pricing: {
      finalPrice: 22500,
      components: {
        goldValue: 20250,
        makingCharges: 1575,
        gst: 675
      }
    }
  },
  {
    id: "gdrive-slv-2",
    name: "Royal Silver Heritage Sitahar on Heirloom Chest",
    slug: "silver-royal-necklace-heirloom-box",
    description: "Royal antique silver sitahar necklace draped with tiered silver bells and floral filigree medallion, crafted in pure hallmarked silver.",
    category: "Silver",
    categorySlug: "silver",
    subCategory: "Necklaces",
    subCategorySlug: "necklaces",
    goldPurity: 925,
    goldWeight: 92.0,
    tags: ["925 Silver", "Royal Sitahar", "Heirloom Collection", "Handcrafted"],
    images: ["/uploads/silver-royal-necklace-heirloom-box-1.webp", "/uploads/silver-royal-necklace-heirloom-box-2.webp", "/uploads/silver-royal-necklace-heirloom-box-3.webp", "/uploads/silver-royal-necklace-heirloom-box-4.webp"],
    coverImage: "/uploads/silver-royal-necklace-heirloom-box-1.webp",
    stockCount: 3,
    sku: "AR-SLV-NEC-012",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 24800,
      components: {
        goldValue: 22320,
        makingCharges: 1736,
        gst: 744
      }
    }
  },
  {
    id: "gdrive-slv-3",
    name: "Pure Silver Enamel Necklace & Jhumkas Set",
    slug: "silver-enamel-necklace-earrings-set",
    description: "Fine 92.5 silver necklace and matching chandelier jhumkas set detailed with royal blue and green Meenakari enamel artwork.",
    category: "Silver",
    categorySlug: "silver",
    subCategory: "Necklaces",
    subCategorySlug: "necklaces",
    goldPurity: 925,
    goldWeight: 68.0,
    tags: ["Silver Meenakari", "Necklace Set", "925 Fine Silver", "Enamel"],
    images: ["/uploads/silver-enamel-necklace-earrings-set-1.webp", "/uploads/silver-enamel-necklace-earrings-set-2.webp"],
    coverImage: "/uploads/silver-enamel-necklace-earrings-set-1.webp",
    stockCount: 3,
    sku: "AR-SLV-NEC-013",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 18500,
      components: {
        goldValue: 16650,
        makingCharges: 1295,
        gst: 555
      }
    }
  },
  {
    id: "gdrive-slv-4",
    name: "Pure Handcrafted Silver Makara Lion-Head Kadas Pair",
    slug: "silver-makara-lion-kadas-pair",
    description: "Handcrafted pair of heavy pure silver Makara kadas featuring sculpted lion-head terminals, hand-chased scales, and ruby enamel accents.",
    category: "Silver",
    categorySlug: "silver",
    subCategory: "Bangles",
    subCategorySlug: "bangles",
    goldPurity: 925,
    goldWeight: 110.0,
    tags: ["Makara Kadas", "925 Silver", "Heavy Bangles", "Lion Head"],
    images: ["/uploads/silver-makara-lion-kadas-pair-1.webp", "/uploads/silver-makara-lion-kadas-pair-2.webp", "/uploads/silver-makara-lion-kadas-pair-3.webp", "/uploads/silver-makara-lion-kadas-pair-4.webp"],
    coverImage: "/uploads/silver-makara-lion-kadas-pair-1.webp",
    stockCount: 3,
    sku: "AR-SLV-BAN-014",
    isActive: true,
    isFeatured: true,
    pricing: {
      finalPrice: 28500,
      components: {
        goldValue: 25650,
        makingCharges: 1995,
        gst: 855
      }
    }
  },
  {
    id: "gdrive-slv-5",
    name: "Heirloom Pure Silver Traditional Saree Necklace",
    slug: "silver-traditional-necklace-saree",
    description: "Heirloom pure silver traditional festive necklace showcasing triple-tiered filigree arches and shimmering silver droplet tassels.",
    category: "Silver",
    categorySlug: "silver",
    subCategory: "Necklaces",
    subCategorySlug: "necklaces",
    goldPurity: 925,
    goldWeight: 76.0,
    tags: ["Traditional Silver", "925 Silver", "Festive Necklace", "Tripura Craft"],
    images: ["/uploads/silver-traditional-necklace-saree-1.webp", "/uploads/silver-traditional-necklace-saree-2.webp"],
    coverImage: "/uploads/silver-traditional-necklace-saree-1.webp",
    stockCount: 3,
    sku: "AR-SLV-NEC-015",
    isActive: true,
    isFeatured: false,
    pricing: {
      finalPrice: 20400,
      components: {
        goldValue: 18360,
        makingCharges: 1428,
        gst: 612
      }
    }
  },
];

/**
 * Filter verified products by category and optional subcategory
 */
export function getCatalogueProducts(categorySlug?: string, subCategorySlug?: string): ProductItem[] {
  if (!categorySlug || categorySlug === 'all') {
    return VERIFIED_PRODUCTS;
  }
  
  const normCat = categorySlug.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  return VERIFIED_PRODUCTS.filter(p => {
    const matchCat = p.categorySlug.toLowerCase().replace(/[^a-z0-9]/g, '') === normCat ||
                     p.category.toLowerCase().replace(/[^a-z0-9]/g, '') === normCat;
    
    if (!matchCat) return false;

    if (!subCategorySlug || subCategorySlug === 'all') return true;

    const normSub = subCategorySlug.toLowerCase().replace(/[^a-z0-9]/g, '');
    return p.subCategorySlug.toLowerCase().replace(/[^a-z0-9]/g, '') === normSub ||
           p.subCategory.toLowerCase().replace(/[^a-z0-9]/g, '') === normSub;
  });
}

/**
 * Get distinct subcategories for a category
 */
export function getCatalogueSubcategories(categorySlug: string): { name: string; slug: string; count: number }[] {
  const prods = getCatalogueProducts(categorySlug);
  const map = new Map<string, { name: string; slug: string; count: number }>();

  for (const p of prods) {
    if (!map.has(p.subCategorySlug)) {
      map.set(p.subCategorySlug, {
        name: p.subCategory,
        slug: p.subCategorySlug,
        count: 0
      });
    }
    const item = map.get(p.subCategorySlug)!;
    item.count += 1;
  }

  return Array.from(map.values());
}
