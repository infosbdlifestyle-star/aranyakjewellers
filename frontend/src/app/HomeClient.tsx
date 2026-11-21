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
import { useRef, useState, useEffect, useMemo } from 'react';
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
    imageUrl: '/uploads/cat_bridal_heritage.webp',
    tagline: 'Handcrafted Trousseau Treasures',
    span: 'md:col-span-7'
  },
  {
    id: 'cat-2',
    name: 'Royal Gold',
    slug: 'gold',
    imageUrl: '/uploads/cat_royal_gold.webp',
    tagline: '22K BIS Hallmarked Masterpieces',
    span: 'md:col-span-5'
  },
  {
    id: 'cat-3',
    name: 'Certified Diamonds',
    slug: 'diamond',
    imageUrl: '/uploads/cat_certified_diamonds.webp',
    tagline: 'VVS-VS Solitaires & Fine Sets',
    span: 'md:col-span-4'
  },
  {
    id: 'cat-4',
    name: 'Pure 925 Silver',
    slug: 'silver',
    imageUrl: '/uploads/cat_antique_silver_heritage.webp',
    tagline: 'Artisanal Filigree & Auspicious Silverware',
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
    quote: "The finest destination in Tripura for authentic heirloom jewellery and certified diamonds. Their staff is extremely knowledgeable and welcoming.",
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

// Deterministic gentle floating gold particles for hero background
const HERO_PARTICLES = [
  { id: 1, left: '10%', top: '75%', size: 2, delay: 0, duration: 13, xOffset: 20 },
  { id: 2, left: '22%', top: '65%', size: 1.5, delay: 2, duration: 16, xOffset: -18 },
  { id: 3, left: '34%', top: '80%', size: 2.5, delay: 3.5, duration: 15, xOffset: 24 },
  { id: 4, left: '46%', top: '70%', size: 1.5, delay: 1, duration: 18, xOffset: -22 },
  { id: 5, left: '58%', top: '85%', size: 2, delay: 3, duration: 17, xOffset: 18 },
  { id: 6, left: '72%', top: '68%', size: 1.8, delay: 4.5, duration: 14, xOffset: -16 },
  { id: 7, left: '85%', top: '78%', size: 2.2, delay: 2.5, duration: 16, xOffset: 22 },
  { id: 8, left: '16%', top: '42%', size: 1.5, delay: 5, duration: 19, xOffset: -14 },
  { id: 9, left: '28%', top: '32%', size: 2, delay: 1.8, duration: 15, xOffset: 16 },
  { id: 10, left: '52%', top: '48%', size: 1.8, delay: 4, duration: 17, xOffset: -20 },
  { id: 11, left: '68%', top: '36%', size: 2.2, delay: 3.2, duration: 16, xOffset: 14 },
  { id: 12, left: '80%', top: '52%', size: 1.5, delay: 6, duration: 20, xOffset: -24 },
  { id: 13, left: '8%', top: '28%', size: 2, delay: 5.2, duration: 15, xOffset: 18 },
  { id: 14, left: '40%', top: '24%', size: 1.8, delay: 2.6, duration: 18, xOffset: -15 },
  { id: 15, left: '64%', top: '25%', size: 2, delay: 6.5, duration: 16, xOffset: 16 },
  { id: 16, left: '90%', top: '32%', size: 1.5, delay: 4.2, duration: 19, xOffset: -18 },
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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDesktop(window.innerWidth >= 768);
    document.body.classList.add('is-homepage');

    // Only fetch if initial data was missing
    const needsFetch = !initialGoldRates?.length || !initialCategories?.length;
    if (needsFetch) {
      api.getGoldPrices().then(rates => {
        if (Array.isArray(rates) && rates.length > 0) setLiveGoldRates(rates);
      }).catch(() => {});
    }

    // Refresh live gold rate periodically (every 3 minutes), only when page is visible
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      api.getGoldPrices().then(rates => {
        if (Array.isArray(rates) && rates.length > 0) setLiveGoldRates(rates);
      }).catch(() => {});
    }, 180000);

    return () => {
      clearInterval(interval);
      document.body.classList.remove('is-homepage');
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yParallax = useTransform(scrollYProgress, [0, 0.5], ["0%", "20%"]);
  const opacityParallax = useTransform(scrollYProgress, [0, 0.4], [1, 0.2]);
  const yParallaxGrid = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // Curated High Jewellery Collections accurately matching every displayed image
  const curatedCollections = useMemo(() => [
    {
      id: 'high-jewellery-bridal',
      name: 'Bridal Gold Jewellery',
      badge: '22K Bridal Trousseau',
      slug: 'bridal-jewellery',
      imageUrl: liveMediaMap['top_picks_royal_heirloom'] || liveMediaMap['home_hero_necklace'] || '/uploads/cat_bridal_heritage.webp',
      altText: 'Handcrafted Royal Bridal Gold Jewellery & Jhumka Earrings',
      tagline: 'Handcrafted Trousseau Treasures & Royal Jhumkas',
      ctaText: 'DISCOVER COLLECTION',
      span: 'md:col-span-7'
    },
    {
      id: 'high-jewellery-gold-necklace',
      name: 'Traditional Gold Necklaces',
      badge: '22K Hallmarked Gold',
      slug: 'gold/necklace-sets',
      imageUrl: liveMediaMap['top_picks_temple_nakshi'] || '/uploads/top_picks_traditional_heritage.webp',
      altText: 'Traditional 22K BIS Hallmarked Gold Heritage Necklace',
      tagline: '22K BIS Hallmarked Masterpieces & Nakshi Karigari',
      ctaText: 'DISCOVER COLLECTION',
      span: 'md:col-span-5'
    },
    {
      id: 'high-jewellery-diamond-rings',
      name: 'Diamond Rings',
      badge: 'VVS-VS Solitaires',
      slug: 'diamond/rings',
      imageUrl: liveMediaMap['top_picks_diamond_solitaires'] || '/uploads/cat_certified_diamonds.webp',
      altText: 'Certified VVS-VS Solitaire Diamond Ring',
      tagline: 'VVS-VS Solitaire Rings & Certified Bands',
      ctaText: 'DISCOVER COLLECTION',
      span: 'md:col-span-4'
    },
    {
      id: 'high-jewellery-silver-necklace',
      name: 'Pure 925 Silver Necklaces',
      badge: '92.5 Sterling Silver',
      slug: 'silver/necklaces',
      imageUrl: liveMediaMap['top_picks_artisanal_craft'] || '/uploads/cat_antique_silver_heritage.webp',
      altText: 'Handcrafted Pure 925 Silver Filigree Traditional Necklace',
      tagline: 'Artisanal Filigree & Auspicious Silver Necklaces',
      ctaText: 'DISCOVER COLLECTION',
      span: 'md:col-span-8'
    }
  ], [liveMediaMap]);

  const displayCategories = curatedCollections;

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

  // Dynamic Hero Configuration
  const heroConfig = useMemo(() => {
    if (liveSettings['homepage_hero_config']) {
      try {
        const parsed = JSON.parse(liveSettings['homepage_hero_config']);
        return {
          brandTitle: parsed.brandTitle || 'ARANYAK JEWELLERS',
          tagline: parsed.tagline === 'Timeless Elegance & Royal Heritage' ? 'Tripura’s Best Jewellery Brand' : (parsed.tagline || 'Tripura’s Best Jewellery Brand'),
          imageUrl: parsed.imageUrl || '',
          height: parsed.height && parsed.height !== '64vh' ? parsed.height : 'calc(100vh - 4rem)',
          alignment: parsed.alignment || 'center',
          overlayDarkness: parsed.overlayDarkness || '60',
        };
      } catch { /* empty */ }
    }
    return {
      brandTitle: 'ARANYAK JEWELLERS',
      tagline: 'Tripura’s Best Jewellery Brand',
      imageUrl: '',
      height: 'calc(100vh - 4rem)',
      alignment: 'center',
      overlayDarkness: '60',
    };
  }, [liveSettings]);

  // Split brand title into words and characters for smooth, luxurious letter-by-letter reveal
  const brandTitleWords = useMemo(() => {
    const raw = heroConfig.brandTitle || "ARANYAK JEWELLERS";
    let runningIndex = 0;
    return raw.split(" ").map((word: string) => {
      const letters = word.split("").map((char: string) => {
        const charIdx = runningIndex++;
        return { char, index: charIdx };
      });
      runningIndex++;
      return { word, letters };
    });
  }, [heroConfig.brandTitle]);

  // Dynamic Section Visibility
  const enabledSections = useMemo(() => {
    const map: Record<string, boolean> = {
      hero: true,
      top_picks: true,
      philosophy_stats: true,
      craftsmanship: true,
      collections: true,
      high_jewellery: true,
      rates_showroom: true,
      testimonials: true,
      instagram: true,
    };
    if (liveSettings['homepage_sections_config']) {
      try {
        const parsed = JSON.parse(liveSettings['homepage_sections_config']);
        if (Array.isArray(parsed)) {
          parsed.forEach((s: any) => {
            if (s.id && typeof s.enabled === 'boolean') {
              map[s.id] = s.enabled;
            }
          });
        }
      } catch { /* empty */ }
    }
    return map;
  }, [liveSettings]);

  // Dynamic Testimonials
  const dynamicTestimonials = useMemo(() => {
    if (liveSettings['homepage_testimonials']) {
      try {
        const parsed = JSON.parse(liveSettings['homepage_testimonials']);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* empty */ }
    }
    return TESTIMONIALS;
  }, [liveSettings]);

  // Dynamic Brand Stats
  const dynamicStats = useMemo(() => {
    if (liveSettings['homepage_stats']) {
      try {
        const parsed = JSON.parse(liveSettings['homepage_stats']);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* empty */ }
    }
    return STATS;
  }, [liveSettings]);

  return (
    <main id="homepage-root" className="homepage-root min-h-screen flex flex-col bg-[#FAF7F0] text-[#76551C] selection:bg-[#D6B15D] selection:text-[#211813]" ref={containerRef}>
      {/* Scoped Luxury Animations & Interactions strictly for the Homepage */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* 1. Hero Animated Golden Light Sweep Moving Horizontally Across Stationary Background */
        @keyframes heroGoldLightSweep {
          0% {
            transform: translateX(-140%) skewX(-20deg);
            opacity: 0;
          }
          20% {
            opacity: 0.85;
          }
          50% {
            opacity: 1;
          }
          80% {
            opacity: 0.85;
          }
          100% {
            transform: translateX(260%) skewX(-20deg);
            opacity: 0;
          }
        }

        .hero-gold-sweep {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 55%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(214, 177, 93, 0.04) 20%,
            rgba(255, 238, 185, 0.24) 50%,
            rgba(214, 177, 93, 0.08) 80%,
            transparent 100%
          );
          filter: blur(16px);
          animation: heroGoldLightSweep 6.5s ease-in-out infinite;
          will-change: transform, opacity;
          pointer-events: none;
        }

        /* 2. Main Hero Heading & Subtitle Guaranteed High Contrast */
        .hero-brand-heading,
        .hero-brand-heading *,
        h1.hero-brand-heading,
        h1.hero-brand-heading span {
          color: #F0D58A !important;
          opacity: 1 !important;
          text-shadow: 0 2px 16px rgba(0, 0, 0, 0.55) !important;
        }

        .hero-subtitle,
        h2.hero-subtitle {
          color: #FDF8EE !important;
          opacity: 1 !important;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.85) !important;
        }

        /* 3. Floating WhatsApp Button: Visible Animated Green Pulse Ring Around Button & Small Hover Effect */
        @keyframes whatsappPulseRingAnimation {
          0% {
            transform: scale(0.92);
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.8);
            opacity: 1;
          }
          65% {
            transform: scale(1.2);
            box-shadow: 0 0 0 16px rgba(37, 211, 102, 0);
            opacity: 0.15;
          }
          100% {
            transform: scale(1.26);
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
            opacity: 0;
          }
        }

        @keyframes whatsappButtonGlow {
          0%, 100% {
            box-shadow: 0 0 18px rgba(37, 211, 102, 0.5), 0 4px 12px rgba(0, 0, 0, 0.4);
          }
          50% {
            box-shadow: 0 0 32px rgba(37, 211, 102, 0.85), 0 6px 18px rgba(0, 0, 0, 0.5);
          }
        }

        body.is-homepage a[aria-label="Chat on WhatsApp"] > div > div.rounded-full,
        body:has(#homepage-root) a[aria-label="Chat on WhatsApp"] > div > div.rounded-full {
          animation: whatsappButtonGlow 2.8s ease-in-out infinite !important;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease !important;
          position: relative !important;
        }

        body.is-homepage a[aria-label="Chat on WhatsApp"] > div > div.rounded-full::before,
        body:has(#homepage-root) a[aria-label="Chat on WhatsApp"] > div > div.rounded-full::before {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 9999px;
          border: 2px solid rgba(37, 211, 102, 0.8);
          animation: whatsappPulseRingAnimation 2.2s cubic-bezier(0.24, 0, 0.38, 1) infinite !important;
          pointer-events: none;
        }

        body.is-homepage a[aria-label="Chat on WhatsApp"]:hover > div > div.rounded-full,
        body:has(#homepage-root) a[aria-label="Chat on WhatsApp"]:hover > div > div.rounded-full {
          transform: scale(1.06) !important;
          box-shadow: 0 0 42px rgba(37, 211, 102, 0.95), 0 8px 24px rgba(0, 0, 0, 0.6) !important;
        }

        /* 5. Hero Ambient Aura & Shimmer Line */
        @keyframes heroAuraPulse {
          0%, 100% {
            opacity: 0.5;
            transform: translate3d(0, 0, 0);
          }
          50% {
            opacity: 0.85;
            transform: translate3d(0, 0, 0);
          }
        }

        .animate-hero-aura {
          animation: heroAuraPulse 7s ease-in-out infinite;
        }

        @keyframes goldShimmerSweep {
          0% {
            transform: translateX(-100%);
          }
          30%, 100% {
            transform: translateX(100%);
          }
        }

        .animate-gold-shimmer-sweep {
          animation: goldShimmerSweep 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        /* 6. Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          body.is-homepage .hero-gold-sweep,
          body.is-homepage .animate-hero-aura,
          body.is-homepage .animate-gold-shimmer-sweep,
          body.is-homepage a[aria-label="Chat on WhatsApp"] > div > div.rounded-full,
          body:has(#homepage-root) .hero-gold-sweep,
          body:has(#homepage-root) .animate-hero-aura,
          body:has(#homepage-root) .animate-gold-shimmer-sweep,
          body:has(#homepage-root) a[aria-label="Chat on WhatsApp"] > div > div.rounded-full {
            animation: none !important;
            transform: none !important;
          }
        }
      `}} />
      
      {/* 1. Full-Screen Luxury "Tripura’s Best Jewellery Brand" Hero Section */}
      {enabledSections.hero && (
        <section 
          className="relative w-full min-h-[calc(100vh-4rem)] min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center overflow-hidden bg-[#211813]" 
          style={{ minHeight: heroConfig.height || 'calc(100vh - 4rem)' }}
          aria-label="Hero Section"
        >
          {/* Completely Stationary Hero Background (Fills full width and height with clear jewellery visibility) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Image 
              src={heroConfig.imageUrl || liveMediaMap['home_hero_banner'] || (liveBanners && liveBanners.length > 0 ? liveBanners[0].imageUrl : (initialBanners && initialBanners.length > 0 ? initialBanners[0].imageUrl : "/website-banner.webp"))} 
              alt="Aranyak Jewellers Masterpiece Collection" 
              fill
              className="object-cover object-center no-select opacity-85 sm:opacity-90"
              priority
            />
          </div>
          
          {/* Multi-layered Warm Espresso & Gold Ambient Overlays tuned for optimal contrast and jewellery clarity */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#211813] via-[#211813]/40 to-[#211813]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#211813]/70 via-[#211813]/30 to-[#211813]/70 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(33,24,19,0.35)_0%,rgba(33,24,19,0.75)_80%,#211813_100%)] pointer-events-none" />
          
          {/* Subtle Animated Golden Light Sweep Moving Horizontally Across Hero Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
            <div className="hero-gold-sweep" />
          </div>

          {/* Soft glowing ambient gold highlights */}
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden" aria-hidden="true">
            <div className="w-[600px] h-[360px] sm:w-[900px] sm:h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(214,177,93,0.18)_0%,rgba(214,177,93,0.04)_50%,transparent_75%)] blur-2xl animate-hero-aura" />
          </div>

          {/* Gentle Floating Gold Dust Particles */}
          {mounted && isDesktop && (
            <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden" aria-hidden="true">
              {HERO_PARTICLES.map((p) => (
                <motion.div
                  key={p.id}
                  className="absolute rounded-full bg-[#D6B15D] mix-blend-screen pointer-events-none"
                  style={{
                    left: p.left,
                    top: p.top,
                    width: p.size,
                    height: p.size,
                    boxShadow: `0 0 ${p.size * 4}px 1px rgba(214,177,93,0.9)`,
                  }}
                  animate={{
                    y: [-10, -120],
                    x: [0, p.xOffset, 0],
                    opacity: [0, 0.85, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    delay: p.delay,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Centered Brand Name Title with Letter-by-Letter Reveal & Moving Metallic Gold Shimmer */}
          <div className="relative z-20 w-full px-6 max-w-7xl flex flex-col items-center justify-center text-center my-auto py-12 sm:py-16 md:py-20 lg:py-24">
            <motion.h1
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-brand-heading relative inline-block font-serif font-light text-[#F0D58A] text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px] 2xl:text-[112px] tracking-[0.14em] sm:tracking-[0.18em] md:tracking-[0.2em] lg:tracking-[0.22em] uppercase leading-[1.15] sm:leading-[1.1] md:leading-none select-none"
              style={{ color: "#F0D58A", opacity: 1, textShadow: "0 2px 16px rgba(0,0,0,0.55)" }}
            >
              <span className="relative z-10 inline-block" style={{ color: "#F0D58A", opacity: 1 }}>
                {brandTitleWords.map((wordObj: { word: string; letters: { char: string; index: number }[] }, wIdx: number) => (
                  <span key={wIdx} className="inline-block whitespace-nowrap" style={{ color: "#F0D58A", opacity: 1 }}>
                    {wordObj.letters.map((item: { char: string; index: number }) => (
                      <span
                        key={item.index}
                        className="inline-block"
                        style={{ color: "#F0D58A", opacity: 1 }}
                      >
                        {item.char}
                      </span>
                    ))}
                    {wIdx < brandTitleWords.length - 1 && (
                      <span className="inline-block w-[0.28em]">&nbsp;</span>
                    )}
                  </span>
                ))}
              </span>
            </motion.h1>

            {/* Subtitle Reveal: Smooth Fade & Upward Slide after heading finishes */}
            {heroConfig.tagline && (
              <motion.h2 
                initial={{ opacity: 0.9, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="hero-subtitle text-sm sm:text-base md:text-lg lg:text-xl text-[#FDF8EE] tracking-[0.22em] sm:tracking-[0.28em] md:tracking-[0.32em] uppercase mt-5 sm:mt-7 md:mt-8 font-normal drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)] max-w-3xl mx-auto leading-relaxed"
                style={{ color: "#FDF8EE", opacity: 1, textShadow: "0 2px 14px rgba(0,0,0,0.85)" }}
              >
                {heroConfig.tagline === 'Timeless Elegance & Royal Heritage' ? 'Tripura’s Best Jewellery Brand' : heroConfig.tagline}
              </motion.h2>
            )}

            {/* Subtle Gold Shimmer Accent Line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.0, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-32 sm:w-48 md:w-64 lg:w-72 h-[1.5px] bg-gradient-to-r from-transparent via-[#D6B15D]/90 to-transparent mt-5 sm:mt-7 md:mt-8 relative overflow-hidden"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFF8EC] to-transparent w-full animate-gold-shimmer-sweep" />
            </motion.div>
          </div>

          {/* Straight Clean Antique-Gold Luxury Divider into Warm Ivory Section */}
          <div className="w-full flex justify-center pointer-events-none absolute bottom-0 inset-x-0">
            <div className="w-full max-w-7xl px-6">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C49A45]/40 to-transparent" />
            </div>
          </div>
        </section>
      )}

      {/* 3.5 Animated 3D Cover-Flow "Top Picks" Luxury Showcase */}
      {enabledSections.top_picks && <TopPicksCoverFlow />}

      {/* 4. The Aranyak Heritage & Brand Stats Section */}
      {enabledSections.philosophy_stats && (
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
                  Masterpieces born from <span className="font-editorial gold-gradient text-[#8A5A12]">heritage</span> & crafted for eternity.
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
                { num: "IV", title: "Curated Luxury", desc: "Bespoke bridal sets, daily elegance wear, and mastercrafted silver ornaments." }
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
            {dynamicStats.map((stat: any) => stat.label.includes('Showroom') ? { ...stat, value: `${liveStoresCount}` } : stat).map((stat: any, idx: number) => {
              const valStr = String(stat.value || '');
              const numMatch = valStr.match(/^([0-9,]+)(.*)$/);

              return (
                <MagneticCard key={idx} tiltAmount={4} glareOpacity={0.12}>
                  <div className="p-6 sm:p-8 bg-[#FFFDF8] border border-[#DED2C1] hover:border-[#D6B15D]/70 transition-all duration-300 rounded-xl shadow-sm h-full flex flex-col justify-center items-center">
                    <p className="text-4xl md:text-5xl font-serif font-light text-[#8A5A12] mb-2 stat-counter inline-flex items-baseline justify-center">
                      {numMatch ? (
                        <>
                          <span className="tabular-nums lining-nums">{numMatch[1]}</span>
                          {numMatch[2] && (
                            <span className="num-suffix font-light text-[0.68em] ml-0.5">{numMatch[2]}</span>
                          )}
                        </>
                      ) : (
                        <span className="tabular-nums lining-nums">{valStr}</span>
                      )}
                    </p>
                    <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#211813] leading-snug">{stat.label}</p>
                  </div>
                </MagneticCard>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* 5. Craftsmanship Video Showcase */}
      {enabledSections.craftsmanship && (
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
                <span className="font-editorial gold-gradient">Craftsmanship</span>
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
      )}

      {/* 6. Curated High Jewellery Collections (Interactive Grid) */}
      {enabledSections.collections && (
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
                High <span className="font-editorial gold-gradient text-[#8A5A12]">Jewellery</span>
              </h3>
            </Reveal>
          </div>

          <motion.div style={{ y: yParallaxGrid }} className="grid grid-cols-1 md:grid-cols-12 auto-rows-[500px] md:auto-rows-[580px] gap-6">
            
            {displayCategories.map((cat, idx) => {
              const badgeText = cat.badge || [
                '22K Bridal Trousseau',
                '22K Hallmarked Gold',
                'VVS-VS Solitaires',
                '92.5 Sterling Silver'
              ][idx % 4];

              return (
                <Link 
                  key={cat.id} 
                  href={cat.slug.startsWith('/') ? cat.slug : `/category/${cat.slug}`} 
                  className={`${cat.span} row-span-1 relative group overflow-hidden bg-[#211813] flex items-center justify-center p-10 border border-[#DED2C1]/30 hover:border-[#E0BD72]/70 rounded-2xl transition-all duration-700 shadow-xl`}
                >
                  <MouseParallaxImage src={cat.imageUrl} alt={cat.altText || cat.name} intensity={18} />
                  
                  {/* Subtle multi-stop image gradient ensuring high contrast without overly darkening jewellery */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211813]/95 via-[#211813]/50 to-transparent transition-opacity duration-700 group-hover:opacity-95 pointer-events-none" />
                  
                  <div className="relative z-10 text-center flex flex-col items-center justify-end h-full pb-6">
                    <span 
                      className="text-[9px] font-semibold tracking-[0.28em] uppercase px-3.5 py-1 rounded-full border mb-3 group-hover:scale-105 transition-transform backdrop-blur-sm shadow-sm lining-nums tabular-nums inline-flex items-center justify-center leading-none"
                      style={{
                        color: "#E0BD72",
                        background: "rgba(33,24,19,0.75)",
                        borderColor: "rgba(224,189,114,0.4)"
                      }}
                    >
                      {badgeText}
                    </span>
                    <h4 
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-serif font-light tracking-[0.05em] sm:tracking-[0.07em] leading-[1.15] md:leading-[1.18] mb-3 sm:mb-4 transition-colors drop-shadow-md lining-nums tabular-nums text-balance"
                      style={{ color: "#FFF8EC" }}
                    >
                      {cat.name}
                    </h4>
                    <p 
                      className="text-[11px] sm:text-xs md:text-[13px] font-sans font-light tracking-[0.14em] sm:tracking-[0.18em] uppercase max-w-md mx-auto mb-5 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-500 drop-shadow-sm"
                      style={{ color: "#E5D9C8" }}
                    >
                      {cat.tagline}
                    </p>
                    <div 
                      className="text-[10px] sm:text-[11px] font-medium tracking-[0.28em] sm:tracking-[0.32em] uppercase border-b border-[#E0BD72]/70 group-hover:border-[#E0BD72] pb-1 inline-flex items-center gap-2 transform translate-y-1 group-hover:translate-y-0 transition-all duration-500"
                      style={{
                        color: "#E0BD72"
                      }}
                    >
                      <span>{cat.ctaText || "DISCOVER COLLECTION"}</span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-300 font-serif">→</span>
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
      )}

      {/* Master Gallery Teaser Showcase */}
      {enabledSections.high_jewellery && (
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
                Master <span className="font-editorial gold-gradient text-[#8A5A12]">Gallery</span> Directory
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
                    alt="Certified Solitaire Diamond Halo Ring"
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
                      Solitaire Diamond Halo Ring
                    </span>
                  </div>
                </div>

                {/* Bottom Supporting Image (Right column, Row 2) */}
                <div className="relative h-[240px] sm:h-full w-full rounded-2xl overflow-hidden shadow-xl group border border-[#DED2C1]/60 bg-[#211813]">
                  <Image 
                    src="/uploads/gallery_chandeliers_feature.webp" 
                    alt="Handcrafted 22K Gold Butterfly Chandelier Earrings"
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
                      22K GOLD EARPIECES
                    </span>
                    <span 
                      className="text-sm font-serif font-medium"
                      style={{ color: "#FFF8EC" }}
                    >
                      Gold Butterfly Chandelier Drops
                    </span>
                  </div>
                </div>

              </div>
            </Reveal>
          </div>

        </div>
      </section>
      )}

      {/* Instagram & Social Official Lookbook & Feed Showcase */}
      {enabledSections.instagram && (
        <section className="py-24 bg-[#FFFDF8] border-b border-[#DED2C1] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <Reveal>
              <span className="text-[11px] tracking-[0.4em] uppercase font-bold text-[#966719] mb-3 block">
                CONNECT WITH ARANYAK
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="text-4xl sm:text-6xl font-serif font-light text-[#211813] mb-4">
                Follow Our Journey
              </h3>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-sm sm:text-base text-[#40352F] font-normal tracking-wide max-w-2xl mx-auto mb-8 leading-relaxed">
                Discover our latest jewellery collections, new arrivals and timeless designs on social media.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a 
                  href="https://www.instagram.com/aranyakjewellers/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 px-7 py-3.5 rounded-full bg-[#211813] text-[#FFF8EB] text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#8A5A12] hover:text-[#FFF8EC] border border-[#8A5A12]/30 transition-all duration-300 shadow-md group"
                >
                  <svg className="w-4 h-4 fill-current text-[#D6B15D] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Follow on Instagram</span>
                </a>
                <a 
                  href="https://www.facebook.com/aranyakjewellers" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-3 px-7 py-3.5 rounded-full bg-[#FAF7F0] text-[#211813] text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#8A5A12] hover:text-[#FFF8EC] border border-[#211813]/20 hover:border-[#8A5A12] transition-all duration-300 shadow-sm group"
                >
                  <svg className="w-4 h-4 fill-current text-[#1877F2] group-hover:text-[#FFF8EC] transition-colors" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Follow on Facebook</span>
                </a>
              </div>
            </Reveal>
          </div>

          {/* Instagram Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { img: liveMediaMap['gallery_royal_set'] || '/uploads/lookbook_bridal_sitahar.webp', title: 'Pure Silver Filigree Sitahar', tag: 'Silver Heritage' },
              { img: liveMediaMap['gallery_earring_drop'] || '/uploads/lookbook_filigree_jhumkas.webp', title: 'Silver Filigree Necklace & Jhumkas', tag: 'Silver Craft Feature' },
              { img: liveMediaMap['gallery_diamond_ring'] || '/uploads/gallery_solitaire_feature.webp', title: 'Solitaire Diamond Halo Ring', tag: 'Spotlight Edit' },
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
      )}

      {/* 7. Client Testimonials & Stories of Trust */}
      {enabledSections.testimonials && (
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
                  Cherished <span className="font-editorial gold-gradient text-[#8A5A12]">Stories</span>
                </h3>
              </Reveal>
            </div>

            <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dynamicTestimonials.map((t: any, idx: number) => (
                <StaggerItem key={idx} y={30} className="h-full">
                  <MagneticCard tiltIntensity={4} className="h-full rounded-xl">
                    <div className="bg-[#FFFDF8] border border-[#DED2C1] p-8 sm:p-10 flex flex-col justify-between h-full hover:border-[#D6B15D]/70 transition-all duration-500 shadow-sm hover:shadow-lg rounded-xl">
                      <div>
                        {/* Stars with Subtle Stagger */}
                        <div className="flex items-center space-x-1 text-[#8A5A12] mb-6 leading-none">
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <span key={i} className="text-sm font-bold drop-shadow-sm leading-none">★</span>
                          ))}
                        </div>
                        <p className="text-sm text-[#40352F] font-normal leading-[1.8] not-italic mb-8">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                      </div>

                      <div className="pt-6 border-t border-[#DED2C1] flex items-center justify-between gap-3">
                        <div>
                          <h4 className="text-base font-serif font-bold text-[#211813] leading-snug">{t.author}</h4>
                          <p className="text-[11px] text-[#70440C] uppercase tracking-wider font-semibold mt-0.5">{t.location}</p>
                        </div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A5A12] bg-[#8A5A12]/10 border border-[#8A5A12]/30 px-3 py-1 rounded-sm lining-nums tabular-nums whitespace-nowrap">
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
      )}

      {/* 8. Showroom Editorial CTA Section */}
      {enabledSections.rates_showroom && (
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
              <span className="font-editorial gold-gradient">Brilliance</span> in Person
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
      )}

    </main>
  );
}
