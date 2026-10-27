"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Reveal } from '@/components/animations/Reveal';
import { TextReveal } from '@/components/animations/LuxuryMotion';

export interface StoreLocation {
  id: string;
  name: string;
  city?: 'agartala' | 'kailashahar' | 'khowai' | 'dharmanagar' | string;
  address: string;
  phone?: string;
  hours?: string;
  mapUrl: string;
  directionsUrl?: string;
  storeType?: string;
  order?: number;
  isActive?: boolean;
}

export const STORE_LOCATIONS: StoreLocation[] = [
  {
    id: 'agartala-branch',
    name: 'Agartala Branch',
    city: 'agartala',
    address: 'B. Chowmuhani, M.B, Motor Stand Rd, near Kamaan Chowmuhani, Dhaleswar, Agartala, Tripura 799001',
    phone: '03812981506',
    hours: 'Opens 10:00 AM',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Aranyak+Jewellers+B.+Chowmuhani,+M.B,+Motor+Stand+Rd,+near+Kamaan+Chowmuhani,+Dhaleswar,+Agartala,+Tripura+799001',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Aranyak+Jewellers+B.+Chowmuhani,+M.B,+Motor+Stand+Rd,+near+Kamaan+Chowmuhani,+Dhaleswar,+Agartala,+Tripura+799001',
    storeType: 'Flagship Showroom',
  },
  {
    id: 'dharmanagar-branch',
    name: 'Dharmanagar Branch',
    city: 'dharmanagar',
    address: 'DNV Road, Power House Quater Complex, Dharmanagar, Tripura 799250, India',
    hours: 'Open until 9:00 PM',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=ARANYAK+JEWELLERS%2C+DNV+Road%2C+Dharmanagar%2C+Tripura+799250',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=DNV+Road%2C+Power+House+Quater+Complex%2C+Dharmanagar%2C+Tripura+799250%2C+India',
    storeType: 'Jewellery Showroom',
  },
  {
    id: 'kailashahar-branch',
    name: 'Kailashahar Branch',
    city: 'kailashahar',
    address: 'GIRLS SCHOOL ROAD, Kailashahar, Tripura 799277',
    phone: '03812981506',
    hours: 'Opens 10:00 AM',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Aranyak+Jewellers+GIRLS+SCHOOL+ROAD,+Kailashahar,+Tripura+799277',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Aranyak+Jewellers+GIRLS+SCHOOL+ROAD,+Kailashahar,+Tripura+799277',
    storeType: 'Jewellery Showroom',
  },
  {
    id: 'khowai-branch',
    name: 'Khowai Branch',
    city: 'khowai',
    address: '3J93+FHJ Subhash Park, Suhash Park, Khowai, Tripura 799202',
    phone: '094365 89901',
    hours: 'Opens 10:00 AM',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Aranyak+Jewellers+3J93%2BFHJ+Subhash+Park,+Suhash+Park,+Khowai,+Tripura+799202',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Aranyak+Jewellers+3J93%2BFHJ+Subhash+Park,+Suhash+Park,+Khowai,+Tripura+799202',
    storeType: 'Jewellery Showroom',
  },
];

export const TABS = [
  { id: 'all', label: 'ALL BOUTIQUES' },
  { id: 'agartala', label: 'AGARTALA' },
  { id: 'dharmanagar', label: 'DHARMANAGAR' },
  { id: 'kailashahar', label: 'KAILASHAHAR' },
  { id: 'khowai', label: 'KHOWAI' },
] as const;

/**
 * Deduplicate stores and merge any missing default stores
 */
