"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE DATA — edit freely to add/remove slides or swap in real image URLs.
// Set `desktopBg` / `mobileBg` to image URLs (e.g. "/uploads/banner1.jpg")
// or leave as `null` to render the gradient fallback.
// ─────────────────────────────────────────────────────────────────────────────
export interface HeroSlide {
  id: string;
  /** Full-width desktop banner (1920×550 recommended). Use null for gradient slide. */
  desktopBg: string | null;
  /** Mobile banner (768×500 recommended). Falls back to desktopBg if null. */
  mobileBg: string | null;
  /** CSS gradient string used when no image is provided */
  gradientFallback: string;
  badge?: string;
  eyebrow?: string;
  headline: React.ReactNode;
  subline?: string;
  disclaimer?: string;
  cta?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  theme: "dark" | "light";
}

const SLIDES: HeroSlide[] = [
  // ── Slide 1: Making Charges Offer ─────────────────────────────────────────
  {
    id: "slide-making-charges",
    desktopBg: "/uploads/banner_diamond_offer.webp",
    mobileBg: "/uploads/banner_diamond_offer_mobile.webp",
    gradientFallback:
      "linear-gradient(135deg, #0D1B2A 0%, #162032 30%, #1A2744 55%, #0F2233 80%, #09131F 100%)",
    badge: "✦ Limited Period Offer",
    eyebrow: "ARANYAK JEWELLERS • EST. 1995",
    headline: (
      <>
        <span style={{ color: "#FFF8EC" }}>UP TO </span>
        <span
          style={{
            color: "#D6B15D",
            background:
              "linear-gradient(135deg, #D6B15D 0%, #E7C880 45%, #C49A45 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: 700,
            display: "inline-block",
          }}
        >
          100% OFF
        </span>
        <br />
        <span style={{ color: "#FFF8EC" }}>ON MAKING CHARGES</span>
      </>
    ),
    subline: "On certified diamond jewellery across all Tripura showrooms",
    disclaimer: "* T&C Apply. Valid at Agartala, Khowai, Dharmanagar & Kailashahar showrooms.",
    cta: { label: "Shop Diamond Jewellery", href: "/category/diamond" },
    ctaSecondary: { label: "View All Offers", href: "/collections" },
    theme: "dark",
  },

  // ── Slide 2: Bridal Gold Collection ───────────────────────────────────────
  {
    id: "slide-bridal-gold",
    desktopBg: "/uploads/banner_bridal_gold.webp",
    mobileBg: "/uploads/banner_bridal_gold_mobile.webp",
    gradientFallback:
      "linear-gradient(135deg, #211713 0%, #2C1A0E 25%, #3D2510 50%, #4B2E12 70%, #2C1A0E 100%)",
    badge: "🌸 Festive & Bridal Collection",
    eyebrow: "HANDCRAFTED • BIS 916 HALLMARKED",
    headline: (
      <>
        <span style={{ color: "#FFF8EC" }}>Timeless </span>
        <span
          style={{
            fontStyle: "italic",
            fontFamily: "var(--font-cormorant), serif",
            color: "#D6B15D",
            background:
              "linear-gradient(135deg, #D6B15D 0%, #E7C880 45%, #C49A45 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "inline-block",
          }}
        >
          Bridal Gold
        </span>
        <br />
        <span style={{ color: "#FFF8EC" }}>Jewellery</span>
      </>
    ),
    subline:
      "Handcrafted 22K hallmarked gold — chokers, necklaces, bangles & more for your most precious moments.",
    cta: { label: "Explore Collection", href: "/category/gold" },
    ctaSecondary: { label: "Find a Showroom", href: "/stores" },
    theme: "dark",
  },

  // ── Slide 3: Diamond & Solitaire ──────────────────────────────────────────
  {
    id: "slide-diamond",
    desktopBg: "/uploads/banner_diamond_offer.webp",
    mobileBg: "/uploads/banner_diamond_offer_mobile.webp",
    gradientFallback:
      "linear-gradient(135deg, #0C1520 0%, #0E1D2E 30%, #122840 55%, #1B3550 75%, #0C1E2E 100%)",
    badge: "💎 IGI Certified Diamonds",
    eyebrow: "VVS · VS · SI SOLITAIRES",
    headline: (
      <>
        <span style={{ color: "#FFF8EC" }}>Exclusive </span>
        <span
          style={{
            fontStyle: "italic",
            fontFamily: "var(--font-cormorant), serif",
            color: "#B8D4F0",
            background:
              "linear-gradient(135deg,#B8D4F0 0%,#E8F4FF 50%,#8BB8E8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "inline-block",
          }}
        >
          Diamond
        </span>
        <br />
        <span style={{ color: "#FFF8EC" }}>& Solitaire Edit</span>
      </>
    ),
    subline:
      "Certified solitaire rings, diamond pendant sets & eternity bands — each stone graded for brilliance and clarity.",
    cta: { label: "View Diamond Catalogue", href: "/category/diamond" },
    ctaSecondary: { label: "Book Private Viewing", href: "/contact" },
    theme: "dark",
  },

  // ── Slide 4: Silver & Exchange Offer ──────────────────────────────────────
  {
    id: "slide-silver-exchange",
    desktopBg: "/uploads/cat_antique_silver_heritage.webp",
    mobileBg: "/uploads/cat_antique_silver_heritage.webp",
    gradientFallback:
      "linear-gradient(135deg, #1A1A2E 0%, #16213E 30%, #0F3460 60%, #1A1A3E 100%)",
    badge: "♻️ Zero Loss Exchange",
    eyebrow: "UPGRADE YOUR JEWELLERY TODAY",
    headline: (
      <>
        Old Jewellery?{" "}
        <span
          style={{
            fontStyle: "italic",
            fontFamily: "var(--font-cormorant), serif",
            background:
              "linear-gradient(135deg,#C0C0C0 0%,#E8E8E8 50%,#A8A8A8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          100% Value
        </span>
        <br />
        Guaranteed
      </>
    ),
    subline:
      "Exchange any BIS hallmarked gold jewellery — from any store — and receive its full market value. Plus flat 20% off on silver.",
    cta: { label: "Learn About Exchange", href: "/collections" },
    ctaSecondary: { label: "Visit Nearest Store", href: "/stores" },
    theme: "dark",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

const AUTOPLAY_DELAY = 2000;
const TRANSITION_DURATION = 300; // ms — fast snappy transition

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0); // bumped on every slide change to retrigger text animations
  const isPaused = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Touch tracking
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent((index + SLIDES.length) % SLIDES.length);
    setAnimKey((k) => k + 1);
  }, []);

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // Autoplay timer
  const scheduleNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!isPaused.current) {
        setCurrent((c) => (c + 1) % SLIDES.length);
        setAnimKey((k) => k + 1);
      }
      scheduleNext();
    }, AUTOPLAY_DELAY);
  }, []);

  useEffect(() => {
    scheduleNext();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [scheduleNext]);

  const handleMouseEnter = useCallback(() => { isPaused.current = true; }, []);
  const handleMouseLeave = useCallback(() => { isPaused.current = false; }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) delta < 0 ? next() : prev();
    touchStartX.current = null;
  }, [next, prev]);

  return (
    <section
      className="hero-carousel-root relative w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured promotions carousel"
      aria-roledescription="carousel"
    >
      {/* ── Scoped styles ── */}
      <style>{`
        /* Wrapper height */
        .hero-carousel-root { height: clamp(340px, 58vw, 560px); }

        /* ── SLIDE track ── */
        .hero-slide-track {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .hero-slide-panel {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity ${TRANSITION_DURATION}ms cubic-bezier(0.4,0,0.2,1);
          pointer-events: none;
        }
        .hero-slide-panel.is-active {
          opacity: 1;
          pointer-events: auto;
        }

        /* ── SLIDE base ── */
        .hero-slide {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        /* ── Shimmer overlay animation ── */
        @keyframes heroShimmer {
          0%   { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(300%) skewX(-15deg); }
        }
        .hero-shimmer::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg,transparent 30%,rgba(196,154,69,0.06) 50%,transparent 70%);
          animation: heroShimmer 6s ease-in-out infinite;
          pointer-events: none;
          z-index: 5;
        }

        /* ── Text entrance animations (triggered per active slide) ── */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-slide-panel.is-active .slide-content  { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .hero-slide-panel.is-active .slide-eyebrow  { animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .hero-slide-panel.is-active .slide-headline { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
        .hero-slide-panel.is-active .slide-subline  { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.22s both; }
        .hero-slide-panel.is-active .slide-ctas     { animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.32s both; }
        .hero-slide-panel.is-active .slide-disclaimer { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.45s both; }

        /* Gold decorative divider */
        .hero-gold-divider {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 10px 0;
        }
        .hero-gold-divider span { width: 40px; height: 1px; background: #C49A45; opacity: 0.6; }
        .hero-gold-divider em { color: #C49A45; font-size: 10px; }

        /* ── NAV ARROWS ── */
        .hero-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          background: rgba(33,24,19,0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(222,210,193,0.35);
          color: #FFF8EB;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
          z-index: 30;
        }
        .hero-nav-btn:hover {
          background: #241B17;
          border-color: #C49A45;
          color: #E7C880;
          transform: translateY(-50%) scale(1.05);
        }
        .hero-nav-btn.prev { left: 16px; }
        .hero-nav-btn.next { right: 16px; }

        /* ── PAGINATION ── */
        .hero-pagination {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 30;
        }
        .hero-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.45);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: width 0.4s cubic-bezier(0.4,0,0.2,1), background 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s;
        }
        .hero-dot.is-active {
          width: 32px;
          background: #98712E;
          box-shadow: 0 0 10px rgba(152,113,46,0.5);
        }

        @media (max-width: 640px) {
          .hero-nav-btn { width: 36px; height: 36px; }
          .hero-nav-btn.prev { left: 8px; }
          .hero-nav-btn.next { right: 8px; }
        }
      `}</style>

      {/* ── Slide track ── */}
      <div className="hero-slide-track">
        {SLIDES.map((slide, idx) => (
          <div
            // Include animKey in the key for the active slide so React remounts
            // it on every transition — this restarts the CSS entrance animations.
            key={idx === current ? `${slide.id}-${animKey}` : slide.id}
            className={`hero-slide-panel${idx === current ? " is-active" : ""}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${idx + 1} of ${SLIDES.length}`}
            aria-hidden={idx !== current}
          >
            <div
              className="hero-slide hero-shimmer"
              style={{ background: slide.gradientFallback }}
            >
              {/* Desktop image */}
              {slide.desktopBg && (
                <div className="absolute inset-0 hidden sm:block">
                  <Image
                    src={slide.desktopBg}
                    alt={typeof slide.headline === 'string' ? slide.headline : (slide.eyebrow || 'Aranyak Fine Jewellery')}
                    fill
                    sizes="100vw"
                    priority={idx === 0}
                    className="object-cover"
                    style={{ opacity: 0.75 }}
                  />
                </div>
              )}
              {/* Mobile image */}
              {(slide.mobileBg || slide.desktopBg) && (
                <div className="absolute inset-0 sm:hidden">
                  <Image
                    src={slide.mobileBg || slide.desktopBg || ""}
                    alt={typeof slide.headline === 'string' ? slide.headline : (slide.eyebrow || 'Aranyak Fine Jewellery')}
                    fill
                    sizes="100vw"
                    priority={idx === 0}
                    className="object-cover"
                    style={{ opacity: 0.75 }}
                  />
                </div>
              )}

              {/* Gradient vignettes */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(33,24,19,0.95) 0%, rgba(33,24,19,0.70) 50%, rgba(33,24,19,0.25) 100%)",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 25%, rgba(33,24,19,0.80) 100%)",
                }}
              />

              {/* ── Decorative geometric accent ── */}
              <div
                className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none hidden lg:block"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(196,154,69,0.04) 0%,rgba(196,154,69,0.10) 100%)",
                  borderLeft: "1px solid rgba(196,154,69,0.12)",
                }}
              />
              <div
                className="absolute right-[32%] top-8 bottom-8 w-[1px] pointer-events-none hidden lg:block"
                style={{ background: "rgba(196,154,69,0.15)" }}
              />

              {/* ── Slide content ── */}
              <div className="relative z-10 w-full h-full flex items-center">
                <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl">
                  <div className="max-w-xl lg:max-w-2xl">
                    {/* Badge */}
                    {slide.badge && (
                      <div className="slide-content mb-3 sm:mb-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase border"
                          style={{
                            background: "rgba(196,154,69,0.15)",
                            borderColor: "rgba(196,154,69,0.4)",
                            color: "#C49A45",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ background: "#C49A45" }}
                          />
                          {slide.badge}
                        </span>
                      </div>
                    )}

                    {/* Eyebrow */}
                    {slide.eyebrow && (
                      <p
                        className="slide-eyebrow text-[9px] sm:text-[10px] font-bold tracking-[0.45em] uppercase mb-2 sm:mb-3"
                        style={{ color: "#E5D9C8" }}
                      >
                        {slide.eyebrow}
                      </p>
                    )}

                    {/* Gold star divider */}
                    <div className="hero-gold-divider slide-eyebrow">
                      <span />
                      <em>✦</em>
                      <span />
                    </div>

                    {/* Headline */}
                    <h2
                      className="slide-headline font-serif font-light leading-[0.95] tracking-tight text-[#FFF8EC] mt-1 mb-3 sm:mb-4"
                      style={{
                        fontSize: "clamp(2rem, 5.5vw, 4rem)",
                        textShadow: "0 2px 24px rgba(0,0,0,0.45)",
                      }}
                    >
                      {slide.headline}
                    </h2>

                    {/* Subline */}
                    {slide.subline && (
                      <p
                        className="slide-subline text-xs sm:text-sm font-normal tracking-wide leading-relaxed mb-5 sm:mb-7 max-w-md"
                        style={{ color: "#E5D9C8" }}
                      >
                        {slide.subline}
                      </p>
                    )}

                    {/* CTAs */}
                    {(slide.cta || slide.ctaSecondary) && (
                      <div className="slide-ctas flex flex-wrap items-center gap-3 sm:gap-4">
                        {slide.cta && (
                          <Link
                            href={slide.cta.href}
                            className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            style={{
                              background: "#C49A45",
                              color: "#211713",
                              border: "1px solid #A77C32",
                              boxShadow: "0 4px 20px rgba(196,154,69,0.3)",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "#A77C32";
                              (e.currentTarget as HTMLElement).style.color = "#F8F1E5";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "#C49A45";
                              (e.currentTarget as HTMLElement).style.color = "#211713";
                            }}
                          >
                            {slide.cta.label}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="m9 18 6-6-6-6"/>
                            </svg>
                          </Link>
                        )}
                        {slide.ctaSecondary && (
                          <Link
                            href={slide.ctaSecondary.href}
                            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase transition-all duration-300 hover:scale-105"
                            style={{
                              background: "rgba(33,24,19,0.7)",
                              color: "#FFF8EB",
                              border: "1px solid rgba(222,210,193,0.35)",
                              backdropFilter: "blur(8px)",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "#FAF7F0";
                              (e.currentTarget as HTMLElement).style.color = "#241B17";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "rgba(248,244,236,0.08)";
                              (e.currentTarget as HTMLElement).style.borderColor = "rgba(222,210,193,0.35)";
                            }}
                          >
                            {slide.ctaSecondary.label}
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Disclaimer */}
                    {slide.disclaimer && (
                      <p
                        className="slide-disclaimer mt-4 sm:mt-5 text-[9px] tracking-[0.15em]"
                        style={{ color: "rgba(212,197,178,0.5)" }}
                      >
                        {slide.disclaimer}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Bottom brand seal ── */}
              <div className="absolute bottom-5 right-6 z-10 hidden sm:flex items-center gap-2 pointer-events-none">
                <span
                  className="text-[9px] font-bold tracking-[0.35em] uppercase"
                  style={{ color: "rgba(196,154,69,0.55)" }}
                >
                  ARANYAK JEWELLERS
                </span>
                <span style={{ color: "rgba(196,154,69,0.4)", fontSize: 8 }}>✦</span>
                <span
                  className="text-[9px] font-bold tracking-[0.35em] uppercase"
                  style={{ color: "rgba(196,154,69,0.55)" }}
                >
                  EST. 1995
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Prev arrow ── */}
      <button
        className="hero-nav-btn prev"
        onClick={prev}
        aria-label="Previous slide"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>

      {/* ── Next arrow ── */}
      <button
        className="hero-nav-btn next"
        onClick={next}
        aria-label="Next slide"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>

      {/* ── Pagination dots ── */}
      <div className="hero-pagination" role="tablist" aria-label="Carousel slide indicators">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            className={`hero-dot${idx === current ? " is-active" : ""}`}
            onClick={() => goTo(idx)}
            role="tab"
            aria-selected={idx === current}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
