"use client";

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
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-light tracking-tight text-white/90">Dashboard <span className="text-secondary italic">Overview</span></h1>
        <p className="text-sm text-white/50 mt-1">Manage your boutique&apos;s digital presence.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-[#1A1515]/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <p className="text-xs text-white/50 font-medium uppercase tracking-widest relative z-10">Total Products</p>
          <p className="text-4xl font-bold text-white mt-3 relative z-10">{loading ? '...' : totalProducts}</p>
        </div>

        <div className="bg-[#1A1515]/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden group hover:border-secondary/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-secondary group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          </div>
          <p className="text-xs text-white/50 font-medium uppercase tracking-widest relative z-10">Active (Live)</p>
          <p className="text-4xl font-bold text-secondary mt-3 relative z-10">{loading ? '...' : activeProducts}</p>
        </div>

        <div className="bg-[#1A1515]/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden group hover:border-red-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 9-6 6"/><path d="m9 9 6 6"/><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
          </div>
          <p className="text-xs text-white/50 font-medium uppercase tracking-widest relative z-10">Out of Stock</p>
          <p className="text-4xl font-bold text-red-400 mt-3 relative z-10">{loading ? '...' : outOfStock}</p>
        </div>

        <div className="bg-[#1A1515]/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-500 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
          </div>
          <p className="text-xs text-white/50 font-medium uppercase tracking-widest relative z-10">Categories</p>
          <p className="text-4xl font-bold text-blue-400 mt-3 relative z-10">{loading ? '...' : rootCategories.length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Gold Rate Manager */}
        <div className="lg:col-span-2 bg-[#1A1515]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif font-medium text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Gold Rate Manager
              </h2>
              <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">Update today&apos;s rates (per 10g)</p>
            </div>
            {status.msg && (
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2 ${
                status.type === 'success' ? 'bg-secondary/20 text-secondary border border-secondary/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {status.msg}
              </div>
            )}
          </div>
          
          <div className="p-6 flex-1">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-16 bg-white/5 rounded-xl" />
                <div className="h-16 bg-white/5 rounded-xl" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {[9, 18, 22, 24].map((purity) => {
                  const currentRate = rates.find(r => r.purity === purity);
                  return (
                    <div key={purity} className="p-5 bg-black/40 rounded-xl border border-white/5 space-y-4 group hover:border-secondary/30 transition-all shadow-inner">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-white/90 uppercase tracking-widest">{purity}KT Gold</span>
                        {currentRate && (
                          <span className="text-[10px] text-white/30 uppercase tracking-wider">
                            {new Date(currentRate.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <div className="relative flex-1 group-hover:shadow-[0_0_15px_rgba(179,139,63,0.1)] transition-all rounded-lg">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-medium">₹</span>
                          <input 
                            type="number" 
                            defaultValue={currentRate?.pricePer10g || 0}
                            id={`purity-${purity}`}
                            className="w-full bg-[#050202] border border-white/10 rounded-lg pl-9 pr-4 py-3 text-sm text-white outline-none focus:border-secondary transition-all"
                          />
                        </div>
                        <button 
                          disabled={updating}
                          onClick={() => {
                            const input = document.getElementById(`purity-${purity}`) as HTMLInputElement;
                            handleUpdatePrice(purity, Number(input.value));
                          }}
                          className="bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary hover:text-[#050202] px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 whitespace-nowrap"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-[#1A1515]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-sm font-semibold text-white/90 uppercase tracking-widest">Inventory Breakdown</h2>
              <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">Products per category</p>
            </div>
            <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
              {categoryBreakdown.map((cat) => (
                <div key={cat.slug} className="p-3 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{cat.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      cat.count > 0 ? 'bg-secondary/20 text-secondary border-secondary/30' : 'bg-white/5 text-white/40 border-white/10'
                    }`}>{cat.count}</span>
                  </div>
                  {cat.subcategories.length > 0 && (
                    <div className="mt-3 ml-2 space-y-2 border-l border-white/10 pl-3">
                      {cat.subcategories.map((sub) => (
                        <div key={sub.name} className="flex items-center justify-between">
                          <span className="text-[10px] text-white/50 uppercase tracking-wider">{sub.name}</span>
                          <span className={`text-[9px] font-bold ${sub.count > 0 ? 'text-white/70' : 'text-white/30'}`}>{sub.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
