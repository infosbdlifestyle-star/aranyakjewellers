"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '@/components/animations/Reveal';

const FILTER_TABS = [
  { id: 'all', label: 'All Masterpieces' },
  { id: 'Gold', label: 'Fine Gold 22K' },
  { id: 'Diamond', label: 'Certified Diamonds' },
  { id: 'Silver', label: 'Silver' },
  { id: 'Astrological Stones', label: 'Astrological Stones' },
];

export default function GalleryClient() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?take=100');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter(p => p.category === activeTab);

  const visibleTabs = FILTER_TABS.filter(tab => 
    tab.id === 'all' || products.some(p => p.category === tab.id)
  );

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

      {/* 2. Category Filter Tabs */}
      {!loading && visibleTabs.length > 1 && (
        <section className="sticky top-20 z-40 bg-[#050202]/90 backdrop-blur-md border-b border-white/10 py-5 px-6">
          <div className="container mx-auto max-w-7xl flex items-center justify-center overflow-x-auto no-scrollbar space-x-2 sm:space-x-3">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative px-5 py-2.5 text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase whitespace-nowrap transition-colors duration-300 rounded-none overflow-hidden"
              >
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeGalleryTabPill"
                    className="absolute inset-0 bg-[#CBA135] shadow-lg z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 transition-colors duration-300 ${
                  activeTab === tab.id ? 'text-[#050202]' : 'text-white/70 hover:text-white'
                }`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 3. Gallery Grid */}
      <section className="py-16 sm:py-24 px-6 container mx-auto max-w-[1400px]">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white/5" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 space-y-6">
            <div className="text-secondary text-5xl">✧</div>
            <h2 className="text-3xl font-serif font-light text-white">
              {products.length === 0 ? 'Gallery Coming Soon' : 'No items in this category'}
            </h2>
            <p className="text-white/50 max-w-md mx-auto text-sm font-light leading-relaxed">
              {products.length === 0 
                ? 'Our master artisans are preparing stunning jewellery for the gallery. Visit our showroom to see our full collection.'
                : 'Try selecting a different category or view all masterpieces.'}
            </p>
            {products.length > 0 && (
              <button
                onClick={() => setActiveTab('all')}
                className="btn-luxury px-8 py-3 text-[10px] font-bold tracking-[0.35em] uppercase mt-4"
              >
                View All Masterpieces
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((item) => (
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
                    {item.images && item.images[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10 font-serif text-6xl">
                        {item.name[0]}
                      </div>
                    )}
                    {/* Dark Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050202] via-[#050202]/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                    {/* Top Purity Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="text-[9px] font-bold tracking-widest uppercase text-[#CBA135] bg-[#050202]/85 backdrop-blur-md border border-[#CBA135]/40 px-3 py-1">
                        {item.goldPurity > 0 ? `${item.goldPurity}K BIS` : item.category}
                      </span>
                    </div>

                    {/* Price badge if available */}
                    {item.pricing?.finalPrice > 0 && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="text-[9px] font-bold tracking-widest uppercase text-white bg-[#050202]/85 backdrop-blur-md border border-white/20 px-2.5 py-1">
                          ₹{item.pricing.finalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#E5D3B3] mb-1">
                        {item.subCategory || item.category}
                      </span>
                      <h3 className="text-xl font-serif font-light text-white group-hover:text-[#E5D3B3] transition-colors mb-2">
                        {item.name}
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
        )}
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
                {selectedItem.images && selectedItem.images[0] ? (
                  <img
                    src={selectedItem.images[0]}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10 font-serif text-8xl">
                    {selectedItem.name[0]}
                  </div>
                )}
              </div>

              {/* Modal Details */}
              <div className="p-8 sm:p-12 flex flex-col justify-between space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 bg-[#CBA135]/10 border border-[#CBA135]/40 text-[#CBA135] text-[10px] font-bold tracking-[0.25em] uppercase mb-4">
                    {selectedItem.goldPurity > 0 ? `${selectedItem.goldPurity}K BIS Hallmarked` : selectedItem.category}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-light text-white mb-4">
                    {selectedItem.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light mb-6">
                    {selectedItem.description || "An exquisite piece crafted with mastery by Aranyak Jewellers."}
                  </p>

                  {/* Product Details */}
                  <div className="space-y-2 text-xs text-white/50">
                    {selectedItem.goldWeight > 0 && (
                      <div className="flex justify-between">
                        <span className="uppercase tracking-widest font-bold">Weight</span>
                        <span>{selectedItem.goldWeight}g</span>
                      </div>
                    )}
                    {selectedItem.sku && (
                      <div className="flex justify-between">
                        <span className="uppercase tracking-widest font-bold">SKU</span>
                        <span className="font-mono">{selectedItem.sku}</span>
                      </div>
                    )}
                    {selectedItem.pricing?.finalPrice > 0 && (
                      <div className="flex justify-between text-secondary">
                        <span className="uppercase tracking-widest font-bold">Est. Price</span>
                        <span className="font-semibold">₹{selectedItem.pricing.finalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <a 
                    href={`https://wa.me/919436501506?text=${encodeURIComponent(`Hello Aranyak Jewellers, I am interested in viewing/purchasing: ${selectedItem.name} (${selectedItem.goldPurity > 0 ? `${selectedItem.goldPurity}K` : selectedItem.category}${selectedItem.sku ? ', SKU: ' + selectedItem.sku : ''})`)}`}
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
