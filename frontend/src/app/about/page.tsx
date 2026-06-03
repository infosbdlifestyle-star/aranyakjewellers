import Image from 'next/image';
import { Metadata } from 'next';
import { Reveal } from '@/components/animations/Reveal';

export const metadata: Metadata = {
  title: 'About Us | Aranyak Jewellers',
  description: 'Learn about Aranyak Jewellers — premium gold and diamond jewellery stores across Tripura.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <section className="py-20 burgundy-gradient text-white text-center">
        <Reveal>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Legacy</h1>
          <p className="text-sm tracking-[0.3em] uppercase text-ivory/60">Crafting elegance since generations</p>
        </Reveal>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12 text-center">
            <Reveal>
              <div className="grid md:grid-cols-2 gap-12 items-center text-center md:text-left">
                <div className="relative aspect-square overflow-hidden gold-foil-border">
                  <Image 
                    src="/md.jpg" 
                    alt="Managing Director - Aranyak Jewellers" 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="space-y-6">
                  <h2 className="text-3xl font-serif font-bold text-primary italic">A Vision of Purity</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    &ldquo;At Aranyak Jewellers, we don&apos;t just sell jewellery; we preserve traditions. Every piece is a promise of trust and a celebration of craftsmanship that has defined Tripura&apos;s elegance for over 25 years.&rdquo;
                  </p>
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-secondary">&mdash; Managing Director</p>
                </div>
              </div>
            </Reveal>

            <div className="pt-12">
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">Who We Are</h2>
              <p className="text-muted-foreground leading-relaxed">
                Aranyak Jewellers is one of Tripura&apos;s most trusted names in gold, diamond, and silver jewellery.
                With multiple showrooms across the state, we bring you handcrafted pieces that blend traditional Bengali
                artistry with contemporary design. Every piece at Aranyak is a testament to our commitment to purity,
                craftsmanship, and trust.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Reveal delay={0.1}>
                <div className="p-8 bg-ivory border border-border text-center h-full">
                  <div className="text-3xl font-serif font-bold text-secondary mb-2">BIS</div>
                  <span className="text-xs text-muted-foreground tracking-wider uppercase">Hallmark Certified</span>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="p-8 bg-ivory border border-border text-center h-full">
                  <div className="text-3xl font-serif font-bold text-secondary mb-2">5+</div>
                  <span className="text-xs text-muted-foreground tracking-wider uppercase">Showrooms in Tripura</span>
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="p-8 bg-ivory border border-border text-center h-full">
                  <div className="text-3xl font-serif font-bold text-secondary mb-2">25+</div>
                  <span className="text-xs text-muted-foreground tracking-wider uppercase">Years of Trust</span>
                </div>
              </Reveal>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-primary mb-4">Our Promise</h2>
              <p className="text-muted-foreground leading-relaxed">
                Every gram of gold, every carat of diamond that leaves our stores carries a promise &mdash;
                a promise of authenticity, purity, and timeless value. We are BIS Hallmark certified
                and every piece comes with a detailed certificate of purity and weight.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
