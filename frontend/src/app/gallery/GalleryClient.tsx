"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TextReveal, SparkleGlint } from '@/components/animations/LuxuryMotion';
import { LuxuryJewelryGallery } from '@/components/ui/LuxuryJewelryGallery';
import { MASTER_GALLERY_ITEMS, GALLERY_CATEGORIES, MasterGalleryItem } from '@/data/gallery';
import { api } from '@/lib/api';
import { CategoryNavBar, CategoryNavItem } from '@/components/category/CategoryNavBar';

export default function GalleryClient({ mediaMap = {} }: { mediaMap?: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [backendItems, setBackendItems] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchGallery = async () => {
      try {
        const data = await api.getGalleryItems();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setBackendItems(data.filter((item: any) => item.isActive));
        }
      } catch {
        /* fallback to static */
      }
    };
    fetchGallery();
    return () => { isMounted = false; };
  }, []);

  // Identify and block any legacy AI-generated/stock placeholder image URLs
  const isAIGeneratedUrl = (url?: string): boolean => {
    if (!url) return true;
    const aiPatterns = [
      'lookbook_',
      'gallery_',
      'cat_',
      'top_picks_',
      'diamond_solitaire_ring',
      'diamond_pendant_chain',
      'silver_luxury_necklace',
      'silver_rings_luxury',
      'silver_nosepin_luxury',
      'silver_necklace_',
      'silver_bangles_',
      'gold_temple_nakshi',
      'bridal-edit'
    ];
    return aiPatterns.some((pattern) => url.includes(pattern));
  };

  // Dynamically map gallery items from backend Media Manager if overrides exist
  const keyToMediaMap: Record<string, string> = {
    'g-master-1': 'gallery_earring_drop',
    'g-master-2': 'gallery_royal_set',
    'g-master-3': 'gallery_necklace_closeup',
    'g-master-4': 'gallery_heirloom_box',
    'g-1': 'home_bridal_image',
    'g-2': 'home_editorial_image',
  };

  const dynamicGalleryItems = useMemo(() => {
    // 1. Base curated MASTER_GALLERY_ITEMS with strictly genuine physical photography
    const baseItems = MASTER_GALLERY_ITEMS.filter((item) => !isAIGeneratedUrl(item.imageUrl)).map((item) => {
      const mediaKey = keyToMediaMap[item.id];
      if (mediaKey && mediaMap[mediaKey] && !isAIGeneratedUrl(mediaMap[mediaKey])) {
        return { ...item, imageUrl: mediaMap[mediaKey] };
      }
      return item;
    });

    // 2. If backend gallery items exist, only accept genuine physical photoshoot items (0 AI images)
    if (backendItems.length > 0) {
      const existingUrls = new Set(baseItems.map((b) => b.imageUrl));
      const newBackendItems = backendItems
        .filter((item) => item.imageUrl && !existingUrls.has(item.imageUrl) && !isAIGeneratedUrl(item.imageUrl))
        .map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle || '',
          category: item.category || 'gold',
          imageUrl: item.imageUrl,
          metal: (item.metal || 'gold') as 'gold' | 'silver' | 'diamond',
          purity: item.purity || '22K',
          description: item.description || '',
          tag: item.metal === 'silver' ? 'Silver' : item.metal === 'diamond' ? 'Diamond' : 'Gold',
        }));
      return [...baseItems, ...newBackendItems];
    }

    return baseItems;
  }, [backendItems, mediaMap]);

  const filteredItems = useMemo(() => {
    return dynamicGalleryItems.filter((item) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'gold') return item.metal === 'gold' && item.category !== 'bridal';
      if (activeTab === 'silver') return item.metal === 'silver';
      if (activeTab === 'diamond') return item.metal === 'diamond';
      if (activeTab === 'bridal') return item.category === 'bridal' || item.tag?.toLowerCase().includes('bridal');
      return true;
    });
  }, [dynamicGalleryItems, activeTab]);

  const galleryNavItems = useMemo<CategoryNavItem[]>(() => {
    return GALLERY_CATEGORIES.map((cat) => ({
      id: cat.id,
      name: cat.label,
    }));
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#211813] selection:bg-[#C49A45] selection:text-[#211813]">
      
      {/* 1. Header Banner */}
      <section className="relative py-24 sm:py-32 bg-[#211813] border-b border-[#DED2C1]/15 overflow-hidden text-center px-6">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-75 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('/uploads/website-banner.webp')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#211813]/85 via-[#211813]/55 to-[#211813]/90 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-[#211813] border border-[#C49A45]/40 mb-6 shadow-xl">
            <SparkleGlint color="#D6B15D" size={12}>
              <span className="text-[#D6B15D]">✧</span>
            </SparkleGlint>
            <span className="text-[#D6B15D] text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase">
              ARANYAK MASTER GALLERY
            </span>
            <SparkleGlint color="#D6B15D" size={12}>
              <span className="text-[#D6B15D]">✧</span>
            </SparkleGlint>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light text-white tracking-tight leading-[1.18] sm:leading-[1.15] mb-6 text-balance"
            style={{ color: '#FFFFFF' }}
          >
            Haute Jewellery <span className="text-[#C58B20]" style={{ color: '#C58B20' }}>Portfolio</span>
          </motion.h1>

          <p className="text-xs sm:text-sm text-[#E5D9C8] tracking-widest max-w-2xl mx-auto leading-relaxed uppercase font-normal mb-6 tabular-nums lining-nums">
            Explore our comprehensive archive of handcrafted gold, pure 925 silver, and royal bridal trousseau masterpieces.
          </p>

          <div className="inline-flex items-center space-x-2 text-[11px] font-serif text-[#D6B15D] bg-[#211813]/80 border border-[#C49A45]/30 px-4 py-1 rounded-full tabular-nums lining-nums">
            <span>{filteredItems.length} Masterpiece Photos in Collection</span>
          </div>
        </div>
      </section>

      {/* 2. Compact, Properly Aligned Category Navigation Bar */}
      <CategoryNavBar
        items={galleryNavItems}
        activeId={activeTab}
        onSelect={(id) => setActiveTab(id)}
        layoutId="activeGalleryTabPill"
      />

      {/* 3. Luxury Master Gallery with Interactive Hover-to-Zoom Lens & Modal */}
      <section className="py-16 sm:py-24 px-6 container mx-auto max-w-[1400px]">
        <LuxuryJewelryGallery items={filteredItems} enableHoverZoom={true} aspectRatio="4/5" />
      </section>

    </main>
  );
}
