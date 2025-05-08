'use client'
import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { usePlayer } from '@/context/PlayerContext';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX,
  Bookmark, Star, MessageCircle, Share2, Heart, ChevronRight, 
  ChevronDown, ChevronUp, Menu, X, ArrowLeft, Settings, Clock,
  BookOpen, Info, Rewind, FastForward, Maximize2, Minimize2,
  MessageCircleHeart
} from "lucide-react";
import { Episode } from "../page";

function formatTime(seconds: number, fullFormat = false): string {
  if (!seconds) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0 || fullFormat) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

interface Review {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  rating: number;
  comment: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface Bookmark {
  timestamp: number;
  chapter: string;
  note: string;
}

interface Book {
  title: string;
  author: string;
  coverImage: string;
  description?: string;
  averageRating?: number;
  duration?: number;
  episodes?: Episode[];
  reviews?: Review[];
  bookmarks?: Bookmark[];
  [key: string]: any; // Add this if the Book type is dynamic
}

const StarRating = ({ 
  rating, 
  setRating = undefined, 
  size = 20, 
  interactive = false 
}: { 
  rating: number; 
  setRating?: (rating: number) => void; 
  size?: number;
  interactive?: boolean;
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hoverRating !== null ? star <= hoverRating : star <= rating);
        
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${filled ? 'text-yellow-400' : 'text-white/30'}`}
            onClick={() => setRating && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(null)}
          >
            <Star size={size} fill={filled ? "currentColor" : "none"} />
          </button>
        );
      })}
    </div>
  );
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
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
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}

export default function NowPlaying() {
  const {
    currentBook,
    currentEpisode,
    isPlaying,
    progress,
    volume,
    togglePlay,
    play,
    seek,
    setVolume,
    nextTrack,
    previousTrack,
    playbackSpeed,
    setPlaybackSpeed,
    isTransitioning
  } = usePlayer();

  const router = useRouter();
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("episodes");
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const handleMinimize = () => {
    router.back();
  };

  const updateProgress = (e: React.MouseEvent) => {
    if (progressContainerRef.current && currentEpisode) {
      const rect = progressContainerRef.current.getBoundingClientRect();
      const clickPosition = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = (clickPosition / rect.width) * 100;
      seek(percentage);
    }
  };

  const handleProgressMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateProgress(e);
  };
  
  const handleProgressMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateProgress(e);
    }
  };
  
  const handleProgressMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleProgressTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateProgressTouch(e);
  };
  
  const handleProgressTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      updateProgressTouch(e);
    }
  };
  
  const updateProgressTouch = (e: React.TouchEvent) => {
    if (progressContainerRef.current && currentEpisode && e.touches.length > 0) {
      const rect = progressContainerRef.current.getBoundingClientRect();
      const touchPosition = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
      const percentage = (touchPosition / rect.width) * 100;
      seek(percentage);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleProgressMouseMove(e as unknown as React.MouseEvent);
      }
    };

    const handleTouchEnd = () => setIsDragging(false);
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleProgressTouchMove(e as unknown as React.TouchEvent);
      }
    };
  
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchmove', handleTouchMove);
  
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging]);

  if (!currentBook) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <BookOpen size={32} className="text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Audiobook Selected</h2>
          <p className="text-gray-500 max-w-md">Discover your next literary adventure from your library</p>
          <button 
            onClick={() => router.push('/library')}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-full hover:shadow-lg transition shadow-md flex items-center justify-center mx-auto"
          >
            <BookOpen size={18} className="mr-2" />
            Browse Library
          </button>
        </div>
      </div>
    );
  }

  const currentTime = formatTime((progress / 100) * (currentEpisode?.duration || currentBook.duration || 0));
  const totalTime = formatTime(currentEpisode?.duration || currentBook.duration || 0);
  const remainingTime = formatTime((currentEpisode?.duration || currentBook.duration || 0) - ((progress / 100) * (currentEpisode?.duration || currentBook.duration || 0)));

  // Progress bar calculation
  const progressStyle = {
    width: `${progress}%`
  };

  // Mini player for mobile
  const MiniPlayer = () => (
    <div className="fixed bottom-16 left-0 right-0 bg-gradient-to-r from-indigo-900 to-purple-800 text-white shadow-lg border-t border-white/10 p-3 md:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center" onClick={() => setShowFullPlayer(true)}>
          <img 
            src={currentBook.coverImage} 
            alt={currentBook.title} 
            className="w-12 h-12 rounded object-cover mr-3"
          />
          <div className="truncate">
            <p className="font-medium truncate">{currentBook.title}</p>
            <p className="text-xs text-white/80 truncate">
              {currentEpisode?.title || currentBook.title}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="text-white/80 hover:text-white transition-colors"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button 
            className="text-white/80 hover:text-white transition-colors"
            onClick={nextTrack}
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>
      <div className="h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" 
          style={progressStyle}
        ></div>
      </div>
    </div>
  );

  // Full screen mobile player
  const FullscreenPlayer = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900 z-50 flex flex-col md:hidden">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <button 
          onClick={() => setShowFullPlayer(false)}
          className="text-white/80 hover:text-white transition-colors"
        >
          <ChevronDown size={24} />
        </button>
        <h1 className="text-lg font-semibold text-white">Now Playing</h1>
        <button 
          className="text-white/80 hover:text-white transition-colors"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center">
        <div className="relative rounded-2xl overflow-hidden aspect-square w-64 h-64">
          <img 
            src={currentBook.coverImage} 
            alt={currentBook.title} 
            className="w-full h-full object-cover shadow-lg"
          />
          {/* Vinyl record effect */}
          <div className="absolute -z-10 inset-0 bg-black rounded-full scale-125 opacity-60"></div>
          <div className="absolute -z-10 inset-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full"></div>
          <div className="absolute -z-10 inset-0 m-auto w-8 h-8 bg-white/80 rounded-full"></div>
          
          {/* Play indicator */}
          {isPlaying && (
            <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center w-full">
          <h2 className="text-xl font-bold text-white">{currentBook.title}</h2>
          <p className="text-white/80">{currentBook.author}</p>
          <p className="text-white/60 text-sm">
            {currentEpisode?.title || currentBook.title}
          </p>
          
          <div className="flex justify-center items-center mt-2">
            <StarRating rating={currentBook.averageRating || 0} size={16} />
          </div>
        </div>
        
        <div className="w-full mt-8">
          <div 
            ref={progressContainerRef}
            className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative overflow-hidden mb-2"
            onMouseDown={handleProgressMouseDown}
            onTouchStart={handleProgressTouchStart}
          >
            <div 
              className="absolute h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            />
            <div 
              className={`absolute h-4 w-4 rounded-full bg-white shadow-lg top-1/2 -translate-y-1/2 transition-all duration-300 ${isDragging ? 'scale-125' : ''}`}
              style={{ left: `calc(${progress}% - 8px)` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/70">
            <span>{currentTime}</span>
            <span className="flex items-center">
              <Clock size={14} className="mr-1" />
              -{remainingTime} left
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t border-white/10">
        <div className="flex justify-center items-center space-x-8">
          <button 
            className="text-white/80 hover:text-white transition-colors"
            onClick={previousTrack}
          >
            <SkipBack size={28} />
          </button>
          <button 
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition transform hover:scale-105 shadow-md"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} fill="white" />}
          </button>
          <button 
            className="text-white/80 hover:text-white transition-colors"
            onClick={nextTrack}
          >
            <SkipForward size={28} />
          </button>
        </div>
        
        <div className="flex justify-between mt-8">
          <button 
            className="text-white/80 hover:text-white transition-colors"
            onClick={() => seek(Math.max(0, ((progress / 100) * (currentEpisode?.duration || 0)) - 15))}>
            <Rewind size={20} />
          </button>
          <button 
            className="text-white/80 hover:text-white transition-colors"
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
          >
            {volume === 0 ? <VolumeX size={20} /> : 
             volume < 0.3 ? <Volume1 size={20} /> : 
             <Volume2 size={20} />}
          </button>
          <button 
            className="text-white/80 hover:text-white transition-colors"
            onClick={() => setActiveTab('bookmarks')}
          >
            <Bookmark size={20} />
          </button>
          <button 
            className="text-white/80 hover:text-white transition-colors"
            onClick={() => {
              setActiveTab('reviews');
              setShowFullPlayer(false);
            }}
          >
            <MessageCircleHeart size={20} />
          </button>
          <button 
            className="text-white/80 hover:text-white transition-colors"
          >
            <Share2 size={20} />
          </button>
        </div>

        {showVolumeSlider && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-lg w-40">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              // onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800 pb-20 md:pb-0">
      {/* Main content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Left side - Book cover and details (hidden on mobile) */}
        <div className="hidden md:block md:w-1/3 p-6 flex-col items-center bg-white">
          <div className="flex justify-center">
            <div className="relative rounded-2xl overflow-hidden aspect-square w-64 h-96">
              <img 
                src={currentBook.coverImage} 
                alt={currentBook.title} 
                className="w-full h-full object-cover shadow-lg"
              />
              {/* Vinyl record effect */}
              <div className="absolute -z-10 inset-0 bg-black rounded-full scale-125 opacity-60"></div>
              <div className="absolute -z-10 inset-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full"></div>
              <div className="absolute -z-10 inset-0 m-auto w-8 h-8 bg-white/80 rounded-full"></div>
              
              {/* Play indicator */}
              {isPlaying && (
                <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 w-full p-2">
            <h2 className="text-2xl font-bold">{currentBook.title}</h2>
            <p className="text-gray-600">By {currentBook.author}</p>
            <p className="text-gray-500">Narrated by {currentBook.narrator || "Unknown"}</p>
            
            <div className="flex items-center mt-2">
              <StarRating rating={currentBook.averageRating || 0} size={16} />
              <span className="ml-2 text-gray-600">{currentBook.averageRating || 0} ({reviewCount})</span>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold">Now Playing:</h3>
              <p>{currentEpisode?.title || currentBook.title}</p>
              <p className="text-sm text-gray-500">{currentTime} / {totalTime}</p>
            </div>

            {/* Like and Share buttons */}
            <div className="flex space-x-4 mt-6">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-full ${isLiked ? 'text-pink-400 bg-pink-400/10' : 'text-gray-600 bg-gray-200/50'} transition-all`}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button className="p-3 rounded-full text-gray-600 bg-gray-200/50 hover:bg-gray-300/50 transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Current book on mobile */}
        <div className="md:hidden md:p-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <img 
              src={currentBook.coverImage} 
              alt={currentBook.title} 
              className="w-16 h-24 rounded object-cover mr-4"
            />
            <div>
              <h2 className="text-lg font-bold">{currentBook.title}</h2>
              <p className="text-gray-600 text-sm">By {currentBook.author}</p>
              <div className="flex items-center mt-1">
                <StarRating rating={currentBook.averageRating || 0} size={12} />
                <span className="ml-1 text-xs text-gray-600">{currentBook.averageRating || 0}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Now Playing: {currentEpisode?.title || currentBook.title}
              </p>
            </div>
          </div>
        </div>
        
