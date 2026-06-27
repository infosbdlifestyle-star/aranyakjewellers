"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminCategoriesPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{type: string, msg: string}>({type: '', msg: ''});

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isActive: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')) {
      router.push('/login');
      return;
    }
    fetchCategories();
  }, [isAuthenticated, user, router, isLoading]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleOpenModal = (category: any = null) => {
    setSaveStatus({type: '', msg: ''});
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        imageUrl: category.imageUrl || '',
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        imageUrl: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
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
        setFormData({ ...formData, imageUrl: result.path });
      }
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setSaveStatus({type: '', msg: ''});
    try {
      if (editingCategory) {
        await api.updateCategory(token, editingCategory.id, formData);
        setSaveStatus({type: 'success', msg: '✓ Category updated successfully!'});
      } else {
        await api.createCategory(token, formData);
        setSaveStatus({type: 'success', msg: '✓ Category created successfully!'});
      }
      fetchCategories();
      setTimeout(() => setIsModalOpen(false), 1000);
    } catch (err) {
      setSaveStatus({type: 'error', msg: '✗ Failed to save category.'});
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.deleteCategory(token, id);
      fetchCategories();
    } catch {
      alert('Failed to delete category');
    }
  };

  if (isLoading || !user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return null;

  return (
    <main className="p-6 lg:p-10 flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-light tracking-tight text-white/90">Category <span className="text-secondary italic">Management</span></h1>
          <p className="text-sm text-white/50 mt-1">Organize your boutique&apos;s product collections.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-secondary text-[#050202] hover:bg-secondary/90 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(179,139,63,0.3)] flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Category
        </button>
      </div>

      <div className="bg-[#1A1515]/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest">Slug</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-white/50">
                    <div className="animate-pulse flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                      Loading categories...
                    </div>
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-black overflow-hidden border border-white/10 shrink-0 relative">
                          {c.imageUrl ? (
                            <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white/90 truncate">{c.name}</p>
                          {c.description && <p className="text-[10px] text-white/40 truncate max-w-[250px] mt-0.5">{c.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-white/60">{c.slug}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        c.isActive 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-white/5 text-white/40 border-white/10'
                      }`}>
                        {c.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(c)} 
                          className="p-2 bg-white/5 hover:bg-secondary/20 hover:text-secondary rounded-lg text-white/60 transition-colors"
                          title="Edit Category"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(c.id)} 
                          className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-white/60 transition-colors"
                          title="Delete Category"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-white/40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-4 opacity-50"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
                    <p className="text-sm">No categories found. Click "Add Category" to create one.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !saving && setIsModalOpen(false)} />
          
          <div className="bg-[#1A1515] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-in zoom-in-95 fade-in duration-200 custom-scrollbar">
            <div className="sticky top-0 bg-[#1A1515]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between z-20">
              <h2 className="text-xl font-serif text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
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

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Category Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors"
                      placeholder="e.g. Diamond Rings"
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Description (Optional)</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors resize-none custom-scrollbar"
                    placeholder="Short description for this category..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
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
                  
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Category Image</label>
                    {formData.imageUrl ? (
                      <div className="relative h-32 bg-black rounded-xl border border-white/10 overflow-hidden group">
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: '' })}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      </div>
                    ) : (
                      <label className="h-32 bg-[#050202] border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-secondary transition-all group">
                        {uploadingImage ? (
                          <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30 group-hover:text-secondary mb-2 transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Upload Image</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                    )}
                    <p className="text-[10px] text-white/40 mt-2 leading-relaxed">
                      Recommended size: 800x1200 pixels (Portrait). Max 2MB.
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
                      {editingCategory ? 'Save Changes' : 'Create Category'}
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
