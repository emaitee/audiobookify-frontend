import React from 'react'
import { ChevronRight, Play, Headphones } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Book } from '@/app/[locale]/page';

interface ContinueListeningType {
    error: { 
        newReleases: string | null;
    featured: string | null;
    continue: string | null;
     },
    loading: { continue: boolean },
    continueListening: Book[];
    handlePlay: (book:Book) => void;
}

function ContinueListening({error, loading, continueListening, handlePlay}: ContinueListeningType) {
  const t = useTranslations('HomePage')
  const { theme } = useTheme()
    
  return (
<section className="md:px-4 pb-6">
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
            {continueListening.map((book:Book) => (
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
      </section>
  )
}

export default ContinueListening