        {/* Right side - Player and tabs */}
        <div className="w-full md:w-2/3 flex flex-col bg-gray-50">
          {/* Player controls (visible only on desktop) */}
          <div className="hidden md:block bg-white p-6 shadow-md">
            <div className="mb-4">
              <div 
                ref={progressContainerRef}
                className="h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
                onMouseDown={handleProgressMouseDown}
              >
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" 
                  style={progressStyle}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{currentTime}</span>
                <span className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  -{remainingTime} left
                </span>
              </div>
            </div>
            
            <div className="flex justify-center items-center space-x-6">
              <button 
                className="text-gray-600 hover:text-indigo-700 transition-colors"
                onClick={previousTrack}
              >
                <SkipBack size={24} />
              </button>
              <button 
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition transform hover:scale-105 shadow-md"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button 
                className="text-gray-600 hover:text-indigo-700 transition-colors"
                onClick={nextTrack}
              >
                <SkipForward size={24} />
              </button>
            </div>
            
            <div className="flex justify-between mt-6">
              <div className="flex space-x-4">
                <button 
                  className="text-gray-600 hover:text-indigo-700 transition-colors"
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                >
                  {volume === 0 ? <VolumeX size={20} /> : 
                   volume < 0.3 ? <Volume1 size={20} /> : 
                   <Volume2 size={20} />}
                </button>
                <button 
                  className="text-gray-600 hover:text-indigo-700 transition-colors"
                  onClick={() => setActiveTab('bookmarks')}
                >
                  <Bookmark size={20} />
                </button>
              </div>
              <div className="flex space-x-4">
                <button 
                  className={`text-gray-600 hover:text-indigo-700 transition-colors ${isLiked ? 'text-pink-400' : ''}`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                </button>
                <button className="text-gray-600 hover:text-indigo-700 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {showVolumeSlider && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-lg w-40">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
          </div>
          
          {/* Tabs - desktop view */}
          <div className=" border-b border-gray-200">
            <button 
              className={`px-6 py-3 font-medium ${activeTab === "episodes" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("episodes")}
            >
              Episodes
            </button>
            <button 
              className={`px-6 py-3 font-medium ${activeTab === "details" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            {/* <button 
              className={`px-6 py-3 font-medium ${activeTab === "bookmarks" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("bookmarks")}
            >
              Bookmarks
            </button> */}
            <button 
              className={`px-6 py-3 font-medium ${activeTab === "reviews" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({reviewCount})
            </button>
          </div>
          
          {/* Mobile tabs - simplified */}
{/* 
          <div className="md:hidden border-b border-gray-200 flex justify-between md:px-4">
            <h2 className="py-3 font-medium text-indigo-600">
              {activeTab === 'episodes' ? 'Episodes' : 
               activeTab === 'details' ? 'Details' : 
               activeTab === 'bookmarks' ? 'Bookmarks' : 
               `Reviews (${reviewCount})`}
            </h2>
            <div className="flex items-center">
              {activeTab === "episodes" && (
                <button className="text-indigo-600 py-3 font-medium flex items-center">
                  Sort <ChevronDown size={16} className="ml-1" />
                </button>
              )}
              {activeTab === "reviews" && (
                <button className="text-indigo-600 py-3 font-medium">
                  Write a Review
                </button>
              )}
            </div>
          </div> */}
          
          {/* Tab content */}
          <div className="flex-1 overflow-auto px-0 p-4 md:p-6">
            {activeTab === "episodes" && (
              <div>
                <h3 className="text-lg font-semibold mb-4 hidden md:block">Episodes</h3>
                <div className="space-y-2">
                  {currentBook.episodes?.map((episode) => {
                    const isCurrent = currentEpisode?._id === episode._id;
                    
                    return (
                      <div 
                        key={episode._id}
                        onClick={() => play(currentBook, episode)}
                        className={`p-3 rounded-lg flex justify-between items-center ${isCurrent ? "bg-indigo-50 border border-indigo-200" : "bg-white border border-gray-100"}`}
                      >
                        <div className="flex items-center">
                          <div className={`mr-3 w-8 h-8 flex items-center justify-center rounded-full ${isCurrent ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                            {episode.episodeNumber}
                          </div>
                          <div className="max-w-full">
                            <p className={`font-medium truncate ${isCurrent ? "text-indigo-700" : ""}`}>
                              {episode.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatTime(episode.duration)}
                            </p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-indigo-600 ml-2 flex-shrink-0">
                          {isCurrent ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {activeTab === "details" && (
              <div>
                <h3 className="text-lg font-semibold mb-4 hidden md:block">Book Details</h3>
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-700 text-sm md:text-base">
                    {expandedDescription ? currentBook.description : `${currentBook.description?.substring(0, 100)}...`}
                    {(currentBook.description ?? '').length > 100 && (
                      <button 
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                        onClick={() => setExpandedDescription(!expandedDescription)}
                      >
                        {expandedDescription ? "Show less" : "Read more"}
                      </button>
                    )}
                  </p>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Information</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-gray-500">Publisher:</span>
                          <span>{currentBook.publisher || "Unknown"}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-500">Release Date:</span>
                          <span>{currentBook.releaseDate || "Unknown"}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-500">Language:</span>
                          <span>English</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-500">Categories:</span>
                          <span>{currentBook.category || "Fiction"}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">About the Author</h4>
                      <p className="text-sm text-gray-700">
                        {currentBook.author || "No author information available."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "bookmarks" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold hidden md:block">Your Bookmarks</h3>
                  <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 md:hidden">
                    Add Bookmark
                  </button>
                </div>
                
                {(currentBook.bookmarks?.length ?? 0) > 0 ? (
                  <div className="space-y-3">
                    {currentBook.bookmarks.map((bookmark, i) => (
                      <div key={i} className="bg-white p-3 md:p-4 rounded-lg border border-gray-100 flex justify-between items-center">
                        <div className="max-w-full">
                          <div className="flex items-center">
                            <Bookmark size={16} className="text-indigo-600 mr-2 flex-shrink-0" />
                            <span className="font-medium">{formatTime(bookmark.timestamp)}</span>
                            <span className="text-gray-500 ml-2 hidden md:inline">({bookmark.chapter})</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1 truncate">{bookmark.note}</p>
                        </div>
                        <button 
                          className="text-indigo-600 hover:text-indigo-800 ml-2 flex-shrink-0"
                          onClick={() => seek((bookmark.timestamp / (currentEpisode?.duration || currentBook.duration)) * 100)}
                        >
                          <Play size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 md:py-12">
                    <Bookmark size={36} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No bookmarks yet</p>
                    <p className="text-sm text-gray-400">Tap the bookmark icon while listening to add one</p>
                  </div>
                )}
                <div className="mt-6 hidden md:block">
                  <button className="w-full py-3 bg-gray-100 text-indigo-600 font-medium rounded-lg hover:bg-gray-200 flex items-center justify-center">
                    <Bookmark size={16} className="mr-2" />
                    Add Bookmark
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === "reviews" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold hidden md:block">Reviews & Comments</h3>
                  <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 hidden md:block">
                    Write a Review
                  </button>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-100 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline">
                      <span className="text-2xl md:text-3xl font-bold">{currentBook.averageRating || 0}</span>
                      <span className="text-gray-500 ml-1">/ 5</span>
                    </div>
                    <div className="flex">
                      <StarRating rating={currentBook.averageRating || 0} size={20} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Based on {reviewCount} reviews</p>
                </div>
                
                <div className="space-y-4">
                  {currentBook.reviews?.slice(0, showMoreReviews ? currentBook.reviews.length : 2).map((review, i) => (
                    <div key={i} className="bg-white p-3 md:p-4 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <img 
                            src={review.user.avatar} 
                            alt={review.user.name} 
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="font-medium">{review.user.name}</span>
                        </div>
                        <span className="text-gray-500 text-xs md:text-sm">
                          {formatRelativeTime(review.createdAt)}
                        </span>
                      </div>
                      <div className="flex mb-2">
                        <StarRating rating={review.rating} size={14} />
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
                {(currentBook.reviews?.length ?? 0) > 2 && (
                  <button 
                    className="mt-4 text-indigo-600 flex items-center hover:text-indigo-800"
                    onClick={() => setShowMoreReviews(!showMoreReviews)}
                  >
                    {showMoreReviews ? (
                      <>
                        <ChevronUp size={16} className="mr-1" />
                        Show less reviews
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} className="mr-1" />
                        Show all {(currentBook.reviews ?? []).length} reviews
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile mini player */}
      <MiniPlayer />
      
      {/* Mobile full screen player */}
      {showFullPlayer && <FullscreenPlayer />}

      {/* Transition overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-white">Loading next episode...</span>
        </div>
      )}
    </div>
  );
}