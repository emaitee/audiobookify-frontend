'use client'
import { Heart, Plus, Search, Book, Bookmark, CheckCircle, Download, Clock, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { authApiHelper } from '../utils/api';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const fetchLibraryBooks = async () => {
      try {
        setLoading(true);
        const response = await authApiHelper.get('/users/library');
        if (!response?.ok) throw new Error('Failed to fetch library');
        
        const data = await response.json();
        setBooks(data.map((book: any) => ({
          ...book,
          progress: book.currentTime && book.duration 
            ? Math.round((book.currentTime / book.duration) * 100)
            : 0
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch library');
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryBooks();
  }, []);

  const filteredBooks = books.filter(book => {
    // Filter by active tab
    let matchesFilter = true;
    switch (activeFilter) {
      case 'in-progress':
        matchesFilter = book.status === 'in-progress';
        break;
      case 'completed':
        matchesFilter = book.status === 'completed';
        break;
      case 'favorites':
        matchesFilter = book.isFavorite ?? false;
        break;
      case 'downloaded':
        matchesFilter = book.status === 'downloaded';
        break;
    }

    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const toggleFavorite = async (bookId: string) => {
    try {
      const book = books.find(b => b._id === bookId);
      let favoritesEndpoint = `/users/favorites/${bookId}`
      let libraryEndpoint = `/users/library/${bookId}/favorite`

      let response;
      if (book?.isFavorite) {
        response = await authApiHelper.delete(favoritesEndpoint)
      } else {
        response = await authApiHelper.post(libraryEndpoint)
      }

      if (!response?.ok) throw new Error('Failed to update favorite status');
      
      setBooks(books.map(book => 
        book._id === bookId 
          ? { ...book, isFavorite: !book.isFavorite } 
          : book
      ));
    } catch (err) {
      console.error('Error updating favorite:', err);
      setError(err instanceof Error ? err.message : 'Failed to update favorite');
    }
  };

  const DisplayEmptyState = ({ 
    icon: Icon, 
    title, 
    description, 
    actionText, 
    onAction 
  }: { 
    icon: React.ComponentType<{ className?: string }>; 
    title: string; 
    description: string; 
    actionText: string; 
    onAction: () => void; 
  }) => {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 mb-4">
          <Icon className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1 text-center">{title}</h3>
        <p className="text-gray-500 text-center max-w-md mb-4 text-sm sm:text-base">{description}</p>
        <button
          onClick={onAction}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
        >
          {actionText}
        </button>
      </div>
    );
  };

  const EmptyState = () => {
    let icon, title, description, actionText, action;
    
    switch (activeFilter) {
      case 'in-progress':
        icon = Clock;
        title = "No books in progress";
        description = "Start listening to books and they'll appear here";
        actionText = "Browse Books";
        action = () => router.push('/discover');
        break;
      case 'completed':
        icon = CheckCircle;
        title = "No completed books";
        description = "Finish listening to books to see them here";
        actionText = "Continue Listening";
        action = () => setActiveFilter('in-progress');
        break;
      case 'favorites':
        icon = Heart;
        title = "No favorite books";
        description = "Tap the heart icon to add books to favorites";
        actionText = "Browse Books";
        action = () => router.push('/discover');
        break;
      case 'downloaded':
        icon = Download;
        title = "No downloaded books";
        description = "Download books to listen offline";
        actionText = "Find Downloadable Books";
        action = () => router.push('/discover?downloadable=true');
        break;
      default:
        icon = Book;
        title = "Your library is empty";
        description = "Add books to your library to get started";
        actionText = "Browse Books";
        action = () => router.push('/discover');
    }

    return <DisplayEmptyState
      icon={icon}
      title={title}
      description={description}
      actionText={actionText}
      onAction={action}
    />
  };

  const SearchBar = () => (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Search library..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm"
      />
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg text-sm">
        Error loading library: {error}
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 pb-24 text-black md:px-4 sm:px-6 max-w-6xl mx-auto">
      {isSearchOpen ? (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="p-2 rounded-full bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <SearchBar />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold">Your Library</h2>
          <div className="flex gap-2">
            <button 
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 md:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search size={20} />
            </button>
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <button 
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              onClick={() => router.push('/discover')}
              aria-label="Add books"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      )}
      
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4">
        {[
          { id: 'all', label: 'All', icon: Book },
          { id: 'in-progress', label: 'In Progress', icon: Clock },
          { id: 'completed', label: 'Completed', icon: CheckCircle },
          { id: 'favorites', label: 'Favorites', icon: Heart },
          { id: 'downloaded', label: 'Downloaded', icon: Download }
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap flex items-center gap-1 transition-colors ${
              activeFilter === filter.id
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <filter.icon size={16} />
            <span className="hidden xs:inline">{filter.label}</span>
          </button>
        ))}
      </div>
      
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredBooks.map(book => (
            <div 
              key={book._id} 
              className="bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/book/${book._id}`)}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <img 
                  src={book.coverImage || '/default-book-cover.jpg'} 
                  alt={book.title} 
                  className="w-14 h-20 sm:w-16 sm:h-24 object-cover rounded" 
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate text-sm sm:text-base">{book.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate mb-1 sm:mb-2">{book.author}</p>
                  
                  {book.progress && book.progress > 0 && (
                    <div className="mt-1 sm:mt-2">
                      <div className="w-full bg-gray-200 h-1 rounded-full">
                        <div 
                          className="bg-indigo-500 h-1 rounded-full" 
                          style={{ width: `${Math.min(100, book.progress)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {book.progress}% complete
                      </p>
                    </div>
                  )}
                </div>
                <button 
                  className={`p-1 ${book.isFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(book._id);
                  }}
                  aria-label={book.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart size={18}  fill={book.isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default LibraryView;