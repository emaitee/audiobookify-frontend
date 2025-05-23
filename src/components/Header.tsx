'use client'
import React, { useState } from 'react'
import { Search,X, Volume2, SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
// import appLogo from '../../public/appLogo.png'


import AuthModal from './AuthModal';
import { usePathname, useRouter } from 'next/navigation';
import LocaleSwitcher from './LocaleSwitcher';
import Image from 'next/image';
// import AuthModal from './Auth';

interface Book {
  _id?: string;
  id?: number; // Changed _id to id
  title: string;
  author: string;
  cover?: string; // Changed coverImage to cover
  coverImage?:string;
  progress: number;
  narrator?: string;
  isSeries?: boolean;
}
interface HeaderProps {
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void;
}

const Header = () => {
  const router = useRouter()
    const { theme, setTheme } = useTheme();
  const pathname = usePathname()
    const [currentView, setCurrentView] = useState('home');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
    // resetForms();
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    // resetForms();
  };


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

  const isOnSearchPage = pathname === '/search'
    return(
<header className={`sticky top-0 p-4 flex justify-between items-center z-10 
                    ${theme === 'dark' ? 
                      'bg-gray-900 border-gray-700' : 
                      'bg-white border-gray-200'} border-b`}>
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-2">
      <Image src='/logo.png' height={30} width={30} alt='logo' />
      {/* <Volume2 className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'}`} size={24} /> */}
      <h1 className={`text-lg font-bold hidden sm:block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        SautiBox
      </h1>
    </div>
  </div>
  <div className="flex-1 mx-4 relative">
    {isOnSearchPage ? null : (
      <div className="relative" onClick={() => router.push('/search')}>
        <input 
          type="text" 
          placeholder="Search books, authors..." 
          className={`w-full rounded-full py-2 px-4 pl-10 text-sm
                    ${theme === 'dark' ? 
                      'bg-gray-700 text-white placeholder-gray-400' : 
                      'bg-gray-100 text-gray-900 placeholder-gray-500'}`}
          value={searchQuery}
          onChange={handleSearchInput}
        />
        <Search 
          size={16} 
          className={`absolute left-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} 
        />
        {searchQuery && (
          <button 
            className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
            onClick={clearSearch}
          >
            <X size={16} />
          </button>
        )}
      </div>
    )}
  </div>
      
     
<LocaleSwitcher />
        <AuthModal /> <button 
              onClick={toggleTheme}
              className={`p-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            >
              {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>
    </header>
  )};

// function Header() {
//   return (
// <header className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
//         <div className="flex items-center gap-2">
//           <BookOpen className="text-indigo-500" size={24} />
//           <h1 className="text-lg font-bold">SautiBox</h1>
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