import { Book } from "@/app/[locale]/page-old";
import { usePlayer } from "@/context/PlayerContext";
import { Clock, Star, Headphones, BookOpen, Pause } from "lucide-react";
import { useState } from "react";

export default function BookCard({ book }: { book: Book }) {
  const {play,togglePlay, currentBook} = usePlayer()
  const [expanded, setExpanded] = useState(false);
  
  // Helper function to format duration (assuming this exists in the original code)
  const formatDuration = (duration:number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  // Translation function (assuming this exists in the original code)
  const t = (key: 'bookItem.coverAlt' | 'bookItem.narratedBy' | 'bookItem.noRating', params?: { title: string }) => {
    const translations = {
      'bookItem.coverAlt': `Cover for `,
      'bookItem.narratedBy': 'Narrated by',
      'bookItem.noRating': 'N/A'
    };
    return translations[key] || key;
  };

  const isPlaying = currentBook?._id === book._id;

  const handlePlay = () => {
    if (isPlaying) {
        togglePlay();
      } else {
play(book);
      }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Mobile-first horizontal layout */}
      <div className="flex flex-row p-2 sm:p-3">
        {/* Book cover - smaller on mobile, proportionally sized */}
        <div className="relative w-24 h-32 sm:w-28 sm:h-40 flex-shrink-0 rounded-md overflow-hidden">
          <img 
            src={book.coverImage || '/api/placeholder/250/400'} 
            alt={t('bookItem.coverAlt', { title: book.title })} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Rating badge */}
          <div className="absolute top-0 right-0 bg-black/70 px-1.5 py-0.5 rounded-bl-md flex items-center">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white font-medium ml-0.5">
              {Number(book.averageRating)?.toFixed(1) || '-'}
            </span>
          </div>
        </div>
        
        {/* Book info - flexible width */}
        <div className="ml-3 sm:ml-4 flex flex-col flex-grow justify-between">
          <div>
            {/* Title and toggle button */}
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">{book.title}</h3>
              <button 
                onClick={() => setExpanded(!expanded)}
                className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <BookOpen className="h-4 w-4" />
              </button>
            </div>
            
            {/* Author */}
            <p className="text-xs sm:text-sm text-gray-700 mt-0.5 line-clamp-1">{book.author.name}</p>
            
            {/* Duration */}
            <div className="flex items-center mt-1.5 text-gray-500 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatDuration(book.duration || 0)}</span>
            </div>
          </div>
          
          {/* Action button */}
          <div className="mt-2 sm:mt-3">
            <button onClick={handlePlay} className="bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium w-full transition-colors">
             {isPlaying ? <Pause className="h-3.5 w-3.5 mr-1.5" /> : <Headphones className="h-3.5 w-3.5 mr-1.5" />}
              {isPlaying ? "Pause" : "Listen Now"}
            </button>
          </div>
        </div>
      </div>
      
      {/* Expandable section with narrator and description */}
      <div className={`overflow-hidden transition-all duration-300 bg-gray-50 ${expanded ? 'max-h-32' : 'max-h-0'}`}>
        <div className="p-3 text-xs sm:text-sm">
          <p className="text-gray-600">
            <span className="font-medium">{t('bookItem.narratedBy')}:</span> {book.narrator.name}
          </p>
          {book.description && (
            <p className="mt-1 text-gray-700 line-clamp-3">{book.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}