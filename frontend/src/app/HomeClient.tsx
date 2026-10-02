"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

import { Reveal } from '@/components/animations/Reveal';
import { MouseParallaxImage } from '@/components/ui/MouseParallaxImage';
import { useRef, useState } from 'react';
import React from 'react';

interface HomeClientProps {
  settings: Record<string, string>;
  categories: any[];
  banners: any[];
  goldRates: any[];
}

// Fallback curated categories if API categories are sparse
const FALLBACK_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Bridal Heritage',
    slug: 'bridal-jewellery',
    imageUrl: '/hero-necklace.png',
    tagline: 'Handcrafted Trousseau Treasures',
    span: 'md:col-span-7'
  },
  {
    id: 'cat-2',
    name: 'Royal Gold',
    slug: 'gold-jewellery',
    imageUrl: '/showroom.jpg',
    tagline: '22K BIS Hallmarked Masterpieces',
    span: 'md:col-span-5'
  },
  {
    id: 'cat-3',
    name: 'Certified Diamonds',
    slug: 'diamond-jewellery',
    imageUrl: '/hero-banner.png',
    tagline: 'VVS-VS Solitaires & Fine Sets',
    span: 'md:col-span-4'
  },
  {
    id: 'cat-4',
    name: 'Temple & Antique',
    slug: 'antique-jewellery',
    imageUrl: '/IMG_20260603_141113.png',
    tagline: 'Sacred Iconography & Artisanal Craft',
    span: 'md:col-span-8'
  }
];

// Client Testimonials
const TESTIMONIALS = [
  {
    quote: "Aranyak Jewellers crafted my complete wedding trousseau. The craftsmanship on the choker necklace and the transparency in gold pricing were exceptional.",
    author: "Ananya Roy Chowdhury",
    location: "Agartala",
    rating: 5,
    tag: "Verified Bridal Buyer"
  },
  {
    quote: "The finest destination in Tripura for authentic astrological gems and certified diamonds. Their staff is extremely knowledgeable and welcoming.",
    author: "Dr. Subhashish Debbarma",
    location: "Udaipur",
    rating: 5,
    tag: "Loyal Customer (10+ Yrs)"
  },
  {
    quote: "Purchased custom 22K bangles for my mother's 50th birthday. The gold quality and finishing exceed top national brands.",
    author: "Priya Sengupta",
    location: "Dharmanagar",
    rating: 5,
    tag: "Bespoke Order"
  }
];

// Brand Statistics
const STATS = [
  { label: 'Years of Heritage', value: '25+' },
  { label: 'BIS Hallmarked Gold', value: '100%' },
  { label: 'Happy Families Served', value: '50,000+' },
  { label: 'Flagship Showrooms', value: '3+' }
];

