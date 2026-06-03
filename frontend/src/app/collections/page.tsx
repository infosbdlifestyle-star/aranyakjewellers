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
    <main className="min-h-screen flex flex-col">
      {/* Page Hero */}
      <section className="relative py-32 burgundy-gradient text-white text-center overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-tight">Our Collections</h1>
          <div className="flex items-center justify-center space-x-4">
            <div className="h-[1px] w-12 bg-secondary" />
            <p className="text-xs tracking-[0.4em] uppercase text-ivory/80">Crafting Legacies Since Generations</p>
            <div className="h-[1px] w-12 bg-secondary" />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-ivory">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {CATEGORIES.map((cat, idx) => (
              <Reveal key={cat.id} delay={idx * 0.1}>
                <div className="group relative bg-white border border-border overflow-hidden flex flex-col md:flex-row min-h-[350px] transition-all duration-500 hover:shadow-2xl">
                  {/* Visual Area */}
                  <div className="w-full md:w-1/2 bg-ivory relative overflow-hidden flex items-center justify-center p-10 border-b md:border-b-0 md:border-r border-border">
                    <div className="text-primary/10 font-serif text-9xl group-hover:scale-110 group-hover:text-primary/15 transition-all duration-700 select-none">
                      {cat.name[0]}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <div className="w-full h-full border border-primary/5 group-hover:border-primary/20 transition-all duration-500" />
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-10 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-secondary mb-2 block">
                        Category 0{idx + 1}
                      </span>
                      <h2 className="text-3xl font-serif font-bold text-primary mb-6 group-hover:translate-x-2 transition-transform">
                        {cat.name}
                      </h2>
                      
                      {cat.subcategories ? (
                        <div className="space-y-3 mb-8">
                          {cat.subcategories.slice(0, 4).map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/category/${cat.slug}/${sub.slug}`}
                              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-all group/link"
                            >
                              <span className="w-0 group-hover/link:w-4 h-[1px] bg-primary transition-all overflow-hidden" />
                              {sub.name}
                            </Link>
                          ))}
                          {cat.subcategories.length > 4 && (
                            <p className="text-[10px] text-muted-foreground italic">+{cat.subcategories.length - 4} more collections</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                          Explore our masterfully crafted {cat.name.toLowerCase()} pieces, designed for every occasion.
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/category/${cat.slug}`}
                      className="inline-flex items-center space-x-4 text-xs tracking-[0.3em] uppercase text-primary font-bold group/btn"
                    >
                      <span>View Collection</span>
                      <div className="w-8 h-[1px] bg-primary group-hover/btn:w-12 transition-all" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
