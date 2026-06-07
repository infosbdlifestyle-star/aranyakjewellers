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
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/20 via-primary/5 to-transparent pointer-events-none blur-2xl opacity-70" />
        <Reveal y={40}>
          <p className="text-[10px] font-bold tracking-[0.6em] uppercase text-secondary mb-8 relative z-10">Est. 1995</p>
        </Reveal>
        <Reveal delay={0.1} y={40}>
          <h1 className="text-6xl md:text-8xl font-serif font-light mb-8 tracking-tight relative z-10 drop-shadow-xl">Our <span className="font-editorial italic text-white/90">Legacy</span></h1>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="w-[1px] h-24 bg-gradient-to-b from-secondary to-transparent mx-auto relative z-10" />
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
              
              {/* Overlapping Text Box (Glassmorphic) */}
              <Reveal delay={0.2} x={-30}>
                <div className="hidden md:block absolute -right-16 bottom-16 bg-white/[0.03] backdrop-blur-2xl p-8 max-w-xs shadow-2xl z-20 border border-white/10 rounded-2xl">
                  <div className="absolute inset-0 bg-[url('/hero-banner.png')] opacity-[0.05] mix-blend-overlay rounded-2xl pointer-events-none" />
                  <p className="font-editorial text-2xl leading-snug text-white relative z-10">
                    &ldquo;Preserving traditions while defining Tripura&apos;s elegance for over a quarter of a century.&rdquo;
                  </p>
                  <p className="mt-6 text-[9px] font-bold tracking-[0.3em] uppercase text-secondary relative z-10">&mdash; The Founder</p>
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
                <div className="grid grid-cols-2 gap-6 pt-12 relative">
                  {/* Decorative line behind grid */}
                  <div className="absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl hover:bg-white/[0.05] transition-colors duration-500 hover:border-secondary/30">
                    <div className="text-4xl font-serif font-light text-secondary mb-4 drop-shadow-md">BIS</div>
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2">Hallmark Certified</h3>
                    <p className="text-xs text-white/50 leading-relaxed">Absolute transparency in purity. Every gram accounted for.</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl hover:bg-white/[0.05] transition-colors duration-500 hover:border-secondary/30">
                    <div className="text-4xl font-serif font-light text-secondary mb-4 drop-shadow-md">25+</div>
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2">Years of Trust</h3>
                    <p className="text-xs text-white/50 leading-relaxed">A generational legacy of uncompromising quality.</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl hover:bg-white/[0.05] transition-colors duration-500 hover:border-secondary/30">
                    <div className="text-4xl font-serif font-light text-secondary mb-4 drop-shadow-md">05</div>
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2">Showrooms</h3>
                    <p className="text-xs text-white/50 leading-relaxed">Luxurious boutiques across Tripura for your convenience.</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl hover:bg-white/[0.05] transition-colors duration-500 hover:border-secondary/30">
                    <div className="text-4xl font-serif font-light text-secondary mb-4 drop-shadow-md">100%</div>
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2">Exchange Value</h3>
                    <p className="text-xs text-white/50 leading-relaxed">Lifetime buy-back guarantees safeguarding your investment.</p>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* Full Width Quote */}
      <section className="py-40 bg-primary text-white text-center px-6 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] opacity-10 mix-blend-luminosity scale-110 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/20 via-primary/40 to-primary pointer-events-none blur-3xl opacity-80" />
        
        <Reveal>
          <div className="text-secondary text-5xl mb-12 relative z-10 drop-shadow-[0_0_15px_rgba(203,161,53,0.5)]">✧</div>
          <h2 className="text-4xl md:text-6xl max-w-5xl mx-auto font-serif font-light leading-snug relative z-10 drop-shadow-2xl">
            &ldquo;Every gram of gold that leaves our stores carries our <span className="font-editorial italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">solemn promise</span> of authenticity.&rdquo;
          </h2>
        </Reveal>
      </section>
    </main>
  );
}
