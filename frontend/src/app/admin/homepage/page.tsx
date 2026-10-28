"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface SectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  description: string;
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'hero', name: 'Hero Brand Showcase', enabled: true, order: 0, description: 'Brand title, background visual, luxury ambient glows' },
  { id: 'ticker', name: 'Announcement Ticker Bar', enabled: true, order: 1, description: 'Top champagne-gold continuous promotional ticker' },
  { id: 'offers', name: 'Festive & Wedding Offers Cards', enabled: true, order: 2, description: '7 flagship discount and festive celebration cards' },
  { id: 'top_picks', name: 'Top Picks 3D Luxury Showcase', enabled: true, order: 3, description: 'Interactive coverflow of featured ornaments' },
  { id: 'philosophy_stats', name: 'Brand Philosophy & Heritage Stats', enabled: true, order: 4, description: 'Quarter-century narrative and 4 key brand stats' },
  { id: 'craftsmanship', name: 'Artisanal Craftsmanship Film', enabled: true, order: 5, description: 'Showcase of Bengali master goldsmith technique' },
  { id: 'collections', name: 'Curated Fine Collections', enabled: true, order: 6, description: 'Bridal, Royal Gold, Diamonds, and Silver grids' },
  { id: 'high_jewellery', name: 'High Jewellery Highlights', enabled: true, order: 7, description: 'Signature statement pieces and bespoke creations' },
  { id: 'rates_showroom', name: 'Live Gold Rates & Boutique Locator', enabled: true, order: 8, description: 'Daily 24K/22K/18K rates with showroom visit CTA' },
  { id: 'testimonials', name: 'Client Testimonials', enabled: true, order: 9, description: 'Verified buyer reviews and wedding trousseau stories' },
  { id: 'instagram', name: 'Instagram Lookbook & Socials', enabled: true, order: 10, description: 'Curated social lookbook and brand feed' },
];

