'use client'
import { useState, useEffect, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  Headphones, 
  Clock, 
  Award, 
  BookOpen, 
  Star, 
  TrendingUp, 
  Heart,
  PlayCircle,
  Calendar,
  RefreshCw
} from 'lucide-react';
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
  publishedDate?: string;
  summary?: string;
  isNew?: boolean;
  isTrending?: boolean;
}

interface Collection {
  title: string;
  description?: string;
  books: Audiobook[];
  icon: JSX.Element;
}

export default function DiscoverView() {
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');

  useEffect(() => {
    const fetchDiscoverData = async () => {
      try {
        const response = await authApiHelper.get('/discover');
        if (response?.ok) {
          const data = await response.json();
          
          // Transform the data into collections with icons
          const formattedCollections: Collection[] = [
            {
              title: 'Featured This Week',
              description: "Handpicked titles that we think you'll love",
              books: data.featured || [],
              icon: <Award size={20} className="text-amber-500" />
            },
            {
              title: 'New Releases',
              description: 'Fresh titles just added to our library',
              books: data.newReleases || [],
              icon: <Calendar size={20} className="text-green-500" />
            },
            {
              title: 'Trending Now',
              description: 'What everyone is listening to this week',
              books: data.trending || [],
              icon: <TrendingUp size={20} className="text-red-500" />
            },
            {
              title: 'Recommended For You',
              description: 'Based on your listening history',
              books: data.recommended || [],
              icon: <Heart size={20} className="text-pink-500" />
            },
            {
              title: 'Staff Picks',
              description: "Our team's favorite audiobooks",
              books: data.staffPicks || [],
              icon: <Star size={20} className="text-purple-500" />
            },
            {
              title: 'Popular in Fiction',
              books: data.popularFiction || [],
              icon: <BookOpen size={20} className="text-blue-500" />
            },
            {
              title: 'Popular in Non-Fiction',
              books: data.popularNonFiction || [],
              icon: <BookOpen size={20} className="text-indigo-500" />
            }
          ];

          // Filter out empty collections
          const validCollections = formattedCollections.filter(collection => 
            collection.books && collection.books.length > 0
          );
          
          setCollections(validCollections);
        }
      } catch (err) {
        console.error('Failed to fetch discover data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscoverData();
  }, []);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const navigateToBook = (bookId: string) => {
    router.push(`/book/${bookId}`);
  };

  const navigateToSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const tabOptions = [
    { id: 'featured', label: 'Featured', icon: <Award size={16} /> },
    { id: 'trending', label: 'Trending', icon: <TrendingUp size={16} /> },
    { id: 'new', label: 'New', icon: <Calendar size={16} /> },
    { id: 'recommended', label: 'For You', icon: <Heart size={16} /> }
  ];

  // For the carousel component
  const BookCarousel = ({ books }: { books: Audiobook[] }) => {
    return (
      <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
        {books.map((book) => (
          <div 
            key={book._id} 
            className="flex-shrink-0 w-32 md:w-40 snap-start cursor-pointer"
            onClick={() => navigateToBook(book._id)}
          >
            <div className="relative aspect-[2/3] mb-2">
              <img 
                src={book.coverImage || '/default-book-cover.jpg'} 
                alt={book.title} 
                className="w-full h-full object-cover rounded-lg shadow-md"
                loading="lazy"
              />
              {book.isNew && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  NEW
                </span>
              )}
              {book.isTrending && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  🔥
                </span>
              )}
              <div className="absolute inset-0 bg-black/30 rounded-lg opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <PlayCircle size={40} className="text-white" />
              </div>
            </div>
            <h4 className="font-medium text-sm truncate">{book.title}</h4>
            <p className="text-xs text-gray-600 truncate">{book.author}</p>
            {book.averageRating && (
              <div className="flex items-center text-xs mt-1">
                <Star size={12} className="fill-amber-400 text-amber-400 mr-1" />
                <span>{book.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // For the horizontal row of featured books
  const FeaturedRow = ({ books }: { books: Audiobook[] }) => {
    return (
      <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x">
        {books.slice(0, 5).map((book, index) => (
          <div 
            key={book._id}
            className="flex-shrink-0 w-full sm:w-80 snap-start cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
            onClick={() => navigateToBook(book._id)}
          >
            <div className="flex p-4 gap-4">
              <div className="relative flex-shrink-0">
                <img 
                  src={book.coverImage || '/default-book-cover.jpg'} 
                  alt={book.title} 
                  className="w-20 h-28 object-cover rounded-lg shadow-md"
                  loading="lazy"
                />
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1 rounded-full shadow-md">
                  <Headphones size={14} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-base text-gray-800 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-600 truncate">{book.author}</p>
                {book.narrator && (
                  <p className="text-xs text-gray-500 truncate mt-1">Narrated by: {book.narrator}</p>
                )}
                <div className="flex flex-wrap items-center mt-2 gap-2">
                  {book.averageRating && (
                    <span className="flex items-center text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">
                      <Star size={10} className="mr-1" /> {book.averageRating.toFixed(1)}
                    </span>
                  )}
                  {book.duration && (
                    <span className="flex items-center text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                      <Clock size={10} className="mr-1" /> {formatDuration(book.duration)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {book.summary && (
              <div className="px-4 pb-4 text-xs text-gray-600 line-clamp-2">
                {book.summary}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-indigo-600 font-medium">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800">
      {/* Header with tabs */}
      <div className="sticky top-0 backdrop-blur-lg bg-white/95 shadow-md z-10 pt-4 pb-2 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-indigo-800">Discover</h1>
            <button 
              onClick={() => router.push('/search')}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1"
            >
              <span>Search</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto md:justify-center scrollbar-hide">
            {tabOptions.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white hover:bg-indigo-100 text-gray-700 border border-gray-200'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
            <button 
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-white hover:bg-indigo-100 text-gray-700 border border-gray-200 transition-all"
              onClick={() => {
                // Refresh recommendations logic
                setLoading(true);
                setTimeout(() => setLoading(false), 1000);
              }}
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured banner at the top */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-8 px-6 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="flex-1">
              <div className="mb-2 text-indigo-200 text-sm font-medium">FEATURED COLLECTION</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Summer Reading Challenge</h2>
              <p className="md:text-lg mb-6 text-indigo-100">Listen to five books this summer and earn exclusive rewards and badges.</p>
              <button className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-full px-6 py-2 md:py-3 font-medium shadow-lg hover:shadow-xl transition-all">
                Join Challenge
              </button>
            </div>
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative w-full max-w-xs">
                <div className="absolute -top-4 -left-4 transform rotate-12 z-20">
                  <img 
                    src="/api/placeholder/120/170" 
                    alt="Featured book cover" 
                    className="rounded-lg shadow-lg" 
                  />
                </div>
                <div className="absolute top-4 left-16 transform -rotate-6 z-10">
                  <img 
                    src="/api/placeholder/120/170" 
                    alt="Featured book cover" 
                    className="rounded-lg shadow-lg" 
                  />
                </div>
                <div className="absolute top-12 left-36 transform rotate-3">
                  <img 
                    src="/api/placeholder/120/170" 
                    alt="Featured book cover" 
                    className="rounded-lg shadow-lg" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 container mx-auto max-w-6xl px-4 py-6">
        {/* Top featured books */}
        {collections.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                {collections[0].icon}
                <span>{collections[0].title}</span>
              </h2>
              <button 
                onClick={() => navigateToSearch(collections[0].title)}
                className="text-indigo-600 text-sm flex items-center hover:underline"
              >
                See all <ChevronRight size={16} />
              </button>
            </div>
            {collections[0].books.length > 0 && (
              <FeaturedRow books={collections[0].books} />
            )}
          </div>
        )}

        {/* Quick categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['Fiction', 'Non-Fiction', 'Fantasy', 'Mystery', 'Romance', 'Biography'].map((category) => (
              <button 
                key={category}
                className="bg-white p-4 rounded-xl text-center hover:shadow-md transition-all border border-gray-100 hover:border-indigo-200 relative overflow-hidden group"
                onClick={() => navigateToSearch(category)}
              >
                <div className="relative z-10">
                  <BookOpen size={24} className="mx-auto mb-2 text-indigo-600" />
                  <h4 className="font-medium text-gray-800">{category}</h4>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Rest of the collections */}
        {collections.slice(1).map((collection, index) => (
          <div key={collection.title} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  {collection.icon}
                  <span>{collection.title}</span>
                </h2>
                {collection.description && (
                  <p className="text-sm text-gray-600 mt-1">{collection.description}</p>
                )}
              </div>
              <button 
                onClick={() => navigateToSearch(collection.title)}
                className="text-indigo-600 text-sm flex items-center hover:underline"
              >
                See all <ChevronRight size={16} />
              </button>
            </div>
            {collection.books.length > 0 && (
              <BookCarousel books={collection.books} />
            )}
          </div>
        ))}
      </div>

      {/* Empty footer for spacing */}
      <div className="h-16 md:h-8"></div>
    </div>
  );
}