"use client";

import React from 'react';

interface VaultImagePlaceholderProps {
  name: string;
  category?: string;
  subCategory?: string;
  goldPurity?: number;
  diamondCarat?: number;
  diamondClarity?: string;
  className?: string;
}

export function VaultImagePlaceholder({
  name,
  category = 'Gold',
  subCategory,
  goldPurity,
  diamondCarat,
  diamondClarity,
  className = ''
}: VaultImagePlaceholderProps) {
  const isSilver = category.toLowerCase().includes('silver') || goldPurity === 925;
  const isDiamond = category.toLowerCase().includes('diamond') || Boolean(diamondCarat);

  let hallmarkText = '22KT BIS 916 HALLMARKED';
  if (isSilver) {
    hallmarkText = '92.5 STERLING SILVER';
  } else if (isDiamond) {
    hallmarkText = diamondCarat ? `${diamondCarat} ct ${diamondClarity || 'Diamond'} • Certified` : 'Certified Genuine Diamond';
  } else if (goldPurity) {
    hallmarkText = `${goldPurity}KT Hallmarked`;
  }

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-b from-[#1C140E] via-[#140D08] to-[#0A0503] flex flex-col items-center justify-center p-6 text-center select-none border border-[#C49A45]/20 ${className}`}
    >
      {/* Corner Ornaments */}
      <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t border-l border-[#C49A45]/40" />
      <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-[#C49A45]/40" />
      <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-[#C49A45]/40" />
      <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r border-[#C49A45]/40" />

      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C49A45]/10 via-transparent to-transparent pointer-events-none" />

      {/* Royal Insignia Crest */}
      <div className="relative mb-3">
        <div className="w-14 h-14 rounded-full border border-[#C49A45]/40 bg-[#211813]/80 backdrop-blur-sm flex items-center justify-center shadow-[0_0_20px_rgba(196,154,69,0.15)] group-hover:scale-105 transition-transform duration-500">
          <span className="text-[#D6B15D] text-xl font-serif">✧</span>
        </div>
        <div className="absolute -inset-1 rounded-full border border-[#C49A45]/20 animate-pulse pointer-events-none" />
      </div>

      {/* Category / Vault Label */}
      <span className="text-[9px] tracking-[0.3em] font-serif uppercase text-[#C49A45] font-semibold mb-1">
        ARANYAK VAULT RECORD
      </span>

      {/* Product Title */}
      <h4 className="text-sm font-serif font-medium text-[#FAF3E0] tracking-wide mb-1.5 line-clamp-1 max-w-[220px]">
        {name}
      </h4>

      {/* Description note */}
      <p className="text-[11px] text-[#A6917D] not-italic tracking-wide max-w-[210px] leading-relaxed mb-3">
        Authentic photograph preserved in boutique vault
      </p>

      {/* Hallmark & Purity Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241A12] border border-[#C49A45]/40 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158]" />
        <span className="text-[9px] uppercase tracking-widest text-[#E5C158] font-bold">
          {hallmarkText}
        </span>
      </div>

      {/* Action Prompt */}
      <span className="text-[9px] text-[#806B59] tracking-widest uppercase font-medium mt-3">
        Inquire for Boutique Viewing
      </span>
    </div>
  );
}
