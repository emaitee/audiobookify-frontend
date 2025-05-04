'use client'
import { useState } from 'react';
import { Clock, Play, Calendar, Book, Search, ChevronDown, Filter, List, Grid } from 'lucide-react';

export default function ListeningHistory() {
  const [viewMode, setViewMode] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Sample listening history data
  const listeningHistory = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      narrator: "Jake Gyllenhaal",
      coverImage: "/api/placeholder/200/300",
      progress: 78,
      lastListened: "2 hours ago",
      duration: "4h 29m",
      timeLeft: "59m",
      genre: "Classic Fiction"
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      narrator: "James Clear",
      coverImage: "/api/placeholder/200/300",
      progress: 45,
      lastListened: "Yesterday",
      duration: "5h 35m",
      timeLeft: "3h 5m",
      genre: "Self Development"
    },
    {
      id: 3,
      title: "Project Hail Mary",
      author: "Andy Weir",
      narrator: "Ray Porter",
      coverImage: "/api/placeholder/200/300",
      progress: 92,
      lastListened: "3 days ago",
      duration: "16h 10m",
      timeLeft: "1h 17m",
      genre: "Science Fiction"
    },
    {
      id: 4,
      title: "Dune",
      author: "Frank Herbert",
      narrator: "Scott Brick",
      coverImage: "/api/placeholder/200/300",
      progress: 12,
      lastListened: "Last week",
      duration: "21h 5m",
      timeLeft: "18h 33m",
      genre: "Science Fiction"
    },
    {
      id: 5,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      narrator: "Chris Hill",
      coverImage: "/api/placeholder/200/300",
      progress: 100,
      lastListened: "2 weeks ago",
      duration: "5h 48m",
      timeLeft: "0m",
      genre: "Finance"
    },
    {
      id: 6,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      narrator: "Andy Serkis",
      coverImage: "/api/placeholder/200/300",
      progress: 67,
      lastListened: "3 weeks ago",
      duration: "10h 25m",
      timeLeft: "3h 26m",
      genre: "Fantasy"
    }
  ];

  return (
  
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Listening History</h2>
          <div className="flex space-x-3">
            <button 
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100'}`}
              onClick={() => setViewMode('list')}
            >
              <List size={20} />
            </button>
            <button 
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={20} />
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search your history"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex space-x-3">
            <div className="relative">
              <button 
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter size={16} />
                <span>Filter</span>
                <ChevronDown size={16} />
              </button>
              
              {filterOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="p-3">
                    <h3 className="font-medium mb-2">Filter By</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                        <span className="ml-2 text-sm">Completed</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                        <span className="ml-2 text-sm">In Progress</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                        <span className="ml-2 text-sm">Not Started</span>
                      </label>
                      <hr className="my-2" />
                      <h3 className="font-medium mb-2">Genre</h3>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                        <span className="ml-2 text-sm">Fiction</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                        <span className="ml-2 text-sm">Non-Fiction</span>
                      </label>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">Apply</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 appearance-none">
              <option>Sort: Recent</option>
              <option>Sort: Progress</option>
              <option>Sort: Title</option>
              <option>Sort: Author</option>
            </select>
          </div>
        </div>

        {/* History Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Book size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Books</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Clock size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Listening Time</p>
              <p className="text-2xl font-bold">152h 34m</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Streak</p>
              <p className="text-2xl font-bold">5 days</p>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listeningHistory.map(book => (
              <div key={book.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="flex">
                  <img src={book.coverImage} alt={book.title} className="w-24 h-36 object-cover" />
                  <div className="p-4 flex-1">
                    <h3 className="font-bold text-lg line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <p className="text-xs text-gray-500">Narrated by {book.narrator}</p>
                    
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{book.progress}% complete</span>
                        <span>{book.timeLeft} left</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full" 
                          style={{ width: `${book.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        <Clock size={12} className="inline mr-1" />
                        {book.lastListened}
                      </span>
                      <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 p-2 rounded-full transition">
                        <Play size={16} className="fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Listened</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {listeningHistory.map(book => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded object-cover" src={book.coverImage} alt={book.title} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                          <div className="text-xs text-gray-500">Narrated by {book.narrator}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-24">
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <span>{book.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${book.progress === 100 ? 'bg-green-500' : 'bg-indigo-600'}`}
                            style={{ width: `${book.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {book.lastListened}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{book.genre}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 px-2">
                        <Play size={16} className="fill-current" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">1</button>
            <button className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50">2</button>
            <button className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50">3</button>
            <span className="text-gray-500">...</span>
            <button className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50">8</button>
            <button className="px-3 py-1 rounded border border-gray-300 text-sm hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      </main>

  );
}