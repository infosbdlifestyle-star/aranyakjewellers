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

            {/* Official Social Media Links */}
            <div className="pt-2">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#E0BD72] font-semibold mb-3">Follow Our Journey</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/aranyakjewellers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Aranyak Jewellers on Instagram"
                  title="Instagram: @aranyakjewellers"
                  className="w-9 h-9 rounded-full bg-[#FAF7F0]/10 hover:bg-[#D6B15D] text-[#E0BD72] hover:text-[#211813] border border-[#D6B15D]/40 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm group"
                >
                  <svg className="w-4 h-4 fill-current transition-colors" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/aranyakjewellers"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Aranyak Jewellers on Facebook"
                  title="Facebook: @aranyakjewellers"
                  className="w-9 h-9 rounded-full bg-[#FAF7F0]/10 hover:bg-[#D6B15D] text-[#E0BD72] hover:text-[#211813] border border-[#D6B15D]/40 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm group"
                >
                  <svg className="w-4 h-4 fill-current transition-colors" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
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
                <span className="tabular-nums lining-nums">M B B CHOWMUHANI, AGARTALA 799001</span>
              </p>
              <p className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#E0BD72] shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span className="tabular-nums lining-nums">{settings['contact_phone'] || '+91-9436501506'}</span>
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

              <div className="pt-2 flex items-center gap-3">
                <a 
                  href="https://www.instagram.com/aranyakjewellers/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-xs text-[#E0BD72] hover:text-[#FFF8EC] transition-colors font-medium group"
                  aria-label="Follow Aranyak Jewellers on Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  <span>Instagram</span>
                </a>
                <span className="text-[#E0BD72]/40">•</span>
                <a 
                  href="https://www.facebook.com/aranyakjewellers" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 text-xs text-[#E0BD72] hover:text-[#FFF8EC] transition-colors font-medium group"
                  aria-label="Follow Aranyak Jewellers on Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#DED2C1]/15 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#E5D9C8] uppercase tracking-widest font-semibold">
          <p className="tabular-nums lining-nums">&copy; {currentYear} Aranyak Jewellers. All Rights Reserved.</p>
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
