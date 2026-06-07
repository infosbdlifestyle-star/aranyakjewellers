import { CATEGORIES } from '@/constants/categories';
import Link from 'next/link';
import { Metadata } from 'next';
import { Reveal } from '@/components/animations/Reveal';

export const metadata: Metadata = {
  title: 'All Collections | Aranyak Jewellers',
  description: 'Browse all Gold, Diamond, Silver jewellery and Astrological Stones at Aranyak Jewellers, Tripura.',
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-primary text-white">
      {/* Page Hero */}
      <section className="relative pt-40 pb-20 px-6 text-center bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] bg-cover bg-center opacity-10 mix-blend-luminosity animate-slow-zoom" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/20 via-primary/5 to-transparent pointer-events-none blur-3xl opacity-80" />
        <div className="relative z-10">
          <Reveal y={40}>
            <p className="text-[10px] tracking-[0.6em] uppercase text-secondary mb-8 font-bold">The Archives</p>
          </Reveal>
          <Reveal delay={0.1} y={40}>
            <h1 className="text-6xl md:text-8xl font-serif font-light mb-8 tracking-tight drop-shadow-xl">Our <span className="font-editorial italic text-white/90">Collections</span></h1>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="w-[1px] h-24 bg-gradient-to-b from-secondary to-transparent mx-auto mt-12" />
          </Reveal>
        </div>
      </section>

      {/* Staggered Zig-Zag Layout */}
      <section className="py-32">
        <div className="container mx-auto px-6 max-w-7xl space-y-32 md:space-y-48">
          {CATEGORIES.map((cat, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={cat.id} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 md:gap-24 items-center`}>
                
                {/* Image/Visual Area */}
                <div className="w-full md:w-1/2 relative">
                  <Reveal y={40}>
                    <div className="relative aspect-[4/5] bg-white/[0.02] backdrop-blur-3xl flex items-center justify-center p-12 overflow-hidden group shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-lg">
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-700" />
                      <div className="text-[15rem] font-serif font-light text-white/[0.03] group-hover:text-white/10 transition-colors duration-1000 select-none transform group-hover:scale-110 drop-shadow-2xl">
                        {cat.name[0]}
                      </div>
                      
                      {/* Decorative Frame */}
                      <div className="absolute inset-6 border border-white/10 group-hover:border-secondary/30 transition-colors duration-700 pointer-events-none rounded-sm" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-white/5 scale-[0.85] group-hover:scale-95 transition-transform duration-1000 pointer-events-none rounded-sm" />
                    </div>
                  </Reveal>
                  
                  {/* Floating Number */}
                  <Reveal delay={0.2} x={isEven ? -40 : 40}>
                    <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? '-left-12' : '-right-12'} hidden md:block mix-blend-difference z-20`}>
                      <span className="text-[8rem] font-editorial text-white/50">0{idx + 1}</span>
                    </div>
                  </Reveal>
                </div>

                {/* Content Area */}
                <div className={`w-full md:w-1/2 flex flex-col ${isEven ? 'md:items-start' : 'md:items-end md:text-right'}`}>
                  <Reveal delay={0.1} y={30}>
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary mb-6 block">
                      Chapter {idx + 1}
                    </span>
                    <h2 className="text-5xl md:text-6xl font-serif font-light text-white mb-10">
                      {cat.name}
                    </h2>
                  </Reveal>
                  
                  <Reveal delay={0.2} y={30}>
                    {cat.subcategories ? (
                      <div className={`space-y-4 mb-12 w-full ${isEven ? 'text-left' : 'text-right'}`}>
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/category/${cat.slug}/${sub.slug}`}
                            className={`flex items-center gap-4 text-sm text-white/60 hover:text-white transition-colors duration-300 group/link ${isEven ? 'justify-start' : 'justify-end'}`}
                          >
                            {isEven && <span className="w-0 group-hover/link:w-6 h-[1px] bg-secondary transition-all duration-300" />}
                            <span className="tracking-wide uppercase text-[10px] font-bold">{sub.name}</span>
                            {!isEven && <span className="w-0 group-hover/link:w-6 h-[1px] bg-secondary transition-all duration-300" />}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-white/70 leading-relaxed font-light max-w-md mb-12">
                        Immerse yourself in our masterfully crafted {cat.name.toLowerCase()} pieces, where traditional techniques meet contemporary sophistication.
                      </p>
                    )}
                  </Reveal>

                  <Reveal delay={0.3} y={30}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="inline-flex items-center space-x-4 text-[10px] font-bold tracking-[0.3em] uppercase text-white group/btn"
                    >
                      <span className="hover-underline-gold pb-1 border-b border-secondary/50 hover:border-secondary">Explore {cat.name}</span>
                    </Link>
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