export default function HomeClient({ settings, categories, banners, goldRates }: HomeClientProps) {
  const containerRef = useRef(null);
  const [activeRateTab, setActiveRateTab] = useState<'24k' | '22k' | '18k'>('22k');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yParallax = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yParallaxGrid = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacityParallax = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Normalize display categories
  const displayCategories = categories && categories.length >= 3 
    ? categories.slice(0, 4).map((c, i) => ({
        id: c.id || `cat-${i}`,
        name: c.name,
        slug: c.slug,
        imageUrl: c.imageUrl || (i === 0 ? '/hero-necklace.png' : i === 1 ? '/showroom.jpg' : '/hero-banner.png'),
        tagline: c.description || 'Exclusive Collection',
        span: i === 0 ? 'md:col-span-7' : i === 1 ? 'md:col-span-5' : i === 2 ? 'md:col-span-4' : 'md:col-span-8'
      }))
    : FALLBACK_CATEGORIES;

  // Extract gold rates or fallback
  const getRate = (purity: number, fallback: number) => {
    if (Array.isArray(goldRates) && goldRates.length > 0) {
      const match = goldRates.find((r: any) => r.purity === purity);
      if (match && match.pricePer10g) return match.pricePer10g;
    }
    return fallback;
  };

  const rate24k = getRate(24, 79000);
  const rate22k = getRate(22, 72500);
  const rate18k = getRate(18, 59300);

  return (
    <main className="min-h-screen flex flex-col bg-[#050202] text-white selection:bg-[#CBA135] selection:text-[#050202]" ref={containerRef}>
      
      {/* 1. Editorial Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050202] bg-radial-gold-top">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: yParallax, opacity: opacityParallax }}
        >
          <Image 
            src={banners && banners.length > 0 ? banners[0].imageUrl : "/hero-banner.png"} 
            alt="Aranyak Jewellers Masterpiece Collection" 
            fill
            className="object-cover animate-slow-zoom no-select opacity-60"
            priority
          />
        </motion.div>
        
        {/* Multi-layered Dark & Gold Ambient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050202] via-[#050202]/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050202]/80 via-transparent to-[#050202]/80 pointer-events-none" />
        
        <div className="relative z-10 w-full px-6 max-w-6xl flex flex-col items-center text-center pt-24 pb-16">
          
          {/* Est. Luxury Seal Badge */}
          <Reveal y={20} duration={1}>
            <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-[#0A0505]/80 backdrop-blur-md border border-[#CBA135]/40 mb-8 shadow-2xl">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CBA135] animate-pulse" />
              <span className="text-secondary text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase">
                EST. 1995 • TRIPURA'S FINEST JEWELLER
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#CBA135] animate-pulse" />
            </div>
          </Reveal>
          
          {/* Main Headline */}
          <div className="mask-clip">
            <Reveal delay={0.2} y={80} duration={1.2}>
              <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[10rem] font-serif font-light text-white leading-[0.85] tracking-tight drop-shadow-2xl">
                Timeless <br /> 
                <span className="font-editorial gold-gradient italic inline-block mt-2 sm:mt-4">
                  Elegance
                </span>
              </h1>
            </Reveal>
          </div>

          {/* Subtitle Narrative */}
          <Reveal delay={0.4} y={30}>
            <p className="mt-8 text-xs sm:text-sm md:text-base text-white/80 font-light tracking-widest max-w-2xl mx-auto leading-relaxed uppercase">
              Curating handcrafted gold, certified diamonds, and sacred astrological gemstones with 25+ years of master craftsmanship.
            </p>
          </Reveal>

          {/* Action CTAs */}
          <Reveal delay={0.6} y={30}>
            <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
              <Link 
                href="/collections" 
                className="btn-luxury px-10 py-4 text-[10px] font-bold tracking-[0.35em] uppercase rounded-none glow-gold transition-all duration-500 hover:scale-105"
              >
                Explore High Jewellery
              </Link>
              <Link 
                href="/stores" 
                className="px-10 py-4 text-[10px] font-bold tracking-[0.35em] uppercase text-white hover:text-secondary bg-[#0A0505]/60 backdrop-blur-md border border-white/20 hover:border-[#CBA135]/60 transition-all duration-500 hover:scale-105"
              >
                Find Boutique Showrooms
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Minimal Animated Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          <span className="text-[8px] font-bold tracking-[0.4em] uppercase text-white/40 mb-3">Scroll</span>
          <div className="w-[1px] h-16 bg-white/10 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full h-full bg-[#CBA135] origin-top animate-fill-down"
            />
          </div>
        </div>
      </section>

      {/* 2. Live Today's Gold Rate Ticker Bar */}
      <section className="relative z-20 bg-[#0A0505] border-y border-[#CBA135]/20 py-4 px-6">
        <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5D3B3]">
                Today's Gold Rate
              </span>
              <span className="text-[9px] text-white/40 uppercase tracking-widest hidden sm:inline">(Tripura Market)</span>
            </div>
          </div>

          {/* Rate Badges */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/10 px-4 py-2">
              <span className="text-[10px] font-serif font-bold text-white/70">24K Fine</span>
              <span className="text-xs font-serif font-light text-[#E5D3B3]">₹{rate24k.toLocaleString('en-IN')}<span className="text-[9px] text-white/40">/10g</span></span>
            </div>
            <div className="flex items-center space-x-2 bg-[#CBA135]/10 border border-[#CBA135]/40 px-4 py-2 glow-gold-sm">
              <span className="text-[10px] font-serif font-bold text-[#CBA135]">22K BIS 916</span>
              <span className="text-xs font-serif font-semibold text-white">₹{rate22k.toLocaleString('en-IN')}<span className="text-[9px] text-white/40">/10g</span></span>
            </div>
            <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/10 px-4 py-2 hidden sm:flex">
              <span className="text-[10px] font-serif font-bold text-white/70">18K Gold</span>
              <span className="text-xs font-serif font-light text-[#E5D3B3]">₹{rate18k.toLocaleString('en-IN')}<span className="text-[9px] text-white/40">/10g</span></span>
            </div>
          </div>

          <Link href="/gold-rate" className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/60 hover:text-[#CBA135] transition-colors border-b border-white/20 hover:border-[#CBA135] pb-0.5">
            Full Rate History →
          </Link>
        </div>
      </section>

      {/* 3. Infinite Royal Marquee Banner */}
      <section className="bg-[#050202] border-b border-white/10 py-3.5 overflow-hidden flex items-center">
        <div className="w-full flex whitespace-nowrap overflow-hidden">
          <div className="animate-marquee flex items-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-10 mx-8">
                {(settings['marquee_text'] || '100% BIS 916 Hallmarked Gold | Certified IGI Diamonds | 25+ Years Legacy | Transparent Exchange Policy | Multiple Showrooms in Tripura').split('|').map((text, j) => (
                  <React.Fragment key={j}>
                    <span className="text-[10px] tracking-[0.3em] font-bold text-white/70 uppercase">{text.trim()}</span>
                    <span className="text-[#CBA135] text-xs">✦</span>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The Aranyak Heritage & Brand Stats Section */}
      <section className="py-24 md:py-36 bg-[#050202] text-white relative z-20 overflow-hidden border-b border-white/10 bg-radial-gold">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            {/* Left Narrative Column */}
            <div className="w-full lg:w-5/12 space-y-8">
              <Reveal>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-[1px] bg-[#CBA135]" />
                  <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-[#CBA135]">The Aranyak Philosophy</h2>
                </div>
              </Reveal>
              
              <Reveal delay={0.1}>
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light leading-[1.1] text-white">
                  Masterpieces born from <span className="font-editorial gold-gradient italic">heritage</span> & crafted for eternity.
                </h3>
              </Reveal>
              
              <Reveal delay={0.2}>
                <p className="text-sm md:text-base text-white/70 leading-relaxed font-light tracking-wide">
                  For over a quarter-century, Aranyak Jewellers has remained Tripura’s most trusted symbol of purity and fine craftsmanship. From intricate traditional Bengali gold ornaments to contemporary solitaire diamond creations, every piece is sculpted to perfection.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="pt-4 flex items-center space-x-8">
                  <Link 
                    href="/about" 
                    className="inline-block text-[10px] font-bold uppercase tracking-[0.35em] text-white hover:text-[#E5D3B3] transition-colors border-b border-[#CBA135] pb-2"
                  >
                    Read Our Story & Journey
                  </Link>
                </div>
              </Reveal>
            </div>
            
            {/* Right Pillars Grid */}
            <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 border-t border-l border-white/10 shadow-2xl">
              {[
                { num: "I", title: "Guaranteed Purity", desc: "100% BIS 916 Hallmarked gold with laser-engraved authenticity certification." },
                { num: "II", title: "Master Artisans", desc: "Handcrafted by legacy jewelers carrying generations of Bengali goldsmith technique." },
                { num: "III", title: "Lifetime Trust", desc: "Transparent exchange rates, fair gold value, and full buy-back guarantees." },
                { num: "IV", title: "Curated Luxury", desc: "Bespoke bridal sets, daily elegance wear, and certified astrological gemstones." }
              ].map((item, i) => (
                <Reveal key={i} delay={0.1 * i} y={30}>
                  <div className="group border-r border-b border-white/10 p-10 bg-[#0A0505]/60 hover:bg-[#0A0505] gold-border-glow transition-all duration-700 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xs font-editorial text-[#CBA135]">{item.num}</span>
                      <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-[#CBA135] transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-serif font-light mb-3 tracking-wide text-white group-hover:text-[#E5D3B3] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-white/50 leading-relaxed tracking-wide font-light">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-24 pt-16 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, idx) => (
              <Reveal key={idx} delay={0.1 * idx}>
                <div className="p-6 bg-[#0A0505]/40 border border-white/5 hover:border-[#CBA135]/30 transition-colors">
                  <p className="text-4xl md:text-5xl font-serif font-light gold-gradient mb-2">{stat.value}</p>
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/60">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Editorial Image Break Section */}
      <section className="h-[65vh] w-full relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[#050202]/40 z-10" />
        <Image 
          src={settings['home_editorial_image'] || "/hero-necklace.png"} 
          alt="Aranyak High Craftsmanship" 
          fill 
          className="object-cover object-center animate-slow-zoom" 
        />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
          <Reveal>
            <span className="text-[10px] font-bold tracking-[0.6em] uppercase text-[#E5D3B3] mb-6 block">
              Haute Joaillerie
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-white tracking-wide leading-tight max-w-4xl">
              The Art of <span className="font-editorial gold-gradient italic">Perfection</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10">
              <Link 
                href="/collections" 
                className="px-8 py-3.5 bg-white/10 hover:bg-[#CBA135] text-white hover:text-[#050202] backdrop-blur-md border border-white/30 hover:border-[#CBA135] text-[9px] font-bold tracking-[0.35em] uppercase transition-all duration-500"
              >
                View High Jewellery Catalog
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. Curated High Jewellery Collections (Interactive Grid) */}
      <section className="py-24 md:py-36 bg-[#050202] border-b border-white/10 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
          
          <div className="text-center mb-20 md:mb-32">
            <Reveal>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-8 h-[1px] bg-[#CBA135]" />
                <span className="text-[10px] tracking-[0.6em] uppercase font-bold text-[#CBA135]">Curated Masterpieces</span>
                <div className="w-8 h-[1px] bg-[#CBA135]" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="text-5xl sm:text-7xl md:text-8xl font-serif font-light text-white tracking-tight">
                High <span className="font-editorial gold-gradient italic">Jewellery</span>
              </h3>
            </Reveal>
          </div>

          <motion.div style={{ y: yParallaxGrid }} className="grid grid-cols-1 md:grid-cols-12 auto-rows-[500px] md:auto-rows-[580px] gap-6">
            
            {displayCategories.map((cat, idx) => (
              <Link 
                key={cat.id} 
                href={`/category/${cat.slug}`} 
                className={`${cat.span} row-span-1 relative group overflow-hidden bg-[#0A0505] flex items-center justify-center p-10 border border-white/10 hover:border-[#CBA135]/50 transition-all duration-700 shadow-2xl`}
              >
                <MouseParallaxImage src={cat.imageUrl} alt={cat.name} intensity={18} />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050202] via-[#050202]/30 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
                
                <div className="relative z-10 text-center flex flex-col items-center justify-end h-full pb-6">
                  <span className="text-[9px] tracking-[0.4em] uppercase text-[#E5D3B3] mb-3 opacity-90 group-hover:scale-110 transition-transform">
                    {cat.tagline}
                  </span>
                  <h4 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-white mb-6 group-hover:text-[#E5D3B3] transition-colors">
                    {cat.name}
                  </h4>
                  <div className="text-[9px] font-bold tracking-[0.35em] uppercase text-white border-b border-[#CBA135] pb-1.5 transform translate-y-3 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-500">
                    Discover Collection →
                  </div>
                </div>
              </Link>
            ))}

          </motion.div>
          
          <div className="text-center mt-20 md:mt-28">
            <Reveal>
              <Link href="/collections" className="inline-flex items-center space-x-6 text-xs font-bold tracking-[0.35em] uppercase text-white hover:text-[#CBA135] transition-colors group">
                <span>Browse All Collections</span>
                <div className="w-16 h-[1px] bg-white/40 group-hover:bg-[#CBA135] group-hover:w-24 transition-all duration-500" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Master Gallery Teaser Showcase */}
      <section className="py-24 bg-[#050202] border-b border-white/10 relative overflow-hidden bg-radial-gold">
        <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
          <Reveal>
            <div className="inline-flex items-center space-x-3 px-4 py-1 rounded-full bg-[#0A0505] border border-[#CBA135]/40 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CBA135]" />
              <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-[#E5D3B3]">
                PHOTOGRAPHY & ARTWORK ARCHIVE
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light text-white mb-6">
              Master <span className="font-editorial gold-gradient italic">Gallery</span> Directory
            </h3>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xs sm:text-sm text-white/70 max-w-xl mx-auto uppercase tracking-widest font-light mb-12">
              View our complete catalogue of handcrafted gold ornaments, certified solitaires, and antique temple jewelry in full resolution.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <Link 
              href="/gallery"
              className="btn-luxury inline-block px-12 py-4.5 text-[10px] font-bold tracking-[0.4em] uppercase shadow-2xl hover:scale-105 transition-all duration-500"
            >
              Open Master Gallery Archive →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 7. Client Testimonials & Stories of Trust */}
      <section className="py-24 md:py-32 bg-[#0A0505] border-b border-white/10 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          
          <div className="text-center mb-16 md:mb-24">
            <Reveal>
              <span className="text-[10px] tracking-[0.5em] uppercase font-bold text-[#CBA135] mb-3 block">
                Voices of Trust
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-white">
                Cherished <span className="font-editorial gold-gradient italic">Stories</span>
              </h3>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <Reveal key={idx} delay={0.1 * idx}>
                <div className="bg-[#050202] border border-white/10 p-8 sm:p-10 flex flex-col justify-between h-full hover:border-[#CBA135]/40 transition-all duration-500 gold-border-glow">
                  <div>
                    {/* Stars */}
                    <div className="flex items-center space-x-1 text-[#CBA135] mb-6">
                      {[...Array(t.rating)].map((_, i) => (
                        <span key={i} className="text-sm">★</span>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed tracking-wide italic mb-8">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-serif font-semibold text-white">{t.author}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{t.location}</p>
                    </div>
                    <span className="text-[9px] font-bold tracking-wider uppercase text-[#CBA135] bg-[#CBA135]/10 px-2.5 py-1">
                      {t.tag}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Showroom Editorial CTA Section */}
      <section className="relative py-32 overflow-hidden bg-[#050202] border-t border-white/10">
        <div className="absolute inset-0">
          <Image 
            src={settings['home_showroom_image'] || "/showroom.jpg"} 
            alt="Aranyak Jewellers Boutique Showroom" 
            fill 
            className="object-cover opacity-35 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050202] via-[#050202]/80 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center text-white">
          <Reveal>
            <div className="w-16 h-[1px] bg-[#CBA135] mx-auto mb-10" />
          </Reveal>
          
          <Reveal delay={0.1}>
            <h3 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light mb-8 leading-tight">
              Experience the <br /> 
              <span className="font-editorial gold-gradient italic">Brilliance</span> in Person
            </h3>
          </Reveal>
          
          <Reveal delay={0.2}>
            <p className="text-xs sm:text-sm text-white/70 tracking-wider max-w-xl mx-auto leading-relaxed mb-12 font-light uppercase">
              Step into our flagship boutiques across Agartala, Udaipur, and Dharmanagar. Enjoy personalized bridal consultations, private viewings, and bespoke design services with our master jewelers.
            </p>
          </Reveal>
          
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/stores" 
                className="btn-luxury px-12 py-4.5 text-[10px] font-bold tracking-[0.4em] uppercase glow-gold transition-all duration-500 hover:scale-105"
              >
                Find Nearest Boutique
              </Link>
              <Link 
                href="/contact" 
                className="px-10 py-4.5 text-[10px] font-bold tracking-[0.35em] uppercase text-white hover:text-[#E5D3B3] bg-[#0A0505]/80 backdrop-blur-md border border-white/20 hover:border-[#CBA135] transition-all duration-500 hover:scale-105"
              >
                Schedule Consultation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  );
}
