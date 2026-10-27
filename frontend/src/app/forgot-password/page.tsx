"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await api.forgotPassword(email);
      if (res.success) {
        setMessage(res.message);
      } else {
        setError(res.message || 'Failed to send reset link');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F8F4EC] text-[#76551C]">
      <section className="flex-1 flex items-center justify-center py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-banner.png')] bg-cover bg-center opacity-10 mix-blend-luminosity" />

        <div className="w-full max-w-md bg-[#211813] text-[#FFF8EC] p-10 shadow-2xl border border-[#DED2C1]/20 relative z-10 rounded-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#A77C32] via-[#C49A45] to-[#A77C32] rounded-t-2xl" />
          
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-3xl font-serif font-light text-[#FFF8EC]">Reset Password</h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#E5D9C8] font-bold">We will send you a reset link</p>
          </div>

          {message ? (
            <div className="text-center space-y-6">
              <p className="text-sm text-green-400 bg-green-900/30 border border-green-800/40 p-4 rounded">{message}</p>
              <Link href="/login" className="btn-luxury py-3 w-full block text-[10px] uppercase tracking-widest font-bold">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#D6B15D] ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#211813] border-b border-[#DED2C1]/30 px-3 py-3 text-sm text-[#FFF8EC] placeholder-white/30 focus:border-[#D6B15D] outline-none transition-all rounded-t"
                  placeholder="Enter your email"
                />
              </div>

              {error && <p className="text-xs text-red-400 bg-red-900/30 border border-red-800/40 p-3 text-center font-medium rounded">{error}</p>}

              <div className="pt-4 space-y-4">
                <button type="submit" disabled={loading} className="w-full btn-luxury py-4 font-bold text-[10px] tracking-[0.4em] uppercase shadow-xl disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <div className="text-center">
                  <Link href="/login" className="inline-block text-[10px] text-[#D6B15D] hover:text-[#FFF8EC] transition-colors uppercase tracking-widest font-bold">Back to Login</Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
