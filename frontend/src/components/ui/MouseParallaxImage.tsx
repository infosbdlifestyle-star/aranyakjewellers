"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useSpring, useTransform } from 'framer-motion';

interface MouseParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  intensity?: number;
}

export function MouseParallaxImage({ src, alt, className = "", intensity = 20 }: MouseParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      // Calculate distance from center (-1 to 1)
      const x = (e.clientX - centerX) / (width / 2);
      const y = (e.clientY - centerY) / (height / 2);
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const smoothX = useSpring(mousePosition.x * -intensity, { damping: 50, stiffness: 100 });
  const smoothY = useSpring(mousePosition.y * -intensity, { damping: 50, stiffness: 100 });

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div 
        className="absolute inset-[-10%]" // Add negative inset so the image doesn't cut off when moved
        style={{ x: smoothX, y: smoothY }}
      >
        <Image 
          src={src} 
          alt={alt} 
          fill 
          className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" 
        />
      </motion.div>
    </div>
  );
}
