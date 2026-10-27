import { Metadata } from 'next';
import { api } from '@/lib/api';
import AboutClient from './AboutClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Legacy & Heritage | Aranyak Jewellers',
  description: 'Founded in 1995, Aranyak Jewellers is Tripura\'s premier jewellery house celebrating 25+ years of BIS hallmarked gold and certified diamonds.',
};

async function getSettingsAndMedia() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const [settings, mediaMap] = await Promise.all([
      api.getSettings(),
      api.getMediaMap(),
    ]);
    clearTimeout(timeout);
    return { settings: settings || {}, mediaMap: mediaMap || {} };
  } catch {
    return { settings: {}, mediaMap: {} };
  }
}

export default async function AboutPage() {
  const { settings, mediaMap } = await getSettingsAndMedia();
  return <AboutClient settings={settings} mediaMap={mediaMap} />;
}
