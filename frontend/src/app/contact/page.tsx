import { Metadata } from 'next';
import { Reveal } from '@/components/animations/Reveal';

export const metadata: Metadata = {
  title: 'Contact Us | Aranyak Jewellers',
  description: 'Get in touch with Aranyak Jewellers. Visit our showrooms in Tripura or reach us via phone and WhatsApp.',
};

const CONTACT_INFO = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    ),
    title: 'Visit Us',
    details: ['Battala, Agartala', 'Tripura 799001, India'],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    ),
    title: 'Call Us',
    details: ['+91-XXXXXXXXXX', 'Mon–Sat: 10 AM – 8 PM'],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
    ),
    title: 'WhatsApp',
    details: ['Chat with us instantly', 'Quick responses guaranteed'],
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="py-20 burgundy-gradient text-white text-center">
        <Reveal>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Get in Touch</h1>
          <p className="text-sm tracking-[0.3em] uppercase text-ivory/60">We&apos;d love to hear from you</p>
        </Reveal>
      </section>

      {/* Contact Cards */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {CONTACT_INFO.map((info, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-primary/50 border border-white/10 p-10 text-center space-y-4 hover:shadow-[0_0_30px_rgba(203,161,53,0.15)] hover:border-secondary/30 transition-all duration-500 h-full">
                  <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center text-secondary">
                    {info.icon}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, j) => (
                      <p key={j} className="text-sm text-white/60">{detail}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Contact Form */}
          <Reveal>
            <div className="bg-primary/30 border border-white/10 p-10 md:p-16 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/hero-banner.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
              <div className="text-center mb-12 relative z-10">
                <h2 className="text-3xl font-serif font-bold text-white italic mb-3">Send Us a Message</h2>
                <p className="text-sm text-white/60">Fill in your details and we&apos;ll get back to you shortly</p>
              </div>

              <form className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-2 block">Full Name</label>
                    <input 
                      id="contact-name"
                      type="text" 
                      placeholder="Your name"
                      className="w-full border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-secondary transition-colors bg-white/5"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-2 block">Phone Number</label>
                    <input 
                      id="contact-phone"
                      type="tel" 
                      placeholder="+91-XXXXXXXXXX"
                      className="w-full border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-secondary transition-colors bg-white/5"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-2 block">Email Address</label>
                  <input 
                    id="contact-email"
                    type="email" 
                    placeholder="your@email.com"
                    className="w-full border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-secondary transition-colors bg-white/5"
                  />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-2 block">Subject</label>
                  <select 
                    id="contact-subject"
                    className="w-full border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary transition-colors bg-[#2A0A0A] appearance-none"
                  >
                    <option>General Inquiry</option>
                    <option>Product Inquiry</option>
                    <option>Book Appointment</option>
                    <option>Custom Order</option>
                    <option>Feedback</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-2 block">Message</label>
                  <textarea 
                    id="contact-message"
                    rows={5} 
                    placeholder="Tell us how we can help..."
                    className="w-full border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-secondary transition-colors bg-white/5 resize-none"
                  />
                </div>
                <div className="text-center pt-4">
                  <button 
                    type="submit"
                    className="bg-secondary text-primary px-16 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white transition-all shadow-xl luxury-shimmer"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
