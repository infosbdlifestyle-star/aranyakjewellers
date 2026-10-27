import { Metadata } from 'next';
import Link from 'next/link';
import { TextReveal, SparkleGlint } from '@/components/animations/LuxuryMotion';

export const metadata: Metadata = {
  title: "Today's Gold Rate | Aranyak Jewellers Tripura",
  description: 'Check today\'s gold rate at Aranyak Jewellers, Tripura. Updated daily for 22K BIS Hallmarked, 18K Diamond Jewellery, and 24K pure bullion.',
};

export default function GoldRatePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#211813] selection:bg-[#C49A45] selection:text-[#211813]">
      <section className="py-24 px-6 md:px-12 relative bg-[#211813] text-left border-b border-[#DED2C1]/15 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] bg-cover bg-center opacity-15 mix-blend-luminosity scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#211813]/90 via-[#211813]/70 to-[#211813] pointer-events-none" />
        
        <div className="relative z-10 container mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 mb-3">
            <SparkleGlint color="#E7C880" size={12}>
              <span className="text-[#E0BD72]">✧</span>
            </SparkleGlint>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#E0BD72] font-bold">
              Calibrated Daily • Tripura Jewellers Association
            </p>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-serif font-light mb-4 text-[#FFF8EC] tracking-tight">
            <TextReveal text="Today's Official" />{' '}
            <span className="font-editorial italic gold-gradient">Gold Rate</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#E5D9C8] font-normal tracking-wide max-w-xl leading-relaxed uppercase">
            100% Transparency with BIS 916 Hallmark &amp; Guaranteed Lifetime Exchange Value.
          </p>
        </div>
      </section>

      <section className="py-20 flex-1 bg-[#FAF7F0]">
        <div className="container mx-auto px-4 max-w-2xl relative z-10">
          {/* Gold Rate Information Card */}
          <div className="p-8 bg-[#FFFDF8] border border-[#DED2C1] rounded-2xl shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-[#DED2C1]/60 pb-4">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#8A5A12]">
                Official Benchmark Rate
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Updated Daily
              </span>
            </div>

            <div className="py-2">
              <p className="text-xs sm:text-sm text-[#40352F] leading-relaxed">
                Gold and bullion rates are calibrated daily according to market standards across all Tripura showrooms in Agartala, Khowai, Dharmanagar, and Kailashahar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#DED2C1]/40 text-xs text-[#40352F]">
              <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#DED2C1]/60">
                <span className="font-bold text-[#211813] block mb-1">BIS 916 Hallmarked</span>
                <span>Every gram calibrated with laser HUID certification for guaranteed purity.</span>
              </div>
              <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#DED2C1]/60">
                <span className="font-bold text-[#211813] block mb-1">Lifetime Exchange</span>
                <span>Full market bullion rate value guaranteed on all authenticated exchanges.</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/stores"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#211813] text-[#FFF8EC] hover:bg-[#C49A45] hover:text-[#211813] transition-colors rounded-xl text-xs font-bold tracking-widest uppercase shadow-md"
              >
                Visit Showroom For Valuation →
              </Link>
            </div>
          </div>

          <div className="mt-8 p-6 bg-[#F0E7D8] border border-[#DED2C1] text-[11px] text-[#76551C] text-center tracking-widest uppercase font-semibold rounded-2xl shadow-sm">
            * Bullion rates are updated according to market fluctuations. Visit any of our boutiques in Agartala, Khowai, Dharmanagar, or Kailashahar for final invoice calculations.
          </div>
        </div>
      </section>
    </main>
  );
}
