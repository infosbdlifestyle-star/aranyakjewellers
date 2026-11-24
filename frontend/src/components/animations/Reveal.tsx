"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  className?: string;
}

export const Reveal = ({ children, width = "100%", delay = 0, duration = 0.5, y = 20, x = 0, className = "" }: RevealProps) => {
  return (
    <div className={className} style={{ position: "relative", width, height: width === "100%" ? "100%" : undefined }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y, x },
          visible: { opacity: 1, y: 0, x: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration, delay, ease: "easeOut" }}
        viewport={{ once: true, margin: "0px", amount: 0.05 }}
        style={{ pointerEvents: "auto", width: width === "100%" ? "100%" : undefined, height: width === "100%" ? "100%" : undefined }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const FadeIn = ({ children, delay = 0, duration = 0.8 }: { children: React.ReactNode, delay?: number, duration?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, visibility: "hidden" }}
      animate={{ opacity: 1, visibility: "visible" }}
      transition={{ duration, delay, ease: "easeInOut" }}
      style={{ pointerEvents: "auto" }}
    >
      {children}
    </motion.div>
  );
};
