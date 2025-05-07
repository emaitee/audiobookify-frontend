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
  isTransitioning: boolean;
  downloadForOffline: () => void
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
  const [nextChapterPrefetched, setNextChapterPrefetched] = useState(false);
  const [nextEpisode, setNextEpisode] = useState<Episode | null>(null);
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);
  const [isMovingToNextEpisode, setIsMovingToNextEpisode] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<string | null>(null); // Track current audio source

  let nextChapterBuffer = null;
  let sleepTimer;

  useEffect(() => {
    const connection = (navigator as any).connection;
    if (connection) {
      const handleChange = () => {
        setIsSlowNetwork(
          connection.effectiveType === 'slow-2g' || 
          connection.effectiveType === '2g' ||
          connection.saveData
        );
      };
      connection.addEventListener('change', handleChange);
      handleChange(); // Initial check
      return () => connection.removeEventListener('change', handleChange);
    }
  }, []);

  function downloadForOffline(bookId) {
    // Show storage quota
    navigator.storage.estimate().then((estimate) => {
      const remaining = (estimate.quota - estimate.usage) / (1024 * 1024);
      if (remaining < 200) showLowStorageWarning();
    });
  
    // Download in background
    navigator.serviceWorker.controller.postMessage({
      action: 'cache-book',
      bookId,
      quality: navigator.connection.effectiveType === '4g' ? 'high' : 'standard'
    });
  }

  

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

  const savePlaybackPosition = () => {
    // clearTimeout(saveTimeout);
  // saveTimeout = setTimeout(() => {
    authApiHelper.post('/progress'+currentBook?._id, {
        chapterId: currentEpisode?._id,
        position: audioRef.current
      });
  // }, 15000);
  }

  const { debouncedFn: debouncedProgressUpdate, flush: flushProgressUpdates } = useDebounceFn(
    (bookId: string, progress: number, episodeId?: string) => {
      updateListenHistory(bookId, progress, episodeId);
      savePlaybackPosition()
    },
    15000 // 15 second delay
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

  const prefetchNextChapter = useCallback(async () => {
    if (!currentBook) return;
  
    // Determine next episode
    let nextEp: Episode | undefined;
    
    if (currentBook.isSeries && currentEpisode) {
      nextEp = currentBook.episodes?.find(
        ep => ep.episodeNumber === currentEpisode.episodeNumber + 1
      );
    }
    
    if (nextEp) {
      setNextEpisode(nextEp);
      
      try {
        // Prefetch the audio file metadata
        const response = await authApiHelper.get(`/audio/metadata/${nextEp._id}`);
        const { startOffset, endOffset } = await response?.json();
        
        // Prefetch first chunk (adjust chunk size as needed)
        const chunkSize = 1024 * 1024; // 1MB
        const prefetchUrl = `/api/audio/stream?bookId=${currentBook._id}&start=${startOffset}&end=${Math.min(startOffset + chunkSize, endOffset)}`;
        
        // Trigger prefetch by creating a link element
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = prefetchUrl;
        link.as = 'audio';
        document.head.appendChild(link);
        
        console.log('Prefetched next chapter:', nextEp.title);
      } catch (err) {
        console.error('Failed to prefetch next chapter:', err);
      }
    }
  }, [currentBook, currentEpisode]);
  
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
      const chapterEndApproaching = audio.currentTime > (audio.duration - 30);
      if (chapterEndApproaching && !nextChapterBuffer) {
        prefetchNextChapter();
        // preloadNextChapter(currentEpisode + 1);
      }

      // Modified prefetch trigger with network awareness
      if ((newProgress > (isSlowNetwork ? 60 : 80)) && !nextChapterPrefetched && currentBook) {
        prefetchNextChapter();
        setNextChapterPrefetched(true);
      }
      
      if (currentBook) {
        debouncedProgressUpdate(currentBook._id, audio.currentTime, currentEpisode?._id);
      }
    };

    const handleEnded = async () => {
      console.log("ENDEDEDED", currentBook)
      // Save current references immediately
      const endingBook = currentBook;
      const endingEpisode = currentEpisode;
      const audioElement = audioRef.current;

      if (!endingBook || !audioElement) return;
      
      setIsPlaying(false);
      setIsMovingToNextEpisode(true)
      
      // Record full playback session
      // if (currentBook && audio.duration) {
      //   await recordPlaybackSession(audio.duration);
      // }
  
      // if (currentBook?.isSeries && currentEpisode) {
      //   const nextEp = currentBook.episodes?.find(
      //     ep => ep.episodeNumber === currentEpisode.episodeNumber + 1
      //   );
      //   nextEp && play(currentBook, nextEp);
      //   console.log(nextEp, 'playing next episode')
      // }
      try {
        // Record full playback session
        if (audioElement.duration) {
          await recordPlaybackSession(audioElement.duration);
        }
    
        // Handle series with episodes
        if (endingBook.isSeries && endingEpisode) {
          const nextEp = endingBook.episodes?.find(
            ep => ep.episodeNumber === endingEpisode.episodeNumber + 1
          );
          
          if (nextEp) {
            // Reset prefetch state for the new episode
            setNextChapterPrefetched(false);
            setNextEpisode(null);
            
            // Play the next episode
            await play(endingBook, nextEp);
            setIsMovingToNextEpisode(false);
            return;
          }
        }
    
        // Handle non-series books or last episode in series
        const currentIndex = allBooks.findIndex(b => b._id === endingBook._id);
        if (currentIndex < allBooks.length - 1) {
          const nextBook = allBooks[currentIndex + 1];
          await play(nextBook);
        }
      } catch (err) {
        console.error('Error moving to next episode:', err);
      } finally {
        setIsMovingToNextEpisode(false);
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
      const currentBookToSave = currentBook;
      const currentEpisodeToSave = currentEpisode;
      const currentTimeToSave = audio.currentTime;

      flushProgressUpdates();

      if (currentBookToSave && currentTimeToSave > 0) {
        immediateProgressUpdate(
          currentBookToSave._id, 
          currentTimeToSave,
          currentEpisodeToSave?._id
        );
      }

      if (currentBook && audio.currentTime > 0) {
        immediateProgressUpdate(currentBook._id, audio.currentTime, currentEpisode?._id);
      }
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = ''; // Clear source
      // Only cleanup if not moving to next episode
      if (!isMovingToNextEpisode) {
        audio.pause();
        audio.src = '';
      }
      
      audioRef.current = null;
    };
  }, []); // Empty dependency array as we want this to run once

  // Handle updates to volume and playback speed
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentEpisode?.audioFile) return;
    
    audio.volume = volume;
    audio.playbackRate = playbackSpeed;
  }, [volume, playbackSpeed]);

  // Initial fetch of books
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const cancelPrefetch = () => {
    // Find and remove any prefetch links
    document.querySelectorAll('link[rel="prefetch"]').forEach(link => link.remove());
    setNextChapterPrefetched(false);
    setNextEpisode(null);
  };

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

      // If this was a prefetched episode, clear the prefetch flag
    if (nextEpisode && nextEpisode._id === currentEpisode._id) {
      setNextChapterPrefetched(false);
      setNextEpisode(null);
    }
    }
  }, [currentEpisode, isPlaying, nextEpisode]);

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
    const audio = audioRef.current;
    if (!audio) return;
    // if (!audioRef.current) return;
    setIsTransitioning(true);
    try {
       // Reset prefetch state when starting new playback
      setNextChapterPrefetched(false);
      setNextEpisode(null);

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
      // audioRef.current.currentTime = 0;

      // Reset audio source
      audio.currentTime = 0;
      audio.src = playEpisode.audioFile;
      audioSourceRef.current = playEpisode.audioFile;
      
      // // Call API to update listen count and history
      // if (freshBook?._id) {
      //   await updateListenHistory(freshBook._id, 0, playEpisode._id);
      // } else {
      //   console.error('Book ID is undefined');
      // }

      // Call API to update listen count and history
      await updateListenHistory(freshBook._id, 0, playEpisode._id);
  
      // Start playback
      await audio.play();
      setIsPlaying(true);
      
    } catch (err) {
      console.error('Playback failed:', err);
      setError('Failed to start playback');
      setIsPlaying(false);
    } finally {
      setIsTransitioning(false);
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
        recordPlaybackSession,
        isTransitioning
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