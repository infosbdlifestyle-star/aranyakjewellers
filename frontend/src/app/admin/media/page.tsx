"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface MediaItem {
  id: string;
  key: string;
  section: string;
  title: string;
  altText?: string;
  url: string;
  previousUrl?: string;
  usageLocation?: string;
  order: number;
  isActive: boolean;
  updatedAt?: string;
}

const SECTIONS = [
  { id: 'all', label: 'All Website Sections', icon: '✦' },
  { id: 'homepage_hero', label: 'Homepage Hero & Atmosphere', icon: '👑' },
  { id: 'top_picks', label: 'Top Picks & Curated Collections', icon: '💎' },
  { id: 'bridal_editorial', label: 'Bridal & Product Features', icon: '💍' },
  { id: 'craftsmanship', label: 'Craftsmanship & Brand Story', icon: '⚒️' },
  { id: 'about_us', label: 'About Us & Leadership', icon: '🏛️' },
  { id: 'showrooms', label: 'Showroom & Branch Images', icon: '📍' },
  { id: 'promotional_banners', label: 'Promotional Banners', icon: '🏷️' },
  { id: 'gallery', label: 'Other Gallery Images', icon: '🖼️' },
] as const;

export default function AdminMediaManagerPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Status message
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; msg: string }>({ type: '', msg: '' });

  // Modals & Active Edit States
  const [activeModal, setActiveModal] = useState<'replace' | 'edit' | 'create' | 'preview' | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Replace / Upload States
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [uploadAltText, setUploadAltText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Edit / Create Form States
  const [formData, setFormData] = useState({
    key: '',
    section: 'homepage_hero',
    title: '',
    altText: '',
    url: '',
    usageLocation: '',
  });

  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('aranyak_token') || localStorage.getItem('token') || '' : '');

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')) {
      router.push('/login');
      return;
    }
    fetchMedia();
  }, [isAuthenticated, user, router, isLoading]);

  const showStatus = (type: 'success' | 'error', msg: string) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus({ type: '', msg: '' }), 4500);
  };

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const data = await api.getMedia();
      setMediaList(Array.isArray(data) ? data : []);
    } catch (e: any) {
      showStatus('error', e?.message || 'Failed to load media.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Handle File Selection for Replace / Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      alert('Only JPG, JPEG, PNG, WebP, and AVIF image formats are allowed.');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max size is 10MB.`);
      e.target.value = '';
      return;
    }

    setUploadFile(file);
    const objectUrl = URL.createObjectURL(file);
    setUploadPreview(objectUrl);
  };

  // 2. Open Replace Modal
  const openReplaceModal = (item: MediaItem) => {
    setSelectedMedia(item);
    setUploadFile(null);
    setUploadPreview('');
    setUploadAltText(item.altText || '');
    setActiveModal('replace');
  };

  // 3. Confirm Replace Image
  const handleConfirmReplace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedia || !uploadFile) {
      alert('Please select an image file to upload.');
      return;
    }

    setIsProcessing(true);
    try {
      // Step A: Upload image
      const uploadRes = await api.uploadImage(authToken, uploadFile);
      if (!uploadRes || uploadRes.error || !uploadRes.path) {
        throw new Error(uploadRes?.error || uploadRes?.message || 'Image upload failed');
      }

      // Step B: Replace Media in Database (preserves previousUrl)
      await api.replaceMedia(authToken, selectedMedia.id, {
        url: uploadRes.path,
        altText: uploadAltText.trim() || selectedMedia.altText,
      });

      showStatus('success', `✓ Successfully replaced photo for "${selectedMedia.title}"! Changes are now live.`);
      setActiveModal(null);
      await fetchMedia();
    } catch (err: any) {
      console.error(err);
      showStatus('error', err?.message || 'Failed to replace image.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. One-Click Rollback / Restore
  const handleRestore = async (item: MediaItem) => {
    if (!item.previousUrl) return;
    const confirmed = confirm(
      `Are you sure you want to rollback "${item.title}" to its previous image:\n\n${item.previousUrl}\n\nThis will take effect immediately on the live website.`
    );
    if (!confirmed) return;

    setIsProcessing(true);
    try {
      await api.restoreMedia(authToken, item.id);
      showStatus('success', `✓ Successfully rolled back "${item.title}" to previous photo!`);
      await fetchMedia();
    } catch (err: any) {
      showStatus('error', err?.message || 'Failed to restore previous image.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. Open Edit Modal
  const openEditModal = (item: MediaItem) => {
    setSelectedMedia(item);
    setFormData({
      key: item.key,
      section: item.section,
      title: item.title,
      altText: item.altText || '',
      url: item.url,
      usageLocation: item.usageLocation || '',
    });
    setActiveModal('edit');
  };

  // 6. Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedia) return;

    setIsProcessing(true);
    try {
      await api.updateMedia(authToken, selectedMedia.id, {
        title: formData.title,
        altText: formData.altText,
        section: formData.section,
        usageLocation: formData.usageLocation,
        url: formData.url,
      });

      showStatus('success', `✓ Details updated for "${formData.title}".`);
      setActiveModal(null);
      await fetchMedia();
    } catch (err: any) {
      showStatus('error', err?.message || 'Failed to update media details.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 7. Delete with Confirmation
  const handleDelete = async (item: MediaItem) => {
    const confirmed = confirm(
      `Are you sure you want to remove the media slot for "${item.title}"?\n\nKey: ${item.key}\nSection: ${item.section}\n\nThis will remove the dynamic database assignment.`
    );
    if (!confirmed) return;

    setIsProcessing(true);
    try {
      await api.deleteMedia(authToken, item.id);
      showStatus('success', `✓ Media item "${item.title}" deleted.`);
      await fetchMedia();
    } catch (err: any) {
      showStatus('error', err?.message || 'Failed to delete media item.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 8. Open Add New Slot Modal
  const openCreateModal = () => {
    setFormData({
      key: '',
      section: activeSection !== 'all' ? activeSection : 'homepage_hero',
      title: '',
      altText: '',
      url: '/hero-necklace.png',
      usageLocation: '',
    });
    setActiveModal('create');
  };

  // 9. Save New Slot
  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.key.trim() || !formData.title.trim() || !formData.url.trim()) {
      alert('Please fill in key, title, and image URL.');
      return;
    }

    setIsProcessing(true);
    try {
      await api.createMedia(authToken, {
        key: formData.key.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        section: formData.section,
        title: formData.title.trim(),
        altText: formData.altText.trim(),
        url: formData.url.trim(),
        usageLocation: formData.usageLocation.trim(),
      });
      showStatus('success', `✓ New media slot "${formData.title}" created successfully!`);
      setActiveModal(null);
      await fetchMedia();
    } catch (err: any) {
      showStatus('error', err?.message || 'Failed to create media slot.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 10. Filtered list
  const filteredList = mediaList.filter((item) => {
    const matchesSection = activeSection === 'all' || item.section === activeSection;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.key.toLowerCase().includes(query) ||
      (item.usageLocation || '').toLowerCase().includes(query) ||
      (item.altText || '').toLowerCase().includes(query);
    return matchesSection && matchesSearch;
  });

  if (isLoading || !user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return null;

  return (
    <main className="p-6 lg:p-10 flex flex-col min-h-screen text-white/90">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-semibold mb-2">
            <span>📸</span>
            <span className="uppercase tracking-widest text-[10px]">Zero-Code Image Management</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-white/95">
            Website <span className="text-secondary italic gold-gradient">Media Manager</span>
          </h1>
          <p className="text-sm text-white/50 mt-1 max-w-2xl">
            Upload, replace, preview, and roll back website images across all sections. Changes update the live website immediately.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={fetchMedia}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2"
            title="Refresh from database"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={loading ? "animate-spin" : ""}>
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
              <path d="M16 21h5v-5"/>
            </svg>
            Refresh
          </button>

          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#C49A45] hover:bg-[#D4A955] text-[#211813] text-xs font-bold tracking-[0.15em] uppercase transition-all shadow-lg flex items-center gap-2 font-mono"
          >
            <span>+</span> Add Media Slot
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {status.msg && (
        <div className={`p-4 rounded-xl mb-6 border text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
          status.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
            : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
        }`}>
          <span>{status.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{status.msg}</span>
        </div>
      )}

      {/* Section Filters & Search Bar */}
      <div className="bg-[#120808] border border-white/10 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl">
        {/* Search Input */}
        <div className="mb-5">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text"
              placeholder="Search by photo title, key, section, or page location (e.g. 'bridal', 'about', 'hero')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1010] border border-white/15 focus:border-[#C49A45] rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Section Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {SECTIONS.map((sec) => {
            const count = sec.id === 'all' 
              ? mediaList.length 
              : mediaList.filter(m => m.section === sec.id).length;
            const isActive = activeSection === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-[#C49A45] text-[#211813] border-[#C49A45] shadow-lg'
                    : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border-white/10'
                }`}
              >
                <span>{sec.icon}</span>
                <span>{sec.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-[#211813] text-[#E7C880]' : 'bg-white/10 text-white/60'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Media Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-white/50 space-y-3">
          <div className="w-8 h-8 border-2 border-[#C49A45] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs tracking-widest uppercase font-mono">Loading media records...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-[#120808] border border-white/10 rounded-2xl p-12 text-center text-white/50">
          <p className="text-lg font-serif text-white/80 mb-2">No photo records found.</p>
          <p className="text-xs mb-6">
            {searchQuery ? `No photos matched "${searchQuery}".` : 'No photos in this section.'}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveSection('all'); }}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-[#140A0A] border border-white/10 hover:border-[#C49A45]/60 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl group transition-all duration-300"
            >
              {/* Image Thumbnail with Overlay */}
              <div className="relative aspect-video w-full bg-[#0A0505] overflow-hidden group/img cursor-pointer"
                onClick={() => { setSelectedMedia(item); setActiveModal('preview'); }}
              >
                {/* Image */}
                <img
                  src={item.url}
                  alt={item.altText || item.title}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  onError={(e: any) => {
                    // Fallback to placeholder on error
                    e.target.src = '/hero-necklace.png';
                  }}
                />

                {/* Section Tag Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#0A0505]/80 text-[#E7C880] border border-[#C49A45]/40 backdrop-blur-md">
                    {item.section.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Click to Preview Hint */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold uppercase tracking-widest text-white gap-2">
                  <span>🔍</span>
                  <span>Click to Preview</span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Stable Key & Title */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-serif font-bold text-lg text-white leading-snug group-hover:text-[#E7C880] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Machine Key Code */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-mono text-[#C49A45] bg-[#C49A45]/10 px-2 py-0.5 rounded border border-[#C49A45]/30">
                      key: {item.key}
                    </span>
                  </div>

                  {/* Where it is used */}
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/70 space-y-1 mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                      Website Location:
                    </div>
                    <div className="font-medium text-[#F8F1E5]">
                      {item.usageLocation || 'Assigned Website Section'}
                    </div>
                  </div>

                  {/* Current URL / Relative Path */}
                  <div className="text-[11px] text-white/40 break-all font-mono truncate" title={item.url}>
                    <span className="text-white/60">Path:</span> {item.url}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-white/10 space-y-2.5">
                  <div className="flex items-center gap-2">
                    {/* Primary Replace Button */}
                    <button
                      onClick={() => openReplaceModal(item)}
                      className="flex-1 py-2.5 rounded-xl bg-[#C49A45] hover:bg-[#D4A955] text-[#211813] text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12"/>
                      </svg>
                      Replace Photo
                    </button>

                    {/* Edit Details Button */}
                    <button
                      onClick={() => openEditModal(item)}
                      className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all"
                      title="Edit title & alt text"
                    >
                      Edit
                    </button>

                    {/* Delete Slot Button */}
                    <button
                      onClick={() => handleDelete(item)}
                      className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/10 text-white/50 hover:text-rose-300 text-xs font-semibold transition-all"
                      title="Delete slot"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Rollback / Restore Previous Photo Button (if previousUrl exists) */}
                  {item.previousUrl && (
                    <button
                      onClick={() => handleRestore(item)}
                      disabled={isProcessing}
                      className="w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                      title={`Restore previous photo: ${item.previousUrl}`}
                    >
                      <span>↺</span>
                      <span>Rollback to Previous Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODAL 1: REPLACE PHOTO WITH LIVE PREVIEW & INSTANT PUBLISH */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeModal === 'replace' && selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#140808] border border-white/15 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-white/50 hover:text-white text-xl"
            >
              ✕
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C49A45] block mb-1">
                Zero-Code Replacement
              </span>
              <h2 className="text-2xl font-serif font-light text-white">
                Replace Photo: <span className="text-[#E7C880]">{selectedMedia.title}</span>
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Website location: <span className="text-white/80 font-medium">{selectedMedia.usageLocation}</span>
              </p>
            </div>

            <form onSubmit={handleConfirmReplace} className="space-y-6">
              {/* Compare Current vs New Preview */}
              <div className="grid grid-cols-2 gap-4">
                {/* Current Photo */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 block">
                    Current Live Photo:
                  </span>
                  <div className="aspect-video bg-black/50 rounded-xl overflow-hidden border border-white/10 relative">
                    <img
                      src={selectedMedia.url}
                      alt="Current Photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] text-white/40 truncate font-mono">{selectedMedia.url}</p>
                </div>

                {/* New Photo Preview */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C49A45] block">
                    New Photo Preview:
                  </span>
                  <div className="aspect-video bg-black/50 rounded-xl overflow-hidden border-2 border-dashed border-[#C49A45]/50 flex items-center justify-center relative">
                    {uploadPreview ? (
                      <img
                        src={uploadPreview}
                        alt="New Photo Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-white/30 text-[11px]">
                        Select file below to preview
                      </div>
                    )}
                  </div>
                  {uploadFile && (
                    <p className="text-[10px] text-emerald-400 font-mono truncate">
                      ✓ {uploadFile.name} ({(uploadFile.size / 1024).toFixed(0)} KB)
                    </p>
                  )}
                </div>
              </div>

              {/* File Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                  Choose New Image File *
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                  onChange={handleFileChange}
                  required
                  className="w-full text-xs text-white/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-[#C49A45] file:text-[#211813] hover:file:bg-[#D4A955] cursor-pointer bg-white/5 p-2 rounded-xl border border-white/10"
                />
                <p className="text-[10px] text-white/40 mt-1.5">
                  Supported: JPG, JPEG, PNG, WebP, AVIF. Maximum size: 10MB.
                </p>
              </div>

              {/* Alt Text (SEO & Accessibility) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                  Image Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  placeholder="e.g. Royal Bengal 22K Gold Bridal Choker Necklace..."
                  className="w-full bg-[#1A1010] border border-white/15 focus:border-[#C49A45] rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-white/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || !uploadFile}
                  className="px-6 py-2.5 rounded-xl bg-[#C49A45] hover:bg-[#D4A955] text-[#211813] text-xs font-bold uppercase tracking-[0.15em] transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#211813] border-t-transparent rounded-full animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <span>Save & Publish Live</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODAL 2: EDIT METADATA & LOCATION DETAILS */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeModal === 'edit' && selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#140808] border border-white/15 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-white/50 hover:text-white text-xl"
            >
              ✕
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-serif font-light text-white">
                Edit Media <span className="text-[#E7C880]">Details</span>
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Configure key identifiers and website placement.
              </p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Slot Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full bg-[#1A1010] border border-white/15 focus:border-[#C49A45] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Website Section *
                </label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full bg-[#1A1010] border border-white/15 focus:border-[#C49A45] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                >
                  {SECTIONS.filter(s => s.id !== 'all').map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Where on the Website this Appears
                </label>
                <input
                  type="text"
                  value={formData.usageLocation}
                  onChange={(e) => setFormData({ ...formData, usageLocation: e.target.value })}
                  placeholder="e.g. Homepage > The Bridal Edit Feature..."
                  className="w-full bg-[#1A1010] border border-white/15 focus:border-[#C49A45] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  className="w-full bg-[#1A1010] border border-white/15 focus:border-[#C49A45] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                  className="w-full bg-[#1A1010] border border-white/15 focus:border-[#C49A45] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-white/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-[#C49A45] hover:bg-[#D4A955] text-[#211813] text-xs font-bold uppercase tracking-[0.15em] transition-all shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODAL 3: CREATE NEW MEDIA SLOT */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#140808] border border-white/15 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 text-white/50 hover:text-white text-xl"
            >
              ✕
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-serif font-light text-white">
                Add New <span className="text-[#E7C880]">Media Slot</span>
              </h2>
              <p className="text-xs text-white/50 mt-1">
                Create a dynamic, editable image slot for any website section.
              </p>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Slot Key (Unique Identifier) *
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="e.g. home_banner_festive or about_team_photo"
                  required
                  className="w-full bg-[#1A1010] border border-white/15 focus:border-[#C49A45] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Slot Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Festive Special Offer Banner"
                  required
                  className="w-full bg-[#1A1010] border border-white/15 focus:border-[#C49A45] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Website Section *
                </label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full bg-[#1A1010] border border-white/15 focus:border-[#C49A45] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                >
                  {SECTIONS.filter(s => s.id !== 'all').map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Where it Appears on Website
                </label>
                <input
                  type="text"
                  value={formData.usageLocation}
                  onChange={(e) => setFormData({ ...formData, usageLocation: e.target.value })}
                  placeholder="e.g. Homepage Top Hero, About Us Team Section..."
                  className="w-full bg-[#1A1010] border border-white/15 focus:border-[#C49A45] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Default Image Path / URL *
                </label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="/hero-banner.png or /uploads/..."
                  required
                  className="w-full bg-[#1A1010] border border-white/15 focus:border-[#C49A45] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-white/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-[#C49A45] hover:bg-[#D4A955] text-[#211813] text-xs font-bold uppercase tracking-[0.15em] transition-all shadow-lg"
                >
                  Create Media Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MODAL 4: FULL RESOLUTION IMAGE PREVIEW */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeModal === 'preview' && selectedMedia && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10 bg-black/90 backdrop-blur-lg animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div className="max-w-4xl w-full bg-[#120808] border border-white/20 rounded-2xl overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-white">{selectedMedia.title}</h3>
                <p className="text-xs text-white/50">{selectedMedia.usageLocation}</p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 flex items-center justify-center bg-black/50 max-h-[70vh] overflow-auto">
              <img
                src={selectedMedia.url}
                alt={selectedMedia.altText || selectedMedia.title}
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-white/60">
              <span className="font-mono">{selectedMedia.url}</span>
              <button
                onClick={() => {
                  setActiveModal('replace');
                }}
                className="px-4 py-2 rounded-xl bg-[#C49A45] text-[#211813] font-bold uppercase tracking-wider"
              >
                Replace this Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
