import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Optimize for Vercel deployment
  poweredByHeader: false,
};

export default nextConfig;
