"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid or missing reset token.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await api.resetPassword(token, password);
      if (res.success) {
        setMessage('Password reset successfully! You can now log in.');
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(res.message || 'Failed to reset password');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-secondary" />
          
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-3xl font-serif font-light text-white">New Password</h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-bold">Set your new password</p>
          </div>

          {message ? (
            <div className="text-center space-y-6">
              <p className="text-sm text-green-400 bg-green-900/30 border border-green-800/40 p-4">{message}</p>
              <p className="text-xs text-white/50">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/50 ml-1">New Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!token}
                  className="w-full bg-[#050202] border-b border-white/20 px-0 py-3 text-sm text-white placeholder-white/30 focus:border-white outline-none transition-all disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/50 ml-1">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={!token}
                  className="w-full bg-[#050202] border-b border-white/20 px-0 py-3 text-sm text-white placeholder-white/30 focus:border-white outline-none transition-all disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-xs text-red-400 bg-red-900/30 border border-red-800/40 p-3 text-center font-medium">{error}</p>}

              <div className="pt-4">
                <button type="submit" disabled={loading || !token} className="w-full btn-luxury py-4 font-bold text-[10px] tracking-[0.4em] uppercase shadow-xl disabled:opacity-50">
                  {loading ? 'Saving...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
