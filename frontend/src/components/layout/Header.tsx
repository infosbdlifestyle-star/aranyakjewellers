"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';

const NAV_LINKS = [
  { name: 'About', href: '/about' },
  { name: 'Stores', href: '/stores' },
  { name: 'Contact', href: '/contact' },
];

// Categories to hide from the navigation menu
const HIDDEN_CATEGORIES = ['costume-jewellery', 'offers-deals'];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change (resize)
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-500 ${
      isScrolled ? 'glass border-white/20 shadow-lg' : 'bg-white/95 backdrop-blur-sm border-border/30'
    }`}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-primary p-2 hover:bg-ivory rounded-full transition-all"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          )}
        </button>

        {/* Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0">
          <img 
            src="/logo.png" 
            alt="Aranyak Jewellers" 
            className="h-12 lg:h-14 w-auto mix-blend-multiply"
          />
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex flex-1 justify-center items-center space-x-6 xl:space-x-8">
          {/* Category Dropdowns — show ALL categories */}
          {CATEGORIES.filter(cat => !HIDDEN_CATEGORIES.includes(cat.slug)).map((cat) => (
            <div 
              key={cat.id}
              className="relative group py-4"
            >
              <Link 
                href={`/category/${cat.slug}`}
                className="text-[10px] xl:text-xs font-bold text-foreground hover:text-primary transition-colors uppercase tracking-[0.15em]"
              >
                {cat.name}
              </Link>

              {/* Dropdown for subcategories */}
              {cat.subcategories && cat.subcategories.length > 0 && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 glass p-6 shadow-2xl border border-white/20 transition-all duration-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-4 group-hover:translate-y-0 z-[100]">
                  <div className="grid grid-cols-1 gap-4">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/category/${cat.slug}/${sub.slug}`}
                        className="text-[10px] font-bold text-muted-foreground hover:text-primary hover:translate-x-2 transition-all py-1 uppercase tracking-widest border-b border-ivory/50 pb-2"
                      >
                        {sub.name}
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
              className="text-[10px] xl:text-xs font-bold text-foreground hover:text-primary transition-colors uppercase tracking-[0.15em]"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Phone CTA - Right */}
        <div className="hidden lg:flex items-center space-x-4 min-w-[120px] justify-end">
          <a 
            href="tel:+91XXXXXXXXXX" 
            className="flex items-center space-x-2 text-primary hover:text-secondary transition-all group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase">Call Us</span>
          </a>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-white z-[90] animate-in fade-in slide-in-from-top duration-300">
          <div className="flex flex-col h-[calc(100vh-5rem)] bg-ivory/30 p-8 pb-32 space-y-6 overflow-y-auto">
            {CATEGORIES.filter(cat => !HIDDEN_CATEGORIES.includes(cat.slug)).map((cat) => (
              <div key={cat.id} className="space-y-3">
                <Link 
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-serif font-bold text-primary flex items-center justify-between group"
                >
                  <span>{cat.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary"><path d="m9 18 6-6-6-6"/></svg>
                </Link>
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 pl-4 border-l border-secondary/20">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/category/${cat.slug}/${sub.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="pt-6 border-t border-border space-y-4">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center space-x-4 text-primary"
                >
                  <span className="text-xs font-bold uppercase tracking-widest">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
