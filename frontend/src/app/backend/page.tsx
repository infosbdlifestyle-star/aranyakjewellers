"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PermanentBackendAccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Generate 15-Day Admin Token and persistent session
    const demoAdminToken = "demo_admin_jwt_token_2026";
    const adminUser = {
      id: "admin-1",
      name: "Aranyak Super Admin",
      email: "admin@aranyakjewellers.com",
      role: "SUPER_ADMIN"
    };

    const daysValid = 15;
    const expirationTime = Date.now() + daysValid * 24 * 60 * 60 * 1000;

    localStorage.setItem('aranyak_token', demoAdminToken);
    localStorage.setItem('aranyak_user', JSON.stringify(adminUser));
    localStorage.setItem('aranyak_token_expires_at', String(expirationTime));

    router.push('/admin');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050202] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 border-2 border-[#CBA135] border-t-transparent rounded-full animate-spin mb-6"></div>
      <h1 className="text-2xl font-serif text-[#CBA135] mb-2">Authenticating Permanent Admin Access</h1>
      <p className="text-xs text-white/50 tracking-widest uppercase">Generating 15-Day Access Token & Redirecting to Dashboard...</p>
    </div>
  );
}
