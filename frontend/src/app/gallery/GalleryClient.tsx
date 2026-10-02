"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '@/components/animations/Reveal';

interface GalleryItem {
  id: string;
  title: string;
  category: 'bridal' | 'gold' | 'diamond' | 'temple' | 'earrings';
  purity: string;
  imageUrl: string;
  description: string;
  tag: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Royal Heritage Bridal Choker',
    category: 'bridal',
    purity: '22K BIS 916',
    imageUrl: '/bridal-edit.png',
    description: 'Hand-carved royal bridal choker adorned with delicate pearls and intricate gold filigree.',
    tag: 'Bespoke Bridal'
  },
  {
    id: 'g-2',
    title: 'Imperial Solitaire & Ruby Necklace',
    category: 'diamond',
    purity: 'VVS-VS Certified',
    imageUrl: '/hero-necklace.png',
    description: 'Precision-cut certified diamonds accented by deep vivid Burmese rubies.',
    tag: 'Haute Joaillerie'
  },
  {
    id: 'g-3',
    title: 'Artisanal Temple Jhumka Earrings',
    category: 'earrings',
    purity: '22K BIS 916',
    imageUrl: '/featured-earrings.png',
    description: 'Traditional Bengali Jhumkas with cascading gold beads and floral ear cuffs.',
    tag: 'Heritage Art'
  },
  {
    id: 'g-4',
    title: 'Sacred Iconography Nakshi Kada',
    category: 'temple',
    purity: '22K BIS 916',
    imageUrl: '/IMG_20260603_123905.png',
    description: 'Solid gold temple bangles embossed with sacred divine motifs by master jewelers.',
    tag: 'Antique Collection'
  },
  {
    id: 'g-5',
    title: 'Filigree Gold Craft Neckpiece',
    category: 'gold',
    purity: '22K BIS 916',
    imageUrl: '/IMG_20260603_125336.png',
    description: 'Exquisite lightweight gold neckpiece crafted using centuries-old filigree technique.',
    tag: 'Classic Gold'
  },
  {
    id: 'g-6',
    title: 'Emerald & Diamond Cocktail Ring',
    category: 'diamond',
    purity: 'VVS Solitaire',
    imageUrl: '/IMG_20260603_125514.png',
    description: 'High-clarity solitaire diamond encircled by natural emerald halos.',
    tag: 'Collector Series'
  },
  {
    id: 'g-7',
    title: 'Grand Bengali Sitahar Haar',
    category: 'bridal',
    purity: '22K BIS 916',
    imageUrl: '/IMG_20260603_130220.png',
    description: 'Long traditional layered Sitahar necklace designed for wedding trousseaus.',
    tag: 'Royal Bridal'
  },
  {
    id: 'g-8',
    title: 'Antiquity Peacock Gold Pendant',
    category: 'temple',
    purity: '22K BIS 916',
    imageUrl: '/IMG_20260603_130343.png',
    description: 'Antique finish gold medallion featuring regal peacock engravings.',
    tag: 'Temple Heritage'
  },
  {
    id: 'g-9',
    title: 'Minimalist Solitaire Pendant Set',
    category: 'diamond',
    purity: 'IGI Certified',
    imageUrl: '/IMG_20260603_130513.png',
    description: 'Timeless single-stone diamond pendant with matching studs in platinum setting.',
    tag: 'Everyday Luxury'
  },
  {
    id: 'g-10',
    title: 'Nakshi Carved Gold Bridal Set',
    category: 'bridal',
    purity: '22K BIS 916',
    imageUrl: '/IMG_20260603_130625.png',
    description: 'Heavy traditional bridal necklace featuring intricate Nakshi relief work.',
    tag: 'Bespoke Trousseau'
  },
  {
    id: 'g-11',
    title: 'Contemporary Diamond Choker',
    category: 'diamond',
    purity: 'GIA Certified',
    imageUrl: '/IMG_20260603_130726.png',
    description: 'Sleek multi-row diamond choker designed for red-carpet elegance.',
    tag: 'Modern Craft'
  },
  {
    id: 'g-12',
    title: 'Bridal Matha Patti & Nath Collection',
    category: 'bridal',
    purity: '22K BIS 916',
    imageUrl: '/IMG_20260603_132136.png',
    description: 'Complete royal head ornament set crafted with pearls and hallmarked gold.',
    tag: 'Bridal Essentials'
  },
  {
    id: 'g-13',
    title: 'Floral Cascading Drop Earrings',
    category: 'earrings',
    purity: '22K BIS 916',
    imageUrl: '/IMG_20260603_132405.png',
    description: 'Graceful floral drop earrings with polished gold drops and satin finish.',
    tag: 'Fine Ornaments'
  },
  {
    id: 'g-14',
    title: 'Vintage Polki Kundan Necklace',
    category: 'bridal',
    purity: '22K BIS 916',
    imageUrl: '/IMG_20260603_132847.png',
    description: 'Uncut diamond Polki necklace set with ruby drops and green enamel work.',
    tag: 'Kundan Edition'
  },
  {
    id: 'g-15',
    title: 'Classic Gold Bala Bangles',
    category: 'gold',
    purity: '22K BIS 916',
    imageUrl: '/IMG_20260603_133127.png',
    description: 'Pair of traditional Bengali gold Balas with intricate leaf motifs.',
    tag: 'Classic Gold'
  },
  {
    id: 'g-16',
    title: 'Chandelier Diamond Earrings',
    category: 'earrings',
    purity: 'VVS-VS Certified',
    imageUrl: '/IMG_20260603_141216.png',
    description: 'Dazzling multi-tier diamond chandelier earrings with brilliant light refraction.',
    tag: 'Diamond Luxury'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Masterpieces' },
  { id: 'bridal', label: 'Bridal Trousseau' },
  { id: 'gold', label: 'Fine Gold 22K' },
  { id: 'diamond', label: 'Certified Diamonds' },
  { id: 'temple', label: 'Temple & Antique' },
  { id: 'earrings', label: 'Earrings & Rings' }
];

