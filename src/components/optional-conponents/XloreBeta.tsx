import { useState } from 'react';
import { Search, BookOpen, ChevronRight, Clock, Play, Headphones, Bookmark, Music, Star, User, Home, Library, Compass } from 'lucide-react';

export default function AlternativeAudiobookExplorePage() {
  const [activeTab, setActiveTab] = useState('discover');
  
  const newReleases = [
    { id: 1, title: 'The Midnight Library', author: 'Matt Haig', cover: '/api/placeholder/300/450', genre: 'Fiction', duration: '8h 50m' },
    { id: 2, title: 'Atomic Habits', author: 'James Clear', cover: '/api/placeholder/300/450', genre: 'Self-Help', duration: '5h 35m' },
    { id: 3, title: 'Project Hail Mary', author: 'Andy Weir', cover: '/api/placeholder/300/450', genre: 'Sci-Fi', duration: '16h 10m' },
    { id: 4, title: 'The Hill We Climb', author: 'Amanda Gorman', cover: '/api/placeholder/300/450', genre: 'Poetry', duration: '2h 05m' },
  ];
  
  const topLists = [
    { title: 'Best of 2025', description: 'Top-rated titles this year', color: 'bg-emerald-500' },
    { title: 'Staff Picks', description: 'Curated by our editors', color: 'bg-purple-500' },
    { title: 'Award Winners', description: 'Recognized excellence', color: 'bg-amber-500' },
    { title: 'Hidden Gems', description: 'Undiscovered treasures', color: 'bg-pink-500' },
  ];
  
  const featuredAuthors = [
    { name: 'Michelle Obama', count: 3, image: '/api/placeholder/100/100' },
    { name: 'Stephen King', count: 42, image: '/api/placeholder/100/100' },
    { name: 'Brené Brown', count: 7, image: '/api/placeholder/100/100' },
    { name: 'Neil Gaiman', count: 15, image: '/api/placeholder/100/100' },
  ];
  
  const recentlyPlayed = [
    { id: 5, title: 'A Promised Land', author: 'Barack Obama', cover: '/api/placeholder/300/450', progress: 65 },
    { id: 6, title: 'Dune', author: 'Frank Herbert', cover: '/api/placeholder/300/450', progress: 23 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="p-4 bg-gray-800 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">SoundPage</h1>
          <div className="flex space-x-3">
            <button className="p-2 rounded-full bg-gray-700 text-gray-300">
              <Search size={18} />
            </button>
            <button className="p-2 rounded-full bg-gray-700 text-gray-300">
              <User size={18} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <section className="px-4 py-6">
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 opacity-70"></div>
            <img 
              src="/api/placeholder/800/400" 
              alt="Hero audiobook" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <span className="text-xs font-semibold px-2 py-1 bg-purple-500 rounded-full w-fit mb-2">FEATURED</span>
              <h2 className="text-xl font-bold mb-1">Becoming Free Indeed</h2>
              <p className="text-sm opacity-90 mb-3">By Jinger Duggar Vuolo</p>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-medium flex items-center">
                  <Play size={16} className="mr-1" /> Listen Now
                </button>
                <button className="p-2 bg-gray-800 bg-opacity-60 rounded-full">
                  <Bookmark size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* New Releases */}
        <section className="px-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">New Releases</h2>
            <button className="text-sm text-purple-400 flex items-center">
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-2">
              {newReleases.map((book) => (
                <div key={book.id} className="w-32 flex-shrink-0">
                  <div className="relative rounded-lg overflow-hidden aspect-[2/3] mb-2 shadow-lg">
                    <img src={book.cover} alt={book.title} className="object-cover w-full h-full" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-2 px-2">
                      <div className="flex items-center text-xs">
                        <Clock size={10} className="mr-1" />
                        <span>{book.duration}</span>
                      </div>
                    </div>
                    <button className="absolute top-2 right-2 h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center opacity-90">
                      <Play size={14} />
                    </button>
                  </div>
                  <h3 className="font-medium text-sm line-clamp-1">{book.title}</h3>
                  <p className="text-xs text-gray-400">{book.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Collections */}
        <section className="px-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Curated Collections</h2>
            <button className="text-sm text-purple-400 flex items-center">
              Explore <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {topLists.map((list) => (
              <div key={list.title} className="relative overflow-hidden rounded-lg shadow-lg">
                <div className={`absolute inset-0 ${list.color} opacity-90`}></div>
                <div className="relative p-4">
                  <h3 className="font-bold mb-1">{list.title}</h3>
                  <p className="text-xs opacity-90 mb-3">{list.description}</p>
                  <button className="text-xs font-medium bg-black bg-opacity-30 px-3 py-1 rounded-full">
                    View List
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Featured Authors */}
        <section className="px-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Featured Authors</h2>
            <button className="text-sm text-purple-400 flex items-center">
              See All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-2">
              {featuredAuthors.map((author) => (
                <div key={author.name} className="flex-shrink-0 w-24 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500 mb-2">
                    <img src={author.image} alt={author.name} className="object-cover w-full h-full" />
                  </div>
                  <h3 className="text-sm font-medium text-center line-clamp-1">{author.name}</h3>
                  <p className="text-xs text-gray-400">{author.count} books</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Continue Listening */}
        <section className="px-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Continue Listening</h2>
            <button className="text-sm text-purple-400 flex items-center">
              History <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            {recentlyPlayed.map((book) => (
              <div key={book.id} className="flex items-center bg-gray-800 rounded-lg p-3 shadow-lg">
                <div className="w-12 h-16 rounded overflow-hidden mr-3 flex-shrink-0">
                  <img src={book.cover} alt={book.title} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm mb-1">{book.title}</h3>
                  <p className="text-xs text-gray-400 mb-2">{book.author}</p>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${book.progress}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500">{book.progress}% completed</p>
                </div>
                <button className="ml-3 h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <Play size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>
        
        {/* Categories Shelf */}
        <section className="px-4 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Browse Categories</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {['Fiction', 'Mystery', 'Romance', 'History', 'Business', 'Fantasy', 'Horror', 'Comedy'].map((genre) => (
              <button key={genre} className="bg-gray-800 rounded-lg p-3 flex flex-col items-center">
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mb-2">
                  <Music size={14} className="text-purple-400" />
                </div>
                <span className="text-xs text-center">{genre}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="grid grid-cols-4 py-3">
          <button className="flex flex-col items-center text-gray-400">
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center text-purple-400">
            <Compass size={20} />
            <span className="text-xs mt-1">Explore</span>
          </button>
          <button className="flex flex-col items-center text-gray-400">
            <Library size={20} />
            <span className="text-xs mt-1">Library</span>
          </button>
          <button className="flex flex-col items-center text-gray-400">
            <Headphones size={20} />
            <span className="text-xs mt-1">Player</span>
          </button>
        </div>
      </nav>
    </div>
  );
}