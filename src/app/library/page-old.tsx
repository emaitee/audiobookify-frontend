'use client'
import { Heart, Plus, Search, Book, Bookmark, CheckCircle, Download, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { authApiHelper } from '../utils/api';

interface LibraryBook {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  progress?: number;
  isFavorite?: boolean;
  status?: 'in-progress' | 'completed' | 'downloaded';
  duration?: number;
  currentTime?: number;
}

const LibraryView = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibraryBooks = async () => {
      try {
        setLoading(true);
        const response = await authApiHelper.get('/library');
        console.log(response)
        if (!response.ok) throw new Error('Failed to fetch library');
        
        const data = await response.json();
        setBooks(data.books.map((book: any) => ({
          ...book,
          progress: book.currentTime && book.duration 
            ? Math.round((book.currentTime / book.duration) * 100)
            : 0
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryBooks();
  }, []);

  const filteredBooks = books.filter(book => {
    switch (activeFilter) {
      case 'in-progress':
        return book.status === 'in-progress';
      case 'completed':
        return book.status === 'completed';
      case 'favorites':
        return book.isFavorite;
      case 'downloaded':
        return book.status === 'downloaded';
      default:
        return true;
    }
  });

  const toggleFavorite = async (bookId: string) => {
    try {
      const response = await authApiHelper.patch(`/library/${bookId}/favorite`);
      if (!response.ok) throw new Error('Failed to update favorite status');
      
      setBooks(books.map(book => 
        book._id === bookId 
          ? { ...book, isFavorite: !book.isFavorite } 
          : book
      ));
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };

  const EmptyState = () => {
    let icon, title, description;
    
    switch (activeFilter) {
      case 'in-progress':
        icon = Clock;
        title = "No books in progress";
        description = "Start listening to books and they'll appear here";
        break;
      case 'completed':
        icon = CheckCircle;
        title = "No completed books";
        description = "Finish listening to books to see them here";
        break;
      case 'favorites':
        icon = Heart;
        title = "No favorite books";
        description = "Tap the heart icon to add books to favorites";
        break;
      case 'downloaded':
        icon = Download;
        title = "No downloaded books";
        description = "Download books to listen offline";
        break;
      default:
        icon = Book;
        title = "Your library is empty";
        description = "Add books to your library to get started";
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
        <icon className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-500 text-center max-w-md">{description}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        Error loading library: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-24 text-black">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Library</h2>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <Search size={20} />
          </button>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <Plus size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex overflow-x-auto gap-2 pb-2">
        {[
          { id: 'all', label: 'All Books', icon: Book },
          { id: 'in-progress', label: 'In Progress', icon: Clock },
          { id: 'completed', label: 'Completed', icon: CheckCircle },
          { id: 'favorites', label: 'Favorites', icon: Heart },
          { id: 'downloaded', label: 'Downloaded', icon: Download }
        ].map((filter) => (
          <button
            key={filter._id}
            onClick={() => setActiveFilter(filter._id)}
            className={`px-4 py-1 rounded-full text-sm whitespace-nowrap flex items-center gap-1 ${
              activeFilter === filter._id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <filter.icon size={16} />
            {filter.label}
          </button>
        ))}
      </div>
      
      <div className="flex flex-col gap-3">
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <div 
              key={book._id} 
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img 
                src={book.coverImage || '/default-book-cover.jpg'} 
                alt={book.title} 
                className="w-16 h-20 object-cover rounded" 
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{book.title}</h3>
                <p className="text-sm text-gray-600 truncate">{book.author}</p>
                {book.progress && book.progress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 h-1 rounded-full">
                      <div 
                        className="bg-blue-500 h-1 rounded-full" 
                        style={{ width: `${book.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {book.progress}% complete
                    </p>
                  </div>
                )}
              </div>
              <button 
                className={`p-2 ${book.isFavorite ? 'text-red-500' : 'text-gray-400'}`}
                onClick={() => toggleFavorite(book._id)}
              >
                <Heart size={20} fill={book.isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default LibraryView;