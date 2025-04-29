import { Heart, Plus, Search } from "lucide-react";
import { continueListing, featuredBooks } from "../page";

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

  export default LibraryView