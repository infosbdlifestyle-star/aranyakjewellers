"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')) {
      router.push('/login');
      return;
    }

    fetchRates();
  }, [isAuthenticated, user, router]);

  const fetchRates = async () => {
    try {
      const data = await api.getGoldPrices();
      setRates(Array.isArray(data) ? data : []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleUpdatePrice = async (purity: number, price: number) => {
    if (!token) return;
    setUpdating(true);
    setStatus({ type: '', msg: '' });
    
    try {
      await api.updateGoldPrice(token, purity, price);
      setStatus({ type: 'success', msg: `${purity}KT rate updated successfully.` });
      fetchRates();
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to update rate.' });
    } finally {
      setUpdating(false);
    }
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return null;

  return (
    <main className="min-h-screen flex flex-col bg-ivory">
      <Header />
      
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary italic">Administrative Portal</h1>
              <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mt-2">Manage Master Data & Operations</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase px-3 py-1 bg-secondary text-primary">{user.role}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Gold Rate Management */}
            <div className="bg-white p-8 border border-border shadow-sm">
              <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary mb-8">Gold Rate Manager</h2>
              
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-20 bg-ivory" />
                  <div className="h-20 bg-ivory" />
                </div>
              ) : (
                <div className="space-y-6">
                  {[9, 18, 22, 24].map((purity) => {
                    const currentRate = rates.find(r => r.purity === purity);
                    return (
                      <div key={purity} className="p-4 border border-ivory bg-ivory/30 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-primary">{purity}KT Gold</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Per 10g</span>
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            defaultValue={currentRate?.pricePer10g || 0}
                            id={`purity-${purity}`}
                            className="flex-1 bg-white border border-border px-4 py-2 text-sm outline-none focus:border-secondary"
                          />
                          <button 
                            disabled={updating}
                            onClick={() => {
                              const input = document.getElementById(`purity-${purity}`) as HTMLInputElement;
                              handleUpdatePrice(purity, Number(input.value));
                            }}
                            className="bg-primary text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-all disabled:opacity-50"
                          >
                            Update
                          </button>
                        </div>
                        {currentRate && (
                          <p className="text-[9px] text-muted-foreground italic">Last Updated: {new Date(currentRate.updatedAt).toLocaleString()}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {status.msg && (
                <div className={`mt-6 p-4 text-[10px] font-bold uppercase tracking-widest text-center ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {status.msg}
                </div>
              )}
            </div>

            {/* Quick Stats / Actions */}
            <div className="space-y-8">
              <div className="bg-white p-8 border border-border shadow-sm">
                <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-secondary mb-8">Operational Summary</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary text-white text-center">
                    <p className="text-[9px] uppercase tracking-widest opacity-70">Total Products</p>
                    <p className="text-2xl font-serif font-bold mt-2">--</p>
                  </div>
                  <div className="p-4 bg-secondary text-primary text-center">
                    <p className="text-[9px] uppercase tracking-widest opacity-70">Pending Orders</p>
                    <p className="text-2xl font-serif font-bold mt-2">--</p>
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <Link href="/admin/products" className="w-full text-left p-4 border border-border hover:border-secondary transition-all flex items-center justify-between group">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Inventory Management</span>
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </Link>
                  <button className="w-full text-left p-4 border border-border hover:border-secondary transition-all flex items-center justify-between group">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Order Fulfillment</span>
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </button>
                </div>
              </div>

              <div className="p-8 burgundy-gradient text-white">
                <h3 className="text-xl font-serif italic mb-4">Security Advisory</h3>
                <p className="text-[10px] text-ivory/60 leading-relaxed uppercase tracking-wider">
                  You are in a restricted area. All administrative actions are logged and audited for security. Ensure gold rates are verified before publishing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
