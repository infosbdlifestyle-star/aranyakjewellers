"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CATEGORIES } from '@/constants/categories';
import { Reveal } from '@/components/animations/Reveal';
import { MouseParallaxImage } from '@/components/ui/MouseParallaxImage';
import { useRef } from 'react';

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yParallaxGrid = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacityParallax = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main className="min-h-screen flex flex-col bg-[#050202]" ref={containerRef}>
      
      {/* 1. Editorial Hero Section (Fixed Blend Mode & Image) */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-primary">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: yParallax, opacity: opacityParallax }}
        >
          <Image 
            src="/hero-banner.png" 
            alt="Aranyak Jewellers Collection" 
            fill
            className="object-cover animate-slow-zoom no-select opacity-70"
            priority
          />
        </motion.div>
        
        {/* Subtle Dark Gradient Overlay for Text Readability without destroying colors */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent pointer-events-none" />
        
        <div className="relative z-10 w-full px-6 flex flex-col items-center text-center mt-20">
            <Reveal y={30} duration={1}>
              <p className="text-secondary text-[9px] font-bold tracking-[0.8em] uppercase mb-8 drop-shadow-md">
                Legacy Since 1995
              </p>
            </Reveal>
            
            <div className="mask-clip">
              <Reveal delay={0.2} y={100} duration={1.2}>
                <h1 className="text-6xl sm:text-7xl md:text-[10rem] font-serif font-light text-white leading-[0.85] tracking-tight drop-shadow-2xl">
                  Timeless <br /> <span className="font-editorial text-secondary/90 italic ml-4 sm:ml-12 md:ml-32">Elegance</span>
                </h1>
              </Reveal>
            </div>

            <Reveal delay={0.6} y={30}>
              <div className="mt-16 md:mt-24">
                <Link 
                  href="/collections" 
                  className="group flex items-center space-x-6 text-white hover:text-secondary transition-colors duration-500"
                >
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Explore Collections</span>
                  <div className="w-16 h-[1px] bg-white/50 group-hover:bg-secondary group-hover:w-24 transition-all duration-500" />
                </Link>
              </div>
            </Reveal>
        </div>

        {/* Minimal Scroll Indicator */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center pb-8">
          <div className="w-[1px] h-24 bg-white/10 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full h-full bg-secondary origin-top animate-fill-down"
            />
          </div>
        </div>
      </section>

      {/* 4. Dynamic Marquee Banner */}
      <section className="bg-primary border-y border-white/10 py-3 overflow-hidden flex items-center shadow-inner">
        <div className="w-full flex whitespace-nowrap overflow-hidden">
          <div className="animate-marquee flex items-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-8 mx-8">
                <span className="text-[10px] tracking-[0.3em] font-bold text-secondary uppercase">100% BIS Hallmarked</span>
                <span className="text-secondary/50">✦</span>
                <span className="text-[10px] tracking-[0.3em] font-bold text-ivory uppercase">Certified Diamonds</span>
                <span className="text-secondary/50">✦</span>
                <span className="text-[10px] tracking-[0.3em] font-bold text-secondary uppercase">Legacy Since 1995</span>
                <span className="text-secondary/50">✦</span>
                <span className="text-[10px] tracking-[0.3em] font-bold text-ivory uppercase">Master Craftsmanship</span>
                <span className="text-secondary/50">✦</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. The Aranyak Philosophy (Typography Polish & Dark Premium Theme) */}
      <section className="py-20 md:py-28 bg-[#050202] text-white relative z-20 overflow-hidden border-b border-white/10">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row gap-16 md:gap-20 items-center">
            <div className="w-full md:w-5/12 space-y-10">
              <Reveal>
                <h2 className="text-sm font-bold tracking-[0.4em] uppercase text-secondary">The Philosophy</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <h3 className="text-5xl md:text-7xl font-serif font-light leading-tight text-balance tracking-wide text-white">
                  Masterpieces born from <span className="font-editorial italic">heritage</span> & crafted for eternity.
                </h3>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-sm md:text-base text-white/70 leading-loose font-light tracking-wide max-w-md">
                  We blend traditional Bengali artistry with contemporary silhouettes. Every facet tells a story of meticulous craftsmanship, uncompromising purity, and a legacy of trust spanning over 25 years.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <Link href="/about" className="inline-block mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:text-secondary transition-colors duration-300 border-b border-secondary/50 hover:border-secondary pb-2">
                  Read Our Story
                </Link>
              </Reveal>
            </div>
            
            <div className="w-full md:w-7/12 grid grid-cols-1 sm:grid-cols-2 mt-16 md:mt-0 border-t border-l border-white/10">
              {[
                { num: "I", title: "Purity", desc: "100% BIS Hallmarked gold and certified diamonds." },
                { num: "II", title: "Craft", desc: "Handcrafted by artisans carrying generations of skill." },
                { num: "III", title: "Trust", desc: "Transparent exchange policies for lifelong peace of mind." },
                { num: "IV", title: "Curation", desc: "Exclusive designs tailored for the modern connoisseur." }
              ].map((item, i) => (
                <Reveal key={i} delay={0.1 * i} y={30}>
                  <div className="group border-r border-b border-white/10 p-12 hover:bg-white/[0.02] transition-colors duration-700 h-full flex flex-col justify-between">
                    <div className="text-sm font-editorial text-white/40 mb-12">{item.num}</div>
                    <div>
                      <h4 className="text-2xl font-serif font-light mb-4 tracking-wide text-white">{item.title}</h4>
                      <p className="text-xs text-white/50 leading-relaxed tracking-wide font-light">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Image Break */}
      <section className="h-[60vh] w-full relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[#050202]/30 z-10" />
        <Image 
          src="/IMG_20260603_142707.jpg" 
          alt="Aranyak Craftsmanship" 
          fill 
          className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-[3s]" 
        />
        <div className="relative z-20 h-full flex items-center justify-center text-center px-6">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-white tracking-wide">
              The Art of <span className="font-editorial italic">Perfection</span>
            </h2>
          </Reveal>
        </div>
      </section>

      {/* 9. Curated Categories (Asymmetrical Grid with Parallax & Real Images) */}
      <section className="py-20 md:py-28 bg-[#050202] border-b border-white/10 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
          <div className="text-center mb-32 md:mb-40">
            <Reveal>
              <p className="text-[9px] tracking-[0.8em] uppercase text-white/50 mb-8">Curated Selections</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="text-6xl md:text-8xl font-serif font-light text-white tracking-tight">High <span className="font-editorial italic">Jewellery</span></h3>
            </Reveal>
          </div>

          <motion.div style={{ y: yParallaxGrid }} className="grid grid-cols-1 md:grid-cols-12 auto-rows-[500px] md:auto-rows-[600px]">
            
            {/* 3 & 5. Large Feature (Real Images & Glow) */}
            <Link href={`/category/${CATEGORIES[0]?.slug}`} className="md:col-span-7 row-span-1 relative group overflow-hidden bg-[#0A0505] flex items-center justify-center p-12 border border-white/10 transition-all duration-1000">
              <MouseParallaxImage src="/IMG_20260603_123905.png" alt="Gold Jewellery" intensity={15} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050202]/90 via-[#050202]/20 to-transparent" />
              <div className="relative z-10 text-center flex flex-col items-center justify-end h-full pb-8">
                <span className="text-[9px] tracking-[0.5em] uppercase text-white/70 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-1000 transform translate-y-4 group-hover:translate-y-0">Bespoke</span>
                <h4 className="text-5xl font-serif font-light text-white">{CATEGORIES[0]?.name || 'Gold'}</h4>
                <div className="mt-8 text-[9px] tracking-[0.4em] uppercase text-white border-b border-white pb-2 opacity-0 group-hover:opacity-100 transition-all duration-1000 transform translate-y-4 group-hover:translate-y-0">
                  Discover
                </div>
              </div>
            </Link>

            {/* Top Right */}
            <Link href={`/category/${CATEGORIES[1]?.slug}`} className="md:col-span-5 row-span-1 relative group overflow-hidden bg-[#0A0505] flex items-center justify-center p-8 border-t border-r border-b border-white/10 transition-all duration-1000">
              <MouseParallaxImage src="/IMG_20260603_142513.png" alt="Diamond Jewellery" intensity={15} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050202]/90 via-[#050202]/20 to-transparent" />
              <div className="relative z-10 text-center flex flex-col items-center justify-end h-full pb-8">
                <h4 className="text-4xl font-serif font-light text-white mb-6">{CATEGORIES[1]?.name || 'Diamond'}</h4>
                <div className="text-[9px] tracking-[0.4em] uppercase text-white border-b border-white pb-2 opacity-0 group-hover:opacity-100 transition-all duration-1000 transform translate-y-4 group-hover:translate-y-0">
                  Discover
                </div>
              </div>
            </Link>

            {/* Bottom Left */}
            <Link href={`/category/${CATEGORIES[2]?.slug}`} className="md:col-span-4 row-span-1 relative group overflow-hidden bg-[#0A0505] flex items-center justify-center p-8 border-l border-b border-r md:border-r-0 border-white/10 transition-all duration-1000">
               <MouseParallaxImage src="/IMG_20260603_142317.png" alt="Silver Jewellery" intensity={15} />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050202]/90 via-[#050202]/20 to-transparent" />
               <div className="relative z-10 text-center flex flex-col items-center justify-end h-full pb-8">
                <h4 className="text-3xl font-serif font-light text-white mb-6">{CATEGORIES[2]?.name || 'Silver'}</h4>
                <div className="text-[9px] tracking-[0.4em] uppercase text-white border-b border-white pb-2 opacity-0 group-hover:opacity-100 transition-all duration-1000 transform translate-y-4 group-hover:translate-y-0">
                  Discover
                </div>
              </div>
            </Link>

            {/* Bottom Right Large */}
            <Link href="/category/gold" className="md:col-span-8 row-span-1 relative group overflow-hidden bg-[#0A0505] flex items-center justify-center p-12 border-l md:border-l-0 border-r border-b border-white/10 transition-all duration-1000">
              <MouseParallaxImage src="/IMG_20260603_141113.png" alt="Bridal Edit" intensity={20} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050202]/90 via-[#050202]/30 to-transparent" />
              <div className="relative z-10 text-center flex flex-col items-center justify-end h-full pb-8">
                <span className="text-[9px] tracking-[0.5em] uppercase text-white/70 mb-6">The Heritage</span>
                <h4 className="text-4xl md:text-5xl font-serif font-light text-white mb-8">Bridal & <span className="font-editorial italic">Trousseau</span></h4>
                <div className="btn-luxury px-10 py-4 opacity-0 group-hover:opacity-100 transition-all duration-1000 transform translate-y-4 group-hover:translate-y-0 text-[9px] font-bold tracking-[0.4em] uppercase">
                  View Lookbook
                </div>
              </div>
            </Link>

          </motion.div>
          
          <div className="text-center mt-20 md:mt-32">
            <Reveal>
              <Link href="/collections" className="inline-flex items-center space-x-4 text-xs font-bold tracking-[0.3em] uppercase text-white hover:text-secondary transition-colors group">
                <span>View All Categories</span>
                <div className="w-12 h-[1px] bg-white/50 group-hover:bg-secondary transition-colors" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Showroom Editorial CTA */}
      <section className="relative py-24 overflow-hidden bg-primary border-t border-white/10">
        <div className="absolute inset-0">
          <Image 
            src="/showroom.jpg" 
            alt="Aranyak Jewellers Showroom" 
            fill 
            className="object-cover opacity-40 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/70 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center text-white">
          <Reveal>
            <div className="w-12 h-[1px] bg-secondary mx-auto mb-10" />
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="text-5xl md:text-7xl font-serif font-light mb-10 leading-tight">
              Experience the <br /> <span className="font-editorial italic text-secondary">Brilliance</span> in Person
            </h3>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-sm text-white/70 tracking-wider max-w-xl mx-auto leading-loose mb-16 font-light">
              Step into our luxurious boutiques across Tripura. Enjoy personalized consultations, private viewings, and bespoke design services with our master jewelers.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
              <Link 
                href="/stores" 
                className="bg-secondary text-primary px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-white transition-all duration-300 shadow-xl"
              >
                Find a Boutique
              </Link>
              <Link 
                href="/contact" 
                className="text-[10px] font-bold tracking-[0.3em] uppercase text-white hover-underline-gold pb-2"
              >
                Book Consultation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
