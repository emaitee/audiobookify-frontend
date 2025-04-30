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
  BookOpen,Rewind,FastForward,Volume1,
  Info,BookmarkPlus
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { usePlayer } from '@/context/PlayerContext';
import { formatTime } from '@/app/utils/helpers';
import Link from 'next/link';

// Mini Player Component - Appears at bottom of screen
export function MiniPlayer() {
    const router = useRouter();
    const { 
      currentBook, 
      currentEpisode,
      isPlaying, 
      togglePlay, 
      progress 
    } = usePlayer();
  
    if (!currentBook) return null;
  
    const handlePlayerClick = () => {
      router.push('/now-playing');
    };
  
    const handlePlayButtonClick = (e: React.MouseEvent) => {
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
        className="fixed bottom-16 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 cursor-pointer shadow-lg z-40 rounded-t-xl"
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0)' }} // For iOS devices
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
              
              {currentBook.isSeries && currentEpisode && (
                <div className="inline-flex items-center mt-1 text-xs">
                  <BookOpen size={12} className="mr-1" />
                  <span>Ep. {currentEpisode.episodeNumber}</span>
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
      setPlaybackSpeed
    } = usePlayer();
  
    const router = useRouter();
    const progressBarRef = useRef(null);
    const [isLiked, setIsLiked] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
    const handleProgressClick = (e) => {
      if (progressBarRef.current && currentBook && currentEpisode) {
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = (clickPosition / rect.width) * 100;
        const seekTime = (percentage / 100) * currentEpisode.duration;
        seek(seekTime);
      }
    };
  
    const handleMinimize = () => {
      router.back();
    };
  
    const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
  
    if (!currentBook) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
          <div className="text-center p-8">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ListMusic size={32} className="text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Audiobook Selected</h2>
            <p className="text-gray-500 max-w-md">Discover your next literary adventure from your library</p>
            <Link href="/library" className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-full hover:shadow-lg transition shadow-md flex items-center justify-center mx-auto">
              <BookOpen size={18} className="mr-2" />
              Browse Library
            </Link>
          </div>
        </div>
      );
    }
  
    const currentTime = formatTime((progress / 100) * (currentEpisode?.duration || currentBook.duration || 0));
    const totalTime = formatTime(currentEpisode?.duration || currentBook.duration || 0);
    const remainingTime = formatTime((currentEpisode?.duration || currentBook.duration || 0) - ((progress / 100) * (currentEpisode?.duration || currentBook.duration || 0)));
  
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900 z-50 overflow-y-auto text-white">
        {/* Top bar */}
        <div className="flex justify-between items-center p-4 md:p-6 sticky top-0 z-10 backdrop-blur-sm bg-gradient-to-b from-indigo-900/90 to-indigo-900/60">
          <button 
            onClick={handleMinimize}
            className="flex items-center text-white/80 hover:text-white transition-colors"
          >
            <ChevronDown size={24} />
            <span className="ml-2 font-medium">Minimize</span>
          </button>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`${isLiked ? 'text-pink-400' : 'text-white/70'} hover:scale-110 transition-all`}
            >
              <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button className="text-white/70 hover:text-white transition-colors">
              <Share2 size={22} />
            </button>
          </div>
        </div>
  
        {/* Content container with proper bottom padding */}
        <div className="flex-1 flex flex-col items-center px-4 pb-40 mt-4">
          <div className="w-full max-w-md backdrop-blur-xl bg-white/10 rounded-3xl p-6 shadow-2xl">
            {/* Cover with effects */}
            <div className="relative mb-8 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/30 to-purple-500/30 rounded-3xl blur-xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-br from-indigo-400/40 to-purple-500/40 rounded-3xl blur-md"></div>
              <div className="relative rounded-2xl overflow-hidden aspect-square max-w-xs mx-auto">
                <img 
                  src={currentBook.coverImage} 
                  alt={currentBook.title} 
                  className="w-full h-full object-cover shadow-lg"
                />
                
                {/* Vinyl record effect behind the cover */}
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
                
              {/* Series indicator */}
              {currentBook.isSeries && currentEpisode && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full px-3 py-1 shadow-lg z-20">
                  <div className="flex items-center space-x-1">
                    <BookOpen size={14} />
                    <span className="text-sm font-medium">Episode {currentEpisode.episodeNumber}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Book info */}
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-white mb-1">{currentBook.title}</h1>
              <p className="text-white/70">{currentBook.author}</p>
              
              {/* Series navigation if it's a series */}
              {currentBook.isSeries && currentEpisode && (
                <div className="flex justify-center items-center mt-4 space-x-2">
                  {currentEpisode.episodeNumber > 1 && (
                    <button 
                      onClick={previousTrack}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm hover:bg-white/20 transition-all"
                    >
                      Previous Episode
                    </button>
                  )}
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                    Episode {currentEpisode.episodeNumber}
                  </div>
                  {currentBook.episodes && currentEpisode.episodeNumber < currentBook.episodes.length && (
                    <button 
                      onClick={nextTrack}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm hover:bg-white/20 transition-all"
                    >
                      Next Episode
                    </button>
                  )}
                </div>
              )}
            </div>
  
            {/* Progress bar */}
            <div className="w-full mb-2 px-4">
              <div 
                ref={progressBarRef}
                className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative overflow-hidden"
                onClick={handleProgressClick}
              >
                <div 
                  className="absolute h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                />
                <div 
                  className="absolute h-4 w-4 rounded-full bg-white shadow-lg top-1/2 -translate-y-1/2 transition-all duration-300 glow-effect"
                  style={{ left: `calc(${progress}% - 8px)` }}
                />
              </div>
            </div>
  
            {/* Time indicators */}
            <div className="flex justify-between w-full text-sm text-white/70 mb-6 px-4">
              <span>{currentTime}</span>
              <span className="flex items-center">
                <Clock size={14} className="mr-1" />
                -{remainingTime} left
              </span>
            </div>
  
            {/* Controls */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <button 
                className="text-white/70 hover:text-white transition-colors"
                onClick={() => seek(Math.max(0, ((progress / 100) * (currentEpisode?.duration || 0)) - 15))}
              >
                <Rewind size={22} />
              </button>
              <button 
                className="text-white/70 hover:text-white transition-colors"
                onClick={previousTrack}
              >
                <SkipBack size={26} />
              </button>
              <button 
                className="p-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition transform hover:scale-105 shadow-md"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} fill="white" />}
              </button>
              <button 
                className="text-white/70 hover:text-white transition-colors"
                onClick={nextTrack}
              >
                <SkipForward size={26} />
              </button>
              <button 
                className="text-white/70 hover:text-white transition-colors"
                onClick={() => seek(Math.min((currentEpisode?.duration || 0), ((progress / 100) * (currentEpisode?.duration || 0)) + 15))}
              >
                <FastForward size={22} />
              </button>
            </div>
  
            {/* Volume and speed controls */}
            <div className="flex flex-col w-full gap-4 mb-6 px-4">
              {/* Volume control */}
              <div className="relative">
                <div className="flex items-center gap-3 w-full">
                  <button 
                    onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                    className={`${volume > 0 ? 'text-white' : 'text-white/50'} hover:text-white transition-colors`}
                  >
                    {volume === 0 ? <VolumeX size={20} /> : 
                     volume < 0.3 ? <Volume1 size={20} /> : 
                     volume < 0.7 ? <Volume2 size={20} /> : 
                     <Volume2 size={20} />}
                  </button>
                  
                  <div className="relative flex-1">
                    {showVolumeSlider && (
                      <div className="absolute bottom-full mb-2 left-0 right-0 bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-lg transition-all">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-white/60 mt-1">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Speed control */}
                  <div className="flex items-center">
                    <span className="text-white/70 mr-2 text-sm">Speed</span>
                    <div className="relative group">
                      <button className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/90 hover:bg-white/20 transition-all">
                        {playbackSpeed}x
                      </button>
                      
                      <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block z-10">
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 shadow-lg">
                          <div className="grid grid-cols-2 gap-1">
                            {speedOptions.map((speed) => (
                              <button
                                key={speed}
                                onClick={() => setPlaybackSpeed(speed)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                  playbackSpeed === speed 
                                    ? 'bg-white/30 text-white' 
                                    : 'text-white/70 hover:bg-white/20'
                                }`}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Bottom tabs with frosted glass effect */}
        <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/10 border-t border-white/20 pt-4 pb-6 z-20">
          {/* Tab buttons */}
          <div className="flex justify-center gap-10 mb-4">
            <button 
              className={`flex flex-col items-center transition-colors ${
                activeTab === 'details' ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
              onClick={() => setActiveTab('details')}
            >
              <Info size={18} />
              <span className="text-xs mt-1">Details</span>
              {activeTab === 'details' && (
                <div className="h-0.5 w-10 bg-white rounded-full mt-1" />
              )}
            </button>
            <button 
              className={`flex flex-col items-center transition-colors ${
                activeTab === 'chapters' ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
              onClick={() => setActiveTab('chapters')}
            >
              <BookOpen size={18} />
              <span className="text-xs mt-1">Chapters</span>
              {activeTab === 'chapters' && (
                <div className="h-0.5 w-10 bg-white rounded-full mt-1" />
              )}
            </button>
            <button 
              className={`flex flex-col items-center transition-colors ${
                activeTab === 'notes' ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
              onClick={() => setActiveTab('notes')}
            >
              <BookmarkPlus size={18} />
              <span className="text-xs mt-1">Bookmarks</span>
              {activeTab === 'notes' && (
                <div className="h-0.5 w-10 bg-white rounded-full mt-1" />
              )}
            </button>
          </div>
  
          {/* Tab content */}
          <div className="px-4 md:px-6 max-w-lg mx-auto max-h-64 overflow-y-auto">
            {activeTab === 'details' && (
              <div className="text-white/90 text-sm leading-relaxed">
                <p>
                  {currentBook.description || "No description available for this audiobook."}
                </p>
                
                {/* Series info if applicable */}
                {currentBook.isSeries && currentEpisode && (
                  <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <h4 className="font-medium text-white mb-1">Series Information</h4>
                    <p className="text-sm text-white/80">
                      This audiobook is episode {currentEpisode.episodeNumber} of {currentBook.seriesName}.
                      {currentBook.totalEpisodes && ` There are ${currentBook.totalEpisodes} episodes in total.`}
                    </p>
                  </div>
                )}
                
                {/* Additional metadata */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-white/60">Narrator:</span> 
                    <p className="text-white font-medium">{currentBook.narrator || "Unknown"}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Duration:</span>
                    <p className="text-white font-medium">
                      {formatTime(currentEpisode?.duration || currentBook.duration || 0, true)}
                    </p>
                  </div>
                  <div>
                    <span className="text-white/60">Publisher:</span> 
                    <p className="text-white font-medium">{currentBook.publisher || "Unknown"}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Release Date:</span>
                    <p className="text-white font-medium">{currentBook.releaseDate || "Unknown"}</p>
                  </div>
                </div>
              </div>
            )}

{activeTab === 'chapters' && (
  <motion.div
    key="episodes"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="max-w-md mx-auto"
  >
    {currentBook?.episodes?.length ? (
      <div className="max-h-48 overflow-y-auto">
        {currentBook.episodes.map((episode) => {
          const isCurrent = currentEpisode?._id === episode._id;
          const progressInSeconds = (progress / 100) * (currentEpisode?.duration || 0);
          
          return (
            <div 
              key={episode._id}
              onClick={() => play(currentBook, episode)}
              className={`p-3 border-b border-white/10 last:border-0 flex justify-between items-center cursor-pointer transition-colors ${
                isCurrent ? 'bg-white/15' : 'hover:bg-white/10'
              }`}
            >
              <div className="flex items-center">
                <span className={`w-6 text-center ${isCurrent ? 'text-indigo-400 font-medium' : 'text-gray-400'}`}>
                  {isCurrent ? (
                    <svg className="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : episode.episodeNumber}
                </span>
                <span className={`ml-3 ${isCurrent ? 'text-indigo-300 font-medium' : 'text-gray-300'}`}>
                  {episode.title}
                </span>
              </div>
              <span className="text-sm text-gray-400">
                {formatTime(episode.duration)}
              </span>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-400">
        <ListMusic size={32} className="mx-auto mb-3 text-gray-500" />
        <p>No episodes available</p>
      </div>
    )}
  </motion.div>
)}
  
            {/* {activeTab === 'chapters' && (
              <div className="max-h-48 overflow-y-auto bg-white/5 backdrop-blur-sm rounded-lg">
                {currentBook?.episodes ? (
                  currentBook.episodes.map((chapter, index) => {
                    const isActive = 
                      (progress / 100) * (currentEpisode.duration || 0) >= chapter.startTime && 
                      (progress / 100) * (currentEpisode.duration || 0) < (chapter.endTime || (currentEpisode.duration || 0));
                      
                    return (
                      <div 
                        key={index}
                        onClick={() => seek(chapter.startTime)}
                        className={`p-3 border-b border-white/10 last:border-0 flex justify-between items-center cursor-pointer transition-colors ${
                          isActive ? 'bg-white/15' : 'hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${isActive ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-white/10'}`}>
                            <span className="text-sm">
                              {isActive ? <Play size={14} /> : index + 1}
                            </span>
                          </div>
                          <span className={`ml-3 ${isActive ? 'text-white font-medium' : 'text-white/80'}`}>
                            {chapter.title}
                          </span>
                        </div>
                        <span className="text-sm text-white/60">
                          {formatTime(chapter.startTime)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-white/60">

                    <BookOpen size={32} className="mx-auto mb-3 text-white/40" />
                    <p>No chapter information available</p>
                  </div>
                )}
              </div>*/}
           
</div>
            {activeTab === 'notes' && (
              <div className="text-center py-8 text-white/60 bg-white/5 backdrop-blur-sm rounded-lg">
                <BookmarkPlus size={32} className="mx-auto mb-3 text-white/40" />
                <p>You haven't added any bookmarks yet</p>
                <button className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/90 text-sm transition-colors">
                  Add Your First Bookmark
                </button>
              </div>
            )}
          </div>

  
        {/* Global styles */}
        <style jsx global>{`
          .glow-effect {
            box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.3);
          }
          
          /* Custom range input styling */
          input[type=range] {
            -webkit-appearance: none;
            appearance: none;
            height: 4px;
            background: linear-gradient(to right, rgb(236, 72, 153), rgb(147, 51, 234));
            border-radius: 999px;
          }
          
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: white;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  // export default function NowPlaying() {
//   const {
//     currentBook,
//     currentEpisode,
//     isPlaying,
//     progress,
//     volume,
//     togglePlay,
//     seek,
//     setVolume,
//     nextTrack,
//     previousTrack,
//     playbackSpeed,
//     setPlaybackSpeed
//   } = usePlayer();

//   const router = useRouter();
//   const progressBarRef = useRef<HTMLDivElement>(null);
//   const [isLiked, setIsLiked] = useState(false);
//   const [activeTab, setActiveTab] = useState('details');

//   const handleProgressClick = (e: React.MouseEvent) => {
//     if (progressBarRef.current && currentBook && currentEpisode) {
//       const rect = progressBarRef.current.getBoundingClientRect();
//       const clickPosition = e.clientX - rect.left;
//       const percentage = (clickPosition / rect.width) * 100;
//       const seekTime = (percentage / 100) * currentEpisode.duration;
//       seek(seekTime);
//     }
//   };

//   const handleMinimize = () => {
//     router.back();
//   };

//   const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

//   if (!currentBook) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-6"
//       >
//         <div className="text-center p-8">
//           <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
//             <ListMusic size={32} className="text-gray-400" />
//           </div>
//           <h2 className="text-xl font-semibold text-gray-700 mb-2">No Audio Playing</h2>
//           <p className="text-gray-500 max-w-md">Select an audiobook from your library to start listening</p>
//         </div>
//       </motion.div>
//     );
//   }

//   const currentTime = formatTime((progress / 100) * (currentEpisode?.duration || currentBook.duration || 0));
//   const totalTime = formatTime(currentEpisode?.duration || currentBook.duration || 0);
//   const remainingTime = formatTime((currentEpisode?.duration || currentBook.duration || 0) - ((progress / 100) * (currentEpisode?.duration || currentBook.duration || 0)));

//   return (
//     <motion.div
//       initial={{ y: '100%' }}
//       animate={{ y: 0 }}
//       exit={{ y: '100%' }}
//       transition={{ type: "spring", stiffness: 300, damping: 30 }}
//       className="fixed inset-0 bg-gradient-to-b from-indigo-50 to-white z-50 overflow-auto"
//     >
//       {/* Header with minimize button */}
//       <div className="flex justify-between items-center p-6">
//         <button 
//           onClick={handleMinimize}
//           className="flex items-center text-gray-600 hover:text-indigo-700 transition-colors"
//         >
//           <ChevronDown size={24} />
//           <span className="ml-2 font-medium">Minimize</span>
//         </button>
//         <div className="flex items-center space-x-4">
//           <button 
//             onClick={() => setIsLiked(!isLiked)}
//             className={`${isLiked ? 'text-red-500' : 'text-gray-400'} hover:scale-110 transition-transform`}
//           >
//             <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
//           </button>
//           <button className="text-gray-500 hover:text-indigo-700 transition-colors">
//             <Share2 size={22} />
//           </button>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6">
//         <div className="w-full max-w-md flex flex-col items-center">
//           {/* Cover with shadow effect */}
//           <motion.div 
//             className="relative mb-10"
//             initial={{ scale: 0.8, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ delay: 0.2 }}
//           >
//             <div className="absolute -inset-1 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-2xl blur-md opacity-70"></div>
//             <img 
//               src={currentBook.coverImage} 
//               alt={currentBook.title} 
//               className="relative w-64 h-64 object-cover rounded-xl shadow-lg z-10"
//             />

//             {/* Series indicator */}
//             {currentBook.isSeries && currentEpisode && (
//               <div className="absolute -top-3 -right-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full px-3 py-1 shadow-md z-20">
//                 <div className="flex items-center space-x-1">
//                   <BookOpen size={14} />
//                   <span className="text-sm font-medium">Episode {currentEpisode.episodeNumber}</span>
//                 </div>
//               </div>
//             )}
//           </motion.div>
          
//           {/* Book info */}
//           <motion.div 
//             className="w-full mb-6 text-center"
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.3 }}
//           >
//             <h1 className="text-2xl font-bold text-gray-900 mb-1">{currentBook.title}</h1>
//             <p className="text-gray-600">{currentBook.author}</p>
            
//             {/* Series navigation if it's a series */}
//             {currentBook.isSeries && currentEpisode && (
//               <div className="flex justify-center items-center mt-3 space-x-2">
//                 {currentEpisode.episodeNumber > 1 && (
//                   <button 
//                     onClick={previousTrack}
//                     className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
//                   >
//                     Previous Episode
//                   </button>
//                 )}
//                 <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
//                   Episode {currentEpisode.episodeNumber}
//                 </div>
//                 {currentBook.episodes && currentEpisode.episodeNumber < currentBook.episodes.length && (
//                   <button 
//                     onClick={nextTrack}
//                     className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
//                   >
//                     Next Episode
//                   </button>
//                 )}
//               </div>
//             )}
//           </motion.div>

//           {/* Progress bar */}
//           <motion.div 
//             className="w-full mb-2"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.4 }}
//           >
//             <div 
//               ref={progressBarRef}
//               className="w-full h-2 bg-gray-200 rounded-full cursor-pointer relative"
//               onClick={handleProgressClick}
//             >
//               <div 
//                 className="absolute h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 ease-out" 
//                 style={{ width: `${progress}%` }}
//               />
//               <div 
//                 className="absolute h-4 w-4 rounded-full bg-white shadow-md border-2 border-indigo-500 top-1/2 -translate-y-1/2 transition-all duration-300"
//                 style={{ left: `calc(${progress}% - 8px)` }}
//               />
//             </div>
//           </motion.div>

//           {/* Time indicators */}
//           <motion.div 
//             className="flex justify-between w-full text-sm text-gray-500 mb-8"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.5 }}
//           >
//             <span>{currentTime}</span>
//             <span className="flex items-center">
//               <Clock size={14} className="mr-1" />
//               -{remainingTime} left
//             </span>
//           </motion.div>

//           {/* Controls */}
//           <motion.div 
//             className="flex items-center justify-center gap-8 mb-8"
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.6 }}
//           >
//             <button 
//               className="text-gray-600 hover:text-indigo-700 transition-colors"
//               onClick={previousTrack}
//             >
//               <SkipBack size={28} />
//             </button>
//             <button 
//               className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-full hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition shadow-md"
//               onClick={togglePlay}
//             >
//               {isPlaying ? <Pause size={32} /> : <Play size={32} fill="white" />}
//             </button>
//             <button 
//               className="text-gray-600 hover:text-indigo-700 transition-colors"
//               onClick={nextTrack}
//             >
//               <SkipForward size={28} />
//             </button>
//           </motion.div>

//           {/* Volume and speed controls */}
//           <motion.div 
//             className="flex flex-col w-full gap-4 mb-6"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.7 }}
//           >
//             {/* Volume control */}
//             <div className="flex items-center gap-3 w-full bg-gray-100 p-3 rounded-full">
//               <button 
//                 onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
//                 className={`${volume > 0 ? 'text-indigo-600' : 'text-gray-500'} hover:text-indigo-700 transition-colors`}
//               >
//                 {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
//               </button>
//               <input
//                 type="range"
//                 min="0"
//                 max="1"
//                 step="0.01"
//                 value={volume}
//                 onChange={(e) => setVolume(parseFloat(e.target.value))}
//                 className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600"
//               />
//             </div>

//             {/* Playback speed */}
//             <div className="flex justify-between items-center">
//               <span className="text-sm text-gray-600 font-medium">Playback Speed</span>
//               <div className="flex bg-gray-100 rounded-lg">
//                 {speedOptions.map((speed) => (
//                   <button
//                     key={speed}
//                     onClick={() => setPlaybackSpeed(speed)}
//                     className={`px-3 py-1 text-sm rounded-lg transition-colors ${
//                       playbackSpeed === speed 
//                         ? 'bg-indigo-600 text-white' 
//                         : 'text-gray-600 hover:bg-gray-200'
//                     }`}
//                   >
//                     {speed}x
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Bottom tabs - Details/Chapters */}
//       <motion.div 
//         className="border-t border-gray-200 pt-4 pb-8"
//         initial={{ y: 50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.8 }}
//       >
//         {/* Tab buttons */}
//         <div className="flex justify-center gap-8 mb-4">
//           <button 
//             className={`flex flex-col items-center transition-colors ${
//               activeTab === 'details' ? 'text-indigo-700' : 'text-gray-500 hover:text-indigo-600'
//             }`}
//             onClick={() => setActiveTab('details')}
//           >
//             <ListMusic size={20} />
//             <span className="text-xs mt-1">Details</span>
//             {activeTab === 'details' && (
//               <motion.div 
//                 layoutId="activeTabIndicator"
//                 className="h-1 w-12 bg-indigo-600 rounded-full mt-1" 
//               />
//             )}
//           </button>
//           <button 
//             className={`flex flex-col items-center transition-colors ${
//               activeTab === 'chapters' ? 'text-indigo-700' : 'text-gray-500 hover:text-indigo-600'
//             }`}
//             onClick={() => setActiveTab('chapters')}
//           >
//             <BookOpen size={20} />
//             <span className="text-xs mt-1">Chapters</span>
//             {activeTab === 'chapters' && (
//               <motion.div 
//                 layoutId="activeTabIndicator"
//                 className="h-1 w-12 bg-indigo-600 rounded-full mt-1" 
//               />
//             )}
//           </button>
//         </div>

//         {/* Tab content */}
//         <div className="px-6">
//           <AnimatePresence mode="wait">
//             {activeTab === 'details' && (
//               <motion.div
//                 key="details"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="max-w-md mx-auto"
//               >
//                 <p className="text-gray-700 text-sm leading-relaxed">
//                   {currentBook.description || "No description available for this audiobook."}
//                 </p>
                
//                 {/* Series info if applicable */}
//                 {currentBook.isSeries && currentEpisode && (
//                   <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
//                     <h4 className="font-medium text-indigo-800 mb-1">Series Information</h4>
//                     <p className="text-sm text-gray-700">
//                       This audiobook is episode {currentEpisode.episodeNumber} of {currentBook.seriesName}.
//                       {currentBook.totalEpisodes && ` There are ${currentBook.totalEpisodes} episodes in total.`}
//                     </p>
//                   </div>
//                 )}
                
//                 {/* Additional metadata */}
//                 <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <span className="text-gray-500">Narrator:</span> 
//                     <p className="text-gray-800 font-medium">{currentBook.narrator || "Unknown"}</p>
//                   </div>
//                   <div>
//                     <span className="text-gray-500">Duration:</span>
//                     <p className="text-gray-800 font-medium">
//                       {formatTime(currentEpisode?.duration || currentBook.duration || 0, true)}
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {activeTab === 'chapters' && (
//               <motion.div
//                 key="chapters"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 className="max-w-md mx-auto"
//               >
//                 {currentEpisode?.chapters ? (
//                   <div className="max-h-48 overflow-y-auto">
//                     {currentEpisode.chapters.map((chapter, index) => {
//                       const isActive = 
//                         (progress / 100) * (currentEpisode.duration || 0) >= chapter.startTime && 
//                         (progress / 100) * (currentEpisode.duration || 0) < (chapter.endTime || (currentEpisode.duration || 0));
                        
//                       return (
//                         <div 
//                           key={index}
//                           onClick={() => seek(chapter.startTime)}
//                           className={`p-3 border-b last:border-0 border-gray-100 flex justify-between items-center cursor-pointer ${
//                             isActive ? 'bg-indigo-50' : 'hover:bg-gray-50'
//                           }`}
//                         >
//                           <div className="flex items-center">
//                             <span className={`w-6 text-center ${isActive ? 'text-indigo-700 font-medium' : 'text-gray-500'}`}>
//                               {index + 1}
//                             </span>
//                             <span className={`ml-3 ${isActive ? 'text-indigo-800 font-medium' : 'text-gray-700'}`}>
//                               {chapter.title}
//                             </span>
//                           </div>
//                           <span className="text-sm text-gray-500">
//                             {formatTime(chapter.startTime)}
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 text-gray-500">
//                     <ListMusic size={32} className="mx-auto mb-3 text-gray-400" />
//                     <p>No chapter information available</p>
//                   </div>
//                 )}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// export default function NowPlaying() {
//     const {
//       currentBook,
//       currentEpisode,
//       isPlaying,
//       progress,
//       volume,
//       togglePlay,
//       seek,
//       setVolume,
//       nextTrack,
//       previousTrack,
//       playbackSpeed,
//       setPlaybackSpeed
//     } = usePlayer();
  
//     const router = useRouter();
//     const progressBarRef = useRef(null);
//     const [isLiked, setIsLiked] = useState(false);
//     const [activeTab, setActiveTab] = useState('details');
//     const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
//     const handleProgressClick = (e) => {
//       if (progressBarRef.current && currentBook && currentEpisode) {
//         const rect = progressBarRef.current.getBoundingClientRect();
//         const clickPosition = e.clientX - rect.left;
//         const percentage = (clickPosition / rect.width) * 100;
//         const seekTime = (percentage / 100) * currentEpisode.duration;
//         seek(seekTime);
//       }
//     };
  
//     const handleMinimize = () => {
//       router.back();
//     };
  
//     const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
  
//     if (!currentBook) {
//       return (
//         <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
//           <div className="text-center p-8">
//             <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
//               <ListMusic size={32} className="text-gray-500" />
//             </div>
//             <h2 className="text-xl font-semibold text-gray-700 mb-2">No Audiobook Selected</h2>
//             <p className="text-gray-500 max-w-md">Discover your next literary adventure from your library</p>
//             <button className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-full hover:shadow-lg transition shadow-md flex items-center justify-center mx-auto">
//               <BookOpen size={18} className="mr-2" />
//               Browse Library
//             </button>
//           </div>
//         </div>
//       );
//     }
  
//     const currentTime = formatTime((progress / 100) * (currentEpisode?.duration || currentBook.duration || 0));
//     const totalTime = formatTime(currentEpisode?.duration || currentBook.duration || 0);
//     const remainingTime = formatTime((currentEpisode?.duration || currentBook.duration || 0) - ((progress / 100) * (currentEpisode?.duration || currentBook.duration || 0)));
  
//     return (
//       <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900 z-50 overflow-auto text-white">
//         {/* Top bar */}
//         <div className="flex justify-between items-center p-4 md:p-6">
//           <button 
//             onClick={handleMinimize}
//             className="flex items-center text-white/80 hover:text-white transition-colors"
//           >
//             <ChevronDown size={24} />
//             <span className="ml-2 font-medium">Minimize</span>
//           </button>
//           <div className="flex items-center space-x-4">
//             <button 
//               onClick={() => setIsLiked(!isLiked)}
//               className={`${isLiked ? 'text-pink-400' : 'text-white/70'} hover:scale-110 transition-all`}
//             >
//               <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
//             </button>
//             <button className="text-white/70 hover:text-white transition-colors">
//               <Share2 size={22} />
//             </button>
//           </div>
//         </div>
  
//         {/* Main content with glassmorphism effect */}
//         <div className="flex-1 flex flex-col items-center px-4 pb-8 mt-4">
//           <div className="w-full max-w-md backdrop-blur-xl bg-white/10 rounded-3xl p-6 shadow-2xl">
//             {/* Cover with effects */}
//             <div className="relative mb-8 mx-auto">
//               <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/30 to-purple-500/30 rounded-3xl blur-xl"></div>
//               <div className="absolute -inset-1 bg-gradient-to-br from-indigo-400/40 to-purple-500/40 rounded-3xl blur-md"></div>
//               <div className="relative rounded-2xl overflow-hidden aspect-square max-w-xs mx-auto">
//                 <img 
//                   src={currentBook.coverImage} 
//                   alt={currentBook.title} 
//                   className="w-full h-full object-cover shadow-lg"
//                 />
                
//                 {/* Vinyl record effect behind the cover */}
//                 <div className="absolute -z-10 inset-0 bg-black rounded-full scale-125 opacity-60"></div>
//                 <div className="absolute -z-10 inset-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full"></div>
//                 <div className="absolute -z-10 inset-0 m-auto w-8 h-8 bg-white/80 rounded-full"></div>
                
//                 {/* Play indicator */}
//                 {isPlaying && (
//                   <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2">
//                     <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                   </div>
//                 )}
//               </div>
                
//               {/* Series indicator */}
//               {currentBook.isSeries && currentEpisode && (
//                 <div className="absolute -top-3 -right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full px-3 py-1 shadow-lg z-20">
//                   <div className="flex items-center space-x-1">
//                     <BookOpen size={14} />
//                     <span className="text-sm font-medium">Episode {currentEpisode.episodeNumber}</span>
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             {/* Book info */}
//             <div className="mb-6 text-center">
//               <h1 className="text-2xl font-bold text-white mb-1">{currentBook.title}</h1>
//               <p className="text-white/70">{currentBook.author}</p>
              
//               {/* Series navigation if it's a series */}
//               {currentBook.isSeries && currentEpisode && (
//                 <div className="flex justify-center items-center mt-4 space-x-2">
//                   {currentEpisode.episodeNumber > 1 && (
//                     <button 
//                       onClick={previousTrack}
//                       className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm hover:bg-white/20 transition-all"
//                     >
//                       Previous Episode
//                     </button>
//                   )}
//                   <div className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
//                     Episode {currentEpisode.episodeNumber}
//                   </div>
//                   {currentBook.episodes && currentEpisode.episodeNumber < currentBook.episodes.length && (
//                     <button 
//                       onClick={nextTrack}
//                       className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-sm hover:bg-white/20 transition-all"
//                     >
//                       Next Episode
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
  
//             {/* Progress bar */}
//             <div className="w-full mb-2 px-4">
//               <div 
//                 ref={progressBarRef}
//                 className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative overflow-hidden"
//                 onClick={handleProgressClick}
//               >
//                 <div 
//                   className="absolute h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-300 ease-out" 
//                   style={{ width: `${progress}%` }}
//                 />
//                 <div 
//                   className="absolute h-4 w-4 rounded-full bg-white shadow-lg top-1/2 -translate-y-1/2 transition-all duration-300 glow-effect"
//                   style={{ left: `calc(${progress}% - 8px)` }}
//                 />
//               </div>
//             </div>
  
//             {/* Time indicators */}
//             <div className="flex justify-between w-full text-sm text-white/70 mb-6 px-4">
//               <span>{currentTime}</span>
//               <span className="flex items-center">
//                 <Clock size={14} className="mr-1" />
//                 -{remainingTime} left
//               </span>
//             </div>
  
//             {/* Controls */}
//             <div className="flex items-center justify-center gap-8 mb-8">
//               <button 
//                 className="text-white/70 hover:text-white transition-colors"
//                 onClick={() => seek(Math.max(0, ((progress / 100) * (currentEpisode?.duration || 0)) - 15))}
//               >
//                 <Rewind size={22} />
//               </button>
//               <button 
//                 className="text-white/70 hover:text-white transition-colors"
//                 onClick={previousTrack}
//               >
//                 <SkipBack size={26} />
//               </button>
//               <button 
//                 className="p-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition transform hover:scale-105 shadow-md"
//                 onClick={togglePlay}
//               >
//                 {isPlaying ? <Pause size={28} /> : <Play size={28} fill="white" />}
//               </button>
//               <button 
//                 className="text-white/70 hover:text-white transition-colors"
//                 onClick={nextTrack}
//               >
//                 <SkipForward size={26} />
//               </button>
//               <button 
//                 className="text-white/70 hover:text-white transition-colors"
//                 onClick={() => seek(Math.min((currentEpisode?.duration || 0), ((progress / 100) * (currentEpisode?.duration || 0)) + 15))}
//               >
//                 <FastForward size={22} />
//               </button>
//             </div>
  
//             {/* Volume and speed controls */}
//             <div className="flex flex-col w-full gap-4 mb-6 px-4">
//               {/* Volume control */}
//               <div className="relative">
//                 <div className="flex items-center gap-3 w-full">
//                   <button 
//                     onClick={() => setShowVolumeSlider(!showVolumeSlider)}
//                     className={`${volume > 0 ? 'text-white' : 'text-white/50'} hover:text-white transition-colors`}
//                   >
//                     {volume === 0 ? <VolumeX size={20} /> : 
//                      volume < 0.3 ? <Volume1 size={20} /> : 
//                      volume < 0.7 ? <Volume2 size={20} /> : 
//                      <Volume2 size={20} />}
//                   </button>
                  
//                   <div className="relative flex-1">
//                     {showVolumeSlider && (
//                       <div className="absolute bottom-full mb-2 left-0 right-0 bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-lg transition-all">
//                         <input
//                           type="range"
//                           min="0"
//                           max="1"
//                           step="0.01"
//                           value={volume}
//                           onChange={(e) => setVolume(parseFloat(e.target.value))}
//                           className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
//                         />
//                         <div className="flex justify-between text-xs text-white/60 mt-1">
//                           <span>0%</span>
//                           <span>50%</span>
//                           <span>100%</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Speed control */}
//                   <div className="flex items-center">
//                     <span className="text-white/70 mr-2 text-sm">Speed</span>
//                     <div className="relative group">
//                       <button className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/90 hover:bg-white/20 transition-all">
//                         {playbackSpeed}x
//                       </button>
                      
//                       <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block z-10">
//                         <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 shadow-lg">
//                           <div className="grid grid-cols-2 gap-1">
//                             {speedOptions.map((speed) => (
//                               <button
//                                 key={speed}
//                                 onClick={() => setPlaybackSpeed(speed)}
//                                 className={`px-3 py-1 text-sm rounded-md transition-colors ${
//                                   playbackSpeed === speed 
//                                     ? 'bg-white/30 text-white' 
//                                     : 'text-white/70 hover:bg-white/20'
//                                 }`}
//                               >
//                                 {speed}x
//                               </button>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
  
//         {/* Bottom tabs with frosted glass effect */}
//         <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/10 border-t border-white/20 pt-4 pb-6">
//           {/* Tab buttons */}
//           <div className="flex justify-center gap-10 mb-4">
//             <button 
//               className={`flex flex-col items-center transition-colors ${
//                 activeTab === 'details' ? 'text-white' : 'text-white/50 hover:text-white/80'
//               }`}
//               onClick={() => setActiveTab('details')}
//             >
//               <Info size={18} />
//               <span className="text-xs mt-1">Details</span>
//               {activeTab === 'details' && (
//                 <div className="h-0.5 w-10 bg-white rounded-full mt-1" />
//               )}
//             </button>
//             <button 
//               className={`flex flex-col items-center transition-colors ${
//                 activeTab === 'chapters' ? 'text-white' : 'text-white/50 hover:text-white/80'
//               }`}
//               onClick={() => setActiveTab('chapters')}
//             >
//               <BookOpen size={18} />
//               <span className="text-xs mt-1">Chapters</span>
//               {activeTab === 'chapters' && (
//                 <div className="h-0.5 w-10 bg-white rounded-full mt-1" />
//               )}
//             </button>
//             <button 
//               className={`flex flex-col items-center transition-colors ${
//                 activeTab === 'notes' ? 'text-white' : 'text-white/50 hover:text-white/80'
//               }`}
//               onClick={() => setActiveTab('notes')}
//             >
//               <BookmarkPlus size={18} />
//               <span className="text-xs mt-1">Bookmarks</span>
//               {activeTab === 'notes' && (
//                 <div className="h-0.5 w-10 bg-white rounded-full mt-1" />
//               )}
//             </button>
//           </div>
  
//           {/* Tab content */}
//           <div className="px-4 md:px-6 max-w-lg mx-auto">
//             {activeTab === 'details' && (
//               <div className="text-white/90 text-sm leading-relaxed">
//                 <p>
//                   {currentBook.description || "No description available for this audiobook."}
//                 </p>
                
//                 {/* Series info if applicable */}
//                 {currentBook.isSeries && currentEpisode && (
//                   <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
//                     <h4 className="font-medium text-white mb-1">Series Information</h4>
//                     <p className="text-sm text-white/80">
//                       This audiobook is episode {currentEpisode.episodeNumber} of {currentBook.seriesName}.
//                       {currentBook.totalEpisodes && ` There are ${currentBook.totalEpisodes} episodes in total.`}
//                     </p>
//                   </div>
//                 )}
                
//                 {/* Additional metadata */}
//                 <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
//                   <div>
//                     <span className="text-white/60">Narrator:</span> 
//                     <p className="text-white font-medium">{currentBook.narrator || "Unknown"}</p>
//                   </div>
//                   <div>
//                     <span className="text-white/60">Duration:</span>
//                     <p className="text-white font-medium">
//                       {formatTime(currentEpisode?.duration || currentBook.duration || 0, true)}
//                     </p>
//                   </div>
//                   <div>
//                     <span className="text-white/60">Publisher:</span> 
//                     <p className="text-white font-medium">{currentBook.publisher || "Unknown"}</p>
//                   </div>
//                   <div>
//                     <span className="text-white/60">Release Date:</span>
//                     <p className="text-white font-medium">{currentBook.releaseDate || "Unknown"}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
  
//             {activeTab === 'chapters' && (
//               <div className="max-h-48 overflow-y-auto bg-white/5 backdrop-blur-sm rounded-lg">
//                 {currentEpisode?.episodes ? (
//                   currentEpisode.episodes.map((chapter, index) => {
//                     const isActive = 
//                       (progress / 100) * (currentEpisode.duration || 0) >= chapter.startTime && 
//                       (progress / 100) * (currentEpisode.duration || 0) < (chapter.endTime || (currentEpisode.duration || 0));
                      
//                     return (
//                       <div 
//                         key={index}
//                         onClick={() => seek(chapter.startTime)}
//                         className={`p-3 border-b border-white/10 last:border-0 flex justify-between items-center cursor-pointer transition-colors ${
//                           isActive ? 'bg-white/15' : 'hover:bg-white/10'
//                         }`}
//                       >
//                         <div className="flex items-center">
//                           <div className={`w-8 h-8 flex items-center justify-center rounded-full ${isActive ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-white/10'}`}>
//                             <span className="text-sm">
//                               {isActive ? <Play size={14} /> : index + 1}
//                             </span>
//                           </div>
//                           <span className={`ml-3 ${isActive ? 'text-white font-medium' : 'text-white/80'}`}>
//                             {chapter.title}
//                           </span>
//                         </div>
//                         <span className="text-sm text-white/60">
//                           {formatTime(chapter.startTime)}
//                         </span>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <div className="text-center py-8 text-white/60">
//                     <BookOpen size={32} className="mx-auto mb-3 text-white/40" />
//                     <p>No chapter information available</p>
//                   </div>
//                 )}
//               </div>
//             )}
  
//             {activeTab === 'notes' && (
//               <div className="text-center py-8 text-white/60 bg-white/5 backdrop-blur-sm rounded-lg">
//                 <BookmarkPlus size={32} className="mx-auto mb-3 text-white/40" />
//                 <p>You haven't added any bookmarks yet</p>
//                 <button className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/90 text-sm transition-colors">
//                   Add Your First Bookmark
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
  
//         {/* Global styles */}
//         <style jsx global>{`
//           .glow-effect {
//             box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.3);
//           }
          
//           /* Custom range input styling */
//           input[type=range] {
//             -webkit-appearance: none;
//             appearance: none;
//             height: 4px;
//             background: linear-gradient(to right, rgb(236, 72, 153), rgb(147, 51, 234));
//             border-radius: 999px;
//           }
          
//           input[type=range]::-webkit-slider-thumb {
//             -webkit-appearance: none;
//             appearance: none;
//             width: 12px;
//             height: 12px;
//             border-radius: 50%;
//             background: white;
//             box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
//             cursor: pointer;
//           }
//         `}</style>
//       </div>
//     );
//   }