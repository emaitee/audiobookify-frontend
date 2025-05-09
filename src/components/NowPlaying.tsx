// Add these imports at the top of your file if not already present
import { usePlayer } from '@/context/PlayerContext';
import { 
    ChevronDown, X, Heart, Share2, BookOpen, ListMusic, 
    Clock, Rewind, SkipBack, Play, Pause, SkipForward, 
    FastForward, VolumeX, Volume1, Volume2, Info, 
    BookmarkPlus 
  } from 'lucide-react';
  import Link from 'next/link';
  import { useRouter } from 'next/navigation';
  import { useEffect, useRef, useState } from 'react';
  
  // Helper function to format time (HH:MM:SS or MM:SS)
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
    const progressBarRef = useRef<HTMLDivElement>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
    interface ProgressClickEvent extends React.MouseEvent<HTMLDivElement> {}
  
    const handleProgressClick = (e: ProgressClickEvent): void => {
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

    // useEffect(() => {
    //   document.addEventListener('keydown', (e) => {
    //     if (e.target.tagName === 'INPUT') return; // Ignore if typing
        
    //     switch (e.key) {
    //       case ' ':
    //         isPlaying ? play() : pause();
    //         break;
    //       case 'ArrowRight':
    //         audio.currentTime += 15;
    //         break;
    //       case 'ArrowLeft':
    //         audio.currentTime -= 15;
    //         break;
    //       case 'm':
    //         audio.muted = !audio.muted;
    //         break;
    //     }
    //   });
    // }, [])
  
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
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900 z-50 overflow-hidden text-white lg:flex lg:items-center lg:justify-center">
        {/* Container for desktop view */}
        <div className="lg:w-3/4 lg:max-w-5xl lg:h-3/4 lg:max-h-[800px] lg:rounded-3xl lg:overflow-hidden lg:flex lg:shadow-2xl lg:bg-gradient-to-br lg:from-indigo-900/90 lg:to-purple-900/90">
          {/* Top bar (mobile only) */}
          <div className="flex justify-between items-center p-4 md:p-6 sticky top-0 z-10 backdrop-blur-sm bg-gradient-to-b from-indigo-900/90 to-indigo-900/60 lg:hidden">
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
  
          {/* Desktop sidebar (left panel) */}
          <div className="hidden lg:flex lg:flex-col lg:w-1/2 lg:p-8 lg:relative">
            {/* Close button for desktop */}
            <button 
              onClick={handleMinimize}
              className="absolute top-6 left-6 flex items-center text-white/80 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            {/* Cover with effects */}
            <div className="relative flex-1 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/30 to-purple-500/30 rounded-3xl blur-xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-br from-indigo-400/40 to-purple-500/40 rounded-3xl blur-md"></div>
              <div className="relative rounded-2xl overflow-hidden aspect-square w-full max-w-md">
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
                <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full px-3 py-1 shadow-lg z-20">
                  <div className="flex items-center space-x-1">
                    <BookOpen size={14} />
                    <span className="text-sm font-medium">Episode {currentEpisode.episodeNumber}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Bottom action buttons for desktop */}
            <div className="hidden lg:flex lg:mt-6 lg:justify-end lg:space-x-4">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-full ${isLiked ? 'text-pink-400 bg-pink-400/10' : 'text-white/70 bg-white/5 hover:bg-white/10'} transition-all`}
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button className="p-3 rounded-full text-white/70 bg-white/5 hover:bg-white/10 transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>
          
          {/* Main content container */}
          <div className="flex-1 flex flex-col overflow-hidden lg:border-l lg:border-white/10">
            {/* Content container with proper bottom padding */}
            <div className="flex-1 flex flex-col items-center px-4 pb-40 mt-4 overflow-auto lg:pb-6 lg:pt-6 lg:px-8">
              <div className="w-full max-w-md backdrop-blur-xl bg-white/10 rounded-3xl p-6 shadow-2xl lg:bg-transparent lg:shadow-none lg:backdrop-blur-none">
                {/* Book info - hidden on desktop to avoid duplication */}
                <div className="mb-8 mx-auto lg:hidden">
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
                <div className="mb-6 text-center lg:text-left lg:mb-8">
                  <h1 className="text-2xl font-bold text-white mb-1 lg:text-3xl">{currentBook.title}</h1>
                  <p className="text-white/70">{currentBook.author.name}</p>

                  {isTransitioning && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                  )}
                  
                  {/* Series navigation if it's a series */}
                  {currentBook.isSeries && currentEpisode && (
                    <div className="flex justify-center items-center mt-4 space-x-2 lg:justify-start">
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
                <div className="w-full mb-2 px-4 lg:px-0">
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
                <div className="flex justify-between w-full text-sm text-white/70 mb-6 px-4 lg:px-0">
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
                <div className="flex flex-col w-full gap-4 mb-6 px-4 lg:px-0">
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
            
              {/* Desktop only - Tab content directly visible */}
              <div className="hidden lg:block lg:w-full lg:max-w-md lg:mt-4">
                {/* Tabs switcher for desktop */}
                <div className="flex border-b border-white/20 mb-4">
                  <button 
                    className={`px-4 py-2 transition-colors ${
                      activeTab === 'details' ? 'text-white border-b-2 border-white' : 'text-white/50 hover:text-white/80'
                    }`}
                    onClick={() => setActiveTab('details')}
                  >
                    Details
                  </button>
                  <button 
                    className={`px-4 py-2 transition-colors ${
                      activeTab === 'chapters' ? 'text-white border-b-2 border-white' : 'text-white/50 hover:text-white/80'
                    }`}
                    onClick={() => setActiveTab('chapters')}
                  >
                    Chapters
                  </button>
                  <button 
                    className={`px-4 py-2 transition-colors ${
                      activeTab === 'notes' ? 'text-white border-b-2 border-white' : 'text-white/50 hover:text-white/80'
                    }`}
                    onClick={() => setActiveTab('notes')}
                  >
                    Bookmarks
                  </button>
                </div>
                
                {/* Tab content */}
                <div className="text-white/90 text-sm leading-relaxed">
                  {activeTab === 'details' && (
                    <div>
                      <p>
                        {currentBook.description || "No description available for this audiobook."}
                      </p>
                      
                      {/* Series info if applicable */}
                      {currentBook.isSeries && currentEpisode && (
                        <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                          <h4 className="font-medium text-white mb-1">Series Information</h4>
                          <p className="text-sm text-white/80">
                            This audiobook is episode {currentEpisode.episodeNumber} of {currentBook?.title}.
                            {currentBook.totalEpisodes && ` There are ${currentBook.totalEpisodes} episodes in total.`}
                          </p>
                        </div>
                      )}
                      
                      {/* Additional metadata */}
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-white/60">Narrator:</span> 
                          <p className="text-white font-medium">{currentBook.narrator.name || "Unknown"}</p>
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
                    <div className="max-h-64 overflow-y-auto bg-white/5 backdrop-blur-sm rounded-lg">
                      {currentBook?.episodes ? (
                        currentBook.episodes.map((episode) => {
                          const isCurrent = currentEpisode?._id === episode._id;
                          
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
                        })
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <ListMusic size={32} className="mx-auto mb-3 text-gray-500" />
                          <p>No episodes available</p>
                        </div>
                      )}
                    </div>
                  )}
                
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
              </div>
            </div>
    
            {/* Bottom tabs with frosted glass effect - mobile only */}
            <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/10 border-t border-white/20 pt-4 pb-6 z-20 lg:hidden">
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
                          This audiobook is episode {currentEpisode.episodeNumber} of {currentBook?.title}.
                          {currentBook.totalEpisodes && ` There are ${currentBook.totalEpisodes} episodes in total.`}
                        </p>
                      </div>
                    )}
                    
                    {/* Additional metadata */}
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-white/60">Narrator:</span> 
                        <p className="text-white font-medium">{currentBook.narrator.name || "Unknown"}</p>
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
                  <div className="max-h-48 overflow-y-auto bg-white/5 backdrop-blur-sm rounded-lg">
                    {currentBook?.episodes ? (
                      currentBook.episodes.map((episode) => {
                        const isCurrent = currentEpisode?._id === episode._id;
                        
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
                      })
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <ListMusic size={32} className="mx-auto mb-3 text-gray-500" />
                          <p>No episodes available</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

      </div>
    );
  }