'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import api from '@/lib/api';
import { IUser } from '@/types/auth';
import { LoginInput, RegisterInput } from '@/utils/validators';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (data: LoginInput) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterInput) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.data?.user) {
        setUser(res.data.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (data: LoginInput) => {
    try {
      const res = await api.post('/auth/login', data);
      if (res.data.success && res.data.data?.user) {
        setUser(res.data.data.user);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid credentials';
      return { success: false, message };
    }
  };

  const register = async (data: RegisterInput) => {
    try {
      const res = await api.post('/auth/register', data);
      if (res.data.success && res.data.data?.user) {
        setUser(res.data.data.user);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore
    } finally {
      setUser(null);
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refetchUser: fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
