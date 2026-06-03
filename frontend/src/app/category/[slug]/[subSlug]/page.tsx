"use client";

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import { useParams } from 'next/navigation';
import { Reveal } from '@/components/animations/Reveal';

export default function SubCategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const subSlug = params?.subSlug as string;

  const category = CATEGORIES.find(c => c.slug === slug);
  const subCategory = category?.subcategories?.find(s => s.slug === subSlug);

  if (!category || !subCategory) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-light text-primary mb-4">Collection Not Found</h1>
          <Link href="/collections" className="text-xs tracking-[0.3em] uppercase text-secondary hover-underline-gold pb-1">
            Back to Collections
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-ivory overflow-hidden">
      {/* Editorial Hero */}
      <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center bg-primary overflow-hidden">
        {/* Abstract luxury background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#1A0A0A]" />
        <div className="absolute inset-0 opacity-20 silk-texture mix-blend-overlay" />
        
        {/* Massive Initial Letter */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <Reveal>
            <span className="text-[30vw] font-serif font-light text-white/5 select-none leading-none transform translate-y-12">
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
              <h1 className="text-5xl md:text-8xl font-serif font-light text-white leading-tight tracking-tight mb-8">
                The <span className="font-editorial italic text-secondary/90">{subCategory.name}</span>
              </h1>
            </Reveal>
          </div>
          
          <Reveal delay={0.3}>
            <div className="w-[1px] h-24 bg-secondary mx-auto mt-8" />
          </Reveal>
        </div>
      </section>

      {/* Lookbook / Coming Soon Section */}
      <section className="py-40">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <Reveal y={40}>
            <div className="text-secondary text-5xl mb-12">✧</div>
          </Reveal>
          
          <Reveal delay={0.1} y={40}>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-primary mb-12 leading-tight">
              An Exquisite Selection <br /> <span className="font-editorial italic text-secondary">Awaits You</span>
            </h2>
          </Reveal>
          
          <Reveal delay={0.2} y={40}>
            <p className="text-sm text-primary/70 leading-loose tracking-wide font-light max-w-2xl mx-auto mb-16">
              Our master artisans are currently handcrafting the next generation of masterpieces for the {subCategory.name} collection. Each piece is meticulously designed to reflect the pure elegance and heritage of Aranyak Jewellers.
            </p>
          </Reveal>
          
          <Reveal delay={0.3} y={40}>
            <div className="p-12 border border-primary/10 bg-white shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 group hover:border-secondary/30 transition-colors duration-500">
              <div className="text-left space-y-4">
                <h3 className="text-2xl font-serif font-light text-primary">Experience It In Person</h3>
                <p className="text-xs text-primary/60 tracking-wider">Visit our boutiques to explore our private reserves and exclusive designs.</p>
              </div>
              <div className="shrink-0">
                <Link
                  href="/stores"
                  className="bg-primary text-white px-10 py-5 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-secondary transition-colors duration-500 block"
                >
                  Find a Boutique
                </Link>
              </div>
            </div>
          </Reveal>
          
          <Reveal delay={0.4} y={40}>
             <div className="mt-32">
               <Link href={`/category/${category.slug}`} className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary hover-underline-gold pb-1">
                 Return to {category.name}
               </Link>
             </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
