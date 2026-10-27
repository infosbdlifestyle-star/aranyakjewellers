"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

import { Reveal } from '@/components/animations/Reveal';
import { 
  StaggerContainer, 
  StaggerItem, 
  MagneticCard, 
  ExpandingDivider,
  TextReveal,
  SparkleGlint
} from '@/components/animations/LuxuryMotion';
import { MouseParallaxImage } from '@/components/ui/MouseParallaxImage';
import TopPicksCoverFlow from '@/components/home/TopPicksCoverFlow';
import HeroCarousel from '@/components/home/HeroCarousel';
import { useRef, useState, useEffect } from 'react';
import React from 'react';
import { api } from '@/lib/api';

interface HomeClientProps {
  settings: Record<string, string>;
  categories: any[];
  banners: any[];
  goldRates: any[];
  storesCount?: number;
  mediaMap?: Record<string, string>;
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
    slug: 'gold',
    imageUrl: '/gold_temple_nakshi.jpg',
    tagline: '22K BIS Hallmarked Masterpieces',
    span: 'md:col-span-5'
  },
  {
    id: 'cat-3',
    name: 'Certified Diamonds',
    slug: 'diamond',
    imageUrl: '/diamond_solitaire_ring.jpg',
    tagline: 'VVS-VS Solitaires & Fine Sets',
    span: 'md:col-span-4'
  },
  {
    id: 'cat-4',
    name: 'Temple & Antique',
    slug: 'astrological-stones',
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
  { label: 'Flagship Showrooms', value: '4' }
];

