"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  TextReveal, 
  MagneticCard, 
  SparkleGlint, 
  ExpandingDivider, 
  StaggerContainer, 
  StaggerItem 
} from '@/components/animations/LuxuryMotion';

export default function CareGuideClient() {
  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#40352F] pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden selection:bg-[#C49A45] selection:text-[#211813]">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[55%] h-[55%] bg-[#C49A45]/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[#FAF7F0] border border-[#DED2C1]/60 blur-[130px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* 1. Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#241B17] text-[#E7C880] border border-[#C49A45]/30 text-[10px] uppercase font-bold tracking-[0.3em] mb-6 shadow-sm"
          >
            <SparkleGlint color="#E7C880" size={12}>
              <span>✦</span>
            </SparkleGlint>
            Master Goldsmith Tips
          </motion.div>

          <h1 className="text-4xl md:text-7xl font-serif font-light mb-6 leading-tight text-[#241B17] tracking-tight">
            <TextReveal text="Jewellery" />{' '}
            <span className="font-editorial italic text-[#98712E]">Care Guide</span>
          </h1>

          <p className="text-[#40352F] font-normal max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            Fine jewellery is crafted to endure through generations. Follow our master karigars' 
            essential advice to preserve the brilliance, purity, and lustrous sheen of your heirloom treasures.
          </p>
        </div>

        {/* 2. Care Chapters */}
        <div className="space-y-28">
          
          {/* Chapter 1: 22K Gold Care */}
          <section className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="w-full md:w-1/2">
              <MagneticCard tiltAmount={5} glareOpacity={0.15}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl group border border-[#DED2C1] shadow-2xl bg-[#211813]">
                  <Image 
                    src="/gold_temple_nakshi.jpg" 
                    alt="Gold Jewellery Care" 
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211713]/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 text-[#FFF8EB]">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C49A45] block mb-1">Chapter 01</span>
                    <h3 className="text-xl font-serif">22K BIS Hallmarked Gold</h3>
                  </div>
                </div>
              </MagneticCard>
            </div>

            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-[#98712E] bg-[#FAF7F0] border border-[#DED2C1] px-3 py-1 rounded">
                Daily Rituals
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-[#241B17]">
                Caring for Pure Gold
              </h2>
              
              <ul className="space-y-5 text-[#40352F] font-normal text-sm leading-relaxed">
                <li className="flex items-start gap-4">
                  <span className="text-[#C49A45] font-bold text-base mt-0.5">✦</span>
                  <p><strong className="text-[#241B17]">Dedicated Compartments:</strong> Always store gold pieces individually in soft velvet pouches or silk-lined organizers to prevent scratches against harder stones.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#C49A45] font-bold text-base mt-0.5">✦</span>
                  <p><strong className="text-[#241B17]">Gentle Bath:</strong> Soak your gold pieces in lukewarm water with a drop of mild pH-neutral soap for 10 minutes. Clean gently with a baby-soft brush, then dry with lint-free chamois cloth.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#C49A45] font-bold text-base mt-0.5">✦</span>
                  <p><strong className="text-[#241B17]">Perfume & Chlorine Caution:</strong> Apply fragrances, hairsprays, and lotions before wearing gold. Never wear ornaments inside chlorinated swimming pools or saunas.</p>
                </li>
              </ul>
            </div>
          </section>

          <ExpandingDivider color="#C49A45" maxWidth="60%" />

          {/* Chapter 2: Diamonds & Solitaires */}
          <section className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16">
            <div className="w-full md:w-1/2">
              <MagneticCard tiltAmount={5} glareOpacity={0.15}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl group border border-[#DED2C1] shadow-2xl bg-[#211813]">
                  <Image 
                    src="/diamond_solitaire_ring.jpg" 
                    alt="Diamond Jewellery Care" 
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211713]/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 text-[#FFF8EB]">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C49A45] block mb-1">Chapter 02</span>
                    <h3 className="text-xl font-serif">Certified Natural Diamonds</h3>
                  </div>
                </div>
              </MagneticCard>
            </div>

            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-[#98712E] bg-[#FAF7F0] border border-[#DED2C1] px-3 py-1 rounded">
                Refractive Brilliance
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-[#241B17]">
                Maximizing Fire & Scintillation
              </h2>
              
              <ul className="space-y-5 text-[#40352F] font-normal text-sm leading-relaxed">
                <li className="flex items-start gap-4">
                  <span className="text-[#C49A45] font-bold text-base mt-0.5">✦</span>
                  <p><strong className="text-[#241B17]">Avoid Oil Contact:</strong> Diamonds naturally attract natural skin oils and culinary greases, creating a dulling film. Hold solitaire rings by their metal shanks rather than the diamond table.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#C49A45] font-bold text-base mt-0.5">✦</span>
                  <p><strong className="text-[#241B17]">Prong Inspection:</strong> Check prongs every 6 months by gently listening for rattling when tapped near the ear. Any looseness should be corrected immediately by our master setting team.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#C49A45] font-bold text-base mt-0.5">✦</span>
                  <p><strong className="text-[#241B17]">Ultrasonic Cleaning:</strong> Bring your solitaires to any Aranyak showroom annually for complimentary professional ultrasonic and high-pressure steam rejuvenation.</p>
                </li>
              </ul>
            </div>
          </section>

          <ExpandingDivider color="#C49A45" maxWidth="60%" />

          {/* Chapter 3: Silver & Natural Gemstones */}
          <section className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="w-full md:w-1/2">
              <MagneticCard tiltAmount={5} glareOpacity={0.15}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl group border border-[#DED2C1] shadow-2xl bg-[#211813]">
                  <Image 
                    src="/stone_sapphire_nila.jpg" 
                    alt="Gemstone Care" 
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211713]/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 text-[#FFF8EB]">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C49A45] block mb-1">Chapter 03</span>
                    <h3 className="text-xl font-serif">Emeralds, Rubies & Astrological Gems</h3>
                  </div>
                </div>
              </MagneticCard>
            </div>

            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-[#98712E] bg-[#FAF7F0] border border-[#DED2C1] px-3 py-1 rounded">
                Delicate Crystals
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-[#241B17]">
                Precious Gemstones & Silver
              </h2>
              
              <ul className="space-y-5 text-[#40352F] font-normal text-sm leading-relaxed">
                <li className="flex items-start gap-4">
                  <span className="text-[#C49A45] font-bold text-base mt-0.5">✦</span>
                  <p><strong className="text-[#241B17]">Porous Gemstones (Emeralds & Pearls):</strong> Never use steam or ultrasonic baths on Emeralds (Panna), Pearls (Moti), or Coral (Raktaprobhal). Wipe only with a soft damp microfiber cloth.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#C49A45] font-bold text-base mt-0.5">✦</span>
                  <p><strong className="text-[#241B17]">Silver Tarnish Prevention:</strong> Silver reacts with atmospheric sulfur. Storing silver ornaments in airtight zip-locks with anti-tarnish silica tabs prevents oxidation.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-[#C49A45] font-bold text-base mt-0.5">✦</span>
                  <p><strong className="text-[#241B17]">Sunlight & Thermal Shock:</strong> Avoid leaving coloured gems under direct hot dashboard sunlight for extended periods to preserve crystal saturation.</p>
                </li>
              </ul>
            </div>
          </section>

        </div>

        {/* 3. Master Checklist Grid */}
        <div className="mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light text-[#241B17]">
              The Patron&apos;s <span className="font-editorial italic text-[#C49A45]">Dos &amp; Don&apos;ts</span>
            </h2>
          </div>

          <StaggerContainer delay={0.1} staggerTime={0.1}>
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* DO */}
              <StaggerItem>
                <div className="p-8 bg-[#FFFDF8] border border-[#DED2C1] rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-[#98712E]">
                    <span className="w-8 h-8 rounded-full bg-[#FAF7F0] border border-[#DED2C1] flex items-center justify-center font-bold text-sm">✓</span>
                    <h3 className="font-serif text-lg text-[#241B17]">Recommended Practices</h3>
                  </div>
                  <ul className="space-y-3 text-xs text-[#40352F] leading-relaxed">
                    <li>• Put jewellery on last when dressing and take it off first when retiring.</li>
                    <li>• Fasten necklace clasps before storing to prevent delicate chains from tangling.</li>
                    <li>• Keep hallmark and gem certification cards in a safe, documented place.</li>
                    <li>• Visit our showrooms for complimentary yearly ultrasonic spa cleaning.</li>
                  </ul>
                </div>
              </StaggerItem>

              {/* DON'T */}
              <StaggerItem>
                <div className="p-8 bg-[#FFFDF8] border border-[#DED2C1] rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-[#98712E]">
                    <span className="w-8 h-8 rounded-full bg-[#FAF7F0] border border-[#DED2C1] flex items-center justify-center font-bold text-sm">✕</span>
                    <h3 className="font-serif text-lg text-[#241B17]">What to Avoid</h3>
                  </div>
                  <ul className="space-y-3 text-xs text-[#40352F] leading-relaxed">
                    <li>• Never use bleach, acetone, or abrasive toothpaste on fine jewellery.</li>
                    <li>• Avoid wearing delicate rings while weight training or performing heavy chores.</li>
                    <li>• Never toss diamonds and pearl jewellery together into a single open pouch.</li>
                    <li>• Do not expose precious gemstones to sudden extreme temperature shifts.</li>
                  </ul>
                </div>
              </StaggerItem>

            </div>
          </StaggerContainer>
        </div>

        {/* 4. Boutique Service CTA */}
        <div className="mt-28">
          <MagneticCard tiltAmount={4} glareOpacity={0.12}>
            <div className="text-center bg-[#211813] text-[#FFF8EB] border border-[#C49A45]/30 rounded-2xl p-10 sm:p-14 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-xl mx-auto space-y-6">
                <SparkleGlint color="#C49A45" size={16}>
                  <div className="text-[#C49A45] text-2xl font-serif">✧</div>
                </SparkleGlint>
                
                <h2 className="text-3xl md:text-4xl font-serif font-light text-[#FFF8EB]">
                  Need Professional Boutique Cleaning?
                </h2>
                
                <p className="text-[#E5D7C5] text-sm font-normal leading-relaxed">
                  Visit any of our 4 flagship showrooms across Tripura for complimentary ultrasonic cleaning, prong-tightening, and authenticity checks.
                </p>

                <div className="pt-2">
                  <Link
                    href="/stores"
                    className="btn-luxury px-10 py-4 uppercase tracking-widest text-[10px] font-bold shadow-xl inline-block"
                  >
                    Locate Nearest Boutique
                  </Link>
                </div>
              </div>
            </div>
          </MagneticCard>
        </div>

      </div>
    </main>
  );
}
