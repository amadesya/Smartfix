import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface User {
  id: string;
  email: string;
}

interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'master' | 'admin';
  phone?: string;
  blocked?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/profile`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const checkSession = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/session`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.session?.user) {
          setUser({ id: data.session.user.id, email: data.session.user.email || '' });
          setAccessToken(data.session.access_token);
          await fetchProfile(data.session.access_token);
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    
    if (data.session) {
      setUser({ id: data.session.user.id, email: data.session.user.email || '' });
      setAccessToken(data.session.access_token);
      await fetchProfile(data.session.access_token);

      // Check if user is blocked
      if (data.profile?.blocked) {
        await logout();
        throw new Error('Ваш аккаунт заблокирован');
      }
    }
  };

  const signup = async (email: string, password: string, name: string, role: string) => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name, role }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    // Auto login after signup
    await login(email, password);
  };

  const logout = async () => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d499b637/logout`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    setUser(null);
    setProfile(null);
    setAccessToken(null);
  };

  const refreshProfile = async () => {
    if (accessToken) {
      await fetchProfile(accessToken);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#00ff00] flex items-center justify-center font-mono">
        <div className="animate-pulse text-xl">LOADING<span className="animate-ping">...</span></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, accessToken, login, signup, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