export default function HomeClient({ 
  settings: initialSettings, 
  categories: initialCategories, 
  banners: initialBanners, 
  goldRates: initialGoldRates,
  storesCount = 4,
  mediaMap: initialMediaMap = {}
}: HomeClientProps) {
  const containerRef = useRef(null);
  const [activeRateTab, setActiveRateTab] = useState<'24k' | '22k' | '18k'>('22k');
  const [liveGoldRates, setLiveGoldRates] = useState<any[]>(initialGoldRates || []);
  const [liveBanners, setLiveBanners] = useState<any[]>(initialBanners || []);
  const [liveCategories, setLiveCategories] = useState<any[]>(initialCategories || []);
  const [liveSettings, setLiveSettings] = useState<Record<string, string>>(initialSettings || {});
  const [liveMediaMap, setLiveMediaMap] = useState<Record<string, string>>(initialMediaMap || {});
  const [liveStoresCount, setLiveStoresCount] = useState<number>(storesCount || 4);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchLiveData = async () => {
      try {
        const [rates, bans, cats, sets, stores, media] = await Promise.all([
          api.getGoldPrices(),
          api.getBanners(),
          api.getCategories(),
          api.getSettings(),
          api.getStores(),
          api.getMediaMap()
        ]);
        if (Array.isArray(rates) && rates.length > 0) setLiveGoldRates(rates);
        if (Array.isArray(bans) && bans.length > 0) setLiveBanners(bans);
        if (Array.isArray(cats) && cats.length > 0) setLiveCategories(cats);
        if (sets && typeof sets === 'object') setLiveSettings(sets);
        if (media && typeof media === 'object') setLiveMediaMap(media);
        if (Array.isArray(stores) && stores.length >= 4) {
          setLiveStoresCount(stores.length);
        }
      } catch { /* empty */ }
    };
    fetchLiveData();

    // Refresh live real-time data every 10 seconds
    const interval = setInterval(fetchLiveData, 10000);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yParallax = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const opacityParallax = useTransform(scrollYProgress, [0, 0.4], [1, 0.2]);
  const yParallaxGrid = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // Normalize display categories with dynamic media management
  const pickKeys = [
    'top_picks_royal_heirloom',
    'top_picks_temple_nakshi',
    'top_picks_diamond_solitaires',
    'top_picks_artisanal_craft',
  ];

  const fallbackList = [
    {
      id: 'cat-1',
      name: 'Bridal Heritage',
      slug: 'bridal-jewellery',
      imageUrl: liveMediaMap['top_picks_royal_heirloom'] || liveMediaMap['home_hero_necklace'] || '/uploads/cat_bridal_heritage.webp',
      tagline: 'Handcrafted Trousseau Treasures',
      span: 'md:col-span-7'
    },
    {
      id: 'cat-2',
      name: 'Royal Gold',
      slug: 'gold',
      imageUrl: liveMediaMap['top_picks_temple_nakshi'] || '/uploads/cat_royal_gold.webp',
      tagline: '22K BIS Hallmarked Masterpieces',
      span: 'md:col-span-5'
    },
    {
      id: 'cat-3',
      name: 'Certified Diamonds',
      slug: 'diamond',
      imageUrl: liveMediaMap['top_picks_diamond_solitaires'] || '/uploads/cat_certified_diamonds.webp',
      tagline: 'VVS-VS Solitaires & Fine Sets',
      span: 'md:col-span-4'
    },
    {
      id: 'cat-4',
      name: 'Temple & Antique',
      slug: 'astrological-stones',
      imageUrl: liveMediaMap['top_picks_artisanal_craft'] || '/uploads/cat_antique_silver_heritage.webp',
      tagline: 'Sacred Iconography & Artisanal Craft',
      span: 'md:col-span-8'
    }
  ];

  const categoriesList = liveCategories.length > 0 ? liveCategories : (initialCategories || []);
  const displayCategories = categoriesList && categoriesList.length >= 3 
    ? categoriesList.slice(0, 4).map((c: any, i: number) => ({
        id: c.id || `cat-${i}`,
        name: c.name,
        slug: c.slug,
        imageUrl: liveMediaMap[pickKeys[i]] || c.imageUrl || (i === 0 ? '/uploads/cat_bridal_heritage.webp' : i === 1 ? '/uploads/cat_royal_gold.webp' : i === 2 ? '/uploads/cat_certified_diamonds.webp' : '/uploads/cat_antique_silver_heritage.webp'),
        tagline: c.description || 'Exclusive Collection',
        span: i === 0 ? 'md:col-span-7' : i === 1 ? 'md:col-span-5' : i === 2 ? 'md:col-span-4' : 'md:col-span-8'
      }))
    : fallbackList;

  // Extract gold rates or fallback
  const currentGoldRates = liveGoldRates.length > 0 ? liveGoldRates : (initialGoldRates || []);

  const getRate = (purity: number, fallback: number) => {
    if (Array.isArray(currentGoldRates) && currentGoldRates.length > 0) {
      const match = currentGoldRates.find((r: any) => r.purity === purity);
      if (match && match.pricePer10g) return match.pricePer10g;
    }
    return fallback;
  };

  const rate24k = getRate(24, 79000);
  const rate22k = getRate(22, 72500);
  const rate18k = getRate(18, 59300);

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#76551C] selection:bg-[#D6B15D] selection:text-[#211813]" ref={containerRef}>
      
      {/* 1. Full-Screen Luxury "Timeless Elegance" Hero Section */}
      <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#211813]" aria-label="Hero Section">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: yParallax, opacity: opacityParallax }}
        >
          <Image 
            src={liveMediaMap['home_hero_banner'] || (liveBanners && liveBanners.length > 0 ? liveBanners[0].imageUrl : (initialBanners && initialBanners.length > 0 ? initialBanners[0].imageUrl : "/uploads/hero_timeless_elegance.webp"))} 
            alt="Aranyak Jewellers Masterpiece Collection" 
            fill
            className="object-cover animate-slow-zoom no-select opacity-70"
            priority
          />
        </motion.div>
        
        {/* Multi-layered Warm Espresso & Gold Ambient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#211813] via-[#211813]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#211813]/85 via-transparent to-[#211813]/85 pointer-events-none" />
        
        {/* Floating Gold Dust Particles */}
        {mounted && (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#D6B15D] rounded-full blur-[1px] mix-blend-screen"
                initial={{ 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                  opacity: Math.random() * 0.5 + 0.2
                }}
                animate={{
                  y: [null, Math.random() * -200 - 100],
                  x: [null, Math.random() * 100 - 50],
                  opacity: [null, 0],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        )}
        
        {/* Centered Brand Name Title */}
        <div className="relative z-10 w-full px-6 max-w-7xl flex items-center justify-center text-center py-24 sm:py-32">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-light text-[#C49A45] text-4xl sm:text-6xl md:text-7xl lg:text-[84px] xl:text-[96px] tracking-[0.16em] sm:tracking-[0.2em] md:tracking-[0.24em] uppercase leading-tight sm:leading-none select-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)]"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.9), 0 0 35px rgba(196,154,69,0.25)" }}
          >
            AARANYAK JEWELLERS
          </motion.h1>
        </div>
      </section>

      {/* 2.5 Special Festive & Wedding Offers Grid */}
      <section className="pt-12 md:pt-16 pb-12 md:pb-16 bg-gradient-to-b from-[#211813] via-[#211813] to-[#211813] relative overflow-hidden text-[#FFF8EB] border-b border-[#DED2C1]/15">
        <div className="absolute inset-0 bg-radial-gold opacity-20 pointer-events-none" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Reveal>
              <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-[#211813] border border-[#D6B15D]/40 mb-4 shadow-md">
                <span className="text-xs">🌸</span>
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#D6B15D]">
                  FESTIVE & WEDDING CELEBRATION
                </span>
                <span className="text-xs">🌸</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light tracking-tight text-[#FFF8EB] mb-3">
                Exclusive <span className="font-editorial gold-gradient italic">Privileges</span> & Offers
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-xs sm:text-sm text-[#E5D7C5] max-w-xl mx-auto font-light leading-relaxed">
                Celebrate life&apos;s most precious milestones with guaranteed purity, exceptional exchange value, and festival blessings across all Tripura boutiques.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-6 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#211813]/90 border border-[#D6B15D]/50 shadow-[0_4px_20px_rgba(196,154,69,0.15)] backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#D6B15D] animate-pulse" />
                <span className="text-xs sm:text-sm font-medium tracking-wide text-[#FFF8EB]">
                  অফার* চলবে ১ নভেম্বর থেকে ১৪ নভেম্বর ২০২৬ পর্যন্ত
                </span>
                <span className="text-[#D6B15D] text-xs">✦</span>
              </div>
            </Reveal>
          </div>

          <StaggerContainer staggerDelay={0.09} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: 'সোনার গয়না (Gold Jewellery)', 
                desc: '১০০০/- টাকা ছাড় প্রতিগ্রাম সোনার গয়না কেনাকাটায়', 
                tag: '₹1000 OFF/GM' 
              },
              { 
                title: 'পুরোনো গয়না পরিবর্তন (Exchange)', 
                desc: '১০০% মূল্য হলমার্ক যুক্ত পুরোনো গয়নার পরিবর্তে', 
                tag: 'ZERO LOSS EXCHANGE' 
              },
              { 
                title: 'হীরের গয়না (Diamond Jewellery)', 
                desc: '১০০% ছাড় হীরের গয়নার মজুরিতে', 
                tag: '100% FREE MAKING' 
              },
              { 
                title: 'রুপোর গয়না (Silver Ornaments)', 
                desc: '২৫% ছাড় রূপোর গয়নার MRP-র উপর', 
                tag: '25% FLAT DISCOUNT' 
              },
              { 
                title: 'প্রতিদিন লাকি ড্র (Daily Lucky Draw)', 
                desc: 'প্রতিদিন লাকি ড্র-তে হোম অ্যাপ্লায়েন্স', 
                tag: 'DAILY PRIZES' 
              },
              { 
                title: 'নিশ্চিত উপহার (Assured Gifts)', 
                desc: 'নিশ্চিত উপহার প্রতি কেনাকাটায়', 
                tag: 'FREE GIFTS' 
              },
              { 
                title: 'মেগা লাকি ড্র (Mega Lucky Draw)', 
                desc: 'MEGA LUCKY DRAW ৩টি স্কুটি', 
                tag: '3X SCOOTY BUMPER',
                highlight: true 
              },
            ].map((item, idx) => (
              <StaggerItem 
                key={idx} 
                y={35} 
                className={`h-full ${
                  idx === 6 
                    ? 'sm:col-span-2 lg:col-span-1 lg:col-start-2 sm:max-w-md sm:mx-auto lg:max-w-none w-full' 
                    : ''
                }`}
              >
                <MagneticCard tiltIntensity={5} className="h-full rounded-2xl">
                  <div className={`p-6 sm:p-7 rounded-2xl bg-[#211813]/80 backdrop-blur-md border ${
                    item.highlight 
                      ? 'border-[#D6B15D]/60 shadow-[0_0_25px_rgba(196,154,69,0.15)]' 
                      : 'border-[#DED2C1]/25'
                  } hover:border-[#D6B15D]/80 hover:shadow-[0_8px_30px_rgba(196,154,69,0.22)] transition-all duration-500 h-full flex flex-col justify-between group`}>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full bg-[#D6B15D]/15 text-[#D6B15D] border border-[#D6B15D]/30 shadow-sm">
                          {item.tag}
                        </span>
                        <span className="text-[#D6B15D]/50 group-hover:text-[#D6B15D] transition-colors text-xs font-serif">
                          ✦
                        </span>
                      </div>
                      <h3 className="text-lg font-serif font-bold text-[#FFF8EB] mb-2 group-hover:text-[#D6B15D] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#E5D7C5] leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#DED2C1]/15 flex items-center justify-between text-[10px] text-[#D6B15D] font-bold tracking-wider uppercase">
                      <span>Avail at all Stores</span>
                      <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </MagneticCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
        {/* Subtle Luxury Divider into Hero Section */}
        <div className="w-full flex justify-center mt-12 sm:mt-16 pointer-events-none">
          <div className="w-48 sm:w-64 h-[1px] bg-gradient-to-r from-transparent via-[#D6B15D]/40 to-transparent" />
        </div>
      </section>

{/* 3.5 Animated 3D Cover-Flow "Top Picks" Luxury Showcase */}
      <TopPicksCoverFlow />

      {/* Hero Carousel — placed below Top Picks */}
      <HeroCarousel />

      {/* Smooth Multi-stop Luxury Gradient Transition (#211813 -> #382820 -> #665044 -> #E8DDCC -> #F8F4EC) */}
        <div 
          className="w-full pt-16 md:pt-24 mt-12 sm:mt-16 relative pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(33, 23, 19, 0) 0%, #211813 15%, #382820 38%, #665044 62%, #E8DDCC 85%, #FAF7F0 100%)'
          }}
        >
          {/* Elegant Shallow Symmetrical Curved Divider */}
          <div className="w-full overflow-hidden leading-none relative z-10">
            <svg 
              className="w-full h-8 sm:h-12 md:h-16 block" 
              viewBox="0 0 1440 60" 
              preserveAspectRatio="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="aranyakCurveGold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D6B15D" stopOpacity="0" />
                  <stop offset="20%" stopColor="#D6B15D" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#D6B15D" stopOpacity="0.75" />
                  <stop offset="80%" stopColor="#D6B15D" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#D6B15D" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Shallow curved path filled with final ivory #F8F4EC */}
              <path 
                d="M0,0 Q720,44 1440,0 L1440,60 L0,60 Z" 
                fill="#FAF7F0" 
              />
              {/* Subtle gold hairline accent along the curve */}
              <path 
                d="M0,0 Q720,44 1440,0" 
                fill="none" 
                stroke="url(#aranyakCurveGold)" 
                strokeWidth="1.2" 
              />
            </svg>
          </div>
        </div>

{/* 4. The Aranyak Heritage & Brand Stats Section */}
      <section className="py-24 md:py-36 bg-[#FAF7F0] text-[#76551C] relative z-20 overflow-hidden border-b border-[#DED2C1] bg-radial-gold">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            
            {/* Left Narrative Column */}
            <div className="w-full lg:w-5/12 space-y-8">
              <Reveal>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-[2px] bg-[#A77C32]" />
                  <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-[#966719]">The Aranyak Philosophy</h2>
                </div>
              </Reveal>
              
              <Reveal delay={0.1}>
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light leading-[1.1] text-[#211813]">
                  Masterpieces born from <span className="font-editorial gold-gradient italic text-[#8A5A12]">heritage</span> & crafted for eternity.
                </h3>
              </Reveal>
              
              <Reveal delay={0.2}>
                <p className="text-base text-[#40352F] leading-[1.8] font-normal tracking-wide">
                  For over a quarter-century, Aranyak Jewellers has remained Tripura’s most trusted symbol of purity and fine craftsmanship. From intricate traditional Bengali gold ornaments to contemporary solitaire diamond creations, every piece is sculpted to perfection.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="pt-4 flex items-center space-x-8">
                  <Link 
                    href="/about" 
                    className="inline-block text-[11px] font-bold uppercase tracking-[0.35em] text-[#8A5A12] hover:text-[#70440C] transition-colors border-b-2 border-[#8A5A12] pb-2"
                  >
                    Read Our Story & Journey →
                  </Link>
                </div>
              </Reveal>
            </div>
            
            {/* Right Pillars Grid */}
            <div className="w-full lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 border-t border-l border-[#DED2C1] shadow-xl">
              {[
                { num: "I", title: "Guaranteed Purity", desc: "100% BIS 916 Hallmarked gold with laser-engraved authenticity certification." },
                { num: "II", title: "Master Artisans", desc: "Handcrafted by legacy jewelers carrying generations of Bengali goldsmith technique." },
                { num: "III", title: "Lifetime Trust", desc: "Transparent exchange rates, fair gold value, and full buy-back guarantees." },
                { num: "IV", title: "Curated Luxury", desc: "Bespoke bridal sets, daily elegance wear, and certified astrological gemstones." }
              ].map((item, i) => (
                <Reveal key={i} delay={0.1 * i} y={30}>
                  <div className="group border-r border-b border-[#DED2C1] p-10 bg-[#FFFDF8] hover:bg-white transition-all duration-500 h-full flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-sm font-editorial font-bold text-[#8A5A12]">{item.num}</span>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#211813]/15 group-hover:bg-[#D6B15D] transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-serif font-medium mb-3 tracking-wide text-[#211813] group-hover:text-[#8A5A12] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-sm text-[#76551C] leading-relaxed tracking-normal font-normal">{item.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-24 pt-16 border-t border-[#DED2C1] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(stat => stat.label.includes('Showroom') ? { ...stat, value: `${liveStoresCount}` } : stat).map((stat, idx) => (
              <MagneticCard key={idx} tiltAmount={4} glareOpacity={0.12}>
                <div className="p-6 sm:p-8 bg-[#FFFDF8] border border-[#DED2C1] hover:border-[#D6B15D]/70 transition-all duration-300 rounded-xl shadow-sm h-full flex flex-col justify-center">
                  <p className="text-4xl md:text-5xl font-serif font-light text-[#8A5A12] mb-2">{stat.value}</p>
                  <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#211813]">{stat.label}</p>
                </div>
              </MagneticCard>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Craftsmanship Video Showcase */}
      <section className="h-[75vh] w-full relative overflow-hidden border-b border-[#DED2C1]/20 group bg-[#211813]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#211813]/95 via-[#211813]/60 to-[#211813]/85 z-10 transition-opacity duration-700" />
        
        {/* Silent Autoplay Video Background */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          poster={liveMediaMap['home_craftsmanship_image'] || liveSettings['home_craftsmanship_image'] || "/uploads/craftsmanship_poster.webp"}
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src="/videos/craftsmanship-artisan.mp4" type="video/mp4" />
        </video>

        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <Reveal>
            <span className="text-[10px] font-bold tracking-[0.6em] uppercase text-[#D6B15D] mb-6 block drop-shadow-md">
              Behind the Art
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light tracking-wide leading-tight max-w-4xl drop-shadow-2xl">
              <span className="text-[#FFF8EB]">The Essence of</span>{" "}
              <span className="font-editorial gold-gradient italic">Craftsmanship</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-[#E5D7C5] font-light tracking-wide max-w-2xl mx-auto text-sm md:text-base drop-shadow-md">
              Watch as raw gold and unpolished stones are meticulously transformed into breathtaking masterpieces by our legacy artisans.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 pointer-events-auto">
              <Link 
                href="/about" 
                className="group flex items-center space-x-4 px-8 py-3.5 bg-[#D6B15D] hover:bg-[#A77C32] text-[#211813] hover:text-[#FFF8EB] border border-[#A77C32] text-[10px] font-bold tracking-[0.35em] uppercase transition-all duration-500 shadow-lg"
              >
                <span>Discover Our Heritage</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. Curated High Jewellery Collections (Interactive Grid) */}
      <section className="py-24 md:py-36 bg-[#FFFDF8] border-b border-[#DED2C1] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-[1400px] relative z-10">
          
          <div className="text-center mb-20 md:mb-32">
            <Reveal>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-8 h-[2px] bg-[#D6B15D]" />
                <span className="text-[11px] tracking-[0.5em] uppercase font-bold text-[#966719]">Curated Masterpieces</span>
                <div className="w-8 h-[2px] bg-[#D6B15D]" />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="text-5xl sm:text-7xl md:text-8xl font-serif font-light text-[#211813] tracking-tight">
                High <span className="font-editorial gold-gradient italic text-[#8A5A12]">Jewellery</span>
              </h3>
            </Reveal>
          </div>

          <motion.div style={{ y: yParallaxGrid }} className="grid grid-cols-1 md:grid-cols-12 auto-rows-[500px] md:auto-rows-[580px] gap-6">
            
            {displayCategories.map((cat, idx) => {
              const gemAura = [
                { tag: 'Royal Ruby Heritage' },
                { tag: '22K Hallmarked Gold' },
                { tag: 'VVS Solitaires' },
                { tag: 'Sacred Iconography' },
              ][idx % 4];

              return (
                <Link 
                  key={cat.id} 
                  href={`/category/${cat.slug}`} 
                  className={`${cat.span} row-span-1 relative group overflow-hidden bg-[#211813] flex items-center justify-center p-10 border border-[#DED2C1]/30 hover:border-[#E0BD72]/70 rounded-2xl transition-all duration-700 shadow-xl`}
                >
                  <MouseParallaxImage src={cat.imageUrl} alt={cat.name} intensity={18} />
                  
                  {/* Subtle multi-stop image gradient ensuring high contrast without overly darkening jewellery */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211813]/95 via-[#211813]/50 to-transparent transition-opacity duration-700 group-hover:opacity-95 pointer-events-none" />
                  
                  <div className="relative z-10 text-center flex flex-col items-center justify-end h-full pb-6">
                    <span 
                      className="text-[9px] font-bold tracking-[0.3em] uppercase px-3 py-1 rounded-full border mb-3 group-hover:scale-105 transition-transform backdrop-blur-sm"
                      style={{
                        color: "#E0BD72",
                        background: "rgba(33,24,19,0.75)",
                        borderColor: "rgba(224,189,114,0.4)"
                      }}
                    >
                      {gemAura.tag}
                    </span>
                    <h4 
                      className="text-3xl sm:text-4xl md:text-5xl font-serif font-light mb-4 transition-colors drop-shadow-md"
                      style={{ color: "#FFF8EC" }}
                    >
                      {cat.name}
                    </h4>
                    <p 
                      className="text-xs font-normal max-w-xs mx-auto mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 leading-relaxed"
                      style={{ color: "#E5D9C8" }}
                    >
                      {cat.tagline}
                    </p>
                    <div 
                      className="text-[10px] font-bold tracking-[0.35em] uppercase border-b-2 pb-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500"
                      style={{
                        color: "#E0BD72",
                        borderColor: "#E0BD72"
                      }}
                    >
                      Discover Collection →
                    </div>
                  </div>
                </Link>
              );
            })}

          </motion.div>
          
          <div className="text-center mt-20 md:mt-28">
            <Reveal>
              <Link href="/collections" className="inline-flex items-center space-x-6 text-xs font-bold tracking-[0.35em] uppercase text-[#211813] hover:text-[#8A5A12] transition-colors group">
                <span>Browse All Collections</span>
                <div className="w-16 h-[2px] bg-[#DED2C1] group-hover:bg-[#8A5A12] group-hover:w-24 transition-all duration-500" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Master Gallery Teaser Showcase */}
      <section className="py-24 md:py-32 bg-[#F0E7D8] border-b border-[#DED2C1] relative overflow-hidden bg-radial-gold">
        <div className="w-full max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Text & CTA Button */}
          <div className="text-left space-y-6">
            <Reveal width="100%">
              <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-[#FFFDF8] border border-[#DED2C1] mb-2 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6B15D]" />
                <span className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#966719]">
                  PHOTOGRAPHY & ARTWORK ARCHIVE
                </span>
              </div>
            </Reveal>

            <Reveal width="100%" delay={0.1}>
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-[#211813] leading-tight">
                Master <span className="font-editorial gold-gradient italic text-[#8A5A12]">Gallery</span> Directory
              </h3>
            </Reveal>

            <Reveal width="100%" delay={0.2}>
              <p className="text-sm md:text-base text-[#40352F] uppercase tracking-widest font-normal leading-relaxed max-w-xl">
                View our complete catalogue of handcrafted gold ornaments, certified solitaires, and antique temple jewelry in full resolution.
              </p>
            </Reveal>

            <Reveal width="100%" delay={0.3}>
              <div className="pt-2">
                <Link 
                  href="/gallery"
                  className="btn-luxury-dark inline-block px-10 py-4.5 text-[10px] font-bold tracking-[0.4em] uppercase shadow-lg hover:scale-105 transition-all duration-500"
                >
                  Open Master Gallery Archive →
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Full-Width Staggered Luxury Showcase */}
          <div className="w-full">
            <Reveal width="100%" delay={0.2} className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 lg:gap-6 h-auto sm:h-[560px] lg:h-[640px] w-full">
                
                {/* Large Primary Hero Image spanning 2 rows on the left */}
                <div className="sm:row-span-2 relative h-[380px] sm:h-full w-full rounded-2xl overflow-hidden shadow-2xl group border border-[#DED2C1]/60 bg-[#211813]">
                  <Image 
                    src={liveMediaMap['home_bridal_image'] || "/uploads/gallery_royal_bridal_feature.webp"} 
                    alt="Handcrafted Royal Heritage 22kt Gold Bridal Necklace"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 40vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211813]/95 via-[#211813]/40 to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between">
                    <div>
                      <span 
                        className="text-[10px] font-bold tracking-[0.3em] uppercase block mb-1"
                        style={{ color: "#E0BD72" }}
                      >
                        FEATURED MASTERPIECE
                      </span>
                      <h4 
                        className="text-xl sm:text-2xl font-serif font-light"
                        style={{ color: "#FFF8EC" }}
                      >
                        Royal Bridal Trousseau
                      </h4>
                    </div>
                    <span 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 border"
                      style={{
                        background: "rgba(33,24,19,0.85)",
                        borderColor: "rgba(224,189,114,0.45)",
                        color: "#E0BD72"
                      }}
                    >
                      ✦
                    </span>
                  </div>
                </div>

                {/* Top Supporting Image (Right column, Row 1) */}
                <div className="relative h-[240px] sm:h-full w-full rounded-2xl overflow-hidden shadow-xl group border border-[#DED2C1]/60 bg-[#211813]">
                  <Image 
                    src={liveMediaMap['gallery_diamond_ring'] || "/uploads/gallery_solitaire_feature.webp"} 
                    alt="Certified Solitaire Diamond Eternity Band"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1536px) 25vw, 20vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211813]/95 via-[#211813]/45 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <span 
                      className="text-[9px] font-bold tracking-[0.25em] uppercase block mb-0.5"
                      style={{ color: "#E0BD72" }}
                    >
                      SOLITAIRES
                    </span>
                    <span 
                      className="text-sm font-serif font-medium"
                      style={{ color: "#FFF8EC" }}
                    >
                      Diamond Flower Ring
                    </span>
                  </div>
                </div>

                {/* Bottom Supporting Image (Right column, Row 2) */}
                <div className="relative h-[240px] sm:h-full w-full rounded-2xl overflow-hidden shadow-xl group border border-[#DED2C1]/60 bg-[#211813]">
                  <Image 
                    src="/uploads/gallery_chandeliers_feature.webp" 
                    alt="Haute Joaillerie Handcrafted Diamond Chandelier Earrings"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1536px) 25vw, 20vw"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211813]/95 via-[#211813]/45 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 z-10">
                    <span 
                      className="text-[9px] font-bold tracking-[0.25em] uppercase block mb-0.5"
                      style={{ color: "#E0BD72" }}
                    >
                      BESPOKE EARPIECES
                    </span>
                    <span 
                      className="text-sm font-serif font-medium"
                      style={{ color: "#FFF8EC" }}
                    >
                      Ruby & Diamond Drops
                    </span>
                  </div>
                </div>

              </div>
            </Reveal>
          </div>

        </div>
      </section>

      {/* Instagram Official Lookbook & Feed Showcase */}
      <section className="py-24 bg-[#FFFDF8] border-b border-[#DED2C1] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <Reveal>
              <span className="text-[11px] tracking-[0.4em] uppercase font-bold text-[#966719] mb-3 block">
                INSTAGRAM OFFICIAL LOOKBOOK
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="text-4xl sm:text-6xl font-serif font-light text-[#211813] mb-4">
                Follow <span className="font-editorial gold-gradient italic text-[#8A5A12]">@aranyakjewellers</span>
              </h3>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-sm text-[#40352F] font-normal tracking-wide max-w-xl mx-auto uppercase mb-8 leading-relaxed">
                Explore real bride trousseaus, daily gold rates, & store designs on Instagram
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <a 
                href="https://www.instagram.com/aranyakjewellers/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 px-8 py-3.5 rounded-full bg-[#211813] text-[#FFF8EB] text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#8A5A12] hover:text-[#FFF8EC] border border-[#8A5A12]/30 transition-all duration-500 shadow-md"
              >
                <span>📸 Visit @aranyakjewellers on Instagram</span>
              </a>
            </Reveal>
          </div>

          {/* Instagram Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { img: liveMediaMap['gallery_royal_set'] || '/uploads/lookbook_bridal_sitahar.webp', title: 'Royal Long Conch Haar', tag: 'Instagram Story' },
              { img: liveMediaMap['gallery_earring_drop'] || '/uploads/lookbook_filigree_jhumkas.webp', title: 'Peacock Chandbali Jhumkas', tag: 'Reel Feature' },
              { img: liveMediaMap['gallery_diamond_ring'] || '/uploads/gallery_solitaire_feature.webp', title: 'Diamond Flower Ring', tag: 'Spotlight Edit' },
              { img: liveMediaMap['gallery_sapphire_ring'] || '/uploads/lookbook_silver_bangles.webp', title: 'Pure Silver Makara Kadas', tag: 'Silver Heritage' }
            ].map((item, idx) => (
              <Reveal key={idx} width="100%" delay={idx * 0.1}>
                <a 
                  href="https://www.instagram.com/aranyakjewellers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square w-full h-full overflow-hidden bg-[#211813] border border-[#DED2C1] hover:border-[#D6B15D] block rounded-lg shadow-md transition-colors"
                >
                  <Image 
                    src={item.img} 
                    alt={item.title} 
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211813]/95 via-[#211813]/40 to-transparent pointer-events-none" />
                  <div 
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md border"
                    style={{
                      background: "rgba(33,24,19,0.85)",
                      borderColor: "rgba(224,189,114,0.45)",
                      color: "#E0BD72"
                    }}
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <span 
                      className="text-[9px] font-bold tracking-widest uppercase block mb-1"
                      style={{ color: "#E0BD72" }}
                    >
                      {item.tag}
                    </span>
                    <h5 
                      className="text-xs sm:text-sm font-serif font-medium transition-colors drop-shadow-sm"
                      style={{ color: "#FFF8EC" }}
                    >
                      {item.title}
                    </h5>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Client Testimonials & Stories of Trust */}
      <section className="py-24 md:py-32 bg-[#F0E7D8] border-b border-[#DED2C1] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          
          <div className="text-center mb-16 md:mb-24">
            <Reveal>
              <span className="text-[11px] tracking-[0.4em] uppercase font-bold text-[#966719] mb-3 block">
                Voices of Trust
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-[#211813]">
                Cherished <span className="font-editorial gold-gradient italic text-[#8A5A12]">Stories</span>
              </h3>
            </Reveal>
          </div>

          <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <StaggerItem key={idx} y={30} className="h-full">
                <MagneticCard tiltIntensity={4} className="h-full rounded-xl">
                  <div className="bg-[#FFFDF8] border border-[#DED2C1] p-8 sm:p-10 flex flex-col justify-between h-full hover:border-[#D6B15D]/70 transition-all duration-500 shadow-sm hover:shadow-lg rounded-xl">
                    <div>
                      {/* Stars with Subtle Stagger */}
                      <div className="flex items-center space-x-1.5 text-[#8A5A12] mb-6">
                        {[...Array(t.rating)].map((_, i) => (
                          <span key={i} className="text-base font-bold drop-shadow-sm">★</span>
                        ))}
                      </div>
                      <p className="text-sm text-[#40352F] font-normal leading-[1.8] italic mb-8">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#DED2C1] flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-serif font-bold text-[#211813]">{t.author}</h4>
                        <p className="text-[11px] text-[#70440C] uppercase tracking-wider font-semibold">{t.location}</p>
                      </div>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A5A12] bg-[#8A5A12]/10 border border-[#8A5A12]/30 px-3 py-1 rounded-sm">
                        {t.tag}
                      </span>
                    </div>
                  </div>
                </MagneticCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 8. Showroom Editorial CTA Section */}
      <section className="relative py-32 overflow-hidden bg-[#211813] border-t border-[#DED2C1]/20">
        <div className="absolute inset-0">
          <Image 
            src={liveMediaMap['home_showroom_image'] || liveSettings['home_showroom_image'] || initialSettings['home_showroom_image'] || "/showroom.jpg"} 
            alt="Aranyak Jewellers Boutique Showroom" 
            fill 
            className="object-cover opacity-35 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#211813] via-[#211813]/85 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 max-w-4xl text-center text-[#FFF8EB]">
          <Reveal>
            <div className="w-16 h-[1px] bg-[#D6B15D] mx-auto mb-10" />
          </Reveal>
          
          <Reveal delay={0.1}>
            <h3 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light mb-8 leading-tight drop-shadow-2xl text-[#FFF8EB]">
              Experience the <br /> 
              <span className="font-editorial gold-gradient italic">Brilliance</span> in Person
            </h3>
          </Reveal>
          
          <Reveal delay={0.2}>
            <p className="text-xs sm:text-sm text-[#E5D7C5] tracking-wider max-w-xl mx-auto leading-relaxed mb-12 font-light uppercase drop-shadow-md">
              Step into our flagship boutiques across Agartala, Dharmanagar, Kailashahar, and Khowai. Enjoy personalized bridal consultations, private viewings, and bespoke design services with our master jewelers.
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
                className="px-10 py-4.5 text-[10px] font-bold tracking-[0.35em] uppercase text-[#FFF8EB] hover:text-[#211813] bg-[#FFFDF8]/10 hover:bg-[#D6B15D] backdrop-blur-md border border-[#DED2C1]/40 hover:border-[#D6B15D] transition-all duration-500 hover:scale-105 shadow-md"
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
