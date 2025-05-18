import { useTheme } from 'next-themes';
import { Play, Clock, Star } from 'lucide-react';
import { Book } from '@/app/[locale]/page';
import { formatTime } from '@/app/utils/helpers';

interface BookCardProps {
  book: Book;
  onPlay: (book: Book) => void;
  onClick?: (book: Book) => void;
  aspectRatio?: 'square' | 'portrait';
}

const BookCard = ({ 
  book, 
  onPlay, 
  onClick, 
  aspectRatio = 'square'
}: BookCardProps) => {
  const { theme } = useTheme();

  const handleCardClick = () => {
    if (onClick) onClick(book);
  };

  const aspectClass = aspectRatio === 'square' ? 'aspect-square' : 'aspect-[2/3]';
  
  return (
    <div className={`group rounded-lg ${
      theme === 'dark' ? 'hover:bg-gray-800/70' : 'hover:bg-white hover:shadow-lg'
    } transition-all duration-300 py-2 cursor-pointer`}>
      {/* Cover image with play overlay */}
      <div 
        className={`relative ${aspectClass} rounded-lg overflow-hidden mb-3`} 
        onClick={() => onPlay(book)}
      >
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="object-cover w-full h-full" 
          loading="lazy"
        />
        
        {/* Play button overlay */}
        <div className={`absolute inset-0 ${
          theme === 'dark' ? 'bg-black/40' : 'bg-gray-900/30'
        } flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
          <button 
            className={`h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full ${
              theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'
            } shadow-lg transform transition-transform group-hover:scale-110`}
            aria-label={`Play ${book.title}`}
          >
            <Play size={16} className="ml-0.5" fill="currentColor" />
          </button>
        </div>
        
        {/* Duration tag */}
        {book.duration && (
          <div className={`absolute bottom-2 right-2 px-2 py-1 rounded-full text-[10px] md:text-xs ${
            theme === 'dark' ? 'bg-black/70 text-white' : 'bg-white/80 text-gray-800'
          } flex items-center`}>
            <Clock size={10} className="mr-1" /> 
            {formatTime(book.duration)}
          </div>
        )}
      </div>
      
      {/* Book info */}
      <div className="px-1" onClick={handleCardClick}>
        <h3 className="font-semibold text-xs md:text-sm line-clamp-1">{book.title}</h3>
        <p className={`text-[10px] md:text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        } line-clamp-1 mb-1`}>
          {book.author.name}
        </p>
        
        {/* Rating */}
        {book.averageRating > 0 && (
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i} 
                size={10} 
                className={`${
                  i < Math.round(book.averageRating) 
                    ? (theme === 'dark' ? 'text-amber-400' : 'text-amber-500') 
                    : 'text-gray-400'
                } ${i > 0 ? '-ml-0.5' : ''}`}
                fill={i < Math.round(book.averageRating) ? 'currentColor' : 'none'}
              />
            ))}
            <span className={`text-[9px] md:text-[10px] ml-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {book.averageRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;