"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  mobile?: string;
  totpEnabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  updateUser: (updatedUser: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('aranyak_token');
    const savedUser = localStorage.getItem('aranyak_user');
    const expiresAt = localStorage.getItem('aranyak_token_expires_at');

    if (savedToken && savedUser) {
      if (expiresAt && Date.now() > Number(expiresAt)) {
        // Token expired after 15 days
        localStorage.removeItem('aranyak_token');
        localStorage.removeItem('aranyak_user');
        localStorage.removeItem('aranyak_token_expires_at');
      } else {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User, daysValid: number = 15) => {
    const expirationTime = Date.now() + daysValid * 24 * 60 * 60 * 1000; // 15 days in ms
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('aranyak_token', newToken);
    localStorage.setItem('aranyak_user', JSON.stringify(newUser));
    localStorage.setItem('aranyak_token_expires_at', String(expirationTime));
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...updatedFields };
    setUser(merged);
    localStorage.setItem('aranyak_user', JSON.stringify(merged));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('aranyak_token');
    localStorage.removeItem('aranyak_user');
    localStorage.removeItem('aranyak_token_expires_at');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, updateUser, logout, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
