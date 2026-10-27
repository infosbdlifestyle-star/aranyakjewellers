"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { 
  ProductItem, 
  VERIFIED_PRODUCTS, 
  getCatalogueProducts, 
  getCatalogueSubcategories 
} from '@/data/catalogue';
import { 
  TextReveal, 
  MagneticCard, 
  SparkleGlint, 
  StaggerContainer, 
  StaggerItem 
} from '@/components/animations/LuxuryMotion';

interface CategoryShowcaseProps {
  categorySlug: string;
  initialSubCategorySlug?: string;
}

interface CategoryMeta {
  title: string;
  subtitle: string;
  badge: string;
  hallmarkText: string;
  purityBanner: string;
  heroImage: string;
}

const CATEGORY_METAS: Record<string, CategoryMeta> = {
  gold: {
    title: "22K BIS Hallmarked Gold",
    subtitle: "Timeless Bengali goldsmithing, royal bridal trousseaus, and heirloom jewelry sculpted in pure 22 Karat gold.",
    badge: "22KT BIS 916",
    hallmarkText: "100% BIS Hallmarked • Unique HUID Laser Certified • 100% Lifetime Exchange Guarantee",
    purityBanner: "Official Gold Purity: 91.6% Pure Gold (22K)",
    heroImage: "/hero-necklace.png",
  },
  diamond: {
    title: "Certified Natural Diamonds",
    subtitle: "Precision-cut natural solitaires, red-carpet diamond necklaces, and wedding bands crafted with VVS-VS clarity.",
    badge: "VVS-VS Certified",
    hallmarkText: "IGI & GIA Certified Natural Diamonds • Conflict-Free Ethical Sourcing • 90% Buy-Back Value",
    purityBanner: "Certified Natural Diamonds in 18KT Hallmarked Gold",
    heroImage: "/diamond_solitaire_ring.jpg",
  },
  silver: {
    title: "92.5 Sterling Silver Fine Jewellery",
    subtitle: "Handcrafted Hasli chokers, oxidized tribal filigree bangles, payals, and auspicious silverware.",
    badge: "92.5 Sterling Silver",
    hallmarkText: "92.5 Hallmarked Sterling Silver • Premium Anti-Tarnish E-Coating • Hand-Engraved",
    purityBanner: "Official Silver Purity: 92.5% Pure Sterling Silver",
    heroImage: "/silver_luxury_necklace.jpg",
  },
  "astrological-stones": {
    title: "Astrological Gemstones",
    subtitle: "Unheated, untreated natural astrological gemstones certified by recognized gemological institutes.",
    badge: "Certified Gemstones",
    hallmarkText: "100% Natural & Untreated • Certified by Govt Recognized Gemological Labs",
    purityBanner: "Planetary Gemstones with Certificate of Authenticity",
    heroImage: "/stone_sapphire_nila.jpg",
  }
};

