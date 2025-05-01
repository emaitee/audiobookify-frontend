'use client'
import { Play, Pause } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useRouter } from 'next/navigation';

export default function Player() {
  const router = useRouter();
  const { currentBook, isPlaying, togglePlay, progress } = usePlayer();

  if (!currentBook) return null;

  return (
    <div 
      className="fixed bottom-16 left-4 right-4 max-w-3xl mx-auto bg-white border rounded-lg shadow-lg p-3 flex items-center gap-3 cursor-pointer"
      onClick={() => router.push('/now-playing')}
    >
      <img 
        src={currentBook.coverImage} 
        alt={currentBook.title} 
        className="w-12 h-12 rounded object-cover" 
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm truncate">{currentBook.title}</h3>
        <p className="text-xs text-gray-600 truncate">{currentBook.author}</p>
        <div className="w-full bg-gray-200 h-1 rounded-full mt-1">
          <div 
            className="bg-indigo-500 h-1 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <button 
        className="p-2 bg-indigo-500 text-white rounded-full flex-shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
    </div>
  );
}