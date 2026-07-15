"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AdminSecurityPage() {
  const { token, user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [totpData, setTotpData] = useState<{ qrCode: string; secret: string } | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Local state to track if TOTP is enabled (derived from user context, but updated locally on success)
  const [isTotpEnabled, setIsTotpEnabled] = useState(user?.totpEnabled || false);

  useEffect(() => {
    setIsTotpEnabled(user?.totpEnabled || false);
  }, [user]);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.generateTotp(token!);
      setTotpData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate 2FA setup');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.enableTotp(token!, totpCode);
      setIsTotpEnabled(true);
      setTotpData(null);
      setTotpCode('');
      setMessage('Two-Factor Authentication has been successfully enabled.');
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!confirm('Are you sure you want to disable 2FA? This will reduce your account security.')) return;
    setLoading(true);
    setError('');
    try {
      await api.disableTotp(token!);
      setIsTotpEnabled(false);
      setMessage('Two-Factor Authentication has been disabled.');
    } catch (err: any) {
      setError(err.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-[#0A0505] p-6 rounded-2xl border border-white/5">
        <h1 className="text-2xl font-serif text-white">Security Settings</h1>
        <p className="text-xs text-white/50 mt-1">Manage your account security and two-factor authentication.</p>
      </div>

      {message && <div className="p-4 bg-green-900/20 border border-green-500/20 text-green-400 rounded-lg text-sm">{message}</div>}
      {error && <div className="p-4 bg-red-900/20 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}

      <div className="bg-[#0A0505] p-8 rounded-2xl border border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-serif text-white">Two-Factor Authentication (2FA)</h2>
            <p className="text-sm text-white/50 mt-1">Add an extra layer of security to your account.</p>
          </div>
          <div>
            {isTotpEnabled ? (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">Enabled</span>
            ) : (
              <span className="px-3 py-1 bg-white/10 text-white/50 rounded-full text-xs font-bold uppercase tracking-wider">Disabled</span>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          {isTotpEnabled ? (
            <div className="space-y-4">
              <p className="text-sm text-white/70">Your account is currently protected by 2FA. You will need your authenticator app to log in.</p>
              <button 
                onClick={handleDisable}
                disabled={loading}
                className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider"
              >
                Disable 2FA
              </button>
            </div>
          ) : !totpData ? (
            <div className="space-y-4">
              <p className="text-sm text-white/70">Enable 2FA to protect your account from unauthorized access. You'll need an app like Google Authenticator or Authy.</p>
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="btn-luxury px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                {loading ? 'Generating...' : 'Set Up 2FA'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-xl text-center space-y-4">
                <p className="text-sm font-bold text-white uppercase tracking-wider">1. Scan this QR Code</p>
                <p className="text-xs text-white/50">Open your authenticator app and scan the code below.</p>
                <div className="inline-block p-2 bg-white rounded-lg">
                  <img src={totpData.qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
                <p className="text-xs text-white/50 mt-4">Or enter this manual code:</p>
                <code className="block p-3 bg-[#050202] border border-white/10 rounded text-secondary font-mono tracking-widest">{totpData.secret}</code>
              </div>

              <form onSubmit={handleEnable} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/50 font-bold block mb-2">2. Enter the 6-digit code</label>
                  <input 
                    type="text" 
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full max-w-sm bg-[#050202] border border-white/10 rounded-lg p-3 text-white focus:border-secondary outline-none tracking-widest text-center text-xl"
                    placeholder="000000"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setTotpData(null)} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-xs font-bold uppercase tracking-wider">Cancel</button>
                  <button type="submit" disabled={loading || totpCode.length !== 6} className="btn-luxury px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-50">
                    {loading ? 'Verifying...' : 'Verify & Enable'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
