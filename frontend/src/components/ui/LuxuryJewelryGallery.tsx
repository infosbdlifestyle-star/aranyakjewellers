"use client";

import React, { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export interface JewelryItem {
  id: string;
  title: string;
  category?: string;
  metal?: string;
  purity: string;
  imageUrl: string;
  description: string;
  tag?: string;
  productSlug?: string;
  price?: number;
  weight?: number;
}

interface LuxuryJewelryGalleryProps {
  items: JewelryItem[];
  aspectRatio?: '4/5' | '1/1';
  enableHoverZoom?: boolean;
}

/**
 * Senior UI/UX Luxury Jewelry Product Gallery Component
 * Features:
 * - Interactive Mouse-Lens Hover-to-Zoom (2.5x Magnification)
 * - Full-Screen Dark Lightbox Modal with 3x Ultra-Detail Zoom Toggle
 * - 4:5 / 1:1 Responsive Aspect Ratios & SEO Microdata
 * - Minimalist Dark Luxury Aesthetics (#050202, #CBA135)
 */
export function LuxuryJewelryGallery({
  items,
  aspectRatio = '4/5',
  enableHoverZoom = true,
}: LuxuryJewelryGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<JewelryItem | null>(null);
  const [isZoomedInModal, setIsZoomedInModal] = useState<boolean>(false);

  // Mouse hover zoom position state for grid items
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, itemId: string) => {
    if (!enableHoverZoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
    setHoveredItemId(itemId);
  };

  const handleMouseLeave = () => {
    setHoveredItemId(null);
  };

  return (
    <div className="w-full">
      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {items.map((item) => {
          const isHovered = hoveredItemId === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedItem(item)}
              onMouseMove={(e) => handleMouseMove(e, item.id)}
              onMouseLeave={handleMouseLeave}
              className="group relative bg-[#211813] border border-[#DED2C1]/20 hover:border-[#C49A45]/60 overflow-hidden cursor-pointer shadow-xl transition-all duration-500 rounded-xl"
            >
              {/* Responsive Container */}
              <div className={`relative ${aspectRatio === '1/1' ? 'aspect-square' : 'aspect-[4/5]'} w-full overflow-hidden bg-[#241B17]`}>
                
                {/* Standard Base Image */}
                <Image
                  src={item.imageUrl}
                  alt={`${item.title} - ${item.purity} Handcrafted Fine Jewellery by Aranyak Jewellers`}
                  fill
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className={`object-cover transition-transform duration-700 ease-out ${
                    isHovered ? 'scale-110 opacity-40' : 'scale-100 opacity-90 group-hover:opacity-100'
                  }`}
                />

                {/* Interactive Lens Magnifier on Hover */}
                {enableHoverZoom && isHovered && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
                    style={{
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                      backgroundSize: '250%',
                    }}
                  />
                )}

                {/* Ambient Dark Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#211713] via-transparent to-black/30 pointer-events-none" />

                {/* Top Gold Purity Seal */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-[#E7C880] bg-[#211813]/90 backdrop-blur-md border border-[#C49A45]/40 px-3 py-1 shadow-md rounded">
                    {item.purity}
                  </span>
                </div>

                {/* Hover Lens Indicator */}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="w-8 h-8 rounded-full bg-[#211813]/80 border border-[#DED2C1]/20 flex items-center justify-center text-xs text-[#E7C880]">
                    🔍
                  </span>
                </div>

                {/* Bottom Content Card */}
                <div className="absolute bottom-0 inset-x-0 p-6 z-20 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {item.tag && (
                    <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#E7C880] mb-1">
                      {item.tag}
                    </span>
                  )}
                  <h3 className="text-xl font-serif font-light text-[#FFF8EB] group-hover:text-[#E7C880] transition-colors mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  
                  {item.price ? (
                    <p className="text-sm font-bold text-[#E7C880] font-serif mb-2">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </p>
                  ) : null}

                  <div className="inline-flex items-center space-x-2 text-[9px] font-bold tracking-[0.25em] uppercase text-[#E5D7C5] group-hover:text-[#FFF8EB] transition-colors">
                    <span>Inspect Fine Detail</span>
                    <span className="text-[#E7C880]">→</span>
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Lightbox Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedItem(null);
              setIsZoomedInModal(false);
            }}
            className="fixed inset-0 z-[100] bg-[#211813]/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.94, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 15, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#211813] border border-[#C49A45]/50 max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl rounded-xl"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setIsZoomedInModal(false);
                }}
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-[#241B17] border border-[#DED2C1]/20 flex items-center justify-center text-[#FFF8EB] hover:text-[#E7C880] transition-colors shadow-lg"
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* Modal High-Res Zoomable Image Container */}
              <div 
                className="relative aspect-[4/5] md:aspect-auto w-full min-h-[400px] bg-[#241B17] overflow-hidden cursor-zoom-in"
                onClick={() => setIsZoomedInModal(!isZoomedInModal)}
              >
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-cover transition-transform duration-500 ease-out ${
                    isZoomedInModal ? 'scale-[2.5] cursor-zoom-out' : 'scale-100 hover:scale-105'
                  }`}
                />
                
                {/* Zoom Toggle Hint */}
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-[#211813]/85 text-[#FFF8EB] px-3 py-1.5 rounded border border-[#DED2C1]/20 backdrop-blur-md">
                    {isZoomedInModal ? '🔎 Click to Reset' : '🔍 Click to Zoom 2.5x'}
                  </span>
                </div>
              </div>

              {/* Modal Product Details */}
              <div className="p-8 sm:p-12 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="px-3 py-1 bg-[#C49A45]/15 border border-[#C49A45]/40 text-[#E7C880] text-[10px] font-bold tracking-[0.25em] uppercase rounded">
                      {selectedItem.purity}
                    </span>
                    {selectedItem.weight ? (
                      <span className="text-xs text-[#E5D7C5] font-serif">
                        Weight: {selectedItem.weight}g
                      </span>
                    ) : null}
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#FFF8EB] mb-4 leading-tight">
                    {selectedItem.title}
                  </h2>

                  {selectedItem.price ? (
                    <p className="text-2xl font-serif font-bold text-[#E7C880] mb-4">
                      ₹{Number(selectedItem.price).toLocaleString('en-IN')}
                    </p>
                  ) : null}

                  <p className="text-xs sm:text-sm text-[#E5D7C5] leading-relaxed font-light mb-6">
                    {selectedItem.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-4 pt-6 border-t border-[#DED2C1]/20">
                  <a
                    href={`https://wa.me/919436501506?text=${encodeURIComponent(
                      `Hello Aranyak Jewellers, I would like to inquire about: ${selectedItem.title} (${selectedItem.purity})`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-luxury py-4 text-center block text-[10px] font-bold tracking-[0.35em] uppercase"
                  >
                    Consult Boutique on WhatsApp
                  </a>

                  <button
                    onClick={() => setIsZoomedInModal(!isZoomedInModal)}
                    className="w-full py-3.5 text-center text-[10px] font-bold tracking-[0.3em] uppercase text-[#FFF8EB] bg-[#241B17] hover:bg-[#241B17]/80 border border-[#DED2C1]/20 transition-colors rounded"
                  >
                    {isZoomedInModal ? 'Reset View' : 'Inspect Craftsmanship & Texture'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
