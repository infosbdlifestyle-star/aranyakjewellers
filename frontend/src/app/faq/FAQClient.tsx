"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TextReveal, SparkleGlint, MagneticCard } from '@/components/animations/LuxuryMotion';

interface FAQItem {
  id: number;
  category: 'authenticity' | 'bridal' | 'policy' | 'services';
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    category: 'authenticity',
    question: "Do you provide a certificate of authenticity?",
    answer: "Yes. Every single diamond and precious gemstone piece from Aranyak Jewellers is accompanied by a recognized gemological laboratory certificate (IGI/GIA). Furthermore, 100% of our gold jewellery is certified with the Government of India's BIS 916 Hallmark, with laser-inscribed HUID numbers ensuring absolute purity and ethical provenance."
  },
  {
    id: 2,
    category: 'bridal',
    question: "Do you offer bespoke jewellery customization?",
    answer: "Bespoke artistry is the heart of our heritage. You can collaborate directly with our master Bengali goldsmiths to sketch, 3D model, and craft personalized bridal sets, engagement heirlooms, or family keepsakes. We also remodel ancestral gold into contemporary silhouettes while preserving its sentimental value."
  },
  {
    id: 3,
    category: 'policy',
    question: "What is your lifetime exchange and buy-back policy?",
    answer: "We guarantee 100% transparency. Hallmarked gold jewellery purchased from Aranyak can be exchanged at full prevailing gold market value by net weight, minus making charges. Diamond pieces carry a lifetime exchange guarantee at 90% of prevailing diamond value. Even old jewellery from other jewelers is welcome for purity evaluation."
  },
  {
    id: 4,
    category: 'authenticity',
    question: "How is the daily gold rate determined at Aranyak?",
    answer: "Our gold rates are strictly calibrated each morning according to official bullion market rates set by the Tripura Jewellers Association. We display 24K, 22K, and 18K rates transparently on our website and in-showroom digital displays, with zero hidden surcharges."
  },
  {
    id: 5,
    category: 'bridal',
    question: "Can I book a private bridal consultation?",
    answer: "Yes, our dedicated bridal suites in Agartala and Khowai offer private, one-on-one trousseau consultations. An experienced jewellery stylist will help coordinate necklaces, jhumkas, maang tikka, and bangles with your wedding attire and personal aesthetic in a relaxed, luxurious lounge."
  },
  {
    id: 6,
    category: 'services',
    question: "Do you provide jewellery cleaning, restoration, and polishing?",
    answer: "Complimentary ultrasonic cleaning and stone-tightening checks are available for all Aranyak patrons at any of our 4 boutiques. We also provide traditional deep polishing, rhodium plating, and antique restoration services for heritage pieces."
  },
  {
    id: 7,
    category: 'policy',
    question: "What payment methods and EMI options are available?",
    answer: "We accept all major credit/debit cards, UPI, net banking, and bank transfers. We also partner with leading financial institutions to offer flexible, 0% interest EMI options on select bridal and diamond collections."
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'authenticity', label: 'Gold Purity & Hallmarking' },
  { id: 'bridal', label: 'Bespoke & Bridal' },
  { id: 'policy', label: 'Exchange & Value' },
  { id: 'services', label: 'Care & Services' }
];

export default function FAQClient() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openId, setOpenId] = useState<number | null>(1);

  const filteredFaqs = activeCategory === 'all' 
    ? FAQS 
    : FAQS.filter(item => item.category === activeCategory);

  const toggleAccordion = (id: number) => {
    setOpenId(prev => prev === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#76551C] pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-[#C49A45]/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F0E7D8]/60 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#211813] text-[#E0BD72] border border-[#D6B15D]/30 text-[10px] uppercase font-bold tracking-[0.3em] mb-6 shadow-sm">
            <SparkleGlint color="#E7C880" size={12}>
              <span>✦</span>
            </SparkleGlint>
            Patron Concierge
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-light mb-6 text-[#76551C] tracking-tight">
            <TextReveal text="Frequently Asked" />{' '}
            <span className="font-editorial italic text-[#D6B15D]">Questions</span>
          </h1>
          
          <p className="text-[#76551C] font-normal max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            Everything you need to know regarding hallmark certifications, custom bridal commissions, 
            lifetime buy-back guarantees, and boutique care.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'text-[#FFF8EC]'
                    : 'text-[#76551C] hover:text-[#76551C] bg-[#F0E7D8]/60 border border-[#DED2C1]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="faq-active-pill"
                    className="absolute inset-0 bg-[#211813] rounded-full shadow-md -z-10 border border-[#D6B15D]/50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Interactive Accordion */}
        <div className="space-y-4">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`border transition-all duration-300 rounded-xl overflow-hidden shadow-sm ${
                      isOpen
                        ? 'border-[#D6B15D] bg-[#FFFDF8] shadow-md ring-1 ring-[#98712E]/20'
                        : 'border-[#DED2C1] bg-[#FFFDF8] hover:border-[#D6B15D]'
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordion(faq.id)}
                      className="w-full py-5 px-6 md:px-8 text-left flex items-center justify-between gap-4 group cursor-pointer transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className={`text-base md:text-lg font-serif transition-colors duration-300 ${
                        isOpen ? 'text-[#D6B15D] font-medium' : 'text-[#76551C] group-hover:text-[#D6B15D]'
                      }`}>
                        {faq.question}
                      </span>
                      
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                        isOpen 
                          ? 'bg-[#211813] text-[#E0BD72] border-[#D6B15D]' 
                          : 'bg-[#F0E7D8] text-[#76551C] border-[#DED2C1] group-hover:border-[#D6B15D]'
                      }`}>
                        <motion.span
                          animate={{ rotate: isOpen ? 135 : 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="text-lg font-light leading-none block"
                        >
                          +
                        </motion.span>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 md:px-8 pb-6 pt-1 text-[#76551C] text-sm md:text-[15px] font-normal leading-relaxed border-t border-[#DED2C1]/40">
                            <p className="mt-2">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-20">
          <MagneticCard tiltAmount={4} glareOpacity={0.12}>
            <div className="border border-[#DED2C1] bg-[#FFFDF8] p-8 sm:p-12 rounded-2xl shadow-md text-center relative overflow-hidden">
              <div className="absolute top-3 right-3 text-[#D6B15D]/20 font-serif text-6xl pointer-events-none select-none">✧</div>
              <h2 className="text-2xl md:text-3xl font-serif mb-3 text-[#76551C]">
                Have a unique query or need immediate advice?
              </h2>
              <p className="text-[#76551C] mb-8 font-normal max-w-lg mx-auto text-sm">
                Our jewellery masters and boutique concierges are available 6 days a week to guide your decisions.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="btn-luxury px-8 py-3.5 uppercase tracking-widest text-xs font-bold shadow-md inline-flex items-center gap-2"
                >
                  <span>Connect with Stylist</span>
                  <span>→</span>
                </Link>
                <a
                  href="https://wa.me/919436501506"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 uppercase tracking-widest text-xs font-bold text-[#FFF8EC] bg-[#211813] hover:bg-[#C9A04A] hover:text-[#211813] border border-[#D6B15D]/40 rounded transition-all shadow-sm"
                >
                  WhatsApp Now
                </a>
              </div>
            </div>
          </MagneticCard>
        </div>

      </div>
    </main>
  );
}
