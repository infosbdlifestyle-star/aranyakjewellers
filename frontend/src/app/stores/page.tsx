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
    <main className="min-h-screen flex flex-col bg-primary text-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-primary text-white text-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-secondary/10 via-primary/5 to-transparent pointer-events-none blur-2xl" />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif font-light mb-6 tracking-tight drop-shadow-xl">Our Showrooms</h1>
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
                <div className="group bg-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden flex flex-col sm:flex-row hover:shadow-[0_0_40px_rgba(203,161,53,0.15)] hover:border-secondary/40 hover:bg-white/[0.04] transition-all duration-700 rounded-xl relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  {/* Store Image Placeholder */}
                  <div className="w-full sm:w-48 h-32 sm:h-auto bg-white/5 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-white/10 overflow-hidden relative">
                     <div className="absolute inset-0 bg-[url('/showroom.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000" />
                     <div className="text-white/20 font-serif text-5xl group-hover:scale-110 transition-transform duration-500 relative z-10 drop-shadow-md">
                       {store.name.split('–')[1]?.[1] || 'A'}
                     </div>
                  </div>
                  
                  <div className="p-8 flex-1 space-y-4 relative z-10">
                    <h3 className="text-xl font-serif font-medium text-white group-hover:text-secondary transition-colors duration-300 drop-shadow-sm">{store.name}</h3>
                    <div className="space-y-3 text-sm text-white/60">
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
      <section className="py-24 bg-primary text-white relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-primary/5 to-transparent pointer-events-none blur-2xl" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[url('/IMG_20260603_142513.png')] opacity-[0.03] mix-blend-luminosity bg-cover pointer-events-none" />
        
        <div className="container mx-auto px-4 text-center space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif font-light italic drop-shadow-xl">Personalized Shopping Experience</h2>
          <p className="max-w-2xl mx-auto text-white/70 text-sm md:text-base leading-relaxed font-light">
            Our experts are here to help you find the perfect piece. Book a private viewing or video consultation to explore our exclusive collections.
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <a 
              href="https://wa.me/91XXXXXXXXXX?text=I%20would%20like%20to%20book%20an%20appointment" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-secondary text-primary px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white transition-all shadow-xl rounded-sm hover:shadow-[0_0_20px_rgba(203,161,53,0.4)]"
            >
              Book an Appointment
            </a>
            <a 
              href="tel:+91XXXXXXXXXX"
              className="border border-white/20 px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white hover:text-primary transition-all rounded-sm backdrop-blur-sm bg-white/5"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
