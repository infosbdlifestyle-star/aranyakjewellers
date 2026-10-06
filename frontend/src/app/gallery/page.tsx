import GalleryClient from './GalleryClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Master Gallery | Aranyak Jewellers High Jewellery Portfolio',
  description: 'Explore the master gallery of handcrafted gold, certified solitaires, and royal bridal jewellery at Aranyak Jewellers, Tripura.',
  alternates: { canonical: '/gallery' },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
