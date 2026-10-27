"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface OfferItem {
  id: string;
  titleEn: string;
  titleBn: string;
  descEn?: string | null;
  descBn?: string | null;
  tag: string;
  badge?: string | null;
  icon?: string | null;
  imageUrl?: string | null;
  discountValue?: string | null;
  discountType?: string | null;
  terms?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  placement: string;
  highlight: boolean;
  isActive: boolean;
  order: number;
}

export default function AdminOffersPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPlacement, setFilterPlacement] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const initialForm = {
    titleEn: '',
    titleBn: '',
    descEn: '',
    descBn: '',
    tag: '',
    badge: '',
    icon: 'sparkles',
    imageUrl: '',
    discountValue: '',
    discountType: 'FLAT',
    terms: '',
    startDate: '',
    endDate: '',
    placement: 'both',
    highlight: false,
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN' && user?.role !== 'STAFF')) {
      router.push('/admin/login');
      return;
    }
    fetchOffers();
  }, [isAuthenticated, user, router, isLoading]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = token ? await api.getOffersAdmin(token) : await api.getOffers();
      if (Array.isArray(data)) {
        setOffers(data.sort((a, b) => a.order - b.order));
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to fetch offers from server.' });
    }
    setLoading(false);
  };

  const handleOpenModal = (offer: OfferItem | null = null) => {
    setStatusMessage(null);
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        titleEn: offer.titleEn || '',
        titleBn: offer.titleBn || '',
        descEn: offer.descEn || '',
        descBn: offer.descBn || '',
        tag: offer.tag || '',
        badge: offer.badge || '',
        icon: offer.icon || 'sparkles',
        imageUrl: offer.imageUrl || '',
        discountValue: offer.discountValue || '',
        discountType: offer.discountType || 'FLAT',
        terms: offer.terms || '',
        startDate: offer.startDate ? offer.startDate.slice(0, 10) : '',
        endDate: offer.endDate ? offer.endDate.slice(0, 10) : '',
        placement: offer.placement || 'both',
        highlight: Boolean(offer.highlight),
        isActive: Boolean(offer.isActive),
      });
    } else {
      setEditingOffer(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOffer(null);
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
      setStatusMessage({ type: 'error', text: 'Error uploading image file.' });
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!formData.titleEn.trim() || !formData.titleBn.trim() || !formData.tag.trim()) {
      setStatusMessage({ type: 'error', text: 'Title (EN), Title (BN), and Offer Tag are required.' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    const payload = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      order: editingOffer ? editingOffer.order : offers.length,
    };

    try {
      let res;
      if (editingOffer) {
        res = await api.updateOffer(token, editingOffer.id, payload);
      } else {
        res = await api.createOffer(token, payload);
      }

      if (res && (res.id || !res.error)) {
        setStatusMessage({
          type: 'success',
          text: editingOffer ? 'Promotional offer updated successfully!' : 'Promotional offer created successfully!',
        });
        handleCloseModal();
        await fetchOffers();
      } else {
        setStatusMessage({ type: 'error', text: res?.message || 'Error saving promotional offer.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network failure while saving offer.' });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setSaving(true);
    try {
      await api.deleteOffer(token, id);
      setStatusMessage({ type: 'success', text: 'Offer removed successfully.' });
      setIsDeleting(null);
      await fetchOffers();
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to delete offer.' });
    }
    setSaving(false);
  };

  const handleToggleActive = async (offer: OfferItem) => {
    if (!token) return;
    try {
      await api.updateOffer(token, offer.id, { isActive: !offer.isActive });
      setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, isActive: !o.isActive } : o));
    } catch {
      setStatusMessage({ type: 'error', text: 'Could not toggle offer status.' });
    }
  };

  const handleToggleHighlight = async (offer: OfferItem) => {
    if (!token) return;
    try {
      await api.updateOffer(token, offer.id, { highlight: !offer.highlight });
      setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, highlight: !o.highlight } : o));
    } catch {
      setStatusMessage({ type: 'error', text: 'Could not toggle highlight.' });
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (!token) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= offers.length) return;

    const reordered = [...offers];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Update orders
    const itemsPayload = reordered.map((item, idx) => ({ id: item.id, order: idx }));
    setOffers(reordered.map((item, idx) => ({ ...item, order: idx })));

    try {
      await api.reorderOffers(token, itemsPayload);
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to persist offer order.' });
      fetchOffers();
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesPlacement = filterPlacement === 'all' || offer.placement === filterPlacement || offer.placement === 'both';
    const q = searchQuery.toLowerCase();
    const matchesQuery = !searchQuery || 
      offer.titleEn.toLowerCase().includes(q) ||
      offer.titleBn.includes(searchQuery) ||
      offer.tag.toLowerCase().includes(q);
    return matchesPlacement && matchesQuery;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A201B]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F1713] border border-[#C49A45]/30 text-[#D6B15D] text-[11px] font-bold tracking-widest uppercase mb-2">
            <span>✦</span>
            <span>Promotional Campaign Hub</span>
          </div>
          <h1 className="text-3xl font-serif text-[#F5E6D3] tracking-wide">Promotional Offers Management</h1>
          <p className="text-xs sm:text-sm text-[#A89887] mt-1">
            Control the 7 flagship festive cards and synchronize campaign privileges across homepage & announcement ticker.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenModal()}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#C49A45] to-[#8C6B28] text-[#120B08] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="text-base leading-none">+</span>
            <span>Add New Offer</span>
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

      {/* Filters and Controls */}
      <div className="bg-[#140E0B] p-4 sm:p-5 rounded-xl border border-[#2A201B] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#8A7969] uppercase tracking-wider font-semibold mr-1">Placement:</span>
          {(['all', 'both', 'cards', 'ticker'] as const).map(p => (
            <button
              key={p}
              onClick={() => setFilterPlacement(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                filterPlacement === p
                  ? 'bg-[#C49A45] text-[#120B08] font-bold'
                  : 'bg-[#1F1713] text-[#A89887] hover:text-[#F5E6D3] border border-[#2A201B]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search offers by title or tag..."
            className="w-full sm:w-72 bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2 rounded-lg focus:outline-none focus:border-[#C49A45] transition-colors"
          />
          <span className="text-xs text-[#8A7969] whitespace-nowrap">
            {filteredOffers.length} {filteredOffers.length === 1 ? 'offer' : 'offers'}
          </span>
        </div>
      </div>

      {/* Offers Table / Card List */}
      {loading ? (
        <div className="py-20 text-center text-[#8A7969] text-xs uppercase tracking-widest animate-pulse">
          Loading promotional offers...
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="py-16 text-center bg-[#140E0B] border border-[#2A201B] rounded-xl p-8">
          <div className="text-3xl mb-2 text-[#C49A45]">✦</div>
          <p className="text-[#F5E6D3] font-serif text-lg">No promotional offers found</p>
          <p className="text-xs text-[#8A7969] mt-1">Adjust filters or click &quot;Add New Offer&quot; above to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOffers.map((offer, index) => (
            <div
              key={offer.id}
              className={`bg-[#140E0B] border ${
                offer.highlight 
                  ? 'border-[#C49A45]/50 shadow-[0_0_15px_rgba(196,154,69,0.1)]' 
                  : 'border-[#2A201B]'
              } rounded-xl p-5 hover:border-[#C49A45]/40 transition-all`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Info */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Order handle buttons */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <button
                      onClick={() => handleMoveOrder(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded bg-[#1F1713] text-[#A89887] hover:text-[#C49A45] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <span className="text-[10px] font-mono text-[#8A7969]">{index + 1}</span>
                    <button
                      onClick={() => handleMoveOrder(index, 'down')}
                      disabled={index === offers.length - 1}
                      className="p-1 rounded bg-[#1F1713] text-[#A89887] hover:text-[#C49A45] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Main Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#C49A45]/15 text-[#D6B15D] border border-[#C49A45]/30 text-[10px] font-bold tracking-wider uppercase">
                        {offer.tag}
                      </span>
                      {offer.badge && (
                        <span className="px-2 py-0.5 rounded bg-[#2A1D16] text-[#E5D7C5] text-[10px] uppercase tracking-wider">
                          {offer.badge}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase ${
                        offer.placement === 'both' ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' :
                        offer.placement === 'ticker' ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40' :
                        'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                      }`}>
                        {offer.placement}
                      </span>
                      {offer.highlight && (
                        <span className="px-2 py-0.5 rounded bg-[#C49A45] text-[#120B08] text-[10px] font-bold uppercase tracking-wider">
                          ★ Mega Highlight
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#F5E6D3] flex items-center gap-2">
                        <span>{offer.titleBn}</span>
                        <span className="text-[#8A7969] text-xs font-normal">({offer.titleEn})</span>
                      </h3>
                      <p className="text-xs text-[#A89887] mt-0.5">
                        {offer.descBn || offer.descEn || 'No detailed description set'}
                      </p>
                    </div>

                    {/* Schedule dates info */}
                    {(offer.startDate || offer.endDate) && (
                      <div className="text-[11px] text-[#C49A45]/80 flex items-center gap-2 font-mono">
                        <span>🗓 Validity:</span>
                        <span>{offer.startDate ? offer.startDate.slice(0, 10) : 'Anytime'}</span>
                        <span>→</span>
                        <span>{offer.endDate ? offer.endDate.slice(0, 10) : 'Indefinite'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#2A201B]">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleActive(offer)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors flex items-center gap-1.5 ${
                      offer.isActive 
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/60' 
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-700 hover:bg-zinc-800'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${offer.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                    <span>{offer.isActive ? 'Active' : 'Inactive'}</span>
                  </button>

                  {/* Highlight Toggle */}
                  <button
                    onClick={() => handleToggleHighlight(offer)}
                    className={`p-2 rounded-lg text-xs transition-colors border ${
                      offer.highlight 
                        ? 'bg-[#C49A45]/20 text-[#D6B15D] border-[#C49A45]' 
                        : 'bg-[#1A120E] text-[#8A7969] border-[#2A201B] hover:text-[#F5E6D3]'
                    }`}
                    title="Toggle Highlight Border"
                  >
                    ★
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenModal(offer)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1F1713] text-[#E5D7C5] border border-[#2E221A] hover:border-[#C49A45] hover:text-[#C49A45] text-xs font-semibold tracking-wider transition-colors"
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setIsDeleting(offer.id)}
                    className="p-2 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-900/50 hover:bg-rose-900/60 transition-colors text-xs"
                    title="Delete offer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Delete Confirmation Inline */}
              {isDeleting === offer.id && (
                <div className="mt-4 p-3 bg-rose-950/80 border border-rose-700/60 rounded-lg flex items-center justify-between text-xs text-rose-200">
                  <span>Are you sure you want to permanently delete &quot;{offer.titleEn}&quot;?</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="px-3 py-1 bg-rose-600 text-white rounded font-bold hover:bg-rose-500"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setIsDeleting(null)}
                      className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700"
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
                  {editingOffer ? 'Edit Promotional Offer' : 'Create New Promotional Offer'}
                </h2>
                <p className="text-xs text-[#8A7969] mt-0.5">
                  Update promotional claims, Bengali/English copy, and placement settings.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-[#8A7969] hover:text-[#F5E6D3] text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Dual Language Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#C49A45] mb-1.5">
                    Bengali Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleBn}
                    onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                    placeholder="e.g. সোনার গয়না (Gold Jewellery)"
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#C49A45] mb-1.5">
                    English Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="e.g. Gold Jewellery Offer"
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
              </div>

              {/* Dual Language Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                    Bengali Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descBn}
                    onChange={(e) => setFormData({ ...formData, descBn: e.target.value })}
                    placeholder="e.g. ১০০০/- টাকা ছাড় প্রতিগ্রাম সোনার গয়না কেনাকাটায়"
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                    English Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descEn}
                    onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                    placeholder="e.g. Flat Rs 1000 off per gram on all gold jewellery"
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
              </div>

              {/* Tag, Badge & Discount Value */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#C49A45] mb-1.5">
                    Offer Tag / Badge Pill *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. ₹1000 OFF/GM"
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                    Discount Value / Type
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      placeholder="e.g. 1000 or 25%"
                      className="w-1/2 bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-2.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                    />
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-1/2 bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-2 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                    >
                      <option value="FLAT">FLAT</option>
                      <option value="PERCENT">PERCENT</option>
                      <option value="FREE_MAKING">FREE MAKING</option>
                      <option value="GIFT">GIFT</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                    Placement Location
                  </label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  >
                    <option value="both">Both (Cards & Ticker)</option>
                    <option value="cards">Homepage Cards Only</option>
                    <option value="ticker">Announcement Ticker Only</option>
                  </select>
                </div>
              </div>

              {/* Validity Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                    Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
              </div>

              {/* Image Upload / Optional Image */}
              <div>
                <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                  Promotional Banner Image (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="/uploads/offer-banner.webp"
                    className="flex-1 bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                  <label className="px-3 py-2 bg-[#2E221A] hover:bg-[#3E3024] text-[#E5D7C5] rounded-lg text-xs cursor-pointer transition-colors whitespace-nowrap">
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

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#E5D7C5]">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2E221A] text-[#C49A45] focus:ring-0 focus:ring-offset-0 bg-[#1A120E]"
                  />
                  <span>Active & Published</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#E5D7C5]">
                  <input
                    type="checkbox"
                    checked={formData.highlight}
                    onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2E221A] text-[#C49A45] focus:ring-0 focus:ring-offset-0 bg-[#1A120E]"
                  />
                  <span>Highlight Card (Gold Glow)</span>
                </label>
              </div>

              {/* Action Buttons */}
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
                  {saving ? 'Saving...' : editingOffer ? 'Save Changes' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
