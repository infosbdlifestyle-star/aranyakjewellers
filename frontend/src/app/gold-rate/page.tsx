import { Metadata } from 'next';
import GoldRateDisplay from '@/components/ui/GoldRateDisplay';
import { Reveal } from '@/components/animations/Reveal';

export const metadata: Metadata = {
  title: "Today's Gold Rate | Aranyak Jewellers",
  description: 'Check today\'s gold rate at Aranyak Jewellers, Tripura. Updated daily for 22K, 18K, and 24K gold.',
};

export default function GoldRatePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <section className="py-16 burgundy-gradient text-white text-center">
        <Reveal>
          <h1 className="text-4xl font-serif font-bold mb-2">Today&apos;s Gold Rate</h1>
          <p className="text-xs tracking-[0.3em] uppercase text-ivory/60">Updated Daily by Aranyak Jewellers</p>
        </Reveal>
      </section>

      <section className="py-16 bg-ivory flex-1">
        <div className="container mx-auto px-4 max-w-2xl">
          <GoldRateDisplay />

          <div className="mt-8 p-4 bg-primary/5 border border-primary/10 text-xs text-muted-foreground text-center">
            * Prices are indicative and may vary at the time of purchase. Visit our nearest showroom for exact rates.
          </div>
        </div>
      </section>
    </main>
  );
}
