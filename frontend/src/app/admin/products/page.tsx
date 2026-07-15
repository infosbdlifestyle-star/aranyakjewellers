"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminProductsPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{type: string, msg: string}>({type: '', msg: ''});

  // Filter state
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSubCategory, setFilterSubCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

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
    if (isLoading) return;
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')) {
      router.push('/login');
      return;
    }
    fetchProducts();
    fetchCategories();
  }, [isAuthenticated, user, router, isLoading]);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      if (Array.isArray(data)) setDbCategories(data);
    } catch { /* empty */ }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const filteredProducts = useMemo(() => {
    let result = products;
    if (filterCategory !== 'All') {
      result = result.filter(p => p.category === filterCategory);
    }
    if (filterSubCategory !== 'All') {
      result = result.filter(p => p.subCategory === filterSubCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.sku?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, filterCategory, filterSubCategory, searchQuery]);

  const filterSubCategories = useMemo(() => {
    if (filterCategory === 'All') return [];
    const cat = dbCategories.find(c => c.name === filterCategory);
    if (!cat) return [];
    return dbCategories.filter(c => c.parentId === cat.id);
  }, [filterCategory, dbCategories]);

  const rootCategories = dbCategories.filter(c => !c.parentId);

  const handleOpenModal = (product: any = null) => {
    setSaveStatus({type: '', msg: ''});
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

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setFormData({...formData, name, slug});
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !token) return;
    const file = e.target.files[0];

    // Client-side 6MB validation
    const MAX_SIZE = 6 * 1024 * 1024; // 6MB
    if (file.size > MAX_SIZE) {
      alert(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed size is 6MB per image.`);
      e.target.value = '';
      return;
    }
    
    setUploadingImage(true);
    try {
      const result = await api.uploadImage(token, file);
      if (result.path) {
        setFormData({ ...formData, images: [...formData.images, result.path] });
      }
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setSaveStatus({type: '', msg: ''});

    try {
      if (editingProduct) {
        await api.updateProduct(token, editingProduct.id, formData);
        setSaveStatus({type: 'success', msg: '✓ Product updated successfully!'});
      } else {
        await api.createProduct(token, formData);
        setSaveStatus({type: 'success', msg: '✓ Product created successfully!'});
      }
      fetchProducts();
      setTimeout(() => setIsModalOpen(false), 1000);
    } catch (err) {
      setSaveStatus({type: 'error', msg: '✗ Failed to save product. Please try again.'});
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this product? This cannot be undone.')) return;
    try {
      await api.deleteProduct(token, id);
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (isLoading || !user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return null;

  return (
    <main className="p-6 lg:p-10 flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-light tracking-tight text-white/90">Product <span className="text-secondary italic">Inventory</span></h1>
          <p className="text-sm text-white/50 mt-1">Manage your boutique catalog and stock.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-secondary text-[#050202] hover:bg-secondary/90 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(179,139,63,0.3)] flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#1A1515]/50 backdrop-blur-md rounded-2xl border border-white/10 p-5 mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search products by name, SKU, or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#050202] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-secondary transition-colors"
          />
        </div>
        
        <div className="flex gap-4">
          <select 
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setFilterSubCategory('All');
            }}
            className="bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary appearance-none min-w-[150px]"
          >
            <option value="All">All Categories</option>
            {rootCategories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select 
            value={filterSubCategory}
            onChange={(e) => setFilterSubCategory(e.target.value)}
            disabled={filterCategory === 'All' || filterSubCategories.length === 0}
            className="bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary appearance-none min-w-[150px] disabled:opacity-50"
          >
            <option value="All">All Subcategories</option>
            {filterSubCategories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-[#1A1515]/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest">SKU</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest">Weight (g)</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-white/50">
                    <div className="animate-pulse flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                      Loading inventory...
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-white/40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-4 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 14 3-3 3 3"/><path d="M12 11v6"/></svg>
                    <p className="text-sm">No products found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-black overflow-hidden border border-white/10 shrink-0 relative">
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white/90 truncate max-w-[200px]">{product.name}</p>
                          <p className="text-[10px] text-white/40 truncate max-w-[200px]">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-white/60">{product.sku}</td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-white/80">{product.category}</p>
                      {product.subCategory && <p className="text-[10px] text-white/40">{product.subCategory}</p>}
                    </td>
                    <td className="px-6 py-4 text-xs text-white/70">
                      {product.goldWeight ? `${product.goldWeight}g` : '-'}
                      {product.goldPurity ? <span className="ml-1 text-[10px] text-secondary">({product.goldPurity}K)</span> : null}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold ${product.stockCount > 0 ? 'text-white' : 'text-red-400'}`}>
                        {product.stockCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        product.isActive 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-white/5 text-white/40 border-white/10'
                      }`}>
                        {product.isActive ? 'Live' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 bg-white/5 hover:bg-secondary/20 hover:text-secondary rounded-lg text-white/60 transition-colors"
                          title="Edit Product"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-white/60 transition-colors"
                          title="Delete Product"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !saving && setIsModalOpen(false)} />
          
          <div className="bg-[#1A1515] border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 animate-in zoom-in-95 fade-in duration-200 custom-scrollbar">
            <div className="sticky top-0 bg-[#1A1515]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between z-20">
              <h2 className="text-xl font-serif text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
                className="p-2 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {saveStatus.msg && (
                <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                  saveStatus.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {saveStatus.msg}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Col: Basic Info */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Product Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors"
                      placeholder="e.g. 22K Gold Antique Necklace"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">URL Slug</label>
                    <input 
                      type="text" 
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Description</label>
                    <textarea 
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors resize-none custom-scrollbar"
                      placeholder="Product details..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Category</label>
                      <select 
                        required
                        value={formData.category}
                        onChange={(e) => {
                          setFormData({ ...formData, category: e.target.value, subCategory: '' });
                        }}
                        className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary appearance-none"
                      >
                        <option value="">Select Category</option>
                        {rootCategories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Subcategory</label>
                      <select 
                        value={formData.subCategory}
                        onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                        disabled={!formData.category}
                        className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary appearance-none disabled:opacity-50"
                      >
                        <option value="">None</option>
                        {dbCategories.filter(c => {
                          const parent = dbCategories.find(p => p.name === formData.category);
                          return parent && c.parentId === parent.id;
                        }).map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Col: Details & Images */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Gold Purity (K)</label>
                      <select 
                        value={formData.goldPurity}
                        onChange={(e) => setFormData({...formData, goldPurity: Number(e.target.value)})}
                        className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary appearance-none"
                      >
                        {[0, 9, 18, 22, 24].map(k => (
                          <option key={k} value={k}>{k === 0 ? 'N/A' : `${k}K`}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Weight (g)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={formData.goldWeight}
                        onChange={(e) => setFormData({...formData, goldWeight: Number(e.target.value)})}
                        className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Stock Count</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        value={formData.stockCount}
                        onChange={(e) => setFormData({...formData, stockCount: Number(e.target.value)})}
                        className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Status</label>
                      <label className="flex items-center gap-3 bg-[#050202] border border-white/10 rounded-xl px-4 py-3 cursor-pointer select-none">
                        <div className="relative">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                          />
                          <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                        </div>
                        <span className="text-sm font-medium text-white">{formData.isActive ? 'Active (Live)' : 'Hidden'}</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Product Images</label>
                    
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {formData.images.map((img, i) => (
                        <div key={i} className="aspect-square bg-black rounded-xl border border-white/10 relative overflow-hidden group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          </button>
                        </div>
                      ))}
                      
                      {formData.images.length < 5 && (
                        <label className="aspect-square bg-white/5 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 hover:border-secondary transition-all group">
                          {uploadingImage ? (
                            <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30 group-hover:text-secondary mb-2 transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                              <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Upload</span>
                            </>
                          )}
                          <input 
                            type="file" 
                            accept="image/jpeg,image/png,image/webp" 
                            className="hidden" 
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed">
                      📐 Recommended: 1000×1000px (Square) · Max 6MB per image · JPG, PNG, WebP · First image is the main cover.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="px-6 py-3 rounded-lg text-sm font-bold text-white/70 hover:bg-white/10 uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="bg-secondary text-[#050202] hover:bg-secondary/90 px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(179,139,63,0.3)] disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#050202] border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                      {editingProduct ? 'Save Changes' : 'Create Product'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
