import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { apiLogin } from '../api';

interface AuthContextType {
  user: UserProfile;
  login: (email: string, displayName?: string) => Promise<void>;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (open: boolean) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_demo_883',
  email: 'roshanikhade2609@gmail.com',
  displayName: 'Roshani Khade',
  createdAt: '2026-10-06T12:00:00.000Z'
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USER,
  login: async () => {},
  logout: () => {},
  showAuthModal: false,
  setShowAuthModal: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('crediscope_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('crediscope_user', JSON.stringify(user));
  }, [user]);

  const login = async (email: string, displayName?: string) => {
    try {
      const res = await apiLogin(email, displayName);
      setUser(res.user);
      setShowAuthModal(false);
    } catch (e) {
      console.error('Login error:', e);
    }
  };

  const logout = () => {
    setUser(DEFAULT_USER);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, showAuthModal, setShowAuthModal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
