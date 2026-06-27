"use client";

import { AuthProvider } from '@/context/AuthContext';
import AdminSidebar from './components/AdminSidebar';
import AdminTopBar from './components/AdminTopBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#050202] text-white font-sans selection:bg-secondary selection:text-white">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopBar />
          <div className="flex-1 overflow-x-hidden">
            {children}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
