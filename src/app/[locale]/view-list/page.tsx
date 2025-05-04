'use client'
import { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Clock, Star, BookOpen } from 'lucide-react';

export default function AudiobookCollectionView() {
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Sample data for audiobooks
  const audiobooks = [
    {
      id: 1,
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      narrator: 'Jack Hawkins',
      coverImage: '/api/placeholder/250/400',
      duration: '8h 43m',
      rating: 4.6,
      genre: 'Thriller',
      releaseDate: 'Apr 27, 2025',
    },
    {
      id: 2,
      title: 'Atomic Habits',
      author: 'James Clear',
      narrator: 'James Clear',
      coverImage: '/api/placeholder/250/400',
      duration: '5h 35m',
      rating: 4.8,
      genre: 'Self-Help',
      releaseDate: 'Apr 15, 2025',
    },
    {
      id: 3,
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      narrator: 'Ray Porter',
      coverImage: '/api/placeholder/250/400',
      duration: '16h 10m',
      rating: 4.9,
      genre: 'Sci-Fi',
      releaseDate: 'Apr 10, 2025',
    },
    {
      id: 4,
      title: 'The Midnight Library',
      author: 'Matt Haig',
      narrator: 'Carey Mulligan',
      coverImage: '/api/placeholder/250/400',
      duration: '8h 50m',
      rating: 4.2,
      genre: 'Fiction',
      releaseDate: 'Mar 30, 2025',
    },
    {
      id: 5,
      title: 'Greenlights',
      author: 'Matthew McConaughey',
      narrator: 'Matthew McConaughey',
      coverImage: '/api/placeholder/250/400',
      duration: '6h 42m',
      rating: 4.5,
      genre: 'Memoir',
      releaseDate: 'Mar 22, 2025',
    },
    {
      id: 6,
      title: 'The Four Winds',
      author: 'Kristin Hannah',
      narrator: 'Julia Whelan',
      coverImage: '/api/placeholder/250/400',
      duration: '15h 2m',
      rating: 4.4,
      genre: 'Historical Fiction',
      releaseDate: 'Mar 15, 2025',
    },
    {
      id: 7,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      narrator: 'Chris Hill',
      coverImage: '/api/placeholder/250/400',
      duration: '5h 48m',
      rating: 4.7,
      genre: 'Finance',
      releaseDate: 'Mar 5, 2025',
    },
    {
      id: 8,
      title: 'Where the Crawdads Sing',
      author: 'Delia Owens',
      narrator: 'Cassandra Campbell',
      coverImage: '/api/placeholder/250/400',
      duration: '12h 12m',
      rating: 4.8,
      genre: 'Fiction',
      releaseDate: 'Feb 28, 2025',
    },
  ];

  // Collection of genres for filter
  const genres = ['All Genres', 'Fiction', 'Non-Fiction', 'Thriller', 'Sci-Fi', 'Self-Help', 'Memoir', 'Historical Fiction', 'Finance'];
  
  // Collection of narrators for filter
  const narrators = ['All Narrators', 'James Clear', 'Ray Porter', 'Carey Mulligan', 'Matthew McConaughey', 'Julia Whelan', 'Chris Hill', 'Cassandra Campbell', 'Jack Hawkins'];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with title and back button */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recently Released</h1>
              <p className="text-gray-600 mt-1">Discover our latest audiobook additions</p>
            </div>
            <div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                Back
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and filter bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            {/* Search bar */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search by title, author, or narrator"
              />
            </div>

            {/* Sort and filter options */}
            <div className="flex space-x-4">
              {/* Sort dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 border border-gray-300 rounded-md px-4 py-2 bg-white hover:bg-gray-50"
                  onClick={() => {}}
                >
                  <span>Sort by</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {/* Dropdown content would go here */}
              </div>

              {/* Filter button */}
              <button 
                className="flex items-center space-x-2 border border-gray-300 rounded-md px-4 py-2 bg-white hover:bg-gray-50"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {filterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Expanded filter panel */}
          {filterOpen && (
            <div className="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Genre filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Genre</h3>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              {/* Narrator filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Narrator</h3>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  {narrators.map((narrator) => (
                    <option key={narrator} value={narrator}>{narrator}</option>
                  ))}
                </select>
              </div>

              {/* Release date filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Release date</h3>
                <div className="flex space-x-2">
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="any">Any time</option>
                    <option value="last-week">Last week</option>
                    <option value="last-month">Last month</option>
                    <option value="last-three-months">Last 3 months</option>
                    <option value="last-year">Last year</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results count and view toggle */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">{audiobooks.length} audiobooks found</p>
          <div className="flex space-x-2">
            {/* View toggle buttons would go here */}
          </div>
        </div>
      </div>

      {/* Audiobooks grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {audiobooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
              {/* Book cover */}
              <div className="relative pb-[150%]">
                <img 
                  src={book.coverImage} 
                  alt={`${book.title} cover`} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              {/* Book info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                <p className="text-xs text-gray-500 mt-1">Narrated by {book.narrator}</p>
                
                {/* Details row */}
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{book.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-500" />
                    <span>{book.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">3</button>
            <span className="px-2 text-gray-500">...</span>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">10</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">Next</button>
          </nav>
        </div>
      </div>
    </div>
  );
}