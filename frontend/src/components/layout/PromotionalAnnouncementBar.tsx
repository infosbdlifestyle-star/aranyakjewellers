"use client";

import React, { useMemo } from 'react';

interface PromotionalAnnouncementBarProps {
  marqueeText?: string;
  className?: string;
}

// Verified promotional messages derived from existing offer cards and official site settings
const DEFAULT_PROMOTIONAL_MESSAGES: string[] = [
  "🌸 আরণ্যক বিশেষ পুজো অফার ২০২৬",
  "🪙 সোনার গয়নায় প্রতি গ্রামে ₹১০০০/- টাকা ছাড়",
  "💎 হীরের গয়নার মজুরিতে ১০০% সম্পূর্ণ ছাড়",
  "♻️ পুরোনো হলমার্কযুক্ত সোনার গয়নায় ১০০% এক্সচেঞ্জ মূল্য",
  "🥈 রূপোর গয়নার MRP-র ওপর ২৫% পর্যন্ত ফ্ল্যাট ডিসকাউন্ট",
  "🎁 প্রতিটি কেনাকাটায় সুনিশ্চিত উপহার",
  "📺 প্রতিদিনের লাকি ড্র-তে হোম অ্যাপ্লায়েন্সেস",
  "🛵 মেগা লাকি ড্র-তে ৩টি স্কুটি",
  "📍 আগরতলা • ধর্মনগর • কৈলাশহর • খোয়াই শোরুম"
];

export default function PromotionalAnnouncementBar({
  marqueeText,
  className = ""
}: PromotionalAnnouncementBarProps) {
  // Parse dynamic settings text or use verified defaults
  const messages = useMemo(() => {
    if (!marqueeText || typeof marqueeText !== 'string' || !marqueeText.trim()) {
      return DEFAULT_PROMOTIONAL_MESSAGES;
    }
    const split = marqueeText
      .split('|')
      .map(s => s.trim())
      .filter(Boolean);
    // If the text is only 1 short string without offer details, prefer the rich multi-offer sequence
    if (split.length <= 1 && split[0].length < 35) {
      return DEFAULT_PROMOTIONAL_MESSAGES;
    }
    return split.length > 0 ? split : DEFAULT_PROMOTIONAL_MESSAGES;
  }, [marqueeText]);

  // If only a single message exists, display it centered without marquee
  if (messages.length === 1) {
    return (
      <div 
        role="region"
        aria-label="Promotional Announcement"
        className={`w-full h-11 sm:h-12 bg-gradient-to-r from-[#D4A745] via-[#D9AF4D] to-[#D4A745] border-t border-[#C49A45]/35 border-b border-[#B8872D]/60 shadow-[0_3px_12px_rgba(33,23,19,0.08)] flex items-center justify-center px-4 text-center overflow-hidden z-40 select-none ${className}`}
      >
        <span className="text-[#211713]/70 mr-3 text-xs select-none" aria-hidden="true">✦</span>
        <span className="font-sans font-semibold text-xs sm:text-[13px] md:text-sm text-[#211713] tracking-wide truncate">
          {messages[0]}
        </span>
        <span className="text-[#211713]/70 ml-3 text-xs select-none" aria-hidden="true">✦</span>
      </div>
    );
  }

  return (
    <aside 
      role="region"
      aria-label="Promotional Announcements"
      className={`relative w-full h-11 sm:h-12 md:h-[50px] bg-gradient-to-r from-[#D4A745] via-[#D9AF4D] to-[#D4A745] border-t border-[#C49A45]/35 border-b border-[#B8872D]/60 shadow-[0_3px_12px_rgba(33,23,19,0.08)] flex items-center overflow-hidden group select-none z-40 ${className}`}
    >
      {/* Subtle edge gradient masks for seamless entering/exiting */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#D4A745] to-transparent pointer-events-none z-10" 
        aria-hidden="true" 
      />
      <div 
        className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#D4A745] to-transparent pointer-events-none z-10" 
        aria-hidden="true" 
      />

      {/* Marquee Track: Seamlessly looped with duplicated copy */}
      <div className="animate-announcement-marquee flex items-center">
        {/* Set 1: Primary Sequence */}
        <div className="flex items-center shrink-0">
          {messages.map((msg, idx) => (
            <div key={`msg-1-${idx}`} className="flex items-center shrink-0">
              <span className="font-sans font-semibold text-xs sm:text-[13px] md:text-sm text-[#211713] tracking-wide whitespace-nowrap px-1">
                {msg}
              </span>
              <span 
                className="mx-4 sm:mx-6 text-[#211713]/65 text-xs sm:text-sm font-serif select-none" 
                aria-hidden="true"
              >
                ✦
              </span>
            </div>
          ))}
        </div>

        {/* Set 2: Duplicate Sequence for infinite, jump-free loop */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {messages.map((msg, idx) => (
            <div key={`msg-2-${idx}`} className="flex items-center shrink-0">
              <span className="font-sans font-semibold text-xs sm:text-[13px] md:text-sm text-[#211713] tracking-wide whitespace-nowrap px-1">
                {msg}
              </span>
              <span 
                className="mx-4 sm:mx-6 text-[#211713]/65 text-xs sm:text-sm font-serif select-none" 
                aria-hidden="true"
              >
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
