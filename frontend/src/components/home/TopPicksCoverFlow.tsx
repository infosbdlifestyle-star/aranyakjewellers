"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/animations/Reveal';

export interface TopPickItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  poster: string;
  videoSrc?: string;
  link: string;
  description?: string;
}

const DEFAULT_TOP_PICKS: TopPickItem[] = [
  {
    id: 'bridal-elegance',
    title: 'Bridal Elegance',
    subtitle: 'Timeless Bridal Jewellery',
    tag: 'Royal Trousseau',
    poster: '/uploads/top_picks_bridal_elegance.webp',
    videoSrc: '/videos/bridal-elegance.mp4',
    link: '/category/bridal-jewellery',
    description: 'Heirloom 22K sitahars and choker sets handcrafted for royal Bengali brides.',
  },
  {
    id: 'party-glow',
    title: 'Party Glow',
    subtitle: 'Ready to Shine',
    tag: 'Evening Sparkle',
    poster: '/uploads/top_picks_party_glow.webp',
    videoSrc: '/videos/party-glow.mp4',
    link: '/category/gold',
    description: 'Handcrafted 22K gold butterfly dangle earrings with delicate chandelier movement.',
  },
  {
    id: 'everyday-classics',
    title: 'Everyday Classics',
    subtitle: 'Everyday Elegance',
    tag: 'Modern Minimal',
    poster: '/uploads/top_picks_everyday_classics.webp',
    videoSrc: '/videos/everyday-classics.mp4',
    link: '/category/gold',
    description: 'Delicate chains, multi-strand filigree leaves, and effortless luxury for daily sophistication.',
  },
  {
    id: 'traditional-heritage',
    title: 'Traditional Heritage',
    subtitle: 'Rooted in Bengali Craftsmanship',
    tag: 'Master Karigari',
    poster: '/uploads/top_picks_traditional_heritage.webp',
    videoSrc: '/videos/traditional-heritage.mp4',
    link: '/category/gold',
    description: 'Centuries-old filigree and die-stamped gold sculpted by legacy artisans.',
  },
  {
    id: 'diamond-dreams',
    title: 'Diamond Dreams',
    subtitle: 'Modern Brilliance',
    tag: 'Certified Solitaires',
    poster: '/uploads/top_picks_diamond_dreams.webp',
    videoSrc: '/videos/diamond-dreams.mp4',
    link: '/category/diamond',
    description: 'Sparkling diamond pavé hearts and floral motifs crafted in hallmarked gold.',
  },
  {
    id: 'gold-essentials',
    title: 'Gold Essentials',
    subtitle: 'The Beauty of Pure Gold',
    tag: '22K BIS Hallmarked',
    poster: '/uploads/top_picks_gold_essentials.webp',
    videoSrc: '/videos/gold-essentials.mp4',
    link: '/category/gold',
    description: 'Sacred temple iconography and heavy hallmarked gold bangles.',
  },
];

interface TopPicksCoverFlowProps {
  items?: TopPickItem[];
  title?: string;
  subtitle?: string;
  sectionBadge?: string;
}

