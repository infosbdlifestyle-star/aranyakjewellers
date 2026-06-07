import Image from 'next/image';
import { Metadata } from 'next';
import { Reveal } from '@/components/animations/Reveal';

export const metadata: Metadata = {
  title: 'About Us | Aranyak Jewellers',
  description: 'Learn about Aranyak Jewellers — premium gold and diamond jewellery stores across Tripura.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-primary text-white">
      {/* Editorial Hero */}
      <section className="pt-32 pb-20 px-6 text-center">
        <Reveal y={40}>
          <p className="text-[10px] font-bold tracking-[0.6em] uppercase text-secondary mb-8">Est. 1995</p>
        </Reveal>
        <Reveal delay={0.1} y={40}>
          <h1 className="text-6xl md:text-8xl font-serif font-light mb-8 tracking-tight">Our <span className="font-editorial italic">Legacy</span></h1>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="w-[1px] h-24 bg-primary/20 mx-auto" />
        </Reveal>
      </section>

      {/* Story Section - Asymmetrical Magazine Layout */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-16 md:gap-32 items-center">
            
            {/* Image Side */}
            <div className="w-full md:w-5/12 relative">
              <Reveal>
                <div className="relative aspect-[3/4] w-full bg-primary/5 overflow-hidden group">
                  <Image 
                    src="/md.jpg" 
                    alt="Managing Director - Aranyak Jewellers" 
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Decorative Frame */}
                  <div className="absolute inset-4 border border-secondary/20 z-10 pointer-events-none" />
                </div>
              </Reveal>
              
              {/* Overlapping Text Box */}
              <Reveal delay={0.2} x={-30}>
                <div className="hidden md:block absolute -right-16 bottom-16 bg-[#1A0505] p-8 max-w-xs shadow-2xl z-20 border border-white/10">
                  <p className="font-editorial text-2xl leading-snug text-white">
                    &ldquo;Preserving traditions while defining Tripura&apos;s elegance for over a quarter of a century.&rdquo;
                  </p>
                  <p className="mt-6 text-[9px] font-bold tracking-[0.3em] uppercase text-secondary">&mdash; The Founder</p>
                </div>
              </Reveal>
            </div>

            {/* Text Side */}
            <div className="w-full md:w-7/12 space-y-16">
              <Reveal delay={0.1}>
                <div className="space-y-6">
                  <h2 className="text-4xl font-serif font-light">A Vision of <span className="font-editorial italic text-secondary">Purity</span></h2>
                  <p className="text-white/70 leading-relaxed tracking-wide font-light">
                    Aranyak Jewellers is not just a destination for fine jewelry; it is an institution built on trust, artistry, and heritage. What began as a singular vision in 1995 has blossomed into Tripura&apos;s most prestigious jewelry house.
                  </p>
                  <p className="text-white/70 leading-relaxed tracking-wide font-light">
                    We believe that every piece of jewelry carries a soul. It is a silent witness to life&apos;s most profound moments—a wedding vow, a milestone anniversary, a gift of enduring love. Our master artisans, carrying centuries-old Bengali goldsmithing traditions, pour hundreds of hours into realizing these masterpieces.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="grid grid-cols-2 gap-x-12 gap-y-16 border-t border-white/10 pt-16">
                  <div>
                    <div className="text-4xl font-serif font-light text-secondary mb-4">BIS</div>
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2">Hallmark Certified</h3>
                    <p className="text-xs text-white/60 leading-relaxed">Absolute transparency in purity. Every gram accounted for.</p>
                  </div>
                  <div>
                    <div className="text-4xl font-serif font-light text-secondary mb-4">25+</div>
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2">Years of Trust</h3>
                    <p className="text-xs text-white/60 leading-relaxed">A generational legacy of uncompromising quality.</p>
                  </div>
                  <div>
                    <div className="text-4xl font-serif font-light text-secondary mb-4">05</div>
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2">Showrooms</h3>
                    <p className="text-xs text-white/60 leading-relaxed">Luxurious boutiques across Tripura for your convenience.</p>
                  </div>
                  <div>
                    <div className="text-4xl font-serif font-light text-secondary mb-4">100%</div>
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2">Exchange Value</h3>
                    <p className="text-xs text-white/60 leading-relaxed">Lifetime buy-back guarantees safeguarding your investment.</p>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* Full Width Quote */}
      <section className="py-32 bg-primary text-white text-center px-6 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        <Reveal>
          <div className="text-secondary text-4xl mb-8 relative z-10">✧</div>
          <h2 className="text-3xl md:text-5xl max-w-4xl mx-auto font-serif font-light leading-snug relative z-10">
            &ldquo;Every gram of gold that leaves our stores carries our <span className="font-editorial italic text-secondary">solemn promise</span> of authenticity.&rdquo;
          </h2>
        </Reveal>
      </section>
    </main>
  );
}
