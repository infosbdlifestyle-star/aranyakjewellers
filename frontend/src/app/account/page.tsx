"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress?: {
    fullName?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
  };
}

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    category: string;
    subCategory?: string;
    goldPurity?: number;
    goldWeight?: number;
    diamondCarat?: number;
    images?: string[];
    coverImage?: string;
    stockCount?: number;
  };
}

export default function AccountPage() {
  const { user, token, isAuthenticated, isLoading, logout, updateUser } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses' | 'security' | 'concierge'>('profile');

  // Profile state
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 2FA state
  const [totpLoading, setTotpLoading] = useState(false);
  const [totpData, setTotpData] = useState<{ qrCode: string; secret: string } | null>(null);
  const [totpVerifyCode, setTotpVerifyCode] = useState('');
  const [totpMsg, setTotpMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Wishlist state
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: 'Tripura',
    zip: '',
    phone: '',
    isDefault: false,
  });

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [isAuthenticated, isLoading, router]);

  // Load user profile details
  const loadProfile = useCallback(async () => {
    if (!token) return;
    try {
      const data = await api.getProfile(token);
      if (data && data.id) {
        setName(data.name || '');
        setMobile(data.mobile || '');
        setAddresses(data.addresses || []);
        updateUser({ 
          name: data.name, 
          mobile: data.mobile,
          totpEnabled: data.totpEnabled 
        });
      }
    } catch {
      // safe fallback
    }
  }, [token, updateUser]);

  // Load orders
  const loadOrders = useCallback(async () => {
    if (!token) return;
    setOrdersLoading(true);
    try {
      const data = await api.getMyOrders(token);
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [token]);

  // Load wishlist
  const loadWishlist = useCallback(async () => {
    if (!token) return;
    setWishlistLoading(true);
    try {
      const data = await api.getWishlist(token);
      setWishlist(Array.isArray(data) ? data : []);
    } catch {
      setWishlist([]);
    } finally {
      setWishlistLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadProfile();
      loadOrders();
      loadWishlist();
    }
  }, [token, loadProfile, loadOrders, loadWishlist]);

  // Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      const res = await api.updateProfile(token, { name, mobile });
      if (res && res.id) {
        updateUser({ name: res.name, mobile: res.mobile });
        setProfileMsg({ type: 'success', text: 'Patron profile updated successfully.' });
      } else {
        setProfileMsg({ type: 'error', text: res?.message || 'Failed to update profile.' });
      }
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err?.message || 'Error updating profile.' });
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must contain at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'The new passwords entered do not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await api.updateProfile(token, { currentPassword, newPassword });
      if (res && res.id) {
        setPasswordMsg({ type: 'success', text: 'Your password has been changed securely.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ type: 'error', text: res?.message || 'Failed to change password. Please verify your current password.' });
      }
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err?.message || 'Error updating password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle 2FA Setup
  const handleStartTotpSetup = async () => {
    if (!token) return;
    setTotpLoading(true);
    setTotpMsg(null);
    try {
      const res = await api.generateTotp(token);
      if (res && res.qrCode) {
        setTotpData(res);
      } else {
        setTotpMsg({ type: 'error', text: 'Could not generate 2FA key. Please try again.' });
      }
    } catch {
      setTotpMsg({ type: 'error', text: 'Failed to initiate 2FA setup.' });
    } finally {
      setTotpLoading(false);
    }
  };

  const handleVerifyEnableTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !totpVerifyCode) return;
    setTotpLoading(true);
    setTotpMsg(null);
    try {
      const res = await api.enableTotp(token, totpVerifyCode.trim());
      if (res && res.success) {
        setTotpMsg({ type: 'success', text: 'Two-Factor Authentication is now enabled!' });
        setTotpData(null);
        setTotpVerifyCode('');
        updateUser({ totpEnabled: true });
        await loadProfile();
      } else {
        setTotpMsg({ type: 'error', text: res?.message || 'Invalid verification code. Please check your authenticator app.' });
      }
    } catch {
      setTotpMsg({ type: 'error', text: 'Failed to enable Two-Factor Authentication.' });
    } finally {
      setTotpLoading(false);
    }
  };

  const handleDisableTotp = async () => {
    if (!token || !confirm('Are you sure you want to disable Two-Factor Authentication?')) return;
    setTotpLoading(true);
    setTotpMsg(null);
    try {
      const res = await api.disableTotp(token);
      if (res && res.success) {
        setTotpMsg({ type: 'success', text: 'Two-Factor Authentication has been disabled.' });
        updateUser({ totpEnabled: false });
        await loadProfile();
      }
    } catch {
      setTotpMsg({ type: 'error', text: 'Failed to disable 2FA.' });
    } finally {
      setTotpLoading(false);
    }
  };

  // Handle Add Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setAddressLoading(true);
    try {
      const res = await api.addAddress(token, newAddress);
      if (res && res.id) {
        await loadProfile();
        setShowAddAddress(false);
        setNewAddress({
          fullName: '',
          street: '',
          city: '',
          state: 'Tripura',
          zip: '',
          phone: '',
          isDefault: false,
        });
      }
    } catch {
      // error
    } finally {
      setAddressLoading(false);
    }
  };

  // Handle Delete Address
  const handleDeleteAddress = async (id: string) => {
    if (!token || !confirm('Remove this address from your patron profile?')) return;
    try {
      await api.deleteAddress(token, id);
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch {
      // error
    }
  };

  // Handle Set Default Address
  const handleSetDefaultAddress = async (id: string) => {
    if (!token) return;
    try {
      await api.setDefaultAddress(token, id);
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    } catch {
      // error
    }
  };

  // Handle Remove from Wishlist
  const handleRemoveWishlist = async (productId: string) => {
    if (!token) return;
    try {
      await api.toggleWishlist(token, productId);
      setWishlist(prev => prev.filter(w => w.product?.id !== productId));
    } catch {
      // error
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#070303] text-[#FAF7F2] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#E5C158] border-t-transparent rounded-full animate-spin" />
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#E5C158]/80 font-medium">Verifying Patron Credentials...</p>
        </div>
      </main>
    );
  }

  const initial = (user?.name || 'Patron').charAt(0).toUpperCase();
  const patronId = user?.id ? `AJ-${user.id.slice(-6).toUpperCase()}` : 'AJ-PATRON';
  const roleName = user?.role === 'SUPER_ADMIN' ? 'Super Administrator' : user?.role === 'ADMIN' ? 'Administrator' : 'Royal Patron Member';

  return (
    <main className="min-h-screen bg-[#080404] text-[#FAF7F2] pt-28 pb-24 selection:bg-[#E5C158] selection:text-[#76551C] relative">
      {/* Subtle Ambient Gold Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-[#E5C158]/8 via-[#C5A059]/4 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-[#8B1E1E]/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. Elite Patron Membership Header Card */}
        <div className="relative rounded-2xl bg-gradient-to-br from-[#150B0B] via-[#0E0606] to-[#120808] border border-[#C5A059]/30 p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] mb-8 overflow-hidden backdrop-blur-md">
          {/* Top Gold Trim Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5C158] to-transparent opacity-80" />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#E5C158]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            
            {/* Left: Avatar Crest + Patron Details */}
            <div className="flex items-start sm:items-center space-x-5 sm:space-x-7">
              {/* Ornate Monogram Crest */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-[#241313] to-[#0A0505] border-2 border-[#E5C158]/60 flex items-center justify-center shadow-[0_0_30px_rgba(203,161,53,0.25)] relative group">
                  <div className="absolute inset-1 rounded-full border border-[#E5C158]/20" />
                  <span className="font-serif text-3xl sm:text-4xl text-[#E5C158] font-light tracking-wide">{initial}</span>
                  <div className="absolute -bottom-1 -right-1 bg-[#E5C158] text-[#120808] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                    ✦
                  </div>
                </div>
              </div>

              {/* Patron Bio Info */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-serif text-2xl sm:text-4xl font-light tracking-wide text-white">
                    {user?.name || 'Valued Patron'}
                  </h1>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold px-3 py-1 bg-[#E5C158]/15 border border-[#E5C158]/40 text-[#E5C158] rounded-full shadow-sm">
                    {roleName}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#E5C158]/80 font-medium tracking-wider">
                  <span className="flex items-center gap-1.5 text-white/70">
                    <svg className="w-3.5 h-3.5 text-[#E5C158]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {user?.email}
                  </span>
                  {mobile && (
                    <span className="flex items-center gap-1.5 text-white/70">
                      <svg className="w-3.5 h-3.5 text-[#E5C158]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {mobile}
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-widest text-[#E5C158]/90 font-mono bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
                    ID: {patronId}
                  </span>
                </div>

                <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>BIS 916 Certified Patron • Active Membership</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
              {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                <Link
                  href="/admin"
                  className="px-4 py-2.5 bg-gradient-to-r from-[#E5C158] to-[#C5A059] hover:from-[#F3E5AB] hover:to-[#E5C158] text-[#120808] text-xs uppercase tracking-[0.2em] font-bold rounded-lg transition-all shadow-[0_4px_15px_rgba(203,161,53,0.3)] flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect width="18" height="18" x="3" y="3" rx="2" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9h18M9 21V9" />
                  </svg>
                  Admin Console
                </Link>
              )}

              <a
                href="https://wa.me/919436501506?text=Hello%20Aranyak%20Jewellers%20Concierge%2C%20I%20am%20a%20patron%20inquiring%20about%20my%20account."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-600/50 text-emerald-300 text-xs uppercase tracking-[0.2em] font-bold rounded-lg transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.074-2.228-.553-1.832-.751-3.003-2.613-3.094-2.734-.09-.12-1.077-1.433-1.077-2.732 0-1.299.68-1.939.921-2.203.241-.264.527-.33.704-.33.177 0 .354.002.508.01.163.008.383-.062.599.456.222.532.756 1.849.823 1.984.067.135.112.293.022.473-.09.18-.135.293-.27.45-.135.158-.284.351-.406.471-.135.135-.276.282-.119.551.157.27.7 1.152 1.503 1.868 1.033.921 1.905 1.206 2.176 1.341.271.135.429.112.587-.068.158-.18.675-.788.855-1.058.18-.27.36-.225.602-.135.241.09 1.534.723 1.797.855.263.132.438.198.502.308.064.11.064.64-.08 1.045z"/>
                </svg>
                Concierge
              </a>

              <button
                onClick={logout}
                className="px-4 py-2.5 border border-white/15 hover:border-red-400/50 bg-white/[0.02] hover:bg-red-950/20 text-white/70 hover:text-red-300 text-xs uppercase tracking-[0.2em] font-bold rounded-lg transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>

          {/* Patron Performance & Privilege Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#E5C158]/30 transition-all text-center">
              <span className="block font-serif text-2xl sm:text-3xl text-[#E5C158] font-light">{orders.length}</span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-medium">Acquisitions</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#E5C158]/30 transition-all text-center">
              <span className="block font-serif text-2xl sm:text-3xl text-[#E5C158] font-light">{wishlist.length}</span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-medium">Curated Wishlist</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#E5C158]/30 transition-all text-center">
              <span className="block font-serif text-2xl sm:text-3xl text-[#E5C158] font-light">{addresses.length}</span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-medium">Residences</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#E5C158]/30 transition-all text-center">
              <span className="block font-serif text-2xl sm:text-3xl text-[#E5C158] font-light">100%</span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-medium">Hallmark Guarantee</span>
            </div>
          </div>
        </div>

        {/* 2. Modern Segmented Tab Navigation Bar */}
        <div className="bg-[#120808]/90 border border-white/10 rounded-xl p-1.5 mb-8 backdrop-blur-md overflow-x-auto scrollbar-none shadow-lg">
          <div className="flex items-center min-w-max space-x-1">
            {[
              { id: 'profile', label: 'Profile Details', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              { id: 'orders', label: 'My Acquisitions', count: orders.length, icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
              { id: 'wishlist', label: 'Wishlist Jewels', count: wishlist.length, icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
              { id: 'addresses', label: 'Delivery Addresses', count: addresses.length, icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
              { id: 'security', label: 'Security & 2FA', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { id: 'concierge', label: 'VIP Privileges', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-[0.18em] transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#E5C158] to-[#C5A059] text-[#120808] shadow-[0_2px_12px_rgba(203,161,53,0.35)] font-extrabold'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                    activeTab === tab.id ? 'bg-[#120808] text-[#E5C158]' : 'bg-white/10 text-white/70'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Tab Contents */}

        {/* TAB 1: PROFILE & PERSONAL INFO */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-[#100707] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="border-b border-white/10 pb-5 mb-6">
                <h2 className="font-serif text-2xl text-white font-light">Personal Credentials</h2>
                <p className="text-xs text-white/50 tracking-wider mt-1">Keep your contact details up to date for official tax invoicing, doorstep delivery, and hallmarking certificates.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158] mb-2">
                    Patron Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Debabrata Roy"
                      className="w-full bg-[#080404] border border-white/15 focus:border-[#E5C158] rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:ring-1 focus:ring-[#E5C158]/50"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158] mb-2">
                    Registered Email (Hallmarking ID)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white/50 cursor-not-allowed outline-none"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Verified
                    </div>
                  </div>
                  <p className="text-[10px] text-white/40 tracking-wide mt-1.5">Your email is permanently tied to your BIS Hallmarked bullion receipts and cannot be changed directly.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158] mb-2">
                    Mobile Number (SMS & WhatsApp Delivery Notifications)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 94365 01506"
                      className="w-full bg-[#080404] border border-white/15 focus:border-[#E5C158] rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:ring-1 focus:ring-[#E5C158]/50"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {profileMsg && (
                  <div className={`p-4 rounded-xl border text-xs font-medium flex items-center justify-between ${
                    profileMsg.type === 'success'
                      ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                      : 'bg-red-950/40 border-red-700/50 text-red-300'
                  }`}>
                    <span>{profileMsg.text}</span>
                    <button type="button" onClick={() => setProfileMsg(null)} className="text-white/40 hover:text-white">✕</button>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#E5C158] to-[#C5A059] hover:from-[#F3E5AB] hover:to-[#E5C158] text-[#120808] text-xs font-bold uppercase tracking-[0.25em] rounded-xl transition-all shadow-[0_4px_20px_rgba(203,161,53,0.3)] disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {profileLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Saving Updates...
                      </>
                    ) : (
                      'Save Patron Details'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Privilege & Verification Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#100707] border border-[#E5C158]/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5C158]/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="font-serif text-xl text-[#E5C158] font-light mb-4">Aranyak Patron Privileges</h3>
                <ul className="space-y-4 text-xs text-white/70">
                  <li className="flex items-start gap-3">
                    <span className="text-[#E5C158] text-base leading-none">✦</span>
                    <div>
                      <strong className="text-white block font-medium">100% Guaranteed Purity (BIS 916)</strong>
                      Every creation is tested in authorized hallmarking centers with computerized purity reports.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#E5C158] text-base leading-none">✦</span>
                    <div>
                      <strong className="text-white block font-medium">Complimentary Ultrasonic Spa</strong>
                      Unlimited ultrasonic cleaning and prong re-setting at any of our 4 Tripura showrooms.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#E5C158] text-base leading-none">✦</span>
                    <div>
                      <strong className="text-white block font-medium">Lifetime Buyback & Transparent Exchange</strong>
                      100% exchange value for gold ornaments calculated strictly on prevailing gold rates.
                    </div>
                  </li>
                </ul>

                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-white/50">Need assistance?</span>
                  <Link href="/contact" className="text-[#E5C158] hover:underline font-bold uppercase tracking-wider">
                    Contact Us &rarr;
                  </Link>
                </div>
              </div>

              {/* Showroom Network Card */}
              <div className="bg-[#100707] border border-white/10 rounded-2xl p-6 sm:p-8">
                <h4 className="font-serif text-lg text-white font-light mb-2">Showrooms in Tripura</h4>
                <p className="text-xs text-white/50 mb-4">Visit our master artisans in person with your digital Patron card:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-white/80">📍 Agartala</div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-white/80">📍 Khowai</div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-white/80">📍 Dharmanagar</div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-white/80">📍 Kailashahar</div>
                </div>
                <Link
                  href="/stores"
                  className="mt-4 block text-center py-2.5 bg-white/[0.04] hover:bg-[#E5C158]/10 border border-white/15 hover:border-[#E5C158]/50 text-white hover:text-[#E5C158] text-[10px] uppercase font-bold tracking-[0.2em] rounded-lg transition-all"
                >
                  View Store Details & Timings
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY ORDERS & ACQUISITIONS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {ordersLoading ? (
              <div className="py-20 text-center bg-[#100707] border border-white/10 rounded-2xl">
                <div className="w-8 h-8 border-2 border-[#E5C158] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs uppercase tracking-[0.3em] text-[#E5C158]/80 font-medium">Fetching Patron Acquisition Records...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-20 text-center bg-[#100707] border border-white/10 rounded-2xl px-6 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#E5C158]/10 border border-[#E5C158]/30 flex items-center justify-center text-[#E5C158]">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-white font-light">No Acquisitions On Record</h3>
                <p className="text-xs text-white/50 max-w-md mx-auto tracking-wide leading-relaxed">
                  Every piece of Aranyak jewellery is an heirloom in the making. Explore our BIS 916 gold, certified solitaires, and royal silver collections.
                </p>
                <div className="pt-2">
                  <Link
                    href="/collections"
                    className="inline-block px-8 py-3.5 bg-gradient-to-r from-[#E5C158] to-[#C5A059] text-[#120808] text-xs font-bold uppercase tracking-[0.25em] rounded-xl hover:scale-105 transition-all shadow-[0_4px_20px_rgba(203,161,53,0.3)]"
                  >
                    Explore Royal Collections
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => {
                  const isDelivered = order.status === 'DELIVERED';
                  const isShipped = order.status === 'SHIPPED';
                  const isConfirmed = order.status === 'CONFIRMED' || order.status === 'PROCESSING';

                  return (
                    <div key={order.id} className="bg-[#100707] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 hover:border-[#E5C158]/30 transition-all">
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#E5C158] font-bold">Acquisition</span>
                            <h4 className="font-mono text-base text-white font-semibold">#{order.id.slice(-8).toUpperCase()}</h4>
                          </div>
                          <p className="text-xs text-white/40 tracking-wider">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/50'
                              : 'bg-amber-950/40 text-amber-300 border-amber-700/50'
                          }`}>
                            Payment: {order.paymentStatus || 'PENDING'}
                          </span>

                          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                            isDelivered
                              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/50'
                              : isShipped
                              ? 'bg-blue-950/40 text-blue-300 border-blue-700/50'
                              : 'bg-amber-950/40 text-amber-300 border-amber-700/50'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* 4-Step Visual Progress Stepper */}
                      <div className="py-2">
                        <div className="grid grid-cols-4 gap-2 text-center relative">
                          <div className="flex flex-col items-center">
                            <div className="w-7 h-7 rounded-full bg-[#E5C158] text-[#120808] flex items-center justify-center text-xs font-bold mb-1 shadow-md">✓</div>
                            <span className="text-[10px] uppercase tracking-wider text-white font-medium">Order Placed</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                              isConfirmed || isShipped || isDelivered ? 'bg-[#E5C158] text-[#120808]' : 'bg-white/10 text-white/40'
                            }`}>
                              {isConfirmed || isShipped || isDelivered ? '✓' : '2'}
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-white/80 font-medium">Quality & Hallmark</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                              isShipped || isDelivered ? 'bg-[#E5C158] text-[#120808]' : 'bg-white/10 text-white/40'
                            }`}>
                              {isShipped || isDelivered ? '✓' : '3'}
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-white/80 font-medium">Insured Transit</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                              isDelivered ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/40'
                            }`}>
                              {isDelivered ? '✓' : '4'}
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-white/80 font-medium">Delivered</span>
                          </div>
                        </div>
                      </div>

                      {/* Order Items List */}
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl divide-y divide-white/5">
                        {order.items?.map((item) => (
                          <div key={item.id} className="p-4 flex items-center justify-between text-sm">
                            <div className="space-y-0.5">
                              <p className="font-serif text-base text-white">{item.name}</p>
                              <p className="text-[11px] text-white/50 tracking-wider">Quantity: {item.quantity}</p>
                            </div>
                            <span className="font-serif text-lg text-[#E5C158] font-bold">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total & Action Footer */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 gap-4 border-t border-white/10 text-xs">
                        <div>
                          {order.shippingAddress && (
                            <p className="text-white/50 leading-relaxed">
                              Delivered to: <strong className="text-white">{order.shippingAddress.fullName || 'Patron'}</strong> ({order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.zip})
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-auto">
                          <div className="text-right">
                            <span className="text-white/40 text-[10px] uppercase tracking-widest block">Total Net Value</span>
                            <span className="font-serif text-2xl text-[#E5C158] font-bold">
                              ₹{order.totalAmount?.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <a
                            href={`https://wa.me/919436501506?text=${encodeURIComponent(
                              `Hello Aranyak Jewellers, I have an inquiry regarding my order #${order.id.slice(-8).toUpperCase()}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 bg-white/[0.04] hover:bg-[#E5C158]/10 border border-white/15 hover:border-[#E5C158]/50 text-white hover:text-[#E5C158] text-[10px] uppercase tracking-wider font-bold rounded-lg transition-all"
                          >
                            Track via WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CURATED WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="animate-in fade-in duration-300">
            {wishlistLoading ? (
              <div className="py-20 text-center bg-[#100707] border border-white/10 rounded-2xl">
                <div className="w-8 h-8 border-2 border-[#E5C158] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs uppercase tracking-[0.3em] text-[#E5C158]/80 font-medium">Opening Curated Vault...</p>
              </div>
            ) : wishlist.length === 0 ? (
              <div className="py-20 text-center bg-[#100707] border border-white/10 rounded-2xl px-6 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#E5C158]/10 border border-[#E5C158]/30 flex items-center justify-center text-[#E5C158]">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-white font-light">Your Curated Wishlist is Empty</h3>
                <p className="text-xs text-white/50 max-w-md mx-auto tracking-wide leading-relaxed">
                  Save your desired bridal necklaces, bangles, solitaires, and heirloom sets for future showroom consultations or purchases.
                </p>
                <div className="pt-2">
                  <Link
                    href="/collections"
                    className="inline-block px-8 py-3.5 bg-gradient-to-r from-[#E5C158] to-[#C5A059] text-[#120808] text-xs font-bold uppercase tracking-[0.25em] rounded-xl hover:scale-105 transition-all shadow-[0_4px_20px_rgba(203,161,53,0.3)]"
                  >
                    Browse Jewellery Vault
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => {
                  const product = item.product;
                  if (!product) return null;
                  const img = product.coverImage || product.images?.[0] || '/hero-necklace.png';

                  return (
                    <div key={item.id} className="bg-[#100707] border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-[#E5C158]/40 transition-all flex flex-col justify-between group">
                      <div className="relative aspect-square w-full bg-[#180C0C] overflow-hidden">
                        <Image
                          src={img}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-[#E5C158]/30">
                          <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#E5C158]">
                            {product.category} {product.goldPurity ? `• ${product.goldPurity}KT` : ''}
                          </span>
                        </div>

                        <button
                          onClick={() => handleRemoveWishlist(product.id)}
                          title="Remove from curated vault"
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 hover:bg-red-950 border border-white/20 text-white/70 hover:text-red-400 flex items-center justify-center transition-all backdrop-blur-md"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h4 className="font-serif text-xl text-white font-light group-hover:text-[#E5C158] transition-colors">
                            {product.name}
                          </h4>
                          {product.goldWeight && (
                            <p className="text-xs text-white/50 mt-1 font-mono">Net Gold Weight: ~{product.goldWeight}g</p>
                          )}
                          {product.diamondCarat && (
                            <p className="text-xs text-cyan-300 mt-0.5 font-mono">Diamond: {product.diamondCarat} ct</p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                          <a
                            href={`https://wa.me/919436501506?text=${encodeURIComponent(
                              `Hello Aranyak Jewellers, I am inquiring about availability & price for "${product.name}" (Ref: ${product.slug || product.id}).`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-600/50 text-emerald-300 text-center text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.074-2.228-.553-1.832-.751-3.003-2.613-3.094-2.734-.09-.12-1.077-1.433-1.077-2.732 0-1.299.68-1.939.921-2.203.241-.264.527-.33.704-.33.177 0 .354.002.508.01.163.008.383-.062.599.456.222.532.756 1.849.823 1.984.067.135.112.293.022.473-.09.18-.135.293-.27.45-.135.158-.284.351-.406.471-.135.135-.276.282-.119.551.157.27.7 1.152 1.503 1.868 1.033.921 1.905 1.206 2.176 1.341.271.135.429.112.587-.068.158-.18.675-.788.855-1.058.18-.27.36-.225.602-.135.241.09 1.534.723 1.797.855.263.132.438.198.502.308.064.11.064.64-.08 1.045z"/>
                            </svg>
                            Inquire WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DELIVERY ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-white font-light">Saved Residences & Delivery Points</h2>
                <p className="text-xs text-white/50 tracking-wider mt-1">Manage insured doorstep delivery addresses across Tripura and India.</p>
              </div>

              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#E5C158] to-[#C5A059] text-[#120808] text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showAddAddress ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                </svg>
                {showAddAddress ? 'Cancel' : 'Add New Residence'}
              </button>
            </div>

            {/* Add Address Form Drawer */}
            {showAddAddress && (
              <form onSubmit={handleAddAddress} className="bg-[#100707] p-6 sm:p-8 rounded-2xl border border-[#E5C158]/40 shadow-2xl space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="font-serif text-xl text-[#E5C158] font-light">Register New Delivery Address</h3>
                  <p className="text-xs text-white/50 tracking-wide mt-0.5">Please ensure all recipient contact details match official government ID for high-value insured courier verification.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158] mb-2">Recipient Full Name *</label>
                    <input
                      type="text"
                      value={newAddress.fullName}
                      onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      required
                      placeholder="e.g. Debabrata Roy"
                      className="w-full bg-[#080404] border border-white/15 focus:border-[#E5C158] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158] mb-2">Contact Mobile *</label>
                    <input
                      type="tel"
                      value={newAddress.phone}
                      onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                      required
                      placeholder="+91 94365 01506"
                      className="w-full bg-[#080404] border border-white/15 focus:border-[#E5C158] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158] mb-2">Street, Apartment, Locality *</label>
                  <input
                    type="text"
                    value={newAddress.street}
                    onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                    required
                    placeholder="House / Flat No., Road Name, Landmark"
                    className="w-full bg-[#080404] border border-white/15 focus:border-[#E5C158] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158] mb-2">City / District *</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                      placeholder="e.g. Agartala"
                      className="w-full bg-[#080404] border border-white/15 focus:border-[#E5C158] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158] mb-2">State *</label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                      required
                      placeholder="e.g. Tripura"
                      className="w-full bg-[#080404] border border-white/15 focus:border-[#E5C158] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158] mb-2">PIN Code *</label>
                    <input
                      type="text"
                      value={newAddress.zip}
                      onChange={e => setNewAddress({ ...newAddress, zip: e.target.value })}
                      required
                      placeholder="799001"
                      className="w-full bg-[#080404] border border-white/15 focus:border-[#E5C158] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="isDefaultAddress"
                    checked={newAddress.isDefault}
                    onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                    className="w-4 h-4 accent-[#E5C158] rounded"
                  />
                  <label htmlFor="isDefaultAddress" className="text-xs text-white/80 cursor-pointer">
                    Designate as primary residence for future purchases
                  </label>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={addressLoading}
                    className="px-8 py-3 bg-gradient-to-r from-[#E5C158] to-[#C5A059] text-[#120808] text-xs font-bold uppercase tracking-[0.25em] rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    {addressLoading ? 'Saving Address...' : 'Save Delivery Address'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="px-6 py-3 border border-white/15 text-white/70 hover:text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Address Cards Grid */}
            {addresses.length === 0 ? (
              <div className="py-16 text-center bg-[#100707] border border-white/10 rounded-2xl px-6 space-y-3">
                <p className="text-xs text-white/50 tracking-wider">No delivery residences registered yet. Add your address above for express checkout and insured delivery.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map(addr => (
                  <div key={addr.id} className="bg-[#100707] border border-white/10 rounded-2xl p-6 relative flex flex-col justify-between space-y-4 hover:border-[#E5C158]/30 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-serif text-lg text-white font-medium flex items-center gap-2">
                          <span>📍</span>
                          {addr.fullName}
                        </h4>
                        {addr.isDefault && (
                          <span className="text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 bg-[#E5C158]/15 border border-[#E5C158]/40 text-[#E5C158] rounded-full">
                            Primary Address
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">{addr.street}</p>
                      <p className="text-xs text-white/70">{addr.city}, {addr.state} — {addr.zip}</p>
                      <p className="text-xs text-white/40 mt-2 font-mono">Mobile: {addr.phone}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                      {!addr.isDefault ? (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[10px] uppercase tracking-widest text-[#E5C158] hover:text-white font-bold transition-colors"
                        >
                          Set as Primary
                        </button>
                      ) : <span />}

                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300 font-bold transition-colors"
                      >
                        Delete Address
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SECURITY & 2FA */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
            {/* Password Change Box */}
            <div className="bg-[#100707] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
              <div>
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h2 className="font-serif text-2xl text-white font-light">Password & Access Keys</h2>
                  <p className="text-xs text-white/50 tracking-wider mt-1">Change your account password regularly to protect your reservations and saved addresses.</p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158] mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full bg-[#080404] border border-white/15 focus:border-[#E5C158] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                      >
                        {showCurrentPass ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158] mb-2">New Password (Min. 6 Characters)</label>
                    <div className="relative">
                      <input
                        type={showNewPass ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="w-full bg-[#080404] border border-white/15 focus:border-[#E5C158] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                      >
                        {showNewPass ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158] mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full bg-[#080404] border border-white/15 focus:border-[#E5C158] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none"
                    />
                  </div>

                  {passwordMsg && (
                    <div className={`p-4 rounded-xl border text-xs font-medium flex items-center justify-between ${
                      passwordMsg.type === 'success'
                        ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                        : 'bg-red-950/40 border-red-700/50 text-red-300'
                    }`}>
                      <span>{passwordMsg.text}</span>
                      <button type="button" onClick={() => setPasswordMsg(null)} className="text-white/40 hover:text-white">✕</button>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="px-8 py-3 bg-gradient-to-r from-[#E5C158] to-[#C5A059] text-[#120808] text-xs font-bold uppercase tracking-[0.25em] rounded-xl transition-all shadow-md disabled:opacity-50"
                    >
                      {passwordLoading ? 'Updating Password...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-8 pt-5 border-t border-white/10 text-xs text-white/40">
                <span>Tip: Never share your credentials. Aranyak Jewellers will never ask for your password via phone or WhatsApp.</span>
              </div>
            </div>

            {/* Two-Factor Authentication (2FA) Box */}
            <div className="bg-[#100707] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
              <div>
                <div className="border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="font-serif text-2xl text-white font-light">Two-Factor Authentication</h2>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                      user?.totpEnabled
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-600/50'
                        : 'bg-white/5 text-white/40 border-white/10'
                    }`}>
                      {user?.totpEnabled ? 'Active Protection' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 tracking-wider">Secure your account with Google Authenticator or Microsoft Authenticator.</p>
                </div>

                {totpMsg && (
                  <div className={`p-4 rounded-xl border text-xs font-medium mb-6 flex items-center justify-between ${
                    totpMsg.type === 'success'
                      ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                      : 'bg-red-950/40 border-red-700/50 text-red-300'
                  }`}>
                    <span>{totpMsg.text}</span>
                    <button type="button" onClick={() => setTotpMsg(null)} className="text-white/40 hover:text-white">✕</button>
                  </div>
                )}

                {user?.totpEnabled ? (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-700/30 flex items-start gap-3">
                      <span className="text-emerald-400 text-lg">🛡️</span>
                      <div className="text-xs text-white/70">
                        <strong className="text-white block font-medium">Your Patron Account is Armored</strong>
                        Whenever you sign in, an authenticator code is required to ensure only you can access your order history and addresses.
                      </div>
                    </div>

                    <button
                      onClick={handleDisableTotp}
                      disabled={totpLoading}
                      className="px-6 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-700/50 text-red-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50"
                    >
                      {totpLoading ? 'Disabling 2FA...' : 'Disable Two-Factor Authentication'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {!totpData ? (
                      <div className="space-y-4">
                        <p className="text-xs text-white/70 leading-relaxed">
                          Enhance your security by requiring a 6-digit code from your mobile authenticator app whenever you log in.
                        </p>
                        <button
                          onClick={handleStartTotpSetup}
                          disabled={totpLoading}
                          className="px-6 py-3 bg-gradient-to-r from-[#E5C158] to-[#C5A059] text-[#120808] text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                        >
                          {totpLoading ? 'Generating QR Key...' : 'Setup Authenticator App'}
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleVerifyEnableTotp} className="space-y-5 animate-in fade-in duration-300">
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center gap-5">
                          {totpData.qrCode && (
                            <div className="p-2 bg-white rounded-xl shadow-lg flex-shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={totpData.qrCode} alt="TOTP QR Code" className="w-36 h-36" />
                            </div>
                          )}
                          <div className="text-xs space-y-2">
                            <p className="text-white/80 font-medium">1. Scan this QR code with Google Authenticator or Microsoft Authenticator.</p>
                            <p className="text-white/40">Or enter secret key manually:</p>
                            <code className="block p-2 rounded bg-black/60 font-mono text-[#E5C158] text-[11px] select-all border border-white/10 break-all">
                              {totpData.secret}
                            </code>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold tracking-[0.25em] uppercase text-[#E5C158] mb-2">
                            2. Enter 6-digit Authenticator Code to verify
                          </label>
                          <input
                            type="text"
                            maxLength={6}
                            value={totpVerifyCode}
                            onChange={(e) => setTotpVerifyCode(e.target.value)}
                            required
                            placeholder="000000"
                            className="w-full bg-[#080404] border border-white/15 focus:border-[#E5C158] rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-white outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="submit"
                            disabled={totpLoading}
                            className="px-6 py-3 bg-gradient-to-r from-[#E5C158] to-[#C5A059] text-[#120808] text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all shadow-md disabled:opacity-50"
                          >
                            {totpLoading ? 'Verifying...' : 'Verify & Enable 2FA'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setTotpData(null)}
                            className="px-4 py-3 border border-white/15 text-white/60 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 pt-5 border-t border-white/10 text-xs text-white/40">
                <span>Recommended for administrative and high-volume patrons.</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: BESPOKE CONCIERGE & PRIVILEGES */}
        {activeTab === 'concierge' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {/* Service 1 */}
            <div className="bg-[#100707] border border-white/10 rounded-2xl p-7 flex flex-col justify-between space-y-4 hover:border-[#E5C158]/40 transition-all shadow-xl group">
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#E5C158] font-bold">Complimentary Service</span>
                <h3 className="font-serif text-2xl text-white font-light mt-1.5 mb-3 group-hover:text-[#E5C158] transition-colors">
                  Ultrasonic Jewellery Spa
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Bring your gold and diamond ornaments to any Aranyak showroom for complimentary ultrasonic deep-cleaning, prong security inspection, and high-gloss restoration.
                </p>
              </div>
              <Link
                href="/stores"
                className="w-full py-3 bg-white/[0.04] hover:bg-[#E5C158]/10 border border-white/15 hover:border-[#E5C158]/50 text-white hover:text-[#E5C158] text-[10px] uppercase font-bold tracking-[0.25em] rounded-xl text-center block transition-all"
              >
                Locate Nearest Showroom
              </Link>
            </div>

            {/* Service 2 */}
            <div className="bg-[#100707] border border-white/10 rounded-2xl p-7 flex flex-col justify-between space-y-4 hover:border-[#E5C158]/40 transition-all shadow-xl group">
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#E5C158] font-bold">Exclusive Appointment</span>
                <h3 className="font-serif text-2xl text-white font-light mt-1.5 mb-3 group-hover:text-[#E5C158] transition-colors">
                  Bridal Trousseau Consultation
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  Book a private appointment with our senior jewellery curators to customize handcrafted Sitahars, Chokers, Polki, and Nakshi wedding sets tailored to your family legacy.
                </p>
              </div>
              <a
                href="https://wa.me/919436501506?text=Hello%20Aranyak%20Jewellers%2C%20I%20would%20like%20to%20reserve%20a%20private%20bridal%20appointment."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-gradient-to-r from-[#E5C158] to-[#C5A059] text-[#120808] text-[10px] uppercase font-bold tracking-[0.25em] rounded-xl text-center block transition-all shadow-md hover:scale-[1.02]"
              >
                Reserve Bridal Session
              </a>
            </div>

            {/* Service 3 */}
            <div className="bg-[#100707] border border-white/10 rounded-2xl p-7 flex flex-col justify-between space-y-4 hover:border-[#E5C158]/40 transition-all shadow-xl group">
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#E5C158] font-bold">Hallmark Guarantee</span>
                <h3 className="font-serif text-2xl text-white font-light mt-1.5 mb-3 group-hover:text-[#E5C158] transition-colors">
                  Live Gold Rate & Buyback
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  100% BIS Hallmarked gold with transparent buyback policies. Monitor official Tripura market gold rates updated daily directly from authorized bullion exchanges.
                </p>
              </div>
              <Link
                href="/gold-rate"
                className="w-full py-3 bg-white/[0.04] hover:bg-[#E5C158]/10 border border-white/15 hover:border-[#E5C158]/50 text-white hover:text-[#E5C158] text-[10px] uppercase font-bold tracking-[0.25em] rounded-xl text-center block transition-all"
              >
                View Live Gold Rates
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
