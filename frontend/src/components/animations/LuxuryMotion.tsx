"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';

/**
 * Editorial Masked Text Reveal
 * Words or lines slide up smoothly from a hidden clip-path mask.
 */
interface TextRevealProps {
  children?: React.ReactNode;
  text?: string;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export function TextReveal({
  children,
  text,
  delay = 0,
  duration = 0.9,
  className = "",
  as: Component = 'div',
}: TextRevealProps) {
  const content = text ?? children;
  return (
    <div className={`overflow-hidden inline-block ${className}`}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1], // Luxury cubic-bezier
        }}
      >
        {content}
      </motion.div>
    </div>
  );
}

/**
 * Stagger Container & Stagger Items
 * For coordinating fluid staggered card arrivals.
 */
export function StaggerContainer({
  children,
  staggerDelay,
  staggerTime,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  staggerTime?: number;
  delay?: number;
  className?: string;
}) {
  const effectiveStagger = staggerDelay ?? staggerTime ?? 0.08;
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: effectiveStagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  y = 30,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Magnetic Card with 3D Mouse Tilt & Specular Light Reflection
 * Inspired by haute joaillerie maisons.
 */
interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
  tiltIntensity?: number; // max tilt degrees (e.g. 6)
  tiltAmount?: number;
  glareOpacity?: number;
  onClick?: () => void;
}

export function MagneticCard({
  children,
  className = "",
  tiltIntensity,
  tiltAmount,
  glareOpacity = 0.18,
  onClick,
}: MagneticCardProps) {
  const effectiveTilt = tiltIntensity ?? tiltAmount ?? 6;
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 25 });
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -effectiveTilt;
    const rY = ((x - centerX) / centerX) * effectiveTilt;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: glareOpacity,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: 1000,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      {/* Dynamic Specular Gold Glare Overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-500 z-20"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(216, 175, 90, 0.45), transparent 70%)`,
        }}
      />
    </motion.div>
  );
}

/**
 * Floating Gold Sparkle / Glint
 * Delicate twinkle placed on jewelry details or buttons.
 */
export function SparkleGlint({
  children,
  className = "",
  size = 14,
  delay = 0,
  color = "#C49A45",
}: {
  children?: React.ReactNode;
  className?: string;
  size?: number;
  delay?: number;
  color?: string;
}) {
  if (children) {
    return (
      <motion.div
        className={`inline-flex items-center justify-center pointer-events-none ${className}`}
        initial={{ scale: 0.85, opacity: 0.7 }}
        animate={{
          scale: [0.85, 1.15, 0.85],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          repeatDelay: 1 + delay,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`pointer-events-none ${className}`}
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      animate={{
        scale: [0, 1.2, 0],
        rotate: [0, 90, 180],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 2.2,
        repeat: Infinity,
        repeatDelay: 3 + delay,
        ease: "easeInOut",
      }}
    >
      <path
        d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
        fill={color}
      />
    </motion.svg>
  );
}

/**
 * Editorial Expanding Gold Divider
 * Expands outward from center on scroll into view.
 */
export function ExpandingDivider({
  className = "",
  color = "#C49A45",
  maxWidth = "320px",
}: {
  className?: string;
  color?: string;
  maxWidth?: string;
}) {
  return (
    <div className={`w-full flex items-center justify-center my-6 overflow-hidden ${className}`}>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 0.5 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="h-[1px] w-full origin-center"
        style={{
          maxWidth,
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
        }}
      />
    </div>
  );
}

/**
 * Global Page Scroll Progress Bar (Golden hairline at top of viewport)
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C49A45] via-[#E8DDCC] to-[#A77C32] origin-left z-[999] pointer-events-none"
    />
  );
}

/**
 * Smooth Image Zoom Reveal on Scroll
 */
export function ImageReveal({
  src,
  alt,
  className = "",
  aspectRatio = "aspect-[4/5]",
}: {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}) {
  return (
    <div className={`overflow-hidden relative ${aspectRatio} ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1.15, opacity: 0.8 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
