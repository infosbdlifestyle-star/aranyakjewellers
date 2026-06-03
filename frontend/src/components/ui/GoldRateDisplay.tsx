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
        <div key={rate.id} className="bg-white border border-border p-6 flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
          <div>
            <h3 className="text-lg font-serif font-bold">{rate.purity}KT Gold</h3>
            <span className="text-xs text-muted-foreground">per 10 grams</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-serif font-bold text-primary">
              ₹{rate.pricePer10g.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-muted-foreground">
              Last updated: {new Date(rate.updatedAt).toLocaleDateString('en-IN')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoldRateDisplay;
