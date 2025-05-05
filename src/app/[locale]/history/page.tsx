'use client'
import { useState, useEffect } from 'react';
import { Clock, Play, Calendar, Book, Search, ChevronDown, Filter, List, Grid } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authApiHelper } from '@/app/utils/api';
import { Book as BookType } from '../page';

interface HistoryItem {
  _id: string;
  audiobook: BookType;
  progress: number;
  lastListened: Date;
}

export default function ListeningHistory() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    completed: false,
    inProgress: false,
    notStarted: false,
    fiction: false,
    nonFiction: false
  });
  const [sortOption, setSortOption] = useState('recent');
  const [stats, setStats] = useState({
    totalBooks: 0,
    listeningTime: 0,
    currentStreak: 0
  });

  // Fetch listening history
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApiHelper.get('/users/history');
      
      if (!response?.ok) {
        throw new Error('Failed to fetch listening history');
      }
      
      const data = await response.json();
      setHistory(data);
      setFilteredHistory(data);
      
      // Calculate stats
      calculateStats(data);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (historyData: HistoryItem[]) => {
    const totalBooks = historyData.length;
    const listeningTime = historyData.reduce((sum, item) => {
      return sum + (item.audiobook.duration * (item.progress / 100));
    }, 0);
    
    // Simple streak calculation (would need more logic in a real app)
    const sortedByDate = [...historyData].sort((a, b) => 
      new Date(b.lastListened).getTime() - new Date(a.lastListened).getTime()
    );
    
    let currentStreak = 0;
    if (sortedByDate.length > 0) {
      const today = new Date();
      const lastListenDate = new Date(sortedByDate[0].lastListened);
      const diffTime = today.getTime() - lastListenDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        currentStreak = 1;
        // Would need more logic to calculate actual streak
      }
    }
    
    setStats({
      totalBooks,
      listeningTime,
      currentStreak
    });
  };

  // Apply filters and search
  const applyFilters = () => {
    let result = [...history];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.audiobook.title.toLowerCase().includes(query) ||
        item.audiobook.author.toLowerCase().includes(query) ||
        item.audiobook.narrator.toLowerCase().includes(query)
      );
    }
    
    // Apply progress filters
    if (filters.completed || filters.inProgress || filters.notStarted) {
      result = result.filter(item => {
        if (filters.completed && item.progress === 100) return true;
        if (filters.inProgress && item.progress > 0 && item.progress < 100) return true;
        if (filters.notStarted && item.progress === 0) return true;
        return false;
      });
    }
    
    // Apply genre filters
    if (filters.fiction || filters.nonFiction) {
      result = result.filter(item => {
        const category = item.audiobook.category?.toLowerCase() || '';
        if (filters.fiction && category.includes('fiction')) return true;
        if (filters.nonFiction && category.includes('non-fiction')) return true;
        return false;
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'progress':
          return b.progress - a.progress;
        case 'title':
          return a.audiobook.title.localeCompare(b.audiobook.title);
        case 'author':
          return a.audiobook.author.localeCompare(b.audiobook.author);
        case 'recent':
        default:
          return new Date(b.lastListened).getTime() - new Date(a.lastListened).getTime();
      }
    });
    
    setFilteredHistory(result);
    calculateStats(result);
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

  // Format time since last listened
  const formatTimeSince = (date: Date) => {
    const now = new Date();
    const lastListened = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - lastListened.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return lastListened.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Calculate time left
  const getTimeLeft = (duration: number, progress: number) => {
    const remainingSeconds = duration * (1 - (progress / 100));
    return formatDuration(remainingSeconds);
  };

  // Handle filter toggle
  const toggleFilter = (filterName: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Fetch data on component mount
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, sortOption, history]);

  if (loading) {
    return (
      <main className="container mx-auto p-6 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading History</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchHistory}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto md:p-6 pb-16 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Your Listening History</h2>
        {/* <div className="flex space-x-3">
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
        </div> */}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4 text-indigo-600"
                        checked={filters.completed}
                        onChange={() => toggleFilter('completed')}
                      />
                      <span className="ml-2 text-sm">Completed</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4 text-indigo-600"
                        checked={filters.inProgress}
                        onChange={() => toggleFilter('inProgress')}
                      />
                      <span className="ml-2 text-sm">In Progress</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4 text-indigo-600"
                        checked={filters.notStarted}
                        onChange={() => toggleFilter('notStarted')}
                      />
                      <span className="ml-2 text-sm">Not Started</span>
                    </label>
                    <hr className="my-2" />
                    <h3 className="font-medium mb-2">Genre</h3>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4 text-indigo-600"
                        checked={filters.fiction}
                        onChange={() => toggleFilter('fiction')}
                      />
                      <span className="ml-2 text-sm">Fiction</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4 text-indigo-600"
                        checked={filters.nonFiction}
                        onChange={() => toggleFilter('nonFiction')}
                      />
                      <span className="ml-2 text-sm">Non-Fiction</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <select 
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 appearance-none"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="recent">Sort: Recent</option>
            <option value="progress">Sort: Progress</option>
            <option value="title">Sort: Title</option>
            <option value="author">Sort: Author</option>
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
            <p className="text-2xl font-bold">{stats.totalBooks}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Clock size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Listening Time</p>
            <p className="text-2xl font-bold">{formatDuration(stats.listeningTime)}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <Calendar size={24} className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Streak</p>
            <p className="text-2xl font-bold">{stats.currentStreak} days</p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filteredHistory.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <Book size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No listening history found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {searchQuery || Object.values(filters).some(Boolean) 
              ? "Try adjusting your search or filters"
              : "Your listening history will appear here as you listen to audiobooks"}
          </p>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredHistory.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map(item => (
            <div key={item._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="flex">
                <img 
                  src={item.audiobook.coverImage || '/api/placeholder/200/300'} 
                  alt={item.audiobook.title} 
                  className="w-24 h-36 object-cover" 
                />
                <div className="p-4 flex-1">
                  <h3 className="font-bold text-lg line-clamp-1">{item.audiobook.title}</h3>
                  <p className="text-sm text-gray-600">{item.audiobook.author}</p>
                  <p className="text-xs text-gray-500">Narrated by {item.audiobook.narrator}</p>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{item.progress}% complete</span>
                      <span>{getTimeLeft(item.audiobook.duration, item.progress)} left</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          item.progress === 100 ? 'bg-green-500' : 'bg-indigo-600'
                        }`} 
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      <Clock size={12} className="inline mr-1" />
                      {formatTimeSince(item.lastListened)}
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
      {viewMode === 'list' && filteredHistory.length > 0 && (
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
              {filteredHistory.map(item => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded object-cover" src={item.audiobook.coverImage || '/api/placeholder/200/300'} alt={item.audiobook.title} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{item.audiobook.title}</div>
                        <div className="text-xs text-gray-500">Narrated by {item.audiobook.narrator}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.audiobook.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-24">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            item.progress === 100 ? 'bg-green-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDuration(item.audiobook.duration)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {formatTimeSince(item.lastListened)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {item.audiobook.category || 'Uncategorized'}
                    </span>
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
    </main>
  );
}