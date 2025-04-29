'use client'
import { Search } from "lucide-react";
import { useState } from "react";


const SearchView = () => {
      const [searchQuery, setSearchQuery] = useState('');
    
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

  export default SearchView