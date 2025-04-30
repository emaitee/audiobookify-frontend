'use client'
import React, { useState } from 'react'
import { Search, User, BookOpen, Menu,X } from 'lucide-react';
import { featuredBooks } from '@/app/page';
import AuthModal from './AuthModal';
import { useRouter } from 'next/navigation';
// import AuthModal from './Auth';

interface HeaderProps {
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ showSidebar, setShowSidebar }) => {
    const [currentView, setCurrentView] = useState('home');
  const [nowPlaying, setNowPlaying] = useState(featuredBooks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
    // resetForms();
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    // resetForms();
  };

  // Function to play a book
interface Book {
    id: string;
    title: string;
    author: string;
    cover: string;
    progress: number;
}

const playBook = (book: Book): void => {
    // setNowPlaying(book);
    setIsPlaying(true);
    if (currentView !== 'player') {
        setShowMiniPlayer(true);
    }
};
  
  // Function to open full player
  const openFullPlayer = () => {
    setCurrentView('player');
    setShowMiniPlayer(false);
  };
  
  // Function to go back from full player
  const closeFullPlayer = () => {
    setCurrentView('home');
    setShowMiniPlayer(true);
  };
  
  // Handle search input
interface SearchInputEvent extends React.ChangeEvent<HTMLInputElement> {}

const handleSearchInput = (e: SearchInputEvent): void => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
        setShowSearchResults(true);
    } else {
        setShowSearchResults(false);
    }
};
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };
    return(
    
    <header className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
      <div className="flex items-center gap-2">
        <button 
          className="lg:hidden"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-500" size={24} />
          <h1 className="text-lg font-bold hidden sm:block">AudioBookify</h1>
        </div>
      </div>
      <div className="flex-1 mx-4 relative">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search books, authors..." 
            className="w-full bg-gray-100 rounded-full py-2 px-4 pl-10 text-sm"
            value={searchQuery}
            onChange={handleSearchInput}
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
          {searchQuery && (
            <button 
              className="absolute right-3 top-2.5 text-gray-500"
              onClick={clearSearch}
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {showSearchResults && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 p-2 z-20">
            <div className="p-2 text-sm text-gray-500">
              {searchQuery ? `Results for "${searchQuery}"` : 'Recent searches'}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {featuredBooks.slice(0, 3).map(book => (
                <div 
                  key={book.id} 
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => {
                    // playBook(book);
                    clearSearch();
                  }}
                >
                  <img src={book.cover} alt={book.title} className="w-10 h-10 object-cover rounded" />
                  <div>
                    <div className="font-medium">{book.title}</div>
                    <div className="text-xs text-gray-500">{book.author}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      


        <AuthModal />
      {/* <AuthModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} openModal={openModal} closeModal={closeModal} /> */}
    </header>
  )};

// function Header() {
//   return (
// <header className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
//         <div className="flex items-center gap-2">
//           <BookOpen className="text-blue-500" size={24} />
//           <h1 className="text-lg font-bold">AudioBookify</h1>
//         </div>
//         <div className="flex-1 mx-4">
//           <div className="relative">
//             <input 
//               type="text" 
//               placeholder="Search books, authors..." 
//               className="w-full bg-gray-100 rounded-full py-2 px-4 pl-10 text-sm"
//               // onClick={() => setCurrentView('search')}
//             />
//             <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
//           </div>
//         </div>
//         <button 
//           className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden"
//           // onClick={() => setIsAdmin(!isAdmin)} // Toggle admin mode for demo
//         >
//           <User size={18} className="mx-auto my-1" />
//         </button>
//       </header>
//   )
// }

export default Header