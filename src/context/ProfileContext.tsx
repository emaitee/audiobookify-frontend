// contexts/ProfileContext.tsx
'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL, authApiHelper } from '@/app/utils/api';
import { useAuth } from './AuthContext';

type Profile = {
  name: string;
  email: string;
  profilePicture?: string;
  library: string[];
  favorites: string[];
  history: Array<{
    audiobook: string;
    progress: number;
    lastListened: Date;
  }>;
};

type ProfileContextType = {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: { name?: string; email?: string; profilePicture?: File }) => Promise<void>;
  addToLibrary: (audiobookId: string) => Promise<void>;
  removeFromLibrary: (audiobookId: string) => Promise<void>;
  addToFavorites: (audiobookId: string) => Promise<void>;
  removeFromFavorites: (audiobookId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProfile = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApiHelper.get('/auth/me');

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const updateProfile = async (data: { name?: string; email?: string; profilePicture?: File }) => {
    setLoading(true);
    setError(null);
    
    try {
        const token = localStorage.getItem('token')
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.email) formData.append('email', data.email);
      if (data.profilePicture) formData.append('profilePicture', data.profilePicture);

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
            'x-auth-token': token,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addToLibrary = async (audiobookId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/library/${audiobookId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to add to library');
      }

      await fetchProfile(); // Refresh profile data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to library');
      throw err;
    }
  };

  const removeFromLibrary = async (audiobookId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/library/${audiobookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove from library');
      }

      await fetchProfile(); // Refresh profile data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from library');
      throw err;
    }
  };

  const addToFavorites = async (audiobookId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites/${audiobookId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to add to favorites');
      }

      await fetchProfile(); // Refresh profile data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to favorites');
      throw err;
    }
  };

  const removeFromFavorites = async (audiobookId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/favorites/${audiobookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove from favorites');
      }

      await fetchProfile(); // Refresh profile data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from favorites');
      throw err;
    }
  };

  const value = {
    profile,
    loading,
    error,
    updateProfile,
    addToLibrary,
    removeFromLibrary,
    addToFavorites,
    removeFromFavorites,
    refreshProfile: fetchProfile
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}