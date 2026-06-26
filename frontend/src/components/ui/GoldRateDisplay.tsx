"use client";

import React from 'react';

// Static gold rates - these will be connected to the backend API later
const GOLD_RATES = [
  { id: '24k', purity: 24, pricePer10g: 79000, updatedAt: '2026-06-03' },
  { id: '22k', purity: 22, pricePer10g: 72500, updatedAt: '2026-06-03' },
  { id: '18k', purity: 18, pricePer10g: 59300, updatedAt: '2026-06-03' },
];

const GoldRateDisplay = () => {
  return (
    <div className="space-y-4">
      {GOLD_RATES.map(rate => (
        <div key={rate.id} className="bg-[#0A0505] border border-white/10 p-8 flex items-center justify-between hover:border-secondary/40 transition-colors duration-500 group">
          <div>
            <h3 className="text-xl font-serif font-light text-white group-hover:text-secondary transition-colors duration-300">{rate.purity}KT Gold</h3>
            <span className="text-[10px] tracking-widest uppercase font-bold text-white/50">per 10 grams</span>
          </div>
          <div className="text-right">
            <p className="text-3xl font-serif font-light text-secondary mb-1">
              ₹{rate.pricePer10g.toLocaleString('en-IN')}
            </p>
            <span className="text-[9px] tracking-widest uppercase font-bold text-white/40">
              Updated: {new Date(rate.updatedAt).toLocaleDateString('en-IN')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoldRateDisplay;
