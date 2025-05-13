'use client'
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Search, BookOpen, ChevronRight, Clock, Play, Headphones, Bookmark, Music, Star, User, Home, Library, Compass, AlertCircle, ChevronLeft, Share2 } from 'lucide-react';
import { authApiHelper } from '../utils/api';
import { formatTime } from '../utils/helpers';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import './index.css'
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Review } from '@/components/BookReview';
import { Bookmark as BookmarkType } from './playing/page';
import idb from '@/lib/idb';
import NewReleaseSection from '@/components/book/NewReleaseSection';
import CuratedCollections from '@/components/book/CuratedCollections';
import FeaturedBooks from '@/components/book/FeaturedBooks';
import AuthorSpotlight from '@/components/book/AuthorSpotlight';
import NarratorSpotlight from '@/components/book/NarratorSpotlight';
import TrendingNow from '@/components/book/TrendingNow';
import RecommendedForYou from '@/components/book/RecommendedForYou';
import ContinueListening from '@/components/book/ContinueListening';

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
  bookmarks: BookmarkType[],
  updatedAt: string;
  ratingsCount?: number;
}

export default function AlternativeAudiobookExplorePage() {
  const {user} = useAuth()
  const t = useTranslations("HomePage");
  const { theme } = useTheme();
  const { play, currentBook } = usePlayer();
  const [activeTab, setActiveTab] = useState('discover');
  const [newReleases, setNewReleases] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [isOffline, setIsOffline] = useState(false);
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

  // Update your useEffect for network status
  useEffect(() => {
    const handleStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };
    
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    handleStatusChange(); // Set initial state
    
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(prev => ({...prev, newReleases: true, featured: true, continue: true}));
      
      // First try to load from cache
      const cachedData = await idb.getExplorePageData();
      if (cachedData && isOffline) {
        setNewReleases(cachedData.newReleases || []);
        setFeaturedBooks(cachedData.featuredBooks || []);
        setContinueListening(cachedData.continueListening || []);
        // setContinueListening(cachedData.continueListening?.map((book: Book) => ({
        //   ...book,
        //   progress: calculateProgress(book)
        // })) || []);
        return;
      }
  
      // Try to fetch fresh data if online
      if (!isOffline) {
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
        setContinueListening(continueData?.books?.map((book: Book) => ({
          ...book,
          progress: calculateProgress(book)
        })) || []);
  
        // Cache the data
        await idb.cacheExplorePageData({
          newReleases: newReleasesData?.books || [],
          featuredBooks: featuredData?.books || [],
          continueListening: continueData?.books || []
        });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      // Try to load from cache even if error occurred
      const cachedData = await idb.getExplorePageData();
      if (cachedData) {
        setNewReleases(cachedData.newReleases || []);
        setFeaturedBooks(cachedData.featuredBooks || []);
        setContinueListening(cachedData.continueListening || []);
      } else {
        setError({
          newReleases: isOffline ? t('errors.offlineNoData') : t('errors.failedToLoadNewReleases'),
          featured: isOffline ? t('errors.offlineNoData') : t('errors.failedToLoadFeatured'),
          continue: isOffline ? t('errors.offlineNoData') : t('errors.failedToLoadContinue')
        });
      }
    } finally {
      setLoading({
        newReleases: false,
        featured: false,
        continue: false
      });
    }
  }, [t, user, isOffline]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateProgress = (book: Book): number => {
    return Math.floor(Math.random() * 100);
  };

  const handlePlay = (book: Book) => {
    // console.log(book)
    if (book.isSeries && book.episodes?.[0]) {
      play({
        ...book,
        audioFile: book.episodes[0].audioFile,
        duration: book.episodes[0].duration,
        episodeNumber: book.episodes[0].episodeNumber
      }, book.episodes[0]);
    } else {
      play({
        ...book,
        audioFile: book.audioFile || '',
        duration: book.duration || 0
      });
    }
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
      {/* Hero Section */}
      {isOffline && (
  <div className={`p-2 text-center text-sm ${theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}>
    {t('offline.message')} - {t('offline.showingCachedData')}
  </div>
)}
    <FeaturedBooks featuredBooks={featuredBooks} handlePlay={handlePlay} />

    {/* New Releases - Fixed Horizontal Scrolling */}
    <NewReleaseSection 
      loading={loading} 
      error={error} 
      newReleases={newReleases} 
      handlePlay={handlePlay} 
      isOffline={isOffline} 
    />
      
    {/* Collections */}
    <CuratedCollections />

      <RecommendedForYou />
      <AuthorSpotlight />
      <NarratorSpotlight />
      <TrendingNow />
      
      {/* Continue Listening */}
      {!user ? null : <ContinueListening handlePlay={handlePlay} error={error} loading={loading} continueListening={continueListening} /> }
      
      {/* Categories Shelf */}
      <section className="pd:px-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{t('sections.browseCategories')}</h2>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {categories.map((genre) => (
            <Link 
              href={'/view-list?category='+genre}
              key={genre} 
              className={`rounded-lg p-3 flex flex-col items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'}`}
            >
              <div className={`h-8 w-8 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center mb-2`}>
                <Music size={14} className="text-purple-400" />
              </div>
              <span className="text-xs text-center">{genre}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}