"use client";

import React, { useMemo } from 'react';

interface PromotionalAnnouncementBarProps {
  marqueeText?: string;
  className?: string;
}

// All verified promotional offers matching the 7 original cards and brand highlights
const CORE_PROMOTIONAL_OFFERS: string[] = [
  "🌸 আরণ্যক জুয়েলার্স বিশেষ পুজো অফার ২০২৬",
  "🪙 সোনার গয়না: ১০০০/- টাকা ছাড় প্রতিগ্রাম সোনার গয়না কেনাকাটায় (₹1000 OFF/GM)",
  "♻️ পুরোনো গয়না পরিবর্তন: ১০০% মূল্য হলমার্কযুক্ত পুরোনো গয়নার পরিবর্তে (ZERO LOSS EXCHANGE)",
  "💎 হীরের গয়না: ১০০% ছাড় হীরের গয়নার মজুরিতে (100% FREE MAKING)",
  "🥈 রুপোর গয়না: ২৫% ছাড় রূপোর গয়নার MRP-র ওপর (25% FLAT DISCOUNT)",
  "📺 প্রতিদিন লাকি ড্র: প্রতিদিনের লাকি ড্র-তে হোম অ্যাপ্লায়েন্স (DAILY PRIZES)",
  "🎁 নিশ্চিত উপহার: নিশ্চিত উপহার প্রতি কেনাকাটায় (FREE GIFTS)",
  "🛵 মেগা লাকি ড্র: MEGA LUCKY DRAW ৩টি স্কুটি (3X SCOOTY BUMPER)",
  "📍 ত্রিপুরা শোরুম: আগরতলা • ধর্মনগর • কৈলাশহর • খোয়াই"
];

export default function PromotionalAnnouncementBar({
  marqueeText,
  className = ""
}: PromotionalAnnouncementBarProps) {
  // Parse dynamic settings text or use verified complete offer list
  const messages = useMemo(() => {
    if (marqueeText && typeof marqueeText === 'string' && marqueeText.includes('|')) {
      const split = marqueeText
        .split('|')
        .map(s => s.trim())
        .filter(Boolean);
      if (split.length >= 3) {
        return split;
      }
    }
    return CORE_PROMOTIONAL_OFFERS;
  }, [marqueeText]);

  return (
    <>
      {/* Inline styles for guaranteed hardware-accelerated 60fps marquee across all browsers */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes continuousOffersScroll {
          0% {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
          }
          100% {
            -webkit-transform: translate3d(-50%, 0, 0);
            transform: translate3d(-50%, 0, 0);
          }
        }
        @-webkit-keyframes continuousOffersScroll {
          0% {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
          }
          100% {
            -webkit-transform: translate3d(-50%, 0, 0);
            transform: translate3d(-50%, 0, 0);
          }
        }
        .offers-marquee-track {
          display: flex !important;
          width: max-content !important;
          will-change: transform;
          animation: continuousOffersScroll 40s linear infinite !important;
          -webkit-animation: continuousOffersScroll 40s linear infinite !important;
        }
        .offers-marquee-container:hover .offers-marquee-track,
        .offers-marquee-track:hover {
          animation-play-state: paused !important;
          -webkit-animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .offers-marquee-track {
            animation-duration: 120s !important;
            -webkit-animation-duration: 120s !important;
          }
        }
      `}} />

      <aside 
        role="region"
        aria-label="Promotional Offers Continuous Ticker"
        className={`offers-marquee-container relative w-full h-11 sm:h-12 md:h-[50px] bg-gradient-to-r from-[#D4A745] via-[#D9AF4D] to-[#D4A745] border-t border-[#C49A45]/40 border-b border-[#B8872D]/60 shadow-[0_3px_12px_rgba(33,23,19,0.10)] flex items-center overflow-hidden select-none z-40 ${className}`}
      >
        {/* Left & Right luxury gradient masks */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#D4A745] to-transparent pointer-events-none z-10" 
          aria-hidden="true" 
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#D4A745] to-transparent pointer-events-none z-10" 
          aria-hidden="true" 
        />

        {/* Continuous Automatic Moving Offers Track (Right to Left loop) */}
        <div className="offers-marquee-track flex items-center">
          {/* Sequence Copy 1 */}
          <div className="flex items-center shrink-0">
            {messages.map((msg, idx) => (
              <div key={`offer-set1-${idx}`} className="flex items-center shrink-0">
                <span className="font-sans font-semibold text-xs sm:text-[13px] md:text-sm text-[#211713] tracking-wide whitespace-nowrap px-1">
                  {msg}
                </span>
                <span 
                  className="mx-4 sm:mx-6 text-[#211713]/70 text-xs sm:text-sm font-serif select-none" 
                  aria-hidden="true"
                >
                  ✦
                </span>
              </div>
            ))}
          </div>

          {/* Sequence Copy 2: Duplicate for seamless, uninterrupted loop */}
          <div className="flex items-center shrink-0" aria-hidden="true">
            {messages.map((msg, idx) => (
              <div key={`offer-set2-${idx}`} className="flex items-center shrink-0">
                <span className="font-sans font-semibold text-xs sm:text-[13px] md:text-sm text-[#211713] tracking-wide whitespace-nowrap px-1">
                  {msg}
                </span>
                <span 
                  className="mx-4 sm:mx-6 text-[#211713]/70 text-xs sm:text-sm font-serif select-none" 
                  aria-hidden="true"
                >
                  ✦
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
