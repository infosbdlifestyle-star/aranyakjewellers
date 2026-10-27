import { Metadata } from 'next';
import FAQClient from './FAQClient';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Aranyak Jewellers',
  description: 'Learn about gold hallmarking, diamond certifications, custom bridal commissions, and lifetime exchange policies at Aranyak Jewellers, Tripura.',
};

export default function FAQPage() {
  return <FAQClient />;
}
