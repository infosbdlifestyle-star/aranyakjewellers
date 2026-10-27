"use client";

import React, { useEffect, useState } from 'react';
import { CATEGORIES } from '@/constants/categories';
import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from '@/components/animations/Reveal';
import { 
  TextReveal, 
  MagneticCard, 
  ExpandingDivider, 
  SparkleGlint 
} from '@/components/animations/LuxuryMotion';
import { api } from '@/lib/api';

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  gold: '/hero-banner.png',
  diamond: '/hero-necklace.png',
  silver: '/IMG_20260603_135005.png',
  'costume-jewellery': '/IMG_20260603_141414.png',
  'offers-deals': '/bridal-edit.png'
};

export default function CollectionsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        if (Array.isArray(data)) setProducts(data);
      } catch { /* empty */ }
    };
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#76551C]">
      {/* Page Hero */}
      <section className="relative py-28 md:py-36 px-6 md:px-12 text-left bg-[#211813] text-[#FFF8EC] overflow-hidden border-b border-[#DED2C1]/20">
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] bg-cover bg-center opacity-15 mix-blend-luminosity animate-slow-zoom" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#211813] via-[#211813]/70 to-transparent pointer-events-none" />
        
        <div className="relative z-10 container mx-auto max-w-7xl">
          <Reveal y={30}>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#211813] border border-[#D6B15D]/40 mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#98712E] animate-pulse" />
              <span className="text-[10px] tracking-[0.5em] uppercase text-[#E0BD72] font-bold">The Archives</span>
            </div>
          </Reveal>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light mb-6 tracking-tight drop-shadow-2xl text-[#FFF8EC]">
            <TextReveal delay={0.1} duration={1}>
              Our
            </TextReveal>{" "}
            <TextReveal delay={0.25} duration={1.1}>
              <span className="font-editorial italic gold-gradient">Collections</span>
            </TextReveal>
          </h1>

          <Reveal delay={0.3} y={20}>
            <p className="text-xs sm:text-sm text-[#E5D9C8] font-normal tracking-[0.2em] max-w-xl uppercase leading-relaxed">
              Timeless chapters of Bengali heritage, hallmarked bullion purity, and precision-cut solitaires.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Staggered Zig-Zag Layout */}
      <section className="py-24 bg-[#FAF7F0]">
        <div className="container mx-auto px-6 max-w-7xl space-y-28 md:space-y-36">
          {CATEGORIES.map((cat, idx) => {
            const isEven = idx % 2 === 0;
            const matchingProduct = products.find(p => p.category && p.category.toLowerCase() === cat.name.toLowerCase() && p.images && p.images[0]);
            const imageSrc = (matchingProduct?.images && matchingProduct.images[0]) || DEFAULT_CATEGORY_IMAGES[cat.slug] || '/hero-banner.png';

            return (
              <div key={cat.id}>
                <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 md:gap-24 items-center`}>
                  
                  {/* Image/Visual Area with Magnetic Tilt & Specular Lighting */}
                  <div className="w-full md:w-1/2 relative">
                    <Reveal y={40} duration={0.9}>
                      <MagneticCard tiltIntensity={6} className="rounded-2xl">
                        <div className="relative aspect-[4/5] bg-[#211813] flex items-center justify-center overflow-hidden group border border-[#DED2C1] hover:border-[#D6B15D]/80 transition-all duration-700 shadow-xl rounded-2xl">
                          <Image 
                            src={imageSrc} 
                            alt={`${cat.name} Luxury Collection - Aranyak Jewellers`} 
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover group-hover:scale-108 transition-transform duration-[1.2s] ease-out opacity-90 group-hover:opacity-100" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#211813] via-[#211813]/30 to-transparent pointer-events-none" />
                          
                          {/* Inner Decorative Golden Inset Frame */}
                          <div className="absolute inset-6 border border-[#DED2C1]/40 group-hover:border-[#D6B15D]/70 transition-colors duration-700 pointer-events-none rounded-lg" />
                          
                          {/* Corner Glint */}
                          <SparkleGlint className="absolute top-8 right-8 z-30" size={18} delay={idx * 0.4} />
                        </div>
                      </MagneticCard>
                    </Reveal>
                    
                    {/* Floating Luxury Chapter Number */}
                    <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? '-left-10 lg:-left-16' : '-right-10 lg:-right-16'} hidden md:block z-20 pointer-events-none`}>
                      <span className="text-[7rem] lg:text-[9rem] font-editorial text-[#D6B15D]/20 select-none drop-shadow-sm">
                        0{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className={`w-full md:w-1/2 flex flex-col ${isEven ? 'md:items-start' : 'md:items-end md:text-right'}`}>
                    <Reveal delay={0.1} y={30}>
                      <div className="inline-flex items-center space-x-2 text-[10px] font-bold tracking-[0.4em] uppercase text-[#D6B15D] mb-4">
                        <span>Chapter 0{idx + 1}</span>
                        <span>•</span>
                        <span>Bespoke Edition</span>
                      </div>
                      <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-[#76551C] mb-8 leading-tight">
                        {cat.name}
                      </h2>
                    </Reveal>
                    
                    <Reveal delay={0.2} y={30}>
                      {cat.subcategories ? (
                        <div className={`space-y-3.5 mb-10 w-full ${isEven ? 'text-left' : 'text-right'}`}>
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/category/${cat.slug}/${sub.slug}`}
                              className={`flex items-center gap-3 text-sm text-[#76551C] hover:text-[#D6B15D] transition-colors duration-300 group/link ${isEven ? 'justify-start' : 'justify-end'} py-1`}
                            >
                              {isEven && <span className="w-0 group-hover/link:w-6 h-[1.5px] bg-[#98712E] transition-all duration-300" />}
                              <span className="tracking-widest uppercase text-[11px] font-bold">{sub.name}</span>
                              {!isEven && <span className="w-0 group-hover/link:w-6 h-[1.5px] bg-[#98712E] transition-all duration-300" />}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm md:text-base text-[#76551C] leading-relaxed font-normal max-w-md mb-10">
                          Immerse yourself in our masterfully crafted {cat.name.toLowerCase()} pieces, where traditional techniques meet contemporary sophistication.
                        </p>
                      )}
                    </Reveal>

                    <Reveal delay={0.3} y={30}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="inline-flex items-center space-x-3 btn-luxury px-8 py-3.5 text-[10px] font-bold tracking-[0.35em] uppercase shadow-md hover:scale-105 transition-all"
                      >
                        <span>Explore {cat.name}</span>
                        <span>→</span>
                      </Link>
                    </Reveal>
                  </div>
                </div>

                {/* Subtle Expanding Hairline Divider Between Chapters */}
                {idx < CATEGORIES.length - 1 && (
                  <ExpandingDivider className="mt-24 md:mt-32" />
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
