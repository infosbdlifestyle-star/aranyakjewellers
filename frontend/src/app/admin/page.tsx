"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [rates, setRates] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')) {
      router.push('/login');
      return;
    }
    fetchData();

    // Auto-refresh real-time gold rates every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user, router, isLoading]);

  const fetchData = async () => {
    try {
      const [ratesData, productsData, categoriesData] = await Promise.all([
        api.getGoldPrices(),
        api.getProducts(),
        api.getCategories()
      ]);
      setRates(Array.isArray(ratesData) ? ratesData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleUpdatePrice = async (purity: number, price: number) => {
    if (!token) return;
    setUpdating(true);
    setStatus({ type: '', msg: '' });
    
    try {
      await api.updateGoldPrice(token, purity, price);
      setStatus({ type: 'success', msg: `${purity}KT rate updated successfully!` });
      fetchData();
    } catch (err) {
      setStatus({ type: 'error', msg: 'Failed to update rate. Please try again.' });
    } finally {
      setUpdating(false);
    }
  };

  const handleSyncLiveRates = async () => {
    setUpdating(true);
    try {
      const liveData = await api.resetLiveGoldPrices();
      setRates(Array.isArray(liveData) ? liveData : []);
      setStatus({ type: 'success', msg: '✓ Live real-time market gold prices synced!' });
    } catch {
      setStatus({ type: 'error', msg: 'Failed to sync live rates' });
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading || !user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return null;

  // Compute stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const outOfStock = products.filter(p => p.stockCount === 0).length;
  const rootCategories = categories.filter(c => !c.parentId);

  // Category breakdown
  const categoryBreakdown = rootCategories.map(cat => ({
    name: cat.name,
    slug: cat.slug,
    count: products.filter(p => p.category === cat.name).length,
    subcategories: categories.filter(c => c.parentId === cat.id).map(sub => ({
      name: sub.name,
      count: products.filter(p => p.category === cat.name && p.subCategory === sub.name).length
    })) || []
  }));

  return (
    <main className="p-6 lg:p-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-white/95">
            Admin <span className="gold-gradient font-editorial italic">Control Center</span>
          </h1>
          <p className="text-sm text-white/60 mt-1">Real-time boutique metrics, market rates, and inventory governance.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Backend Connected
          </span>
        </div>
      </div>

      {/* Colorful Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        
        {/* Total Products - Royal Indigo */}
        <div className="bg-gradient-to-br from-indigo-950/70 via-[#18121f]/90 to-[#100a16]/95 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/30 shadow-[0_8px_30px_rgba(99,102,241,0.15)] relative overflow-hidden group hover:border-indigo-400/60 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-15 text-indigo-400 group-hover:opacity-30 group-hover:scale-110 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <p className="text-[11px] text-indigo-300 font-bold uppercase tracking-widest">Total Products</p>
          </div>
          <p className="text-4xl font-extrabold text-white mt-1 relative z-10">{loading ? '...' : totalProducts}</p>
          <span className="inline-block mt-3 text-[10px] text-indigo-300/80 bg-indigo-500/20 px-2.5 py-0.5 rounded-md font-semibold border border-indigo-500/30">
            Catalog Database
          </span>
        </div>

        {/* Active Products - Radiant Emerald */}
        <div className="bg-gradient-to-br from-emerald-950/70 via-[#0e1d17]/90 to-[#08120e]/95 backdrop-blur-md rounded-2xl p-6 border border-emerald-500/30 shadow-[0_8px_30px_rgba(16,185,129,0.15)] relative overflow-hidden group hover:border-emerald-400/60 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-15 text-emerald-400 group-hover:opacity-30 group-hover:scale-110 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <p className="text-[11px] text-emerald-300 font-bold uppercase tracking-widest">Active (Live)</p>
          </div>
          <p className="text-4xl font-extrabold text-emerald-300 mt-1 relative z-10">{loading ? '...' : activeProducts}</p>
          <span className="inline-block mt-3 text-[10px] text-emerald-300/80 bg-emerald-500/20 px-2.5 py-0.5 rounded-md font-semibold border border-emerald-500/30">
            Visible on Website
          </span>
        </div>

        {/* Out of Stock - Vivid Crimson */}
        <div className="bg-gradient-to-br from-rose-950/70 via-[#200e12]/90 to-[#14080a]/95 backdrop-blur-md rounded-2xl p-6 border border-rose-500/30 shadow-[0_8px_30px_rgba(244,63,94,0.15)] relative overflow-hidden group hover:border-rose-400/60 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-15 text-rose-400 group-hover:opacity-30 group-hover:scale-110 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 9-6 6"/><path d="m9 9 6 6"/><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <p className="text-[11px] text-rose-300 font-bold uppercase tracking-widest">Out of Stock</p>
          </div>
          <p className="text-4xl font-extrabold text-rose-400 mt-1 relative z-10">{loading ? '...' : outOfStock}</p>
          <span className="inline-block mt-3 text-[10px] text-rose-300/80 bg-rose-500/20 px-2.5 py-0.5 rounded-md font-semibold border border-rose-500/30">
            {outOfStock === 0 ? '✓ All In Stock' : 'Needs Restock'}
          </span>
        </div>

        {/* Categories - Royal Gold & Amber */}
        <div className="bg-gradient-to-br from-amber-950/70 via-[#211608]/90 to-[#140c04]/95 backdrop-blur-md rounded-2xl p-6 border border-amber-500/30 shadow-[0_8px_30px_rgba(245,158,11,0.15)] relative overflow-hidden group hover:border-amber-400/60 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-15 text-amber-400 group-hover:opacity-30 group-hover:scale-110 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <p className="text-[11px] text-amber-300 font-bold uppercase tracking-widest">Categories</p>
          </div>
          <p className="text-4xl font-extrabold text-amber-300 mt-1 relative z-10">{loading ? '...' : rootCategories.length}</p>
          <span className="inline-block mt-3 text-[10px] text-amber-300/80 bg-amber-500/20 px-2.5 py-0.5 rounded-md font-semibold border border-amber-500/30">
            {categories.length} Total with Subcategories
          </span>
        </div>

        {/* Media Manager - Luminous Golden Glow */}
        <Link href="/admin/media" className="bg-gradient-to-br from-yellow-950/70 via-[#221805]/90 to-[#150f03]/95 backdrop-blur-md rounded-2xl p-6 border border-yellow-500/30 shadow-[0_8px_30px_rgba(234,179,8,0.15)] relative overflow-hidden group hover:border-yellow-400/60 transition-all duration-300 block">
          <div className="absolute top-0 right-0 p-4 opacity-15 text-yellow-400 group-hover:opacity-30 group-hover:scale-110 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <p className="text-[11px] text-yellow-300 font-bold uppercase tracking-widest">Media Manager</p>
          </div>
          <p className="text-4xl font-extrabold text-yellow-300 mt-1 relative z-10">24</p>
          <span className="inline-block mt-3 text-[10px] text-yellow-300/80 bg-yellow-500/20 px-2.5 py-0.5 rounded-md font-semibold border border-yellow-500/30">
            Zero-Code Photo Control →
          </span>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Real-Time Gold Rate Manager - Rich Luxury Styling */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#160d0b]/90 via-[#0d0706]/95 to-[#120a08]/90 backdrop-blur-md rounded-2xl border border-amber-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02]">
            <div>
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  🪙
                </span>
                Real-Time Gold Rate Manager
              </h2>
              <p className="text-xs text-amber-300/70 mt-1 uppercase tracking-wider flex items-center gap-2 font-semibold">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]"></span>
                Live Market Sync Active (Price per 10g)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSyncLiveRates}
                disabled={updating}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-black font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-50"
              >
                <span>⚡ Sync Live Market Rates</span>
              </button>

              {status.msg && (
                <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2 shadow-lg ${
                  status.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}>
                  {status.msg}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 flex-1">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-16 bg-white/5 rounded-xl" />
                <div className="h-16 bg-white/5 rounded-xl" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { purity: 24, label: '24KT Royal Gold', color: 'from-amber-500 to-yellow-400', border: 'hover:border-amber-400/60', badge: 'bg-amber-400/20 text-amber-300 border-amber-400/40', purityTag: '99.9% Pure' },
                  { purity: 22, label: '22KT Hallmark Standard', color: 'from-orange-500 to-amber-400', border: 'hover:border-orange-400/60', badge: 'bg-orange-400/20 text-orange-300 border-orange-400/40', purityTag: '91.6% Pure' },
                  { purity: 18, label: '18KT Diamond Jewellery', color: 'from-rose-500 to-pink-400', border: 'hover:border-rose-400/60', badge: 'bg-rose-400/20 text-rose-300 border-rose-400/40', purityTag: '75.0% Pure' },
                  { purity: 9, label: '9KT Antique Accent', color: 'from-slate-400 to-slate-200', border: 'hover:border-slate-400/60', badge: 'bg-slate-400/20 text-slate-300 border-slate-400/40', purityTag: '37.5% Pure' },
                ].map(({ purity, label, border, badge, purityTag }) => {
                  const currentRate = rates.find(r => r.purity === purity);
                  return (
                    <div key={purity} className={`p-5 bg-black/50 rounded-2xl border border-white/10 space-y-4 group ${border} transition-all duration-300 shadow-inner relative overflow-hidden`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-bold text-white uppercase tracking-wider block">{label}</span>
                          <span className="text-[10px] text-white/50">{purityTag}</span>
                        </div>
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badge}`}>
                          ₹{(currentRate?.pricePer10g || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <div className="relative flex-1 rounded-xl overflow-hidden border border-white/15 focus-within:border-amber-400 transition-colors">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-sm">₹</span>
                          <input 
                            type="number" 
                            defaultValue={currentRate?.pricePer10g || 0}
                            id={`purity-${purity}`}
                            className="w-full bg-[#050202] pl-8 pr-3 py-2.5 text-sm font-bold text-white outline-none"
                          />
                        </div>
                        <button 
                          disabled={updating}
                          onClick={() => {
                            const input = document.getElementById(`purity-${purity}`) as HTMLInputElement;
                            handleUpdatePrice(purity, Number(input.value));
                          }}
                          className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-black px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 whitespace-nowrap shadow-md"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Colorful Category Inventory Breakdown */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#120a16]/90 via-[#0a050f]/95 to-[#0e0712]/90 backdrop-blur-md rounded-2xl border border-purple-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.7)] overflow-hidden">
            <div className="p-6 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 text-sm">🗂️</span>
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">Inventory Breakdown</h2>
              </div>
              <p className="text-[10px] text-purple-300/70 mt-1 uppercase tracking-wider font-semibold">Live Products by Category</p>
            </div>
            <div className="p-4 space-y-2.5 max-h-[420px] overflow-y-auto custom-scrollbar">
              {categoryBreakdown.map((cat, idx) => {
                const colorPalette = [
                  { border: 'border-amber-500/30', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40', dot: 'bg-amber-400' },
                  { border: 'border-cyan-500/30', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', dot: 'bg-cyan-400' },
                  { border: 'border-slate-400/30', badge: 'bg-slate-400/20 text-slate-300 border-slate-400/40', dot: 'bg-slate-300' },
                  { border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', dot: 'bg-emerald-400' },
                  { border: 'border-rose-500/30', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40', dot: 'bg-rose-400' },
                ][idx % 5];

                return (
                  <div key={cat.slug} className={`p-3.5 bg-black/40 rounded-xl border ${colorPalette.border} hover:bg-white/[0.03] transition-all`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${colorPalette.dot}`} />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{cat.name}</span>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${colorPalette.badge}`}>
                        {cat.count} items
                      </span>
                    </div>
                    {cat.subcategories.length > 0 && (
                      <div className="mt-2.5 ml-2 space-y-1.5 border-l border-white/10 pl-3">
                        {cat.subcategories.map((sub) => (
                          <div key={sub.name} className="flex items-center justify-between text-[10px]">
                            <span className="text-white/60 uppercase tracking-wider">{sub.name}</span>
                            <span className={`font-bold ${sub.count > 0 ? 'text-white' : 'text-white/30'}`}>{sub.count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
