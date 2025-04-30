'use client'

import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Heart,
  Share2,
  ListMusic,
  Clock,
  ChevronDown,
  ChevronUp,
  BookOpen
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { usePlayer } from '@/context/PlayerContext';
import { formatTime } from '@/app/utils/helpers';

// Mini Player Component - Appears at bottom of screen
export function MiniPlayer() {
  const router = useRouter();
  const { 
    currentBook, 
    isPlaying, 
    togglePlay, 
    progress 
  } = usePlayer();

  if (!currentBook) return null;

  const handlePlayerClick = () => {
    router.push('/now-playing');
  };

  const handlePlayButtonClick = (e) => {
    e.stopPropagation();
    togglePlay();
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={handlePlayerClick}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 cursor-pointer shadow-lg z-50 rounded-t-xl"
    >
      <div className="container mx-auto max-w-6xl flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative h-12 w-12 flex-shrink-0">
            <div className="absolute inset-0 bg-white/20 rounded-md blur-sm"></div>
            <img 
              src={currentBook.coverImage} 
              alt={currentBook.title}
              className="h-full w-full object-cover rounded-md relative z-10"
            />
            {/* Progress indicator */}
            <div className="absolute bottom-0 left-0 h-1 bg-white/70 rounded-b-md z-20" style={{ width: `${progress}%` }}></div>
          </div>
          
          <div className="truncate">
            <h3 className="font-semibold text-sm truncate">{currentBook.title}</h3>
            <p className="text-xs text-white/80 truncate">{currentBook.author}</p>
            
            {currentBook.isSeries && currentBook.episodeNumber && (
              <div className="inline-flex items-center mt-1 text-xs">
                <BookOpen size={12} className="mr-1" />
                <span>Ep. {currentBook.episodeNumber}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              router.push('/now-playing');
            }} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronUp size={20} />
          </button>
          
          <button
            onClick={handlePlayButtonClick}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} fill="white" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}


