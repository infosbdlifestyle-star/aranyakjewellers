"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

  // Filtered products
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

  // Get subcategories for current filter
  const filterSubCategories = useMemo(() => {
    if (filterCategory === 'All') return [];
    const cat = dbCategories.find(c => c.name === filterCategory);
    if (!cat) return [];
    // Assuming backend returns flat categories where parentId points to parent, or we just filter by parentId
    return dbCategories.filter(c => c.parentId === cat.id);
  }, [filterCategory, dbCategories]);

  // Stats
  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter(p => p.isActive).length,
    outOfStock: products.filter(p => p.stockCount === 0).length,
    categories: [...new Set(products.map(p => p.category))].length,
  }), [products]);

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

  // Auto-generate slug from name
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
      // Close modal after 1 second so user sees success
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
    } catch {
      alert('Failed to delete product');
    }
  };

  const handleToggleActive = async (product: any) => {
    if (!token) return;
    try {
      await api.updateProduct(token, product.id, { isActive: !product.isActive });
      fetchProducts();
    } catch {
      alert('Failed to update product status');
    }
  };

  if (isLoading || !user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return null;

  // Get subcategories for current form category
  const formSubCategories = useMemo(() => {
    const cat = dbCategories.find(c => c.name === formData.category);
    if (!cat) return [];
    return dbCategories.filter(c => c.parentId === cat.id);
  }, [formData.category, dbCategories]);
  
  const rootCategories = dbCategories.filter(c => !c.parentId);

  return (
    <main className="min-h-screen flex flex-col bg-[#FAFAF8]">
      
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-all" title="Back to Dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Product Management</h1>
                <p className="text-xs text-gray-500">{products.length} products in inventory</p>
              </div>
            </div>
            
            <button 
              onClick={() => handleOpenModal()}
              className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all flex items-center gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Add Product
            </button>
          </div>
        </div>
      </div>

      <section className="flex-1 py-6">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium">Active</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium">Out of Stock</p>
              <p className="text-2xl font-bold text-red-500 mt-1">{stats.outOfStock}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium">Categories Used</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.categories}</p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input
                  type="text"
                  placeholder="Search products by name, SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setFilterSubCategory('All'); }}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 min-w-[160px]"
              >
                <option value="All">All Categories</option>
                {rootCategories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              {/* SubCategory Filter */}
              <select
                value={filterSubCategory}
                onChange={(e) => setFilterSubCategory(e.target.value)}
                disabled={filterSubCategories.length === 0}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="All">All Sub-Categories</option>
                {filterSubCategories.map(sub => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>
            
            {/* Results info */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>Showing {filteredProducts.length} of {products.length} products</span>
              {(filterCategory !== 'All' || filterSubCategory !== 'All' || searchQuery) && (
                <button 
                  onClick={() => { setFilterCategory('All'); setFilterSubCategory('All'); setSearchQuery(''); }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Sub-Category</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Specs</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={8} className="px-4 py-6"><div className="h-4 bg-gray-100 rounded w-full" /></td>
                      </tr>
                    ))
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                              {p.images?.[0] ? (
                                <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-gray-300 font-serif font-bold text-sm">A</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{p.name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">{p.sku || 'No SKU'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {p.subCategory ? (
                            <span className="text-xs text-gray-600">{p.subCategory}</span>
                          ) : (
                            <span className="text-xs text-gray-300 italic">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs font-medium text-gray-700">
                            {p.goldPurity}KT <span className="text-gray-300">•</span> {p.goldWeight}g
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold ${p.stockCount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {p.stockCount}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-gray-900">
                            {p.pricing?.finalPrice ? `₹${p.pricing.finalPrice.toLocaleString('en-IN')}` : '—'}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => handleToggleActive(p)}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer transition-colors ${
                              p.isActive 
                                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
                                : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                            }`}
                            title="Click to toggle"
                          >
                            {p.isActive ? '● Live' : '○ Hidden'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => handleOpenModal(p)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg"
                              title="Edit product"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                            </button>
                            <button 
                              onClick={() => handleDelete(p.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all rounded-lg"
                              title="Delete product"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center">
                        <div className="text-gray-400 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 9 6 6"/><path d="m15 9-6 6"/></svg>
                        </div>
                        <p className="text-gray-500 font-medium">No products found</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {searchQuery || filterCategory !== 'All' ? 'Try adjusting your filters' : 'Click "Add Product" to create your first product'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !saving && setIsModalOpen(false)} />
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingProduct ? 'Update the product details below' : 'Fill in the details to create a new product'}
                </p>
              </div>
              <button 
                onClick={() => !saving && setIsModalOpen(false)} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                disabled={saving}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Product Name & Slug */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Gold Filigree Necklace Set"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:bg-white transition-all placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    URL Slug 
                    <span className="text-xs text-gray-400 ml-2">auto-generated from name</span>
                  </label>
                  <input 
                    required
                    type="text" 
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:bg-white font-mono transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Category & SubCategory */}
              <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-4 space-y-4">
                <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
                  Category & Classification
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value, subCategory: ''})}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-all"
                    >
                      <option value="">— Select Category —</option>
                      {rootCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Sub-Category</label>
                    <select 
                      value={formData.subCategory}
                      onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-all"
                    >
                      <option value="">— None —</option>
                      {formSubCategories.map(sub => (
                        <option key={sub.id} value={sub.name}>{sub.name}</option>
                      ))}
                    </select>
                    {formSubCategories.length === 0 && (
                      <p className="text-[10px] text-gray-400 mt-1">No sub-categories for {formData.category}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Specs: Purity, Weight, Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Purity (KT)</label>
                  <select 
                    value={formData.goldPurity}
                    onChange={(e) => setFormData({...formData, goldPurity: Number(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-all"
                  >
                    <option value={9}>9 KT</option>
                    <option value={18}>18 KT</option>
                    <option value={22}>22 KT</option>
                    <option value={24}>24 KT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight (grams) *</label>
                  <input 
                    required
                    type="number" 
                    step="0.001"
                    value={formData.goldWeight}
                    onChange={(e) => setFormData({...formData, goldWeight: Number(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Count</label>
                  <input 
                    required
                    type="number" 
                    value={formData.stockCount}
                    onChange={(e) => setFormData({...formData, stockCount: Number(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the jewellery piece..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 focus:bg-white resize-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Images */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <label className="block text-sm font-bold text-gray-900 mb-1">Product Images</label>
                <p className="text-xs text-gray-500 mb-4">Recommended size: <strong className="text-gray-700">1000x1000 pixels</strong> (Square). Max size: 5MB per image.</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors relative cursor-pointer min-w-[200px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                    <span className="text-xs font-medium text-blue-600 underline">Upload from computer</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                  </div>
                  {uploadingImage && (
                    <div className="flex items-center gap-2 text-sm text-blue-700 font-medium bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Uploading...
                    </div>
                  )}
                </div>
                
                {formData.images.length > 0 && (
                  <div className="flex gap-4 mt-2 flex-wrap">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative w-24 h-24 bg-white border border-gray-200 rounded-lg overflow-hidden group shadow-sm">
                        <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="bg-red-600 text-white p-2 rounded-lg text-xs font-bold hover:bg-red-700 shadow-lg transition-all"
                            title="Delete Image"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </div>
                        {i === 0 && <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-medium">Cover</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input 
                  type="checkbox" 
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 accent-green-600"
                  id="isActive"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700 cursor-pointer">
                  <span className="font-medium">Product is active</span>
                  <span className="text-xs text-gray-400 ml-2">— visible to customers on the website</span>
                </label>
              </div>

              {/* Status Message */}
              {saveStatus.msg && (
                <div className={`p-3 rounded-lg text-sm font-medium text-center ${
                  saveStatus.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {saveStatus.msg}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Saving...
                    </>
                  ) : (
                    editingProduct ? 'Save Changes' : 'Create Product'
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
