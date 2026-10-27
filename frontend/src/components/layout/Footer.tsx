import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = ({ categories = [], settings = {} }: { categories?: any[], settings?: any }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#211813] text-[#FFF8EC] pt-16 pb-8 border-t border-[#DED2C1]/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/">
              <Image 
                src="/logo-transparent.png" 
                alt="Aranyak Jewellers - Tripura Luxury Showroom" 
                width={180}
                height={56}
                className="h-14 w-auto brightness-0 invert opacity-95"
              />
            </Link>
            <p className="text-sm text-[#E5D9C8] leading-relaxed font-normal">
              Exquisite craftsmanship and timeless designs. Aranyak Jewellers brings you the finest 22K gold, certified diamonds, and pure silver jewellery in Tripura.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-bold text-[#E0BD72] mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-4 text-sm text-[#E5D9C8] font-medium">
              <li><Link href="/gallery" className="hover:text-[#E0BD72] transition-colors">Master Gallery</Link></li>
              <li><Link href="/about" className="hover:text-[#E0BD72] transition-colors">About Us</Link></li>
              <li><Link href="/collections" className="hover:text-[#E0BD72] transition-colors">Our Collections</Link></li>
              <li><Link href="/stores" className="hover:text-[#E0BD72] transition-colors">Store Locator</Link></li>
              <li><Link href="/faq" className="hover:text-[#E0BD72] transition-colors">FAQ</Link></li>
              <li><Link href="/care-guide" className="hover:text-[#E0BD72] transition-colors">Jewellery Care</Link></li>
              <li><Link href="/contact" className="hover:text-[#E0BD72] transition-colors">Contact Us</Link></li>
              <li><Link href="/login" className="text-[#E0BD72] font-bold hover:underline transition-colors flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Admin Portal Login</Link></li>
            </ul>
          </div>

          {/* Our Collections */}
          <div>
            <h4 className="text-lg font-serif font-bold text-[#E0BD72] mb-6 tracking-wide">Collections</h4>
            <ul className="space-y-4 text-sm text-[#E5D9C8] font-medium">
              {categories.filter((c: any) => c.slug !== 'astrological-stones' && c.slug !== 'costume-jewellery' && c.slug !== 'offers-deals').slice(0, 4).map(cat => (
                <li key={cat.id}><Link href={`/category/${cat.slug}`} className="hover:text-[#E0BD72] transition-colors">{cat.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-serif font-bold text-[#E0BD72] mb-6 tracking-wide">Get in Touch</h4>
            <div className="space-y-4 text-sm text-[#E5D9C8] font-medium">
              <p className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#E0BD72] shrink-0 mt-0.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                M B B CHOWMUHANI, AGARTALA 799001
              </p>
              <p className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#E0BD72] shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {settings['contact_phone'] || '+91-9436501506'}
              </p>
              <a 
                href={`https://wa.me/${(settings['contact_phone'] || '919436501506').replace(/\D/g,'')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-[#E0BD72] hover:text-[#FFF8EC] transition-colors font-semibold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#DED2C1]/15 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#E5D9C8] uppercase tracking-widest font-semibold">
          <p>&copy; {currentYear} Aranyak Jewellers. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-[#FFF8EC] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#FFF8EC] transition-colors">Terms of Service</Link>
            <Link href="/login" className="hover:text-[#E0BD72] transition-colors inline-flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Admin Panel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
