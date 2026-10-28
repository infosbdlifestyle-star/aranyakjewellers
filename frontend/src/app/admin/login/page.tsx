"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [step, setStep] = useState<'LOGIN' | 'TOTP'>('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  const { user, isAuthenticated, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  // If already logged in as admin, redirect immediately
  useEffect(() => {
    if (isAuthenticated && (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'STAFF')) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, user, router, redirectUrl]);

  // Handle brute-force lockout countdown
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  const recordFailedAttempt = () => {
    const key = 'aranyak_admin_fail_attempts';
    const raw = sessionStorage.getItem(key);
    let attempts = raw ? parseInt(raw, 10) : 0;
    attempts += 1;
    sessionStorage.setItem(key, attempts.toString());

    if (attempts >= 5) {
      setLockoutRemaining(60);
      sessionStorage.setItem(key, '0');
      setError('Too many unsuccessful attempts. Security hold active for 60 seconds.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.login(email, password, step === 'TOTP' ? totpCode : undefined);

      if (res?.requiresTotp) {
        setStep('TOTP');
        setLoading(false);
        return;
      }

      if (res?.access_token) {
        // Enforce administrative authorization
        const userRole = res.user?.role;
        if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN' && userRole !== 'STAFF') {
          setError('Access Denied: This portal requires Administrative or Editor credentials.');
          setLoading(false);
          return;
        }

        // Clear failed attempts upon success
        sessionStorage.removeItem('aranyak_admin_fail_attempts');
        login(res.access_token, res.user);
        router.push(redirectUrl);
      } else {
        recordFailedAttempt();
        setError(res?.message || 'Invalid administrative credentials.');
      }
    } catch (err: any) {
      recordFailedAttempt();
      setError(err?.message || 'Authentication error. Please verify backend connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#070303] text-white relative overflow-hidden">
      {/* Ambient Gold Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-[#E5C158]/10 via-[#C5A059]/5 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#8B1E1E]/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Crest & Header */}
        <div className="text-center mb-8 space-y-3">
          <Link href="/" className="inline-block group">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-b from-[#241313] to-[#0A0505] border-2 border-[#E5C158]/60 flex items-center justify-center shadow-[0_0_25px_rgba(203,161,53,0.3)] group-hover:scale-105 transition-transform">
              <span className="font-serif text-2xl text-[#E5C158] font-light">✦</span>
            </div>
          </Link>
          <div className="space-y-1">
            <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-white">
              Aranyak <span className="gold-gradient italic font-normal">Console</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#E5C158] font-bold">
              Secure Administrative Gateway
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-gradient-to-br from-[#140A0A]/95 via-[#0E0606]/95 to-[#120808]/95 border border-[#C5A059]/30 rounded-2xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-md relative overflow-hidden">
          {/* Top Gold Trim Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5C158] to-transparent" />

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-700/50 text-red-300 text-xs font-medium flex items-start gap-2.5 animate-in fade-in">
              <span className="text-red-400 font-bold mt-0.5">✕</span>
              <p className="leading-relaxed flex-1">{error}</p>
            </div>
          )}

          {lockoutRemaining > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-700/50 text-amber-300 text-xs font-medium flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <p>Security hold active: Retry in {lockoutRemaining} seconds</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 'LOGIN' ? (
              <>
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158] mb-2">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@aranyak.com"
                      autoComplete="email"
                      className="w-full bg-[#080404] border border-white/15 focus:border-[#E5C158] rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:ring-1 focus:ring-[#E5C158]/50"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158]">
                      Master Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[10px] uppercase tracking-wider text-white/40 hover:text-[#E5C158] transition-colors"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      className="w-full bg-[#080404] border border-white/15 focus:border-[#E5C158] rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:ring-1 focus:ring-[#E5C158]/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="p-4 rounded-xl bg-[#E5C158]/10 border border-[#E5C158]/30 text-xs text-[#E5C158] space-y-1">
                  <p className="font-bold uppercase tracking-wider">Two-Factor Protected</p>
                  <p className="text-white/70">Enter the 6-digit verification code from Google or Microsoft Authenticator.</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158] mb-2">
                    6-Digit Security Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    required
                    autoFocus
                    placeholder="000000"
                    className="w-full bg-[#080404] border border-white/15 focus:border-[#E5C158] rounded-xl px-4 py-3.5 text-center text-xl font-mono tracking-widest text-white outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || lockoutRemaining > 0}
              className="w-full py-3.5 bg-gradient-to-r from-[#E5C158] to-[#C5A059] hover:from-[#F3E5AB] hover:to-[#E5C158] text-[#120808] text-xs font-bold uppercase tracking-[0.25em] rounded-xl transition-all shadow-[0_4px_20px_rgba(203,161,53,0.3)] disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Verifying Clearance...
                </>
              ) : step === 'LOGIN' ? (
                'Authenticate & Open Console'
              ) : (
                'Verify & Proceed'
              )}
            </button>
          </form>

          {step === 'TOTP' && (
            <button
              type="button"
              onClick={() => setStep('LOGIN')}
              className="mt-4 w-full text-center text-xs text-white/50 hover:text-white uppercase tracking-wider font-semibold transition-colors"
            >
              ← Back to Password Entry
            </button>
          )}

          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span>←</span>
              <span>Live Website</span>
            </Link>
            <span className="font-mono text-[10px] text-[#E5C158]/60">SSL 256-Bit Encrypted</span>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-white/40 tracking-wider mt-6 max-w-sm mx-auto">
          Authorized personnel only. All access attempts, IP addresses, and management operations are audited.
        </p>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#0E0707] flex items-center justify-center text-white/50 text-xs tracking-widest uppercase">
        Loading Admin Portal...
      </div>
    }>
      <AdminLoginForm />
    </React.Suspense>
  );
}
