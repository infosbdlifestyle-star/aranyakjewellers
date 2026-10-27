"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CategoryImagesPage() {
  const { token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  // Track upload status per subcategory ID
  const [uploadStatus, setUploadStatus] = useState<Record<string, { loading: boolean, error?: string, success?: boolean }>>({});

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchData();
  }, [isLoading, isAuthenticated, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.getCategoryHierarchy();
      if (Array.isArray(data)) {
        setCategories(data);
        if (data.length > 0 && !selectedCategoryId) {
          setSelectedCategoryId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleImageUpload = async (subCategoryId: string, file: File) => {
    if (!token) return;
    
    setUploadStatus(prev => ({ ...prev, [subCategoryId]: { loading: true } }));
    
    try {
      // 1. Upload the image to get the URL
      const uploadRes = await api.uploadImage(token, file);
      if (!uploadRes || (!uploadRes.url && !uploadRes.path)) {
        throw new Error('Upload failed (v2). Response: ' + JSON.stringify(uploadRes));
      }
      
      const imagePath = uploadRes.url || uploadRes.path;
      // Prepend the base server URL to make it absolute so it works on Vercel too
      const baseUrl = 'https://117.252.16.132.nip.io';
      const newImageUrl = imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath}`;
      
      // 2. Update the category document with the new image URL
      const updateRes = await api.updateCategory(token, subCategoryId, { imageUrl: newImageUrl });
      if (!updateRes || !updateRes.id) {
        throw new Error('Failed to save image URL to category');
      }

      setUploadStatus(prev => ({ ...prev, [subCategoryId]: { loading: false, success: true } }));
      
      // Update local state to reflect changes instantly
      setCategories(prevCats => prevCats.map(cat => ({
        ...cat,
        subcategories: cat.subcategories ? cat.subcategories.map((sub: any) => 
          sub.id === subCategoryId ? { ...sub, imageUrl: newImageUrl } : sub
        ) : []
      })));

      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, [subCategoryId]: { loading: false } }));
      }, 3000);

    } catch (err: any) {
      setUploadStatus(prev => ({ ...prev, [subCategoryId]: { loading: false, error: err.message || 'Error uploading' } }));
    }
  };

  const handleRemoveImage = async (subCategoryId: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to remove this image?')) return;

    setUploadStatus(prev => ({ ...prev, [subCategoryId]: { loading: true } }));
    try {
      await api.updateCategory(token, subCategoryId, { imageUrl: '' });
      
      setUploadStatus(prev => ({ ...prev, [subCategoryId]: { loading: false, success: true } }));
      
      setCategories(prevCats => prevCats.map(cat => ({
        ...cat,
        subcategories: cat.subcategories ? cat.subcategories.map((sub: any) => 
          sub.id === subCategoryId ? { ...sub, imageUrl: '' } : sub
        ) : []
      })));

      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, [subCategoryId]: { loading: false } }));
      }, 3000);
    } catch (err: any) {
      setUploadStatus(prev => ({ ...prev, [subCategoryId]: { loading: false, error: err.message || 'Error removing' } }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const subcategories = selectedCategory?.subcategories || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-serif text-white">Manage Category Images</h1>
          <p className="text-sm text-gray-200 mt-1 font-medium">Upload and organize cover photos for frontend subcategories.</p>
        </div>
        
        {/* Category Selector */}
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="bg-card border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-primary/50 min-w-[200px]"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {!selectedCategory ? (
        <div className="text-center py-12 text-gray-300 font-medium border border-white/10 rounded-xl border-dashed">
          No categories found.
        </div>
      ) : subcategories.length === 0 ? (
        <div className="text-center py-12 text-gray-300 font-medium border border-white/10 rounded-xl border-dashed">
          No subcategories found for {selectedCategory.name}. Add subcategories first.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((sub: any) => {
            const status = uploadStatus[sub.id] || { loading: false };
            return (
              <div key={sub.id} className="bg-card border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
                
                {/* Image Preview Area */}
                <div className="relative aspect-video bg-black/50 border-b border-white/10 flex items-center justify-center group overflow-hidden">
                  {sub.imageUrl ? (
                    <>
                      <Image 
                        src={sub.imageUrl} 
                        alt={sub.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => handleRemoveImage(sub.id)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-md text-xs font-bold transition-colors"
                        >
                          Remove Image
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-300 font-medium flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                      <span className="text-xs">No Cover Image</span>
                    </div>
                  )}
                  
                  {status.loading && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                      <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    </div>
                  )}
                </div>
                
                {/* Info & Upload Area */}
                <div className="p-5">
                  <h3 className="font-bold text-white text-lg mb-1">{sub.name}</h3>
                  <p className="text-xs text-gray-400 mb-4 font-mono">{sub.slug}</p>
                  
                  <div className="relative">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(sub.id, file);
                      }}
                      disabled={status.loading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                    />
                    <div className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-primary/50 text-white/80 py-2.5 rounded-lg text-sm font-medium transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                      {sub.imageUrl ? 'Replace Image' : 'Upload Image'}
                    </div>
                  </div>

                  {/* Status Messages */}
                  {status.success && (
                    <p className="text-green-400 text-xs mt-3 text-center flex items-center justify-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      Updated successfully
                    </p>
                  )}
                  {status.error && (
                    <p className="text-red-400 text-xs mt-3 text-center">{status.error}</p>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
