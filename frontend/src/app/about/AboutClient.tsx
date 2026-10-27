"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  TextReveal, 
  MagneticCard, 
  SparkleGlint, 
  StaggerContainer, 
  StaggerItem, 
  ExpandingDivider 
} from '@/components/animations/LuxuryMotion';

interface AboutClientProps {
  settings: Record<string, any>;
  mediaMap?: Record<string, string>;
}

const PILLARS = [
  {
    num: 'I',
    title: '100% BIS Hallmarked',
    desc: 'Absolute transparency in purity. Every gram accounted for with unique laser HUID certification.'
  },
  {
    num: 'II',
    title: '25+ Years of Trust',
    desc: 'Founded in 1995, delivering three generations of uncompromising integrity and artistry in Tripura.'
  },
  {
    num: 'III',
    title: '04 Luxury Boutiques',
    desc: 'Flagship showrooms in Agartala, Khowai, Dharmanagar, and Kailashahar for your comfort.'
  },
  {
    num: 'IV',
    title: 'Lifetime Exchange',
    desc: '100% gold weight value buy-back guarantee safeguarding your heirloom investment forever.'
  }
];

export default function AboutClient({ settings = {}, mediaMap = {} }: AboutClientProps) {
  const heroBackdrop = mediaMap['about_hero_image'] || "/hero-banner.png";
  const mdPhoto = mediaMap['about_md_image'] || settings['about_md_image'] || "/md.jpg";

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#76551C] selection:bg-[#C49A45] selection:text-[#211813]">
      
      {/* 1. Editorial Hero */}
      <section className="py-28 md:py-36 px-6 md:px-12 text-left relative overflow-hidden bg-[#211813] text-[#FFF8EC] border-b border-[#DED2C1]/15">
        <div 
          style={{ backgroundImage: `url('${heroBackdrop}')` }}
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity scale-105 transition-transform duration-1000" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#211813]/90 via-[#211813]/70 to-[#211813]" />
        
        <div className="relative z-10 container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <SparkleGlint color="#E7C880" size={12}>
              <span className="text-[#E0BD72]">✧</span>
            </SparkleGlint>
            <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#E0BD72]">
              Heritage Est. 1995 • Tripura
            </p>
          </motion.div>

          <h1 className="text-5xl md:text-8xl font-serif font-light mb-6 tracking-tight text-[#FFF8EC]">
            <TextReveal text="Our Generational" />{' '}
            <span className="font-editorial italic gold-gradient">Legacy</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xs sm:text-sm text-[#E5D9C8] font-normal tracking-widest uppercase max-w-xl leading-relaxed"
          >
            Three decades of preserving traditional Bengali goldsmithing and crafting cherished bridal heirlooms.
          </motion.p>
        </div>
      </section>

      {/* 2. Story Section - Asymmetrical Magazine Layout */}
      <section className="py-24 bg-[#FAF7F0]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center">
            
            {/* Image Side with 3D Magnetic Frame */}
            <div className="w-full md:w-5/12 relative">
              <MagneticCard tiltAmount={5} glareOpacity={0.15}>
                <div className="relative aspect-[3/4] w-full bg-[#211813] overflow-hidden group border border-[#DED2C1] shadow-2xl rounded-xl">
                  <Image 
                    src={mdPhoto} 
                    alt="Managing Director - Aranyak Jewellers" 
                    fill
                    className="object-cover grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Luxury Inner Filigree Inset Frame */}
                  <div className="absolute inset-4 border border-[#D6B15D]/40 rounded pointer-events-none group-hover:border-[#D6B15D] transition-colors duration-500" />
                  <div className="absolute top-6 left-6 text-[10px] font-mono tracking-widest uppercase text-[#D6B15D]/70 bg-[#211813]/80 px-2 py-0.5 rounded backdrop-blur-sm">
                    Founder & Managing Director
                  </div>
                </div>
              </MagneticCard>
              
              {/* Overlapping Text Box (Editorial Quote) */}
              <div className="hidden md:block absolute -right-12 bottom-12 z-20 max-w-xs">
                <MagneticCard tiltAmount={4} glareOpacity={0.12}>
                  <div className="bg-[#211813] p-8 border border-[#D6B15D]/50 shadow-2xl rounded-lg">
                    <p className="font-editorial text-2xl leading-snug text-[#FFF8EC] relative z-10">
                      &ldquo;Preserving traditions while defining Tripura&apos;s elegance for over a quarter of a century.&rdquo;
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-[#D6B15D]/30 pt-4">
                      <p className="text-[9px] font-bold tracking-[0.4em] uppercase text-[#D6B15D]">
                        &mdash; The Founder
                      </p>
                      <SparkleGlint color="#C49A45" size={10}>
                        <span className="text-[#D6B15D]">✦</span>
                      </SparkleGlint>
                    </div>
                  </div>
                </MagneticCard>
              </div>
            </div>

            {/* Text Side */}
            <div className="w-full md:w-7/12 space-y-12">
              <div className="space-y-6">
                <div className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-[#966719] bg-[#FFFDF8] border border-[#DED2C1] px-3 py-1 rounded">
                  Crafted by Master Karigars
                </div>
                
                <h2 className="text-4xl md:text-5xl font-serif font-light text-[#211813] tracking-tight">
                  <TextReveal text="A Vision of Uncompromising" />{' '}
                  <span className="font-editorial italic gold-gradient text-[#8A5A12]">Purity</span>
                </h2>
                
                <p className="text-[#40352F] leading-[1.8] tracking-wide font-normal text-base">
                  {settings['about_p1'] || "Aranyak Jewellers is not just a destination for fine jewelry; it is an institution built on trust, artistry, and heritage. What began as a singular vision in 1995 has blossomed into Tripura's most prestigious jewelry house."}
                </p>
                <p className="text-[#40352F] leading-[1.8] tracking-wide font-normal text-base">
                  {settings['about_p2'] || "We believe that every piece of jewelry carries a soul. It is a silent witness to life's most profound moments—a wedding vow, a milestone anniversary, a gift of enduring love. Our master artisans, carrying centuries-old Bengali goldsmithing traditions, pour hundreds of hours into realizing these masterpieces."}
                </p>
              </div>

              {/* 4 Pillars with Staggered Entrance and Hover Glow */}
              <StaggerContainer delay={0.1} staggerTime={0.12}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {PILLARS.map((pillar, idx) => (
                    <StaggerItem key={idx}>
                      <div className="p-6 bg-[#FFFDF8] hover:bg-[#FFFDF8] border border-[#DED2C1] hover:border-[#D6B15D] transition-all duration-300 rounded-xl shadow-sm group">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-editorial text-[#8A5A12] font-bold group-hover:scale-110 transition-transform">
                            {pillar.num}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C49A45]/40 group-hover:bg-[#C49A45] transition-colors" />
                        </div>
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2 text-[#211813] group-hover:text-[#8A5A12] transition-colors">
                          {pillar.title}
                        </h3>
                        <p className="text-xs text-[#40352F] leading-relaxed font-normal">
                          {pillar.desc}
                        </p>
                      </div>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>

            </div>

          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <ExpandingDivider color="#C49A45" maxWidth="75%" />

      {/* 3. Artisan Craftsmanship Section */}
      <section className="py-24 bg-[#FAF7F0] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#966719] mb-3 block">
              The Living Tradition
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-[#211813]">
              Centuries-Old <span className="font-editorial italic gold-gradient text-[#8A5A12]">Bengali Karigari</span>
            </h2>
            <p className="text-[#40352F] mt-4 text-sm font-normal leading-relaxed">
              From the intricate swirls of Filigree (Tarakasi) to the regal sculptures of Nakshi work, our master jewelers breathe timeless elegance into pure 22 Karat gold.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <MagneticCard tiltAmount={4} glareOpacity={0.12}>
              <div className="bg-[#FFFDF8] border border-[#DED2C1] p-8 rounded-xl shadow-sm text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#211813] text-[#E0BD72] flex items-center justify-center font-serif text-xl">
                  ১
                </div>
                <h3 className="text-lg font-serif text-[#211813]">Intricate Filigree (তারকাশি)</h3>
                <p className="text-xs text-[#40352F] leading-relaxed">
                  Delicate gold threads hand-twisted and soldered into ethereal leaf and floral motifs with microscopic precision.
                </p>
              </div>
            </MagneticCard>

            <MagneticCard tiltAmount={4} glareOpacity={0.12}>
              <div className="bg-[#FFFDF8] border border-[#DED2C1] p-8 rounded-xl shadow-sm text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#211813] text-[#E0BD72] flex items-center justify-center font-serif text-xl">
                  ২
                </div>
                <h3 className="text-lg font-serif text-[#211813]">Nakshi Embossing (নকশী)</h3>
                <p className="text-xs text-[#40352F] leading-relaxed">
                  Deep dimensional relief carving evoking sacred deities, peacocks, and temple architecture on solid gold sheets.
                </p>
              </div>
            </MagneticCard>

            <MagneticCard tiltAmount={4} glareOpacity={0.12}>
              <div className="bg-[#FFFDF8] border border-[#DED2C1] p-8 rounded-xl shadow-sm text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#211813] text-[#E0BD72] flex items-center justify-center font-serif text-xl">
                  ৩
                </div>
                <h3 className="text-lg font-serif text-[#211813]">Jadau & Polki Setting</h3>
                <p className="text-xs text-[#40352F] leading-relaxed">
                  Natural uncut diamonds cradled in 24K gold foil settings accented with rich Meenakari enameling on reverse.
                </p>
              </div>
            </MagneticCard>
          </div>
        </div>
      </section>

      {/* 4. Full Width Quote */}
      <section className="py-28 bg-[#211813] text-[#FFF8EC] text-center px-6 border-y border-[#DED2C1]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient opacity-10 pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <SparkleGlint color="#C49A45" size={18}>
            <div className="text-[#D6B15D] text-xl font-serif">✧</div>
          </SparkleGlint>

          <h2 className="text-3xl md:text-5xl font-serif font-light leading-snug text-[#FFF8EC]">
            &ldquo;Every gram of gold that leaves our stores carries our{' '}
            <span className="font-editorial italic text-[#D6B15D]">solemn promise</span> of authenticity.&rdquo;
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/collections"
              className="btn-luxury px-10 py-3.5 text-xs font-bold uppercase tracking-widest inline-block shadow-xl"
            >
              Explore Collections
            </Link>
            <Link
              href="/stores"
              className="px-10 py-3.5 text-xs font-bold uppercase tracking-widest text-[#FFF8EC] bg-[#211813] hover:bg-[#C9A04A] hover:text-[#211813] border border-[#D6B15D]/40 rounded transition-all inline-block shadow-md"
            >
              Visit Our Boutiques
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
