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
  SparkleGlint 
} from '@/components/animations/LuxuryMotion';
import { CategoryNavBar, CategoryNavItem } from './CategoryNavBar';
import { VaultImagePlaceholder } from '@/components/ui/VaultImagePlaceholder';

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
    heroImage: "/uploads/hero-banner.webp",
  },
  diamond: {
    title: "Certified Natural Diamonds",
    subtitle: "Precision-cut natural solitaires, red-carpet diamond necklaces, and wedding bands crafted with VVS-VS clarity.",
    badge: "VVS-VS Certified",
    hallmarkText: "IGI & GIA Certified Natural Diamonds • Conflict-Free Ethical Sourcing • 90% Buy-Back Value",
    purityBanner: "Certified Natural Diamonds in 18KT Hallmarked Gold",
    heroImage: "/uploads/cat_certified_diamonds.webp",
  },
  silver: {
    title: "92.5 Sterling Silver Fine Jewellery",
    subtitle: "Handcrafted Hasli chokers, oxidized tribal filigree bangles, payals, and auspicious silverware.",
    badge: "92.5 Sterling Silver",
    hallmarkText: "92.5 Hallmarked Sterling Silver • Premium Anti-Tarnish E-Coating • Hand-Engraved",
    purityBanner: "Official Silver Purity: 92.5% Pure Sterling Silver",
    heroImage: "/uploads/cat_antique_silver_heritage.webp",
  }
};

