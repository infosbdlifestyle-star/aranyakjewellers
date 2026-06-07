"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/constants/categories';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Collections', href: '/collections' },
  { name: 'About', href: '/about' },
  { name: 'Stores', href: '/stores' },
  { name: 'Gold Rate', href: '/gold-rate' },
  { name: 'Contact', href: '/contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
        isScrolled && !isMenuOpen ? 'bg-[#050202]/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start relative z-[60]">
            <span className={`text-2xl font-serif font-bold tracking-widest uppercase transition-colors duration-500 ${isMenuOpen || isScrolled ? 'text-white' : 'text-primary mix-blend-difference drop-shadow-[0_0_10px_rgba(255,255,255,1)]'}`}>
              Aranyak
            </span>
          </Link>

          {/* Menu Toggle Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="group flex items-center space-x-3 relative z-[60]"
          >
            <span className={`text-[10px] font-bold tracking-[0.4em] uppercase transition-colors duration-500 hidden md:block ${isMenuOpen || isScrolled ? 'text-white' : 'text-primary mix-blend-difference drop-shadow-[0_0_10px_rgba(255,255,255,1)]'}`}>
              {isMenuOpen ? 'Close' : 'Menu'}
            </span>
            <div className="w-8 flex flex-col items-end space-y-1.5">
              <motion.div 
                animate={isMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className={`h-[1px] w-full transition-colors duration-500 ${isMenuOpen || isScrolled ? 'bg-white' : 'bg-primary mix-blend-difference drop-shadow-[0_0_2px_rgba(255,255,255,1)]'}`}
              />
              <motion.div 
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className={`h-[1px] w-3/4 transition-colors duration-500 ${isMenuOpen || isScrolled ? 'bg-white' : 'bg-primary mix-blend-difference drop-shadow-[0_0_2px_rgba(255,255,255,1)]'}`}
              />
              <motion.div 
                animate={isMenuOpen ? { rotate: -45, y: -7, width: '100%' } : { rotate: 0, y: 0, width: '50%' }}
                className={`h-[1px] transition-colors duration-500 ${isMenuOpen || isScrolled ? 'bg-white' : 'bg-primary mix-blend-difference drop-shadow-[0_0_2px_rgba(255,255,255,1)]'}`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-[#050202] text-white flex flex-col justify-center"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
          >
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/IMG_20260603_142707.jpg')] bg-cover bg-center opacity-[0.03] mix-blend-luminosity pointer-events-none" />
            <div className="absolute inset-0 silk-texture opacity-20 pointer-events-none" />

            <div className="container mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-center relative z-10 py-32">
              
              {/* Primary Links */}
              <div className="w-full md:w-1/2 flex flex-col space-y-6 md:space-y-10 pl-4 md:pl-20 border-l border-white/10">
                <span className="text-[9px] font-bold tracking-[0.6em] uppercase text-white/40 mb-4 block">Categories</span>
                {CATEGORIES.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1), duration: 0.6 }}
                  >
                    <Link 
                      href={`/category/${cat.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-4xl md:text-7xl font-serif font-light text-white hover:text-secondary transition-colors duration-500 group flex items-center"
                    >
                      <span className="group-hover:translate-x-6 transition-transform duration-500">{cat.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Secondary Links & Info */}
              <div className="w-full md:w-1/2 mt-16 md:mt-0 flex flex-col md:items-end md:text-right pl-4 md:pl-0 border-l md:border-l-0 border-white/10">
                <span className="text-[9px] font-bold tracking-[0.6em] uppercase text-white/40 mb-8 block md:text-right">Menu</span>
                <div className="space-y-6 flex flex-col md:items-end">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + (i * 0.1), duration: 0.6 }}
                    >
                      <Link 
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg md:text-2xl font-serif font-light text-white/70 hover:text-white transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  className="mt-16 pt-8 border-t border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  <p className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/40 mb-4">Inquiries</p>
                  <a href="tel:+91XXXXXXXXXX" className="text-xl font-serif text-white hover:text-secondary block">
                    +91-XXXXXXXXXX
                  </a>
                  <a href="mailto:info@aranyakjewellers.com" className="text-sm text-white/60 hover:text-white mt-2 block">
                    info@aranyakjewellers.com
                  </a>
                </motion.div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
