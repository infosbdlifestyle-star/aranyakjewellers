import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aranyakjewellers.com';
  
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/stores`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/gold-rate`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/category/gold`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/category/diamond`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/category/silver`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/category/astrological-stones`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('http://117.252.16.132:3001/api/categories', {
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (res.ok) {
      const data = await res.json();
      const categories = Array.isArray(data) ? data : (data.data || []);
      
      categories.forEach((cat: any) => {
        if (cat.slug) {
           dynamicPages.push({
             url: `${baseUrl}/category/${cat.slug}`,
             lastModified: new Date(),
             changeFrequency: 'weekly',
             priority: 0.8
           });
        }
      });
    }
  } catch (error) {
    console.error('Failed to fetch categories for sitemap:', error);
  }
  
  const existingUrls = new Set(staticPages.map(p => p.url));
  const newPages = dynamicPages.filter(p => !existingUrls.has(p.url));

  return [...staticPages, ...newPages];
}