export default function CategoryShowcase({ categorySlug, initialSubCategorySlug }: CategoryShowcaseProps) {
  const normSlug = (categorySlug || 'gold').toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Normalized key
  const categoryKey = normSlug.includes('diamond') ? 'diamond' :
                      normSlug.includes('silver') ? 'silver' : 'gold';

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
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  const abortControllerRef = useRef<AbortController | null>(null);

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
            images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [],
            stockCount: p.stockCount ?? 1,
            sku: p.sku || `AR-${categoryKey.toUpperCase()}-001`,
            isActive: p.isActive ?? true,
            pricing: p.pricing || {
              finalPrice: p.pricing?.finalPrice || (p.goldWeight ? Math.round(p.goldWeight * 7200) : 45000)
            }
          }));

        // Merge live products with local baseline (preserve authentic images and prevent duplicate slugs)
        const combined = liveMatched.map(p => {
          if (!Array.isArray(p.images) || p.images.length === 0) {
            const fallback = localBaseline.find(b => b.slug === p.slug || b.sku === p.sku);
            if (fallback && Array.isArray(fallback.images) && fallback.images.length > 0) {
              return { ...p, images: fallback.images, isFeatured: true };
            }
          }
          return p;
        });

        const existingSlugs = new Set(combined.map(p => p.slug));

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
  }, [categoryKey]);

  useEffect(() => {
    loadCategoryData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadCategoryData]);

  // Helper function to match product subcategory cleanly without substring overlap
  const matchSubcategory = useCallback((p: ProductItem, targetSlug: string) => {
    if (!targetSlug || targetSlug === 'all') return true;
    const targetNorm = targetSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
    const pSubNorm = (p.subCategorySlug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const pCatNorm = (p.subCategory || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    if (pSubNorm === targetNorm || pCatNorm === targetNorm) return true;

    const targetSingular = targetNorm.replace(/s$/, '');
    const pSubSingular = pSubNorm.replace(/s$/, '');
    const pCatSingular = pCatNorm.replace(/s$/, '');

    return pSubSingular === targetSingular || pCatSingular === targetSingular;
  }, []);

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

  // Unified Category Navigation Items with dynamic, accurate product counts
  const navItems = useMemo<CategoryNavItem[]>(() => {
    return [
      { id: 'all', name: 'All Masterpieces', count: products.length },
      ...subCategories.map((sub) => {
        const matchingCount = products.filter(p => matchSubcategory(p, sub.slug)).length;
        return {
          id: sub.slug,
          name: sub.name,
          count: matchingCount,
        };
      }),
    ];
  }, [products, subCategories, matchSubcategory]);

  const sortOptions = useMemo(() => [
    { value: 'featured', label: 'Featured First' },
    { value: 'weight-desc', label: 'Gold Weight: Highest' },
    { value: 'name', label: 'Alphabetical' },
  ], []);

  // Filtered and Sorted Products
  const displayedProducts = useMemo(() => {
    let result = products;

    if (selectedSubCategory !== 'all') {
      result = result.filter(p => matchSubcategory(p, selectedSubCategory));
    }

    return [...result].sort((a, b) => {
      // Authentic photographed masterpieces always display first
      const aHasImg = Array.isArray(a.images) && a.images.length > 0 ? 1 : 0;
      const bHasImg = Array.isArray(b.images) && b.images.length > 0 ? 1 : 0;
      if (aHasImg !== bHasImg) return bHasImg - aHasImg;

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

  const handleOpenProductModal = (product: ProductItem) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#76551C] selection:bg-[#C49A45] selection:text-[#211813]">
      
      {/* 1. Luxury Editorial Hero Banner */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 text-left overflow-hidden bg-[#211813] border-b border-[#DED2C1]/15">
        <div 
          className="absolute inset-0 bg-cover bg-center md:bg-right opacity-85 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${meta.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#211813] via-[#211813]/75 via-45% to-[#211813]/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#211813] via-transparent to-transparent pointer-events-none" />

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

      {/* 2. Compact, Properly Aligned Category Navigation Bar */}
      <CategoryNavBar
        items={navItems}
        activeId={selectedSubCategory}
        onSelect={(id) => {
          setSelectedSubCategory(id);
          const el = document.getElementById('collection-grid-section');
          if (el) {
            const yOffset = -90;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }}
        sortOptions={sortOptions}
        sortBy={sortBy}
        onSortChange={(val) => setSortBy(val as any)}
        layoutId="activeSubCategoryPill"
      />

      {/* 3. Main Content Area */}
      <section id="collection-grid-section" className="pt-8 pb-16 md:pt-10 md:pb-24 flex-1">
        <div className="container mx-auto px-6 max-w-7xl">

          {/* Item count status bar */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#DED2C1]">
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

          {/* Lifecycle State 4: Successful Data Display (Product Grid - 100% Reliable & Visible) */}
          {!loading && displayedProducts.length > 0 && (
            <div 
              id="product-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
            >
              {displayedProducts.map((p, idx) => {
                const hasImageError = imageErrorMap[p.id];
                const rawImage = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null;
                const showPlaceholder = !rawImage || hasImageError;

                return (
                  <div
                    key={p.id}
                    className="relative bg-[#FFFDF8] border border-[#DED2C1] hover:border-[#98712E] transition-all duration-300 hover:-translate-y-1 rounded-2xl p-4 shadow-sm hover:shadow-xl flex flex-col justify-between h-full group"
                  >
                    {/* Card Image Area */}
                    <div 
                      onClick={() => handleOpenProductModal(p)}
                      className="relative aspect-[4/5] bg-[#211813] rounded-xl overflow-hidden cursor-pointer"
                    >
                      {showPlaceholder ? (
                        <VaultImagePlaceholder
                          name={p.name}
                          category={p.category}
                          subCategory={p.subCategory}
                          goldPurity={p.goldPurity}
                          diamondCarat={p.diamondCarat}
                          diamondClarity={p.diamondClarity}
                        />
                      ) : (
                        <>
                          <Image
                            src={rawImage!}
                            alt={`${p.name} - Handcrafted Fine Jewellery | Aranyak Jewellers`}
                            fill
                            priority={idx < 4}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            onError={() => handleImageError(p.id)}
                            className="object-cover group-hover:scale-108 transition-transform duration-700"
                          />

                          {/* Warm vignette */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#211813]/80 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                          {/* Purity & Metal Badge */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                            <span className="px-2.5 py-1 bg-[#211813]/90 backdrop-blur-md border border-[#DED2C1]/20 rounded-full text-[10px] font-bold text-[#D6B15D] tracking-wider uppercase shadow">
                              {p.goldPurity === 925 ? '92.5 Silver' : `${p.goldPurity}KT Hallmarked`}
                            </span>
                            {p.diamondCarat && (
                              <span className="px-2.5 py-1 bg-[#211813]/90 backdrop-blur-md border border-[#DED2C1]/20 rounded-full text-[10px] font-bold text-[#E0BD72] tracking-wider uppercase shadow">
                                {p.diamondCarat} ct {p.diamondClarity || 'Diamond'}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Card Details */}
                    <div className="pt-4 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-[#40352F] tracking-widest uppercase mb-1">
                          <span>{p.subCategory || meta.badge}</span>
                          {p.goldWeight ? (
                            <span>{p.goldWeight}g Net Wt</span>
                          ) : null}
                        </div>

                        <h3 
                          onClick={() => handleOpenProductModal(p)}
                          className="font-serif text-lg text-[#211813] font-medium group-hover:text-[#8A5A12] transition-colors line-clamp-1 cursor-pointer"
                        >
                          {p.name}
                        </h3>
                      </div>

                      {/* Price on Request & Action */}
                      <div className="pt-4 mt-2 border-t border-[#DED2C1]/60 flex items-center justify-between">
                        <div>
                          <span className="font-serif text-xs sm:text-[13px] font-bold text-[#8A5A12] tracking-wider uppercase">
                            Price on Request
                          </span>
                        </div>

                        <button
                          onClick={() => handleOpenProductModal(p)}
                          className="px-4 py-2 bg-[#211813] text-[#FFF8EC] text-xs font-bold tracking-wider uppercase rounded-lg hover:bg-[#8A5A12] transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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

              {/* Modal Image Area */}
              <div className="w-full md:w-1/2 flex flex-col bg-[#1A120E] border-b md:border-b-0 md:border-r border-[#C49A45]/20">
                <div className="relative aspect-square w-full bg-[#211813] overflow-hidden">
                  {(!selectedProduct.images?.[selectedImageIndex] || imageErrorMap[`${selectedProduct.id}-${selectedImageIndex}`]) ? (
                    <VaultImagePlaceholder
                      name={selectedProduct.name}
                      category={selectedProduct.category}
                      subCategory={selectedProduct.subCategory}
                      goldPurity={selectedProduct.goldPurity}
                      diamondCarat={selectedProduct.diamondCarat}
                      diamondClarity={selectedProduct.diamondClarity}
                    />
                  ) : (
                    <Image
                      src={selectedProduct.images[selectedImageIndex] || selectedProduct.images[0]}
                      alt={`${selectedProduct.name} - Angle ${selectedImageIndex + 1} | Aranyak Jewellers`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={() => setImageErrorMap(prev => ({ ...prev, [`${selectedProduct.id}-${selectedImageIndex}`]: true }))}
                      className="object-cover"
                      priority
                    />
                  )}
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="absolute top-3 left-3 bg-[#211813]/90 backdrop-blur-md px-2.5 py-1 rounded border border-[#C49A45]/40 text-[9px] font-mono tracking-widest text-[#E0BD72]">
                      VIEW {selectedImageIndex + 1} OF {selectedProduct.images.length}
                    </div>
                  )}
                </div>

                {/* Multi-angle Thumbnails strip */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="p-3 bg-[#140C08] flex items-center justify-center gap-2 overflow-x-auto border-t border-[#C49A45]/15">
                    {selectedProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                          selectedImageIndex === idx
                            ? 'border-[#E0BD72] scale-105 shadow-md shadow-[#C49A45]/30'
                            : 'border-[#DED2C1]/30 opacity-60 hover:opacity-100 hover:border-[#D6B15D]'
                        }`}
                        aria-label={`View angle ${idx + 1}`}
                      >
                        <Image
                          src={img}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
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
                    href={`https://wa.me/919436501506?text=${encodeURIComponent(`Hello Aranyak Jewellers, I would like to request the price and inquire about ${selectedProduct.name} (SKU: ${selectedProduct.sku}). Please share pricing and showroom availability.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-luxury py-3.5 text-xs font-bold tracking-[0.25em] uppercase text-center block shadow-lg flex items-center justify-center gap-2"
                  >
                    Request Price via WhatsApp
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