export function mergeWithDefaultStores(incomingStores: StoreLocation[] = []): StoreLocation[] {
  const merged: StoreLocation[] = [];
  const seenKeys = new Set<string>();

  const getCityKey = (item: StoreLocation): string => {
    if (item.city) return item.city.toLowerCase().trim();
    const text = `${item.name} ${item.address}`.toLowerCase();
    if (text.includes('dharmanagar')) return 'dharmanagar';
    if (text.includes('kailashahar')) return 'kailashahar';
    if (text.includes('khowai')) return 'khowai';
    if (text.includes('agartala')) return 'agartala';
    return item.id.toLowerCase();
  };

  const cleanStoreName = (name: string, cityKey: string): string => {
    if (cityKey === 'dharmanagar') return 'Dharmanagar Branch';
    return name.replace(/^Aranyak Jewellers\s*[—–-]\s*/i, '').trim() || name;
  };

  const addStore = (store: StoreLocation) => {
    const cityKey = getCityKey(store);
    const idKey = store.id ? store.id.toLowerCase() : cityKey;
    if (seenKeys.has(cityKey) || seenKeys.has(idKey)) return;
    
    seenKeys.add(cityKey);
    seenKeys.add(idKey);

    // Fill missing fields with defaults if available
    const defaultMatch = STORE_LOCATIONS.find(d => getCityKey(d) === cityKey);
    merged.push({
      ...defaultMatch,
      ...store,
      name: cleanStoreName(store.name || defaultMatch?.name || '', cityKey),
      city: cityKey,
      storeType: store.storeType || defaultMatch?.storeType || 'Jewellery Showroom',
      hours: store.hours || defaultMatch?.hours || (cityKey === 'dharmanagar' ? 'Open until 9:00 PM' : 'Opens 10:00 AM'),
      directionsUrl: store.directionsUrl || defaultMatch?.directionsUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.address)}`,
      mapUrl: store.mapUrl || defaultMatch?.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name}, ${store.address}`)}`,
    });
  };

  if (Array.isArray(incomingStores) && incomingStores.length > 0) {
    incomingStores.forEach(addStore);
  }

  // Always ensure all default branches are included without duplication
  STORE_LOCATIONS.forEach(addStore);

  return merged;
}

export default function StoresClient({
  stores = STORE_LOCATIONS,
  contactPhone = "+919436501506",
}: {
  stores?: StoreLocation[];
  contactPhone?: string;
}) {
  const [activeTab, setActiveTab] = useState<string>('all');

  // Guaranteed fallback and deduplication
  const sourceStores = mergeWithDefaultStores(stores);

  // Filter logic: 'all' returns all showrooms, otherwise filter by city or keywords
  const filteredStores = activeTab === 'all'
    ? sourceStores
    : sourceStores.filter((store) => {
        const tabLower = activeTab.toLowerCase();
        const cityLower = (store.city || '').toLowerCase();
        const nameLower = (store.name || '').toLowerCase();
        const addrLower = (store.address || '').toLowerCase();
        return (
          cityLower === tabLower ||
          nameLower.includes(tabLower) ||
          addrLower.includes(tabLower)
        );
      });

  return (
    <main className="min-h-screen flex flex-col bg-[#1C1410] text-[#F8F1E5]">
      {/* Hero Section */}
      <section className="relative py-28 md:py-36 px-6 md:px-12 bg-[#211713] text-[#F8F1E5] text-left overflow-hidden border-b border-[#DED2C1]/20">
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] opacity-15 mix-blend-luminosity animate-slow-zoom pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#211713] via-[#211713]/60 to-transparent pointer-events-none" />
        
        <div className="relative z-10 container mx-auto max-w-7xl">
          <Reveal y={20}>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#30231D] border border-[#C49A45]/40 mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C49A45] animate-pulse" />
              <span className="text-[10px] tracking-[0.45em] uppercase text-[#E7C880] font-bold">
                Tripura Showrooms ({sourceStores.length})
              </span>
            </div>
          </Reveal>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-light mb-6 tracking-tight text-[#F8F1E5]">
            <TextReveal delay={0.1} duration={1}>
              Our
            </TextReveal>{" "}
            <TextReveal delay={0.25} duration={1.1}>
              <span className="font-editorial italic gold-gradient">Showrooms</span>
            </TextReveal>
          </h1>

          <div className="flex items-center justify-start space-x-4">
            <p className="text-xs tracking-[0.3em] uppercase text-[#D4C5B2] font-medium">
              Bespoke Jewellery Consultations Across {sourceStores.length} Tripura Boutiques
            </p>
            <div className="h-[1px] w-16 bg-gradient-to-r from-[#C49A45] to-transparent" />
          </div>
        </div>
      </section>

      {/* Interactive Location Filter Tabs */}
      <section className="sticky top-20 z-30 bg-[#211713]/95 backdrop-blur-md border-b border-[#C49A45]/20 py-4 px-6 shadow-md">
        <div className="container mx-auto max-w-5xl flex items-center justify-center overflow-x-auto no-scrollbar space-x-2 sm:space-x-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-5 py-2.5 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-300 rounded-full overflow-hidden"
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeStoreTab"
                  className="absolute inset-0 bg-[#C49A45] shadow-md z-0 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-300 ${
                activeTab === tab.id ? 'text-[#211713] font-extrabold' : 'text-gray-300 hover:text-white'
              }`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Stores Responsive Grid */}
      <section className="py-16 md:py-24 flex-1 bg-gradient-to-b from-[#1C1410] via-[#211713] to-[#1C1410] text-[#F8F1E5] relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gold opacity-15 pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <div 
            className={`grid gap-6 lg:gap-8 transition-all duration-300 ${
              filteredStores.length === 1 
                ? 'grid-cols-1 max-w-xl mx-auto w-full' 
                : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
            }`}
          >
            {filteredStores.map((store) => {
              const directionsTarget = store.directionsUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.address)}`;
              const searchTarget = store.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name}, ${store.address}`)}`;
              const displayTitle = store.name === 'Aranyak Jewellers — Dharmanagar' || store.name === 'Aranyak Jewellers - Dharmanagar' 
                ? 'Dharmanagar Branch' 
                : store.name;
              
              return (
                <article 
                  key={store.id} 
                  className="bg-[#FCFAF6] border border-[#E5D9C8] hover:border-[#C49A45] rounded-2xl p-7 sm:p-8 flex flex-col justify-between h-full group transition-all duration-300 hover:shadow-[0_16px_40px_rgba(196,154,69,0.22)] shadow-md text-[#30231D] relative overflow-hidden"
                >
                  {/* Subtle Top Gold Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C49A45]/50 to-transparent group-hover:via-[#C49A45] transition-all duration-500" />

                  {/* Card Main Body */}
                  <div className="flex-1 flex flex-col">
                    {/* Top Location Label & Sparkle Icon */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C49A45]" />
                        <span className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-[#A77C32]">
                          {(store.city || 'Tripura').toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[#C49A45]/70 group-hover:text-[#C49A45] group-hover:scale-110 transition-all text-xs font-serif">
                        ✦
                      </span>
                    </div>

                    {/* Prominent Branch Title */}
                    <h3 className="text-2xl font-serif font-bold text-[#2B1B15] group-hover:text-[#9A7328] transition-colors leading-snug mb-3">
                      {displayTitle}
                    </h3>

                    {/* Thin Divider */}
                    <div className="w-14 h-[2px] bg-gradient-to-r from-[#C49A45] to-transparent mb-5" />

                    {/* Store Information: Address, Hours, Phone */}
                    <div className="space-y-4 text-xs sm:text-sm text-[#4A3B32] flex-1">
                      {/* Clickable Address with Gold Pin Icon */}
                      <div className="flex items-start gap-3 leading-relaxed">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#C49A45] shrink-0 mt-0.5">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <a 
                          href={searchTarget}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#4A3B32] hover:text-[#9A7328] hover:underline transition-colors break-words font-medium"
                          title="Open Google Maps search for this showroom"
                        >
                          {store.address}
                        </a>
                      </div>

                      {/* Opening Hours with Gold Clock Icon */}
                      {store.hours && (
                        <div className="flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#C49A45] shrink-0">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          <span className="font-semibold text-[#30231D]">
                            {store.hours}
                          </span>
                        </div>
                      )}

                      {/* Phone with Gold Phone Icon (if present) */}
                      {store.phone && (
                        <div className="flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#C49A45] shrink-0">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                          {store.phone.includes('X') ? (
                            <span className="font-medium text-[#4A3B32]">{store.phone}</span>
                          ) : (
                            <a href={`tel:${store.phone.replace(/\s+/g,'')}`} className="font-medium text-[#4A3B32] hover:text-[#9A7328] hover:underline transition-colors tracking-wide">
                              {store.phone}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Actions: Get Directions & View on Google Maps */}
                  <div className="pt-6 mt-6 border-t border-[#E5D9C8] space-y-2">
                    {/* Primary: Get Directions Button */}
                    <a 
                      href={directionsTarget} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#211713] hover:bg-[#C49A45] text-[#F8F1E5] hover:text-[#211713] text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-md group/btn min-h-[44px]"
                    >
                      <span>Get Directions</span>
                      <span className="group-hover/btn:translate-x-1 transition-transform duration-300 text-sm">→</span>
                    </a>

                    {/* Secondary: View on Google Maps Link */}
                    <a 
                      href={searchTarget} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold tracking-[0.16em] uppercase text-[#8C6B24] hover:text-[#211713] transition-colors"
                    >
                      <span>View on Google Maps</span>
                      <span className="text-xs">↗</span>
                    </a>
                  </div>
                </article>
              );
            })}

            {filteredStores.length === 0 && (
              <div className="col-span-full py-16 text-center">
                <p className="text-gray-300 text-sm mb-4">No showrooms found for this selection.</p>
                <button
                  onClick={() => setActiveTab('all')}
                  className="text-xs uppercase tracking-widest text-[#E7C880] underline hover:text-white"
                >
                  View All Showrooms
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Appointment CTA */}
      <section className="py-24 bg-[#211713] text-[#F8F1E5] relative overflow-hidden border-t border-[#DED2C1]/20">
        <div className="absolute inset-0 bg-radial-gold opacity-15 pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-8 relative z-10">
          <Reveal>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#30231D] border border-[#C49A45]/40 mb-2">
              <span className="text-xs">✦</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#E7C880] font-bold">Privé Consultation</span>
              <span className="text-xs">✦</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-[#F8F1E5] leading-tight">
              Personalized Shopping <span className="font-editorial italic gold-gradient">Experience</span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="max-w-2xl mx-auto text-[#D4C5B2] text-sm md:text-base leading-relaxed font-light">
              Our master gemologists and bridal stylists are at your service across Agartala, Dharmanagar, Kailashahar, and Khowai. Book an exclusive showroom viewing or virtual video tour across Tripura.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-wrap justify-center gap-5 pt-4">
              <a 
                href={`https://wa.me/${contactPhone.replace(/\D/g,'')}?text=Hello%20Aranyak%20Jewellers%2C%20I%20would%20like%20to%20book%20a%20private%20bridal%20viewing`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-luxury px-10 py-4 text-[10px] font-bold tracking-[0.35em] uppercase shadow-lg hover:scale-105 transition-all"
              >
                Book VIP Appointment
              </a>
              <a 
                href={`tel:${contactPhone}`}
                className="px-10 py-4 text-[10px] font-bold tracking-[0.35em] uppercase text-[#F8F1E5] bg-[#30231D] hover:bg-[#30231D]/80 border border-[#DED2C1]/30 hover:border-[#C49A45] transition-all"
              >
                Call Concierge
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
