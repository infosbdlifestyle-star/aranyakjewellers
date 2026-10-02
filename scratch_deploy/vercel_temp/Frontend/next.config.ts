import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Optimize for Vercel deployment
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://117.252.16.132:3001/api/:path*', // Proxy to VPS backend
      },
    ];
  },
};

export default nextConfig;