export default function GalleryClient() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = activeTab === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeTab);

  return (
    <main className="min-h-screen bg-[#050202] text-white selection:bg-[#CBA135] selection:text-[#050202]">
      
      {/* 1. Header Banner */}
      <section className="relative py-24 sm:py-32 bg-[#050202] border-b border-white/10 bg-radial-gold-top overflow-hidden text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050202]/80 via-transparent to-[#050202] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <Reveal y={20}>
            <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-[#0A0505] border border-[#CBA135]/40 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CBA135] animate-pulse" />
              <span className="text-secondary text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase">
                ARANYAK MASTER GALLERY
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#CBA135] animate-pulse" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-light text-white tracking-tight leading-none mb-6">
              Haute <span className="font-editorial gold-gradient italic">Jewellery</span> Portfolio
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-xs sm:text-sm text-white/70 tracking-widest max-w-2xl mx-auto leading-relaxed uppercase font-light">
              Explore our comprehensive archive of handcrafted gold, certified solitaires, and royal bridal trousseau masterpieces.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. Category Filter Tabs with Sliding Animated Pill */}
      <section className="sticky top-20 z-40 bg-[#050202]/90 backdrop-blur-md border-b border-white/10 py-5 px-6">
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
                  className="absolute inset-0 bg-[#CBA135] shadow-lg z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-300 ${
                activeTab === cat.id ? 'text-[#050202]' : 'text-white/70 hover:text-white'
              }`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Smooth Grid Layout with popLayout Animation */}
      <section className="py-16 sm:py-24 px-6 container mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 15 }}
                transition={{ 
                  duration: 0.35, 
                  ease: [0.16, 1, 0.3, 1],
                  layout: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                }}
                onClick={() => setSelectedItem(item)}
                className="group relative bg-[#0A0505] border border-white/10 hover:border-[#CBA135]/60 overflow-hidden cursor-pointer gold-border-glow transition-all duration-500 shadow-xl"
              >
                {/* Image Wrapper */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#050202]">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050202] via-[#050202]/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                  {/* Top Purity Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[9px] font-bold tracking-widest uppercase text-[#CBA135] bg-[#050202]/85 backdrop-blur-md border border-[#CBA135]/40 px-3 py-1">
                      {item.purity}
                    </span>
                  </div>

                  {/* Bottom Info Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#E5D3B3] mb-1">
                      {item.tag}
                    </span>
                    <h3 className="text-xl font-serif font-light text-white group-hover:text-[#E5D3B3] transition-colors mb-2">
                      {item.title}
                    </h3>
                    <div className="inline-flex items-center space-x-2 text-[9px] font-bold tracking-[0.25em] uppercase text-white/60 group-hover:text-white transition-colors">
                      <span>View Masterpiece</span>
                      <span className="text-[#CBA135]">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
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
            className="fixed inset-0 z-[100] bg-[#050202]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div 
              initial={{ scale: 0.92, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 15, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#0A0505] border border-[#CBA135]/40 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl glow-gold"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#050202]/80 border border-white/20 flex items-center justify-center text-white hover:text-[#CBA135] transition-colors"
                aria-label="Close detail modal"
              >
                ✕
              </button>

              {/* Modal Image */}
              <div className="relative aspect-[4/5] md:aspect-auto w-full min-h-[350px] bg-[#050202]">
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
                  <div className="inline-block px-3 py-1 bg-[#CBA135]/10 border border-[#CBA135]/40 text-[#CBA135] text-[10px] font-bold tracking-[0.25em] uppercase mb-4">
                    {selectedItem.purity}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-light text-white mb-4">
                    {selectedItem.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light mb-6">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
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
                    className="w-full py-4 text-center block text-[10px] font-bold tracking-[0.35em] uppercase text-white bg-white/5 hover:bg-white/10 border border-white/20 transition-colors"
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
