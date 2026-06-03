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
    <main className="min-h-screen flex flex-col bg-ivory">
      {/* Hero Section */}
      <section className="relative py-24 burgundy-gradient text-white text-center overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl font-serif font-bold mb-4 tracking-tight">Our Showrooms</h1>
          <div className="flex items-center justify-center space-x-4">
            <div className="h-[1px] w-8 bg-secondary" />
            <p className="text-xs tracking-[0.4em] uppercase text-ivory/80">Experience Luxury Across Tripura</p>
            <div className="h-[1px] w-8 bg-secondary" />
          </div>
        </div>
      </section>

      <section className="py-20 flex-1">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10">
            {STORES.map((store, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group bg-white border border-border overflow-hidden flex flex-col sm:flex-row hover:shadow-2xl transition-all duration-500">
                  {/* Store Image Placeholder */}
                  <div className="w-full sm:w-48 h-32 sm:h-auto bg-ivory flex items-center justify-center border-b sm:border-b-0 sm:border-r border-border overflow-hidden">
                     <div className="text-primary/20 font-serif text-4xl group-hover:scale-110 transition-transform duration-500">
                       {store.name.split('–')[1]?.[1] || 'A'}
                     </div>
                  </div>
                  
                  <div className="p-8 flex-1 space-y-4">
                    <h3 className="text-xl font-serif font-bold text-primary group-hover:text-secondary transition-colors">{store.name}</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        {store.address}
                      </p>
                      <p className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        {store.phone}
                      </p>
                      <p className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {store.hours}
                      </p>
                    </div>
                    <div className="pt-4">
                      <button className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary border-b border-primary/20 pb-1 hover:text-secondary hover:border-secondary transition-all">
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
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-serif font-bold italic">Personalized Shopping Experience</h2>
          <p className="max-w-2xl mx-auto text-ivory/70 text-sm md:text-base leading-relaxed">
            Our experts are here to help you find the perfect piece. Book a private viewing or video consultation to explore our exclusive collections.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a 
              href="https://wa.me/91XXXXXXXXXX?text=I%20would%20like%20to%20book%20an%20appointment" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-secondary text-primary px-10 py-4 text-xs font-bold tracking-widest uppercase hover:bg-white transition-all shadow-xl"
            >
              Book an Appointment
            </a>
            <a 
              href="tel:+91XXXXXXXXXX"
              className="border border-white/30 px-10 py-4 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-primary transition-all"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
