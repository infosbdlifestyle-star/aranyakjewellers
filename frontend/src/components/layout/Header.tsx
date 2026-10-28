"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '@/constants/categories';
import { useAuth } from '@/context/AuthContext';
import PromotionalAnnouncementBar from '@/components/layout/PromotionalAnnouncementBar';

const NAV_LINKS = [
  { name: 'Gallery', href: '/gallery' },
  { name: 'About', href: '/about' },
  { name: 'Stores', href: '/stores' },
  { name: 'Contact', href: '/contact' },
];

const GALLERY_SUBLINKS = [
  { name: 'All Masterpieces', href: '/gallery' },
  { name: '22K Fine Gold', href: '/gallery' },
  { name: 'Pure 925 Silver', href: '/gallery' },
  { name: 'Certified Diamonds', href: '/gallery' },
  { name: 'Bridal Trousseau', href: '/gallery' },
];

// Categories to hide from the navigation menu
const HIDDEN_CATEGORIES = ['costume-jewellery', 'offers-deals', 'astrological-stones'];

const Header = ({ 
  categories = [], 
  settings = {} 
}: { 
  categories?: any[]; 
  settings?: Record<string, string>;
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Use backend categories if available, otherwise fall back to static CATEGORIES
  const rootCategories = categories.length > 0
    ? categories
        .filter((c: any) => !c.parentId)
        .map((cat: any) => ({
          ...cat,
          subcategories: categories.filter((c: any) => c.parentId === cat.id),
        }))
    : CATEGORIES;

  const visibleCategories = rootCategories.filter(
    (cat: any) => !HIDDEN_CATEGORIES.includes(cat.slug)
  );

  const toggleCategory = (id: string) => {
    setExpandedCategory(prev => prev === id ? null : id);
  };

  return (
    <div className="sticky top-0 z-50 w-full shadow-md bg-white">
      <header className={`relative z-[100] w-full border-b transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#FFFFFF] border-[#D6B15D]/30 shadow-md' 
          : 'bg-[#FFFFFF] border-[#D6B15D]/20'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo on the Left - Mobile & Desktop */}
          <Link 
            href="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center group shrink-0 focus:outline-none"
            aria-label="Aranyak Jewellers Homepage"
          >
            <Image 
              src="/logo-transparent.png" 
              alt="Aranyak Jewellers - Fine Gold & Diamond Jewellery" 
              width={180}
              height={56}
              priority
              className="h-10 sm:h-12 lg:h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Navigation - Desktop (Visible Black Text, Golden Hover Accent & Smooth Underline) */}
          <nav className="hidden lg:flex flex-1 justify-center items-center space-x-3 xl:space-x-6 h-full">
            {visibleCategories.map((cat: any) => (
              <div 
                key={cat.id}
                className="relative group h-full flex items-center px-2 xl:px-3"
              >
                <Link 
                  href={`/category/${cat.slug}`}
                  className="text-xs xl:text-sm font-bold text-[#1A1A1A] group-hover:text-[#9A6B20] focus:outline-none focus:text-[#9A6B20] transition-colors uppercase tracking-[0.16em] py-2 relative flex items-center gap-1.5"
                >
                  <span className="relative pb-1">
                    {cat.name}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#9A6B20] via-[#C9A044] to-[#9A6B20] group-hover:w-full transition-all duration-300 rounded-full pointer-events-none" />
                  </span>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="10" 
                      height="10" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-[#1A1A1A] group-hover:text-[#9A6B20] group-hover:rotate-180 transition-transform duration-300"
                    >
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  )}
                </Link>

                {/* Luxury Animated Dropdown for subcategories */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div 
                    className={`absolute top-full left-1/2 -translate-x-1/2 ${
                      cat.subcategories.length > 6 
                        ? 'w-[360px] sm:w-[400px]' 
                        : 'w-64'
                    } bg-[#0A0505] p-4 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-[#D6B15D]/40 transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 z-[120] rounded-b-xl max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pointer-events-none group-hover:pointer-events-auto`}
                  >
                    {/* Invisible Hit Buffer Bridge (prevents mouseout disconnect) */}
                    <div className="absolute -top-3 left-0 right-0 h-3 bg-transparent pointer-events-auto" />
                    
                    {/* Top Golden Accent Highlight Line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D6B15D] to-transparent" />

                    {/* Dropdown Header Info */}
                    <div className="pb-2.5 mb-2.5 border-b border-[#D6B15D]/20 flex items-center justify-between">
                      <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#D6B15D]">
                        {cat.name} Jewellery
                      </span>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="text-[9px] font-semibold text-[#FFF8EC]/60 hover:text-[#D6B15D] tracking-wider uppercase transition-colors"
                      >
                        View All →
                      </Link>
                    </div>

                    {/* Subcategory Grid */}
                    <div className={`grid ${cat.subcategories.length > 6 ? 'grid-cols-2 gap-x-3 gap-y-1' : 'grid-cols-1 gap-1'}`}>
                      {cat.subcategories.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={`/category/${cat.slug}/${sub.slug}`}
                          className="group/item flex items-center justify-between text-[11px] font-semibold text-[#FFF8EC] hover:text-[#D6B15D] hover:bg-[#D6B15D]/10 rounded-md transition-all duration-200 px-2.5 py-1.5 uppercase tracking-wider"
                        >
                          <span className="group-hover/item:translate-x-1 transition-transform duration-200 line-clamp-1">
                            {sub.name}
                          </span>
                          <span className="opacity-0 group-hover/item:opacity-100 text-[#D6B15D] text-[9px] transition-opacity duration-200">
                            ✧
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Gallery with Luxury Dropdown */}
            <div className="relative group h-full flex items-center px-2 xl:px-3">
              <Link
                href="/gallery"
                className="text-xs xl:text-sm font-bold uppercase tracking-[0.16em] py-2 transition-colors text-[#1A1A1A] group-hover:text-[#9A6B20] focus:outline-none focus:text-[#9A6B20] flex items-center gap-1.5"
              >
                <span className="relative pb-1">
                  Gallery
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#9A6B20] via-[#C9A044] to-[#9A6B20] group-hover:w-full transition-all duration-300 rounded-full pointer-events-none" />
                </span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="10" 
                  height="10" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-[#1A1A1A] group-hover:text-[#9A6B20] group-hover:rotate-180 transition-transform duration-300"
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </Link>

              <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-[#0A0505] p-4 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-[#D6B15D]/40 transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 z-[120] rounded-b-xl pointer-events-none group-hover:pointer-events-auto">
                <div className="absolute -top-3 left-0 right-0 h-3 bg-transparent pointer-events-auto" />
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D6B15D] to-transparent" />
                <div className="pb-2.5 mb-2.5 border-b border-[#D6B15D]/20 flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#D6B15D]">
                    Master Gallery
                  </span>
                  <Link
                    href="/gallery"
                    className="text-[9px] font-semibold text-[#FFF8EC]/60 hover:text-[#D6B15D] tracking-wider uppercase transition-colors"
                  >
                    Portfolio →
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {GALLERY_SUBLINKS.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="group/item flex items-center justify-between text-[11px] font-semibold text-[#FFF8EC] hover:text-[#D6B15D] hover:bg-[#D6B15D]/10 rounded-md transition-all duration-200 px-2.5 py-1.5 uppercase tracking-wider"
                    >
                      <span className="group-hover/item:translate-x-1 transition-transform duration-200">
                        {item.name}
                      </span>
                      <span className="opacity-0 group-hover/item:opacity-100 text-[#D6B15D] text-[9px] transition-opacity duration-200">
                        ✧
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Remaining Static nav links (About, Stores, Contact) */}
            {NAV_LINKS.filter(l => l.name !== 'Gallery').map((link) => (
              <div key={link.name} className="relative group h-full flex items-center px-2 xl:px-3">
                <Link
                  href={link.href}
                  className="text-xs xl:text-sm font-bold uppercase tracking-[0.16em] py-2 transition-colors text-[#1A1A1A] group-hover:text-[#9A6B20] focus:outline-none focus:text-[#9A6B20]"
                >
                  <span className="relative pb-1">
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#9A6B20] via-[#C9A044] to-[#9A6B20] group-hover:w-full transition-all duration-300 rounded-full pointer-events-none" />
                  </span>
                </Link>
              </div>
            ))}
          </nav>

          {/* Desktop Right CTA (Sign In / Account & Phone) */}
          <div className="hidden lg:flex items-center space-x-3 justify-end">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/account"
                  className="inline-flex items-center space-x-2 px-3.5 py-2 bg-[#9A6B20]/10 hover:bg-[#9A6B20]/20 border border-[#9A6B20]/40 text-[#1A1A1A] hover:text-[#9A6B20] rounded-md transition-all text-xs font-bold tracking-[0.15em] uppercase shadow-sm group"
                >
                  <span className="w-5 h-5 rounded-full bg-[#D6B15D] text-[#211813] text-[10px] flex items-center justify-center font-serif font-bold group-hover:scale-105 transition-transform">
                    {(user?.name || 'P').charAt(0).toUpperCase()}
                  </span>
                  <span>My Account</span>
                </Link>

                {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center space-x-1.5 px-3 py-2 bg-[#C9A044]/20 hover:bg-[#C9A044]/30 border border-[#C9A044]/40 text-[#9A6B20] hover:text-[#1A1A1A] rounded-md transition-all text-xs font-bold tracking-widest uppercase"
                    title="Admin Dashboard"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span>Admin</span>
                  </Link>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="inline-flex items-center space-x-2 px-4 py-2 bg-[#C9A044] hover:bg-[#9A6B20] text-[#1A1A1A] hover:text-[#FFFFFF] font-bold rounded-md transition-all text-xs tracking-[0.15em] uppercase shadow-[0_2px_10px_rgba(201,160,68,0.35)] border border-[#C9A044] hover:border-[#9A6B20] active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Sign In</span>
              </Link>
            )}
            
            <a 
              href="tel:+919436501506" 
              className="flex items-center space-x-2 text-[#1A1A1A] hover:text-[#9A6B20] focus:outline-none focus:text-[#9A6B20] transition-colors group font-bold px-2 py-1.5"
              title="Call Aranyak Jewellers: +91 9436501506"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-[#1A1A1A] group-hover:text-[#9A6B20] group-hover:scale-110 transition-all duration-300 shrink-0"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span className="text-xs font-bold tracking-[0.16em] uppercase whitespace-nowrap">Call Us</span>
            </a>
          </div>

          {/* Mobile Right Actions: Quick Call + Hamburger Menu Button */}
          <div className="flex lg:hidden items-center space-x-2 shrink-0">
            <a 
              href="tel:+919436501506" 
              aria-label="Call Aranyak Jewellers"
              className="flex items-center justify-center w-10 h-10 rounded-lg text-[#1A1A1A] hover:text-[#9A6B20] bg-transparent hover:bg-[#9A6B20]/10 border border-[#1A1A1A]/20 hover:border-[#9A6B20]/40 active:scale-95 transition-all"
              title="Call Us: +91 9436501506"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </a>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-11 h-11 text-[#1A1A1A] hover:text-[#9A6B20] bg-transparent hover:bg-[#9A6B20]/10 border border-[#1A1A1A]/25 hover:border-[#9A6B20]/50 rounded-lg transition-all focus:outline-none active:scale-95 shadow-sm"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Smooth Mobile Menu Overlay & Drawer (Placed outside <header> to prevent backdrop-blur containing block clipping) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dimmed Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/75 backdrop-blur-sm z-[90]"
              aria-hidden="true"
            />

            {/* Mobile Drawer */}
            <motion.div 
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed inset-x-0 bottom-0 top-20 bg-[#1A120D] border-t border-[#D6B15D]/25 z-[95] overflow-y-auto overscroll-contain flex flex-col justify-between shadow-2xl"
            >
                <div className="p-5 sm:p-6 pb-28 max-w-lg mx-auto w-full space-y-6">
                  {/* Top Action Bar: SIGN IN & CALL US */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {isAuthenticated ? (
                      <>
                        <Link
                          href="/account"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-2 py-3 px-3 bg-[#D6B15D]/15 hover:bg-[#D6B15D]/25 border border-[#D6B15D]/40 text-[#FFF8EC] hover:text-[#D6B15D] text-xs font-bold uppercase tracking-[0.15em] rounded-lg shadow-sm transition-all active:scale-95"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#D6B15D] text-[#211813] text-[10px] flex items-center justify-center font-serif font-bold">
                            {(user?.name || 'P').charAt(0).toUpperCase()}
                          </span>
                          <span>My Account</span>
                        </Link>

                        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') ? (
                          <Link
                            href="/admin"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-center gap-1.5 py-3 px-3 bg-[#C9A044]/20 hover:bg-[#C9A044]/30 border border-[#C9A044]/40 text-[#D6B15D] text-xs font-bold uppercase tracking-[0.15em] rounded-lg transition-all active:scale-95"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            <span>Admin</span>
                          </Link>
                        ) : (
                          <a
                            href="tel:+919436501506"
                            className="flex items-center justify-center gap-2 py-3 px-3 bg-[#211813] hover:bg-[#9A6B20]/20 border border-[#D6B15D]/40 text-[#FFF8EC] hover:text-[#D6B15D] text-xs font-bold uppercase tracking-[0.15em] rounded-lg transition-all active:scale-95"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#D6B15D]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            <span>Call Us</span>
                          </a>
                        )}
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-2 py-3 px-3 bg-[#C9A044] hover:bg-[#9A6B20] text-[#1A1A1A] hover:text-[#FFFFFF] text-xs font-bold uppercase tracking-[0.15em] rounded-lg shadow-md border border-[#C9A044] transition-all active:scale-95"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          <span>Sign In</span>
                        </Link>
                        
                        <a
                          href="tel:+919436501506"
                          className="flex items-center justify-center gap-2 py-3 px-3 bg-[#211813] hover:bg-[#9A6B20]/20 border border-[#D6B15D]/40 text-[#FFF8EC] hover:text-[#D6B15D] text-xs font-bold uppercase tracking-[0.15em] rounded-lg transition-all active:scale-95"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#D6B15D]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          <span>Call Us</span>
                        </a>
                      </>
                    )}
                  </div>

                  {/* Navigation List: GOLD, DIAMOND, SILVER, GALLERY, ABOUT, STORES, CONTACT */}
                  <div className="space-y-1.5 pt-2 border-t border-[#D6B15D]/20">
                    {/* Primary Categories with Touch Accordions (GOLD, DIAMOND, SILVER) */}
                    {visibleCategories.map((cat: any) => {
                      const hasSubs = cat.subcategories && cat.subcategories.length > 0;
                      const isExpanded = expandedCategory === cat.id;

                      return (
                        <div key={cat.id} className="border-b border-[#D6B15D]/10 pb-1.5">
                          <div className="flex items-center justify-between">
                            <Link 
                              href={`/category/${cat.slug}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="py-3 text-sm sm:text-base font-serif font-bold tracking-[0.18em] uppercase text-[#FFF8EC] hover:text-[#D6B15D] transition-colors flex-1 flex items-center gap-2"
                            >
                              <span>{cat.name}</span>
                            </Link>

                            {hasSubs && (
                              <button 
                                type="button"
                                onClick={() => toggleCategory(cat.id)}
                                aria-label={`Toggle ${cat.name} subcategories`}
                                className="w-11 h-11 flex items-center justify-center text-[#D6B15D] hover:text-[#FFF8EC] rounded-full hover:bg-[#D6B15D]/10 active:scale-90 transition-all"
                              >
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width="16" 
                                  height="16" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="2.5" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                  className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#FFF8EC]' : ''}`}
                                >
                                  <path d="m6 9 6 6 6-6"/>
                                </svg>
                              </button>
                            )}
                          </div>

                          {/* Collapsible Subcategory Grid */}
                          <AnimatePresence>
                            {hasSubs && isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden pl-3 pr-1 pb-3 pt-1"
                              >
                                <div className="border-l-2 border-[#D6B15D]/30 pl-3 space-y-2">
                                  <Link
                                    href={`/category/${cat.slug}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-1 text-[11px] font-bold text-[#D6B15D] uppercase tracking-wider hover:underline"
                                  >
                                    View All {cat.name} Jewellery →
                                  </Link>

                                  <div className="grid grid-cols-2 gap-2 pt-1">
                                    {cat.subcategories.map((sub: any) => (
                                      <Link
                                        key={sub.id}
                                        href={`/category/${cat.slug}/${sub.slug}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="py-2 px-2.5 bg-[#211813]/60 hover:bg-[#D6B15D]/15 border border-[#D6B15D]/20 rounded text-[11px] font-medium text-[#E5D9C8] hover:text-[#D6B15D] uppercase tracking-wider transition-colors line-clamp-1"
                                      >
                                        {sub.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}

                    {/* GALLERY Link with Expandable Masterpieces */}
                    <div className="border-b border-[#D6B15D]/10 pb-1.5">
                      <div className="flex items-center justify-between">
                        <Link
                          href="/gallery"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-3 text-sm sm:text-base font-serif font-bold tracking-[0.18em] uppercase text-[#FFF8EC] hover:text-[#D6B15D] transition-colors flex-1"
                        >
                          Gallery
                        </Link>

                        <button 
                          type="button"
                          onClick={() => toggleCategory('gallery')}
                          aria-label="Toggle Gallery masterpieces"
                          className="w-11 h-11 flex items-center justify-center text-[#D6B15D] hover:text-[#FFF8EC] rounded-full hover:bg-[#D6B15D]/10 active:scale-90 transition-all"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className={`transition-transform duration-300 ${expandedCategory === 'gallery' ? 'rotate-180 text-[#FFF8EC]' : ''}`}
                          >
                            <path d="m6 9 6 6 6-6"/>
                          </svg>
                        </button>
                      </div>

                      <AnimatePresence>
                        {expandedCategory === 'gallery' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden pl-3 pr-1 pb-3 pt-1"
                          >
                            <div className="border-l-2 border-[#D6B15D]/30 pl-3 space-y-2">
                              <Link
                                href="/gallery"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block py-1 text-[11px] font-bold text-[#D6B15D] uppercase tracking-wider hover:underline"
                              >
                                View Full Portfolio →
                              </Link>

                              <div className="grid grid-cols-2 gap-2 pt-1">
                                {GALLERY_SUBLINKS.map((item, idx) => (
                                  <Link
                                    key={idx}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="py-2 px-2.5 bg-[#211813]/60 hover:bg-[#D6B15D]/15 border border-[#D6B15D]/20 rounded text-[11px] font-medium text-[#E5D9C8] hover:text-[#D6B15D] uppercase tracking-wider transition-colors"
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* ABOUT */}
                    <div className="border-b border-[#D6B15D]/10">
                      <Link 
                        href="/about" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between py-3.5 text-sm sm:text-base font-serif font-bold tracking-[0.18em] uppercase text-[#FFF8EC] hover:text-[#D6B15D] transition-colors"
                      >
                        <span>About</span>
                        <span className="text-[#D6B15D]/60 text-xs">→</span>
                      </Link>
                    </div>

                    {/* STORES */}
                    <div className="border-b border-[#D6B15D]/10">
                      <Link 
                        href="/stores" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between py-3.5 text-sm sm:text-base font-serif font-bold tracking-[0.18em] uppercase text-[#FFF8EC] hover:text-[#D6B15D] transition-colors"
                      >
                        <span>Stores</span>
                        <span className="text-[#D6B15D]/60 text-xs">→</span>
                      </Link>
                    </div>

                    {/* CONTACT */}
                    <div className="border-b border-[#D6B15D]/10">
                      <Link 
                        href="/contact" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between py-3.5 text-sm sm:text-base font-serif font-bold tracking-[0.18em] uppercase text-[#FFF8EC] hover:text-[#D6B15D] transition-colors"
                      >
                        <span>Contact</span>
                        <span className="text-[#D6B15D]/60 text-xs">→</span>
                      </Link>
                    </div>
                  </div>

                  {/* Brand Assistance & Assurance Footer Card */}
                  <div className="pt-4 border-t border-[#D6B15D]/20">
                    <div className="p-4 bg-[#211813]/80 border border-[#D6B15D]/25 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D6B15D]">
                          Aranyak Boutiques
                        </span>
                        <span className="text-[9px] font-semibold text-[#D6B15D] uppercase tracking-widest border border-[#D6B15D]/40 px-2 py-0.5 rounded-full">
                          100% BIS Hallmarked
                        </span>
                      </div>
                      <p className="text-[11px] text-[#E5D7C5]/80 leading-relaxed font-light">
                        Agartala • Dharmanagar • Kailashahar • Khowai
                      </p>
                      <div className="pt-2 border-t border-[#D6B15D]/15 flex items-center justify-between text-[11px]">
                        <span className="text-[#E5D7C5]">Helpline:</span>
                        <a 
                          href="tel:+919436501506" 
                          className="font-bold text-[#D6B15D] hover:underline"
                        >
                          +91 9436501506
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      {/* Dedicated Promotional Announcement Bar positioned immediately below the navigation */}
      <PromotionalAnnouncementBar marqueeText={settings?.marquee_text} />
    </div>
  );
};

export default Header;
