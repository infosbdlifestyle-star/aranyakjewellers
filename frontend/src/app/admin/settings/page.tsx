"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        setStatus({ type: 'success', msg: 'Settings saved successfully' });
      } else {
        setStatus({ type: 'error', msg: 'Failed to save settings' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'An error occurred' });
    }
    setSaving(false);
  };

  const handleChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  if (isLoading || !user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return null;

  return (
    <main className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-all" title="Back to Dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Site Settings</h1>
                <p className="text-xs text-gray-500">Manage global dynamic content</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-4xl mt-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading settings...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            
            {status.msg && (
              <div className={`p-4 rounded-lg text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {status.msg}
              </div>
            )}

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold">Contact Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input 
                  type="email" 
                  value={settings['contact_email'] || ''}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  placeholder="e.g. contact@aranyak.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input 
                  type="text" 
                  value={settings['contact_phone'] || ''}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  placeholder="e.g. +91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Social - Instagram URL</label>
                <input 
                  type="text" 
                  value={settings['social_instagram'] || ''}
                  onChange={(e) => handleChange('social_instagram', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  placeholder="https://instagram.com/aranyakjewellers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Social - Facebook URL</label>
                <input 
                  type="text" 
                  value={settings['social_facebook'] || ''}
                  onChange={(e) => handleChange('social_facebook', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  placeholder="https://facebook.com/aranyakjewellers"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold">Homepage Elements</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marquee Text (separated by |)</label>
                <input 
                  type="text" 
                  value={settings['marquee_text'] || ''}
                  onChange={(e) => handleChange('marquee_text', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  placeholder="100% BIS Hallmarked | Certified Diamonds | Legacy Since 1995"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold">About Us Page</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About Us Paragraph 1</label>
                <textarea 
                  value={settings['about_p1'] || ''}
                  onChange={(e) => handleChange('about_p1', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm h-24"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About Us Paragraph 2</label>
                <textarea 
                  value={settings['about_p2'] || ''}
                  onChange={(e) => handleChange('about_p2', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm h-24"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-black text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
