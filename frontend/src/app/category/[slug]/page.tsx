"use client";

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import { useParams } from 'next/navigation';
import { Reveal } from '@/components/animations/Reveal';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const category = CATEGORIES.find(c => c.slug === slug);

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <section className="py-24 burgundy-gradient text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <Reveal>
            <h1 className="text-6xl font-serif font-bold mb-6 tracking-tight capitalize">
              {category?.name || slug.replace(/-/g, ' ')}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex items-center justify-center space-x-6">
              <div className="h-[1px] w-12 bg-secondary/50" />
              <p className="text-xs tracking-[0.5em] uppercase text-ivory/80">Explore Our Collection</p>
              <div className="h-[1px] w-12 bg-secondary/50" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 flex-1">
        <div className="container mx-auto px-4 max-w-6xl">
          {category?.subcategories && category.subcategories.length > 0 ? (
            <>
              <Reveal>
                <div className="text-center mb-16">
                  <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Discover our exquisite range of {category.name.toLowerCase()} jewellery, handcrafted by master artisans with the finest materials and BIS Hallmark certification.
                  </p>
                </div>
              </Reveal>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {category.subcategories.map((sub, i) => (
                  <Reveal key={sub.id} delay={i * 0.05}>
                    <Link
                      href={`/category/${slug}/${sub.slug}`}
                      className="group relative aspect-square overflow-hidden bg-ivory border border-border hover:border-secondary/30 hover:shadow-2xl transition-all duration-500 flex flex-col items-center justify-center p-6 text-center"
                    >
                      <div className="text-5xl font-serif text-primary/10 group-hover:text-primary/20 group-hover:scale-125 transition-all duration-700 mb-4">
                        {sub.name[0]}
                      </div>
                      <h3 className="text-sm font-serif font-bold text-primary uppercase tracking-wider">{sub.name}</h3>
                      <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Explore</p>
                      <div className="absolute inset-3 border border-primary/0 group-hover:border-primary/10 transition-all duration-700 pointer-events-none" />
                    </Link>
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 space-y-6">
              <div className="text-6xl text-primary/10 font-serif">✧</div>
              <h2 className="text-2xl font-serif font-bold text-primary italic">Collection Coming Soon</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Our artisans are handcrafting exquisite pieces for this collection. Visit our showroom to explore in person.
              </p>
              <Link
                href="/stores"
                className="inline-block bg-primary text-white px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-secondary transition-all shadow-xl"
              >
                Visit Showroom
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
