'use client'
import { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApiHelper } from '@/app/utils/api';
import { Book, Episode } from '@/app/[locale]/page';
import { useDebounceFn } from '@/hooks/useDebounce';

interface PlayerContextType {
  currentBook: Book | null;
  currentEpisode: Episode | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  playbackSpeed: number;
  allBooks: Book[];
  loading: boolean;
  error: string | null;
  play: (book: Book, episode?: Episode) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setCurrentBook: (book: Book) => void;
  refreshLibrary: () => Promise<void>;
  updateListenHistory?: (bookId: string, progress: number, episodeId?: string) => Promise<void>;
  recordPlaybackSession: (duration: number) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<string | null>(null); // Track current audio source

  const recordPlaybackSession = async (duration: number) => {
    if (!currentBook) return;
    
    try {
      await authApiHelper.post('/listening-sessions', {
        audiobookId: currentBook._id,
        episodeId: currentEpisode?._id,
        duration,
        completionRate: duration / (currentEpisode?.duration || currentBook.duration)
      });
      
      // Update local state if needed
      if (currentEpisode) {
        setCurrentEpisode(prev => ({
          ...prev!,
          listenCount: (prev?.listenCount || 0) + 1
        }));
      }
    } catch (err) {
      console.error('Failed to record session:', err);
    }
  };

  // Helper function to update listen history
  const updateListenHistory = async (bookId: string, progress: number, episodeId?: string) => {
    try {
      await authApiHelper.patch(`/books/${bookId}/listen`, {
        progress,
        episodeId
      });
    } catch (err) {
      console.error('Failed to update listen history:', err);
    }
  };

  const immediateProgressUpdate = async (bookId: string, progress: number, episodeId?: string) => {
    await updateListenHistory(bookId, progress, episodeId);
  };

  const { debouncedFn: debouncedProgressUpdate, flush: flushProgressUpdates } = useDebounceFn(
    (bookId: string, progress: number, episodeId?: string) => {
      updateListenHistory(bookId, progress, episodeId);
    },
    30000 // 30 second delay
  );

  // Memoize fetchBooks to prevent unnecessary changes
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApiHelper.get('/books');
      if (!response?.ok) throw new Error(`HTTP error! status: ${response?.status}`);
  
      const data = await response.json();
      setAllBooks(data.books);
  
      // Only update currentBook if it's found
      setCurrentBook(prev => {
        if (!prev) return prev;
        const updatedBook: Book | undefined = data.books.find((b: Book) => b._id === prev._id);
        return updatedBook || prev;
      });
  
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Update current episode when books are refreshed
  useEffect(() => {
    if (!currentBook || !currentEpisode) return;
  
    const updatedBook = allBooks.find(b => b._id === currentBook._id);
    if (!updatedBook) return;
  
    const updatedEpisode = updatedBook.episodes?.find(ep => ep._id === currentEpisode._id);
    if (updatedEpisode) {
      setCurrentEpisode(updatedEpisode);
    }
  }, [allBooks, currentBook, currentEpisode]);


  
  // Initialize audio element and set up event listeners
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;
    audio.playbackRate = playbackSpeed;

    // Audio event handlers
    const handleTimeUpdate = () => {
      if (!audio.currentTime || !audio.duration) return;
      const newProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(newProgress) ? 0 : newProgress);
      
