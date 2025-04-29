'use client'
import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Plus, Search, Home, Bookmark, Clock, User, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AudiobookApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(true); // Toggle for admin access
  
  const featuredBooks = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "/api/placeholder/240/320", progress: 65 },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", cover: "/api/placeholder/240/320", progress: 23 },
    { id: 3, title: "1984", author: "George Orwell", cover: "/api/placeholder/240/320", progress: 45 },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", cover: "/api/placeholder/240/320", progress: 12 },
  ];
  
  const continueListing = [
    { id: 5, title: "Dune", author: "Frank Herbert", cover: "/api/placeholder/180/240", progress: 78, remainingTime: "3h 24m" },
    { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", cover: "/api/placeholder/180/240", progress: 30, remainingTime: "6h 12m" },
  ];
  
  const recommendedBooks = [
    { id: 7, title: "Brave New World", author: "Aldous Huxley", cover: "/api/placeholder/200/280" },
    { id: 8, title: "The Catcher in the Rye", author: "J.D. Salinger", cover: "/api/placeholder/200/280" },
    { id: 9, title: "Lord of the Flies", author: "William Golding", cover: "/api/placeholder/200/280" },
  ];
  
  const HomeView = () => (
    <div className="flex flex-col gap-8 pb-24 text-black">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Continue Listening</h2>
          <button className="text-blue-500 text-sm">See All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {continueListing.map(book => (
            <div key={book.id} className="flex-shrink-0 w-64 bg-gray-100 rounded-lg overflow-hidden">
              <div className="relative">
                <img src={book.cover} alt={book.title} className="w-full h-48 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="w-full bg-gray-600 h-1 rounded-full">
                    <div 
                      className="bg-blue-500 h-1 rounded-full" 
                      style={{ width: `${book.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{book.remainingTime} left</span>
                  <button 
                    className="bg-blue-500 text-white rounded-full p-2"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Featured Audiobooks</h2>
          <button className="text-blue-500 text-sm">More</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredBooks.map(book => (
            <div key={book.id} className="relative group">
              <img src={book.cover} alt={book.title} className="w-full h-64 object-cover rounded-lg shadow-md group-hover:opacity-90 transition" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-b-lg">
                <h3 className="text-white font-medium">{book.title}</h3>
                <p className="text-white/80 text-sm">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recommended For You</h2>
          <button className="text-blue-500 text-sm">See All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {recommendedBooks.map(book => (
            <div key={book.id} className="flex-shrink-0 w-48">
              <img src={book.cover} alt={book.title} className="w-full h-56 object-cover rounded-lg shadow-md mb-2" />
              <h3 className="font-medium">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
  
  const AdminView = () => {
    const [activeTab, setActiveTab] = useState('uploads');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showUploadModal, setShowUploadModal] = useState(false);
    
    const pendingApprovals = [
      { id: 'a1', title: "The Great Gatsby", author: "F. Scott Fitzgerald", narrator: "Jake Gyllenhaal", status: "pending", date: "Apr 25, 2025" },
      { id: 'a2', title: "Pride and Prejudice", author: "Jane Austen", narrator: "Rosamund Pike", status: "pending", date: "Apr 24, 2025" },
    ];
    
    const recentUploads = [
      { id: 'b1', title: "The Alchemist", author: "Paulo Coelho", narrator: "Jeremy Irons", status: "approved", date: "Apr 23, 2025" },
      { id: 'b2', title: "To Kill a Mockingbird", author: "Harper Lee", narrator: "Sissy Spacek", status: "approved", date: "Apr 22, 2025" },
      { id: 'b3', title: "The Hobbit", author: "J.R.R. Tolkien", narrator: "Andy Serkis", status: "rejected", date: "Apr 21, 2025", reason: "Audio quality issues" },
    ];
    
    const audioStats = {
      totalBooks: 1245,
      totalHours: 8762,
      pendingApprovals: 7,
      activeUploads: 3
    };
    
    const simulateUpload = () => {
      setUploadProgress(0);
      setShowUploadModal(true);
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 300);
    };
    
    const UploadModal = () => (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-4 text-black">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Uploading Audiobook</h3>
          
          <div className="mb-4">
            <p className="text-sm mb-2">Uploading "The Lord of the Rings"</p>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{uploadProgress}% complete</span>
              <span>{Math.round(uploadProgress * 1.2)} MB / 120 MB</span>
            </div>
          </div>
          
          {uploadProgress < 100 ? (
            <div className="flex justify-end">
              <button 
                className="px-4 py-2 text-red-500"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setShowUploadModal(false)}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    );
    
    return (
      <div className="flex flex-col gap-6 pb-24">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={simulateUpload}
          >
            <Plus size={16} />
            <span>Upload</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-2xl font-bold">{audioStats.totalBooks}</h3>
            <p className="text-sm text-gray-600">Total Books</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-2xl font-bold">{audioStats.totalHours}</h3>
            <p className="text-sm text-gray-600">Hours of Content</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-2xl font-bold">{audioStats.pendingApprovals}</h3>
            <p className="text-sm text-gray-600">Pending Approvals</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-2xl font-bold">{audioStats.activeUploads}</h3>
            <p className="text-sm text-gray-600">Active Uploads</p>
          </div>
        </div>
        
        <div className="border-b flex">
          <button 
            className={`px-4 py-2 ${activeTab === 'uploads' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('uploads')}
          >
            Uploads
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'approvals' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('approvals')}
          >
            Approvals
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'analytics' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
        
        {activeTab === 'uploads' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Recent Uploads</h2>
              <button className="text-blue-500 text-sm">View All</button>
            </div>
            
            <div className="flex flex-col gap-3">
              {recentUploads.map(book => (
                <div key={book.id} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{book.title}</h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      book.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      book.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    By {book.author} • Narrated by {book.narrator}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Uploaded on {book.date}</p>
                  
                  {book.status === 'rejected' && book.reason && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                      Rejection reason: {book.reason}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-3">
                    <button className="text-sm text-blue-500">Edit</button>
                    <button className="text-sm text-gray-500">View Details</button>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-2 border border-gray-300 rounded-lg text-gray-600">
              Load More
            </button>
          </div>
        )}
        
        {activeTab === 'approvals' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Pending Approvals</h2>
              <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">
                {pendingApprovals.length} Pending
              </span>
            </div>
            
            <div className="flex flex-col gap-3">
              {pendingApprovals.map(book => (
                <div key={book.id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{book.title}</h3>
                  <p className="text-sm text-gray-600">
                    By {book.author} • Narrated by {book.narrator}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Submitted on {book.date}</p>
                  
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg">
                      Listen
                    </button>
                    <button className="flex-1 py-2 bg-green-500 text-white rounded-lg">
                      Approve
                    </button>
                    <button className="flex-1 py-2 bg-red-500 text-white rounded-lg">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center text-gray-500 text-sm">
              No more approvals pending
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-4">Upload Statistics</h3>
              <div className="h-40 bg-gray-100 flex items-end justify-around rounded">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                  <div key={month} className="flex flex-col items-center">
                    <div 
                      className="w-8 bg-blue-500 rounded-t" 
                      style={{ height: `${20 + Math.random() * 80}px` }}
                    ></div>
                    <span className="text-xs mt-1">{month}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Popular Categories</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fiction</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-blue-500 h-2 rounded-full w-5/12"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Non-Fiction</span>
                    <span>30%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-blue-500 h-2 rounded-full w-3/12"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fantasy</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-blue-500 h-2 rounded-full w-1.5/12"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mystery</span>
                    <span>10%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-blue-500 h-2 rounded-full w-1/12"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Top Performing Books</h3>
                <button className="text-blue-500 text-sm">See All</button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">1</span>
                  <div>
                    <h4 className="font-medium">The Great Gatsby</h4>
                    <p className="text-sm text-gray-600">8,542 listens</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">2</span>
                  <div>
                    <h4 className="font-medium">To Kill a Mockingbird</h4>
                    <p className="text-sm text-gray-600">7,129 listens</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">3</span>
                  <div>
                    <h4 className="font-medium">1984</h4>
                    <p className="text-sm text-gray-600">6,751 listens</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {showUploadModal && <UploadModal />}
        
        <div className="fixed bottom-20 right-4 shadow-lg bg-white rounded-lg p-4 border">
          <h4 className="font-medium mb-2">Upload Guide</h4>
          <ul className="text-sm space-y-1 list-disc pl-4">
            <li>Audio files must be MP3 format</li>
            <li>Maximum file size: 500MB</li>
            <li>Include chapter markers</li>
            <li>Cover image required (1400×1400)</li>
          </ul>
          <button className="text-blue-500 text-sm mt-2">View Full Requirements</button>
        </div>
      </div>
    );
  };

  const LibraryView = () => (
    <div className="flex flex-col gap-6 pb-24 text-black">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Library</h2>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-gray-100">
            <Search size={20} />
          </button>
          <button className="p-2 rounded-full bg-gray-100">
            <Plus size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex overflow-x-auto gap-2 pb-2">
        <button className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm whitespace-nowrap">
          All Books
        </button>
        <button className="px-4 py-1 bg-gray-200 rounded-full text-sm whitespace-nowrap">
          In Progress
        </button>
        <button className="px-4 py-1 bg-gray-200 rounded-full text-sm whitespace-nowrap">
          Completed
        </button>
        <button className="px-4 py-1 bg-gray-200 rounded-full text-sm whitespace-nowrap">
          Favorites
        </button>
        <button className="px-4 py-1 bg-gray-200 rounded-full text-sm whitespace-nowrap">
          Downloaded
        </button>
      </div>
      
      <div className="flex flex-col gap-3">
        {[...featuredBooks, ...continueListing].map(book => (
          <div key={book.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100">
            <img src={book.cover} alt={book.title} className="w-16 h-20 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-medium">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
              {book.progress && (
                <div className="w-full bg-gray-200 h-1 rounded-full mt-2">
                  <div 
                    className="bg-blue-500 h-1 rounded-full" 
                    style={{ width: `${book.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
            <button className="p-2 text-gray-500">
              <Heart size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
  
  const SearchView = () => {
    const searchCategories = ["All", "Fiction", "Non-Fiction", "Fantasy", "Mystery", "Romance", "Biography"];
    const [activeCategory, setActiveCategory] = useState("All");
    
    const searchResults = [
      { id: 10, title: "The Midnight Library", author: "Matt Haig", cover: "/api/placeholder/120/160", rating: 4.5 },
      { id: 11, title: "Project Hail Mary", author: "Andy Weir", cover: "/api/placeholder/120/160", rating: 4.8 },
      { id: 12, title: "Atomic Habits", author: "James Clear", cover: "/api/placeholder/120/160", rating: 4.7 },
      { id: 13, title: "The Alchemist", author: "Paulo Coelho", cover: "/api/placeholder/120/160", rating: 4.6 },
      { id: 14, title: "The Silent Patient", author: "Alex Michaelides", cover: "/api/placeholder/120/160", rating: 4.3 },
      { id: 15, title: "Where the Crawdads Sing", author: "Delia Owens", cover: "/api/placeholder/120/160", rating: 4.7 },
    ];
    
    

  return (
      <div className="flex flex-col gap-4 pb-24 text-black">
        <div className="sticky top-0 bg-white z-10 pt-2 pb-4">
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
              >
                ×
              </button>
            )}
          </div>
          
          <div className="flex overflow-x-auto gap-2 mt-4 pb-2">
            {searchCategories.map(category => (
              <button 
                key={category}
                className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
                  activeCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {searchQuery ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-600">Showing results for "{searchQuery}"</p>
            <div className="grid grid-cols-2 gap-4">
              {searchResults.map(book => (
                <div key={book.id} className="flex flex-col">
                  <div className="relative">
                    <img src={book.cover} alt={book.title} className="w-full h-48 object-cover rounded-lg shadow-md" />
                    <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium">
                      ★ {book.rating}
                    </div>
                  </div>
                  <h3 className="font-medium mt-2">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <section>
              <h3 className="text-lg font-medium mb-3">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center">
                  <span>Science Fiction</span>
                  <span className="ml-2 text-gray-500">×</span>
                </button>
                <button className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center">
                  <span>Stephen King</span>
                  <span className="ml-2 text-gray-500">×</span>
                </button>
                <button className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center">
                  <span>Self Development</span>
                  <span className="ml-2 text-gray-500">×</span>
                </button>
              </div>
            </section>
            
            <section>
              <h3 className="text-lg font-medium mb-3">Trending Searches</h3>
              <div className="flex flex-col gap-2">
                <button className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <Search size={16} className="text-gray-500 mr-3" />
                  <span>Best fantasy series</span>
                </button>
                <button className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <Search size={16} className="text-gray-500 mr-3" />
                  <span>New releases this week</span>
                </button>
                <button className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <Search size={16} className="text-gray-500 mr-3" />
                  <span>Award winning audiobooks</span>
                </button>
                <button className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <Search size={16} className="text-gray-500 mr-3" />
                  <span>Best narrators</span>
                </button>
              </div>
            </section>
            
            <section>
              <h3 className="text-lg font-medium mb-3">Browse Categories</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-gray-100 p-4 rounded-lg text-left">
                  <h4 className="font-medium">Fiction</h4>
                  <p className="text-sm text-gray-600">12,345 titles</p>
                </button>
                <button className="bg-gray-100 p-4 rounded-lg text-left">
                  <h4 className="font-medium">Non-Fiction</h4>
                  <p className="text-sm text-gray-600">8,765 titles</p>
                </button>
                <button className="bg-gray-100 p-4 rounded-lg text-left">
                  <h4 className="font-medium">Mystery & Thriller</h4>
                  <p className="text-sm text-gray-600">3,456 titles</p>
                </button>
                <button className="bg-gray-100 p-4 rounded-lg text-left">
                  <h4 className="font-medium">Fantasy</h4>
                  <p className="text-sm text-gray-600">2,345 titles</p>
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    );
  };
  
  const ProfileView = () => {
    const [activeTab, setActiveTab] = useState('overview');
    
    const userStats = {
      booksRead: 24,
      hoursListened: 138,
      currentStreak: 7,
      badges: 12
    };
    
    const recentActivity = [
      { id: 1, type: 'finished', book: 'The Hobbit', date: '2 days ago' },
      { id: 2, type: 'started', book: 'Dune', date: '5 days ago' },
      { id: 3, type: 'badge', name: 'Serial Listener', date: '1 week ago' },
      { id: 4, type: 'finished', book: 'Project Hail Mary', date: '2 weeks ago' },
    ];
    
    return (
      <div className="flex flex-col gap-6 pb-24 text-black">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
            JS
          </div>
          <div>
            <h2 className="text-xl font-bold">John Smith</h2>
            <p className="text-gray-600">Member since January 2025</p>
            <button className="text-blue-500 text-sm font-medium mt-1">Edit Profile</button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-2xl font-bold">{userStats.booksRead}</h3>
            <p className="text-sm text-gray-600">Books Finished</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-2xl font-bold">{userStats.hoursListened}</h3>
            <p className="text-sm text-gray-600">Hours Listened</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-2xl font-bold">{userStats.currentStreak}</h3>
            <p className="text-sm text-gray-600">Day Streak</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-2xl font-bold">{userStats.badges}</h3>
            <p className="text-sm text-gray-600">Badges Earned</p>
          </div>
        </div>
        
        <div className="border-b flex">
          <button 
            className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'library' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('library')}
          >
            My Library
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'badges' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab('badges')}
          >
            Badges
          </button>
        </div>
        
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            <section>
              <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
              <div className="flex flex-col gap-3">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      {activity.type === 'finished' && <BookOpen size={18} />}
                      {activity.type === 'started' && <Play size={18} />}
                      {activity.type === 'badge' && <span className="text-xl">🏆</span>}
                    </div>
                    <div className="flex-1">
                      {activity.type === 'finished' && (
                        <p>Finished reading <span className="font-medium">{activity.book}</span></p>
                      )}
                      {activity.type === 'started' && (
                        <p>Started reading <span className="font-medium">{activity.book}</span></p>
                      )}
                      {activity.type === 'badge' && (
                        <p>Earned <span className="font-medium">{activity.name}</span> badge</p>
                      )}
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <h3 className="text-lg font-medium mb-3">Listening Goals</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Daily Goal</h4>
                  <span className="text-sm text-gray-600">30 min / day</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mb-1">
                  <div className="bg-blue-500 h-2 rounded-full w-2/3"></div>
                </div>
                <p className="text-sm text-gray-600">20 minutes today</p>
              </div>
            </section>
            
            <section>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Reading Habits</h3>
                <button className="text-sm text-blue-500">View Details</button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-4">
                  <div>
                    <h4 className="font-medium">Favorite Genre</h4>
                    <p className="text-sm">Science Fiction</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Peak Hours</h4>
                    <p className="text-sm">8-10 PM</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Avg. Session</h4>
                    <p className="text-sm">45 minutes</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Completion Rate</h4>
                    <p className="text-sm">83%</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
        
        {activeTab === 'library' && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button className="px-4 py-1 bg-blue-500 text-white rounded-full text-sm whitespace-nowrap">
                All Books
              </button>
              <button className="px-4 py-1 bg-gray-200 rounded-full text-sm whitespace-nowrap">
                Currently Reading
              </button>
              <button className="px-4 py-1 bg-gray-200 rounded-full text-sm whitespace-nowrap">
                Finished
              </button>
              <button className="px-4 py-1 bg-gray-200 rounded-full text-sm whitespace-nowrap">
                Wishlist
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[...featuredBooks, ...continueListing].slice(0, 6).map(book => (
                <div key={book.id} className="flex flex-col">
                  <img src={book.cover} alt={book.title} className="w-full h-48 object-cover rounded-lg shadow-md" />
                  <h3 className="font-medium mt-2">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  {book.progress && (
                    <div className="w-full bg-gray-200 h-1 rounded-full mt-2">
                      <div 
                        className="bg-blue-500 h-1 rounded-full" 
                        style={{ width: `${book.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'badges' && (
          <div className="grid grid-cols-3 gap-4">
            {Array(12).fill(null).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center p-2">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${idx < 8 ? 'bg-blue-100 text-blue-500' : 'bg-gray-200 text-gray-400'}`}>
                  {idx < 8 ? '🏆' : '🔒'}
                </div>
                <h4 className="text-sm font-medium text-center mt-2">
                  {idx === 0 && 'Bookworm'}
                  {idx === 1 && 'Night Owl'}
                  {idx === 2 && 'Speed Reader'}
                  {idx === 3 && 'Genre Master'}
                  {idx === 4 && 'Marathon'}
                  {idx === 5 && 'Early Bird'}
                  {idx === 6 && 'Serial Listener'}
                  {idx === 7 && 'Completionist'}
                  {idx === 8 && 'Explorer'}
                  {idx === 9 && 'Collector'}
                  {idx === 10 && 'Reviewer'}
                  {idx === 11 && 'Legend'}
                </h4>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const NowPlayingView = () => (
    <div className="flex flex-col items-center gap-8 pb-24 mt-8 text-black">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 rounded-full bg-gray-100">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-semibold">Now Playing</h2>
          <button className="p-2 rounded-full bg-gray-100">
            <Heart size={20} />
          </button>
        </div>
        
        <img src="/api/placeholder/400/400" alt="Book cover" className="w-full aspect-square object-cover rounded-lg shadow-lg mb-8" />
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-1">The Great Gatsby</h2>
          <p className="text-gray-600">F. Scott Fitzgerald</p>
        </div>
        
        <div className="w-full mb-6">
          <div className="w-full bg-gray-200 h-1 rounded-full mb-2">
            <div className="bg-blue-500 h-1 rounded-full w-3/5"></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>4:32</span>
            <span>-3:48</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-6">
          <button className="p-3 text-gray-700">
            <SkipBack size={24} />
          </button>
          <button 
            className="p-4 bg-blue-500 text-white rounded-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>
          <button className="p-3 text-gray-700">
            <SkipForward size={24} />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-8">
          <button className="flex items-center gap-1 text-sm text-gray-600">
            <Volume2 size={18} />
            <span>1.0x</span>
          </button>
          <button className="flex items-center gap-1 text-sm text-gray-600">
            <Clock size={18} />
            <span>Sleep Timer</span>
          </button>
          <button className="flex items-center gap-1 text-sm text-gray-600">
            <Bookmark size={18} />
            <span>Bookmark</span>
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="max-w-3xl mx-auto bg-white min-h-screen relative text-black">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-500" size={24} />
          <h1 className="text-lg font-bold">AudioBookify</h1>
        </div>
        <div className="flex-1 mx-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search books, authors..." 
              className="w-full bg-gray-100 rounded-full py-2 px-4 pl-10 text-sm"
              onClick={() => setCurrentView('search')}
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
          </div>
        </div>
        <button 
          className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden"
          onClick={() => setIsAdmin(!isAdmin)} // Toggle admin mode for demo
        >
          <User size={18} className="mx-auto my-1" />
        </button>
      </header>
      
      {/* Main Content */}
      <main className="p-4">
        {currentView === 'home' && <HomeView />}
        {currentView === 'library' && <LibraryView />}
        {currentView === 'player' && <NowPlayingView />}
        {currentView === 'search' && <SearchView />}
        {currentView === 'profile' && <ProfileView />}
        {currentView === 'admin' && <AdminView />}
      </main>
      
      {/* Mini Player (when not in full player view) */}
      {currentView !== 'player' && (
        <div 
          className="fixed bottom-16 left-4 right-4 max-w-3xl mx-auto bg-white border rounded-lg shadow-lg p-3 flex items-center gap-3"
          onClick={() => setCurrentView('player')}
        >
          <img src="/api/placeholder/60/60" alt="Current book" className="w-12 h-12 rounded object-cover" />
          <div className="flex-1">
            <h3 className="font-medium text-sm">The Great Gatsby</h3>
            <p className="text-xs text-gray-600">F. Scott Fitzgerald</p>
          </div>
          <button 
            className="p-2 bg-blue-500 text-white rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      )}
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-10">
        <button 
          className={`p-2 flex flex-col items-center ${currentView === 'home' ? 'text-blue-500' : 'text-gray-500'}`}
          onClick={() => setCurrentView('home')}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button 
          className={`p-2 flex flex-col items-center ${currentView === 'library' ? 'text-blue-500' : 'text-gray-500'}`}
          onClick={() => setCurrentView('library')}
        >
          <BookOpen size={20} />
          <span className="text-xs mt-1">Library</span>
        </button>
        <button 
          className={`p-2 flex flex-col items-center ${currentView === 'search' ? 'text-blue-500' : 'text-gray-500'}`}
          onClick={() => setCurrentView('search')}
        >
          <Search size={20} />
          <span className="text-xs mt-1">Search</span>
        </button>
        <button 
          className={`p-2 flex flex-col items-center ${currentView === 'profile' ? 'text-blue-500' : 'text-gray-500'}`}
          onClick={() => setCurrentView('profile')}
        >
          <User size={20} />
          <span className="text-xs mt-1">Profile</span>
        </button>
        {isAdmin && (
          <button 
            className={`p-2 flex flex-col items-center ${currentView === 'admin' ? 'text-blue-500' : 'text-gray-500'}`}
            onClick={() => setCurrentView('admin')}
          >
            <BookOpen size={20} />
            <span className="text-xs mt-1">Admin</span>
          </button>
        )}
      </nav>
    </div>
  );
}
