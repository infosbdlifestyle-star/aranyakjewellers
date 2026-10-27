import { Metadata } from 'next';
import CareGuideClient from './CareGuideClient';

export const metadata: Metadata = {
  title: 'Jewellery Care Guide | Aranyak Jewellers',
  description: 'Expert tips on how to care for 22K gold, certified diamonds, and precious gemstones from the master craftsmen at Aranyak Jewellers, Tripura.',
};

export default function CareGuidePage() {
  return <CareGuideClient />;
}
