"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface GalleryItemData {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl: string;
  category: string;
  metal?: string | null;
  purity?: string | null;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  order: number;
}

const CATEGORY_OPTIONS = [
  { value: 'bridal', label: 'Bridal Trousseau' },
  { value: 'necklaces', label: 'Necklaces & Chokers' },
  { value: 'bangles', label: 'Bangles & Kadas' },
  { value: 'solitaires', label: 'Solitaires & Rings' },
  { value: 'silver', label: 'Pure 925 Silver' },
  { value: 'heritage', label: 'Temple & Heritage' },
  { value: 'showrooms', label: 'Showroom Interiors' },
];

export default function AdminGalleryPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<GalleryItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Edit states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItemData | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form
  const initialForm = {
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    category: 'bridal',
    metal: 'gold',
    purity: '22K',
    tags: '',
    isFeatured: false,
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN' && user?.role !== 'STAFF')) {
      router.push('/admin/login');
      return;
    }
    fetchGallery();
  }, [isAuthenticated, user, router, isLoading]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const data = token ? await api.getGalleryItemsAdmin(token) : await api.getGalleryItems();
      if (Array.isArray(data)) {
        setItems(data.sort((a, b) => a.order - b.order));
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to load gallery items.' });
    }
    setLoading(false);
  };

  const handleOpenModal = (item: GalleryItemData | null = null) => {
    setStatusMessage(null);
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title || '',
        subtitle: item.subtitle || '',
        description: item.description || '',
        imageUrl: item.imageUrl || '',
        category: item.category || 'bridal',
        metal: item.metal || 'gold',
        purity: item.purity || '22K',
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
        isFeatured: Boolean(item.isFeatured),
        isActive: Boolean(item.isActive),
      });
    } else {
      setEditingItem(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(initialForm);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploadingImage(true);
    setStatusMessage(null);
    try {
      const res = await api.uploadImage(token, file);
      if (res && res.path) {
        setFormData(prev => ({ ...prev, imageUrl: res.path }));
        setStatusMessage({ type: 'success', text: 'Image uploaded successfully.' });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to upload image.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network failure during upload.' });
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      setStatusMessage({ type: 'error', text: 'Title and Image URL are required.' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    const parsedTags = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags: parsedTags,
      order: editingItem ? editingItem.order : items.length,
    };

    try {
      let res;
      if (editingItem) {
        res = await api.updateGalleryItem(token, editingItem.id, payload);
      } else {
        res = await api.createGalleryItem(token, payload);
      }

      if (res && (res.id || !res.error)) {
        setStatusMessage({
          type: 'success',
          text: editingItem ? 'Gallery item updated successfully!' : 'Gallery item created successfully!',
        });
        handleCloseModal();
        await fetchGallery();
      } else {
        setStatusMessage({ type: 'error', text: res?.message || 'Error saving gallery item.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network failure while saving item.' });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setSaving(true);
    try {
      await api.deleteGalleryItem(token, id);
      setStatusMessage({ type: 'success', text: 'Gallery item removed successfully.' });
      setIsDeleting(null);
      await fetchGallery();
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to delete item.' });
    }
    setSaving(false);
  };

  const handleToggleActive = async (item: GalleryItemData) => {
    if (!token) return;
    try {
      await api.updateGalleryItem(token, item.id, { isActive: !item.isActive });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i));
    } catch {
      setStatusMessage({ type: 'error', text: 'Could not toggle item status.' });
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (!token) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const reordered = [...items];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const itemsPayload = reordered.map((item, idx) => ({ id: item.id, order: idx }));
    setItems(reordered.map((item, idx) => ({ ...item, order: idx })));

    try {
      await api.reorderGalleryItems(token, itemsPayload);
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to persist order.' });
      fetchGallery();
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesMetal = selectedMetal === 'all' || item.metal === selectedMetal;
    const q = searchQuery.toLowerCase();
    const matchesQuery = !searchQuery || 
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.tags.some(t => t.toLowerCase().includes(q));
    return matchesCategory && matchesMetal && matchesQuery;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A201B]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F1713] border border-[#C49A45]/30 text-[#D6B15D] text-[11px] font-bold tracking-widest uppercase mb-2">
            <span>✦</span>
            <span>Haute Joaillerie Archive</span>
          </div>
          <h1 className="text-3xl font-serif text-[#F5E6D3] tracking-wide">Master Gallery Management</h1>
          <p className="text-xs sm:text-sm text-[#A89887] mt-1">
            Curate high-resolution photography, bridal showcases, metal attributes, and gallery ordering.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenModal()}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#C49A45] to-[#8C6B28] text-[#120B08] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="text-base leading-none">+</span>
            <span>Add Portfolio Item</span>
          </button>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
            : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
        }`}>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span>{statusMessage.type === 'success' ? '✓' : '⚠'}</span>
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-xs opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-[#140E0B] p-4 sm:p-5 rounded-xl border border-[#2A201B] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#C49A45]"
          >
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <select
            value={selectedMetal}
            onChange={(e) => setSelectedMetal(e.target.value)}
            className="bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#C49A45]"
          >
            <option value="all">All Metals</option>
            <option value="gold">Gold</option>
            <option value="diamond">Diamond</option>
            <option value="silver">Silver</option>
            <option value="gemstone">Gemstone</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by title or tag..."
            className="w-full sm:w-64 bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2 rounded-lg focus:outline-none focus:border-[#C49A45]"
          />
          <span className="text-xs text-[#8A7969] whitespace-nowrap">
            {filteredItems.length} items
          </span>
        </div>
      </div>

      {/* Grid of Gallery Items */}
      {loading ? (
        <div className="py-20 text-center text-[#8A7969] text-xs uppercase tracking-widest animate-pulse">
          Loading gallery collection...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center bg-[#140E0B] border border-[#2A201B] rounded-xl p-8">
          <div className="text-3xl mb-2 text-[#C49A45]">✦</div>
          <p className="text-[#F5E6D3] font-serif text-lg">No gallery items match criteria</p>
          <p className="text-xs text-[#8A7969] mt-1">Try switching filters or add a new piece to the portfolio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`bg-[#140E0B] border ${
                item.isFeatured ? 'border-[#C49A45]/60' : 'border-[#2A201B]'
              } rounded-xl overflow-hidden hover:border-[#C49A45] transition-all flex flex-col justify-between`}
            >
              <div>
                {/* Image Preview with Badges */}
                <div className="relative aspect-[4/3] bg-[#0A0605] overflow-hidden group">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140E0B] via-transparent to-transparent opacity-80" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#140E0B]/80 text-[#D6B15D] text-[10px] font-bold uppercase tracking-wider border border-[#C49A45]/40 backdrop-blur-sm">
                      {item.category}
                    </span>
                    {item.purity && (
                      <span className="px-2 py-0.5 rounded-full bg-[#2A1D16]/90 text-[#FFF8EB] text-[10px] font-mono border border-[#4A382A] backdrop-blur-sm">
                        {item.purity}
                      </span>
                    )}
                  </div>

                  {item.isFeatured && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#C49A45] text-[#120B08] text-[9px] font-extrabold uppercase tracking-widest shadow-md">
                      Featured
                    </div>
                  )}

                  {/* Ordering Controls Overlay */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#140E0B]/90 backdrop-blur-md px-2 py-1 rounded-lg border border-[#2E221A]">
                    <button
                      onClick={() => handleMoveOrder(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-[#A89887] hover:text-[#C49A45] disabled:opacity-30 disabled:pointer-events-none text-xs"
                      title="Move Earlier"
                    >
                      ▲
                    </button>
                    <span className="text-[10px] font-mono text-[#8A7969] px-1">{index + 1}</span>
                    <button
                      onClick={() => handleMoveOrder(index, 'down')}
                      disabled={index === items.length - 1}
                      className="p-1 text-[#A89887] hover:text-[#C49A45] disabled:opacity-30 disabled:pointer-events-none text-xs"
                      title="Move Later"
                    >
                      ▼
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <h3 className="font-serif font-bold text-base text-[#F5E6D3] line-clamp-1">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs text-[#C49A45] line-clamp-1">
                      {item.subtitle}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-[#8A7969] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] text-[#A89887] bg-[#1F1713] px-2 py-0.5 rounded border border-[#2A201B]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-2 border-t border-[#2A201B] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
                    item.isActive 
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/50' 
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${item.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                  <span>{item.isActive ? 'Active' : 'Hidden'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="px-3 py-1 rounded bg-[#1F1713] text-[#E5D7C5] border border-[#2E221A] hover:border-[#C49A45] hover:text-[#C49A45] text-xs font-semibold tracking-wider transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setIsDeleting(item.id)}
                    className="p-1.5 rounded bg-rose-950/40 text-rose-300 border border-rose-900/50 hover:bg-rose-900/60 transition-colors text-xs"
                    title="Delete item"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Delete Confirm */}
              {isDeleting === item.id && (
                <div className="p-3 bg-rose-950 border-t border-rose-700 flex items-center justify-between text-xs text-rose-200">
                  <span>Delete photo permanently?</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2.5 py-0.5 bg-rose-600 text-white rounded font-bold hover:bg-rose-500"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setIsDeleting(null)}
                      className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#140E0B] border border-[#C49A45]/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A201B] mb-6">
              <div>
                <h2 className="text-xl font-serif text-[#F5E6D3]">
                  {editingItem ? 'Edit Portfolio Masterpiece' : 'Add Gallery Masterpiece'}
                </h2>
                <p className="text-xs text-[#8A7969] mt-0.5">
                  Configure high-resolution portfolio images, metal purity, and categorization.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-[#8A7969] hover:text-[#F5E6D3] text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#C49A45] mb-1.5">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Royal Nakshi Choker Set"
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                    Subtitle / Craft Origin
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. Pure 22K Handcrafted Gold"
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed craftsmanship narrative..."
                  className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                />
              </div>

              {/* Image Input with Upload */}
              <div>
                <label className="block text-xs font-semibold text-[#C49A45] mb-1.5">
                  Master Image URL *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/uploads/gallery-item.webp"
                    className="flex-1 bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                  <label className="px-3.5 py-2.5 bg-[#2E221A] hover:bg-[#3E3024] text-[#E5D7C5] rounded-lg text-xs cursor-pointer transition-colors whitespace-nowrap">
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  >
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                    Metal
                  </label>
                  <select
                    value={formData.metal}
                    onChange={(e) => setFormData({ ...formData, metal: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  >
                    <option value="gold">Gold</option>
                    <option value="diamond">Diamond</option>
                    <option value="silver">Silver</option>
                    <option value="gemstone">Gemstone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                    Purity Stamp
                  </label>
                  <input
                    type="text"
                    value={formData.purity}
                    onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                    placeholder="e.g. 22K, 18K, 925"
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. antique, temple, bridal, heirloom"
                  className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#E5D7C5]">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2E221A] text-[#C49A45] focus:ring-0 focus:ring-offset-0 bg-[#1A120E]"
                  />
                  <span>Active &amp; Visible</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#E5D7C5]">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2E221A] text-[#C49A45] focus:ring-0 focus:ring-offset-0 bg-[#1A120E]"
                  />
                  <span>Featured Masterpiece</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A201B]">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg bg-[#1F1713] text-[#A89887] hover:text-[#F5E6D3] text-xs font-semibold tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#C49A45] to-[#8C6B28] text-[#120B08] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
