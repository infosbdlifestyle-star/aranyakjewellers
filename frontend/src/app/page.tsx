"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CATEGORIES } from '@/constants/categories';
import { Reveal } from '@/components/animations/Reveal';
import { useRef } from 'react';

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityParallax = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main className="min-h-screen flex flex-col silk-texture bg-ivory" ref={containerRef}>
      
      {/* Editorial Hero Section */}
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
            className="object-cover animate-slow-zoom no-select opacity-90 mix-blend-luminosity"
            priority
          />
        </motion.div>
        
        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-primary/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 w-full px-6 flex flex-col items-center text-center mt-20">
            <Reveal y={30} duration={1}>
              <p className="text-secondary text-[9px] font-bold tracking-[0.8em] uppercase mb-8 drop-shadow-md">
                Legacy Since 1995
              </p>
            </Reveal>
            
            <div className="mask-clip">
              <Reveal delay={0.2} y={100} duration={1.2}>
                <h1 className="text-6xl sm:text-7xl md:text-[10rem] font-serif font-light text-white leading-[0.85] tracking-tight drop-shadow-2xl mix-blend-overlay">
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

      {/* The Aranyak Philosophy (Editorial Layout) */}
      <section className="py-40 bg-ivory text-primary relative z-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="w-full md:w-5/12 space-y-10">
              <Reveal>
                <h2 className="text-sm font-bold tracking-[0.4em] uppercase text-secondary">The Philosophy</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <h3 className="text-5xl md:text-6xl font-serif font-light leading-tight text-balance">
                  Masterpieces born from <span className="font-editorial italic">heritage</span> & crafted for eternity.
                </h3>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-sm text-primary/70 leading-relaxed font-light tracking-wide max-w-sm">
                  We blend traditional Bengali artistry with contemporary silhouettes. Every facet tells a story of meticulous craftsmanship, uncompromising purity, and a legacy of trust spanning over 25 years.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <Link href="/about" className="inline-block mt-4 text-[10px] font-bold uppercase tracking-[0.3em] hover-underline-gold pb-2">
                  Read Our Story
                </Link>
              </Reveal>
            </div>
            
            <div className="w-full md:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 md:mt-0">
              {[
                { num: "01", title: "Purity", desc: "100% BIS Hallmarked gold and certified diamonds." },
                { num: "02", title: "Craft", desc: "Handcrafted by artisans carrying generations of skill." },
                { num: "03", title: "Trust", desc: "Transparent exchange policies for lifelong peace of mind." },
                { num: "04", title: "Curation", desc: "Exclusive designs tailored for the modern connoisseur." }
              ].map((item, i) => (
                <Reveal key={i} delay={0.1 * i} y={30}>
                  <div className="group border-l border-primary/10 pl-8 py-2 hover:border-secondary transition-colors duration-500">
                    <div className="text-5xl font-editorial text-primary/10 mb-4 group-hover:text-secondary/30 transition-colors duration-500">{item.num}</div>
                    <h4 className="text-xl font-serif font-medium mb-3">{item.title}</h4>
                    <p className="text-xs text-primary/60 leading-relaxed tracking-wide">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Curated Categories (Collage Layout) */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="text-center mb-24">
            <Reveal>
              <p className="text-[10px] tracking-[0.5em] uppercase text-secondary font-bold mb-6">Curated Selections</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="text-5xl md:text-7xl font-serif font-light text-primary">High <span className="font-editorial italic">Jewellery</span></h3>
            </Reveal>
          </div>

          {/* Asymmetrical Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 auto-rows-[300px] md:auto-rows-[400px]">
            
            {/* Large Feature (Left) */}
            <div className="md:col-span-7 row-span-1 relative group overflow-hidden bg-ivory flex items-center justify-center p-12 hover:shadow-2xl transition-all duration-700">
              <div className="absolute inset-0 bg-[url('/featured-earrings.png')] bg-cover bg-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 mix-blend-multiply" />
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/20 transition-all duration-700" />
              <div className="relative z-10 text-center flex flex-col items-center">
                <span className="text-[10px] tracking-[0.3em] uppercase text-secondary mb-4 font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">Bespoke</span>
                <h4 className="text-5xl font-serif font-light text-primary group-hover:text-white transition-colors duration-500">{CATEGORIES[0]?.name || 'Gold'}</h4>
                <Link href={`/category/${CATEGORIES[0]?.slug}`} className="mt-8 text-xs tracking-[0.2em] uppercase text-primary border-b border-primary/30 pb-1 group-hover:text-white group-hover:border-white/50 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                  Discover Collection
                </Link>
              </div>
            </div>

            {/* Top Right */}
            <div className="md:col-span-5 row-span-1 relative group overflow-hidden bg-[#F5F5F0] flex items-center justify-center p-8 hover:shadow-xl transition-all duration-500">
              <div className="absolute inset-0 bg-[url('/modern-aura.png')] bg-cover bg-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 mix-blend-multiply" />
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/40 transition-all duration-700" />
              <div className="relative z-10 text-center">
                <h4 className="text-4xl font-serif font-light text-primary group-hover:text-white transition-colors duration-500">{CATEGORIES[1]?.name || 'Diamond'}</h4>
                <Link href={`/category/${CATEGORIES[1]?.slug}`} className="absolute inset-0 z-20"><span className="sr-only">View Collection</span></Link>
              </div>
            </div>

            {/* Bottom Left */}
            <div className="md:col-span-4 row-span-1 relative group overflow-hidden bg-[#FAFAFA] flex items-center justify-center p-8 hover:shadow-xl transition-all duration-500">
               <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/80 transition-all duration-700" />
               <div className="relative z-10 text-center">
                <h4 className="text-3xl font-serif font-light text-primary group-hover:text-secondary transition-colors duration-500">{CATEGORIES[2]?.name || 'Silver'}</h4>
                <Link href={`/category/${CATEGORIES[2]?.slug}`} className="absolute inset-0 z-20"><span className="sr-only">View Collection</span></Link>
              </div>
            </div>

            {/* Bottom Right Large */}
            <div className="md:col-span-8 row-span-1 relative group overflow-hidden bg-primary flex items-center justify-center p-12 hover:shadow-2xl transition-all duration-700">
              <div className="absolute inset-0 opacity-20 bg-[url('/bridal-edit.png')] bg-cover bg-center group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0" />
              <div className="relative z-10 text-center flex flex-col items-center">
                <h4 className="text-4xl md:text-5xl font-serif font-light text-white mb-6">Bridal & <span className="font-editorial italic text-secondary">Trousseau</span></h4>
                <Link href="/category/gold" className="text-[10px] tracking-[0.3em] uppercase text-white hover-underline-gold pb-1">
                  View Bridal Lookbook
                </Link>
              </div>
            </div>

          </div>
          
          <div className="text-center mt-20">
            <Reveal>
              <Link href="/collections" className="inline-flex items-center space-x-4 text-xs font-bold tracking-[0.3em] uppercase text-primary hover:text-secondary transition-colors group">
                <span>View All Categories</span>
                <div className="w-12 h-[1px] bg-primary group-hover:bg-secondary transition-colors" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Showroom Editorial CTA */}
      <section className="relative py-40 overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <Image 
            src="/showroom.jpg" 
            alt="Aranyak Jewellers Showroom" 
            fill 
            className="object-cover opacity-30 mix-blend-luminosity animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
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
            <p className="text-xs md:text-sm text-white/60 tracking-wider max-w-xl mx-auto leading-loose mb-16 font-light">
              Step into our luxurious boutiques across Tripura. Enjoy personalized consultations, private viewings, and bespoke design services with our master jewelers.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link 
                href="/stores" 
                className="bg-secondary text-primary px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-white transition-all duration-300"
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
