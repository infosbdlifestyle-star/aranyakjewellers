"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { removeEmojis } from '@/components/layout/PromotionalAnnouncementBar';

interface TickerItem {
  id: string;
  textBn: string;
  textEn?: string | null;
  linkedOfferId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  speed: number;
  direction: string;
  separator: string;
  isActive: boolean;
  order: number;
}

export default function AdminTickerPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [syncingOffers, setSyncingOffers] = useState(false);

  // Modal & Edit states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<TickerItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const initialForm = {
    textBn: '',
    textEn: '',
    speed: 40,
    direction: 'rtl',
    separator: '—',
    startDate: '',
    endDate: '',
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN' && user?.role !== 'STAFF')) {
      router.push('/admin/login');
      return;
    }
    fetchMessages();
  }, [isAuthenticated, user, router, isLoading]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = token ? await api.getTickerMessagesAdmin(token) : await api.getTickerMessages();
      if (Array.isArray(data)) {
        setMessages(data.sort((a, b) => a.order - b.order));
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to load announcement messages.' });
    }
    setLoading(false);
  };

  const handleOpenModal = (item: TickerItem | null = null) => {
    setStatusMessage(null);
    if (item) {
      setEditingMessage(item);
      setFormData({
        textBn: item.textBn || '',
        textEn: item.textEn || '',
        speed: item.speed || 40,
        direction: item.direction || 'rtl',
        separator: item.separator || '—',
        startDate: item.startDate ? item.startDate.slice(0, 10) : '',
        endDate: item.endDate ? item.endDate.slice(0, 10) : '',
        isActive: Boolean(item.isActive),
      });
    } else {
      setEditingMessage(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMessage(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!formData.textBn.trim()) {
      setStatusMessage({ type: 'error', text: 'Bengali announcement text is required.' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    // Sanitize emoji out of text to preserve luxury look
    const sanitizedBn = removeEmojis(formData.textBn.trim());
    const sanitizedEn = formData.textEn ? removeEmojis(formData.textEn.trim()) : null;

    const payload = {
      ...formData,
      textBn: sanitizedBn,
      textEn: sanitizedEn,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      order: editingMessage ? editingMessage.order : messages.length,
    };

    try {
      let res;
      if (editingMessage) {
        res = await api.updateTickerMessage(token, editingMessage.id, payload);
      } else {
        res = await api.createTickerMessage(token, payload);
      }

      if (res && (res.id || !res.error)) {
        setStatusMessage({
          type: 'success',
          text: editingMessage ? 'Ticker message updated successfully!' : 'Ticker message created successfully!',
        });
        handleCloseModal();
        await fetchMessages();
      } else {
        setStatusMessage({ type: 'error', text: res?.message || 'Error saving ticker message.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network failure while saving message.' });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    setSaving(true);
    try {
      await api.deleteTickerMessage(token, id);
      setStatusMessage({ type: 'success', text: 'Message deleted successfully.' });
      setIsDeleting(null);
      await fetchMessages();
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to delete ticker message.' });
    }
    setSaving(false);
  };

  const handleToggleActive = async (item: TickerItem) => {
    if (!token) return;
    try {
      await api.updateTickerMessage(token, item.id, { isActive: !item.isActive });
      setMessages(prev => prev.map(m => m.id === item.id ? { ...m, isActive: !m.isActive } : m));
    } catch {
      setStatusMessage({ type: 'error', text: 'Could not toggle message status.' });
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (!token) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= messages.length) return;

    const reordered = [...messages];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const itemsPayload = reordered.map((item, idx) => ({ id: item.id, order: idx }));
    setMessages(reordered.map((item, idx) => ({ ...item, order: idx })));

    try {
      await api.reorderTickerMessages(token, itemsPayload);
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to persist order.' });
      fetchMessages();
    }
  };

  // Sync active offers into ticker
  const handleSyncWithOffers = async () => {
    if (!token) return;
    setSyncingOffers(true);
    setStatusMessage(null);
    try {
      const offers = await api.getOffers();
      if (Array.isArray(offers)) {
        const eligible = offers.filter(o => o.isActive && (o.placement === 'both' || o.placement === 'ticker'));
        let addedCount = 0;
        for (const off of eligible) {
          const textCandidate = off.descBn ? `${off.titleBn}: ${off.descBn}` : off.titleBn;
          const exists = messages.some(m => m.textBn.includes(off.titleBn) || m.linkedOfferId === off.id);
          if (!exists) {
            await api.createTickerMessage(token, {
              textBn: removeEmojis(textCandidate),
              textEn: off.titleEn,
              linkedOfferId: off.id,
              speed: 40,
              direction: 'rtl',
              separator: '—',
              isActive: true,
              order: messages.length + addedCount,
            });
            addedCount++;
          }
        }
        await fetchMessages();
        setStatusMessage({
          type: 'success',
          text: `Sync complete. ${addedCount} new promotional offer messages synced to ticker.`,
        });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to sync with promotional offers.' });
    }
    setSyncingOffers(false);
  };

  const activeMessages = useMemo(() => {
    return messages.filter(m => m.isActive);
  }, [messages]);

  const currentSeparator = messages[0]?.separator || '—';
  const currentSpeed = messages[0]?.speed || 40;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A201B]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F1713] border border-[#C49A45]/30 text-[#D6B15D] text-[11px] font-bold tracking-widest uppercase mb-2">
            <span>✦</span>
            <span>Continuous Ticker Broadcast</span>
          </div>
          <h1 className="text-3xl font-serif text-[#F5E6D3] tracking-wide">Announcement Ticker Management</h1>
          <p className="text-xs sm:text-sm text-[#A89887] mt-1">
            Real-time control over the top announcement bar with 0% emojis, custom separators, speed, and offer synchronization.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncWithOffers}
            disabled={syncingOffers}
            className="px-4 py-2.5 rounded-lg bg-[#1F1713] border border-[#C49A45]/50 text-[#D6B15D] font-semibold text-xs tracking-wider hover:bg-[#C49A45]/15 transition-all flex items-center gap-2"
          >
            <span>🔄</span>
            <span>{syncingOffers ? 'Syncing...' : 'Sync From Offers'}</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#C49A45] to-[#8C6B28] text-[#120B08] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="text-base leading-none">+</span>
            <span>Add Message</span>
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

      {/* Live Simulator Preview */}
      <div className="bg-[#140E0B] p-5 rounded-xl border border-[#2A201B] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#C49A45] uppercase tracking-wider">
              Live Ticker Preview ({activeMessages.length} Active Messages)
            </span>
            <span className="text-[10px] text-[#8A7969] bg-[#1F1713] px-2 py-0.5 rounded border border-[#2A201B]">
              Speed: {currentSpeed}s
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[#1A120E] p-1 rounded-lg border border-[#2A201B]">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                previewMode === 'desktop' ? 'bg-[#C49A45] text-[#120B08] font-bold' : 'text-[#8A7969] hover:text-[#F5E6D3]'
              }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                previewMode === 'mobile' ? 'bg-[#C49A45] text-[#120B08] font-bold' : 'text-[#8A7969] hover:text-[#F5E6D3]'
              }`}
            >
              Mobile View
            </button>
          </div>
        </div>

        {/* The simulated track replicating champagne gold theme */}
        <div className={`mx-auto overflow-hidden transition-all duration-300 ${
          previewMode === 'mobile' ? 'max-w-sm border-x border-[#C49A45]/30' : 'w-full'
        }`}>
          <div className="bg-gradient-to-r from-[#D6B15D] via-[#F3E3B6] to-[#D6B15D] text-[#211813] font-serif py-2.5 px-4 shadow-inner overflow-hidden relative">
            {activeMessages.length === 0 ? (
              <p className="text-center text-xs font-medium italic">No active ticker announcements to display.</p>
            ) : (
              <div className="flex items-center space-x-6 whitespace-nowrap overflow-x-auto no-scrollbar py-0.5">
                {[...activeMessages, ...activeMessages].map((msg, i) => (
                  <div key={i} className="inline-flex items-center space-x-6 shrink-0">
                    <span className="text-xs font-medium tracking-wide">
                      {msg.textBn} {msg.textEn ? `(${msg.textEn})` : ''}
                    </span>
                    <span className="text-[#8C6B28] text-xs font-bold select-none">{msg.separator || currentSeparator}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="text-[11px] text-[#8A7969] italic">
          * Rendered without emojis. Standard luxury separators: &ldquo;—&rdquo;, &ldquo;•&rdquo;, &ldquo;✦&rdquo;, &ldquo;◆&rdquo;.
        </p>
      </div>

      {/* Messages List */}
      <div className="bg-[#140E0B] p-5 rounded-xl border border-[#2A201B] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2A201B]">
          <h2 className="text-base font-serif font-bold text-[#F5E6D3]">Configured Announcements</h2>
          <span className="text-xs text-[#8A7969]">{messages.length} total messages</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-[#8A7969] text-xs uppercase tracking-widest animate-pulse">
            Loading announcements...
          </div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center text-[#8A7969]">
            <p className="text-sm text-[#F5E6D3]">No announcements created yet</p>
            <p className="text-xs mt-1">Click &quot;Add Message&quot; or &quot;Sync From Offers&quot; above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((item, index) => (
              <div
                key={item.id}
                className="bg-[#1A120E] border border-[#2E221A] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#C49A45]/30 transition-all"
              >
                <div className="flex items-start gap-3 flex-1">
                  {/* Order controls */}
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
                      disabled={index === messages.length - 1}
                      className="p-1 rounded bg-[#1F1713] text-[#A89887] hover:text-[#C49A45] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-serif font-bold text-[#F5E6D3]">
                        {item.textBn}
                      </span>
                      {item.linkedOfferId && (
                        <span className="px-2 py-0.5 rounded bg-[#C49A45]/15 text-[#D6B15D] text-[9px] font-bold tracking-wider uppercase border border-[#C49A45]/30">
                          Synced Offer
                        </span>
                      )}
                    </div>
                    {item.textEn && (
                      <p className="text-xs text-[#8A7969] font-sans">
                        English: {item.textEn}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-[11px] text-[#A89887] pt-1">
                      <span>Separator: <strong className="text-[#C49A45]">{item.separator || '—'}</strong></span>
                      <span>Speed: {item.speed}s</span>
                      {(item.startDate || item.endDate) && (
                        <span className="text-[10px] text-[#C49A45]/80 font-mono">
                          🗓 {item.startDate ? item.startDate.slice(0, 10) : 'Now'} → {item.endDate ? item.endDate.slice(0, 10) : 'Indefinite'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#2E221A]">
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors flex items-center gap-1.5 ${
                      item.isActive 
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/50' 
                        : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                    <span>{item.isActive ? 'Active' : 'Inactive'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal(item)}
                    className="px-3 py-1.5 rounded-lg bg-[#1F1713] text-[#E5D7C5] border border-[#2E221A] hover:border-[#C49A45] hover:text-[#C49A45] text-xs font-semibold tracking-wider transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setIsDeleting(item.id)}
                    className="p-2 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-900/50 hover:bg-rose-900/60 transition-colors text-xs"
                    title="Delete message"
                  >
                    ✕
                  </button>
                </div>

                {/* Inline Delete Confirm */}
                {isDeleting === item.id && (
                  <div className="w-full mt-3 p-3 bg-rose-950/80 border border-rose-700/60 rounded-lg flex items-center justify-between text-xs text-rose-200">
                    <span>Delete this announcement message permanently?</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(item.id)}
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
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#140E0B] border border-[#C49A45]/40 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A201B] mb-6">
              <div>
                <h2 className="text-xl font-serif text-[#F5E6D3]">
                  {editingMessage ? 'Edit Announcement Message' : 'New Ticker Announcement'}
                </h2>
                <p className="text-xs text-[#8A7969] mt-0.5">
                  Enter clean text. All emojis will be automatically stripped.
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
              <div>
                <label className="block text-xs font-semibold text-[#C49A45] mb-1.5">
                  Bengali Announcement Text *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.textBn}
                  onChange={(e) => setFormData({ ...formData, textBn: e.target.value })}
                  placeholder="e.g. সোনার গয়না: ১০০০/- টাকা ছাড় প্রতিগ্রাম সোনার গয়না কেনাকাটায়"
                  className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                  English Announcement Text (Optional)
                </label>
                <input
                  type="text"
                  value={formData.textEn}
                  onChange={(e) => setFormData({ ...formData, textEn: e.target.value })}
                  placeholder="e.g. Gold Jewellery: Flat Rs 1000 off per gram"
                  className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                    Separator
                  </label>
                  <select
                    value={formData.separator}
                    onChange={(e) => setFormData({ ...formData, separator: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  >
                    <option value="—">— (Em-dash)</option>
                    <option value="•">• (Bullet)</option>
                    <option value="✦">✦ (Diamond Star)</option>
                    <option value="◆">◆ (Rhombus)</option>
                    <option value="|">| (Pipe)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                    Speed (Seconds)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={120}
                    value={formData.speed}
                    onChange={(e) => setFormData({ ...formData, speed: Number(e.target.value) })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#A89887] mb-1.5">
                    Direction
                  </label>
                  <select
                    value={formData.direction}
                    onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                    className="w-full bg-[#1A120E] border border-[#2E221A] text-[#F5E6D3] text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#C49A45]"
                  >
                    <option value="rtl">Right to Left (Standard)</option>
                    <option value="ltr">Left to Right</option>
                  </select>
                </div>
              </div>

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

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#E5D7C5]">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-[#2E221A] text-[#C49A45] focus:ring-0 focus:ring-offset-0 bg-[#1A120E]"
                  />
                  <span>Active &amp; Broadcast Live on Website</span>
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
                  {saving ? 'Saving...' : editingMessage ? 'Save Changes' : 'Create Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
