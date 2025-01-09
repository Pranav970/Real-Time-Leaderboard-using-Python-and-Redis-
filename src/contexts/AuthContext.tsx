import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';
import * as api from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and set user
      setUser({ id: 'temp', email: 'temp' }); // Replace with actual user data
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const { access_token } = await api.login({ email, password });
    localStorage.setItem('token', access_token);
    setUser({ id: 'temp', email }); // Replace with actual user data
  };

  const signUp = async (email: string, password: string, username: string) => {
    await api.register({ email, password, username });
    await signIn(email, password);
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}