"use client";

import React from 'react';

// Static gold rates - update these from your admin panel / backend later
const GOLD_RATES = [
  { id: '22k', purity: 22, pricePer10g: 72500 },
  { id: '18k', purity: 18, pricePer10g: 59300 },
  { id: '24k', purity: 24, pricePer10g: 79000 },
];

const GoldRateBar = () => {
  return (
    <div className="bg-primary text-white py-3 overflow-hidden border-b border-secondary/30 relative luxury-shimmer">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      <div className="flex whitespace-nowrap animate-marquee items-center space-x-16">
        {/* Repeat the content twice for smooth infinite scroll */}
        {[1, 2].map((i) => (
          <div key={i} className="flex space-x-16 shrink-0">
            {GOLD_RATES.map((rate) => (
              <div key={`${rate.id}-${i}`} className="flex items-center space-x-4">
                <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-secondary drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                  {rate.purity}K GOLD
                </span>
                <span className="text-sm font-medium font-serif italic tracking-wider">
                  ₹{rate.pricePer10g.toLocaleString('en-IN')}/10g
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_12px_rgba(212,175,55,0.9)] animate-pulse" />
              </div>
            ))}
            <div className="flex items-center space-x-4 italic text-[10px] text-ivory/40 uppercase tracking-[0.2em] font-light">
              Live Market Rates &bull; Updated Daily &bull; BIS Hallmarked
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoldRateBar;
