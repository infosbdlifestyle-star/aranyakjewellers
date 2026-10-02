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
    <main className="min-h-screen flex flex-col bg-[#050202] text-white">
      
      <section className="flex-1 flex items-center justify-center py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
        <div className="absolute inset-0 silk-texture opacity-20 mix-blend-overlay" />

        <div className="w-full max-w-md bg-[#0A0505] p-10 shadow-2xl border border-white/10 relative z-10">
          {/* Decorative element */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-secondary" />
          
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-3xl font-serif font-light text-white">Welcome Back</h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-bold">Access your curated collections</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 'LOGIN' ? (
              <>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/50 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#050202] border-b border-white/20 px-0 py-3 text-sm text-white placeholder-white/30 focus:border-white outline-none transition-all"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/50 ml-1">Password</label>
                    <Link href="/forgot-password" title="Coming soon" className="text-[9px] text-secondary/70 hover:text-secondary uppercase tracking-widest font-bold">Forgot?</Link>
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#050202] border-b border-white/20 px-0 py-3 text-sm text-white placeholder-white/30 focus:border-white outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/50 ml-1">Authenticator Code</label>
                <input 
                  type="text" 
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full bg-[#050202] border-b border-white/20 px-0 py-3 text-center tracking-widest text-lg text-white placeholder-white/30 focus:border-white outline-none transition-all"
                  placeholder="000000"
                />
                <p className="text-[10px] text-white/40 text-center mt-2">Enter the 6-digit code from your authenticator app.</p>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-400 bg-red-900/30 border border-red-800/40 p-3 text-center font-medium">{error}</p>
            )}

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-luxury py-4 font-bold text-[10px] tracking-[0.4em] uppercase shadow-xl disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-white/10 text-center space-y-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold">Don't have an account?</p>
            <Link 
              href="/register" 
              className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase text-white hover-underline-gold pb-1"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