export default function TopPicksCoverFlow({
  items = DEFAULT_TOP_PICKS,
  title = "Top Picks",
  subtitle = "Handcrafted master collections curated for life's most luminous celebrations.",
  sectionBadge = "CURATED EDITORIAL COLLECTION",
}: TopPicksCoverFlowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [screenSize, setScreenSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [videoStatus, setVideoStatus] = useState<Record<string, { error: boolean; loaded: boolean }>>({});

  // Touch swipe states
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // References to video elements
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Measure screen width for responsive 3D transforms
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Safe navigation handlers with transition cooldown
  const total = items.length;

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % total);
    setTimeout(() => setIsAnimating(false), 250);
  }, [isAnimating, total]);

  const goToPrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + total) % total);
    setTimeout(() => setIsAnimating(false), 250);
  }, [isAnimating, total]);

  const goToIndex = useCallback((index: number) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 250);
  }, [isAnimating, activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Autoplay: automatically advance to next card every 2 seconds (2000ms), resets on manual navigation
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [activeIndex, isHovered, items.length]);

  // Video playback management: play active card video, pause inactive card videos
  useEffect(() => {
    items.forEach((item, index) => {
      const videoEl = videoRefs.current[item.id];
      if (!videoEl) return;

      const isCurrentActive = index === activeIndex;
      const status = videoStatus[item.id];

      if (isCurrentActive && !status?.error) {
        // Active card: attempt smooth muted playback
        videoEl.play().catch(() => {
          // Silent catch for browser policy or network issues
        });
      } else {
        // Inactive card: pause to save CPU and GPU resources
        videoEl.pause();
      }
    });
  }, [activeIndex, items, videoStatus]);

  // Video error handling
  const handleVideoError = (itemId: string) => {
    setVideoStatus((prev) => ({
      ...prev,
      [itemId]: { ...(prev[itemId] || {}), error: true, loaded: false },
    }));
  };

  const handleVideoLoaded = (itemId: string) => {
    setVideoStatus((prev) => ({
      ...prev,
      [itemId]: { ...(prev[itemId] || {}), error: false, loaded: true },
    }));
  };

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Calculate 3D cover-flow position and transform for each card
  const getCardStyle = (index: number) => {
    let diff = (index - activeIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    // Reduced motion fallback (pure slide & scale, no 3D rotation)
    if (prefersReducedMotion) {
      const isCenter = diff === 0;
      const isVisible = Math.abs(diff) <= 1;
      return {
        transform: `translateX(calc(-50% + ${diff * 280}px)) scale(${isCenter ? 1 : 0.85})`,
        opacity: isCenter ? 1 : isVisible ? 0.6 : 0,
        zIndex: isCenter ? 30 : 10,
        pointerEvents: isCenter ? ('auto' as const) : isVisible ? ('auto' as const) : ('none' as const),
        filter: 'none',
        transition: 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1), opacity 300ms ease',
      };
    }

    // Mobile Layout (< 768px)
    if (screenSize === 'mobile') {
      if (diff === 0) {
        return {
          transform: 'translateX(-50%) translateZ(40px) rotateY(0deg) scale(1)',
          opacity: 1,
          filter: 'blur(0px)',
          zIndex: 40,
          pointerEvents: 'auto' as const,
        };
      }
      if (diff === 1) {
        return {
          transform: 'translateX(calc(-50% + 140px)) translateZ(-60px) rotateY(-18deg) scale(0.84)',
          opacity: 0.65,
          filter: 'blur(1px)',
          zIndex: 25,
          pointerEvents: 'auto' as const,
        };
      }
      if (diff === -1) {
        return {
          transform: 'translateX(calc(-50% - 140px)) translateZ(-60px) rotateY(18deg) scale(0.84)',
          opacity: 0.65,
          filter: 'blur(1px)',
          zIndex: 25,
          pointerEvents: 'auto' as const,
        };
      }
      // Hidden outer cards on mobile to prevent clutter and overflow
      return {
        transform: `translateX(calc(-50% + ${diff > 0 ? 240 : -240}px)) translateZ(-160px) rotateY(${diff > 0 ? -30 : 30}deg) scale(0.7)`,
        opacity: 0,
        filter: 'blur(4px)',
        zIndex: 5,
        pointerEvents: 'none' as const,
      };
    }

    // Tablet Layout (768px - 1023px)
    if (screenSize === 'tablet') {
      if (diff === 0) {
        return {
          transform: 'translateX(-50%) translateZ(60px) rotateY(0deg) scale(1)',
          opacity: 1,
          filter: 'blur(0px)',
          zIndex: 40,
          pointerEvents: 'auto' as const,
        };
      }
      if (diff === 1) {
        return {
          transform: 'translateX(calc(-50% + 200px)) translateZ(-80px) rotateY(-22deg) scale(0.86)',
          opacity: 0.75,
          filter: 'blur(1px)',
          zIndex: 30,
          pointerEvents: 'auto' as const,
        };
      }
      if (diff === -1) {
        return {
          transform: 'translateX(calc(-50% - 200px)) translateZ(-80px) rotateY(22deg) scale(0.86)',
          opacity: 0.75,
          filter: 'blur(1px)',
          zIndex: 30,
          pointerEvents: 'auto' as const,
        };
      }
      if (diff === 2) {
        return {
          transform: 'translateX(calc(-50% + 360px)) translateZ(-160px) rotateY(-36deg) scale(0.72)',
          opacity: 0.4,
          filter: 'blur(2px)',
          zIndex: 20,
          pointerEvents: 'auto' as const,
        };
      }
      if (diff === -2) {
        return {
          transform: 'translateX(calc(-50% - 360px)) translateZ(-160px) rotateY(36deg) scale(0.72)',
          opacity: 0.4,
          filter: 'blur(2px)',
          zIndex: 20,
          pointerEvents: 'auto' as const,
        };
      }
      return {
        transform: `translateX(calc(-50% + ${diff > 0 ? 460 : -460}px)) translateZ(-240px) scale(0.6)`,
        opacity: 0,
        filter: 'blur(4px)',
        zIndex: 5,
        pointerEvents: 'none' as const,
      };
    }

    // Desktop Layout (>= 1024px) — Full 5-card 3D perspective
    if (diff === 0) {
      return {
        transform: 'translateX(-50%) translateZ(80px) rotateY(0deg) scale(1)',
        opacity: 1,
        filter: 'blur(0px)',
        zIndex: 40,
        pointerEvents: 'auto' as const,
      };
    }
    if (diff === 1) {
      return {
        transform: 'translateX(calc(-50% + 270px)) translateZ(-90px) rotateY(-26deg) scale(0.87)',
        opacity: 0.8,
        filter: 'blur(0.8px)',
        zIndex: 30,
        pointerEvents: 'auto' as const,
      };
    }
    if (diff === -1) {
      return {
        transform: 'translateX(calc(-50% - 270px)) translateZ(-90px) rotateY(26deg) scale(0.87)',
        opacity: 0.8,
        filter: 'blur(0.8px)',
        zIndex: 30,
        pointerEvents: 'auto' as const,
      };
    }
    if (diff === 2) {
      return {
        transform: 'translateX(calc(-50% + 490px)) translateZ(-200px) rotateY(-40deg) scale(0.73)',
        opacity: 0.45,
        filter: 'blur(2px)',
        zIndex: 20,
        pointerEvents: 'auto' as const,
      };
    }
    if (diff === -2) {
      return {
        transform: 'translateX(calc(-50% - 490px)) translateZ(-200px) rotateY(40deg) scale(0.73)',
        opacity: 0.45,
        filter: 'blur(2px)',
        zIndex: 20,
        pointerEvents: 'auto' as const,
      };
    }
    // Outer cards wrapped around back
    return {
      transform: `translateX(calc(-50% + ${diff > 0 ? 620 : -620}px)) translateZ(-300px) rotateY(${diff > 0 ? -48 : 48}deg) scale(0.6)`,
      opacity: 0,
      filter: 'blur(4px)',
      zIndex: 5,
      pointerEvents: 'none' as const,
    };
  };

  const activeItem = items[activeIndex];

  return (
    <section 
      className="py-20 md:py-32 bg-[#FAF7F0] border-b border-[#DED2C1] relative overflow-hidden select-none"
      aria-label="Top Picks Jewellery Showcase"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle visual continuity gradient at section top */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#F0E7D8]/40 via-[#F8F4EC]/60 to-transparent pointer-events-none" />

      {/* Subtle luxury ambient gold background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-[#C49A45]/6 via-[#C49A45]/10 to-[#C49A45]/6 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
          <Reveal>
            <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-[#F0E7D8] border border-[#DED2C1] mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C49A45] animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.35em] uppercase text-[#98712E]">
                {sectionBadge}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C49A45] animate-pulse" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light text-[#241B17] tracking-tight leading-tight">
              Top <span className="font-editorial gold-gradient italic">Picks</span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-4 text-xs sm:text-sm md:text-base text-[#40352F] font-normal tracking-wide max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </Reveal>
        </div>

        {/* 3D Cover-Flow Carousel Container */}
        <div 
          className="relative w-full py-4 min-h-[500px] sm:min-h-[560px] md:min-h-[600px] flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            perspective: screenSize === 'mobile' ? '1000px' : '1300px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Navigation Button — Left */}
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous Jewellery Collection"
            className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full bg-[#FFFDF8] hover:bg-[#241B17] text-[#241B17] hover:text-[#FFF8EB] border border-[#DED2C1] shadow-md backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#C49A45]"
          >
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-x-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Navigation Button — Right */}
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next Jewellery Collection"
            className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full bg-[#FFFDF8] hover:bg-[#241B17] text-[#241B17] hover:text-[#FFF8EB] border border-[#DED2C1] shadow-md backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#C49A45]"
          >
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Stage for Cards */}
          <div className="relative w-full h-[440px] sm:h-[490px] md:h-[530px] flex items-center justify-center">
            {items.map((item, index) => {
              const cardStyle = getCardStyle(index);
              const isCenter = index === activeIndex;
              const hasVideo = !!item.videoSrc && !videoStatus[item.id]?.error;
              const isVideoPlaying = isCenter && hasVideo && videoStatus[item.id]?.loaded;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!isCenter) {
                      goToIndex(index);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: screenSize === 'mobile' ? '-205px' : screenSize === 'tablet' ? '-235px' : '-255px',
                    transition: prefersReducedMotion 
                      ? 'transform 250ms ease, opacity 250ms ease' 
                      : 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms cubic-bezier(0.22, 1, 0.36, 1), filter 300ms cubic-bezier(0.22, 1, 0.36, 1)',
                    transformOrigin: 'center center',
                    ...cardStyle,
                  }}
                  className={`
                    w-[270px] sm:w-[310px] md:w-[350px] lg:w-[360px] 
                    h-[410px] sm:h-[470px] md:h-[510px] 
                    rounded-2xl sm:rounded-3xl overflow-hidden
                    bg-[#211713]
                    ${isCenter 
                      ? 'border-2 border-[#C49A45]/75 shadow-[0_20px_45px_-12px_rgba(33,23,19,0.35),0_0_20px_rgba(196,154,69,0.2)] ring-1 ring-[#C49A45]/40 cursor-default' 
                      : 'border border-[#DED2C1]/20 shadow-lg hover:border-[#C49A45]/40 cursor-pointer'
                    }
                  `}
                >
                  {/* Card Media Layer (Video + Poster Image Fallback) */}
                  <div className="relative w-full h-full overflow-hidden bg-[#211713]">
                    
                    {/* High-Resolution Poster Image (Always present as instant backdrop) */}
                    <Image
                      src={item.poster}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 270px, 360px"
                      priority={isCenter}
                      className={`object-cover object-center transition-all duration-300 ${
                        isCenter ? 'scale-105' : 'scale-100 opacity-90'
                      }`}
                    />

                    {/* HTML5 Video Element (plays when card is center active, seamlessly falls back to poster if absent) */}
                    {item.videoSrc && !videoStatus[item.id]?.error && (
                      <video
                        ref={(el) => {
                          videoRefs.current[item.id] = el;
                        }}
                        src={item.videoSrc}
                        poster={item.poster}
                        playsInline
                        muted
                        loop
                        preload={isCenter ? 'auto' : 'none'}
                        onLoadedData={() => handleVideoLoaded(item.id)}
                        onError={() => handleVideoError(item.id)}
                        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${
                          isVideoPlaying ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    )}

                    {/* Editorial Vignette & Bottom Text Contrast Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#211713] via-[#211713]/60 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#211713]/40 via-transparent to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                      <span className="px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.25em] uppercase bg-[#211713]/85 backdrop-blur-md text-[#E7C880] border border-[#C49A45]/40 shadow-md">
                        {item.tag}
                      </span>

                      {/* Video Motion Indicator */}
                      {isVideoPlaying && (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#211713]/85 backdrop-blur-md text-[#E7C880] text-[8px] font-bold tracking-widest border border-[#C49A45]/50 shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C49A45] animate-ping" />
                          <span>MOTION</span>
                        </span>
                      )}
                    </div>

                    {/* Bottom Editorial Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-20 flex flex-col justify-end text-left">
                      
                      {/* Small Gold Subtitle */}
                      <span className="text-[11px] sm:text-xs font-editorial italic text-[#E7C880] tracking-widest uppercase mb-1 drop-shadow-sm">
                        {item.subtitle}
                      </span>

                      {/* Collection Title */}
                      <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#FFF8EB] tracking-wide leading-tight drop-shadow-md">
                        {item.title}
                      </h3>

                      {/* Description & Action Link (Prominently shown on active card) */}
                      {isCenter && (
                        <div className="mt-3 pt-3 border-t border-[#DED2C1]/20 flex flex-col space-y-2">
                          {item.description && (
                            <p className="text-[11px] text-[#E5D7C5] font-light leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          <Link
                            href={item.link}
                            className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-[#E7C880] hover:text-[#FFF8EB] transition-colors duration-300 pt-1 group/cta"
                          >
                            <span>Explore Collection</span>
                            <span className="transform transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
                          </Link>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination & Indicator Controls */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-center space-y-4">
          
          {/* Active Collection Counter */}
          <div className="flex items-center space-x-3 text-xs tracking-widest uppercase text-[#40352F] font-semibold">
            <span className="text-[#E7C880] font-serif text-sm font-bold">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="w-8 h-[1px] bg-[#DED2C1]" />
            <span className="text-[#241B17] font-medium">
              {activeItem.title}
            </span>
            <span className="w-8 h-[1px] bg-[#DED2C1]" />
            <span className="text-[#40352F]/60 font-serif text-sm">
              {String(total).padStart(2, '0')}
            </span>
          </div>

          {/* Luxury Dots Indicator */}
          <div className="flex items-center space-x-2.5">
            {items.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToIndex(idx)}
                  aria-label={`Jump to ${item.title}`}
                  className={`h-1.5 transition-all duration-500 rounded-full focus:outline-none ${
                    isActive 
                      ? 'w-8 bg-[#98712E]' 
                      : 'w-2 bg-[#DED2C1] hover:bg-[#98712E]/50'
                  }`}
                />
              );
            })}
          </div>

          {/* Touch Swipe / Keyboard Prompt (Subtle UX tip) */}
          <p className="text-[10px] text-[#40352F] uppercase tracking-[0.25em] font-medium pt-2">
            Swipe or use arrow keys to browse
          </p>
        </div>

      </div>
    </section>
  );
}
