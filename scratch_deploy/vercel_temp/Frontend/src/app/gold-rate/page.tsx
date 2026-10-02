import { Metadata } from 'next';
import GoldRateDisplay from '@/components/ui/GoldRateDisplay';
import { Reveal } from '@/components/animations/Reveal';

export const metadata: Metadata = {
  title: "Today's Gold Rate | Aranyak Jewellers",
  description: 'Check today\'s gold rate at Aranyak Jewellers, Tripura. Updated daily for 22K, 18K, and 24K gold.',
};

export default function GoldRatePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#050202] text-white">
      <section className="py-20 relative bg-[#050202] text-center border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
        <div className="absolute inset-0 silk-texture opacity-20 mix-blend-overlay" />
        <Reveal>
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">Today&apos;s Gold Rate</h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/50 font-bold">Updated Daily by Aranyak Jewellers</p>
        </Reveal>
      </section>

      <section className="py-20 flex-1">
        <div className="container mx-auto px-4 max-w-2xl relative z-10">
          <GoldRateDisplay />

          <div className="mt-12 p-6 bg-[#0A0505] border border-white/10 text-[10px] text-white/50 text-center tracking-widest uppercase font-bold">
            * Prices are indicative and may vary at the time of purchase. Visit our nearest showroom for exact rates.
          </div>
        </div>
      </section>
    </main>
  );
}
