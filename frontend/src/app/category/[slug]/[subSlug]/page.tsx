"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import { useParams } from 'next/navigation';
import { Reveal } from '@/components/animations/Reveal';
import { api } from '@/lib/api';

export default function SubCategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const subSlug = params?.subSlug as string;

  const category = CATEGORIES.find(c => c.slug === slug);
  const subCategory = category?.subcategories?.find(s => s.slug === subSlug);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category && subCategory) {
      fetchProducts();
    }
  }, [category, subCategory]);

  const fetchProducts = async () => {
    try {
      const filters: Record<string, string> = {};
      if (category?.name) filters.category = category.name;
      if (subCategory?.name) filters.subCategory = subCategory.name;
      const data = await api.getProducts(filters);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!category || !subCategory) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#050202] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-light mb-4">Collection Not Found</h1>
          <Link href="/" className="text-xs tracking-[0.3em] uppercase text-secondary hover-underline-gold pb-1">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#050202] text-white overflow-hidden">
      {/* Editorial Hero */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        {/* Abstract luxury background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050202] via-[#0A0505] to-[#1A0A0A]" />
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] bg-cover bg-center opacity-[0.06] mix-blend-luminosity" />
        <div className="absolute inset-0 opacity-20 silk-texture mix-blend-overlay" />
        
        {/* Massive Initial Letter */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <Reveal>
            <span className="text-[30vw] font-serif font-light text-white/[0.03] select-none leading-none transform translate-y-12">
              {subCategory.name[0]}
            </span>
          </Reveal>
        </div>

        <div className="relative z-10 text-center px-6 mt-16">
          <Reveal y={30}>
            <p className="text-[9px] font-bold tracking-[0.6em] uppercase text-secondary mb-8">
              {category.name} Collection
            </p>
          </Reveal>
          
          <div className="mask-clip">
            <Reveal delay={0.1} y={60} duration={1}>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-light text-white leading-tight tracking-tight mb-8">
                The <span className="font-editorial italic text-secondary/90">{subCategory.name}</span>
              </h1>
            </Reveal>
          </div>
          
          <Reveal delay={0.3}>
            <div className="w-[1px] h-24 bg-gradient-to-b from-secondary to-transparent mx-auto mt-8" />
          </Reveal>
        </div>
      </section>

      {/* Dynamic Gallery or Coming Soon */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-white/5" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
              {products.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.1} y={40}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[4/5] bg-[#0A0505] overflow-hidden mb-6 border border-white/10 group-hover:border-secondary/30 transition-colors duration-500">
                      {p.images && p.images[0] ? (
                        <img 
                          src={p.images[0]} 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 font-serif text-6xl">
                          {p.name[0]}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-500" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-[9px] uppercase tracking-widest text-secondary font-bold">{p.goldPurity}KT • {p.goldWeight}g</p>
                      <h3 className="text-xl font-serif font-light text-white">{p.name}</h3>
                      <p className="text-xs text-white/40 max-w-xs mx-auto line-clamp-2">{p.description || "An exquisite piece crafted with mastery."}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            /* Coming Soon Fallback */
            <div className="text-center py-20">
              <Reveal y={40}>
                <div className="text-secondary text-5xl mb-12">✧</div>
              </Reveal>
              <Reveal delay={0.1} y={40}>
                <h2 className="text-4xl md:text-6xl font-serif font-light text-white mb-12 leading-tight">
                  An Exquisite Selection <br /> <span className="font-editorial italic text-secondary">Awaits You</span>
                </h2>
              </Reveal>
              <Reveal delay={0.2} y={40}>
                <p className="text-sm text-white/50 leading-loose tracking-wide font-light max-w-2xl mx-auto mb-16">
                  Our master artisans are currently handcrafting the next generation of masterpieces for the {subCategory.name} collection. Each piece is meticulously designed to reflect the pure elegance and heritage of Aranyak Jewellers.
                </p>
              </Reveal>
            </div>
          )}

          <Reveal delay={0.3} y={40}>
             <div className="mt-24 text-center">
               <Link href={`/category/${category.slug}`} className="text-[10px] font-bold tracking-[0.3em] uppercase text-white hover-underline-gold pb-1">
                 Return to {category.name}
               </Link>
             </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
