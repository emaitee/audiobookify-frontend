'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Player from "@/components/Player";
import { useState, useEffect } from "react";
// import ResponsiveNav from "@/components/ResponsiveNav"; // Updated import
import Header from "@/components/Header";
import { ClientAuthProvider } from "@/components/ClientAuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PlayerProvider } from "@/context/PlayerContext";
import { MiniPlayer } from '../components/MiniPlayer';
import { AnimatePresence } from 'framer-motion';
import { ProfileProvider } from "@/context/ProfileContext";
import ResponsiveNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientAuthProvider>
          <ProfileProvider>
            <PlayerProvider>
              <div className="bg-white min-h-screen relative text-black flex">
                {/* Responsive Navigation */}
                <ResponsiveNav />
                
                {/* Main Content Wrapper - adjusts based on screen size */}
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
              </div>
            </PlayerProvider>
          </ProfileProvider>
        </ClientAuthProvider>
      </body>
    </html>
  );
}