import { Play, Pause, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface MiniPlayerProps {
  currentBook: any;
  currentEpisode: any;
  isPlaying: boolean;
  progress: number;
  togglePlay: () => void;
  nextTrack: () => void;
  onExpand: () => void;
}

const MiniPlayer = ({
  currentBook,
  currentEpisode,
  isPlaying,
  progress,
  togglePlay,
  nextTrack,
  onExpand
}: MiniPlayerProps) => {
  return (
    <div className="fixed bottom-16 left-0 right-0 bg-gradient-to-r from-indigo-900 to-purple-800 text-white shadow-lg border-t border-white/10 p-3 md:hidden z-10">
      <div className="flex items-center justify-between" onClick={onExpand}>
        <div className="flex items-center">
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
        <div className="flex items-center space-x-4" onClick={e => e.stopPropagation()}>
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
          className={cn(
            "h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-width duration-300",
          )}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MiniPlayer;
