import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string, name: string, role: 'student' | 'admin' | 'maintenance_staff') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('navikfupm_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Mock authentication - check against mockUsers
    const foundUser = mockUsers.find((u) => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('navikfupm_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('navikfupm_user');
  };

  const register = (email: string, password: string, name: string, role: 'student' | 'admin' | 'maintenance_staff'): boolean => {
    // Mock registration
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role,
      studentId: role === 'student' ? `${Date.now()}`.slice(-9) : undefined,
    };
    
    setUser(newUser);
    localStorage.setItem('navikfupm_user', JSON.stringify(newUser));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
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
