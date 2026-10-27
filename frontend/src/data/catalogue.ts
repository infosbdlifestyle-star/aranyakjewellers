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
  }
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
