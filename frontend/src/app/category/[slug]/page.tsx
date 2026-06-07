"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import { useParams } from 'next/navigation';
import { Reveal } from '@/components/animations/Reveal';
import { api } from '@/lib/api';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const category = CATEGORIES.find(c => c.slug === slug);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [category]);

  const fetchProducts = async () => {
    try {
      const filters: Record<string, string> = {};
      if (category?.name) filters.category = category.name;
      const data = await api.getProducts(filters);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <section className="py-32 burgundy-gradient text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 silk-texture opacity-30 mix-blend-overlay" />
        <div className="relative z-10">
          <Reveal>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif font-light mb-6 tracking-tight capitalize">
              {category?.name || slug.replace(/-/g, ' ')}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex items-center justify-center space-x-6">
              <div className="h-[1px] w-12 bg-secondary/50" />
              <p className="text-[10px] tracking-[0.5em] font-bold uppercase text-ivory/80">The Collection</p>
              <div className="h-[1px] w-12 bg-secondary/50" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 flex-1">
        <div className="container mx-auto px-6 max-w-7xl">
          {category?.subcategories && category.subcategories.length > 0 ? (
            <>
              <Reveal>
                <div className="text-center mb-24">
                  <p className="text-primary/70 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
                    Discover our exquisite range of {category.name.toLowerCase()} jewellery, handcrafted by master artisans with the finest materials and BIS Hallmark certification. Select a chapter below to explore.
                  </p>
                </div>
              </Reveal>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.subcategories.map((sub, i) => (
                  <Reveal key={sub.id} delay={i * 0.1} y={40}>
                    <Link
                      href={`/category/${slug}/${sub.slug}`}
                      className="group relative aspect-square overflow-hidden bg-white border border-border hover:border-secondary/30 hover:shadow-2xl transition-all duration-500 flex flex-col items-center justify-center p-8 text-center"
                    >
                      <div className="text-7xl font-serif font-light text-primary/5 group-hover:text-primary/10 group-hover:scale-110 transition-all duration-700 mb-6">
                        {sub.name[0]}
                      </div>
                      <h3 className="text-2xl font-serif font-light text-primary mb-4">{sub.name}</h3>
                      <div className="w-8 h-[1px] bg-primary/20 group-hover:bg-secondary group-hover:w-16 transition-all duration-500 mb-4" />
                      <p className="text-[9px] tracking-[0.3em] font-bold uppercase text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500">Explore Collection</p>
                      
                      {/* Decorative border */}
                      <div className="absolute inset-4 border border-primary/0 group-hover:border-primary/5 transition-all duration-700 pointer-events-none" />
                    </Link>
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
            /* Direct Products Gallery if no subcategories (e.g. Costume Jewellery) */
            <>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[4/5] bg-primary/5" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                  {products.map((p, i) => (
                    <Reveal key={p.id} delay={(i % 3) * 0.1} y={40}>
                      <div className="group cursor-pointer">
                        <div className="relative aspect-[4/5] bg-ivory overflow-hidden mb-6 border border-border group-hover:border-secondary/30 transition-colors duration-500">
                          {p.images && p.images[0] ? (
                            <img 
                              src={p.images[0]} 
                              alt={p.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 mix-blend-multiply" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary/20 font-serif text-6xl">
                              {p.name[0]}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-[9px] uppercase tracking-widest text-secondary font-bold">{p.goldPurity}KT • {p.goldWeight}g</p>
                          <h3 className="text-xl font-serif font-light text-primary">{p.name}</h3>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 space-y-8">
                  <div className="text-6xl text-secondary font-serif">✧</div>
                  <h2 className="text-4xl font-serif font-light text-primary">Collection Coming Soon</h2>
                  <p className="text-primary/70 max-w-md mx-auto leading-loose font-light">
                    Our artisans are handcrafting exquisite pieces for this collection. Visit our showroom to explore in person.
                  </p>
                  <div className="pt-8">
                    <Link
                      href="/stores"
                      className="inline-block bg-primary text-white px-10 py-5 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-secondary transition-all shadow-xl"
                    >
                      Visit Showroom
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
