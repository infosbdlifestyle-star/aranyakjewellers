"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminStoresPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{type: string, msg: string}>({type: '', msg: ''});
  
  const [formData, setFormData] = useState({ id: '', name: '', address: '', phone: '', mapUrl: '', isActive: true, order: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')) {
      router.push('/login');
      return;
    }
    fetchStores();
  }, [isAuthenticated, user, router, isLoading]);

  const fetchStores = async () => {
    try {
      const res = await fetch('/api/stores');
      if (res.ok) {
        setStores(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setSaveStatus({type: '', msg: ''});

    const payload = { ...formData };
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/stores/${formData.id}` : '/api/stores';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: payload.name,
          address: payload.address,
          phone: payload.phone,
          mapUrl: payload.mapUrl,
          isActive: payload.isActive,
          order: Number(payload.order)
        })
      });
      if (res.ok) {
        setSaveStatus({type: 'success', msg: isEditing ? '✓ Store updated!' : '✓ Store added!'});
        fetchStores();
        setTimeout(() => setShowModal(false), 1000);
      } else {
        setSaveStatus({type: 'error', msg: '✗ Failed to save store.'});
      }
    } catch (err) {
      setSaveStatus({type: 'error', msg: '✗ Network error.'});
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this store?')) return;
    try {
      const res = await fetch(`/api/stores/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchStores();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openNewStore = () => {
    setFormData({ id: '', name: '', address: '', phone: '', mapUrl: '', isActive: true, order: 0 });
    setIsEditing(false);
    setSaveStatus({type: '', msg: ''});
    setShowModal(true);
  };

  const openEditStore = (store: any) => {
    setFormData(store);
    setIsEditing(true);
    setSaveStatus({type: '', msg: ''});
    setShowModal(true);
  };

  if (isLoading || !user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return null;

  return (
    <main className="p-6 lg:p-10 flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-light tracking-tight text-white/90">Store <span className="text-secondary italic">Locations</span></h1>
          <p className="text-sm text-white/50 mt-1">Manage physical boutiques.</p>
        </div>
        <button 
          onClick={openNewStore}
          className="bg-secondary text-[#050202] hover:bg-secondary/90 px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(179,139,63,0.3)] flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Store
        </button>
      </div>

      <div className="bg-[#1A1515]/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest">Store Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest">Address</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest">Phone</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-white/50">
                    <div className="animate-pulse flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                      Loading stores...
                    </div>
                  </td>
                </tr>
              ) : stores.length > 0 ? (
                stores.map((store) => (
                  <tr key={store.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white/90">{store.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-white/60 truncate max-w-[250px]">{store.address}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-white/60">{store.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        store.isActive 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {store.isActive ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditStore(store)} 
                          className="p-2 bg-white/5 hover:bg-secondary/20 hover:text-secondary rounded-lg text-white/60 transition-colors"
                          title="Edit Store"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(store.id)} 
                          className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-white/60 transition-colors"
                          title="Delete Store"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-white/40">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-4 opacity-50"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <p className="text-sm">No stores found. Click "Add Store" to create one.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !saving && setShowModal(false)} />
          
          <div className="bg-[#1A1515] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-in zoom-in-95 fade-in duration-200 custom-scrollbar">
            <div className="sticky top-0 bg-[#1A1515]/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between z-20">
              <h2 className="text-xl font-serif text-white">
                {isEditing ? 'Edit Store' : 'Add New Store'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="p-2 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6">
              {saveStatus.msg && (
                <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                  saveStatus.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {saveStatus.msg}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Store Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Address</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors resize-none custom-scrollbar"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Phone</label>
                    <input 
                      type="text" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Google Maps Embed URL</label>
                    <input 
                      type="text" 
                      value={formData.mapUrl}
                      onChange={(e) => setFormData({...formData, mapUrl: e.target.value})}
                      className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors"
                      placeholder="https://www.google.com/maps/embed?..."
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Display Order</label>
                    <input 
                      type="number" 
                      required
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
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
                      <span className="text-sm font-medium text-white">{formData.isActive ? 'Active (Open)' : 'Closed'}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
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
                      {isEditing ? 'Save Changes' : 'Add Store'}
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
