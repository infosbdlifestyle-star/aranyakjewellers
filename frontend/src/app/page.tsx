"use client";
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/constants/categories';
import { Reveal } from '@/components/animations/Reveal';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col silk-texture">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <Image 
            src="/hero-banner.png" 
            alt="Aranyak Jewellers Collection" 
            fill
            className="object-cover animate-slow-zoom no-select"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-8 px-4 max-w-5xl mx-auto">
            <Reveal y={40}>
              <h2 className="text-secondary text-xs md:text-sm font-medium tracking-[0.6em] uppercase mb-4 drop-shadow-md">
                Legacy of Excellence Since 1995
              </h2>
            </Reveal>
            <Reveal delay={0.2} y={40}>
              <h1 className="text-6xl md:text-9xl font-serif font-bold text-white leading-[1.1] mb-8 drop-shadow-2xl">
                Where Every Piece <br /> <span className="font-editorial text-secondary italic">Tells a Story</span>
              </h1>
            </Reveal>
            <Reveal delay={0.4} y={40}>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <Link 
                  href="/collections" 
                  className="group relative px-16 py-6 bg-secondary text-primary font-bold tracking-[0.4em] uppercase text-[10px] overflow-hidden transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] luxury-shimmer"
                >
                  <span className="relative z-10">Discover Masterpieces</span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>
                <Link 
                  href="/stores" 
                  className="px-16 py-6 border border-white/40 text-white font-bold tracking-[0.4em] uppercase text-[10px] hover:bg-white hover:text-primary transition-all backdrop-blur-sm"
                >
                  Visit Our Showrooms
                </Link>
              </div>
            </Reveal>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4 opacity-70">
          <span className="text-[8px] uppercase tracking-[0.5em] text-white/50 font-bold">Scroll to Explore</span>
          <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 w-full h-1/2 bg-secondary"
              animate={{ top: ["0%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </div>
        </div>
      </section>

      {/* Signature Promise */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <Reveal>
              <div className="text-center space-y-4">
                <div className="text-3xl text-secondary mb-4">✧</div>
                <h4 className="text-lg font-serif font-bold tracking-tight text-primary">Certified Authenticity</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Every diamond and gemstone is ethically sourced and BIS Hallmarked for guaranteed purity.</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="text-center space-y-4">
                <div className="text-3xl text-secondary mb-4">✧</div>
                <h4 className="text-lg font-serif font-bold tracking-tight text-primary">Master Craftsmanship</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Our artisans spend hundreds of hours handcrafting each unique piece to perfection.</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="text-center space-y-4">
                <div className="text-3xl text-secondary mb-4">✧</div>
                <h4 className="text-lg font-serif font-bold tracking-tight text-primary">Lifetime Exchange</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">We stand by our quality with transparent lifetime exchange and buy-back policies.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Editorial Category Section */}
      <section className="py-32 bg-ivory overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20">
            <Reveal>
              <div className="space-y-4">
                <p className="text-[10px] tracking-[0.5em] uppercase text-secondary font-bold">Curated Selections</p>
                <h3 className="text-4xl md:text-6xl font-serif font-bold text-primary italic">The Art of <span className="text-foreground">Adornment</span></h3>
              </div>
            </Reveal>
            <Link href="/collections" className="text-xs font-bold tracking-widest uppercase border-b border-primary/20 pb-2 hover:border-secondary transition-all mt-8 md:mt-0">
              View All Categories
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.slice(0, 4).map((cat, i) => (
              <Reveal key={cat.id} delay={i * 0.1}>
                <Link 
                  href={`/category/${cat.slug}`}
                  className="group relative aspect-[3/4] overflow-hidden bg-white block"
                >
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-all duration-700" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                     <div className="text-6xl font-serif text-primary/10 group-hover:text-primary group-hover:scale-125 transition-all duration-700">
                       {cat.name[0]}
                     </div>
                     <h5 className="text-xl font-serif font-bold text-primary">{cat.name}</h5>
                     <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Explore Collection</p>
                  </div>
                  <div className="absolute inset-4 border border-primary/10 group-hover:border-secondary/30 transition-all duration-700 pointer-events-none" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Showcase */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal>
              <div className="relative group">
                <div className="absolute -inset-4 border border-secondary/20 translate-x-4 translate-y-4 -z-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
                <div className="relative aspect-square overflow-hidden gold-foil-border">
                  <Image 
                    src="/bridal-edit.png" 
                    alt="The Bridal Edit" 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="space-y-8">
                <span className="text-[10px] tracking-[0.5em] uppercase text-secondary font-bold">Bridal Special</span>
                <h3 className="text-5xl md:text-7xl font-serif font-bold text-primary leading-tight">Heritage <br /> <span className="font-editorial">Excellence</span></h3>
                <p className="text-muted-foreground leading-relaxed max-w-md italic">
                  &ldquo;Our bridal collections are a tribute to the rich heritage of Tripura, blending traditional motifs with contemporary elegance for the modern bride.&rdquo;
                </p>
                <div className="pt-4">
                  <Link 
                    href="/category/gold" 
                    className="inline-flex items-center space-x-6 group"
                  >
                    <span className="text-xs font-bold tracking-[0.4em] uppercase">Explore Bridal Collection</span>
                    <div className="w-12 h-[1px] bg-primary group-hover:w-20 transition-all" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Showroom CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/showroom.jpg" 
            alt="Aranyak Jewellers Showroom" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white space-y-8">
          <Reveal>
            <p className="text-[10px] tracking-[0.5em] uppercase text-secondary font-bold">Experience in Person</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="text-4xl md:text-6xl font-serif font-bold italic">Visit Our Showrooms</h3>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-ivory/70 max-w-xl mx-auto leading-relaxed">
              Step into our luxurious showrooms across Tripura and experience the brilliance of our collections in person. Our experts are ready to guide you.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <Link 
                href="/stores" 
                className="bg-secondary text-primary px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-white transition-all shadow-xl"
              >
                Find a Store
              </Link>
              <Link 
                href="/contact" 
                className="border border-white/30 text-white px-12 py-5 text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-white hover:text-primary transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
