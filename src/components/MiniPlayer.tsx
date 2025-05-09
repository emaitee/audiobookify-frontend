'use client'

import { 
  Play, 
  Pause, 
  ChevronUp,
  BookOpen,
  Volume2,
  Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlayer } from '@/context/PlayerContext';

export function MiniPlayer() {
  const router = useRouter();
  const { 
    currentBook, 
    currentEpisode,
    isPlaying, 
    togglePlay, 
    progress 
  } = usePlayer();
  const [isMobile, setIsMobile] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation states
  const [pulse, setPulse] = useState(false);
  
  // Check if we're on desktop or mobile for positioning
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

  // Simulated loading when play button is clicked
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Pulse animation for waveform when playing
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setPulse(prev => !prev);
      }, 1200);  
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  if (!currentBook) return null;

  const handlePlayerClick = () => {
    router.push('/playing');
  };

  const handlePlayButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsLoading(true);
    setTimeout(() => {
      togglePlay();
    }, 200);
  };

  // Create waveform bars
  const waveformBars = Array(5).fill(null).map((_, i) => {
    const height = isPlaying 
      ? pulse 
        ? [50, 70, 90, 70, 50][i] 
        : [70, 90, 50, 80, 60][i]
      : [60, 60, 60, 60, 60][i];
    
    return (
      <div 
        key={i}
        className="bg-white/80 w-1 rounded-full mx-px transition-all duration-700"
        style={{ height: `${height}%` }}
      />
    );
  });

  return (
    <div
      onClick={handlePlayerClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed z-40 cursor-pointer shadow-xl
        transition-all duration-300 ease-in-out
        ${isMobile 
          ? 'bottom-16 left-3 right-3 rounded-2xl' 
          : 'bottom-3 lg:left-64 right-3 rounded-2xl'}`}
      style={{ marginBottom: isMobile ? 'env(safe-area-inset-bottom, 0)' : '0' }}
    >
      {/* Glass effect background with indigo gradient */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800
          opacity-90 rounded-2xl 
          transition-all duration-300
          ${isHovered ? 'from-indigo-700 to-indigo-900' : ''}
        `}
      />
      
      {/* Animated glow effect */}
      <div className={`
        absolute inset-0 rounded-2xl
        ${isPlaying ? 'animate-pulse bg-indigo-400/10' : ''}
        transition-opacity duration-700
      `}/>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-2xl overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-300 to-purple-300 transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="container mx-auto max-w-6xl flex items-center justify-between p-3 relative z-10">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* Cover image with subtle animations */}
          <div 
            className={`
              relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden
              shadow-lg transform transition-transform duration-300
              ${isHovered ? 'scale-105' : ''}
            `}
          >
            <div className="absolute inset-0 bg-indigo-900/20 rounded-lg" />
            <img 
              src={currentBook.coverImage} 
              alt={currentBook.title}
              className="h-full w-full object-cover"
            />
            
            {/* Animated edge glow when playing */}
            {isPlaying && (
              <div className="absolute inset-0 border-2 border-white/30 rounded-lg animate-pulse" />
            )}
          </div>
          
          <div className="truncate">
            <h3 className="font-bold text-white truncate">{currentBook.title}</h3>
            <p className="text-xs text-indigo-100/80 truncate">{currentBook.author.name}</p>
            
            {currentBook.isSeries && currentEpisode && (
              <div className="inline-flex items-center mt-1 text-xs text-indigo-100/90">
                <BookOpen size={12} className="mr-1" />
                <span>Episode {currentEpisode.episodeNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Animated audio waveform (visible only when playing) */}
        {isPlaying && (
          <div className="hidden md:flex items-end h-8 space-x-px mx-4">
            {waveformBars}
          </div>
        )}

        <div className="flex items-center space-x-2">
          {/* Hidden on mobile */}
          <button 
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors hidden md:flex"
          >
            <Volume2 size={18} />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              router.push('/playing');
            }} 
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronUp size={18} />
          </button>
          
          <button
            onClick={handlePlayButtonClick}
            className={`
              p-3 bg-white rounded-full transition-all duration-300
              text-indigo-700 hover:text-indigo-900
              transform ${isHovered ? 'scale-110' : ''}
              ${isLoading ? 'opacity-80' : ''}
            `}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}