import { Metadata } from 'next';
import { api } from '@/lib/api';
import StoresClient, { STORE_LOCATIONS, StoreLocation, mergeWithDefaultStores } from './StoresClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Showrooms & Stores | Aranyak Jewellers Tripura',
  description: 'Visit Aranyak Jewellers flagship showrooms in Agartala, Dharmanagar, Kailashahar, and Khowai. Handcrafted hallmark gold and certified diamonds.',
};

export { STORE_LOCATIONS };
export type { StoreLocation };

async function getStoresAndSettings() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const dbStores = await api.getStores();
    clearTimeout(timeout);
    
    const stores = mergeWithDefaultStores(Array.isArray(dbStores) ? dbStores : []);
    return { 
      stores, 
      settings: {} as Record<string, string> 
    };
  } catch {
    return { stores: STORE_LOCATIONS, settings: {} as Record<string, string> };
  }
}

export default async function StoresPage() {
  const { stores, settings } = await getStoresAndSettings();
  const contactPhone = settings['contact_phone'] || '+919436501506';

  return <StoresClient stores={stores} contactPhone={contactPhone} />;
}
