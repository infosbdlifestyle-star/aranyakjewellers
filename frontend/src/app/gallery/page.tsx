import GalleryClient from './GalleryClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Master Gallery | Aranyak Jewellers High Jewellery Portfolio',
  description: 'Explore the master gallery of handcrafted gold, certified solitaires, and royal bridal jewellery at Aranyak Jewellers, Tripura.',
};

export default function GalleryPage() {
  return <GalleryClient />;
}
