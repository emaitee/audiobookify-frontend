import { useTheme } from 'next-themes';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import BookCard from './BookCard';
import Skeleton from '../shared/Skeleton';
import SectionHeader from '../shared/SectionHeader';
import { Book } from '@/app/[locale]/page';

interface BookShelfProps {
  title: string;
  books: Book[];
  loading?: boolean;
  error?: string | null;
  viewAllLink?: string;
  viewAllText?: string;
  icon?: React.ReactNode;
  onPlayBook: (book: Book) => void;
  onClickBook?: (book: Book) => void;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  skeletonCount?: number;
  layout?: 'grid' | 'scroll';
  aspectRatio?: 'square' | 'portrait';
}

const BookShelf = ({
  title,
  books,
  loading = false,
  error = null,
  viewAllLink,
  viewAllText = 'View All',
  icon,
  onPlayBook,
  onClickBook,
  emptyMessage = 'No books available',
  emptyIcon,
  skeletonCount = 4,
  layout = 'grid',
  aspectRatio = 'square'
}: BookShelfProps) => {
  const { theme } = useTheme();
  
  const renderSkeletons = () => {
    return [...Array(skeletonCount)].map((_, i) => (
      <div key={i} className="flex flex-col">
        <Skeleton
          className={`${aspectRatio === 'square' ? 'aspect-square' : 'aspect-[2/3]'} mb-3`}
        />
        <Skeleton variant="text" className="mb-2" />
        <Skeleton variant="text" width="66%" />
      </div>
    ));
  };

  const renderError = () => (
    <div className={`flex items-center justify-center rounded-xl p-6 ${
      theme === 'dark' ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-600'
    }`}>
      <div className="text-center">
        {error}
      </div>
    </div>
  );

  const renderEmpty = () => (
    <div className={`p-4 rounded-lg ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
    } text-center`}>
      {emptyIcon && <div className="mx-auto mb-2">{emptyIcon}</div>}
      <p className={`text-sm ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>{emptyMessage}</p>
    </div>
  );

  const renderBooks = () => (
    <>
      <div className={`${
        layout === 'grid' 
          ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4' 
          : 'flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide'
      }`}>
        {books.map((book) => (
          <div 
            key={book._id} 
            className={layout === 'scroll' ? 'snap-start min-w-[150px]' : ''}
          >
            <BookCard 
              book={book} 
              onPlay={onPlayBook} 
              onClick={onClickBook} 
              aspectRatio={aspectRatio}
            />
          </div>
        ))}
      </div>
      
      {/* Mobile view more button (only for grid layout) */}
      {layout === 'grid' && viewAllLink && (
        <div className="mt-4 flex justify-center md:hidden">
          <Link
            href={viewAllLink}
            className={`inline-flex items-center justify-center w-full max-w-xs py-2 rounded-full ${
              theme === 'dark' 
              ? 'bg-gray-800 hover:bg-gray-700 text-white' 
              : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
            } text-xs font-medium`}
          >
            {viewAllText}
            <ChevronRight size={16} className="mr-1" />
          </Link>
        </div>
      )}
    </>
  );

  return (
    <section className={`md:px-4 pb-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <SectionHeader 
        title={title} 
        viewAllLink={viewAllLink} 
        viewAllText={viewAllText} 
        icon={icon}
      />
      
      <div className="md:px-0 pb-2">
        {loading ? renderSkeletons() : 
         error ? renderError() : 
         books.length === 0 ? renderEmpty() :
         renderBooks()}
      </div>
    </section>
  );
};

export default BookShelf;