"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { CATEGORIES } from '@/constants/categories';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminProductsPage() {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    goldPurity: 22,
    goldWeight: 0,
    category: 'Gold',
    subCategory: '',
    stockCount: 1,
    isActive: true,
    images: [] as string[]
  });

  useEffect(() => {
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')) {
      router.push('/login');
      return;
    }
    fetchProducts();
  }, [isAuthenticated, user, router]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        goldPurity: product.goldPurity,
        goldWeight: product.goldWeight,
        category: product.category,
        subCategory: product.subCategory || '',
        stockCount: product.stockCount,
        isActive: product.isActive,
        images: product.images || []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        goldPurity: 22,
        goldWeight: 0,
        category: 'Gold',
        subCategory: '',
        stockCount: 1,
        isActive: true,
        images: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingProduct) {
        await api.updateProduct(token, editingProduct.id, formData);
      } else {
        await api.createProduct(token, formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this masterpiece?')) return;
    try {
      await api.deleteProduct(token, id);
      fetchProducts();
    } catch {
      alert('Failed to delete product');
    }
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return null;

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 bg-ivory hover:bg-primary hover:text-white transition-all rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              </Link>
              <div>
                <h1 className="text-3xl font-serif font-bold text-primary italic">Inventory Management</h1>
                <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mt-1">Curate your collection</p>
              </div>
            </div>
            
            <button 
              onClick={() => handleOpenModal()}
              className="bg-primary text-white px-8 py-4 font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-secondary transition-all shadow-xl flex items-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Add New Product
            </button>
          </div>

          <div className="bg-white border border-border overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ivory border-b border-border">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-primary">Masterpiece</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-primary">Specs</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-primary">Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-primary">Stock</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-primary">Price</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-primary text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-8 bg-white"><div className="h-4 bg-ivory w-full" /></td>
                    </tr>
                  ))
                ) : products.length > 0 ? (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-ivory/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-ivory border border-border flex items-center justify-center shrink-0">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-primary/20 font-serif font-bold">A</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-primary line-clamp-1">{p.name}</p>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">{p.sku || 'SKU-PENDING'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[10px] uppercase font-bold tracking-tighter">
                          <span className="text-secondary">{p.goldPurity}KT</span>
                          <span className="mx-2 opacity-20">|</span>
                          <span className="text-primary">{p.goldWeight}g</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{p.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold ${p.stockCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {p.stockCount} Units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-serif font-bold text-primary">
                          ₹{p.pricing?.finalPrice?.toLocaleString('en-IN') || '--'}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => handleOpenModal(p)}
                            className="p-2 text-primary hover:bg-primary hover:text-white transition-all rounded-full border border-border"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id)}
                            className="p-2 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-full border border-border"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground italic">No products found in the collection.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white shadow-2xl border border-border max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="p-8 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-serif font-bold text-primary italic">
                {editingProduct ? 'Update Masterpiece' : 'Commission New Piece'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-ivory rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-primary">Product Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                      className="w-full bg-ivory border border-border px-4 py-3 text-sm outline-none focus:border-secondary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-primary">Slug (URL)</label>
                    <input 
                      required
                      type="text" 
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="w-full bg-ivory border border-border px-4 py-3 text-sm outline-none focus:border-secondary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-primary">Description</label>
                    <textarea 
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-ivory border border-border px-4 py-3 text-sm outline-none focus:border-secondary resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-primary">Gold Purity (KT)</label>
                      <select 
                        value={formData.goldPurity}
                        onChange={(e) => setFormData({...formData, goldPurity: Number(e.target.value)})}
                        className="w-full bg-ivory border border-border px-4 py-3 text-sm outline-none focus:border-secondary"
                      >
                        <option value={9}>9KT</option>
                        <option value={18}>18KT</option>
                        <option value={22}>22KT</option>
                        <option value={24}>24KT</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-primary">Weight (Grams)</label>
                      <input 
                        required
                        type="number" 
                        step="0.001"
                        value={formData.goldWeight}
                        onChange={(e) => setFormData({...formData, goldWeight: Number(e.target.value)})}
                        className="w-full bg-ivory border border-border px-4 py-3 text-sm outline-none focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-primary">Category</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value, subCategory: ''})}
                        className="w-full bg-ivory border border-border px-4 py-3 text-sm outline-none focus:border-secondary"
                      >
                        {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-primary">Sub-Category</label>
                      <select 
                        value={formData.subCategory}
                        onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                        className="w-full bg-ivory border border-border px-4 py-3 text-sm outline-none focus:border-secondary"
                      >
                        <option value="">None</option>
                        {CATEGORIES.find(c => c.name === formData.category)?.subcategories?.map(sub => (
                          <option key={sub.id} value={sub.name}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-primary">Stock Count</label>
                      <input 
                        required
                        type="number" 
                        value={formData.stockCount}
                        onChange={(e) => setFormData({...formData, stockCount: Number(e.target.value)})}
                        className="w-full bg-ivory border border-border px-4 py-3 text-sm outline-none focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-primary">Image URL (Comma separated)</label>
                    <input 
                      type="text" 
                      value={formData.images.join(', ')}
                      onChange={(e) => setFormData({...formData, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                      className="w-full bg-ivory border border-border px-4 py-3 text-sm outline-none focus:border-secondary"
                      placeholder="https://example.com/image1.jpg, ..."
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-4 text-[10px] font-bold tracking-widest uppercase border border-border hover:bg-ivory transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-primary text-white px-12 py-4 font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-secondary transition-all shadow-xl"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
