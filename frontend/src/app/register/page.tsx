"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.register({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim() || undefined,
        password,
      });

      if (res && (res.access_token || res.id || res.user)) {
        if (res.access_token && res.user) {
          login(res.access_token, res.user);
          router.push('/account');
        } else {
          const loginRes = await api.login(email.trim(), password);
          if (loginRes && loginRes.access_token) {
            login(loginRes.access_token, loginRes.user);
            router.push('/account');
          } else {
            router.push('/login?registered=true');
          }
        }
      } else {
        setError(res?.message || 'Registration failed. Email may already be in use.');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F8F4EC] text-[#30231D]">
      <section className="flex-1 flex items-center justify-center py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] bg-cover bg-center opacity-10 mix-blend-luminosity" />

        <div className="w-full max-w-lg bg-[#211713] text-[#F8F1E5] p-8 md:p-12 shadow-2xl border border-[#DED2C1]/20 relative z-10 rounded-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#A77C32] via-[#C49A45] to-[#A77C32] rounded-t-2xl" />

          <div className="text-center space-y-3 mb-8">
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#C49A45] font-bold">Aranyak Privé</span>
            <h1 className="text-3xl font-serif font-light text-[#F8F1E5]">Create Your Account</h1>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#D4C5B2] font-medium">
              Join our royal patron circle for bespoke jewellery experiences
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C49A45] ml-1">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#30231D] border-b border-[#DED2C1]/30 px-3 py-2.5 text-sm text-[#F8F1E5] placeholder-white/30 focus:border-[#C49A45] outline-none transition-colors rounded-t"
                placeholder="e.g. Maharani Ananya Roy"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C49A45] ml-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#30231D] border-b border-[#DED2C1]/30 px-3 py-2.5 text-sm text-[#F8F1E5] placeholder-white/30 focus:border-[#C49A45] outline-none transition-colors rounded-t"
                  placeholder="name@domain.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C49A45] ml-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-[#30231D] border-b border-[#DED2C1]/30 px-3 py-2.5 text-sm text-[#F8F1E5] placeholder-white/30 focus:border-[#C49A45] outline-none transition-colors rounded-t"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C49A45] ml-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-[#30231D] border-b border-[#DED2C1]/30 px-3 py-2.5 text-sm text-[#F8F1E5] placeholder-white/30 focus:border-[#C49A45] outline-none transition-colors rounded-t"
                  placeholder="Min. 6 characters"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C49A45] ml-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-[#30231D] border-b border-[#DED2C1]/30 px-3 py-2.5 text-sm text-[#F8F1E5] placeholder-white/30 focus:border-[#C49A45] outline-none transition-colors rounded-t"
                  placeholder="Re-type password"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/40 p-3 text-center font-medium rounded">
                {error}
              </p>
            )}

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-luxury py-4 font-bold text-[10px] tracking-[0.4em] uppercase shadow-xl disabled:opacity-50"
              >
                {loading ? 'Registering Account...' : 'Complete Registration'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[#DED2C1]/20 text-center space-y-3">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#D4C5B2] font-semibold">
              Already have an account?
            </p>
            <Link
              href="/login"
              className="inline-block text-[11px] font-bold tracking-[0.3em] uppercase text-[#C49A45] hover:text-[#F8F1E5] transition-colors border-b border-[#C49A45]/50 pb-1"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
