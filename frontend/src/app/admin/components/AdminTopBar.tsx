"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminTopBar() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="bg-[#0A0505]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 h-20 flex items-center px-6 lg:px-10 justify-between">
      {/* Mobile Menu Toggle placeholder (for mobile support later if needed) */}
      <div className="lg:hidden flex items-center gap-4">
        <span className="text-sm font-serif font-bold gold-gradient uppercase tracking-widest">
          Aranyak
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-2">
        {/* Breadcrumb space or contextual title could go here */}
      </div>

      <div className="flex items-center gap-6 ml-auto">
        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-xl transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-[#F9F6ED] flex items-center justify-center text-[#050202] font-bold shadow-[0_0_15px_rgba(179,139,63,0.3)] border-2 border-white/10">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-white/90 leading-tight">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-secondary uppercase tracking-widest font-bold mt-0.5">{user?.role || 'Admin'}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1515] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
