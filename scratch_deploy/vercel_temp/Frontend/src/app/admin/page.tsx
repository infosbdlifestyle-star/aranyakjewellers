"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { CATEGORIES } from '@/constants/categories';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [rates, setRates] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, user, router]);

  const fetchData = async () => {
    try {
      const [ratesData, productsData] = await Promise.all([
        api.getGoldPrices(),
        api.getProducts()
      ]);
      setRates(Array.isArray(ratesData) ? ratesData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
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

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return null;

  // Compute stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const outOfStock = products.filter(p => p.stockCount === 0).length;

  // Category breakdown
  const categoryBreakdown = CATEGORIES.map(cat => ({
    name: cat.name,
    slug: cat.slug,
    count: products.filter(p => p.category === cat.name).length,
    subcategories: cat.subcategories?.map(sub => ({
      name: sub.name,
      count: products.filter(p => p.category === cat.name && p.subCategory === sub.name).length
    })) || []
  }));

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFAF8]">
      
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-all" title="Back to Website">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">Welcome, {user.name}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase px-3 py-1 bg-gray-900 text-white rounded-full">{user.role}</span>
          </div>
        </div>
      </div>

      <section className="flex-1 py-6">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : totalProducts}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium">Active (Live)</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{loading ? '...' : activeProducts}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium">Out of Stock</p>
              <p className="text-3xl font-bold text-red-500 mt-2">{loading ? '...' : outOfStock}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium">Categories</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{CATEGORIES.length}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Gold Rate Manager */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Gold Rate Manager
                </h2>
                <p className="text-xs text-gray-500 mt-1">Update today&apos;s gold rates (per 10 grams)</p>
              </div>
              
              <div className="p-5">
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-16 bg-gray-100 rounded-lg" />
                    <div className="h-16 bg-gray-100 rounded-lg" />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {[9, 18, 22, 24].map((purity) => {
                      const currentRate = rates.find(r => r.purity === purity);
                      return (
                        <div key={purity} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-900">{purity}KT Gold</span>
                            {currentRate && (
                              <span className="text-[10px] text-gray-400">
                                Updated: {new Date(currentRate.updatedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                              <input 
                                type="number" 
                                defaultValue={currentRate?.pricePer10g || 0}
                                id={`purity-${purity}`}
                                className="w-full bg-white border border-gray-200 rounded-lg pl-7 pr-4 py-2 text-sm outline-none focus:border-gray-400 transition-all"
                              />
                            </div>
                            <button 
                              disabled={updating}
                              onClick={() => {
                                const input = document.getElementById(`purity-${purity}`) as HTMLInputElement;
                                handleUpdatePrice(purity, Number(input.value));
                              }}
                              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-gray-800 transition-all disabled:opacity-50 whitespace-nowrap"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {status.msg && (
                  <div className={`mt-4 p-3 rounded-lg text-sm font-medium text-center ${
                    status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {status.msg}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-900">Quick Actions</h2>
                </div>
                <div className="p-3 space-y-1">
                  <Link href="/admin/products" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">Product Management</span>
                        <p className="text-[10px] text-gray-400">{totalProducts} products</p>
                      </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all"><path d="m9 18 6-6-6-6"/></svg>
                  </Link>
                  <Link href="/" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900">View Live Website</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all"><path d="m9 18 6-6-6-6"/></svg>
                  </Link>
                </div>
              </div>

              {/* Category Inventory Breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-200">
                  <h2 className="text-sm font-semibold text-gray-900">Inventory by Category</h2>
                  <p className="text-xs text-gray-500 mt-1">Products per category & subcategory</p>
                </div>
                <div className="p-3 space-y-1 max-h-[400px] overflow-y-auto">
                  {categoryBreakdown.map((cat) => (
                    <div key={cat.slug} className="p-3 rounded-lg hover:bg-gray-50 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          cat.count > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-400'
                        }`}>{cat.count}</span>
                      </div>
                      {cat.subcategories.length > 0 && (
                        <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-100 pl-3">
                          {cat.subcategories.map((sub) => (
                            <div key={sub.name} className="flex items-center justify-between py-0.5">
                              <span className="text-[11px] text-gray-500">{sub.name}</span>
                              <span className={`text-[10px] font-medium ${sub.count > 0 ? 'text-gray-700' : 'text-gray-300'}`}>{sub.count}</span>
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
        </div>
      </section>
    </main>
  );
}
