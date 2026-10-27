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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

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

  return (
    <div className="sticky top-0 z-50 w-full shadow-lg">
      <header className={`w-full border-b transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#211813]/98 backdrop-blur-md border-[#D6B15D]/30 shadow-2xl' 
          : 'bg-[#211813]/95 backdrop-blur-md border-[#D6B15D]/20'
      }`}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-[#FFF8EC] hover:text-[#D6B15D] p-2 hover:bg-[#FFF8EC]/10 rounded-full transition-all focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          )}
        </button>

        {/* Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0 group">
          <Image 
            src="/logo-transparent.png" 
            alt="Aranyak Jewellers - Fine Gold & Diamond Jewellery" 
            width={180}
            height={56}
            priority
            className="h-12 lg:h-14 w-auto transition-transform duration-500 group-hover:scale-[1.02] brightness-110"
          />
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex flex-1 justify-center items-center space-x-5 xl:space-x-7">
          {visibleCategories.map((cat: any) => (
            <div 
              key={cat.id}
              className="relative group py-4"
            >
              <Link 
                href={`/category/${cat.slug}`}
                className="text-[10px] xl:text-xs font-bold text-[#FFF8EC] hover:text-[#D6B15D] transition-colors uppercase tracking-[0.2em] pb-1 relative"
              >
                {cat.name}
              </Link>

              {/* Luxury Animated Dropdown for subcategories */}
              {cat.subcategories && cat.subcategories.length > 0 && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-[#211813]/98 backdrop-blur-xl p-5 shadow-2xl border border-[#D6B15D]/35 transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-3 group-hover:translate-y-0 z-[100] rounded-b-xl overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#D6B15D] before:to-transparent">
                  <div className="grid grid-cols-1 gap-2">
                    {cat.subcategories.map((sub: any) => (
                      <Link
                        key={sub.id}
                        href={`/category/${cat.slug}/${sub.slug}`}
                        className="group/item flex items-center justify-between text-[11px] font-semibold text-[#FFF8EC] hover:text-[#D6B15D] transition-all duration-300 py-1.5 uppercase tracking-widest border-b border-[#D6B15D]/15 pb-2"
                      >
                        <span className="group-hover/item:translate-x-2 transition-transform duration-300">
                          {sub.name}
                        </span>
                        <span className="opacity-0 group-hover/item:opacity-100 text-[#D6B15D] text-[10px] transition-opacity duration-300">
                          ✧
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Static nav links */}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[10px] xl:text-xs font-bold uppercase tracking-[0.2em] pb-1 transition-colors text-[#FFF8EC] hover:text-[#D6B15D]"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Phone & Patron Account CTA - Right */}
        <div className="hidden lg:flex items-center space-x-3 justify-end">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link
                href="/account"
                className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#D6B15D]/15 hover:bg-[#D6B15D]/25 border border-[#D6B15D]/40 text-[#FFF8EC] hover:text-[#D6B15D] rounded transition-all text-[10px] font-bold tracking-[0.15em] uppercase shadow-sm group"
              >
                <span className="w-5 h-5 rounded-full bg-[#D6B15D] text-[#211813] text-[10px] flex items-center justify-center font-serif font-bold group-hover:scale-105 transition-transform">
                  {(user?.name || 'P').charAt(0).toUpperCase()}
                </span>
                <span>My Account</span>
              </Link>

              {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                <Link
                  href="/admin"
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-[#C9A04A]/20 hover:bg-[#C9A04A]/30 border border-[#C9A04A]/40 text-[#D6B15D] rounded transition-all text-[10px] font-bold tracking-widest uppercase"
                  title="Admin Dashboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span>Admin</span>
                </Link>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#C9A04A] hover:bg-[#D6B15D] text-[#211813] font-bold rounded transition-all text-[10px] tracking-[0.15em] uppercase shadow-md border border-[#C9A04A] hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Sign In</span>
            </Link>
          )}
          
          <a 
            href="tel:+919436501506" 
            className="flex items-center space-x-2 text-[#FFF8EC] hover:text-[#D6B15D] transition-all group font-bold px-2 py-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform text-[#D6B15D]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase">Call Us</span>
          </a>
        </div>
      </div>

      {/* Smooth Mobile Menu Drawer with Staggered Entrance */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden fixed inset-0 top-20 bg-[#211813] z-[90] overflow-y-auto"
          >
            <div className="flex flex-col min-h-[calc(100vh-5rem)] bg-[#211813] p-8 pb-32 space-y-6">
              {isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 bg-[#D6B15D]/15 border border-[#D6B15D]/40 text-[#FFF8EC] text-center text-xs font-bold uppercase tracking-[0.15em] rounded flex items-center justify-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    My Account
                  </Link>
                  {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') ? (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-3 bg-[#C9A04A]/20 border border-[#C9A04A]/40 text-[#D6B15D] text-center text-xs font-bold uppercase tracking-[0.15em] rounded flex items-center justify-center gap-1.5"
                    >
                      Admin Panel
                    </Link>
                  ) : (
                    <Link
                      href="/collections"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-3 bg-[#D6B15D]/15 border border-[#D6B15D]/30 text-[#FFF8EC] text-center text-xs font-bold uppercase tracking-[0.15em] rounded flex items-center justify-center gap-1.5"
                    >
                      Collections
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 bg-[#C9A04A] hover:bg-[#D6B15D] text-[#211813] text-center text-xs font-bold uppercase tracking-[0.15em] rounded flex items-center justify-center gap-1.5 shadow-sm border border-[#C9A04A]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-3 bg-[#211813] border border-[#D6B15D]/40 text-[#FFF8EC] text-center text-xs font-bold uppercase tracking-[0.15em] rounded flex items-center justify-center gap-1.5"
                  >
                    Register
                  </Link>
                </div>
              )}

              {visibleCategories.map((cat: any) => (
                <div key={cat.id} className="space-y-3">
                  <Link 
                    href={`/category/${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-serif font-bold text-[#FFF8EC] flex items-center justify-between group hover:text-[#D6B15D] transition-colors"
                  >
                    <span>{cat.name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#D6B15D]"><path d="m9 18 6-6-6-6"/></svg>
                  </Link>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-[#D6B15D]/30">
                      {cat.subcategories.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={`/category/${cat.slug}/${sub.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-xs font-semibold text-[#E5D9C8] hover:text-[#D6B15D] uppercase tracking-wider transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="pt-6 border-t border-[#D6B15D]/20 space-y-4">
                {NAV_LINKS.map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="flex items-center space-x-4 text-[#FFF8EC] hover:text-[#D6B15D] transition-colors"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    {/* Dedicated Promotional Announcement Bar positioned immediately below the navigation */}
    <PromotionalAnnouncementBar marqueeText={settings?.marquee_text} />
  </div>
  );
};

export default Header;
