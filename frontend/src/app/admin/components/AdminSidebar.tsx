"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { 
    name: 'Dashboard', 
    href: '/admin', 
    color: 'text-emerald-400', 
    activeColor: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300', 
    icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' 
  },
  { 
    name: 'Homepage Manager', 
    href: '/admin/homepage', 
    color: 'text-amber-400', 
    activeColor: 'bg-amber-500/15 border-amber-500/40 text-amber-300', 
    icon: 'M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5z M4 13a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6z M16 13a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-6z' 
  },
  { 
    name: 'Promotional Offers', 
    href: '/admin/offers', 
    color: 'text-rose-400', 
    activeColor: 'bg-rose-500/15 border-rose-500/40 text-rose-300', 
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' 
  },
  { 
    name: 'Announcement Ticker', 
    href: '/admin/ticker', 
    color: 'text-yellow-400', 
    activeColor: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300', 
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' 
  },
  { 
    name: 'Products Catalogue', 
    href: '/admin/products', 
    color: 'text-indigo-400', 
    activeColor: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300', 
    icon: 'M20.38 3.46 16 2a8.18 8.18 0 0 0-7.16 2.25 8.18 8.18 0 0 0-2.25 7.16l2.1 2.1-7.1 7.1a2.12 2.12 0 0 0 3 3l7.1-7.1 2.1 2.1a8.18 8.18 0 0 0 7.16-2.25 8.18 8.18 0 0 0 2.25-7.16ZM7.14 12.86l-3.22 3.22M15 5.5l3.5 3.5' 
  },
  { 
    name: 'Categories & Collections', 
    href: '/admin/categories', 
    color: 'text-purple-400', 
    activeColor: 'bg-purple-500/15 border-purple-500/40 text-purple-300', 
    icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12' 
  },
  { 
    name: 'Master Gallery', 
    href: '/admin/gallery', 
    color: 'text-pink-400', 
    activeColor: 'bg-pink-500/15 border-pink-500/40 text-pink-300', 
    icon: 'M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z' 
  },
  { 
    name: 'Banners & Carousel', 
    href: '/admin/banners', 
    color: 'text-amber-300', 
    activeColor: 'bg-amber-500/15 border-amber-500/40 text-amber-200', 
    icon: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4 M14 2v6h6 M3 15h6v2H3z M3 11h6v2H3z' 
  },
  { 
    name: 'Media Assets Manager', 
    href: '/admin/media', 
    color: 'text-yellow-300', 
    activeColor: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-200', 
    icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12' 
  },
  { 
    name: 'Showroom Boutiques', 
    href: '/admin/stores', 
    color: 'text-teal-400', 
    activeColor: 'bg-teal-500/15 border-teal-500/40 text-teal-300', 
    icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' 
  },
  { 
    name: 'Site Settings & SEO', 
    href: '/admin/settings', 
    color: 'text-orange-400', 
    activeColor: 'bg-orange-500/15 border-orange-500/40 text-orange-300', 
    icon: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' 
  },
  { 
    name: 'User Accounts & Roles', 
    href: '/admin/users', 
    color: 'text-cyan-400', 
    activeColor: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300', 
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' 
  },
  { 
    name: 'Security & 2FA Audit', 
    href: '/admin/security', 
    color: 'text-red-400', 
    activeColor: 'bg-red-500/15 border-red-500/40 text-red-300', 
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' 
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gradient-to-b from-[#0a0508] via-[#050204] to-[#0a0505] border-r border-white/10 h-screen hidden lg:flex flex-col sticky top-0 shadow-2xl z-20">
      <div className="h-20 flex flex-col items-center justify-center border-b border-white/10 shrink-0 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xl font-serif font-bold gold-gradient tracking-widest uppercase">
            Aranyak
          </span>
        </div>
        <span className="text-[8px] tracking-[0.3em] text-[#E5C158] uppercase font-bold mt-1">
          Master Admin Console
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 group relative border text-left ${
                isActive 
                  ? `${item.activeColor} shadow-lg backdrop-blur-md font-semibold` 
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="17" 
                height="17" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`transition-transform duration-300 flex-shrink-0 ${isActive ? `${item.color} scale-110` : `text-white/40 group-hover:${item.color} group-hover:scale-110`}`}
              >
                {item.icon.split(' M').map((pathD, i) => (
                  <path key={i} d={i === 0 ? pathD : `M${pathD}`} />
                ))}
              </svg>
              <span className={`text-xs uppercase tracking-wider truncate ${isActive ? '' : 'group-hover:text-white'}`}>{item.name}</span>
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-white/10 shrink-0 bg-white/[0.01]">
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 text-white/60 hover:text-[#E5C158] hover:bg-white/5 rounded-xl transition-all group border border-transparent hover:border-[#E5C158]/30"
        >
          <div className="flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-wider">Live Website</span>
          </div>
          <span className="text-xs text-[#E5C158]">↗</span>
        </Link>
      </div>
    </aside>
  );
}
