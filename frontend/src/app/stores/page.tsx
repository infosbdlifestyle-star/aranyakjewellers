import { Metadata } from 'next';
import { Reveal } from '@/components/animations/Reveal';

export const metadata: Metadata = {
  title: 'Our Stores | Aranyak Jewellers',
  description: 'Find Aranyak Jewellers showrooms near you in Tripura.',
};

const STORES = [
  { name: 'Aranyak Jewellers – Main Showroom', address: 'Battala, Agartala, Tripura 799001', phone: '+91-XXXXXXXXXX', hours: '10:00 AM – 8:00 PM' },
  { name: 'Aranyak Jewellers – City Centre', address: 'Durga Chowmuhani, Agartala, Tripura', phone: '+91-XXXXXXXXXX', hours: '10:00 AM – 8:00 PM' },
  { name: 'Aranyak Jewellers – Dharmanagar', address: 'Main Road, Dharmanagar, North Tripura', phone: '+91-XXXXXXXXXX', hours: '10:00 AM – 7:30 PM' },
  { name: 'Aranyak Jewellers – Udaipur', address: 'Bazar Road, Udaipur, Gomati, Tripura', phone: '+91-XXXXXXXXXX', hours: '10:00 AM – 7:30 PM' },
];

export default function StoresPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#050202] text-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-[#050202] text-white text-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] opacity-10 mix-blend-luminosity" />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif font-light mb-8 tracking-tight">Our Showrooms</h1>
          <div className="flex items-center justify-center space-x-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-secondary" />
            <p className="text-xs tracking-[0.4em] uppercase text-white/80 font-bold">Experience Luxury Across Tripura</p>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-secondary" />
          </div>
        </div>
      </section>

      <section className="py-20 flex-1">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10">
            {STORES.map((store, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group bg-[#0A0505] border border-white/10 overflow-hidden flex flex-col sm:flex-row hover:border-secondary/40 transition-colors duration-700 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  {/* Store Image Placeholder */}
                  <div className="w-full sm:w-48 h-32 sm:h-auto bg-[#050202] flex items-center justify-center border-b sm:border-b-0 sm:border-r border-white/10 overflow-hidden relative">
                     <div className="absolute inset-0 bg-[url('/showroom.jpg')] bg-cover bg-center opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-[2s] ease-out" />
                     <div className="text-white font-serif font-light text-5xl relative z-10">
                       {store.name.split('–')[1]?.[1] || 'A'}
                     </div>
                  </div>
                  
                  <div className="p-10 flex-1 space-y-6 relative z-10">
                    <h3 className="text-2xl font-serif font-light text-white group-hover:text-secondary transition-colors duration-300">{store.name}</h3>
                    <div className="space-y-4 text-xs tracking-wide text-white/50 font-light">
                      <p className="flex items-start gap-3 group-hover:text-white/80 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        {store.address}
                      </p>
                      <p className="flex items-center gap-3 group-hover:text-white/80 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        {store.phone}
                      </p>
                      <p className="flex items-center gap-3 group-hover:text-white/80 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {store.hours}
                      </p>
                    </div>
                    <div className="pt-4">
                      <button className="text-[10px] font-bold tracking-[0.2em] uppercase text-white border-b border-white/20 pb-1 hover:text-secondary hover:border-secondary transition-all duration-300">
                        Get Directions
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment CTA */}
      <section className="py-24 bg-[#050202] text-white relative overflow-hidden border-t border-white/10">
        <div className="container mx-auto px-4 text-center space-y-8 relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif font-light italic">Personalized Shopping Experience</h2>
          <p className="max-w-2xl mx-auto text-white/70 text-sm md:text-base leading-relaxed font-light">
            Our experts are here to help you find the perfect piece. Book a private viewing or video consultation to explore our exclusive collections.
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <a 
              href="https://wa.me/91XXXXXXXXXX?text=I%20would%20like%20to%20book%20an%20appointment" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-luxury px-12 py-4 text-[9px] font-bold tracking-[0.4em] uppercase"
            >
              Book an Appointment
            </a>
            <a 
              href="tel:+91XXXXXXXXXX"
              className="border border-white/20 px-12 py-4 text-[9px] font-bold tracking-[0.4em] uppercase hover:bg-white hover:text-[#050202] transition-colors duration-500"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
