"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TextReveal, 
  MagneticCard, 
  SparkleGlint, 
  StaggerContainer, 
  StaggerItem 
} from '@/components/animations/LuxuryMotion';

const CONTACT_INFO = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: 'Flagship Boutique',
    details: ['M B B CHOWMUHANI, AGARTALA', 'Tripura 799001, India'],
    actionText: 'View on Maps',
    actionHref: 'https://maps.google.com/?q=Aranyak+Jewellers+Agartala',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    title: 'Direct Telephony',
    details: ['+91-9436501506', 'Mon–Sat: 10:00 AM – 8:30 PM'],
    actionText: 'Call Boutique',
    actionHref: 'tel:+919436501506',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    ),
    title: 'WhatsApp Concierge',
    details: ['Chat with jewellery advisor', 'Instant quotes & trousseau advice'],
    actionText: 'Start WhatsApp Chat',
    actionHref: 'https://wa.me/919436501506',
  },
];

const SHOWROOMS_DIRECTORY = [
  {
    city: 'Agartala',
    name: 'Agartala Branch',
    address: 'B. Chowmuhani, M.B, Motor Stand Rd, Dhaleswar, Agartala 799001',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Aranyak+Jewellers+B.+Chowmuhani,+M.B,+Motor+Stand+Rd,+near+Kamaan+Chowmuhani,+Dhaleswar,+Agartala,+Tripura+799001',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Aranyak+Jewellers+B.+Chowmuhani,+M.B,+Motor+Stand+Rd,+near+Kamaan+Chowmuhani,+Dhaleswar,+Agartala,+Tripura+799001',
  },
  {
    city: 'Dharmanagar',
    name: 'Dharmanagar Branch',
    address: 'DNV Road, Power House Quater Complex, Dharmanagar, Tripura 799250',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=DNV+Road%2C+Power+House+Quater+Complex%2C+Dharmanagar%2C+Tripura+799250%2C+India',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=ARANYAK+JEWELLERS%2C+DNV+Road%2C+Dharmanagar%2C+Tripura+799250',
  },
  {
    city: 'Kailashahar',
    name: 'Kailashahar Branch',
    address: 'GIRLS SCHOOL ROAD, Kailashahar, Tripura 799277',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Aranyak+Jewellers+GIRLS+SCHOOL+ROAD,+Kailashahar,+Tripura+799277',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Aranyak+Jewellers+GIRLS+SCHOOL+ROAD,+Kailashahar,+Tripura+799277',
  },
  {
    city: 'Khowai',
    name: 'Khowai Branch',
    address: '3J93+FHJ Subhash Park, Suhash Park, Khowai, Tripura 799202',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Aranyak+Jewellers+3J93%2BFHJ+Subhash+Park,+Suhash+Park,+Khowai,+Tripura+799202',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Aranyak+Jewellers+3J93%2BFHJ+Subhash+Park,+Suhash+Park,+Khowai,+Tripura+799202',
  },
];

