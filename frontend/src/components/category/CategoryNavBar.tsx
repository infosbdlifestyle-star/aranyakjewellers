"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export interface CategoryNavItem {
  id: string;
  name: string;
  count?: number;
  slug?: string;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface CategoryNavBarProps {
  items: CategoryNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  sortOptions?: SortOption[];
  sortBy?: string;
  onSortChange?: (value: string) => void;
  layoutId?: string;
  className?: string;
}

export function CategoryNavBar({
  items,
  activeId,
  onSelect,
  sortOptions,
  sortBy,
  onSortChange,
  layoutId = 'activeCategoryNavPill',
  className = '',
}: CategoryNavBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activePillRef = useRef<HTMLButtonElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to toggle left/right scroll arrows & edge gradients
  const updateScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);

    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons, items]);

  // Center active pill into view when activeId changes or on initial render
  useEffect(() => {
    if (activePillRef.current && scrollContainerRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeId]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.min(el.clientWidth * 0.75, 320);
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section 
      className={`sticky top-16 z-30 w-full bg-[#FAF7F0]/98 backdrop-blur-md border-b border-[#DED2C1] shadow-[0_2px_10px_rgba(33,24,19,0.04)] transition-all duration-200 ${className}`}
      aria-label="Category Navigation"
    >
      <div className="container mx-auto max-w-7xl px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Scrollable Category Buttons Wrapper with Left/Right Navigation */}
        <div className="relative flex-1 min-w-0 flex items-center">
          
          {/* Left Scroll Button (Desktop/Tablet) */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="hidden md:flex absolute left-0 z-20 items-center justify-center w-8 h-8 rounded-full bg-[#FAF7F0] border border-[#DED2C1] text-[#211813] hover:text-[#8A5A12] hover:border-[#8A5A12] shadow-md transition-all active:scale-95"
              aria-label="Scroll categories left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
          )}

          {/* Left subtle fade gradient */}
          {canScrollLeft && (
            <div 
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#FAF7F0] to-transparent z-10" 
              aria-hidden="true" 
            />
          )}

          {/* Category Pills List */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto no-scrollbar flex items-center space-x-2 sm:space-x-2.5 py-1 px-1 scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  ref={isActive ? activePillRef : null}
                  onClick={() => onSelect(item.id)}
                  type="button"
                  className={`relative px-3.5 sm:px-4 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-full transition-colors duration-200 shrink-0 whitespace-nowrap select-none ${
                    isActive
                      ? 'text-[#FFF8EC]'
                      : 'text-[#211813] hover:text-[#8A5A12] bg-[#FFFDF8] border border-[#DED2C1] hover:border-[#8A5A12] shadow-xs'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId={layoutId}
                      className="absolute inset-0 bg-[#211813] rounded-full -z-10 shadow-sm border border-[#98712E]/50"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.name}
                    {typeof item.count === 'number' && (
                      <span className={`text-[10px] ${isActive ? 'text-[#D6B15D]' : 'text-[#76551C]/70'}`}>
                        ({item.count})
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right subtle fade gradient */}
          {canScrollRight && (
            <div 
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FAF7F0] to-transparent z-10" 
              aria-hidden="true" 
            />
          )}

          {/* Right Scroll Button (Desktop/Tablet) */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="hidden md:flex absolute right-0 z-20 items-center justify-center w-8 h-8 rounded-full bg-[#FAF7F0] border border-[#DED2C1] text-[#211813] hover:text-[#8A5A12] hover:border-[#8A5A12] shadow-md transition-all active:scale-95"
              aria-label="Scroll categories right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          )}

        </div>

        {/* Sort Dropdown (when sortOptions provided) */}
        {sortOptions && sortOptions.length > 0 && onSortChange && (
          <div className="shrink-0 flex items-center pl-2 sm:pl-3 border-l border-[#DED2C1]/80">
            <span className="hidden sm:inline-block text-[10px] font-bold tracking-widest uppercase text-[#76551C] mr-2">
              Sort:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="text-[11px] sm:text-xs font-semibold bg-[#FFFDF8] border border-[#DED2C1] rounded-lg px-2.5 sm:px-3 py-1.5 text-[#211813] focus:outline-none focus:border-[#8A5A12] cursor-pointer shadow-xs hover:border-[#8A5A12] transition-colors"
                aria-label="Sort products"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
