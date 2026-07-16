export interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: Category[];
}

export const CATEGORIES: Category[] = [
  {
    id: "gold",
    name: "Gold",
    slug: "gold",
    subcategories: [
      { id: "gold-necklace-sets", name: "Necklace Sets", slug: "necklace-sets" },
      { id: "gold-pendant-sets", name: "Pendant Sets", slug: "pendant-sets" },
      { id: "gold-rings-lady", name: "Lady's Rings", slug: "ladys-rings" },
      { id: "gold-rings-gents", name: "Gent's Rings", slug: "gents-rings" },
      { id: "gold-eartops", name: "Eartops", slug: "eartops" },
      { id: "gold-bracelets", name: "Bracelets", slug: "bracelets" },
      { id: "gold-bangles", name: "Bangles", slug: "bangles" },
      { id: "gold-noa", name: "Noa", slug: "noa" },
      { id: "gold-chains", name: "Chains", slug: "chains" },
      { id: "gold-rakhi", name: "Rakhi", slug: "rakhi" },
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    slug: "diamond",
    subcategories: [
      { id: "diamond-chains-pendant", name: "Chains with Pendant", slug: "chains-with-pendant" },
      { id: "diamond-rings", name: "Rings", slug: "rings" },
      { id: "diamond-earrings", name: "Earrings", slug: "earrings" },
      { id: "diamond-nosepins", name: "Nosepins", slug: "nosepins" },
    ],
  },
  {
    id: "silver",
    name: "Silver",
    slug: "silver",
    subcategories: [
      { id: "silver-nosepins", name: "Nosepins", slug: "nosepins" },
      { id: "silver-rakhi", name: "Rakhi", slug: "rakhi" },
      { id: "silver-rings", name: "Rings", slug: "rings" },
      { id: "silver-necklaces", name: "Necklaces", slug: "necklaces" },
    ],
  },
  {
    id: "astrological-stones",
    name: "Astrological Stones",
    slug: "astrological-stones",
    subcategories: [
      { id: "stone-nila", name: "Nila", slug: "nila" },
      { id: "stone-opal", name: "Opal", slug: "opal" },
      { id: "stone-emerald", name: "Emerald", slug: "emerald" },
      { id: "stone-ruby", name: "Ruby", slug: "ruby" },
    ],
  },
  {
    id: "costume-jewellery",
    name: "Costume Jewellery",
    slug: "costume-jewellery",
  },
  {
    id: "offers-deals",
    name: "Offers & Deals",
    slug: "offers-deals",
  },
];
