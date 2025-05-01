'use client'
import { Search, X, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";

const SearchView = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  interface Book {
    id: string;
    title: string;
    author: string;
    coverUrl?: string;
    rating: number;
  }
  
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Category management
  const searchCategories = ["All", "Fiction", "Non-Fiction", "Fantasy", "Mystery", "Romance", "Biography"];
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0);
  
  // Recent searches (stored in local storage)
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Fetch trending searches from API
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  
  // Fetch categories from API
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  
  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    
    // Fetch trending searches
    fetchTrendingSearches();
    
    // Fetch categories
    fetchCategories();
  }, []);
  
  // Search when query or category changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      searchBooks();
      saveRecentSearch(debouncedSearchQuery);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery, activeCategory, ratingFilter]);
  
  // API functions
  const fetchTrendingSearches = async () => {
    try {
      const response = await fetch('/api/search/trending');
      const data = await response.json();
      setTrendingSearches(data.trends || []);
    } catch (err) {
      console.error('Error fetching trending searches:', err);
      setTrendingSearches([
        "Best fantasy series",
        "New releases this week",
        "Award winning audiobooks",
        "Best narrators"
      ]);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([
        { name: "Fiction", count: 12345 },
        { name: "Non-Fiction", count: 8765 },
        { name: "Mystery & Thriller", count: 3456 },
        { name: "Fantasy", count: 2345 }
      ]);
    }
  };
  
  const searchBooks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        category: activeCategory !== "All" ? activeCategory : "",
        page: page.toString(),
        limit: "10",
        minRating: ratingFilter.toString()
      });
      
      const response = await fetch(`/api/search?${params.toString()}`);
      if (!response?.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (page === 1) {
        setSearchResults(data.books || []);
      } else {
        setSearchResults(prev => [...prev, ...(data.books || [])]);
      }
      
      setHasMore(data.hasMore || false);
    } catch (err) {
      console.error('Error searching books:', err);
      setError('Failed to search books. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  interface SaveRecentSearchParams {
    query: string;
  }

  const saveRecentSearch = (query: SaveRecentSearchParams['query']): void => {
    if (!query.trim()) return;
    
    const updatedSearches: string[] = [
      query,
      ...recentSearches.filter((s: string) => s !== query)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };
  
  const removeRecentSearch = (searchTerm: string): void => {
    const updatedSearches: string[] = recentSearches.filter((s: string) => s !== searchTerm);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };
  
  const handleCategoryClick = (category: string): void => {
    setActiveCategory(category);
    setPage(1);
  };
  
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  
  const handleRecentSearchClick = (term: string): void => {
    setSearchQuery(term);
  };
  
  const handleTrendingSearchClick = (trend: string): void => {
    setSearchQuery(trend);
  };
  
  interface Category {
    name: string;
    count: number;
  }

  const handleCategoryBrowseClick = (category: Category['name']): void => {
    setActiveCategory(category);
    setSearchQuery(''); // Clear search query to show all books in category
  };

  // Render book item
  const renderBookItem = (book: Book) => (
    <div key={book.id} className="flex flex-col">
      <div className="relative">
        <img 
          src={book.coverUrl || "/api/placeholder/120/160"} 
          alt={book.title} 
          className="w-full h-48 object-cover rounded-lg shadow-md" 
        />
        <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium">
          ★ {book.rating}
        </div>
      </div>
      <h3 className="font-medium mt-2 line-clamp-1">{book.title}</h3>
      <p className="text-sm text-gray-600 line-clamp-1">{book.author}</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 pb-24 text-black">
      <div className="sticky top-0 bg-white z-10 pt-2 pb-4">
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, authors, narrators..."
            className="w-full bg-gray-100 rounded-full py-3 px-4 pl-10 text-sm"
            autoFocus
          />
          <Search size={18} className="absolute left-3 top-3.5 text-gray-500" />
          {searchQuery && (
            <button 
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {/* Categories filter */}
        <div className="flex overflow-x-auto gap-2 mt-4 pb-2">
          {searchCategories.map(category => (
            <button 
              key={category}
              className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
                activeCategory === category ? 'bg-indigo-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
          <button 
            className="px-4 py-1 rounded-full text-sm whitespace-nowrap bg-gray-200 flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={14} className="mr-1" />
            Filters
          </button>
        </div>
        
        {/* Advanced filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Minimum Rating</h4>
            <div className="flex items-center gap-2">
              {[0, 3, 3.5, 4, 4.5].map(rating => (
                <button
                  key={rating}
                  className={`px-3 py-1 rounded-full text-xs ${
                    ratingFilter === rating ? 'bg-indigo-500 text-white' : 'bg-gray-200'
                  }`}
                  onClick={() => setRatingFilter(rating)}
                >
                  {rating === 0 ? 'Any' : `${rating}+`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Search results */}
      {searchQuery ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            {isLoading && page === 1 ? 'Searching...' : 
             `Showing results for "${searchQuery}"${activeCategory !== 'All' ? ` in ${activeCategory}` : ''}`}
          </p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          {searchResults.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-500">No results found</p>
              <p className="text-sm text-gray-400 mt-1">Try a different search term or category</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                {searchResults.map(book => renderBookItem(book))}
              </div>
              
              {isLoading && page > 1 && (
                <div className="py-4 text-center">
                  <p className="text-gray-500">Loading more results...</p>
                </div>
              )}
              
              {!isLoading && hasMore && (
                <button 
                  className="bg-indigo-500 text-white rounded-full py-2 px-6 mx-auto mt-4"
                  onClick={handleLoadMore}
                >
                  Load More
                </button>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <section>
              <h3 className="text-lg font-medium mb-3">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(term => (
                  <button 
                    key={term} 
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center"
                    onClick={() => handleRecentSearchClick(term)}
                  >
                    <span>{term}</span>
                    <span 
                      className="ml-2 text-gray-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(term);
                      }}
                    >×</span>
                  </button>
                ))}
              </div>
            </section>
          )}
          
          {/* Trending Searches */}
          <section>
            <h3 className="text-lg font-medium mb-3">Trending Searches</h3>
            <div className="flex flex-col gap-2">
              {trendingSearches.map((trend, index) => (
                <button 
                  key={index}
                  className="flex items-center p-2 hover:bg-gray-50 rounded"
                  onClick={() => handleTrendingSearchClick(trend)}
                >
                  <Search size={16} className="text-gray-500 mr-3" />
                  <span>{trend}</span>
                </button>
              ))}
            </div>
          </section>
          
          {/* Browse Categories */}
          <section>
            <h3 className="text-lg font-medium mb-3">Browse Categories</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category, index) => (
                <button 
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg text-left"
                  onClick={() => handleCategoryBrowseClick(category.name)}
                >
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-sm text-gray-600">{category.count.toLocaleString()} titles</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default SearchView;

// 'use client'
// import { Search } from "lucide-react";
// import { useState } from "react";


// const SearchView = () => {
//       const [searchQuery, setSearchQuery] = useState('');
    
//     const searchCategories = ["All", "Fiction", "Non-Fiction", "Fantasy", "Mystery", "Romance", "Biography"];
//     const [activeCategory, setActiveCategory] = useState("All");
    
//     const searchResults = [
//       { id: 10, title: "The Midnight Library", author: "Matt Haig", cover: "/api/placeholder/120/160", rating: 4.5 },
//       { id: 11, title: "Project Hail Mary", author: "Andy Weir", cover: "/api/placeholder/120/160", rating: 4.8 },
//       { id: 12, title: "Atomic Habits", author: "James Clear", cover: "/api/placeholder/120/160", rating: 4.7 },
//       { id: 13, title: "The Alchemist", author: "Paulo Coelho", cover: "/api/placeholder/120/160", rating: 4.6 },
//       { id: 14, title: "The Silent Patient", author: "Alex Michaelides", cover: "/api/placeholder/120/160", rating: 4.3 },
//       { id: 15, title: "Where the Crawdads Sing", author: "Delia Owens", cover: "/api/placeholder/120/160", rating: 4.7 },
//     ];
    
    

//   return (
//       <div className="flex flex-col gap-4 pb-24 text-black">
//         <div className="sticky top-0 bg-white z-10 pt-2 pb-4">
//           <div className="relative">
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search books, authors, narrators..."
//               className="w-full bg-gray-100 rounded-full py-3 px-4 pl-10 text-sm"
//               autoFocus
//             />
//             <Search size={18} className="absolute left-3 top-3.5 text-gray-500" />
//             {searchQuery && (
//               <button 
//                 className="absolute right-3 top-3 text-gray-500"
//                 onClick={() => setSearchQuery('')}
//               >
//                 ×
//               </button>
//             )}
//           </div>
          
//           <div className="flex overflow-x-auto gap-2 mt-4 pb-2">
//             {searchCategories.map(category => (
//               <button 
//                 key={category}
//                 className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
//                   activeCategory === category ? 'bg-indigo-500 text-white' : 'bg-gray-200'
//                 }`}
//                 onClick={() => setActiveCategory(category)}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         </div>
        
//         {searchQuery ? (
//           <div className="flex flex-col gap-4">
//             <p className="text-sm text-gray-600">Showing results for "{searchQuery}"</p>
//             <div className="grid grid-cols-2 gap-4">
//               {searchResults.map(book => (
//                 <div key={book._id} className="flex flex-col">
//                   <div className="relative">
//                     <img src={book.cover} alt={book.title} className="w-full h-48 object-cover rounded-lg shadow-md" />
//                     <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium">
//                       ★ {book.rating}
//                     </div>
//                   </div>
//                   <h3 className="font-medium mt-2">{book.title}</h3>
//                   <p className="text-sm text-gray-600">{book.author}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col gap-6">
//             <section>
//               <h3 className="text-lg font-medium mb-3">Recent Searches</h3>
//               <div className="flex flex-wrap gap-2">
//                 <button className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center">
//                   <span>Science Fiction</span>
//                   <span className="ml-2 text-gray-500">×</span>
//                 </button>
//                 <button className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center">
//                   <span>Stephen King</span>
//                   <span className="ml-2 text-gray-500">×</span>
//                 </button>
//                 <button className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center">
//                   <span>Self Development</span>
//                   <span className="ml-2 text-gray-500">×</span>
//                 </button>
//               </div>
//             </section>
            
//             <section>
//               <h3 className="text-lg font-medium mb-3">Trending Searches</h3>
//               <div className="flex flex-col gap-2">
//                 <button className="flex items-center p-2 hover:bg-gray-50 rounded">
//                   <Search size={16} className="text-gray-500 mr-3" />
//                   <span>Best fantasy series</span>
//                 </button>
//                 <button className="flex items-center p-2 hover:bg-gray-50 rounded">
//                   <Search size={16} className="text-gray-500 mr-3" />
//                   <span>New releases this week</span>
//                 </button>
//                 <button className="flex items-center p-2 hover:bg-gray-50 rounded">
//                   <Search size={16} className="text-gray-500 mr-3" />
//                   <span>Award winning audiobooks</span>
//                 </button>
//                 <button className="flex items-center p-2 hover:bg-gray-50 rounded">
//                   <Search size={16} className="text-gray-500 mr-3" />
//                   <span>Best narrators</span>
//                 </button>
//               </div>
//             </section>
            
//             <section>
//               <h3 className="text-lg font-medium mb-3">Browse Categories</h3>
//               <div className="grid grid-cols-2 gap-3">
//                 <button className="bg-gray-100 p-4 rounded-lg text-left">
//                   <h4 className="font-medium">Fiction</h4>
//                   <p className="text-sm text-gray-600">12,345 titles</p>
//                 </button>
//                 <button className="bg-gray-100 p-4 rounded-lg text-left">
//                   <h4 className="font-medium">Non-Fiction</h4>
//                   <p className="text-sm text-gray-600">8,765 titles</p>
//                 </button>
//                 <button className="bg-gray-100 p-4 rounded-lg text-left">
//                   <h4 className="font-medium">Mystery & Thriller</h4>
//                   <p className="text-sm text-gray-600">3,456 titles</p>
//                 </button>
//                 <button className="bg-gray-100 p-4 rounded-lg text-left">
//                   <h4 className="font-medium">Fantasy</h4>
//                   <p className="text-sm text-gray-600">2,345 titles</p>
//                 </button>
//               </div>
//             </section>
//           </div>
//         )}
//       </div>
//     );
//   };

//   export default SearchView