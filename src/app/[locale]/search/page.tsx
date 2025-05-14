
'use client'
import { Search, Clock, X, ChevronRight, Headphones, BookOpen, TrendingUp, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authApiHelper } from '../../utils/api';
import { useTheme } from 'next-themes';
import { Book } from '../page-old';

export default function SearchView() {
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    recentSearches: string[];
    trendingSearches: string[];
    categories: { name: string; count: number }[];
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchCategories = [
    'All',
    'Fiction',
    'Non-Fiction',
    'Fantasy',
    'Mystery',
    'Romance',
    'Biography'
  ];

  useEffect(() => {
    inputRef.current?.focus();
    const loadSuggestions = async () => {
      try {
        const response = await authApiHelper.get('/search/suggestions');
        if (response?.ok ?? false) {
          setSuggestions(await (response?.json() ?? null));
        }
      } catch (err) {
        console.error('Failed to load suggestions', err);
      }
    };

    loadSuggestions();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const searchDebounce = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [searchQuery, activeCategory]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await authApiHelper.get(
        `/search?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(activeCategory)}`
      );
      
      if (response?.ok) {
        setSearchResults(await response.json());
      }
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    inputRef.current?.focus();
  };

  const navigateToBook = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className={`flex flex-col min-h-screen ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : ' text-gray-800'
    }`}>
      {/* Header */}
      <div className={`sticky mb-4 top-0 backdrop-blur-lg z-v10 md:pt-4 pb-2 md:px-4 md:px-6 ${
        theme === 'dark' ? 'bg-gray-900/95 border-b border-gray-700' : ' border-b border-gray-200'
      }`}>
        <div className="relative max-w-3xl mx-auto">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Discover your next listen..."
              className={`w-full rounded-full py-3.5 px-5 pl-12 text-base focus:outline-none focus:ring-2 transition-all duration-300 shadow-sm ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-indigo-500 focus:bg-gray-600' 
                  : 'bg-white text-gray-800 placeholder-gray-500 focus:ring-indigo-500 focus:bg-white'
              }`}
              aria-label="Search audiobooks"
            />
            <div className={`absolute left-4 top-3.5 ${
              theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
            }`}>
              <Search size={20} />
            </div>
            {searchQuery && (
              <button 
                className={`absolute right-4 top-3.5 ${
                  theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'
                } transition-colors`}
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          <div className="flex items-center mt-3 mb-1">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`md:hidden flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                theme === 'dark' 
                  ? 'bg-indigo-900 text-indigo-200' 
                  : 'bg-indigo-50 text-indigo-600'
              }`}
              aria-expanded={showFilters}
              aria-controls="category-filters"
            >
              <Menu size={16} />
              <span>Filters</span>
              {activeCategory !== 'All' && (
                <span className={`text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1 ${
                  theme === 'dark' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-indigo-600 text-white'
                }`}>
                  1
                </span>
              )}
            </button>
            
            <div 
              id="category-filters"
              className={`${
                showFilters || 'hidden md:flex'
              } flex-1 overflow-x-auto gap-2 scrollbar-hide md:flex`}
            >
              <div className="flex gap-2 pb-1 md:pb-0 w-full justify-start">
                {searchCategories.map(category => (
                  <button 
                    key={category}
                    className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
                      activeCategory === category 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
                          : 'bg-white hover:bg-indigo-100 border border-gray-200'
                    }`}
                    onClick={() => {
                      setActiveCategory(category);
                      setShowFilters(false);
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 container mx-auto max-w-3xl md:px-4 md:py-6">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
              theme === 'dark' ? 'border-indigo-400' : 'border-indigo-600'
            }`}></div>
          </div>
        ) : searchQuery ? (
          <div>
            <p className={`text-sm mb-4 md:mb-6 italic px-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {searchResults.length > 0 
                ? `Found ${searchResults.length} results for "${searchQuery}"`
                : `No results found for "${searchQuery}"`}
            </p>
            
            {searchResults.length > 0 && (
              <div className="grid grid-cols-1 gap-4">
                {searchResults.map(book => (
                  <div 
                    key={book._id} 
                    className={`flex items-center gap-4 md:gap-5 p-4 rounded-xl cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' 
                        : 'bg-white hover:bg-indigo-50 border-gray-100'
                    }`}
                    onClick={() => navigateToBook(book.slug)}
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={book.coverImage || '/default-book-cover.jpg'} 
                        alt={book.title} 
                        className="w-16 h-24 md:w-20 md:h-28 object-cover rounded-lg shadow-md" 
                        loading="lazy"
                      />
                      <div className={`absolute -bottom-2 -right-2 p-1 rounded-full shadow-md ${
                        theme === 'dark' ? 'bg-indigo-700 text-indigo-200' : 'bg-indigo-600 text-white'
                      }`}>
                        <Headphones size={14} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-base md:text-lg truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>{book.title}</h3>
                      <p className={`text-sm truncate ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>{book.author.name}</p>
                      {book.narrator && (
                        <p className={`text-xs truncate mt-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                        }`}>Narrated by: {book.narrator.name}</p>
                      )}
                      <div className="flex flex-wrap items-center mt-2 gap-2 md:gap-3">
                        {book.averageRating && (
                          <span className={`flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${
                            theme === 'dark' 
                              ? 'bg-amber-900/30 text-amber-300' 
                              : 'bg-amber-50 text-amber-600'
                          }`}>
                            ★ {book.averageRating.toFixed(1)}
                          </span>
                        )}
                        {book.duration && (
                          <span className={`flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${
                            theme === 'dark' 
                              ? 'bg-indigo-900/30 text-indigo-300' 
                              : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            <Clock size={12} className="mr-1" /> {formatDuration(book.duration)}
                          </span>
                        )}
                        <span className={`flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${
                          theme === 'dark' 
                            ? 'bg-indigo-900/30 text-indigo-300' 
                            : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          {book.category}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={20} className={`flex-shrink-0 ${
                      theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
                    }`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6 md:gap-8">
            {(suggestions?.recentSearches ?? []).length > 0 && (
              <section className={`rounded-2xl p-4 md:p-6 shadow-sm border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 hover:shadow-lg' 
                  : 'bg-white border-gray-100 hover:shadow-md'
              } transition-all duration-300`}>
                <h3 className={`text-base md:text-lg font-medium mb-3 md:mb-4 flex items-center ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  <Clock size={18} className={`mr-2 ${
                    theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
                  }`} />
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestions?.recentSearches?.map((search, index) => (
                    <button 
                      key={index}
                      className={`px-3 py-1.5 rounded-full text-sm flex items-center transition-colors border group ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                          : 'bg-gray-50 border-gray-200 hover:bg-indigo-100'
                      }`}
                      onClick={() => setSearchQuery(search)}
                    >
                      <span>{search}</span>
                      <div 
                        className={`ml-2 ${
                          theme === 'dark' 
                            ? 'text-gray-500 group-hover:text-gray-400' 
                            : 'text-gray-400 group-hover:text-gray-700'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Here you would call an API to remove from recent searches
                        }}
                      >
                        <X size={14} />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
            
            <section className={`rounded-2xl p-4 md:p-6 shadow-sm border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 hover:shadow-lg' 
                : 'bg-white border-gray-100 hover:shadow-md'
            } transition-all duration-300`}>
              <h3 className={`text-base md:text-lg font-medium mb-3 md:mb-4 flex items-center ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                <TrendingUp size={18} className={`mr-2 ${
                  theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
                }`} />
                Trending Searches
              </h3>
              <div className="grid grid-cols-1 gap-1.5">
                {suggestions?.trendingSearches?.map((search, index) => (
                  <button 
                    key={index}
                    className={`flex items-center p-3 rounded-xl transition-colors ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-indigo-50'
                    }`}
                    onClick={() => setSearchQuery(search)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                      ${
                        index === 0 
                          ? theme === 'dark' 
                            ? 'bg-amber-900/50 text-amber-300' 
                            : 'bg-amber-100 text-amber-600' 
                          : index === 1 
                            ? theme === 'dark' 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-200 text-gray-700' 
                            : index === 2 
                              ? theme === 'dark' 
                                ? 'bg-amber-800/70 text-amber-200' 
                                : 'bg-amber-800 text-amber-100' 
                              : theme === 'dark' 
                                ? 'bg-indigo-900/30 text-indigo-300' 
                                : 'bg-indigo-100 text-indigo-600'
                      }`}>
                      {index + 1}
                    </div>
                    <span className="flex-1 text-left">{search}</span>
                    <ChevronRight size={18} className={
                      theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
                    } />
                  </button>
                ))}
              </div>
            </section>
            
            {(suggestions?.categories ?? []).length > 0 && (
              <section className={`rounded-2xl p-4 md:p-6 shadow-sm border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700 hover:shadow-lg' 
                  : 'bg-white border-gray-100 hover:shadow-md'
              } transition-all duration-300`}>
                <h3 className={`text-base md:text-lg font-medium mb-3 md:mb-4 flex items-center ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  <BookOpen size={18} className={`mr-2 ${
                    theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'
                  }`} />
                  Browse Categories
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {suggestions?.categories?.map((category) => (
                    <button 
                      key={category.name}
                      className={`p-4 rounded-xl text-left hover:shadow-md transition-all border relative overflow-hidden group ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 hover:border-indigo-500' 
                          : 'bg-indigo-50 border-indigo-100 hover:border-indigo-200'
                      }`}
                      onClick={() => {
                        setActiveCategory(category.name);
                        setSearchQuery('');
                      }}
                    >
                      <div className="relative z-10">
                        <h4 className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>{category.name}</h4>
                        <p className={`text-sm mt-1 font-medium ${
                          theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                        }`}>{category.count} titles</p>
                      </div>
                      <div className={`absolute bottom-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity ${
                        theme === 'dark' ? 'text-indigo-400' : 'text-indigo-800'
                      }`}>
                        <BookOpen size={64} />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Empty footer for spacing */}
      {/* <div className="h-16 md:h-8"></div> */}
    </div>
  );
}