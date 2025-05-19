
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX,
  Bookmark, Heart, ChevronDown, Clock, Rewind, Share2, MessageCircleHeart
} from "lucide-react";

interface FullscreenPlayerProps {
  currentBook: any;
  currentEpisode: any;
  isPlaying: boolean;
  progress: number;
  volume: number;
  isLiked: boolean;
  currentTime: string;
  remainingTime: string;
  progressContainerRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  togglePlay: () => void;
  previousTrack: () => void;
  nextTrack: () => void;
  setVolume: (volume: number) => void;
  setShowVolumeSlider: (show: boolean) => void;
  showVolumeSlider: boolean;
  seek: (percentage: number) => void;
  setActiveTab: (tab: string) => void;
  setIsLiked: (liked: boolean) => void;
  handleProgressMouseDown: (e: React.MouseEvent) => void;
  handleProgressTouchStart: (e: React.TouchEvent) => void;
  onClose: () => void;
}

const FullscreenPlayer = ({
  currentBook,
  currentEpisode,
  isPlaying,
  progress,
  volume,
  isLiked,
  currentTime,
  remainingTime,
  progressContainerRef,
  isDragging,
  togglePlay,
  previousTrack,
  nextTrack,
  setVolume,
  setShowVolumeSlider,
  showVolumeSlider,
  seek,
  setActiveTab,
  setIsLiked,
  handleProgressMouseDown,
  handleProgressTouchStart,
  onClose
}: FullscreenPlayerProps) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900 z-50 flex flex-col md:hidden animate-scale-in">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <button 
          onClick={onClose}
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
          <p className="text-white/80">{currentBook.author.name}</p>
          <p className="text-white/60 text-sm">
            {currentEpisode?.title || currentBook.title}
          </p>
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
            className="text-white/80 hover:text-white transition-colors transform hover:scale-110"
            onClick={previousTrack}
          >
            <SkipBack size={28} />
          </button>
          <button 
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition transform hover:scale-105 shadow-md"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" fill="white" />}
          </button>
          <button 
            className="text-white/80 hover:text-white transition-colors transform hover:scale-110"
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
              onClose();
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
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-lg p-3 shadow-lg w-40 animate-fade-in">
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
    </div>
  );
};

export default FullscreenPlayer;