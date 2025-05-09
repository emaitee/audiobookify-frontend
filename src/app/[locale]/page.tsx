'use client'
import React, { useState, useEffect, useContext } from 'react';
import { Search, BookOpen, ChevronRight, Clock, Play, Headphones, Bookmark, Music, Star, User, Home, Library, Compass } from 'lucide-react';
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

export interface Author {
  _id?: string;
  name: string;
  slug: string;
  bio?: string;
}
export interface Narrator {
  _id?: string;
  name: string;
  slug: string;
  bio?: string;
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
  status?: string;
  createdAt?: string;
  reviews?: Review[];
  listenCount?: number;
  tags?: string[];
  bookmarks: BookmarkType[]
}

export default function AlternativeAudiobookExplorePage() {
  const t = useTranslations("HomePage");
  const { theme } = useTheme();
  const { play, currentBook } = usePlayer();
  const [activeTab, setActiveTab] = useState('discover');
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch new releases
        const newReleasesResponse = await authApiHelper.get('/books-info/new-releases');
        if (newReleasesResponse?.ok) {
          let resp = await newReleasesResponse?.json()
          setNewReleases(resp?.books);
        }

        // Fetch featured books
        const featuredResponse = await authApiHelper.get('/books-info/featured');
        if (featuredResponse?.ok) {
          let resp = await featuredResponse?.json()
          setFeaturedBooks(resp.books);
        }

        // Fetch continue listening
        const continueResponse = await authApiHelper.get('/books-info/continue-listening');
        if (continueResponse?.ok) {
          let resp = await continueResponse?.json()
          setContinueListening(resp?.books.map((book: Book) => ({
            ...book,
            progress: calculateProgress(book)
          })))
        }
      } catch (err) {
        console.log(err)
        setError({
          newReleases: t('errors.failedToLoadNewReleases'),
          featured: t('errors.failedToLoadFeatured'),
          continue: t('errors.failedToLoadContinue')
        });
      } finally {
        setLoading({
          newReleases: false,
          featured: false,
          continue: false
        });
      }
    };

    fetchData();
  }, [t]);

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

  const {user} = useAuth()

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} pb-20`}>
      {/* Hero Section */}
      <section className="md:px-4 pb-6">
        {featuredBooks?.length > 0 && (
          <div className="relative rounded-xl overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-r ${theme === 'dark' ? 'from-purple-900 to-blue-900' : 'from-purple-600 to-blue-600'} opacity-70`}></div>
            <img 
              src={featuredBooks[0].coverImage} 
              alt={featuredBooks[0].title} 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <span className={`text-xs font-semibold px-2 py-1 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-600'} rounded-full w-fit mb-2`}>
                {t('featured.label')}
              </span>
              <h2 className="text-xl font-bold mb-1">{featuredBooks[0].title}</h2>
              <p className="text-sm opacity-90 mb-3">By {featuredBooks[0].author.name}</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handlePlay(featuredBooks[0])}
                  className={`px-4 py-2 ${theme === 'dark' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'} rounded-full text-sm font-medium flex items-center`}
                >
                  <Play size={16} className="mr-1" /> {t('featured.listenNow')}
                </button>
                <button className={`p-2 ${theme === 'dark' ? 'bg-gray-800 bg-opacity-60' : 'bg-white bg-opacity-80'} rounded-full`}>
                  <Bookmark size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* New Releases - Fixed Horizontal Scrolling */}
      <section className="px-2 md:px-4 pb-6">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-base md:text-lg font-bold">{t('sections.newReleases')}</h2>
          <Link href={"/view-list?type=new-releases"} className={`text-xs md:text-sm flex items-center ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
            {t('common.viewAll')} <ChevronRight size={14} className="ml-0.5" />
          </Link>
        </div>
        
        {loading.newReleases ? (
          <div className="flex space-x-3 md:space-x-4 overflow-x-auto pb-2 scroll-container">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-28 md:w-32 flex-shrink-0">
                <div className={`relative rounded-lg overflow-hidden aspect-[2/3] mb-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
                <div className={`h-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-1.5 animate-pulse`}></div>
                <div className={`h-3 w-3/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
              </div>
            ))}
          </div>
        ) : error.newReleases ? (
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-red-400' : 'bg-red-50 text-red-600'} text-xs md:text-sm`}>
            {error.newReleases}
          </div>
        ) : (
          <div className="relative">
            <div className="flex space-x-3 md:space-x-4 pb-2 overflow-x-auto scroll-container snap-x snap-mandatory">
              {newReleases.map((book) => (
                <div key={book?._id} className="w-28 md:w-32 flex-shrink-0 snap-start" onClick={() => handlePlay(book)}>
                  <div className="relative rounded-lg overflow-hidden aspect-[2/3] mb-2 shadow-lg group">
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" 
                      loading="lazy"
                    />
                    <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${theme === 'dark' ? 'from-black' : 'from-gray-900'} to-transparent py-1.5 md:py-2 px-2`}>
                      <div className="flex items-center text-[10px] md:text-xs">
                        <Clock size={10} className="mr-1" />
                        <span>{formatTime(book.duration)}</span>
                      </div>
                    </div>
                    <button 
                      
                      className={`absolute top-1.5 md:top-2 right-1.5 md:right-2 h-7 md:h-8 w-7 md:w-8 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-600'} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-90 transition-opacity duration-200`}
                      aria-label={`Play ${book.title}`}
                    >
                      <Play size={12} className="md:size-[14px]" />
                    </button>
                  </div>
                  <h3 className="font-medium text-xs md:text-sm line-clamp-1">{book.title}</h3>
                  <p className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} line-clamp-1`}>{book.author.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      
      {/* Collections */}
      <section className="md:px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{t('sections.curatedCollections')}</h2>
          <Link href={"/view-list?currated"} className={`text-sm flex items-center ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
            {t('common.explore')} <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { key:'best-of-the-year', title: t('collections.bestOfTheYear'), description: t('collections.bestOfTheYearDesc'), color: 'bg-emerald-500' },
            { key: 'staff-picks', title: t('collections.staffPicks'), description: t('collections.staffPicksDesc'), color: 'bg-purple-500' },
            { key: 'award-winners', title: t('collections.awardWinners'), description: t('collections.awardWinnersDesc'), color: 'bg-amber-500' },
            { key:'hidden-gems', title: t('collections.hiddenGems'), description: t('collections.hiddenGemsDesc'), color: 'bg-pink-500' },
          ].map((list) => (
            <div key={list.title} className="relative overflow-hidden rounded-lg shadow-lg">
              <div className={`absolute inset-0 ${list.color} opacity-90`}></div>
              <div className="relative p-4">
                <h3 className="font-bold mb-1">{list.title}</h3>
                <p className="text-xs opacity-90 mb-3">{list.description}</p>
                <Link href={"/view-list?type="+list.key} className={`text-xs font-medium ${theme === 'dark' ? 'bg-black bg-opacity-30' : 'bg-white bg-opacity-30'} px-3 py-1 rounded-full`}>
                  {t('common.viewList')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Continue Listening */}
      {!user ? null : <section className="md:px-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{t('sections.continueListening')}</h2>
          <Link href={"/history"} className={`text-sm flex items-center ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
            {t('common.history')} <ChevronRight size={16} />
          </Link>
        </div>
        
        { loading.continue ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className={`flex items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-3 shadow-lg animate-pulse`}>
                <div className={`w-12 h-16 rounded overflow-hidden mr-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <div className="flex-1">
                  <div className={`h-4 w-3/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-2`}></div>
                  <div className={`h-3 w-1/2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-3`}></div>
                  <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded-full h-1.5 mb-1`}></div>
                  <div className={`h-3 w-1/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : error.continue ? (
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-red-400' : 'bg-red-50 text-red-600'} text-sm`}>
            {error.continue}
          </div>
        ) : continueListening.length > 0 ? (
          <div className="space-y-3">
            {continueListening.map((book) => (
              <div key={book._id} className={`flex items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-lg p-3 shadow-lg`}>
                <div className="w-12 h-16 rounded overflow-hidden mr-3 flex-shrink-0">
                  <img src={book.coverImage} alt={book.title} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm mb-1">{book.title}</h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{book.author.name}</p>
                  <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5 mb-1`}>
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${book.progress}%` }}></div>
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{book.progress}{t('continueListening.completed')}</p>
                </div>
                <button 
                  onClick={() => handlePlay(book)}
                  className={`ml-3 h-10 w-10 rounded-full ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-600'} flex items-center justify-center`}
                >
                  <Play size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} text-center`}>
            <Headphones size={24} className={`mx-auto mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('continueListening.noListens')}</p>
          </div>
        )}
      </section>}
      
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