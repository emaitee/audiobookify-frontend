
import { useTheme } from 'next-themes';
import { Headphones, Play, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import SectionHeader from '../shared/SectionHeader';
import Skeleton from '../shared/Skeleton';
import { useTranslations } from 'next-intl';
import { calculateProgress } from '@/app/utils/book-utils';
import { Book } from '@/app/[locale]/page-old';


interface ContinueListeningProps {
  error: { 
    newReleases: string | null;
    featured: string | null;
    continue: string | null;
  };
  loading: { continue: boolean };
  continueListening: Book[];
  handlePlay: (book: Book) => void;
}

const ContinueListening = ({
  error,
  loading,
  continueListening,
  handlePlay
}: ContinueListeningProps) => {
  const t = useTranslations('HomePage');
  const { theme } = useTheme();
  
  // Loading skeletons for continue listening
  const renderSkeletons = () => (
    <div className="space-y-3">
      {[...Array(2)].map((_, i) => (
        <div 
          key={i} 
          className={`flex items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-3 shadow-lg animate-pulse`}
        >
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
  );
  
  // Error state
  const renderError = () => (
    <div className={`p-3 rounded-lg ${
      theme === 'dark' ? 'bg-gray-800 text-red-400' : 'bg-red-50 text-red-600'
    } text-sm`}>
      {error.continue}
    </div>
  );
  
  // Empty state when no books are being listened to
  const renderEmpty = () => (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} text-center`}>
      <Headphones size={24} className={`mx-auto mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        {t('continueListening.noListens')}
      </p>
    </div>
  );
  
  // Books being listened to
  const renderContinueListening = () => (
    <div className="space-y-3">
      {continueListening.map((book) => {
        const progress = calculateProgress(book);
        
        return (
          <div 
            key={book._id} 
            className={`flex items-center ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
            } rounded-lg p-3 shadow-lg transition-transform hover:scale-[1.01]`}
          >
            {/* Book cover */}
            <Link href={`/book/${book.slug}`} className="w-12 h-16 rounded overflow-hidden mr-3 flex-shrink-0">
              <img 
                src={book.coverImage} 
                alt={book.title} 
                className="object-cover w-full h-full" 
                loading="lazy"
              />
            </Link>
            
            {/* Book info and progress */}
            <div className="flex-1">
              <Link href={`/book/${book.slug}`}>
                <h3 className="font-medium text-sm mb-1 hover:underline">{book.title}</h3>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                } mb-2`}>
                  {book.author.name}
                </p>
              </Link>
              
              {/* Progress bar */}
              <div className={`w-full ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              } rounded-full h-1.5 mb-1 overflow-hidden`}>
                <div 
                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              {/* Progress info */}
              <div className="flex justify-between items-center">
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {progress}% {t('continueListening.completed')}
                </p>
                
                {book.remainingTime && (
                  <span className="flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    {book.remainingTime}
                  </span>
                )}
              </div>
            </div>
            
            {/* Play button */}
            <button 
              onClick={() => handlePlay(book)}
              className={`ml-3 h-10 w-10 rounded-full ${
                theme === 'dark' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700'
              } flex items-center justify-center transition-colors duration-300`}
              aria-label={`Play ${book.title}`}
            >
              <Play size={16} fill="white" />
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="md:px-4 pb-6">
      <SectionHeader
        title={t('sections.continueListening')}
        viewAllLink="/history"
        viewAllText={t('common.history')}
        icon={<Clock size={18} />}
      />
      
      {loading.continue ? renderSkeletons() : 
       error.continue ? renderError() : 
       continueListening.length === 0 ? renderEmpty() : 
       renderContinueListening()}
    </section>
  );
};

export default ContinueListening;