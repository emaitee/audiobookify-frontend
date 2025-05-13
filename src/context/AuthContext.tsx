'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL, apiHelper, authApiHelper } from '@/app/utils/api';

type User = {
  _id: string;
  email: string;
  name: string;
  token: string;
  role: string;
  profilePicture?: string; // Added for OAuth profiles
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  appleLogin: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Verify token is valid by making a request to the server
          const response = await authApiHelper.get(`/auth/me`);
          
          if (response?.ok) {
            const userData = await response.json();
            const userState = {
              _id: userData._id,
              email: userData.email,
              name: userData.name,
              token: token,
              role: userData.role,
              profilePicture: userData.profilePicture
            };
            setUser(userState);
            localStorage.setItem('user', JSON.stringify(userState));
          } else {
            // Token is invalid, clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (err) {
        console.error('Failed to load user', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Handle callback from OAuth providers
useEffect(() => {
    const handleOAuthCallback = async () => {
      // Only run this in the browser
      if (typeof window === 'undefined') return;

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const oauthError = urlParams.get('error');

      if (oauthError) {
        setError(decodeURIComponent(oauthError));
        return;
      }

      if (token) {
        try {
          localStorage.setItem('token', token);
          
          // Use token to fetch user data
          const response = await authApiHelper.get(`/auth/me`);

          if (response?.ok) {
            const userData = await response.json();
            const userState = {
              _id: userData._id,
              email: userData.email,
              name: userData.name,
              token: token,
              role: userData.role,
              profilePicture: userData.profilePicture
            };

            localStorage.setItem('user', JSON.stringify(userState));
            setUser(userState);

            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            router.push('/');
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (err) {
          console.error('OAuth callback error', err);
          setError('Failed to authenticate with provider');
          localStorage.removeItem('token');
        }
      }
    };

    handleOAuthCallback();
  }, [router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiHelper.post(`/auth/login`, { email, password })

      if (!response?.ok) {
        const errorData = await response?.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      const userData = { 
        _id: data.user._id, 
        email: data.user.email, 
        name: data.user.name, 
        token: data.token, 
        role: data.user.role,
        profilePicture: data.user.profilePicture
      };
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiHelper.post(`/auth/register`, { name, email, password })

      if (!response?.ok) {
        const errorData = await response?.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Automatically log in after registration
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Redirect to Google OAuth flow
      window.location.href = `${API_BASE_URL}/auth/google`;
    } catch (err: any) {
      setError('Failed to initiate Google login');
      setIsLoading(false);
    }
  };

  const appleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Redirect to Apple OAuth flow
      window.location.href = `${API_BASE_URL}/auth/apple`;
    } catch (err: any) {
      setError('Failed to initiate Apple login');
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const value = {
    user,
    login,
    register,
    googleLogin,
    appleLogin,
    logout,
    isAuthenticated: !!user,
    isLoading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}