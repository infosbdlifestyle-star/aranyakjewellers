"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only show the luxury splash loader once per session
    try {
      if (typeof window !== 'undefined') {
        const hasVisited = sessionStorage.getItem('aranyak_visited');
        if (hasVisited) return;
        setIsLoading(true);
        sessionStorage.setItem('aranyak_visited', 'true');
      }
    } catch {
      return;
    }

    // Quick, elegant 600ms intro without locking user interaction
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-[#211813] flex items-center justify-center overflow-hidden pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.77, 0, 0.175, 1] }}
        >
          {/* Subtle Texture */}
          <div className="absolute inset-0 silk-texture opacity-30" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Draw-in logo effect (simulated with text clip mask) */}
            <motion.div
              className="overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl font-serif font-light text-[#C49A45] tracking-[0.2em] uppercase">
                Aranyak
              </h1>
            </motion.div>
            
            <motion.div
              className="w-[1px] h-8 bg-[#C49A45]/50 mt-6"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
