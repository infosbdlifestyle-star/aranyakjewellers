import HomeClient from './HomeClient';
import { Metadata } from 'next';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Aranyak Jewellers | Timeless Elegance',
  description: 'Premium gold and diamond jewellery stores across Tripura in Agartala, Dharmanagar, Kailashahar, and Khowai.',
};

async function getSiteData() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const [settings, categories, banners, goldRates, stores, mediaMap] = await Promise.all([
      api.getSettings(),
      api.getCategories(),
      api.getBanners(),
      api.getGoldPrices(),
      api.getStores(),
      api.getMediaMap(),
    ]);
    clearTimeout(timeout);

    const storeCount = Array.isArray(stores) && stores.length >= 4 ? stores.length : 4;

    return { 
      settings: settings || {}, 
      categories: categories || [], 
      banners: banners || [], 
      goldRates: goldRates || [],
      storesCount: storeCount,
      mediaMap: mediaMap || {},
    };
  } catch {
    return { settings: {}, categories: [], banners: [], goldRates: [], storesCount: 4, mediaMap: {} };
  }
}

export default async function HomePage() {
  const data = await getSiteData();
  return <HomeClient {...data} />;
}
