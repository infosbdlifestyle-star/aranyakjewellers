export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  subcategories?: Category[];
}

export const CATEGORIES: Category[] = [
  {
    id: "gold",
    name: "Gold",
    slug: "gold",
    imageUrl: "/hero-necklace.png",
    subcategories: [
      { id: "gold-necklace-sets", name: "Necklace Sets", slug: "necklace-sets", imageUrl: "/hero-necklace.png" },
      { id: "gold-pendant-sets", name: "Pendant Sets", slug: "pendant-sets", imageUrl: "/IMG_20260603_130343.png" },
      { id: "gold-rings-lady", name: "Lady's Rings", slug: "ladys-rings", imageUrl: "/IMG_20260603_134643.png" },
      { id: "gold-rings-gents", name: "Gent's Rings", slug: "gents-rings", imageUrl: "/IMG_20260603_133507.png" },
      { id: "gold-eartops", name: "Eartops", slug: "eartops", imageUrl: "/featured-earrings.png" },
      { id: "gold-bracelets", name: "Bracelets", slug: "bracelets", imageUrl: "/IMG_20260603_132136.png" },
      { id: "gold-bangles", name: "Bangles", slug: "bangles", imageUrl: "/IMG_20260603_123905.png" },
      { id: "gold-noa", name: "Noa", slug: "noa", imageUrl: "/IMG_20260603_133228.png" },
      { id: "gold-chains", name: "Chains", slug: "chains", imageUrl: "/IMG_20260603_134842.png" },
      { id: "gold-rakhi", name: "Rakhi", slug: "rakhi", imageUrl: "/IMG_20260603_141310.png" },
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    slug: "diamond",
    imageUrl: "/diamond_solitaire_ring.jpg",
    subcategories: [
      { id: "diamond-chains-pendant", name: "Chains with Pendant", slug: "chains-with-pendant", imageUrl: "/diamond_pendant_chain.jpg" },
      { id: "diamond-rings", name: "Rings", slug: "rings", imageUrl: "/diamond_solitaire_ring.jpg" },
      { id: "diamond-earrings", name: "Earrings", slug: "earrings", imageUrl: "/IMG_20260603_141216.png" },
      { id: "diamond-nosepins", name: "Nosepins", slug: "nosepins", imageUrl: "/IMG_20260603_135005.png" },
    ],
  },
  {
    id: "silver",
    name: "Silver",
    slug: "silver",
    imageUrl: "/silver_luxury_necklace.jpg",
    subcategories: [
      { id: "silver-necklaces", name: "Necklaces", slug: "necklaces", imageUrl: "/silver_luxury_necklace.jpg" },
      { id: "silver-rings", name: "Rings", slug: "rings", imageUrl: "/silver_rings_luxury.jpg" },
      { id: "silver-nosepins", name: "Nosepins", slug: "nosepins", imageUrl: "/silver_nosepin_luxury.jpg" },
      { id: "silver-rakhi", name: "Rakhi", slug: "rakhi", imageUrl: "/silver_rakhi_luxury.jpg" },
    ],
  },
  {
    id: "costume-jewellery",
    name: "Costume Jewellery",
    slug: "costume-jewellery",
    imageUrl: "/IMG_20260603_141414.png",
  },
  {
    id: "offers-deals",
    name: "Offers & Deals",
    slug: "offers-deals",
    imageUrl: "/bridal-edit.png",
  },
];
