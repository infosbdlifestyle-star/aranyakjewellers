import HomeClient from './HomeClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aranyak Jewellers | Timeless Elegance',
  description: 'Premium gold and diamond jewellery stores across Tripura.',
};

async function getSiteData() {
  const backendUrl = process.env.NODE_ENV === 'production' 
    ? 'http://117.252.16.132:3001/api' 
    : 'http://localhost:3001/api';
    
  try {
    const [settingsRes, categoriesRes, bannersRes, goldRes] = await Promise.all([
      fetch(`${backendUrl}/settings`, { next: { revalidate: 60 } }),
      fetch(`${backendUrl}/categories`, { next: { revalidate: 60 } }),
      fetch(`${backendUrl}/banners`, { next: { revalidate: 60 } }),
      fetch(`${backendUrl}/gold-price`, { next: { revalidate: 60 } })
    ]);

    const settings = settingsRes.ok ? await settingsRes.json() : [];
    const categories = categoriesRes.ok ? await categoriesRes.json() : [];
    const banners = bannersRes.ok ? await bannersRes.json() : [];
    const goldRates = goldRes.ok ? await goldRes.json() : [];

    const settingsMap: any = {};
    if (Array.isArray(settings)) {
      settings.forEach((s: any) => {
        settingsMap[s.key] = s.value;
      });
    }

    return { settings: settingsMap, categories, banners, goldRates };
  } catch (err) {
    console.error('Failed to fetch home data', err);
    return { settings: {}, categories: [], banners: [], goldRates: [] };
  }
}

export default async function HomePage() {
  const data = await getSiteData();
  return <HomeClient {...data} />;
}
