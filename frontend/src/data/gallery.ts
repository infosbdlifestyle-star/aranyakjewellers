export interface MasterGalleryItem {
  id: string;
  title: string;
  category: string;
  metal: 'gold' | 'silver' | 'diamond';
  purity: string;
  imageUrl: string;
  description: string;
  tag: string;
  productSlug?: string;
  price?: number;
  weight?: number;
}

export const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All Masterpieces' },
  { id: 'gold', label: '22K Fine Gold' },
  { id: 'silver', label: 'Pure 925 Silver' },
  { id: 'diamond', label: 'Certified Diamonds' },
  { id: 'bridal', label: 'Bridal Trousseau' },
] as const;

export const MASTER_GALLERY_ITEMS: MasterGalleryItem[] = [
  // ==========================================
  // 1. 22K FINE GOLD (13 Genuine Physical Masterpieces)
  // ==========================================
  {
    id: "gal-gold-bala-filigree-pair",
    title: "Handcrafted 22K Gold Filigree Bala Bangles Pair",
    category: "bangles",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-bala-filigree-pair-1.webp",
    description: "An exceptional pair of traditional Bengali 22K BIS hallmarked gold Balas adorned with intricate Mayur peacock filigree and polished wire craftsmanship.",
    tag: "Gold • Bangles",
    productSlug: "gold-bala-filigree-pair"
  },
  {
    id: "gal-gold-carved-chur-bangles-pair",
    title: "Traditional 22K Gold Carved Chur Broad Bangles Pair",
    category: "bangles",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-carved-chur-bangles-pair-1.webp",
    description: "Grand Bengali broad Chur bangles in 22K hallmarked gold with repoussé floral relief and geometric border engravings.",
    tag: "Gold • Bangles",
    productSlug: "gold-carved-chur-bangles-pair"
  },
  {
    id: "gal-gold-ratanchoor-bracelet",
    title: "22K Gold Floral Filigree Ratanchoor Bracelet",
    category: "bangles",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-ratanchoor-bracelet-1.webp",
    description: "Grand royal 22K gold Ratanchoor hand ornament featuring an elaborate blooming lotus medallion with delicate connecting gold link chains.",
    tag: "Gold • Bracelets",
    productSlug: "gold-ratanchoor-bracelet"
  },
  {
    id: "gal-gold-heavy-nakshi-bangles-pair",
    title: "Heavy 22K Gold Nakshi Floral Bangles Pair",
    category: "bangles",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-heavy-nakshi-bangles-pair-1.webp",
    description: "Heirloom handcrafted 22K gold broad bangles featuring deep nakshi relief carving, floral rosettes, and beaded trims.",
    tag: "Gold • Bangles",
    productSlug: "gold-heavy-nakshi-bangles-pair"
  },
  {
    id: "gal-gold-filigree-jhumkas-vintage",
    title: "Vintage 22K Gold Filigree Jhumka Drop Earrings",
    category: "earrings",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-filigree-jhumkas-vintage-1.webp",
    description: "Handcrafted vintage 22K gold chandelier jhumka drop earrings featuring multi-tiered bell motifs and cascading gold droplets.",
    tag: "Gold • Earrings",
    productSlug: "gold-filigree-jhumkas-vintage"
  },
  {
    id: "gal-gold-chandbali-crescent-earrings",
    title: "Traditional 22K Gold Chandbali Crescent Earrings",
    category: "earrings",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-chandbali-crescent-earrings-1.webp",
    description: "Regal 22K hallmarked gold Chandbalis sculpted with openwork crescent filigree, floral studs, and delicate cluster fringe.",
    tag: "Gold • Earrings",
    productSlug: "gold-chandbali-crescent-earrings"
  },
  {
    id: "gal-gold-chandelier-earrings-pair",
    title: "Artisanal 22K Gold Chandelier Statement Earrings",
    category: "earrings",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-chandelier-earrings-pair-1.webp",
    description: "Elaborate multi-tier 22K yellow gold chandelier earrings with floral trellis filigree and radiant micro-granulation.",
    tag: "Gold • Earrings",
    productSlug: "gold-chandelier-earrings-pair"
  },
  {
    id: "gal-gold-dome-cocktail-ring",
    title: "Royal 22K Gold Dome Filigree Cocktail Ring",
    category: "rings",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-dome-cocktail-ring-1.webp",
    description: "Majestic royal dome filigree cocktail ring in 22K hallmarked gold, sculpted with an intricate openwork floral dome and beaded borders.",
    tag: "Gold • Rings",
    productSlug: "gold-dome-cocktail-ring"
  },
  {
    id: "gal-gold-peacock-pendant-chain-set",
    title: "Engraved Peacock 22K Gold Pendant & Chain Set",
    category: "necklace-sets",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-peacock-pendant-chain-set-1.webp",
    description: "Artisanal 22K yellow gold pendant featuring a hand-engraved royal peacock motif suspended on a solid hallmarked gold link chain.",
    tag: "Gold • Necklaces",
    productSlug: "gold-peacock-pendant-chain-set"
  },
  {
    id: "gal-gold-peacock-filigree-necklace-set",
    title: "Heritage Peacock 22K Gold Filigree Necklace Set",
    category: "necklace-sets",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-peacock-filigree-necklace-set-1.webp",
    description: "Magnificent 22K gold necklace set featuring dancing peacock filigree centerpieces and matching floral drop earrings.",
    tag: "Gold • Necklaces",
    productSlug: "gold-peacock-filigree-necklace-set"
  },
  {
    id: "gal-gold-filigree-leaf-necklace-set",
    title: "Cascading Leaf 22K Gold Filigree Necklace Set",
    category: "necklace-sets",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-filigree-leaf-necklace-set-1.webp",
    description: "Elegantly sculpted 22K gold necklace adorned with cascading filigree leaf motifs, floral medallions, and matching dangle earrings.",
    tag: "Gold • Necklaces",
    productSlug: "gold-filigree-leaf-necklace-set"
  },
  {
    id: "gal-gold-floral-pendant-earrings-set",
    title: "Aesthetic 22K Gold Floral Pendant & Earrings Set",
    category: "necklace-sets",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-floral-pendant-earrings-set-1.webp",
    description: "Harmonious 22K gold suite featuring a blooming floral pendant and matching sculpted stud earrings with delicate drop accents.",
    tag: "Gold • Necklaces",
    productSlug: "gold-floral-pendant-earrings-set"
  },
  {
    id: "gal-gold-noa-bandha-bridal-bangles",
    title: "Traditional Bengali 22K Gold Noa Bandha Bangles",
    category: "bangles",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-noa-bandha-bridal-bangles-1.webp",
    description: "Auspicious iron bangles bound in 22K hallmarked gold with intricate filigree wire wrapping and floral caps.",
    tag: "Gold • Bangles",
    productSlug: "gold-noa-bandha-bridal-bangles"
  },

  // ==========================================
  // 2. BRIDAL TROUSSEAU (8 Grand Royal Bridal Suites)
  // ==========================================
  {
    id: "gal-bridal-royal-trousseau-choker",
    title: "Grand Royal 22K Gold Bridal Trousseau Choker Set",
    category: "bridal",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-royal-bridal-trousseau-choker-1.webp",
    description: "Opulent wedding heritage choker set handcrafted in 22K gold with intricate mesh lattice, floral medallions, and matching royal jhumkas.",
    tag: "Bridal • Choker Sets",
    productSlug: "gold-royal-bridal-trousseau-choker"
  },
  {
    id: "gal-bridal-floral-choker-set",
    title: "Opulent 22K Gold Floral Bridal Choker & Jhumkas Set",
    category: "bridal",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-floral-bridal-choker-set-1.webp",
    description: "Opulent 22K gold bridal choker necklace set featuring cascading floral medallions, embossed leaf borders, and matching royal jhumkas.",
    tag: "Bridal • Choker Sets",
    productSlug: "gold-floral-bridal-choker-set"
  },
  {
    id: "gal-bridal-layered-sitahar-haar",
    title: "Grand Layered 22K Gold Sitahar Haar & Jhumkas",
    category: "bridal",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-royal-layered-sitahar-haar-1.webp",
    description: "Majestic multi-layered royal bridal sitahar haar in 22K gold with hand-chiseled floral pendants and matching earrings.",
    tag: "Bridal • Sitahar",
    productSlug: "gold-royal-layered-sitahar-haar"
  },
  {
    id: "gal-bridal-peacock-triple-sitahar",
    title: "Triple-Strand 22K Gold Peacock Sitahar Haar",
    category: "bridal",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-peacock-triple-sitahar-haar-1.webp",
    description: "Triple-strand 22K gold bridal sitahar haar showcasing grand peacock nakshi centerpieces and delicate filigree chains.",
    tag: "Bridal • Sitahar",
    productSlug: "gold-peacock-triple-sitahar-haar"
  },
  {
    id: "gal-bridal-sculpted-filigree-set",
    title: "Sculpted 22K Gold Filigree Bridal Haar Set",
    category: "bridal",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-sculpted-filigree-necklace-set-1.webp",
    description: "Sculpted 22K gold bridal necklace set with elaborate filigree mesh, beaded fringe, and matching floral drop earrings.",
    tag: "Bridal • Necklace Sets",
    productSlug: "gold-sculpted-filigree-necklace-set"
  },
  {
    id: "gal-bridal-radiant-necklace",
    title: "Radiant Sunlight 22K Gold Bridal Necklace",
    category: "bridal",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-radiant-bridal-necklace-1.webp",
    description: "Radiant 22K gold bridal necklace inspired by sunburst rays, embellished with delicate wire filigree and matching earrings.",
    tag: "Bridal • Necklace Sets",
    productSlug: "gold-radiant-bridal-necklace"
  },
  {
    id: "gal-bridal-regal-lotus-set",
    title: "Sacred Lotus 22K Gold Bridal Necklace Set",
    category: "bridal",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-regal-lotus-necklace-set-1.webp",
    description: "Sacred lotus petal inspired 22K gold bridal necklace set with traditional Bengali repoussé artistry and chandelier jhumkas.",
    tag: "Bridal • Necklace Sets",
    productSlug: "gold-regal-lotus-necklace-set"
  },
  {
    id: "gal-bridal-grand-choker-earrings",
    title: "Heirloom 22K Gold Grand Bridal Choker & Earrings",
    category: "bridal",
    metal: "gold",
    purity: "22K BIS 916",
    imageUrl: "/uploads/gold-grand-bridal-choker-set-1.webp",
    description: "Grand bridal choker suite crafted in 22K BIS hallmarked gold with double-tiered filigree collars and statement drop earrings.",
    tag: "Bridal • Choker Sets",
    productSlug: "gold-grand-bridal-choker-set"
  },

  // ==========================================
  // 3. PURE 925 SILVER (5 Genuine Pure Silver Masterpieces)
  // ==========================================
  {
    id: "gal-slv-filigree-sitahar-diya",
    title: "Pure Handcrafted Silver Filigree Sitahar Necklace",
    category: "necklace-sets",
    metal: "silver",
    purity: "92.5 Fine Silver",
    imageUrl: "/uploads/silver-filigree-sitahar-diya-1.webp",
    description: "Grand artisanal 925 pure silver long sitahar necklace featuring a handcrafted Diya medallion and traditional तारकशी filigree chain.",
    tag: "Silver • Necklaces",
    productSlug: "silver-filigree-sitahar-diya"
  },
  {
    id: "gal-slv-makara-lion-kadas-pair",
    title: "Pure Handcrafted Silver Makara Lion-Head Kadas Pair",
    category: "bangles",
    metal: "silver",
    purity: "92.5 Fine Silver",
    imageUrl: "/uploads/silver-makara-lion-kadas-pair-1.webp",
    description: "Exquisite pair of handcrafted 92.5 sterling silver Makara kadas adorned with intricate repoussé craftsmanship and temple finish.",
    tag: "Silver • Bangles",
    productSlug: "silver-makara-lion-kadas-pair"
  },
  {
    id: "gal-slv-royal-necklace-heirloom-box",
    title: "Royal Silver Heritage Sitahar on Heirloom Chest",
    category: "necklace-sets",
    metal: "silver",
    purity: "92.5 Fine Silver",
    imageUrl: "/uploads/silver-royal-necklace-heirloom-box-1.webp",
    description: "Museum-quality pure 925 silver filigree collar necklace presented on a vintage hand-carved wooden heirloom keepsake.",
    tag: "Silver • Necklaces",
    productSlug: "silver-royal-necklace-heirloom-box"
  },
  {
    id: "gal-slv-enamel-necklace-earrings-set",
    title: "Pure Silver Enamel Necklace & Jhumkas Set",
    category: "necklace-sets",
    metal: "silver",
    purity: "92.5 Fine Silver",
    imageUrl: "/uploads/silver-enamel-necklace-earrings-set-1.webp",
    description: "Vibrant royal meenakari hand-painted enamel floral motifs set in 92.5 fine silver with matching filigree jhumka earrings.",
    tag: "Silver • Necklaces",
    productSlug: "silver-enamel-necklace-earrings-set"
  },
  {
    id: "gal-slv-traditional-necklace-saree",
    title: "Heirloom Pure Silver Traditional Saree Necklace",
    category: "necklace-sets",
    metal: "silver",
    purity: "92.5 Fine Silver",
    imageUrl: "/uploads/silver-traditional-necklace-saree-1.webp",
    description: "Authentic temple-style 925 sterling silver statement necklace draped against royal handloom silk, finished in antique polish.",
    tag: "Silver • Necklaces",
    productSlug: "silver-traditional-necklace-saree"
  },

  // ==========================================
  // 4. CERTIFIED DIAMONDS (9 Genuine Certified Diamond Masterpieces)
  // ==========================================
  {
    id: "gal-dia-bypass-solitaire-ring",
    title: "Modern Bypass Solitaire Diamond Engagement Ring",
    category: "rings",
    metal: "diamond",
    purity: "18K VVS-VS",
    imageUrl: "/uploads/diamond-bypass-solitaire-ring-1.webp",
    description: "Contemporary crossover bypass diamond ring featuring a central prong-set solitaire and pavé diamond ribbon in 18K gold.",
    tag: "Diamond • Rings",
    productSlug: "diamond-bypass-solitaire-ring"
  },
  {
    id: "gal-dia-floral-filigree-swirl-ring",
    title: "Artisanal Floral Filigree Swirl Diamond Ring",
    category: "rings",
    metal: "diamond",
    purity: "18K VVS-VS",
    imageUrl: "/uploads/diamond-floral-filigree-swirl-ring-1.webp",
    description: "Artistic floral swirl diamond cocktail ring in 18K gold featuring brilliant cut diamonds nestled in polished wave ribbons.",
    tag: "Diamond • Rings",
    productSlug: "diamond-floral-filigree-swirl-ring"
  },
  {
    id: "gal-dia-butterfly-petal-marquise-bangle",
    title: "Butterfly Petal Marquise Diamond Bangle",
    category: "bangles",
    metal: "diamond",
    purity: "18K VVS",
    imageUrl: "/uploads/diamond-butterfly-petal-marquise-bangle-1.webp",
    description: "Captivating 18K gold hinged bangle crowned with marquise and round brilliant-cut diamonds forming fluttering butterfly petals.",
    tag: "Diamond • Bangles",
    productSlug: "diamond-butterfly-petal-marquise-bangle"
  },
  {
    id: "gal-dia-entwined-triple-heart-bangle",
    title: "Entwined Triple Heart Diamond Bangle Bracelet",
    category: "bangles",
    metal: "diamond",
    purity: "18K VVS",
    imageUrl: "/uploads/diamond-entwined-triple-heart-bangle-1.webp",
    description: "Romantic triple entwined open-heart diamond bangle in 18K gold encrusted with micro-pavé natural diamonds.",
    tag: "Diamond • Bangles",
    productSlug: "diamond-entwined-triple-heart-bangle"
  },
  {
    id: "gal-dia-four-leaf-clover-filigree-bangle",
    title: "Four-Leaf Clover Filigree Diamond Bangle Bracelet",
    category: "bangles",
    metal: "diamond",
    purity: "18K VVS",
    imageUrl: "/uploads/diamond-four-leaf-clover-filigree-bangle-1.webp",
    description: "Auspicious four-leaf clover diamond bangle with fine filigree openwork and shimmering prong-set solitaire accents.",
    tag: "Diamond • Bangles",
    productSlug: "diamond-four-leaf-clover-filigree-bangle"
  },
  {
    id: "gal-dia-marquise-blossom-cluster-bangle",
    title: "Marquise Blossom Cluster Diamond Bangle",
    category: "bangles",
    metal: "diamond",
    purity: "18K VVS",
    imageUrl: "/uploads/diamond-marquise-blossom-cluster-bangle-1.webp",
    description: "Radiant floral cluster bangle featuring marquise cut diamonds arranged in blooming florets along a polished gold band.",
    tag: "Diamond • Bangles",
    productSlug: "diamond-marquise-blossom-cluster-bangle"
  },
  {
    id: "gal-dia-open-heart-solitaire-bangle",
    title: "Open Heart Solitaire Diamond Kada Bangle",
    category: "bangles",
    metal: "diamond",
    purity: "18K VVS",
    imageUrl: "/uploads/diamond-open-heart-solitaire-bangle-1.webp",
    description: "Graceful open-heart diamond bangle crafted in 18K gold featuring a central brilliant-cut solitaire diamond terminal.",
    tag: "Diamond • Bangles",
    productSlug: "diamond-open-heart-solitaire-bangle"
  },
  {
    id: "gal-dia-regal-floral-arch-mangalsutra",
    title: "Regal Floral Arch Diamond Mangalsutra Necklace",
    category: "necklace-sets",
    metal: "diamond",
    purity: "18K VVS",
    imageUrl: "/uploads/diamond-regal-floral-arch-mangalsutra-1.webp",
    description: "Sacred diamond mangalsutra pendant featuring a regal floral arch studded with brilliant-cut diamonds and auspicious black beads.",
    tag: "Diamond • Mangalsutra",
    productSlug: "diamond-regal-floral-arch-mangalsutra"
  },
  {
    id: "gal-dia-wave-solitaire-mangalsutra",
    title: "Flawless Solitaire Wave Diamond Mangalsutra Necklace",
    category: "necklace-sets",
    metal: "diamond",
    purity: "18K VVS",
    imageUrl: "/uploads/diamond-wave-solitaire-mangalsutra-1.webp",
    description: "Modern undulating wave motif diamond mangalsutra pendant set with natural certified solitaire diamonds in 18K gold.",
    tag: "Diamond • Mangalsutra",
    productSlug: "diamond-wave-solitaire-mangalsutra"
  }
];
