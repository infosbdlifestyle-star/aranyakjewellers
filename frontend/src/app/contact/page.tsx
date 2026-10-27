import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | Aranyak Jewellers Tripura',
  description: 'Connect with Aranyak Jewellers. Book a bridal consultation, speak with our gemologists, or visit our showrooms in Agartala, Khowai, Dharmanagar, and Kailashahar.',
};

export default function ContactPage() {
  return <ContactClient />;
}