export default function CategoryShowcase({ categorySlug, initialSubCategorySlug }: CategoryShowcaseProps) {
  const normSlug = (categorySlug || 'gold').toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Normalized key
  const categoryKey = normSlug.includes('diamond') ? 'diamond' :
                      normSlug.includes('silver') ? 'silver' :
                      normSlug.includes('stone') ? 'astrological-stones' : 'gold';

  const meta = CATEGORY_METAS[categoryKey] || {
    title: `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Collection`,
    subtitle: "Discover exquisite handcrafted jewellery by the master artisans at Aranyak Jewellers.",
    badge: "Aranyak Masterpieces",
    hallmarkText: "100% Certified Authentic Jewellery • Aranyak Trust Since 1995",
    purityBanner: "Handcrafted Luxury Jewellery",
    heroImage: "/hero-banner.png",
  };

  // State Management
  const [products, setProducts] = useState<ProductItem[]>(() => getCatalogueProducts(categoryKey));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(initialSubCategorySlug || 'all');
  const [sortBy, setSortBy] = useState<'featured' | 'weight-desc' | 'name'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  const abortControllerRef = useRef<AbortController | null>(null);

  // Fallback image helper
  const getFallbackImage = useCallback((category: string) => {
    const c = category.toLowerCase();
    if (c.includes('diamond')) return '/diamond_solitaire_ring.jpg';
    if (c.includes('silver')) return '/silver_luxury_necklace.jpg';
    if (c.includes('stone')) return '/stone_sapphire_nila.jpg';
    return '/hero-necklace.png';
  }, []);

  // Fetch function with robust fallback and lifecycle management
  const loadCategoryData = useCallback(async () => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (products.length === 0) setLoading(true);
    setError(null);

    // Initial local baseline products for zero-wait display
    const localBaseline = getCatalogueProducts(categoryKey);

    try {
      // 5-second hard timeout for live backend call
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const liveProducts = await api.getProducts();
      clearTimeout(timeoutId);

      if (Array.isArray(liveProducts) && liveProducts.length > 0) {
        // Filter live products matching this category
        const liveMatched: ProductItem[] = liveProducts
          .filter((p: any) => {
            const pCat = (p.category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            return pCat.includes(categoryKey) || categoryKey.includes(pCat);
          })
          .map((p: any) => ({
            id: p.id || `live-${p.slug}`,
            name: p.name,
            slug: p.slug,
            description: p.description || 'Masterpiece jewellery created with legacy craftsmanship.',
            category: p.category || (categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)),
            subCategory: p.subCategory || 'Signature',
            categorySlug: categoryKey as any,
            subCategorySlug: (p.subCategory || 'signature').toLowerCase().replace(/[^a-z0-9]/g, '-'),
            goldPurity: p.goldPurity || (categoryKey === 'diamond' ? 18 : categoryKey === 'silver' ? 925 : 22),
            goldWeight: p.goldWeight || 0,
            diamondClarity: p.diamondClarity,
            diamondCarat: p.diamondCarat,
            tags: Array.isArray(p.tags) ? p.tags : ['Bespoke'],
            images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [getFallbackImage(categoryKey)],
            stockCount: p.stockCount ?? 1,
            sku: p.sku || `AR-${categoryKey.toUpperCase()}-001`,
            isActive: p.isActive ?? true,
            pricing: p.pricing || {
              finalPrice: p.pricing?.finalPrice || (p.goldWeight ? Math.round(p.goldWeight * 7200) : 45000)
            }
          }));

        // Merge live products with local baseline (prevent duplicate slugs)
        const combined = [...liveMatched];
        const existingSlugs = new Set(liveMatched.map(p => p.slug));

        for (const item of localBaseline) {
          if (!existingSlugs.has(item.slug)) {
            combined.push(item);
            existingSlugs.add(item.slug);
          }
        }

        setProducts(combined);
      } else {
        // Fallback to verified catalogue
        setProducts(localBaseline);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Request was aborted (user navigated or timeout).
        // Fall back gracefully to verified catalogue.
        setProducts(localBaseline);
      } else {
        console.warn('API error fetching category products, using verified catalogue fallback:', err);
        setProducts(localBaseline);
      }
    } finally {
      setLoading(false);
    }
  }, [categoryKey, getFallbackImage]);

  useEffect(() => {
    loadCategoryData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadCategoryData]);

  // Subcategories derived from products and static catalogue
  const subCategories = useMemo(() => {
    const list = getCatalogueSubcategories(categoryKey);
    // Also include any extra subcategories found in dynamic products
    const existing = new Set(list.map(s => s.slug));
    for (const p of products) {
      if (p.subCategorySlug && !existing.has(p.subCategorySlug)) {
        list.push({
          name: p.subCategory,
          slug: p.subCategorySlug,
          count: 1
        });
        existing.add(p.subCategorySlug);
      }
    }
    return list;
  }, [categoryKey, products]);

  // Filtered and Sorted Products
  const displayedProducts = useMemo(() => {
    let result = products;

    if (selectedSubCategory !== 'all') {
      const targetNorm = selectedSubCategory.toLowerCase().replace(/[^a-z0-9]/g, '');
      result = result.filter(p => {
        const pSubNorm = (p.subCategorySlug || p.subCategory || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return pSubNorm === targetNorm || pSubNorm.includes(targetNorm) || targetNorm.includes(pSubNorm);
      });
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'weight-desc') {
        return (b.goldWeight || 0) - (a.goldWeight || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // 'featured'
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedSubCategory, sortBy]);

  const handleImageError = (productId: string) => {
    setImageErrorMap(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#76551C] selection:bg-[#C49A45] selection:text-[#211813]">
      
      {/* 1. Luxury Editorial Hero Banner */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 text-left overflow-hidden bg-[#211813] border-b border-[#DED2C1]/15">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${meta.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#211813]/95 via-[#211813]/85 to-[#211813] pointer-events-none" />

        <div className="relative z-10 container mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-[0.25em] text-[#E5D9C8] mb-6">
            <Link href="/" className="hover:text-[#E0BD72] transition-colors">Home</Link>
            <span className="text-[#D6B15D]">/</span>
            <Link href="/collections" className="hover:text-[#E0BD72] transition-colors">Collections</Link>
            <span className="text-[#D6B15D]">/</span>
            <span className="text-[#E0BD72]">{meta.badge}</span>
          </nav>

          {/* Luxury Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#211813] border border-[#C49A45]/40 mb-4 shadow-sm">
            <SparkleGlint color="#E7C880" size={12}>
              <span className="text-[#E0BD72]">✧</span>
            </SparkleGlint>
            <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#E0BD72]">
              {meta.purityBanner}
            </p>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-light mb-6 tracking-tight text-[#FFF8EC]">
            <TextReveal text={meta.title} />
          </h1>

          <p className="text-xs sm:text-sm text-[#E5D9C8] font-normal tracking-wide max-w-2xl leading-relaxed">
            {meta.subtitle}
          </p>

          {/* Hallmark Strip */}
          <div className="mt-8 pt-6 border-t border-[#DED2C1]/15 flex items-center gap-3 text-[11px] text-[#E0BD72] font-semibold tracking-wider">
            <span>✦</span>
            <span>{meta.hallmarkText}</span>
          </div>
        </div>
      </section>

      {/* 2. Subcategory Filter Pills Bar */}
      <section className="sticky top-20 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#DED2C1] py-4 px-6 shadow-sm">
        <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4">
          
          {/* Subcategory Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`relative px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shrink-0 ${
                selectedSubCategory === 'all'
                  ? 'text-[#FFF8EC]'
                  : 'text-[#211813] hover:text-[#8A5A12] bg-[#FFFDF8] border border-[#DED2C1] hover:border-[#8A5A12]'
              }`}
            >
              {selectedSubCategory === 'all' && (
                <motion.div
                  layoutId="activeSubCategoryPill"
                  className="absolute inset-0 bg-[#211813] rounded-full -z-10 shadow-sm border border-[#98712E]/50"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span>All Masterpieces ({products.length})</span>
            </button>

            {subCategories.map((sub) => {
              const isActive = selectedSubCategory === sub.slug;
              return (
                <button
                  key={sub.slug}
                  onClick={() => setSelectedSubCategory(sub.slug)}
                  className={`relative px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shrink-0 ${
                    isActive
                      ? 'text-[#FFF8EC]'
                      : 'text-[#211813] hover:text-[#8A5A12] bg-[#FFFDF8] border border-[#DED2C1] hover:border-[#8A5A12]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSubCategoryPill"
                      className="absolute inset-0 bg-[#211813] rounded-full -z-10 shadow-sm border border-[#98712E]/50"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="hidden sm:flex items-center space-x-3 shrink-0">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#76551C]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-[#FFFDF8] border border-[#DED2C1] rounded-lg px-3 py-1.5 text-[#211813] focus:outline-none focus:border-[#8A5A12] cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="weight-desc">Gold Weight: Highest</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

        </div>
      </section>

      {/* 3. Main Content Area */}
      <section className="py-16 md:py-24 flex-1">
        <div className="container mx-auto px-6 max-w-7xl">

          {/* Item count status bar */}
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#DED2C1]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#211813]">
              Showing <span className="text-[#8A5A12] font-extrabold">{displayedProducts.length}</span> {meta.badge} Pieces
            </p>
            {selectedSubCategory !== 'all' && (
              <button 
                onClick={() => setSelectedSubCategory('all')}
                className="text-xs text-[#8A5A12] hover:text-[#70440C] font-bold tracking-wider uppercase underline"
              >
                Clear Filter ✕
              </button>
            )}
          </div>

          {/* Lifecycle State 1: Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-[#FFFDF8] border border-[#DED2C1] rounded-2xl p-4 shadow-sm animate-pulse space-y-4">
                  <div className="aspect-[4/5] bg-[#E8DDCC]/70 rounded-xl w-full" />
                  <div className="space-y-2 pt-2">
                    <div className="h-3 bg-[#E8DDCC] rounded w-1/3" />
                    <div className="h-5 bg-[#E8DDCC] rounded w-3/4" />
                    <div className="h-3 bg-[#E8DDCC]/60 rounded w-1/2" />
                  </div>
                  <div className="h-8 bg-[#E8DDCC]/40 rounded w-full pt-2" />
                </div>
              ))}
            </div>
          )}

          {/* Lifecycle State 2: Error with Retry */}
          {!loading && error && (
            <div className="max-w-xl mx-auto my-12 p-8 text-center bg-[#FFFDF8] border border-[#98712E]/30 rounded-2xl shadow-lg space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#211813] text-[#E0BD72] flex items-center justify-center text-xl">
                !
              </div>
              <h3 className="text-xl font-serif text-[#211813]">Unable to Synchronize Collection</h3>
              <p className="text-xs text-[#40352F] leading-relaxed">
                {error}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={loadCategoryData}
                  className="btn-luxury px-6 py-2.5 text-xs font-bold tracking-widest uppercase shadow"
                >
                  Retry Request
                </button>
              </div>
            </div>
          )}

          {/* Lifecycle State 3: Genuinely Empty State */}
          {!loading && !error && displayedProducts.length === 0 && (
            <div className="text-center py-24 space-y-6 max-w-lg mx-auto">
              <SparkleGlint color="#C49A45" size={24}>
                <div className="text-4xl text-[#D6B15D] font-serif">✧</div>
              </SparkleGlint>
              <h2 className="text-3xl font-serif font-light text-[#211813]">
                No Pieces Currently in this Chapter
              </h2>
              <p className="text-xs text-[#40352F] leading-relaxed">
                Our master artisans are currently crafting new additions for this specific section. Explore our full {meta.title} or commission a bespoke custom creation.
              </p>
              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={() => setSelectedSubCategory('all')}
                  className="btn-luxury px-8 py-3 text-xs font-bold tracking-widest uppercase shadow-md"
                >
                  View All {meta.badge} Pieces
                </button>
                <Link
                  href="/contact"
                  className="px-8 py-3 text-xs font-bold tracking-widest uppercase text-[#FFF8EC] bg-[#211813] border border-[#C49A45]/40 rounded shadow"
                >
                  Bespoke Commission
                </Link>
              </div>
            </div>
          )}

          {/* Lifecycle State 4: Successful Data Display (Product Grid) */}
          {!loading && displayedProducts.length > 0 && (
            <StaggerContainer delay={0.05} staggerDelay={0.06}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {displayedProducts.map((p) => {
                  const hasImageError = imageErrorMap[p.id];
                  const displayImage = hasImageError 
                    ? getFallbackImage(p.category)
                    : (p.images?.[0] || getFallbackImage(p.category));

                  return (
                    <StaggerItem key={p.id}>
                      <MagneticCard tiltIntensity={5} className="h-full">
                        <div 
                          className="bg-[#FFFDF8] border border-[#DED2C1] hover:border-[#98712E] transition-all duration-500 rounded-2xl p-4 shadow-sm hover:shadow-xl flex flex-col justify-between h-full group"
                        >
                          {/* Card Image Area */}
                          <div 
                            onClick={() => setSelectedProduct(p)}
                            className="relative aspect-[4/5] bg-[#211813] rounded-xl overflow-hidden cursor-pointer"
                          >
                            <Image
                              src={displayImage}
                              alt={`${p.name} - Handcrafted Fine Jewellery | Aranyak Jewellers`}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              onError={() => handleImageError(p.id)}
                              className="object-cover group-hover:scale-108 transition-transform duration-700"
                            />

                            {/* Warm vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#211813]/80 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                            {/* Purity & Metal Badge */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1">
                              <span className="px-2.5 py-1 bg-[#211813]/90 backdrop-blur-md border border-[#C49A45]/50 text-[#D6B15D] text-[9px] font-bold tracking-widest uppercase rounded">
                                {p.categorySlug === 'silver' ? '92.5 Silver' : p.goldPurity ? `${p.goldPurity}KT Hallmarked` : meta.badge}
                              </span>
                              {p.diamondCarat && (
                                <span className="px-2.5 py-0.5 bg-[#FFFFFF]/90 backdrop-blur-md text-[#211813] text-[9px] font-bold tracking-wider rounded">
                                  {p.diamondCarat} ct {p.diamondClarity || 'Diamond'}
                                </span>
                              )}
                            </div>

                            {/* Inspect Detail Hover Pill */}
                            <div className="absolute bottom-3 right-3 bg-[#211813]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C49A45]/40 text-[9px] uppercase tracking-widest font-bold text-[#D6B15D] opacity-0 group-hover:opacity-100 transition-all duration-300">
                              🔍 Inspect Piece
                            </div>
                          </div>

                          {/* Card Content Area */}
                          <div className="pt-4 space-y-2 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between text-[10px] text-[#8A5A12] font-bold tracking-widest uppercase mb-1">
                                <span>{p.subCategory}</span>
                                {p.goldWeight > 0 && (
                                  <span>{p.goldWeight}g Net Wt</span>
                                )}
                              </div>

                              <h3 
                                onClick={() => setSelectedProduct(p)}
                                className="text-base font-serif font-medium text-[#211813] group-hover:text-[#8A5A12] transition-colors cursor-pointer line-clamp-1"
                              >
                                {p.name}
                              </h3>

                              <p className="text-xs text-[#40352F] line-clamp-2 mt-1 font-normal leading-relaxed">
                                {p.description}
                              </p>
                            </div>

                            {/* Inquiry Action Row */}
                            <div className="pt-3 border-t border-[#DED2C1]/60 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C49A45] animate-pulse" />
                                <span className="text-[10px] text-[#70440C] uppercase tracking-[0.2em] font-semibold">
                                  Price on Request
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <a
                                  href={`https://wa.me/919436501506?text=${encodeURIComponent(`Hello Aranyak Jewellers, I would like to inquire about ${p.name} (SKU: ${p.sku}). Please share availability and details.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full bg-[#211813] hover:bg-[#8A5A12] text-[#E0BD72] hover:text-[#FFF8EC] flex items-center justify-center border border-[#C49A45]/40 transition-colors"
                                  title="Inquire on WhatsApp"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                  </svg>
                                </a>

                                <button
                                  onClick={() => setSelectedProduct(p)}
                                  className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase bg-[#F0E7D8] hover:bg-[#211813] text-[#76551C] hover:text-[#FFF8EC] rounded border border-[#DED2C1] transition-all"
                                >
                                  Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MagneticCard>
                    </StaggerItem>
                  );
                })}
              </div>
            </StaggerContainer>
          )}

        </div>
      </section>

      {/* 4. Interactive Detail Modal (Lightbox) */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-[#211813]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-[#211813] border border-[#C49A45]/40 max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#211813] border border-[#DED2C1]/20 text-[#FFF8EC] flex items-center justify-center text-lg hover:border-[#C49A45] hover:text-[#D6B15D] transition-colors"
                aria-label="Close dialog"
              >
                ✕
              </button>

              {/* Modal Image */}
              <div className="w-full md:w-1/2 aspect-square relative bg-[#211813]">
                <Image
                  src={imageErrorMap[selectedProduct.id] ? getFallbackImage(selectedProduct.category) : (selectedProduct.images?.[0] || getFallbackImage(selectedProduct.category))}
                  alt={`${selectedProduct.name} - Handcrafted Fine Jewellery | Aranyak Jewellers`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Modal Details */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#E0BD72] font-bold">
                      {selectedProduct.category} • {selectedProduct.subCategory}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#FFF8EC] mb-3">
                    {selectedProduct.name}
                  </h2>

                  <p className="text-xs text-[#E5D9C8] font-light leading-relaxed mb-6">
                    {selectedProduct.description}
                  </p>

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-2 gap-4 border-t border-[#DED2C1]/20 pt-4 text-xs">
                    <div>
                      <span className="text-[#E5D9C8]/70 uppercase tracking-widest block text-[9px]">Purity Standard</span>
                      <span className="text-[#FFF8EC] font-serif font-medium">
                        {selectedProduct.categorySlug === 'silver' ? '92.5 Sterling Silver' : selectedProduct.goldPurity ? `${selectedProduct.goldPurity}KT BIS Hallmarked` : 'Certified Purity'}
                      </span>
                    </div>

                    {selectedProduct.goldWeight > 0 && (
                      <div>
                        <span className="text-[#E5D9C8]/70 uppercase tracking-widest block text-[9px]">Net Weight</span>
                        <span className="text-[#FFF8EC] font-serif font-medium">{selectedProduct.goldWeight} grams</span>
                      </div>
                    )}

                    {selectedProduct.diamondCarat && (
                      <div>
                        <span className="text-[#E5D9C8]/70 uppercase tracking-widest block text-[9px]">Diamond Specs</span>
                        <span className="text-[#FFF8EC] font-serif font-medium">{selectedProduct.diamondCarat} ct ({selectedProduct.diamondClarity || 'Certified'})</span>
                      </div>
                    )}

                    <div>
                      <span className="text-[#E5D9C8]/70 uppercase tracking-widest block text-[9px]">SKU Identifier</span>
                      <span className="text-[#FFF8EC] font-mono text-[11px]">{selectedProduct.sku}</span>
                    </div>

                    <div>
                      <span className="text-[#E5D9C8]/70 uppercase tracking-widest block text-[9px]">Showroom Status</span>
                      <span className="text-emerald-400 font-serif">In Stock & Verified</span>
                    </div>

                    <div>
                      <span className="text-[#E5D9C8]/70 uppercase tracking-widest block text-[9px]">Pricing</span>
                      <span className="text-[#E0BD72] font-serif font-bold text-xs tracking-wider uppercase">
                        Price On Request
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t border-[#DED2C1]/20">
                  <a
                    href={`https://wa.me/919436501506?text=${encodeURIComponent(`Hello Aranyak Jewellers, I would like to reserve/inquire about ${selectedProduct.name} (SKU: ${selectedProduct.sku}). Please assist with viewing at my nearest showroom.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-luxury py-3.5 text-xs font-bold tracking-[0.25em] uppercase text-center block shadow-lg"
                  >
                    Reserve / Inquire via WhatsApp
                  </a>

                  <div className="flex gap-2">
                    <Link
                      href="/stores"
                      className="flex-1 py-3 border border-[#DED2C1]/30 text-[#FFF8EC] bg-[#211813] text-[10px] font-bold tracking-[0.2em] uppercase hover:border-[#C49A45] text-center transition-colors rounded"
                    >
                      Locate Showrooms
                    </Link>
                    <Link
                      href="/contact"
                      className="flex-1 py-3 border border-[#DED2C1]/30 text-[#FFF8EC] bg-[#211813] text-[10px] font-bold tracking-[0.2em] uppercase hover:border-[#C49A45] text-center transition-colors rounded"
                    >
                      Book Consultation
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
