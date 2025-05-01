'use client'
import { Search, Clock, X, ChevronRight, Headphones, BookOpen, TrendingUp, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authApiHelper } from '../utils/api';

interface Audiobook {
  _id: string;
  title: string;
  author: string;
  narrator?: string;
  coverImage: string;
  category: string;
  averageRating?: number;
  duration?: number;
}

export default function SearchView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchResults, setSearchResults] = useState<Audiobook[]>([]);
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
    // Focus input on mount
    inputRef.current?.focus();

    // Load search suggestions
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
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-lg bg-white/95 shaddow-md z-v10 md:pt-4 pb-2 md:px-4 md:px-6">
        <div className="relative max-w-3xl mx-auto">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Discover your next listen..."
              className="w-full bg-gray-100 rounded-full py-3.5 px-5 pl-12 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300 shadow-sm"
              aria-label="Search audiobooks"
            />
            <div className="absolute left-4 top-3.5 text-indigo-500">
              <Search size={20} />
            </div>
            {searchQuery && (
              <button 
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-700 transition-colors"
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
              className="md:hidden flex items-center gap-1 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full text-sm font-medium"
              aria-expanded={showFilters}
              aria-controls="category-filters"
            >
              <Menu size={16} />
              <span>Filters</span>
              {activeCategory !== 'All' && (
                <span className="bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : searchQuery ? (
          <div>
            <p className="text-sm text-gray-600 mb-4 md:mb-6 italic px-1">
              {searchResults.length > 0 
                ? `Found ${searchResults.length} results for "${searchQuery}"`
                : `No results found for "${searchQuery}"`}
            </p>
            
            {searchResults.length > 0 && (
              <div className="grid grid-cols-1 gap-4">
                {searchResults.map(book => (
                  <div 
                    key={book._id} 
                    className="flex items-center gap-4 md:gap-5 p-4 rounded-xl bg-white hover:bg-indigo-50 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md border border-gray-100"
                    onClick={() => navigateToBook(book._id)}
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={book.coverImage || '/default-book-cover.jpg'} 
                        alt={book.title} 
                        className="w-16 h-24 md:w-20 md:h-28 object-cover rounded-lg shadow-md" 
                        loading="lazy"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1 rounded-full shadow-md">
                        <Headphones size={14} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-base md:text-lg text-gray-800 truncate">{book.title}</h3>
                      <p className="text-sm text-gray-600 truncate">{book.author}</p>
                      {book.narrator && (
                        <p className="text-xs text-gray-500 truncate mt-1">Narrated by: {book.narrator}</p>
                      )}
                      <div className="flex flex-wrap items-center mt-2 gap-2 md:gap-3">
                        {book.averageRating && (
                          <span className="flex items-center text-xs bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-medium">
                            ★ {book.averageRating.toFixed(1)}
                          </span>
                        )}
                        {book.duration && (
                          <span className="flex items-center text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium">
                            <Clock size={12} className="mr-1" /> {formatDuration(book.duration)}
                          </span>
                        )}
                        <span className="flex items-center text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium">
                          {book.category}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-indigo-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6 md:gap-8">
            {(suggestions?.recentSearches ?? []).length > 0 && (
              <section className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4 flex items-center text-gray-800">
                  <Clock size={18} className="mr-2 text-indigo-500" />
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestions?.recentSearches?.map((search, index) => (
                    <button 
                      key={index}
                      className="px-3 py-1.5 bg-gray-50 rounded-full text-sm flex items-center hover:bg-indigo-100 transition-colors border border-gray-200 group"
                      onClick={() => setSearchQuery(search)}
                    >
                      <span>{search}</span>
                      <div 
                        className="ml-2 text-gray-400 group-hover:text-gray-700"
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
            
            <section className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4 flex items-center text-gray-800">
                <TrendingUp size={18} className="mr-2 text-indigo-500" />
                Trending Searches
              </h3>
              <div className="grid grid-cols-1 gap-1.5">
                {suggestions?.trendingSearches?.map((search, index) => (
                  <button 
                    key={index}
                    className="flex items-center p-3 hover:bg-indigo-50 rounded-xl transition-colors"
                    onClick={() => setSearchQuery(search)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                      ${index === 0 ? 'bg-amber-100 text-amber-600' : 
                        index === 1 ? 'bg-gray-200 text-gray-700' : 
                        index === 2 ? 'bg-amber-800 text-amber-100' : 'bg-indigo-100 text-indigo-600'}`}>
                      {index + 1}
                    </div>
                    <span className="flex-1 text-left">{search}</span>
                    <ChevronRight size={18} className="text-indigo-400" />
                  </button>
                ))}
              </div>
            </section>
            
            {(suggestions?.categories ?? []).length > 0 && (
              <section className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4 flex items-center text-gray-800">
                  <BookOpen size={18} className="mr-2 text-indigo-500" />
                  Browse Categories
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {suggestions?.categories?.map((category) => (
                    <button 
                      key={category.name}
                      className="bg-gradient-to-br from-indigo-50 to-indigo-50 p-4 rounded-xl text-left hover:shadow-md transition-all border border-indigo-100 hover:border-indigo-200 relative overflow-hidden group"
                      onClick={() => {
                        setActiveCategory(category.name);
                        setSearchQuery('');
                      }}
                    >
                      <div className="relative z-10">
                        <h4 className="font-medium text-gray-800">{category.name}</h4>
                        <p className="text-sm text-indigo-600 mt-1 font-medium">{category.count} titles</p>
                      </div>
                      <div className="absolute bottom-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BookOpen size={64} className="text-indigo-800" />
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
      <div className="h-16 md:h-8"></div>
    </div>
  );
}

// import { Search, Clock, X, ChevronRight } from 'lucide-react';
// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { authApiHelper } from '../utils/api';

// interface Audiobook {
//   _id: string;
//   title: string;
//   author: string;
//   narrator?: string;
//   coverImage: string;
//   category: string;
//   averageRating?: number;
//   duration?: number;
// }

// const SearchView = () => {
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [searchResults, setSearchResults] = useState<Audiobook[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [suggestions, setSuggestions] = useState<{
//     recentSearches: string[];
//     trendingSearches: string[];
//     categories: { name: string; count: number }[];
//   } | null>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const searchCategories = [
//     'All',
//     'Fiction',
//     'Non-Fiction',
//     'Fantasy',
//     'Mystery',
//     'Romance',
//     'Biography'
//   ];

//   useEffect(() => {
//     // Focus input on mount
//     inputRef.current?.focus();

//     // Load search suggestions
//     const loadSuggestions = async () => {
//       try {
//         const response = await authApiHelper.get('/search/suggestions');
//         if (response.ok) {
//           setSuggestions(await response.json());
//         }
//       } catch (err) {
//         console.error('Failed to load suggestions', err);
//       }
//     };

//     loadSuggestions();
//   }, []);

//   useEffect(() => {
//     if (!searchQuery) {
//       setSearchResults([]);
//       return;
//     }

//     const searchDebounce = setTimeout(() => {
//       performSearch();
//     }, 300);

//     return () => clearTimeout(searchDebounce);
//   }, [searchQuery, activeCategory]);

//   const performSearch = async () => {
//     if (!searchQuery.trim()) return;

//     setLoading(true);
//     try {
//       const response = await authApiHelper.get(
//         `/search?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(activeCategory)}`
//       );
      
//       if (response.ok) {
//         setSearchResults(await response.json());
//       }
//     } catch (err) {
//       console.error('Search failed', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearSearch = () => {
//     setSearchQuery('');
//     setSearchResults([]);
//     inputRef.current?.focus();
//   };

//   const navigateToBook = (bookId: string) => {
//     router.push(`/book/${bookId}`);
//   };

//   const formatDuration = (seconds?: number) => {
//     if (!seconds) return '';
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     return `${hours}h ${minutes}m`;
//   };

//   return (
//     <div className="flex flex-col gap-4 pb-24 text-black">
//       <div className="sticky top-0 bg-white z-10 pt-2 pb-4 px-4">
//         <div className="relative">
//           <input
//             ref={inputRef}
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search books, authors, narrators..."
//             className="w-full bg-gray-100 rounded-full py-3 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
//           />
//           <Search size={18} className="absolute left-3 top-3.5 text-gray-500" />
//           {searchQuery && (
//             <button 
//               className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
//               onClick={clearSearch}
//             >
//               <X size={18} />
//             </button>
//           )}
//         </div>
        
//         <div className="flex overflow-x-auto gap-2 mt-4 pb-2 scrollbar-hide">
//           {searchCategories.map(category => (
//             <button 
//               key={category}
//               className={`px-4 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
//                 activeCategory === category 
//                   ? 'bg-indigo-500 text-white' 
//                   : 'bg-gray-100 hover:bg-gray-200'
//               }`}
//               onClick={() => setActiveCategory(category)}
//             >
//               {category}
//             </button>
//           ))}
//         </div>
//       </div>
      
//       {loading ? (
//         <div className="flex justify-center items-center py-12">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
//         </div>
//       ) : searchQuery ? (
//         <div className="px-4">
//           <p className="text-sm text-gray-600 mb-4">
//             {searchResults.length > 0 
//               ? `Found ${searchResults.length} results for "${searchQuery}"`
//               : `No results found for "${searchQuery}"`}
//           </p>
          
//           {searchResults.length > 0 && (
//             <div className="grid grid-cols-1 gap-4">
//               {searchResults.map(book => (
//                 <div 
//                   key={book._id} 
//                   className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
//                   onClick={() => navigateToBook(book._id)}
//                 >
//                   <img 
//                     src={book.coverImage || '/default-book-cover.jpg'} 
//                     alt={book.title} 
//                     className="w-16 h-20 object-cover rounded shadow-sm" 
//                   />
//                   <div className="flex-1 min-w-0">
//                     <h3 className="font-medium truncate">{book.title}</h3>
//                     <p className="text-sm text-gray-600 truncate">{book.author}</p>
//                     {book.narrator && (
//                       <p className="text-xs text-gray-500 truncate">Narrated by: {book.narrator}</p>
//                     )}
//                     <div className="flex items-center mt-1 gap-2">
//                       {book.averageRating && (
//                         <span className="flex items-center text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
//                           ★ {book.averageRating.toFixed(1)}
//                         </span>
//                       )}
//                       {book.duration && (
//                         <span className="text-xs text-gray-500">
//                           {formatDuration(book.duration)}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <ChevronRight size={18} className="text-gray-400" />
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="px-4 flex flex-col gap-6">
//           {suggestions?.recentSearches?.length > 0 && (
//             <section>
//               <h3 className="text-lg font-medium mb-3">Recent Searches</h3>
//               <div className="flex flex-wrap gap-2">
//                 {suggestions.recentSearches.map((search, index) => (
//                   <button 
//                     key={index}
//                     className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center hover:bg-gray-200 transition-colors"
//                     onClick={() => setSearchQuery(search)}
//                   >
//                     <span>{search}</span>
//                     <X 
//                       size={14} 
//                       className="ml-2 text-gray-500 hover:text-gray-700"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         // Here you would call an API to remove from recent searches
//                       }}
//                     />
//                   </button>
//                 ))}
//               </div>
//             </section>
//           )}
          
//           <section>
//             <h3 className="text-lg font-medium mb-3">Trending Searches</h3>
//             <div className="flex flex-col gap-2">
//               {suggestions?.trendingSearches?.map((search, index) => (
//                 <button 
//                   key={index}
//                   className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
//                   onClick={() => setSearchQuery(search)}
//                 >
//                   <Clock size={16} className="text-gray-500 mr-3" />
//                   <span className="flex-1 text-left">{search}</span>
//                   <ChevronRight size={16} className="text-gray-400" />
//                 </button>
//               ))}
//             </div>
//           </section>
          
//           {suggestions?.categories?.length > 0 && (
//             <section>
//               <h3 className="text-lg font-medium mb-3">Browse Categories</h3>
//               <div className="grid grid-cols-2 gap-3">
//                 {suggestions.categories.map((category) => (
//                   <button 
//                     key={category.name}
//                     className="bg-gray-100 p-4 rounded-lg text-left hover:bg-gray-200 transition-colors"
//                     onClick={() => {
//                       setActiveCategory(category.name);
//                       setSearchQuery('');
//                     }}
//                   >
//                     <h4 className="font-medium">{category.name}</h4>
//                     <p className="text-sm text-gray-600">{category.count} titles</p>
//                   </button>
//                 ))}
//               </div>
//             </section>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchView;