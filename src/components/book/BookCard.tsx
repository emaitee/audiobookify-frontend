import { Book } from "@/app/[locale]/page";
import { Clock, Star, Bookmark, Play } from "lucide-react";
import { useState } from "react";

export default function BookCard({ book }: { book: Book }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Helper function to format duration (assuming this exists in the original code)
  const formatDuration = (duration:number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  // Translation function (assuming this exists in the original code)
  const t = (key: 'bookItem.coverAlt' | 'bookItem.narratedBy' | 'bookItem.noRating', params?: {title: string}) => {
    const translations = {
      'bookItem.coverAlt': `Cover for ${params?.title}`,
      'bookItem.narratedBy': 'Narrated by',
      'bookItem.noRating': 'N/A'
    };
    return translations[key];
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Book cover with overlay */}
      <div className="relative pb-[140%] group">
        <img 
          src={book.coverImage || '/api/placeholder/250/400'} 
          alt={t('bookItem.coverAlt', { title: book.title })} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action buttons that appear on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
          <button className="bg-white text-purple-700 p-2 rounded-full shadow-lg hover:bg-purple-50 transition-colors">
            <Bookmark size={18} />
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-1 hover:bg-purple-700 transition-colors">
            <Play size={16} />
            <span className="text-sm font-medium">Play</span>
          </button>
        </div>
      </div>
      
      {/* Book info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-bold text-gray-800 line-clamp-2 text-base leading-tight">{book.title}</h3>
          <p className="text-sm text-gray-600 mt-1.5 font-medium">{book.author.name}</p>
          <p className="text-xs text-gray-500 mt-1">{t('bookItem.narratedBy')} <span className="font-medium">{book.narrator.name}</span></p>
        </div>
        
        {/* Details row with subtle separator */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          <div className="flex items-center text-gray-500">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            <span>{formatDuration(book.duration || 0)}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 mr-1 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold">{Number(book.averageRating)?.toFixed(1) || t('bookItem.noRating')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}