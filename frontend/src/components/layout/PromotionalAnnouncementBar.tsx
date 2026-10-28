"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface PromotionalAnnouncementBarProps {
  marqueeText?: string;
  className?: string;
}

/**
 * Strips all emojis, pictographs, symbols, and variation selectors from a string
 * while preserving Bengali script (U+0980-U+09FF), English, numbers, rupee ₹, and standard punctuation.
 */
export function removeEmojis(text: string): string {
  if (!text) return "";
  return text
    // Strip Extended_Pictographic, Emoji_Presentation, and symbol presentation blocks
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D\u20E3\u2600-\u26FF\u2700-\u27BF]/gu, '')
    // Normalize spaces and trim
    .replace(/\s+/g, ' ')
    .trim();
}

// All verified promotional offers matching the 7 original cards and brand highlights — 100% emoji-free
const CORE_PROMOTIONAL_OFFERS: string[] = [
  "আরণ্যক জুয়েলার্স বিশেষ পুজো অফার ২০২৬",
  "সোনার গয়না: ১০০০/- টাকা ছাড় প্রতিগ্রাম সোনার গয়না কেনাকাটায় (₹1000 OFF/GM)",
  "পুরোনো গয়না পরিবর্তন: ১০০% মূল্য হলমার্কযুক্ত পুরোনো গয়নার পরিবর্তে (ZERO LOSS EXCHANGE)",
  "হীরের গয়না: ১০০% ছাড় হীরের গয়নার মজুরিতে (100% FREE MAKING)",
  "রুপোর গয়না: ২৫% ছাড় রূপোর গয়নার MRP-র ওপর (25% FLAT DISCOUNT)",
  "প্রতিদিন লাকি ড্র: প্রতিদিনের লাকি ড্র-তে হোম অ্যাপ্লায়েন্স (DAILY PRIZES)",
  "নিশ্চিত উপহার: নিশ্চিত উপহার প্রতি কেনাকাটায় (FREE GIFTS)",
  "মেগা লাকি ড্র: MEGA LUCKY DRAW ৩টি স্কুটি (3X SCOOTY BUMPER)",
  "ত্রিপুরা শোরুম: আগরতলা • ধর্মনগর • কৈলাশহর • খোয়াই"
];

export default function PromotionalAnnouncementBar({
  marqueeText,
  className = ""
}: PromotionalAnnouncementBarProps) {
  const [dynamicTicker, setDynamicTicker] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchTicker = async () => {
      try {
        const data = await api.getTickerMessages();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setDynamicTicker(data);
        }
      } catch {
        /* fallback to static */
      }
    };
    fetchTicker();
    return () => { isMounted = false; };
  }, []);

  // Parse dynamic settings text or use verified complete offer list, strictly sanitized
  const { messages, separator, durationSec } = useMemo(() => {
    if (dynamicTicker.length > 0) {
      const activeMsgs = dynamicTicker.filter(t => t.isActive);
      if (activeMsgs.length > 0) {
        const sep = activeMsgs[0]?.separator || '—';
        const speed = activeMsgs[0]?.speed || 40;
        const msgList = activeMsgs.map(t => {
          const text = t.textBn + (t.textEn ? ` (${t.textEn})` : '');
          return removeEmojis(text);
        }).filter(Boolean);
        return { messages: msgList, separator: sep, durationSec: speed };
      }
    }

    let rawList = CORE_PROMOTIONAL_OFFERS;
    if (marqueeText && typeof marqueeText === 'string' && marqueeText.includes('|')) {
      const split = marqueeText
        .split('|')
        .map(s => s.trim())
        .filter(Boolean);
      if (split.length >= 3) {
        rawList = split;
      }
    }
    // Deep sanitize every message to guarantee zero emojis appear now or in future updates
    const cleaned = rawList
      .map(msg => removeEmojis(msg))
      .filter(Boolean);
    return { messages: cleaned, separator: '—', durationSec: 40 };
  }, [marqueeText, dynamicTicker]);

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
          animation: continuousOffersScroll ${durationSec}s linear infinite !important;
          -webkit-animation: continuousOffersScroll ${durationSec}s linear infinite !important;
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
        className={`offers-marquee-container relative w-full h-[58px] sm:h-[64px] md:h-[68px] bg-gradient-to-r from-[#D4A745] via-[#D9AF4D] to-[#D4A745] border-t border-[#C49A45]/40 border-b border-[#B8872D]/60 shadow-[0_3px_12px_rgba(33,23,19,0.10)] flex items-center overflow-hidden select-none z-10 ${className}`}
      >
        {/* Left & Right luxury gradient masks */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-10 sm:w-20 md:w-28 bg-gradient-to-r from-[#D4A745] to-transparent pointer-events-none z-10" 
          aria-hidden="true" 
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-10 sm:w-20 md:w-28 bg-gradient-to-l from-[#D4A745] to-transparent pointer-events-none z-10" 
          aria-hidden="true" 
        />

        {/* Continuous Automatic Moving Offers Track (Right to Left loop) */}
        <div className="offers-marquee-track flex items-center">
          {/* Sequence Copy 1 */}
          <div className="flex items-center shrink-0">
            {messages.map((msg, idx) => (
              <div key={`offer-set1-${idx}`} className="flex items-center shrink-0">
                <span className="font-sans font-semibold text-[35px] leading-normal text-[#211713] tracking-wide whitespace-nowrap px-1 inline-flex items-center">
                  {msg}
                </span>
                <span 
                  className="mx-5 sm:mx-8 text-[#211713]/60 text-[35px] leading-normal select-none inline-flex items-center" 
                  aria-hidden="true"
                >
                  {separator}
                </span>
              </div>
            ))}
          </div>

          {/* Sequence Copy 2: Duplicate for seamless, uninterrupted loop */}
          <div className="flex items-center shrink-0" aria-hidden="true">
            {messages.map((msg, idx) => (
              <div key={`offer-set2-${idx}`} className="flex items-center shrink-0">
                <span className="font-sans font-semibold text-[35px] leading-normal text-[#211713] tracking-wide whitespace-nowrap px-1 inline-flex items-center">
                  {msg}
                </span>
                <span 
                  className="mx-5 sm:mx-8 text-[#211713]/60 text-[35px] leading-normal select-none inline-flex items-center" 
                  aria-hidden="true"
                >
                  {separator}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
