"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [step, setStep] = useState<'LOGIN' | 'TOTP'>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.login(email, password, step === 'TOTP' ? totpCode : undefined);
      
      if (res.requiresTotp) {
        setStep('TOTP');
        return;
      }

      if (res.access_token) {
        login(res.access_token, res.user);
        // Redirect admins to admin dashboard
        if (res.user?.role === 'SUPER_ADMIN' || res.user?.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F8F4EC] text-[#76551C]">
      
      <section className="flex-1 flex items-center justify-center py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] bg-cover bg-center opacity-10 mix-blend-luminosity" />

        <div className="w-full max-w-md bg-[#211813] text-[#FFF8EC] p-10 shadow-2xl border border-[#DED2C1]/20 relative z-10 rounded-2xl">
          {/* Decorative element */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#A77C32] via-[#C49A45] to-[#A77C32] rounded-t-2xl" />
          
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-3xl font-serif font-light text-[#FFF8EC]">Welcome Back</h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#E5D9C8] font-bold">Access your curated collections</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 'LOGIN' ? (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#D6B15D] ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#211813] border-b border-[#DED2C1]/30 px-3 py-3 text-sm text-[#FFF8EC] placeholder-white/30 focus:border-[#D6B15D] outline-none transition-all rounded-t"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#D6B15D] ml-1">Password</label>
                    <Link href="/forgot-password" title="Coming soon" className="text-[10px] text-[#D6B15D] hover:text-[#FFF8EC] uppercase tracking-wider font-bold">Forgot?</Link>
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#211813] border-b border-[#DED2C1]/30 px-3 py-3 text-sm text-[#FFF8EC] placeholder-white/30 focus:border-[#D6B15D] outline-none transition-all rounded-t"
                    placeholder="••••••••"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#D6B15D] ml-1">Authenticator Code</label>
                <input 
                  type="text" 
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full bg-[#211813] border-b border-[#DED2C1]/30 px-3 py-3 text-center tracking-widest text-lg text-[#FFF8EC] placeholder-white/30 focus:border-[#D6B15D] outline-none transition-all rounded-t"
                  placeholder="000000"
                />
                <p className="text-[11px] text-[#E5D9C8] text-center mt-2 font-medium">Enter the 6-digit code from your authenticator app.</p>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-400 bg-red-900/30 border border-red-800/40 p-3 text-center font-medium rounded">{error}</p>
            )}

            <div className="pt-4 space-y-3">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-luxury py-4 font-bold text-[10px] tracking-[0.4em] uppercase shadow-xl disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('admin@aranyakjewellers.com');
                  setPassword('Aranyak@2026');
                  handleSubmit({ preventDefault: () => {} } as any);
                }}
                className="w-full border border-[#D6B15D]/50 text-[#D6B15D] hover:bg-[#C49A45]/10 py-3 text-[10px] font-bold tracking-[0.3em] uppercase transition-all rounded"
              >
                ⚡ Quick Admin Login (Demo)
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-[#DED2C1]/20 text-center space-y-4">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#E5D9C8] font-semibold">Don't have an account?</p>
            <Link 
              href="/register" 
              className="inline-block text-[11px] font-bold tracking-[0.3em] uppercase text-[#D6B15D] hover:text-[#FFF8EC] transition-colors border-b border-[#D6B15D]/50 pb-1"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
