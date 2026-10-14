import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { generateNickname, generateRandomAvatar } from '../utils/avatar';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  crisisMessage: string | null;
  setCrisisMessage: (msg: string | null) => void;
  loginGuest: () => Promise<void>;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, pass: string, nickname: string, avatarConfig: any) => Promise<{ success: boolean; error?: string }>;
  upgradeGuest: (email: string, pass: string, nickname?: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (nickname: string, avatarConfig?: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('open_circle_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [crisisMessage, setCrisisMessage] = useState<string | null>(null);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('open_circle_token');
        setToken(null);
        await loginGuest();
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loginGuest = async () => {
    setIsLoading(true);
    try {
      const storedGuestId = localStorage.getItem('open_circle_guest_id');
      const nickname = generateNickname();
      const avatarConfig = generateRandomAvatar();

      const res = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId: storedGuestId, nickname, avatarConfig })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('open_circle_token', data.token);
        localStorage.setItem('open_circle_guest_id', data.user.id);
      }
    } catch (err) {
      console.error('Guest login failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      loginGuest();
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('open_circle_token', data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error during login' };
    }
  };

  const register = async (email: string, pass: string, nickname: string, avatarConfig: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, nickname, avatarConfig })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('open_circle_token', data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error during registration' };
    }
  };

  const upgradeGuest = async (email: string, pass: string, nickname?: string) => {
    if (!user || !user.isGuest) {
      return { success: false, error: 'No active guest session' };
    }

    try {
      const res = await fetch('/api/auth/upgrade-guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId: user.id, email, password: pass, nickname })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Upgrade failed' };
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('open_circle_token', data.token);
      localStorage.removeItem('open_circle_guest_id');
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error during upgrade' };
    }
  };

  const updateProfile = async (nickname: string, avatarConfig?: any) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nickname, avatarConfig })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to update profile' };
      }

      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error during profile update' };
    }
  };

  const logout = () => {
    localStorage.removeItem('open_circle_token');
    setUser(null);
    setToken(null);
    loginGuest();
  };

  const refreshUser = async () => {
    if (token) await fetchCurrentUser(token);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      crisisMessage,
      setCrisisMessage,
      loginGuest,
      login,
      register,
      upgradeGuest,
      updateProfile,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
