import GalleryClient from './GalleryClient';
import { Metadata } from 'next';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Master Gallery | Aranyak Jewellers High Jewellery Portfolio',
  description: 'Explore the master gallery of handcrafted gold, certified solitaires, and royal bridal jewellery at Aranyak Jewellers, Tripura.',
};

async function getMediaMap() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const mediaMap = await api.getMediaMap();
    clearTimeout(timeout);
    return mediaMap || {};
  } catch {
    return {};
  }
}

export default async function GalleryPage() {
  const mediaMap = await getMediaMap();
  return <GalleryClient mediaMap={mediaMap} />;
}
