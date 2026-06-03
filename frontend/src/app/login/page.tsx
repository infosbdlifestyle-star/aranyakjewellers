"use client";

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await api.login(email, password);
      if (data.access_token) {
        login(data.access_token, data.user);
        router.push('/account');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <Header />
      
      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-white p-10 shadow-2xl border border-border relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-secondary" />
          
          <div className="text-center space-y-4 mb-10">
            <h1 className="text-3xl font-serif font-bold text-primary italic">Welcome Back</h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Access your curated collections</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest uppercase text-primary ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-ivory border border-border px-4 py-4 text-sm focus:border-secondary outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold tracking-widest uppercase text-primary ml-1">Password</label>
                <Link href="/forgot-password" title="Coming soon" className="text-[9px] text-muted-foreground hover:text-secondary uppercase tracking-tighter">Forgot?</Link>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-ivory border border-border px-4 py-4 text-sm focus:border-secondary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-3 text-center font-medium">{error}</p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-4 font-bold text-xs tracking-[0.3em] uppercase hover:bg-secondary transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-border text-center space-y-4">
            <p className="text-xs text-muted-foreground">Don't have an account?</p>
            <Link 
              href="/register" 
              className="inline-block text-[10px] font-bold tracking-widest uppercase text-primary border-b border-primary/20 pb-1 hover:border-secondary hover:text-secondary transition-all"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
