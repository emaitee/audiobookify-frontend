'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { usePlayer } from '@/context/PlayerContext';
import { authApiHelper } from '../utils/api';
// import idb from '@/lib/idb';

import { getPlayableContent } from '../utils/book-utils';

// Components
import FeaturedBooks from '@/components/book/FeaturedBooks';
import NewReleaseSection from '@/components/book/NewReleaseSection';
import CuratedCollections from '@/components/book/CuratedCollections';
import ContinueListening from '@/components/book/ContinueListening';
import AuthorSpotlight from '@/components/book/AuthorSpotlight';
import NarratorSpotlight from '@/components/book/NarratorSpotlight';
import TrendingNow from '@/components/book/TrendingNow';
import RecommendedForYou from '@/components/book/RecommendedForYou';
import CategoryGrid from '@/components/book/CategoryGrid';
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus';
import OfflineBanner from '@/components/shared/OfflineBanner';

export interface Author {
  _id?: string;
  name: string;
  slug: string;
  bio?: string;
  profileImage?: string;
  books?: Book[];
  totalBooks?: number;
}

export interface Narrator {
  _id?: string;
  name: string;
  slug: string;
  bio?: string;
  profileImage?: string;
  voiceStyles?: string[];
  books?: Book[];
  totalBooks?: number;
}

interface Rating {
  user: string;
  rating: number;
  review: string;
  date: string;
}

export interface Episode {
  _id: string;
  title: string;
  episodeNumber: number;
  audioFile: string;
  duration: number;
  listenCount: number;
  averageRating: number;
  position?: number;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
}

export interface BookmarkType {
  id: string;
  position: number;
  note?: string;
  createdAt: string;
  chapter?: string;
}

export interface Book {
  _id: string;
  title: string;
  slug: string;
  author: Author;
  narrator: Narrator;
  coverImage: string;
  isSeries: boolean;
  episodes?: Episode[];
  totalEpisodes?: number;
  progress?: number;
  currentEpisode?: number;
  remainingTime?: string;
  category?: string;
  isFeatured?: boolean;
  episodeId?: string;
  audioFile?: string;
  episodeNumber?: number;
  similarBooks?: {
    _id: string;
    title: string;
    author: string;
    coverImage: string;
  }[];
  isFavorite?: boolean;
  inLibrary?: boolean;
  publisher?: string;
  releaseDate?: string;
  description?: string;
  averageRating: number;
  duration: number;
  narrationLanguage: string;
  ratings: Rating[];
  status: string;
  createdAt?: string;
  reviews?: Review[];
  listenCount?: number;
  tags?: string[];
  bookmarks: BookmarkType[];
  updatedAt: string;
  ratingsCount?: number;
}

export default function AudiobookExplorePage() {
  const { user } = useAuth();
  const t = useTranslations("HomePage");
  const { theme } = useTheme();
  const { play } = usePlayer();
  const isOffline = useOnlineStatus();
  
  // State
  const [newReleases, setNewReleases] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [continueListening, setContinueListening] = useState<Book[]>([]);
  const [loading, setLoading] = useState({
    newReleases: true,
    featured: true,
    continue: true
  });
  const [error, setError] = useState<{
    newReleases: string | null;
    featured: string | null;
    continue: string | null;
  }>({
    newReleases: null,
    featured: null,
    continue: null
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(prev => ({...prev, newReleases: true, featured: true, continue: true}));
      
      // First try to load from cache
      // const cachedData = await idb.getExplorePageData();
      // if (cachedData && isOffline) {
      //   setNewReleases(cachedData.newReleases || []);
      //   setFeaturedBooks(cachedData.featuredBooks || []);
      //   setContinueListening(cachedData.continueListening || []);
      //   return;
      // }
  
      // Try to fetch fresh data if online
      // if (!isOffline) {
        const [newReleasesRes, featuredRes, continueRes] = await Promise.all([
          authApiHelper.get('/books-info/new-releases'),
          authApiHelper.get('/books-info/featured'),
          user ? authApiHelper.get('/books-info/continue-listening') : Promise.resolve(null)
        ]);
  
        const newReleasesData = newReleasesRes?.ok ? await newReleasesRes.json() : [];
        const featuredData = featuredRes?.ok ? await featuredRes.json() : [];
        const continueData = continueRes?.ok ? await continueRes.json() : [];
  
        // Update state
        setNewReleases(newReleasesData?.books || []);
        setFeaturedBooks(featuredData?.books || []);
        setContinueListening(continueData?.books || []);
  
        // Cache the data
        // await idb.cacheExplorePageData({
        //   newReleases: newReleasesData?.books || [],
        //   featuredBooks: featuredData?.books || [],
        //   continueListening: continueData?.books || []
        // });
      // }
    } catch (err) {
      console.error('Fetch error:', err);
      // Try to load from cache even if error occurred
      // const cachedData = await idb.getExplorePageData();
      // if (cachedData) {
      //   setNewReleases(cachedData.newReleases || []);
      //   setFeaturedBooks(cachedData.featuredBooks || []);
      //   setContinueListening(cachedData.continueListening || []);
      // } else {
      //   setError({
      //     newReleases: isOffline ? t('errors.offlineNoData') : t('errors.failedToLoadNewReleases'),
      //     featured: isOffline ? t('errors.offlineNoData') : t('errors.failedToLoadFeatured'),
      //     continue: isOffline ? t('errors.offlineNoData') : t('errors.failedToLoadContinue')
      //   });
      // }
    } finally {
      setLoading({
        newReleases: false,
        featured: false,
        continue: false
      });
    }
  }, [t, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePlay = (book: Book) => {
    const playableContent = getPlayableContent(book);
    play(playableContent, book.episodes?.[0]);
  };

  const categories = [
    t('categories.fiction'), 
    t('categories.mystery'), 
    t('categories.romance'), 
    t('categories.history'), 
    t('categories.business'), 
    t('categories.fantasy'), 
    t('categories.horror'), 
    t('categories.comedy')
  ];

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} pb-20`}>
      {/* Offline Banner */}
      {/* <OfflineBanner isOffline={isOffline} /> */}
      
      {/* Featured Books */}
      <FeaturedBooks
        featuredBooks={featuredBooks.map(book => ({
          ...book,
          bookmarks: (book.bookmarks || []).map(b => ({
            timestamp: b.position ?? 0,
            chapter: b.chapter ?? '',
            note: b.note ?? ''
          })) as {
            timestamp: number;
            chapter: string;
            note: string;
          }[]
        }))}
        handlePlay={handlePlay}
      />

      {/* New Releases */}
      <NewReleaseSection 
        loading={loading} 
        error={error} 
        newReleases={newReleases}
        handlePlay={handlePlay as (book: any) => void} 
        isOffline={isOffline} 
      />
      
      {/* Curated Collections */}
      <CuratedCollections />
      
      {/* Personalized and Discovery Sections */}
      <RecommendedForYou />
      <TrendingNow />
      <AuthorSpotlight />
      <NarratorSpotlight />
      
      {/* Continue Listening (only for logged in users) */}
      {user && (
        <ContinueListening 
          handlePlay={handlePlay} 
          error={error} 
          loading={loading} 
          continueListening={continueListening} 
        />
      )}
      
      {/* Categories Grid */}
      <CategoryGrid categories={categories} />
    </div>
  );
}