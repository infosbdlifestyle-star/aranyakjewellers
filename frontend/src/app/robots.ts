import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/login', '/forgot-password', '/reset-password', '/api/'],
    },
    sitemap: 'https://aranyakjewellers.com/sitemap.xml',
  };
}