export default function AdminHomepageManagerPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'hero' | 'sections' | 'testimonials' | 'stats' | 'social_footer'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Hero State
  const [heroConfig, setHeroConfig] = useState({
    brandTitle: 'ARANYAK JEWELLERS',
    tagline: 'Timeless Elegance & Royal Heritage',
    imageUrl: '/Website banner .png',
    height: '64vh',
    alignment: 'center',
    overlayDarkness: '60',
  });

  // Sections State
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS);

  // Testimonials State
  const [testimonials, setTestimonials] = useState<any[]>([
    {
      id: 't-1',
      quote: "Aranyak Jewellers crafted my complete wedding trousseau. The craftsmanship on the choker necklace and the transparency in gold pricing were exceptional.",
      author: "Ananya Roy Chowdhury",
      location: "Agartala",
      rating: 5,
      tag: "Verified Bridal Buyer"
    },
    {
      id: 't-2',
      quote: "The finest destination in Tripura for authentic astrological gems and certified diamonds. Their staff is extremely knowledgeable and welcoming.",
      author: "Dr. Subhashish Debbarma",
      location: "Udaipur",
      rating: 5,
      tag: "Loyal Customer (10+ Yrs)"
    },
    {
      id: 't-3',
      quote: "Purchased custom 22K bangles for my mother's 50th birthday. The gold quality and finishing exceed top national brands.",
      author: "Priya Sengupta",
      location: "Dharmanagar",
      rating: 5,
      tag: "Bespoke Order"
    }
  ]);

  // Brand Stats State
  const [brandStats, setBrandStats] = useState<any[]>([
    { label: 'Years of Heritage', value: '25+' },
    { label: 'BIS Hallmarked Gold', value: '100%' },
    { label: 'Happy Families Served', value: '50,000+' },
    { label: 'Flagship Showrooms', value: '4' }
  ]);

  // Social & Footer State
  const [socialFooter, setSocialFooter] = useState({
    instagramHandle: '@aranyakjewellers',
    instagramUrl: 'https://instagram.com/aranyakjewellers',
    facebookUrl: 'https://facebook.com/aranyakjewellers',
    contactEmail: 'aranyakjeweller@gmail.com',
    contactPhone: '+919436501506',
    address: 'Agartala, Tripura (Main Branch)',
  });

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN' && user?.role !== 'STAFF')) {
      router.push('/admin/login');
      return;
    }
    loadAllHomepageSettings();
  }, [isAuthenticated, user, router, isLoading]);

  const loadAllHomepageSettings = async () => {
    setLoading(true);
    try {
      const settings = await api.getSettings();
      if (settings) {
        // Hero
        if (settings['homepage_hero_config']) {
          try {
            setHeroConfig(JSON.parse(settings['homepage_hero_config']));
          } catch { /* empty */ }
        }

        // Sections
        if (settings['homepage_sections_config']) {
          try {
            const parsed = JSON.parse(settings['homepage_sections_config']);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSections(parsed);
            }
          } catch { /* empty */ }
        }

        // Testimonials
        if (settings['homepage_testimonials']) {
          try {
            const parsed = JSON.parse(settings['homepage_testimonials']);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setTestimonials(parsed);
            }
          } catch { /* empty */ }
        }

        // Stats
        if (settings['homepage_stats']) {
          try {
            const parsed = JSON.parse(settings['homepage_stats']);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setBrandStats(parsed);
            }
          } catch { /* empty */ }
        }

        // Footer / Social
        setSocialFooter({
          instagramHandle: settings['social_instagram_handle'] || '@aranyakjewellers',
          instagramUrl: settings['social_instagram'] || 'https://instagram.com/aranyakjewellers',
          facebookUrl: settings['social_facebook'] || 'https://facebook.com/aranyakjewellers',
          contactEmail: settings['contact_email'] || 'aranyakjeweller@gmail.com',
          contactPhone: settings['contact_phone'] || '+919436501506',
          address: settings['contact_address'] || 'Agartala, Tripura (Main Branch)',
        });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to load homepage settings.' });
    }
    setLoading(false);
  };

  const handleSaveAll = async () => {
    if (!token) return;
    setSaving(true);
    setStatusMessage(null);

    const payload: Record<string, string> = {
      homepage_hero_config: JSON.stringify(heroConfig),
      homepage_sections_config: JSON.stringify(sections),
      homepage_testimonials: JSON.stringify(testimonials),
      homepage_stats: JSON.stringify(brandStats),
      social_instagram_handle: socialFooter.instagramHandle,
      social_instagram: socialFooter.instagramUrl,
      social_facebook: socialFooter.facebookUrl,
      contact_email: socialFooter.contactEmail,
      contact_phone: socialFooter.contactPhone,
      contact_address: socialFooter.address,
    };

    try {
      const res = await api.updateSettings(token, payload);
      if (res) {
        setStatusMessage({ type: 'success', text: 'All homepage configurations successfully published to live website!' });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to update homepage settings.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network failure while saving settings.' });
    }
    setSaving(false);
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploadingImage(true);
    setStatusMessage(null);
    try {
      const res = await api.uploadImage(token, file);
      if (res && res.path) {
        setHeroConfig(prev => ({ ...prev, imageUrl: res.path }));
        setStatusMessage({ type: 'success', text: 'Hero image uploaded.' });
      } else {
        setStatusMessage({ type: 'error', text: 'Upload failed.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Error uploading image.' });
    }
    setUploadingImage(false);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sections.length) return;
    const reordered = [...sections];
    const temp = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = temp;
    setSections(reordered.map((sec, idx) => ({ ...sec, order: idx })));
  };

  const handleToggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A201B]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F1713] border border-[#C49A45]/30 text-[#D6B15D] text-[11px] font-bold tracking-widest uppercase mb-2">
            <span>✦</span>
            <span>Site Layout &amp; Content Core</span>
          </div>
          <h1 className="text-3xl font-serif text-[#F5E6D3] tracking-wide">Homepage Manager</h1>
          <p className="text-xs sm:text-sm text-[#A89887] mt-1">
            Configure Hero presentation, enable or reorder sections, edit testimonials, and manage brand statistics without code changes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#C49A45] to-[#8C6B28] text-[#120B08] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <span>💾</span>
            <span>{saving ? 'Publishing...' : 'Publish Homepage'}</span>
          </button>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
            : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
        }`}>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span>{statusMessage.type === 'success' ? '✓' : '⚠'}</span>
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-xs opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#2A201B] pb-2">
        {[
          { id: 'hero', label: '1. Hero & Branding' },
          { id: 'sections', label: '2. Section Order & Toggles' },
          { id: 'testimonials', label: '3. Client Testimonials' },
          { id: 'stats', label: '4. Heritage Stats' },
          { id: 'social_footer', label: '5. Socials & Footer' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#C49A45] text-[#120B08] font-bold'
                : 'text-[#A89887] hover:text-[#F5E6D3] bg-[#140E0B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#8A7969] text-xs uppercase tracking-widest animate-pulse">
          Loading homepage settings...
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: HERO & BRANDING */}
          {activeTab === 'hero' && (
            <div className="bg-[#140E0B] p-6 rounded-xl border border-[#2A201B] space-y-6">
              <div className="border-b border-[#2A201B] pb-4">
                <h2 className="text-lg font-serif text-[#F5E6D3]">Hero Section Presentation</h2>
                <p className="text-xs text-[#8A7969] mt-0.5">Customize the grand welcome banner seen by all visitors.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-[#C49A45] mb-2">
                    Hero Brand Title
                  </label>
                  <input
                    type="text"
                    value={heroConfig.brandTitle}
                    onChange={(e) => setHeroConfig({ ...heroConfig, brandTitle: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-sm px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-2">
                    Tagline / Subheading
                  </label>
                  <input
                    type="text"
                    value={heroConfig.tagline}
                    onChange={(e) => setHeroConfig({ ...heroConfig, tagline: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-sm px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
              </div>

              {/* Background Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-[#C49A45] mb-2">
                  Hero Background Image (1920×1080 recommended)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={heroConfig.imageUrl}
                    onChange={(e) => setHeroConfig({ ...heroConfig, imageUrl: e.target.value })}
                    className="flex-1 bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                  <label className="px-4 py-2.5 bg-[#2E221A] hover:bg-[#3E3024] text-[#E5D7C5] rounded-lg text-xs cursor-pointer transition-colors whitespace-nowrap">
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Height, Alignment, Darkness */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-2">
                    Hero Section Height
                  </label>
                  <select
                    value={heroConfig.height}
                    onChange={(e) => setHeroConfig({ ...heroConfig, height: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  >
                    <option value="58vh">Compact (58vh)</option>
                    <option value="64vh">Balanced Luxury (64vh - Recommended)</option>
                    <option value="70vh">Grand Stature (70vh)</option>
                    <option value="100vh">Full Screen Height (100vh)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-2">
                    Hero Alignment
                  </label>
                  <select
                    value={heroConfig.alignment}
                    onChange={(e) => setHeroConfig({ ...heroConfig, alignment: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  >
                    <option value="center">Center Centered (Standard)</option>
                    <option value="left">Left Aligned Editorial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-2">
                    Espresso Overlay Darkness
                  </label>
                  <select
                    value={heroConfig.overlayDarkness}
                    onChange={(e) => setHeroConfig({ ...heroConfig, overlayDarkness: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  >
                    <option value="40">Light Tint (40%)</option>
                    <option value="60">Balanced Warm Espresso (60% - Recommended)</option>
                    <option value="80">Deep Velvet Night (80%)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECTION REORDERING & TOGGLES */}
          {activeTab === 'sections' && (
            <div className="bg-[#140E0B] p-6 rounded-xl border border-[#2A201B] space-y-4">
              <div className="border-b border-[#2A201B] pb-4">
                <h2 className="text-lg font-serif text-[#F5E6D3]">Homepage Sections Architecture</h2>
                <p className="text-xs text-[#8A7969] mt-0.5">
                  Enable, disable, or drag/reorder sections dynamically without touching the code.
                </p>
              </div>

              <div className="space-y-3">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                      section.enabled 
                        ? 'bg-[#1A120E] border-[#2E221A]' 
                        : 'bg-[#120B08] border-[#221610] opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Order Controls */}
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => handleMoveSection(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded bg-[#1F1713] text-[#A89887] hover:text-[#C49A45] disabled:opacity-30 disabled:pointer-events-none text-xs"
                          title="Move Earlier"
                        >
                          ▲
                        </button>
                        <span className="text-[10px] font-mono text-[#8A7969]">{index + 1}</span>
                        <button
                          onClick={() => handleMoveSection(index, 'down')}
                          disabled={index === sections.length - 1}
                          className="p-1 rounded bg-[#1F1713] text-[#A89887] hover:text-[#C49A45] disabled:opacity-30 disabled:pointer-events-none text-xs"
                          title="Move Later"
                        >
                          ▼
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-sm text-[#F5E6D3]">
                            {section.name}
                          </h3>
                          <span className="font-mono text-[10px] text-[#8A7969]">
                            ({section.id})
                          </span>
                        </div>
                        <p className="text-xs text-[#8A7969] mt-0.5">
                          {section.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleSection(section.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors flex items-center gap-1.5 ${
                          section.enabled 
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/50' 
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${section.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                        <span>{section.enabled ? 'Active' : 'Disabled'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="bg-[#140E0B] p-6 rounded-xl border border-[#2A201B] space-y-5">
              <div className="flex items-center justify-between border-b border-[#2A201B] pb-4">
                <div>
                  <h2 className="text-lg font-serif text-[#F5E6D3]">Client Testimonials</h2>
                  <p className="text-xs text-[#8A7969] mt-0.5">Manage buyer quotes displayed in the homepage reviews section.</p>
                </div>
                <button
                  onClick={() => {
                    setTestimonials([
                      ...testimonials,
                      {
                        id: `t-${Date.now()}`,
                        quote: 'New verified customer quote...',
                        author: 'Customer Name',
                        location: 'Tripura',
                        rating: 5,
                        tag: 'Verified Buyer',
                      }
                    ]);
                  }}
                  className="px-3 py-1.5 rounded bg-[#1F1713] border border-[#C49A45]/40 text-[#D6B15D] text-xs font-bold hover:bg-[#C49A45]/20"
                >
                  + Add Testimonial
                </button>
              </div>

              <div className="space-y-4">
                {testimonials.map((item, idx) => (
                  <div key={item.id || idx} className="p-4 bg-[#1A120E] border border-[#2E221A] rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#C49A45]">Testimonial #{idx + 1}</span>
                      <button
                        onClick={() => setTestimonials(testimonials.filter((_, i) => i !== idx))}
                        className="text-rose-400 hover:text-rose-300 text-xs"
                      >
                        ✕ Remove
                      </button>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#A89887] mb-1">Quote</label>
                      <textarea
                        rows={2}
                        value={item.quote}
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[idx].quote = e.target.value;
                          setTestimonials(updated);
                        }}
                        className="w-full bg-[#140E0B] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#C49A45]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#A89887] mb-1">Author</label>
                        <input
                          type="text"
                          value={item.author}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[idx].author = e.target.value;
                            setTestimonials(updated);
                          }}
                          className="w-full bg-[#140E0B] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#C49A45]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#A89887] mb-1">Location</label>
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[idx].location = e.target.value;
                            setTestimonials(updated);
                          }}
                          className="w-full bg-[#140E0B] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#C49A45]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#A89887] mb-1">Buyer Tag</label>
                        <input
                          type="text"
                          value={item.tag}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[idx].tag = e.target.value;
                            setTestimonials(updated);
                          }}
                          className="w-full bg-[#140E0B] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#C49A45]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HERITAGE STATS */}
          {activeTab === 'stats' && (
            <div className="bg-[#140E0B] p-6 rounded-xl border border-[#2A201B] space-y-5">
              <div className="border-b border-[#2A201B] pb-4">
                <h2 className="text-lg font-serif text-[#F5E6D3]">Brand Heritage Statistics</h2>
                <p className="text-xs text-[#8A7969] mt-0.5">Manage the 4 prominent milestone counters on the homepage.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {brandStats.map((stat, idx) => (
                  <div key={idx} className="p-4 bg-[#1A120E] border border-[#2E221A] rounded-xl space-y-2">
                    <label className="block text-xs font-semibold text-[#C49A45]">Counter {idx + 1}</label>
                    <div className="flex gap-2">
                      <div className="w-1/3">
                        <label className="block text-[10px] text-[#8A7969] mb-1">Value</label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const updated = [...brandStats];
                            updated[idx].value = e.target.value;
                            setBrandStats(updated);
                          }}
                          className="w-full bg-[#140E0B] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2 rounded-lg font-mono font-bold focus:outline-none focus:border-[#C49A45]"
                        />
                      </div>
                      <div className="w-2/3">
                        <label className="block text-[10px] text-[#8A7969] mb-1">Label</label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const updated = [...brandStats];
                            updated[idx].label = e.target.value;
                            setBrandStats(updated);
                          }}
                          className="w-full bg-[#140E0B] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#C49A45]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SOCIALS & FOOTER */}
          {activeTab === 'social_footer' && (
            <div className="bg-[#140E0B] p-6 rounded-xl border border-[#2A201B] space-y-5">
              <div className="border-b border-[#2A201B] pb-4">
                <h2 className="text-lg font-serif text-[#F5E6D3]">Social Links &amp; Footer Contact</h2>
                <p className="text-xs text-[#8A7969] mt-0.5">Control global contact numbers, email, and social profiles.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#C49A45] mb-1.5">Instagram Handle</label>
                  <input
                    type="text"
                    value={socialFooter.instagramHandle}
                    onChange={(e) => setSocialFooter({ ...socialFooter, instagramHandle: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#C49A45] mb-1.5">Instagram Profile URL</label>
                  <input
                    type="text"
                    value={socialFooter.instagramUrl}
                    onChange={(e) => setSocialFooter({ ...socialFooter, instagramUrl: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-1.5">Contact Email</label>
                  <input
                    type="email"
                    value={socialFooter.contactEmail}
                    onChange={(e) => setSocialFooter({ ...socialFooter, contactEmail: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-1.5">Contact Phone</label>
                  <input
                    type="text"
                    value={socialFooter.contactPhone}
                    onChange={(e) => setSocialFooter({ ...socialFooter, contactPhone: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Bar */}
          <div className="p-4 bg-[#140E0B] border border-[#2A201B] rounded-xl flex items-center justify-between">
            <span className="text-xs text-[#8A7969]">Click Publish to make all modified homepage settings live immediately.</span>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#C49A45] to-[#8C6B28] text-[#120B08] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
            >
              {saving ? 'Publishing...' : 'Publish Homepage'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
