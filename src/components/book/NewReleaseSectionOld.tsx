import { Book } from '@/app/[locale]/page-old';
import { formatTime } from '@/app/utils/helpers';
import { AlertCircle, AlertTriangle, ChevronLeft, ChevronRight, Clock, Play, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

interface NewReleaseSectionProps {
  loading: { newReleases: boolean };
  error: {
    newReleases: string | null;
    featured: string | null;
    continue: string | null;
  };
  newReleases: Array<Book>;
  handlePlay: (book: any) => void;
  isOffline: boolean;
}

function NewReleaseSection({loading, error, newReleases, handlePlay, isOffline}: NewReleaseSectionProps) {
    const t = useTranslations('HomePage')
    const { theme } = useTheme()
    const router = useRouter()

  return (
    <section className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} `}>
  {/* Header with more artistic approach */}
  <div className="flex items-center justify-between md:p-6">
    <div className="flex items-center">
      <div className={`h-8 w-1 rounded-full ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-600'} mr-3`}></div>
      <h2 className="text-lg md:text-xl font-bold">{t('sections.newReleases')}</h2>
    </div>
    
    <Link 
      href={"/view-list?type=new-releases"} 
      className={`inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-medium rounded-full ${
        theme === 'dark' 
          ? 'bg-gray-800 hover:bg-gray-700 text-purple-300' 
          : 'bg-white hover:bg-gray-100 text-purple-600 shadow-sm'
      } transition-colors`}
    >
      {t('common.viewAll')} 
      <ChevronRight size={14} className="ml-1" />
    </Link>
  </div>
  
  {/* Loading state with horizontal bars */}
  {loading.newReleases ? (
    <div className="px-4 md:px-6 pb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col">
            <div className={`aspect-square rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse mb-3`}></div>
            <div className={`h-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded animate-pulse mb-2`}></div>
            <div className={`h-2.5 w-2/3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} rounded animate-pulse`}></div>
          </div>
        ))}
      </div>
    </div>
  ) : error.newReleases ? (
    <div className="px-4 md:px-6 pb-6">
      <div className={`flex items-center justify-center rounded-xl p-6 ${
        theme === 'dark' ? 
        (isOffline ? 'bg-gray-800 text-gray-300' : 'bg-red-900/20 text-red-300') : 
        (isOffline ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-600')
      }`}>
        <div className="text-center">
          <AlertTriangle size={24} className="mx-auto mb-2" />
          <p className="text-sm md:text-base">{error.newReleases}</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="md:px-6 pb-6">
      {/* Grid Layout Instead of Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
        {newReleases.map((book) => (
          <div 
            key={book?._id} 
            className={`group rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-white hover:shadow-md'} transition-all duration-300 py-2 cursor-pointer`}
          >
            {/* Square covers instead of rectangular */}
            <div className="relative aspect-square rounded-lg overflow-hidden mb-3" onClick={() => handlePlay(book)}>
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className="object-cover w-full h-full" 
                loading="lazy"
              />
              
              {/* Overlay with circular play button */}
              <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/40' : 'bg-gray-900/30'} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                <button 
                  className={`h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full ${
                    theme === 'dark' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white text-purple-600'
                  } shadow-lg transform transition-transform group-hover:scale-110`}
                  aria-label={`Play ${book.title}`}
                >
                  <Play size={theme === 'dark' ? 16 : 16} className="ml-0.5" fill="currentColor" />
                </button>
              </div>
              
              {/* Duration tag positioned in corner */}
              <div className={`absolute bottom-2 right-2 px-2 py-1 rounded-full text-[10px] md:text-xs ${
                theme === 'dark' 
                  ? 'bg-black/70 text-white' 
                  : 'bg-white/80 text-gray-800'
              } flex items-center`}>
                <Clock size={10} className="mr-1" /> 
                {formatTime(book.duration)}
              </div>
            </div>
            
            {/* Book info with added details */}
            <div className="px-1" onClick={() => router.push(`/book/${book.slug}`)}>
              <h3 className="font-semibold text-xs md:text-sm line-clamp-1">{book.title}</h3>
              <p className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} line-clamp-1 mb-1`}>
                {book.author.name}
              </p>
              
              {/* Simple rating indicator */}
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i} 
                    size={10} 
                    className={`${i < book.averageRating ? (theme === 'dark' ? 'text-amber-400' : 'text-amber-500') : 'text-gray-400'} ${i > 0 ? '-ml-0.5' : ''}`}
                    fill={i < book.averageRating ? 'currentColor' : 'none'}
                  />
                ))}
                <span className={`text-[9px] md:text-[10px] ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {book.averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* View more button for mobile */}
      <div className="mt-4 flex justify-center md:hidden">
        <Link
          href={"/view-list?type=new-releases"} 
          className={`inline-flex items-center justify-center w-full max-w-xs py-2 rounded-full ${
              theme === 'dark' 
              ? 'bg-gray-800 hover:bg-gray-700 text-white' 
              : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
            } text-xs font-medium`}
        >
          {t('common.viewMore')}
            <ChevronRight size={16} className="mr-1" />
        </Link>
      </div>
    </div>
  )}
</section>


  )
}

export default NewReleaseSection