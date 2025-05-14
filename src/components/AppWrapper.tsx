'use client'
import React, { useEffect, useState } from 'react'
import Header from './Header';
import { AnimatePresence } from 'framer-motion';
import { MiniPlayer } from './MiniPlayer';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import './wrapper.css'
import idb from '@/lib/idb';

function AppWrapper({ children }: React.PropsWithChildren<{}>) {
    const {theme} = useTheme()
    const pathname = usePathname();
    const isNowPlayingPage = pathname.includes('/playing');
    const [isMobile, setIsMobile] = useState(true);

    const checkAndMigrateDB = async () => {
    try {
      const db = await idb.ready();
      if (!db.objectStoreNames.contains('audiobookLists')) {
        // Force upgrade by reopening with higher version
        await idb.resetDatabase();
      }
    } catch (error) {
      console.error('Database migration check failed:', error);
    }
  };

  useEffect(() => {
    checkAndMigrateDB();
  }
  , []);
  
  // Check if we're on the client side and detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add listener for resize events
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return (
    <div className={`flex-1 flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header - only on mobile or conditionally positioned on desktop */}
       <Header />
      
      {/* Main Content with proper padding */}
      <main className="p-4 flex-1">
      <AnimatePresence mode="wait">
        {children}
        </AnimatePresence>
        <AnimatePresence>
          {!isNowPlayingPage && <MiniPlayer />}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default AppWrapper