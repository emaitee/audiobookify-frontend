'use client'
import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, ChevronDown, ChevronUp, Clock, Star, BookOpen } from 'lucide-react';
import { Book } from '../page';
import { authApiHelper } from '@/app/utils/api';
import { useTranslations } from 'next-intl'; // Import useTranslations hook
import BookCard from '@/components/book/BookCard';
import idb, { FilterOptions } from '@/lib/idb';
import { useTheme } from 'next-themes';
import FilterPanel from '@/components/FilterPanel';

const ViewListContent = () => {
  // Initialize translations
  const t = useTranslations("ListViewPage");
  const {theme} = useTheme()
  const searchParams = useSearchParams();
  
  const [isOffline, setIsOffline] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterOpen, setFilterOpen] = useState(false);
  const [audiobooks, setAudiobooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBooks, setTotalBooks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(t('allGenres'));
  const [selectedNarrator, setSelectedNarrator] = useState(t('allNarrators'));
  const [selectedDateFilter, setSelectedDateFilter] = useState('any');
  const [genres, setGenres] = useState<string[]>([]);
  const [narrators, setNarrators] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    genres: [t('allGenres')],
    narrators: [t('allNarrators')],
    dateFilters: [],
    sortOptions: [],
    defaults: {
      genre: 'all',
      narrator: 'all',
      dateFilter: 'any',
      sortOrder: 'newest'
    }
  })

  // Get collection type from URL params
  const collectionType = searchParams.get('type') || 'recent';
  const categoryName = searchParams.get('category') || '';

  useEffect(() => {
    const handleStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };
    
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    handleStatusChange(); // Set initial state
    
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  // Collection of genres for filter (would ideally come from API)
  // const genres = [
  //   t('allGenres'), 
  //   t('genres.fiction'), 
  //   t('genres.nonFiction'), 
  //   t('genres.thriller'), 
  //   t('genres.sciFi'), 
  //   t('genres.selfHelp'), 
  //   t('genres.memoir'), 
  //   t('genres.historicalFiction'), 
  //   t('genres.finance')
  // ];
  
  // Collection of narrators for filter (would ideally come from API)
  // const narrators = [
  //   t('allNarrators'), 
  //   'James Clear', 
  //   'Ray Porter', 
  //   'Carey Mulligan', 
  //   'Matthew McConaughey', 
  //   'Julia Whelan', 
  //   'Chris Hill', 
  //   'Cassandra Campbell', 
  //   'Jack Hawkins'
  // ];

   useEffect(() => {
const initFilterOptions = async () => {
  try {
    // Try to load from cache
    const cachedOptions = await idb.getCachedFilterOptions()
    if (cachedOptions) {
      setFilterOptions(cachedOptions)
      setGenres([t('allGenres'), ...(cachedOptions.genres || [])])
      setNarrators([t('allNarrators'), ...(cachedOptions.narrators || [])])
    }

    // Fetch fresh options if online
    if (!isOffline) {
      const response = await authApiHelper.get('/books-info/filter-options')
      if (response?.ok) {
        const data = await response.json()
        const updatedOptions = {
          genres: data.genres || [],
          narrators: data.narrators || [],
          dateFilters: data.dateFilters || [],
          sortOptions: data.sortOptions || [],
          defaults: data.defaults || filterOptions.defaults
        }
        
        setFilterOptions(updatedOptions)
        setGenres([t('allGenres'), ...updatedOptions.genres])
        setNarrators([t('allNarrators'), ...updatedOptions.narrators])
        
        await idb.cacheFilterOptions(updatedOptions)
      }
    }
  } catch (err) {
    console.error('Error loading filter options:', err)
  }
}

    initFilterOptions();
  }, [t, isOffline]);

  const handleGenreChange = (genre: string) => {
  setSelectedGenre(genre)
  setCurrentPage(1)
}

const handleNarratorChange = (narrator: string) => {
  setSelectedNarrator(narrator)
  setCurrentPage(1)
}

const handleDateFilterChange = (filter: string) => {
  setSelectedDateFilter(filter)
  setCurrentPage(1)
}

  const generateCacheKey = useCallback(() => {
    return `${collectionType}-${categoryName}-${currentPage}-${searchQuery}-${selectedGenre}-${selectedNarrator}-${selectedDateFilter}`;
  }, [collectionType, categoryName, currentPage, searchQuery, selectedGenre, selectedNarrator, selectedDateFilter]);

  // Fetch audiobooks based on collection type
  const fetchAudiobooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cacheKey = generateCacheKey();

      // First try to load from cache
      let cachedData = null;
      try {
        cachedData = await idb.getCachedAudiobookList(cacheKey);
      } catch (cacheError) {
        console.log('Cache access error:', cacheError);
      }
      if (cachedData && isOffline) {
        setAudiobooks(cachedData.books);
        setTotalBooks(cachedData.total);
        return;
      }

      // Try to fetch fresh data if online
      if (!isOffline) {
        let endpoint = '';
        let queryParams = `page=${currentPage}&limit=8&includeDetails=true`;

        // Add filters to query params
        if (searchQuery) queryParams += `&search=${searchQuery}`;
        if (selectedGenre !== t('allGenres')) queryParams += `&category=${selectedGenre}`;
        if (selectedNarrator !== t('allNarrators')) queryParams += `&narrator=${selectedNarrator}`;
        if (selectedDateFilter !== 'any') {
          const dateFilterMap: Record<string, string> = {
            'last-week': '7',
            'last-month': '30',
            'last-three-months': '90',
            'last-year': '365'
          };
          queryParams += `&days=${dateFilterMap[selectedDateFilter]}`;
        }

        // Determine endpoint based on collection type
        switch (collectionType) {
          case 'recent':
            endpoint = `/books-info/recent?${queryParams}`;
            break;
          case 'popular':
            endpoint = `/books-info/popular?${queryParams}`;
            break;
          case 'top-rated':
            endpoint = `/books-info/top-rated?${queryParams}`;
            break;
          case 'category':
            endpoint = `/books-info/category/${categoryName}?${queryParams}`;
            break;
          case 'new-releases':
            endpoint = `/books-info/new-releases?${queryParams}`;
            break;
          case 'featured':
            endpoint = `/books-info/featured?${queryParams}`;
            break;
          default:
            endpoint = `/books-info/recent?${queryParams}`;
        }

        const response = await authApiHelper.get(endpoint);
        if (!response?.ok) {
          throw new Error(t('errors.fetchFailed'));
        }

        const data = await response.json();
        
        // Handle different response structures
        let books = data.books || data;
        let total = data.total || books.length;

        // Update state
        setAudiobooks(books);
        setTotalBooks(total);

        // Cache the data
        try {
          await idb.cacheAudiobookList(cacheKey, {
            books,
            total
          });
        } catch (cacheError) {
          console.error('Failed to cache audiobook list:', cacheError);
        }
      } else if (!cachedData) {
        // No cached data available offline
        setError(t('errors.offlineNoData'));
        setAudiobooks([]);
        setTotalBooks(0);
      }
    } catch (err) {
      console.error('Error fetching audiobooks:', err);
      setError(err instanceof Error ? err.message : t('errors.loadFailed'));
      
      // Try to load from cache even if error occurred
      const cacheKey = generateCacheKey();
      const cachedData = await idb.getCachedAudiobookList(cacheKey);
      if (cachedData) {
        setAudiobooks(cachedData.books);
        setTotalBooks(cachedData.total);
      }
    } finally {
      setLoading(false);
    }
  }, [
    collectionType, 
    categoryName, 
    currentPage, 
    searchQuery, 
    selectedGenre, 
    selectedNarrator, 
    selectedDateFilter,
    t,
    isOffline,
    generateCacheKey
  ]);

  // Fetch audiobooks when component mounts or filters change
  useEffect(() => {
    fetchAudiobooks();
  }, [fetchAudiobooks]);

  // Get collection title based on type
  const getCollectionTitle = () => {
    switch (collectionType) {
      case 'recent':
        return t('collectionTitles.recentlyAdded');
      case 'popular':
        return t('collectionTitles.mostPopular');
      case 'top-rated':
        return t('collectionTitles.topRated');
      case 'category':
        return t('collectionTitles.categoryAudiobooks', { category: categoryName });
      case 'new-releases':
        return t('collectionTitles.newReleases');
      case 'featured':
        return t('collectionTitles.featuredAudiobooks');
      case 'est-of-the-year':
        return t('collectionTitles.bestOfYear', { year: '2025' });
      case 'staff-picks':
        return t('collectionTitles.staffPicks');
      case 'award-winners':
        return t('collectionTitles.awardWinners');
      case 'hidden-gems':
        return t('collectionTitles.hiddenGems');
      default:
        return t('collectionTitles.default');
    }
  };

  // Format duration from seconds to HH:MM:SS or MM:SS
  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{t('errors.errorLoadingContent')}</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchAudiobooks}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {t('buttons.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:bg-gray-50 min-h-screen">
      {isOffline && (
        <div className={`p-2 text-center text-sm ${theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'}`}>
          {t('offline.message')} - {t('offline.showingCachedData')}
        </div>
      )}

      {/* Header with title and back button */}
      <header className="md:bg-white md:shadow">
        <div className="container mx-auto md:px-4 md:py-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getCollectionTitle()}</h1>
              <p className="text-gray-600 mt-1">{t('discover')}</p>
            </div>
            <div>
              <button 
                onClick={() => window.history.back()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                {t('buttons.back')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and filter bar */}
      <div className="md:bg-white border-b">
        <div className="container mx-auto md:px-4 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            {/* Search bar */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
            </div>

            {/* Sort and filter options */}
            <div className="flex space-x-4">
              {/* Sort dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 border border-gray-300 rounded-md px-4 py-2 bg-white hover:bg-gray-50"
                  onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                >
                  <span>{t('sort.sortBy')}</span>
                  {sortOrder === 'newest' ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronUp className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Filter button */}
              <button 
                className="flex items-center space-x-2 border border-gray-300 rounded-md px-4 py-2 bg-white hover:bg-gray-50"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="h-4 w-4" />
                <span>{t('filter.filterLabel')}</span>
                {filterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <FilterPanel
            isOpen={filterOpen}
            genres={genres}
            narrators={narrators}
            selectedGenre={selectedGenre}
            selectedNarrator={selectedNarrator}
            selectedDateFilter={selectedDateFilter}
            onGenreChange={handleGenreChange}
            onNarratorChange={handleNarratorChange}
            onDateFilterChange={handleDateFilterChange}
            filterOptions={filterOptions}
            t={t}
          />

          {/* Expanded filter panel */}
          {/* {filterOpen && (
            <div className="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Genre filter *
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">{t('filter.genre')}</h3>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedGenre}
                  onChange={(e) => {
                    setSelectedGenre(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              {/* Narrator filter *
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">{t('filter.narrator')}</h3>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedNarrator}
                  onChange={(e) => {
                    setSelectedNarrator(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {narrators.map((narrator) => (
                    <option key={narrator} value={narrator}>{narrator}</option>
                  ))}
                </select>
              </div>

              {/* Release date filter *
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">{t('filter.releaseDate')}</h3>
                <div className="flex space-x-2">
                  <select 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedDateFilter}
                    onChange={(e) => {
                      setSelectedDateFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="any">{t('filter.dateOptions.any')}</option>
                    <option value="last-week">{t('filter.dateOptions.lastWeek')}</option>
                    <option value="last-month">{t('filter.dateOptions.lastMonth')}</option>
                    <option value="last-three-months">{t('filter.dateOptions.lastThreeMonths')}</option>
                    <option value="last-year">{t('filter.dateOptions.lastYear')}</option>
                  </select>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>

      {/* Results count and view toggle */}
      <div className="container mx-auto md:px-4 py-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            {totalBooks} {totalBooks === 1 ? t('results.audiobook') : t('results.audiobooks')} {t('results.found')}
            {selectedGenre !== t('allGenres') ? ` ${t('results.in')} ${selectedGenre}` : ''}
          </p>
          <div className="flex space-x-2">
            {/* View toggle buttons would go here */}
          </div>
        </div>
      </div>

      {/* Audiobooks grid */}
      <div className="container mx-auto md:px-4 md:py-6 ">
        {audiobooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">{t('noResults.title')}</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {t('noResults.message')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audiobooks.map((book, index:number) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination - only show if there are multiple pages */}
      {totalBooks > 8 && (
        <div className="container mx-auto md:px-4 md:py-8 py-4">
          <div className="flex justify-center">
            <nav className="flex items-center space-x-2">
              <button 
                className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                {t('pagination.previous')}
              </button>
              
              {/* Always show first page */}
              <button 
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                onClick={() => handlePageChange(1)}
              >
                1
              </button>

              {/* Show current page and nearby pages */}
              {currentPage > 2 && (
                <span className="px-2 text-gray-500">...</span>
              )}

              {currentPage > 1 && currentPage < Math.ceil(totalBooks / 8) && (
                <button 
                  className="px-3 py-1 bg-indigo-600 text-white rounded-md"
                >
                  {currentPage}
                </button>
              )}

              {currentPage < Math.ceil(totalBooks / 8) - 1 && (
                <span className="px-2 text-gray-500">...</span>
              )}

              {/* Always show last page if there are enough items */}
              {Math.ceil(totalBooks / 8) > 1 && (
                <button 
                  className={`px-3 py-1 rounded-md ${currentPage === Math.ceil(totalBooks / 8) ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                  onClick={() => handlePageChange(Math.ceil(totalBooks / 8))}
                >
                  {Math.ceil(totalBooks / 8)}
                </button>
              )}

              <button 
                className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === Math.ceil(totalBooks / 8)}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                {t('pagination.next')}
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ViewListPage () {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewListContent />
    </Suspense>
  )
}