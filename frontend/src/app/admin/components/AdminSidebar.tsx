"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/admin', color: 'text-emerald-400', activeColor: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
  { name: 'Products', href: '/admin/products', color: 'text-indigo-400', activeColor: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300', icon: 'M20.38 3.46 16 2a8.18 8.18 0 0 0-7.16 2.25 8.18 8.18 0 0 0-2.25 7.16l2.1 2.1-7.1 7.1a2.12 2.12 0 0 0 3 3l7.1-7.1 2.1 2.1a8.18 8.18 0 0 0 7.16-2.25 8.18 8.18 0 0 0 2.25-7.16ZM7.14 12.86l-3.22 3.22M15 5.5l3.5 3.5' },
  { name: 'Categories', href: '/admin/categories', color: 'text-purple-400', activeColor: 'bg-purple-500/15 border-purple-500/40 text-purple-300', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12' },
  { name: 'Category Images', href: '/admin/categories/images', color: 'text-pink-400', activeColor: 'bg-pink-500/15 border-pink-500/40 text-pink-300', icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12' },
  { name: 'Banners', href: '/admin/banners', color: 'text-amber-400', activeColor: 'bg-amber-500/15 border-amber-500/40 text-amber-300', icon: 'M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4 M14 2v6h6 M3 15h6v2H3z M3 11h6v2H3z' },
  { name: 'Media Manager', href: '/admin/media', color: 'text-yellow-400', activeColor: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300', icon: 'M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z' },
  { name: 'Stores', href: '/admin/stores', color: 'text-teal-400', activeColor: 'bg-teal-500/15 border-teal-500/40 text-teal-300', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
  { name: 'Settings', href: '/admin/settings', color: 'text-orange-400', activeColor: 'bg-orange-500/15 border-orange-500/40 text-orange-300', icon: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
  { name: 'Users', href: '/admin/users', color: 'text-cyan-400', activeColor: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' },
  { name: 'Security (2FA)', href: '/admin/security', color: 'text-rose-400', activeColor: 'bg-rose-500/15 border-rose-500/40 text-rose-300', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gradient-to-b from-[#0a0508] via-[#050204] to-[#0a0505] border-r border-white/10 h-screen hidden lg:flex flex-col sticky top-0 shadow-2xl">
      <div className="h-20 flex flex-col items-center justify-center border-b border-white/10 shrink-0 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xl font-serif font-bold gold-gradient tracking-widest uppercase">
            Aranyak
          </span>
        </div>
        <span className="text-[8px] tracking-[0.3em] text-secondary uppercase font-semibold mt-1">
          Admin Portal
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group relative border ${
                isActive 
                  ? `${item.activeColor} shadow-lg backdrop-blur-md` 
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={`transition-transform duration-300 ${isActive ? `${item.color} scale-110` : `text-white/40 group-hover:${item.color} group-hover:scale-110`}`}
              >
                {item.icon.split(' M').map((pathD, i) => (
                  <path key={i} d={i === 0 ? pathD : `M${pathD}`} />
                ))}
              </svg>
              <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? '' : 'group-hover:text-white'}`}>{item.name}</span>
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-white/10 shrink-0">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider">Back to Live Site</span>
        </Link>
      </div>
    </aside>
  );
}
