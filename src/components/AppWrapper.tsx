'use client'
import React, { useEffect, useState } from 'react'
import Header from './Header';
import { AnimatePresence } from 'framer-motion';
import { MiniPlayer } from './MiniPlayer';
import { usePathname } from 'next/navigation';

function AppWrapper({ children }: React.PropsWithChildren<{}>) {
    const pathname = usePathname();
  const isNowPlayingPage = pathname === '/now-playing';
  const [isMobile, setIsMobile] = useState(true);
  
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

        <div className="flex-1 flex flex-col ">
                  {/* Header - only on mobile or conditionally positioned on desktop */}
                  {isMobile && <Header />}
                  
                  {/* Main Content with proper padding */}
                  <main className="p-4 flex-1">
                    {children}
                    <AnimatePresence>
                      {!isNowPlayingPage && <MiniPlayer />}
                    </AnimatePresence>
                  </main>
                </div>

  )
}

export default AppWrapper