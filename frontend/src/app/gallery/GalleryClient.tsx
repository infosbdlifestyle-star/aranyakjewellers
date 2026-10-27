"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '@/components/animations/Reveal';
import { TextReveal, SparkleGlint } from '@/components/animations/LuxuryMotion';
import { api } from '@/lib/api';
import { LuxuryJewelryGallery } from '@/components/ui/LuxuryJewelryGallery';

interface GalleryItem {
  id: string;
  title: string;
  category: 'bridal' | 'gold' | 'diamond' | 'temple' | 'earrings' | 'silver';
  purity: string;
  imageUrl: string;
  description: string;
  tag: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    "id": "g-master-1",
    "title": "Heritage Paisley Filigree Drop Earrings",
    "category": "earrings",
    "purity": "22K BIS 916",
    "imageUrl": "/master_gallery_earring_drop.jpg",
    "description": "Handcrafted traditional gold drop earrings with delicate leaf motifs and intricate filigree paisley art.",
    "tag": "Master Gallery • Bespoke"
  },
  {
    "id": "g-master-2",
    "title": "Royal Regal Bridal Gold Necklace Set",
    "category": "bridal",
    "purity": "22K BIS 916",
    "imageUrl": "/master_gallery_royal_set.jpg",
    "description": "Exquisite bridal trousseau choker set featuring cascading leaf filigree, matching earrings, and statement ring.",
    "tag": "Master Gallery • Royal"
  },
  {
    "id": "g-master-3",
    "title": "Artisanal Peacock & Leaf Gold Choker",
    "category": "gold",
    "purity": "22K BIS 916",
    "imageUrl": "/master_gallery_necklace_closeup.jpg",
    "description": "Master craftsmanship highlighting hand-engraved peacock curves and solid gold filigree work.",
    "tag": "Master Gallery • Heritage"
  },
  {
    "id": "g-master-4",
    "title": "Bengali Heirloom Wooden Box Jewellery Set",
    "category": "temple",
    "purity": "22K BIS 916",
    "imageUrl": "/master_gallery_heirloom_box.jpg",
    "description": "Traditional Bengali wedding keepsake featuring handcrafted gold earrings, ring, and vintage velvet box.",
    "tag": "Master Gallery • Heirloom"
  },
  {
    "id": "g-master-5",
    "title": "Vintage Floral Carved Gold Earring Set",
    "category": "earrings",
    "purity": "22K BIS 916",
    "imageUrl": "/master_gallery_vintage_earrings.jpg",
    "description": "Classic handcrafted gold earrings showcasing intricate floral filigree and timeless elegance.",
    "tag": "Master Gallery • Classic"
  },
  {
    "id": "g-1",
    "title": "Royal Heritage Bridal Choker",
    "category": "bridal",
    "purity": "22K BIS 916",
    "imageUrl": "/bridal-edit.png",
    "description": "Hand-carved royal bridal choker adorned with delicate pearls and intricate gold filigree.",
    "tag": "Bespoke Bridal"
  },
  {
    "id": "g-2",
    "title": "Imperial Solitaire & Ruby Necklace",
    "category": "diamond",
    "purity": "VVS-VS Certified",
    "imageUrl": "/hero-necklace.png",
    "description": "Precision-cut certified diamonds accented by deep vivid Burmese rubies.",
    "tag": "Haute Joaillerie"
  },
  {
    "id": "g-3",
    "title": "Artisanal Temple Jhumka Earrings",
    "category": "earrings",
    "purity": "22K BIS 916",
    "imageUrl": "/featured-earrings.png",
    "description": "Traditional Bengali Jhumkas with cascading gold beads and floral ear cuffs.",
    "tag": "Heritage Art"
  },
  {
    "id": "g-4",
    "title": "Sacred Iconography Nakshi Kada",
    "category": "temple",
    "purity": "22K BIS 916",
    "imageUrl": "/IMG_20260603_123905.png",
    "description": "Solid gold temple bangles embossed with sacred divine motifs by master jewelers.",
    "tag": "Antique Collection"
  },
  {
    "id": "g-5",
    "title": "Filigree Gold Craft Neckpiece",
    "category": "gold",
    "purity": "22K BIS 916",
    "imageUrl": "/IMG_20260603_125336.png",
    "description": "Exquisite lightweight gold neckpiece crafted using centuries-old filigree technique.",
    "tag": "Classic Gold"
  },
  {
    "id": "g-6",
    "title": "Emerald & Diamond Cocktail Ring",
    "category": "diamond",
    "purity": "VVS Solitaire",
    "imageUrl": "/IMG_20260603_125514.png",
    "description": "High-clarity solitaire diamond encircled by natural emerald halos.",
    "tag": "Collector Series"
  },
  {
    "id": "g-7",
    "title": "Grand Bengali Sitahar Haar",
    "category": "bridal",
    "purity": "22K BIS 916",
    "imageUrl": "/IMG_20260603_130220.png",
    "description": "Long traditional layered Sitahar necklace designed for wedding trousseaus.",
    "tag": "Royal Bridal"
  },
  {
    "id": "g-8",
    "title": "Antiquity Peacock Gold Pendant",
    "category": "temple",
    "purity": "22K BIS 916",
    "imageUrl": "/IMG_20260603_130343.png",
    "description": "Antique finish gold medallion featuring regal peacock engravings.",
    "tag": "Temple Heritage"
  },
  {
    "id": "g-9",
    "title": "Minimalist Solitaire Pendant Set",
    "category": "diamond",
    "purity": "IGI Certified",
    "imageUrl": "/IMG_20260603_130513.png",
    "description": "Timeless single-stone diamond pendant with matching studs in platinum setting.",
    "tag": "Everyday Luxury"
  },
  {
    "id": "g-10",
    "title": "Nakshi Carved Gold Bridal Set",
    "category": "bridal",
    "purity": "22K BIS 916",
    "imageUrl": "/IMG_20260603_130625.png",
    "description": "Heavy traditional bridal necklace featuring intricate Nakshi relief work.",
    "tag": "Bespoke Trousseau"
  },
  {
    "id": "g-11",
    "title": "Contemporary Diamond Choker",
    "category": "diamond",
    "purity": "GIA Certified",
    "imageUrl": "/IMG_20260603_130726.png",
    "description": "Sleek multi-row diamond choker designed for red-carpet elegance.",
    "tag": "Modern Craft"
  },
  {
    "id": "g-12",
    "title": "Bridal Matha Patti & Nath Collection",
    "category": "bridal",
    "purity": "22K BIS 916",
    "imageUrl": "/IMG_20260603_132136.png",
    "description": "Complete royal head ornament set crafted with pearls and hallmarked gold.",
    "tag": "Bridal Essentials"
  },
  {
    "id": "g-13",
    "title": "Floral Cascading Drop Earrings",
    "category": "earrings",
    "purity": "22K BIS 916",
    "imageUrl": "/IMG_20260603_132405.png",
    "description": "Graceful floral drop earrings with polished gold drops and satin finish.",
    "tag": "Fine Ornaments"
  },
  {
    "id": "g-14",
    "title": "Vintage Polki Kundan Necklace",
    "category": "bridal",
    "purity": "22K BIS 916",
    "imageUrl": "/IMG_20260603_132847.png",
    "description": "Uncut diamond Polki necklace set with ruby drops and green enamel work.",
    "tag": "Kundan Edition"
  },
  {
    "id": "g-15",
    "title": "Classic Gold Bala Bangles",
    "category": "gold",
    "purity": "22K BIS 916",
    "imageUrl": "/IMG_20260603_133127.png",
    "description": "Pair of traditional Bengali gold Balas with intricate leaf motifs.",
    "tag": "Traditional Bala"
  },
  {
    "id": "g-silver-1",
    "title": "Heritage Silver Filigree Diya Necklace",
    "category": "silver",
    "purity": "92.5 Fine Silver",
    "imageUrl": "/uploads/lookbook_heritage_filigree.webp",
    "description": "Master filigree necklace accented with delicate floral enamel, captured against natural stone with a traditional diya flame.",
    "tag": "Pure Silver • Heritage"
  },
  {
    "id": "g-silver-2",
    "title": "Handcrafted Silver Makara Kadas (Pair)",
    "category": "silver",
    "purity": "92.5 Fine Silver",
    "imageUrl": "/uploads/lookbook_silver_bangles.webp",
    "description": "Intricately chased silver kadas featuring royal lion-head makara terminals and vibrant multi-colored enamel gems.",
    "tag": "Pure Silver • Kadas"
  },
  {
    "id": "g-silver-3",
    "title": "Royal Silver Conch Haar on Silk",
    "category": "silver",
    "purity": "92.5 Fine Silver",
    "imageUrl": "/uploads/lookbook_bridal_sitahar.webp",
    "description": "Multi-link festive silver haar with tiered conch patterns and floral medallion centerpiece on Kanjeevaram silk.",
    "tag": "Pure Silver • Haar"
  },
  {
    "id": "g-silver-4",
    "title": "Silver Chandbali & Jhumka Bridal Set",
    "category": "silver",
    "purity": "92.5 Fine Silver",
    "imageUrl": "/uploads/lookbook_filigree_jhumkas.webp",
    "description": "Matching silver necklace and ornate chandelier jhumkas resting on an antique carved heirloom casket.",
    "tag": "Pure Silver • Set"
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Masterpieces' },
  { id: 'bridal', label: 'Bridal Trousseau' },
  { id: 'gold', label: 'Fine Gold 22K' },
  { id: 'diamond', label: 'Certified Diamonds' },
  { id: 'silver', label: 'Pure Silver Heritage' },
  { id: 'temple', label: 'Temple & Antique' },
  { id: 'earrings', label: 'Earrings & Rings' }
];

