import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ]
  },
  // Optimize for Vercel deployment
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/category/astrological-stones',
        destination: '/collections',
        permanent: false,
      },
      {
        source: '/category/astrological-stones/:path*',
        destination: '/collections',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    const backend = process.env.BACKEND_URL || 'http://117.252.16.132:3001';
    return [
      {
        source: '/api/:path*',
        destination: `${backend}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backend}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
