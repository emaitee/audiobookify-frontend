'use client'
import { useRouter } from 'next/navigation';
import React from 'react'
import { Play, Pause, } from 'lucide-react';

interface PlayerProps {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
}

function Player({ isPlaying, setIsPlaying }: PlayerProps) {
    const router = useRouter()
  return (
<div 
          className="fixed bottom-16 left-4 right-4 max-w-3xl mx-auto bg-white border rounded-lg shadow-lg p-3 flex items-center gap-3"
          onClick={() => router.push('player')}
        >
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtmKvVXY7v2epRmCPTFdvEmfNH8158b-XX0A&s" alt="Current book" className="w-12 h-12 rounded object-cover" />
          <div className="flex-1">
            <h3 className="font-medium text-sm">The Great Gatsby</h3>
            <p className="text-xs text-gray-600">F. Scott Fitzgerald</p>
          </div>
          <button 
            className="p-2 bg-blue-500 text-white rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
  )
}

export default Player