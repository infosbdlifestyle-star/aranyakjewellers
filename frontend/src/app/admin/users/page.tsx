"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  
  // Form State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', email: '', role: 'ADMIN', mobile: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers(token!);
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.updateUser(token!, formData.id, formData);
      } else {
        await api.createUser(token!, formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert('Failed to save user');
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (email === 'admin@aranyak.com') {
      alert('Cannot delete the master admin account.');
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(token!, id);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ id: '', name: '', email: '', role: 'ADMIN', mobile: '' });
    setShowModal(true);
  };

  const openEditModal = (u: any) => {
    setIsEditing(true);
    setFormData({ id: u.id, name: u.name, email: u.email, role: u.role, mobile: u.mobile || '' });
    setShowModal(true);
  };

  if (user?.role !== 'SUPER_ADMIN' && user?.role !== 'ADMIN') {
    return <div className="p-8 text-red-500">Access Denied</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0A0505] p-6 rounded-2xl border border-white/5">
        <div>
          <h1 className="text-2xl font-serif text-white">Manage Users</h1>
          <p className="text-xs text-white/50 mt-1">Manage admin and staff accounts</p>
        </div>
        <button onClick={openAddModal} className="btn-luxury px-6 py-2 text-xs uppercase tracking-wider font-bold">
          + Add User
        </button>
      </div>

      <div className="bg-[#0A0505] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/50">Loading users...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/50">Name</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/50">Email</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/50">Role</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/50">2FA</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/50 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm text-white">{u.name}</td>
                  <td className="p-4 text-sm text-white/70">{u.email}</td>
                  <td className="p-4 text-sm text-white/70">
                    <span className="px-2 py-1 bg-white/10 rounded text-xs">{u.role}</span>
                  </td>
                  <td className="p-4 text-sm text-white/70">
                    {u.totpEnabled ? <span className="text-green-400">Enabled</span> : <span className="text-red-400">Disabled</span>}
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <button onClick={() => openEditModal(u)} className="text-secondary hover:text-white transition-colors text-sm">Edit</button>
                    {u.email !== 'admin@aranyak.com' && (
                      <button onClick={() => handleDelete(u.id, u.email)} className="text-red-400 hover:text-red-300 transition-colors text-sm">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0505] w-full max-w-md rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-serif text-white mb-6">{isEditing ? 'Edit User' : 'Add New User'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/50 font-bold block mb-2">Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-[#050202] border border-white/10 rounded-lg p-3 text-white focus:border-secondary outline-none" />
              </div>
              
              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/50 font-bold block mb-2">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="w-full bg-[#050202] border border-white/10 rounded-lg p-3 text-white focus:border-secondary outline-none" />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/50 font-bold block mb-2">Mobile (Optional)</label>
                <input type="text" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full bg-[#050202] border border-white/10 rounded-lg p-3 text-white focus:border-secondary outline-none" />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-white/50 font-bold block mb-2">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#050202] border border-white/10 rounded-lg p-3 text-white focus:border-secondary outline-none">
                  <option value="ADMIN">ADMIN</option>
                  <option value="STAFF">STAFF</option>
                  <option value="USER">USER</option>
                </select>
              </div>

              {!isEditing && (
                <p className="text-xs text-secondary mt-2">A welcome email with a temporary password will be sent to the user.</p>
              )}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-xs font-bold uppercase tracking-wider">Cancel</button>
                <button type="submit" className="flex-1 btn-luxury py-3 text-xs font-bold uppercase tracking-wider rounded-lg">{isEditing ? 'Save Changes' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
