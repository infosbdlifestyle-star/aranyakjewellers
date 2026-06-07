"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide loader after 2.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-[#050202] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
        >
          {/* Subtle Texture */}
          <div className="absolute inset-0 silk-texture opacity-30" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Draw-in logo effect (simulated with text clip mask) */}
            <motion.div
              className="overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl font-serif font-light text-secondary tracking-[0.2em] uppercase">
                Aranyak
              </h1>
            </motion.div>
            
            <motion.div
              className="w-[1px] h-12 bg-secondary/50 mt-8"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
