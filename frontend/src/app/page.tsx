import HomeClient from './HomeClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Aranyak Jewellers | Timeless Elegance',
  description: 'Premium gold and diamond jewellery stores across Tripura.',
};

async function getSiteData() {
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);
    const api = 'http://117.252.16.132:3001/api';
    const opts = { cache: 'no-store' as const, signal: controller.signal };
    const [settingsRes, categoriesRes, bannersRes, goldRes] = await Promise.all([
      fetch(`${api}/settings`, opts),
      fetch(`${api}/categories`, opts),
      fetch(`${api}/banners`, opts),
      fetch(`${api}/gold-price`, opts)
    ]);

    const settings = settingsRes.ok ? await settingsRes.json() : [];
    const categories = categoriesRes.ok ? await categoriesRes.json() : [];
    const banners = bannersRes.ok ? await bannersRes.json() : [];
    const goldRates = goldRes.ok ? await goldRes.json() : [];

    const settingsMap: any = {};
    if (Array.isArray(settings)) {
      settings.forEach((s: any) => { settingsMap[s.key] = s.value; });
    }

    return { settings: settingsMap, categories, banners, goldRates };
  } catch {
    return { settings: {}, categories: [], banners: [], goldRates: [] };
  }
}


export default async function HomePage() {
  const data = await getSiteData();
  return <HomeClient {...data} />;
}