      if (currentBook) {
        debouncedProgressUpdate(currentBook._id, audio.currentTime, currentEpisode?._id);
      }
    };

    const handleEnded = async () => {
      setIsPlaying(false);
      
      // Record full playback session
      if (currentBook && audio.duration) {
        await recordPlaybackSession(audio.duration);
      }
  
      if (currentBook?.isSeries && currentEpisode) {
        const nextEp = currentBook.episodes?.find(
          ep => ep.episodeNumber === currentEpisode.episodeNumber + 1
        );
        nextEp && play(currentBook, nextEp);
      }
    };
  

    // const handlePause = () => {
    //   setIsPlaying(false);
    //   if (currentBook && audio.currentTime) {
    //     flushProgressUpdates();
    //     immediateProgressUpdate(currentBook._id, audio.currentTime, currentEpisode?._id);
    //   }
    // };

    const handlePause = async () => {
      setIsPlaying(false);
      if (currentBook && audio.currentTime > 5) { // Only record if listened >5s
        await recordPlaybackSession(audio.currentTime);
      }
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', e);
      setError('Audio playback error. Check your connection or file format.');
      setIsPlaying(false);
    };

    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    // Cleanup
    return () => {
      flushProgressUpdates();
      if (currentBook && audio.currentTime > 0) {
        immediateProgressUpdate(currentBook._id, audio.currentTime, currentEpisode?._id);
      }
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = ''; // Clear source
      audioRef.current = null;
    };
  }, []); // Empty dependency array as we want this to run once

  // Handle updates to volume and playback speed
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = volume;
    audio.playbackRate = playbackSpeed;
  }, [volume, playbackSpeed]);

  // Initial fetch of books
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Update audio source when episode changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentEpisode?.audioFile) return;
    
    // Only update the source if it's different
    if (audioSourceRef.current !== currentEpisode.audioFile) {
      console.log(`Setting new audio source: ${currentEpisode.audioFile}`);
      audio.src = currentEpisode.audioFile;
      audioSourceRef.current = currentEpisode.audioFile;
      
      // If we're supposed to be playing, restart after changing source
      if (isPlaying) {
        audio.play().catch(err => {
          console.error('Failed to play after source change:', err);
          setIsPlaying(false);
          setError('Failed to play audio. Check your connection or file format.');
        });
      }
    }
  }, [currentEpisode, isPlaying]);

  useEffect(() => {
    if (!isPlaying || !currentBook) return;
  
    const interval = setInterval(async () => {
      if (audioRef.current?.currentTime) {
        await recordPlaybackSession(audioRef.current.currentTime);
      }
    }, 30000); // Record every 30 seconds
  
    return () => clearInterval(interval);
  }, [isPlaying, currentBook]);

  // Update playback state if isPlaying changes but audio state doesn't match
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Synchronize the actual audio state with our isPlaying state
    if (isPlaying && audio.paused) {
      audio.play().catch(err => {
        console.error('Failed to play:', err);
        setIsPlaying(false);
        setError('Failed to play audio. Check your connection or file format.');
      });
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [isPlaying]);

  const play = async (book: Book, episode?: Episode) => {
    if (!audioRef.current) return;
  
    try {
      // Find the book in our allBooks array to ensure we have the latest data
      const freshBook = allBooks.find(b => b._id === book._id) || book;

      // console.log(book, allBooks)
  
      // Determine which episode to play with priority:
      // 1. Explicitly passed episode
      // 2. First episode
      let playEpisode = episode;
      if (!playEpisode && freshBook?.episodes?.length) {
        playEpisode = freshBook.episodes[0];
      }
  
      if (!playEpisode) {
        console.error('No episode available to play');
        setError('No episode available to play');
        return;
      }
  
      // Update UI state first for immediate feedback
      setCurrentBook(freshBook);
      setCurrentEpisode(playEpisode);
      
      // Audio source will be updated in the useEffect
      // Set initial progress
      audioRef.current.currentTime = 0;
      
      // Call API to update listen count and history
      if (freshBook?._id) {
        await updateListenHistory(freshBook._id, 0, playEpisode._id);
      } else {
        console.error('Book ID is undefined');
      }
  
      // Set isPlaying to true - actual playback will be handled by useEffect
      setIsPlaying(true);
      
    } catch (err) {
      console.error('Playback failed:', err);
      setError('Failed to start playback');
      setIsPlaying(false);
    }
  };

  const togglePlay = async () => {
    if (!currentBook || !audioRef.current) return;
  
    setIsPlaying(!isPlaying); // The useEffect will handle the actual play/pause
    
    // Flush progress updates when pausing
    if (isPlaying) {
      flushProgressUpdates();
      if (currentBook && audioRef.current) {
        await immediateProgressUpdate(
          currentBook._id, 
          audioRef.current.currentTime,
          currentEpisode?._id
        );
      }
    }
  };

  const seek = (time: number) => {
    if (!audioRef.current || !currentEpisode) return;
  
    const duration = audioRef.current.duration || currentEpisode.duration || 0;
    const seekTime = (time / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setProgress(time);
    
    // Immediately update progress after seeking
    if (currentBook) {
      flushProgressUpdates(); // Clear any pending updates
      immediateProgressUpdate(currentBook._id, seekTime, currentEpisode._id);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    // The volume will be updated in the useEffect
  };

  const nextTrack = () => {
    if (!currentBook || allBooks.length === 0) return;

    // If it's a series with next episode
    if (currentBook.isSeries && currentEpisode) {
      const nextEp = currentBook.episodes?.find(ep => 
        ep.episodeNumber === (currentEpisode.episodeNumber + 1)
      );
      if (nextEp) {
        play(currentBook, nextEp);
        return;
      }
    }

    // Find next book in library
    const currentIndex = allBooks.findIndex(b => b._id === currentBook._id);
    if (currentIndex < allBooks.length - 1) {
      const nextBook = allBooks[currentIndex + 1];
      play(nextBook);
    }
  };

  const previousTrack = () => {
    if (!currentBook || allBooks.length === 0) return;

    // If we're more than 3 seconds in, just restart current episode
    if (progress > 5) {
      seek(0);
      return;
    }

    // If it's a series with previous episode
    if (currentBook.isSeries && currentEpisode) {
      const prevEp = currentBook.episodes?.find(ep => 
        ep.episodeNumber === (currentEpisode.episodeNumber - 1)
      );
      if (prevEp) {
        play(currentBook, prevEp);
        return;
      }
    }

    // Find previous book in library
    const currentIndex = allBooks.findIndex(b => b._id === currentBook._id);
    if (currentIndex > 0) {
      const prevBook = allBooks[currentIndex - 1];
      play(prevBook);
    }
  };

  const refreshLibrary = async () => {
    await fetchBooks();
  };

  return (
    <PlayerContext.Provider
      value={{
        allBooks,
        currentBook,
        currentEpisode,
        isPlaying,
        progress,
        volume,
        playbackSpeed,
        loading,
        error,
        play,
        togglePlay,
        seek,
        setVolume: handleVolumeChange,
        nextTrack,
        previousTrack,
        setPlaybackSpeed,
        setCurrentBook,
        refreshLibrary,
        recordPlaybackSession
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};