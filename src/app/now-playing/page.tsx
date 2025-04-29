'use client'
import { Bookmark, ChevronLeft, Clock, Heart, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { useState } from "react";

const NowPlayingView = () => {
    const [isPlaying,setIsPlaying]=useState(false)
    return (
    <div className="flex flex-col items-center gap-8 pb-24 mt-8 text-black">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 rounded-full bg-gray-100">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-semibold">Now Playing</h2>
          <button className="p-2 rounded-full bg-gray-100">
            <Heart size={20} />
          </button>
        </div>
        
        <img src="/api/placeholder/400/400" alt="Book cover" className="w-full aspect-square object-cover rounded-lg shadow-lg mb-8" />
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-1">The Great Gatsby</h2>
          <p className="text-gray-600">F. Scott Fitzgerald</p>
        </div>
        
        <div className="w-full mb-6">
          <div className="w-full bg-gray-200 h-1 rounded-full mb-2">
            <div className="bg-blue-500 h-1 rounded-full w-3/5"></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>4:32</span>
            <span>-3:48</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-6">
          <button className="p-3 text-gray-700">
            <SkipBack size={24} />
          </button>
          <button 
            className="p-4 bg-blue-500 text-white rounded-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>
          <button className="p-3 text-gray-700">
            <SkipForward size={24} />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-8">
          <button className="flex items-center gap-1 text-sm text-gray-600">
            <Volume2 size={18} />
            <span>1.0x</span>
          </button>
          <button className="flex items-center gap-1 text-sm text-gray-600">
            <Clock size={18} />
            <span>Sleep Timer</span>
          </button>
          <button className="flex items-center gap-1 text-sm text-gray-600">
            <Bookmark size={18} />
            <span>Bookmark</span>
          </button>
        </div>
      </div>
    </div>
  )};

  export default NowPlayingView