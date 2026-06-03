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
}

export const Reveal = ({ children, width = "fit-content", delay = 0, duration = 0.5, y = 20, x = 0 }: RevealProps) => {
  return (
    <div style={{ position: "relative", width }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y, x, visibility: "hidden" as any },
          visible: { opacity: 1, y: 0, x: 0, visibility: "visible" as any },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration, delay, ease: "easeOut" }}
        viewport={{ once: true, margin: "-50px" }}
        style={{ pointerEvents: "auto" }}
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