export default function ContactClient() {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Bridal Consultation',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F8F4EC] text-[#30231D] selection:bg-[#C49A45] selection:text-[#211713]">
      
      {/* 1. Hero */}
      <section className="py-28 md:py-36 px-6 md:px-12 relative bg-[#211713] text-[#F8F1E5] text-left border-b border-[#DED2C1]/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] bg-cover bg-center opacity-15 mix-blend-luminosity scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#211713]/90 via-[#211713]/70 to-[#211713]" />
        
        <div className="relative z-10 container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <SparkleGlint color="#C49A45" size={12}>
              <span className="text-[#C49A45]">✧</span>
            </SparkleGlint>
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#C49A45] font-bold">
              Aranyak Patron Concierge
            </p>
          </motion.div>

          <h1 className="text-5xl md:text-8xl font-serif font-light mb-6 text-[#F8F1E5] tracking-tight">
            <TextReveal text="Get in" />{' '}
            <span className="font-editorial italic gold-gradient">Touch</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#D4C5B2] font-normal tracking-widest uppercase max-w-xl leading-relaxed">
            Connect with our diamond gemologists, bridal trousseau consultants, and master artisans across Tripura.
          </p>
        </div>
      </section>

      {/* 2. Contact Cards */}
      <section className="py-24 bg-[#F8F4EC] text-[#30231D]">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <StaggerContainer delay={0.1} staggerTime={0.15}>
            <div className="grid md:grid-cols-3 gap-8 mb-28">
              {CONTACT_INFO.map((info, i) => (
                <StaggerItem key={i}>
                  <MagneticCard tiltAmount={5} glareOpacity={0.14}>
                    <div className="bg-[#FFFFFF] border border-[#DED2C1] p-10 text-center space-y-6 min-h-[300px] flex flex-col items-center justify-between rounded-xl shadow-md group hover:border-[#C49A45] transition-colors duration-500">
                      
                      <div className="w-16 h-16 mx-auto bg-[#211713] border border-[#C49A45]/40 flex items-center justify-center text-[#C49A45] group-hover:scale-110 transition-transform duration-500 rounded-xl shadow-inner">
                        {info.icon}
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-serif font-light text-[#30231D] tracking-wide">
                          {info.title}
                        </h3>
                        {info.details.map((detail, j) => (
                          <p key={j} className="text-xs text-[#74665A] font-normal">
                            {detail}
                          </p>
                        ))}
                      </div>

                      <a
                        href={info.actionHref}
                        target={info.actionHref.startsWith('http') ? '_blank' : undefined}
                        rel={info.actionHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#A77C32] hover:text-[#30231D] inline-flex items-center gap-1 group-hover:underline"
                      >
                        <span>{info.actionText}</span>
                        <span>→</span>
                      </a>

                    </div>
                  </MagneticCard>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          {/* Showroom Directory Banner */}
          <div className="mb-24">
            <div className="text-center mb-10">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#A77C32] block mb-2">
                Tripura Boutiques Network
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-[#30231D]">
                Visit Our <span className="font-editorial italic text-[#C49A45]">Showrooms</span>
              </h2>
              <p className="text-xs text-[#74665A] mt-2 font-normal">
                Serving patrons across Agartala, Dharmanagar, Kailashahar, and Khowai.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SHOWROOMS_DIRECTORY.map((s, idx) => (
                <div 
                  key={idx}
                  className="bg-[#FFFFFF] border border-[#DED2C1] hover:border-[#C49A45] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-[#F8F4EC] text-[#A77C32] border border-[#DED2C1]">
                      {s.city}
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#30231D] mt-2 mb-1.5 leading-snug">
                      {s.name}
                    </h4>
                    <p className="text-xs text-[#74665A] leading-relaxed">
                      {s.address}
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-[#DED2C1]/60 flex items-center justify-between text-[11px] font-bold tracking-wider uppercase">
                    <a 
                      href={s.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#211713] hover:text-[#C49A45] transition-colors"
                    >
                      Directions →
                    </a>
                    <a 
                      href={s.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#A77C32] hover:underline"
                    >
                      Maps ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/stores"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#A77C32] hover:text-[#211713] transition-colors hover:underline"
              >
                <span>View Full Showrooms Details & Timings</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* 3. Interactive Contact Form */}
          <div className="max-w-3xl mx-auto">
            <MagneticCard tiltAmount={3} glareOpacity={0.1}>
              <div className="bg-[#FFFFFF] border border-[#DED2C1] p-10 md:p-16 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="text-center mb-12">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#A77C32] block mb-2">
                    Direct Inquiry
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif font-light text-[#30231D]">
                    Send Us a <span className="font-editorial italic text-[#C49A45]">Message</span>
                  </h2>
                  <p className="text-xs text-[#74665A] mt-2 font-normal">
                    We typically respond within 2 to 4 business hours.
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12 space-y-4"
                    >
                      <div className="w-16 h-16 mx-auto rounded-full bg-[#211713] text-[#C49A45] flex items-center justify-center text-2xl border border-[#C49A45]">
                        ✓
                      </div>
                      <h3 className="text-2xl font-serif text-[#30231D]">Message Received With Grace</h3>
                      <p className="text-sm text-[#74665A] max-w-md mx-auto">
                        Thank you, {formState.name || 'Patron'}. Our jewellery concierge will reach you shortly at {formState.phone || formState.email || 'your contact'}.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="mt-4 px-6 py-2.5 text-xs font-bold tracking-widest uppercase bg-[#F0E7D8] text-[#30231D] rounded border border-[#DED2C1] hover:border-[#C49A45]"
                      >
                        Send Another Note
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="contact-name" className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#30231D] mb-2 block">
                            Full Name *
                          </label>
                          <input 
                            id="contact-name"
                            type="text" 
                            required
                            placeholder="Sreemoyi Roy"
                            value={formState.name}
                            onChange={e => setFormState({ ...formState, name: e.target.value })}
                            className="w-full border-b border-[#DED2C1] px-0 py-3 text-sm text-[#30231D] placeholder-[#74665A]/50 focus:outline-none focus:border-[#C49A45] transition-colors bg-transparent"
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-phone" className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#30231D] mb-2 block">
                            Phone Number *
                          </label>
                          <input 
                            id="contact-phone"
                            type="tel" 
                            required
                            placeholder="+91-9436501506"
                            value={formState.phone}
                            onChange={e => setFormState({ ...formState, phone: e.target.value })}
                            className="w-full border-b border-[#DED2C1] px-0 py-3 text-sm text-[#30231D] placeholder-[#74665A]/50 focus:outline-none focus:border-[#C49A45] transition-colors bg-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="contact-email" className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#30231D] mb-2 block">
                            Email Address
                          </label>
                          <input 
                            id="contact-email"
                            type="email" 
                            placeholder="patron@example.com"
                            value={formState.email}
                            onChange={e => setFormState({ ...formState, email: e.target.value })}
                            className="w-full border-b border-[#DED2C1] px-0 py-3 text-sm text-[#30231D] placeholder-[#74665A]/50 focus:outline-none focus:border-[#C49A45] transition-colors bg-transparent"
                          />
                        </div>

                        <div>
                          <label htmlFor="contact-subject" className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#30231D] mb-2 block">
                            Interest / Inquiry Type
                          </label>
                          <select 
                            id="contact-subject"
                            value={formState.subject}
                            onChange={e => setFormState({ ...formState, subject: e.target.value })}
                            className="w-full border-b border-[#DED2C1] px-0 py-3 text-sm text-[#30231D] focus:outline-none focus:border-[#C49A45] transition-colors bg-transparent appearance-none rounded-none cursor-pointer"
                          >
                            <option className="bg-[#F8F4EC] text-[#30231D]">Bridal Consultation</option>
                            <option className="bg-[#F8F4EC] text-[#30231D]">Bespoke Jewellery Commission</option>
                            <option className="bg-[#F8F4EC] text-[#30231D]">Certified Solitaires & Diamonds</option>
                            <option className="bg-[#F8F4EC] text-[#30231D]">Gold Rate & Investment Inquiry</option>
                            <option className="bg-[#F8F4EC] text-[#30231D]">Old Gold Exchange & Valuation</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact-message" className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#30231D] mb-2 block">
                          Message / Special Requests
                        </label>
                        <textarea 
                          id="contact-message"
                          rows={4} 
                          required
                          placeholder="Tell us about the jewellery pieces or occasions you have in mind..."
                          value={formState.message}
                          onChange={e => setFormState({ ...formState, message: e.target.value })}
                          className="w-full border-b border-[#DED2C1] px-0 py-3 text-sm text-[#30231D] placeholder-[#74665A]/50 focus:outline-none focus:border-[#C49A45] transition-colors bg-transparent resize-none"
                        />
                      </div>

                      <div className="text-center pt-8">
                        <button 
                          type="submit"
                          className="btn-luxury px-16 py-4 text-[10px] font-bold tracking-[0.4em] uppercase shadow-lg hover:shadow-xl transition-all"
                        >
                          Submit Inquiry
                        </button>
                      </div>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </MagneticCard>
          </div>

        </div>
      </section>

    </main>
  );
}
