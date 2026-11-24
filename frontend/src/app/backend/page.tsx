"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PermanentBackendAccessPage() {
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('aranyak_token');
    if (savedToken && savedToken !== 'demo_admin_jwt_token_2026') {
      router.push('/admin');
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050202] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 border-2 border-[#CBA135] border-t-transparent rounded-full animate-spin mb-6"></div>
      <h1 className="text-2xl font-serif text-[#CBA135] mb-2">Redirecting to Backend Portal</h1>
      <p className="text-xs text-white/50 tracking-widest uppercase">Opening administrative portal...</p>
    </div>
  );
}