export default function GalleryClient({ mediaMap = {} }: { mediaMap?: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  // Dynamically map gallery items from backend Media Manager
  const keyToMediaMap: Record<string, string> = {
    'g-master-1': 'gallery_earring_drop',
    'g-master-2': 'gallery_royal_set',
    'g-master-3': 'gallery_necklace_closeup',
    'g-master-4': 'gallery_heirloom_box',
    'g-1': 'home_bridal_image',
    'g-2': 'home_editorial_image',
  };

  const dynamicGalleryItems = GALLERY_ITEMS.map((item) => {
    const mediaKey = keyToMediaMap[item.id];
    if (mediaKey && mediaMap[mediaKey]) {
      return { ...item, imageUrl: mediaMap[mediaKey] };
    }
    return item;
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      } catch { /* empty */ }
    };
    fetchProducts();
  }, []);

  const filteredItems = useMemo(() => {
    let base = dynamicGalleryItems;
    if (products.length > 0) {
      const dynamicItems: GalleryItem[] = products.map((p: any) => ({
        id: p.id,
        title: p.name,
        category: (p.category?.toLowerCase().includes('diamond') ? 'diamond' :
                   p.category?.toLowerCase().includes('silver') ? 'silver' :
                   p.subCategory?.toLowerCase().includes('ear') ? 'earrings' :
                   p.subCategory?.toLowerCase().includes('necklace') || p.name?.toLowerCase().includes('bridal') ? 'bridal' : 'gold') as any,
        purity: p.goldPurity ? `${p.goldPurity}K Gold` : 'BIS 916',
        imageUrl: (p.images && p.images[0]) || '/hero-banner.png',
        description: p.description || 'Masterpiece jewellery created with legacy craftsmanship.',
        tag: p.subCategory || p.category || 'High Jewellery'
      }));
      base = dynamicItems;
    }
    return activeTab === 'all' ? base : base.filter(item => item.category === activeTab);
  }, [products, activeTab]);

  return (
    <main className="min-h-screen bg-[#F8F4EC] text-[#30231D] selection:bg-[#C49A45] selection:text-[#211713]">
      
      {/* 1. Header Banner */}
      <section className="relative py-24 sm:py-32 bg-[#211713] border-b border-[#DED2C1]/20 overflow-hidden text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#211713]/90 via-transparent to-[#211713] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-[#30231D] border border-[#C49A45]/40 mb-6 shadow-xl">
            <SparkleGlint color="#C49A45" size={12}>
              <span className="text-[#C49A45]">✧</span>
            </SparkleGlint>
            <span className="text-[#C49A45] text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase">
              ARANYAK MASTER GALLERY
            </span>
            <SparkleGlint color="#C49A45" size={12}>
              <span className="text-[#C49A45]">✧</span>
            </SparkleGlint>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-light text-[#F8F1E5] tracking-tight leading-none mb-6">
            <TextReveal text="Haute" /> <span className="font-editorial gold-gradient italic">Jewellery</span> <TextReveal text="Portfolio" />
          </h1>

          <p className="text-xs sm:text-sm text-[#D4C5B2] tracking-widest max-w-2xl mx-auto leading-relaxed uppercase font-normal">
            Explore our comprehensive archive of handcrafted gold, certified solitaires, and royal bridal trousseau masterpieces.
          </p>
        </div>
      </section>

      {/* 2. Category Filter Tabs with Sliding Animated Pill */}
      <section className="sticky top-20 z-40 bg-[#F0E7D8]/95 backdrop-blur-md border-b border-[#DED2C1] py-5 px-6 shadow-sm">
        <div className="container mx-auto max-w-7xl flex items-center justify-center overflow-x-auto no-scrollbar space-x-2 sm:space-x-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className="relative px-5 py-2.5 text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase whitespace-nowrap transition-colors duration-300 rounded-none overflow-hidden"
            >
              {activeTab === cat.id && (
                <motion.div 
                  layoutId="activeGalleryTabPill"
                  className="absolute inset-0 bg-[#C49A45] shadow-md z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-300 ${
                activeTab === cat.id ? 'text-[#211713]' : 'text-[#74665A] hover:text-[#30231D]'
              }`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Luxury Master Gallery with Interactive Hover-to-Zoom Lens */}
      <section className="py-16 sm:py-24 px-6 container mx-auto max-w-[1400px]">
        <LuxuryJewelryGallery items={filteredItems} enableHoverZoom={true} aspectRatio="4/5" />
      </section>

      {/* 4. Interactive Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-[100] bg-[#211713]/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div 
              initial={{ scale: 0.92, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 15, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#211713] border border-[#C49A45]/40 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#30231D] border border-[#DED2C1]/30 flex items-center justify-center text-[#F8F1E5] hover:text-[#C49A45] transition-colors"
                aria-label="Close detail modal"
              >
                ✕
              </button>

              {/* Modal Image */}
              <div className="relative aspect-[4/5] md:aspect-auto w-full min-h-[350px] bg-[#30231D]">
                <Image 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover" 
                />
              </div>

              {/* Modal Details */}
              <div className="p-8 sm:p-12 flex flex-col justify-between space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 bg-[#C49A45]/15 border border-[#C49A45]/40 text-[#C49A45] text-[10px] font-bold tracking-[0.25em] uppercase mb-4">
                    {selectedItem.purity}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#F8F1E5] mb-4">
                    {selectedItem.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#D4C5B2] leading-relaxed font-light mb-6">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-[#DED2C1]/20">
                  <a 
                    href={`https://wa.me/919436501506?text=${encodeURIComponent(`Hello Aranyak Jewellers, I am interested in viewing/purchasing: ${selectedItem.title} (${selectedItem.purity})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-luxury py-4 text-center block text-[10px] font-bold tracking-[0.35em] uppercase"
                  >
                    Inquire on WhatsApp
                  </a>
                  <Link 
                    href="/stores"
                    onClick={() => setSelectedItem(null)}
                    className="w-full py-4 text-center block text-[10px] font-bold tracking-[0.35em] uppercase text-[#F8F1E5] bg-[#30231D] hover:bg-[#30231D]/80 border border-[#DED2C1]/30 transition-colors"
                  >
                    Find In Showroom
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
