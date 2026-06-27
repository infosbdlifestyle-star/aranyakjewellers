"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminSettingsPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')) {
      router.push('/login');
      return;
    }
    fetchSettings();
  }, [isAuthenticated, user, router, isLoading]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        const settingsMap: any = {};
        data.forEach((s: any) => {
          settingsMap[s.key] = s.value;
        });
        setSettings(settingsMap);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, settingKey: string) => {
    if (!e.target.files || e.target.files.length === 0 || !token) return;
    const file = e.target.files[0];
    
    setUploadingImage(true);
    try {
      const result = await api.uploadImage(token, file);
      if (result.path) {
        setSettings({ ...settings, [settingKey]: result.path });
      }
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setStatus({ type: '', msg: '' });

    const payload = Object.keys(settings).map(key => ({
      key,
      value: settings[key]
    }));

    try {
      const res = await fetch('/api/settings/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setStatus({ type: 'success', msg: '✓ Settings saved successfully!' });
      } else {
        setStatus({ type: 'error', msg: '✗ Failed to save settings.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: '✗ Network error occurred.' });
    }
    setSaving(false);
    
    // Auto clear status
    setTimeout(() => {
      setStatus({ type: '', msg: '' });
    }, 3000);
  };

  const handleChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  if (isLoading || !user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return null;

  return (
    <main className="p-6 lg:p-10 flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-light tracking-tight text-white/90">Site <span className="text-secondary italic">Settings</span></h1>
          <p className="text-sm text-white/50 mt-1">Manage global dynamic content and information.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-white/50">
            <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading settings...</span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="max-w-4xl space-y-8 pb-10">
            
            {status.msg && (
              <div className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-3 shadow-lg ${
                status.type === 'success' 
                  ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {status.msg}
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-[#1A1515]/50 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <h2 className="text-xl font-serif text-white">Contact & Social</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Contact Email</label>
                  <input 
                    type="email" 
                    value={settings['contact_email'] || ''}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors"
                    placeholder="contact@aranyak.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Contact Phone</label>
                  <input 
                    type="text" 
                    value={settings['contact_phone'] || ''}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Instagram URL</label>
                  <input 
                    type="text" 
                    value={settings['social_instagram'] || ''}
                    onChange={(e) => handleChange('social_instagram', e.target.value)}
                    className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors"
                    placeholder="https://instagram.com/aranyakjewellers"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Facebook URL</label>
                  <input 
                    type="text" 
                    value={settings['social_facebook'] || ''}
                    onChange={(e) => handleChange('social_facebook', e.target.value)}
                    className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors"
                    placeholder="https://facebook.com/aranyakjewellers"
                  />
                </div>
              </div>
            </div>

            {/* Homepage Elements */}
            <div className="bg-[#1A1515]/50 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                </div>
                <h2 className="text-xl font-serif text-white">Homepage Elements</h2>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Marquee Text (separated by |)</label>
                <input 
                  type="text" 
                  value={settings['marquee_text'] || ''}
                  onChange={(e) => handleChange('marquee_text', e.target.value)}
                  className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors"
                  placeholder="100% BIS Hallmarked | Certified Diamonds"
                />
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 space-y-6">
                <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest mb-4">Homepage Images</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Editorial Break Image */}
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Editorial Break Image</label>
                    {settings['home_editorial_image'] ? (
                      <div className="relative h-32 bg-black rounded-xl border border-white/10 overflow-hidden group">
                        <img src={settings['home_editorial_image']} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setSettings({ ...settings, 'home_editorial_image': '' })}
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
                            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Upload</span>
                          </>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'home_editorial_image')} disabled={uploadingImage} />
                      </label>
                    )}
                    <p className="text-[10px] text-white/40 mt-2">Replaces the necklace image.</p>
                  </div>

                  {/* Bridal Block Image */}
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Bridal Edit Image</label>
                    {settings['home_bridal_image'] ? (
                      <div className="relative h-32 bg-black rounded-xl border border-white/10 overflow-hidden group">
                        <img src={settings['home_bridal_image']} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setSettings({ ...settings, 'home_bridal_image': '' })}
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
                            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Upload</span>
                          </>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'home_bridal_image')} disabled={uploadingImage} />
                      </label>
                    )}
                    <p className="text-[10px] text-white/40 mt-2">Replaces the bottom-right grid image.</p>
                  </div>

                  {/* Showroom CTA Image */}
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Showroom Hero Image</label>
                    {settings['home_showroom_image'] ? (
                      <div className="relative h-32 bg-black rounded-xl border border-white/10 overflow-hidden group">
                        <img src={settings['home_showroom_image']} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setSettings({ ...settings, 'home_showroom_image': '' })}
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
                            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Upload</span>
                          </>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'home_showroom_image')} disabled={uploadingImage} />
                      </label>
                    )}
                    <p className="text-[10px] text-white/40 mt-2">Replaces the bottom showroom image.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About Us Page */}
            <div className="bg-[#1A1515]/50 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                </div>
                <h2 className="text-xl font-serif text-white">About Us Page</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Paragraph 1</label>
                  <textarea 
                    value={settings['about_p1'] || ''}
                    onChange={(e) => handleChange('about_p1', e.target.value)}
                    className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors resize-none custom-scrollbar h-32"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Paragraph 2</label>
                  <textarea 
                    value={settings['about_p2'] || ''}
                    onChange={(e) => handleChange('about_p2', e.target.value)}
                    className="w-full bg-[#050202] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-colors resize-none custom-scrollbar h-32"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 sticky bottom-0 bg-[#0A0505]/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-secondary text-[#050202] hover:bg-secondary/90 px-10 py-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(179,139,63,0.3)] disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#050202] border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Save All Settings
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