export default function NowPlaying() {
    const {
      currentBook,
      isPlaying,
      progress,
      volume,
      togglePlay,
      seek,
      setVolume,
      nextTrack,
      previousTrack,
      playbackSpeed,
      setPlaybackSpeed
    } = usePlayer();
  
    const router = useRouter();
    const progressBarRef = useRef(null);
    const [isLiked, setIsLiked] = useState(false);
    const [showChapters, setShowChapters] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
  
    const handleProgressClick = (e) => {
      if (progressBarRef.current && currentBook) {
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = (clickPosition / rect.width) * 100;
        const seekTime = (percentage / 100) * currentBook.duration;
        seek(seekTime);
      }
    };
  
    const handleMinimize = () => {
      router.back();
    };
  
    const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
  
    if (!currentBook) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-6"
        >
          <div className="text-center p-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ListMusic size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Audio Playing</h2>
            <p className="text-gray-500 max-w-md">Select an audiobook from your library to start listening</p>
          </div>
        </motion.div>
      );
    }
  
    const currentTime = formatTime((progress / 100) * currentBook.duration);
    const totalTime = formatTime(currentBook.duration);
    const remainingTime = formatTime(currentBook.duration - ((progress / 100) * currentBook.duration));
  
    return (
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-0 bg-gradient-to-b from-indigo-50 to-white z-50 overflow-auto"
      >
        {/* Header with minimize button */}
        <div className="flex justify-between items-center p-6">
          <button 
            onClick={handleMinimize}
            className="flex items-center text-gray-600 hover:text-indigo-700 transition-colors"
          >
            <ChevronDown size={24} />
            <span className="ml-2 font-medium">Minimize</span>
          </button>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`${isLiked ? 'text-red-500' : 'text-gray-400'} hover:scale-110 transition-transform`}
            >
              <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button className="text-gray-500 hover:text-indigo-700 transition-colors">
              <Share2 size={22} />
            </button>
          </div>
        </div>
  
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6">
          <div className="w-full max-w-md flex flex-col items-center">
            {/* Cover with shadow effect */}
            <motion.div 
              className="relative mb-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-2xl blur-md opacity-70"></div>
              <img 
                src={currentBook.coverImage} 
                alt={currentBook.title} 
                className="relative w-64 h-64 object-cover rounded-xl shadow-lg z-10"
              />
  
              {/* Series indicator */}
              {currentBook.isSeries && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full px-3 py-1 shadow-md z-20">
                  <div className="flex items-center space-x-1">
                    <BookOpen size={14} />
                    <span className="text-sm font-medium">Episode {currentBook.episodeNumber}</span>
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* Book info */}
            <motion.div 
              className="w-full mb-6 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{currentBook.title}</h1>
              <p className="text-gray-600">{currentBook.author}</p>
              
              {/* Series navigation if it's a series */}
              {currentBook.isSeries && (
                <div className="flex justify-center items-center mt-3 space-x-2">
                  {currentBook.episodeNumber > 1 && (
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                      Previous Episode
                    </button>
                  )}
                  <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    Episode {currentBook.episodeNumber}
                  </div>
                  {currentBook.hasNextEpisode && (
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                      Next Episode
                    </button>
                  )}
                </div>
              )}
            </motion.div>
  
            {/* Progress bar */}
            <motion.div 
              className="w-full mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div 
                ref={progressBarRef}
                className="w-full h-2 bg-gray-200 rounded-full cursor-pointer relative"
                onClick={handleProgressClick}
              >
                <div 
                  className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                />
                <div 
                  className="absolute h-4 w-4 rounded-full bg-white shadow-md border-2 border-indigo-500 top-1/2 -translate-y-1/2 transition-all duration-300"
                  style={{ left: `calc(${progress}% - 8px)` }}
                />
              </div>
            </motion.div>
  
            {/* Time indicators */}
            <motion.div 
              className="flex justify-between w-full text-sm text-gray-500 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span>{currentTime}</span>
              <span className="flex items-center">
                <Clock size={14} className="mr-1" />
                -{remainingTime} left
              </span>
            </motion.div>
  
            {/* Controls */}
            <motion.div 
              className="flex items-center justify-center gap-8 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button 
                className="text-gray-600 hover:text-indigo-700 transition-colors"
                onClick={previousTrack}
              >
                <SkipBack size={28} />
              </button>
              <button 
                className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-full hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition shadow-md"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} fill="white" />}
              </button>
              <button 
                className="text-gray-600 hover:text-indigo-700 transition-colors"
                onClick={nextTrack}
              >
                <SkipForward size={28} />
              </button>
            </motion.div>
  
            {/* Volume and speed controls */}
            <motion.div 
              className="flex flex-col w-full gap-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {/* Volume control */}
              <div className="flex items-center gap-3 w-full bg-gray-100 p-3 rounded-full">
                <button 
                  onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                  className={`${volume > 0 ? 'text-indigo-600' : 'text-gray-500'} hover:text-indigo-700 transition-colors`}
                >
                  {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600"
                />
              </div>
  
              {/* Playback speed */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">Playback Speed</span>
                <div className="flex bg-gray-100 rounded-lg">
                  {speedOptions.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        playbackSpeed === speed 
                          ? 'bg-indigo-600 text-white' 
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
  
        {/* Bottom tabs - Details/Chapters */}
        <motion.div 
          className="border-t border-gray-200 pt-4 pb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {/* Tab buttons */}
          <div className="flex justify-center gap-8 mb-4">
            <button 
              className={`flex flex-col items-center transition-colors ${
                activeTab === 'details' ? 'text-indigo-700' : 'text-gray-500 hover:text-indigo-600'
              }`}
              onClick={() => setActiveTab('details')}
            >
              <ListMusic size={20} />
              <span className="text-xs mt-1">Details</span>
              {activeTab === 'details' && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="h-1 w-12 bg-indigo-600 rounded-full mt-1" 
                />
              )}
            </button>
            <button 
              className={`flex flex-col items-center transition-colors ${
                activeTab === 'chapters' ? 'text-indigo-700' : 'text-gray-500 hover:text-indigo-600'
              }`}
              onClick={() => setActiveTab('chapters')}
            >
              <BookOpen size={20} />
              <span className="text-xs mt-1">Chapters</span>
              {activeTab === 'chapters' && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="h-1 w-12 bg-indigo-600 rounded-full mt-1" 
                />
              )}
            </button>
          </div>
  
          {/* Tab content */}
          <div className="px-6">
            <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-md mx-auto"
                >
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {currentBook.description || "No description available for this audiobook."}
                  </p>
                  
                  {/* Series info if applicable */}
                  {currentBook.isSeries && (
                    <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                      <h4 className="font-medium text-indigo-800 mb-1">Series Information</h4>
                      <p className="text-sm text-gray-700">
                        This audiobook is episode {currentBook.episodeNumber} of {currentBook.seriesName}.
                        {currentBook.totalEpisodes && ` There are ${currentBook.totalEpisodes} episodes in total.`}
                      </p>
                    </div>
                  )}
                  
                  {/* Additional metadata */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Narrator:</span> 
                      <p className="text-gray-800 font-medium">{currentBook.narrator || "Unknown"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Publisher:</span>
                      <p className="text-gray-800 font-medium">{currentBook.publisher || "Unknown"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Released:</span>
                      <p className="text-gray-800 font-medium">{currentBook.releaseDate || "Unknown"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Length:</span>
                      <p className="text-gray-800 font-medium">{formatTime(currentBook.duration, true)}</p>
                    </div>
                  </div>
                </motion.div>
              )}
  
              {activeTab === 'chapters' && (
                <motion.div
                  key="chapters"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-md mx-auto"
                >
                  {currentBook.chapters ? (
                    <div className="max-h-48 overflow-y-auto">
                      {currentBook.chapters.map((chapter, index) => {
                        const isActive = 
                          (progress / 100) * currentBook.duration >= chapter.startTime && 
                          (progress / 100) * currentBook.duration < (chapter.endTime || currentBook.duration);
                          
                        return (
                          <div 
                            key={index}
                            onClick={() => seek(chapter.startTime)}
                            className={`p-3 border-b last:border-0 border-gray-100 flex justify-between items-center cursor-pointer ${
                              isActive ? 'bg-indigo-50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className={`w-6 text-center ${isActive ? 'text-indigo-700 font-medium' : 'text-gray-500'}`}>
                                {index + 1}
                              </span>
                              <span className={`ml-3 ${isActive ? 'text-indigo-800 font-medium' : 'text-gray-700'}`}>
                                {chapter.title}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatTime(chapter.startTime)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ListMusic size={32} className="mx-auto mb-3 text-gray-400" />
                      <p>No chapter information available</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    );
  }
