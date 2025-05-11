'use client'
import { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { authApiHelper } from '@/app/utils/api';
import { Book, Episode } from '@/app/[locale]/page';
import { useDebounceFn } from '@/hooks/useDebounce';
import idb from '@/lib/idb';

interface OfflineQueueItem {
  action: 'updateListenHistory' | 'recordPlaybackSession';
  payload: any;
  timestamp: number;
}

interface OfflineState {
  isOffline: boolean;
  queuedActions: OfflineQueueItem[];
}
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
  downloadForOffline: (bookId:string) => void,
  isOffline: boolean;
  queuedActions: OfflineQueueItem[];
  retryQueuedActions: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  let localStrInit = '[]';
  if (typeof localStorage !== 'undefined') {
    localStrInit = localStorage.getItem('offlineQueue') || '[]'
  }

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
  const [offlineState, setOfflineState] = useState<OfflineState>({
    isOffline: !navigator.onLine,
    queuedActions: JSON.parse(localStrInit) || []
  });

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

  // Add network status listener
  useEffect(() => {
    const handleOnline = () => {
      setOfflineState(prev => ({ ...prev, isOffline: false }));
      retryQueuedActions();
    };
    const handleOffline = () => {
      setOfflineState(prev => ({ ...prev, isOffline: true }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  interface StorageEstimate {
    quota: number;
    usage: number;
  }

  interface CacheBookMessage {
    action: 'cache-book';
    bookId: string;
    quality: 'high' | 'standard';
  }

  function downloadForOffline(bookId: string): void {
    // Show storage quota
    navigator.storage.estimate().then((estimate) => {
      const quota = estimate?.quota ?? 0; // Default to 0 if undefined
      const usage = estimate?.usage ?? 0; // Default to 0 if undefined
      const remaining = (quota - usage) / (1024 * 1024);
      if (remaining < 200) showLowStorageWarning();
    });
  
    // Download in background
    navigator.serviceWorker.controller?.postMessage({
      action: 'cache-book',
      bookId,
      quality: (navigator as any).connection?.effectiveType === '4g' ? 'high' : 'standard'
    } as CacheBookMessage);
  }

  const addToOfflineQueue = (item: OfflineQueueItem) => {
    setOfflineState(prev => {
      const newQueue = [...prev.queuedActions, item];
      localStorage.setItem('offlineQueue', JSON.stringify(newQueue));
      return { ...prev, queuedActions: newQueue };
    });
  };

  const retryQueuedActions = async () => {
    if (offlineState.isOffline || offlineState.queuedActions.length === 0) return;
    
    const successes: number[] = [];
    const failures: number[] = [];
    
    for (const [index, item] of offlineState.queuedActions.entries()) {
      try {
        switch (item.action) {
          case 'updateListenHistory':
            await authApiHelper.patch(
              `/books/${item.payload.bookId}/listen`,
              { progress: item.payload.progress, episodeId: item.payload.episodeId }
            );
            break;
          case 'recordPlaybackSession':
            await authApiHelper.post('/listening-sessions', item.payload);
            break;
        }
        successes.push(index);
      } catch (err) {
        console.error(`Failed to retry ${item.action}:`, err);
        failures.push(index);
      }
    }
    
    // Remove successfully synced items
    if (successes.length > 0) {
      setOfflineState(prev => {
        const newQueue = prev.queuedActions.filter((_, i) => !successes.includes(i));
        localStorage.setItem('offlineQueue', JSON.stringify(newQueue));
        return { ...prev, queuedActions: newQueue };
      });
    }
  };

  const recordPlaybackSession = async (duration: number) => {
    if (!currentBook) return;
    
    const payload = {
      audiobookId: currentBook._id,
      episodeId: currentEpisode?._id,
      duration,
      completionRate: duration / (currentEpisode?.duration || currentBook.duration)
    };

    try {
      // Store locally first
      await idb.recordPlaybackSession(payload);
      
      // Try to sync if online
      if (!offlineState.isOffline) {
        await authApiHelper.post('/listening-sessions', payload);
      } else {
        addToOfflineQueue({
          action: 'recordPlaybackSession',
          payload,
          timestamp: Date.now()
        });
      }
      
      // Update local state
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

  const updateListenHistory = async (bookId: string, progress: number, episodeId?: string) => {
    try {
      // First try to update locally
      await idb.updateListenHistory(bookId, progress, episodeId);
      
      // Then try to sync with server if online
      if (!offlineState.isOffline) {
        await authApiHelper.patch(`/books/${bookId}/listen`, {
          progress,
          episodeId
        });
      } else {
        // Queue for later if offline
        addToOfflineQueue({
          action: 'updateListenHistory',
          payload: { bookId, progress, episodeId },
          timestamp: Date.now()
        });
      }
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
      // First try to fetch from network
      if (!offlineState.isOffline) {
        const response = await authApiHelper.get('/books');
        if (!response?.ok) throw new Error(`HTTP error! status: ${response?.status}`);
        
        const data = await response.json();
        setAllBooks(data.books);
        await idb.cacheBooks(data.books); // Cache the fresh data
        
        // Update current book if needed
        setCurrentBook(prev => {
          if (!prev) return prev;
          const updatedBook = data.books.find((b: Book) => b._id === prev._id);
          return updatedBook || prev;
        });
      } else {
        // Fallback to cached data when offline
        const cachedBooks = await idb.getAllBooks();
        setAllBooks(cachedBooks);
        
        // Update current book from cache if needed
        if (currentBook) {
          const updatedBook = cachedBooks.find((b: Book) => b._id === currentBook._id);
          if (updatedBook) setCurrentBook(updatedBook);
        }
      }
    } catch (err) {
      // If online fetch fails, try cache
      if (!offlineState.isOffline) {
        try {
          const cachedBooks = await idb.getAllBooks();
          setAllBooks(cachedBooks);
        } catch (cacheErr) {
          setError(err instanceof Error ? err.message : 'Failed to fetch books');
        }
      } else {
        setError('Offline - showing cached content');
      }
    } finally {
      setLoading(false);
    }
  }, [offlineState.isOffline]);
  
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
      console.log("Audio ended - starting transition");

      // Immediately capture current state
      const endingBook = currentBook;
      const endingEpisode = currentEpisode;
      const audio = audioRef.current;

      if (!endingBook || !audio) {
        console.log("No book or audio element - cannot handle ended event");
        return;
      }
      
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
        // Record playback session
        if (audio.duration) {
          console.log("Recording playback session");
          await recordPlaybackSession(audio.duration);
        }
    
        // Handle series with episodes
        if (endingBook.isSeries && endingEpisode) {
          console.log("Looking for next episode in series");
          const nextEp = endingBook.episodes?.find(
            ep => ep.episodeNumber === endingEpisode.episodeNumber + 1
          );
          
          if (nextEp) {
            console.log("Found next episode, playing:", nextEp.title);
            // Reset prefetch state
            setNextChapterPrefetched(false);
            setNextEpisode(null);
            
            // Play next episode
            await play(endingBook, nextEp);
            return;
          }
        }
    
        // Handle non-series or last episode
        console.log("Looking for next book in library");
        const currentIndex = allBooks.findIndex(b => b._id === endingBook._id);
        if (currentIndex < allBooks.length - 1) {
          const nextBook = allBooks[currentIndex + 1];
          console.log("Found next book, playing:", nextBook.title);
          await play(nextBook);
        } else {
          console.log("No more books in library");
        }
      } catch (err) {
        console.error('Error moving to next episode:', err);
        setError('Failed to play next episode');
      } finally {
        setIsMovingToNextEpisode(false);
        console.log("Finished episode transition");
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

      // if (currentBook && audio.currentTime > 0) {
      //   immediateProgressUpdate(currentBook._id, audio.currentTime, currentEpisode?._id);
      // }
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      // audio.pause();
      // audio.src = ''; // Clear source
      // Only cleanup if not moving to next episode
      if (!isMovingToNextEpisode) {
        audio.pause();
        audio.src = '';
        audioRef.current = null;
      }
      
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
  }, []);

  const cancelPrefetch = () => {
    // Find and remove any prefetch links
    document.querySelectorAll('link[rel="prefetch"]').forEach(link => link.remove());
    setNextChapterPrefetched(false);
    setNextEpisode(null);
  };

  // Update audio source when episode changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentEpisode?.audioFile) {
      console.log("No audio element or episode file - skipping update");
      return;
    }
    
     // Only update if source changed
    if (audioSourceRef.current !== currentEpisode.audioFile) {
      console.log(`Updating audio source from ${audioSourceRef.current} to ${currentEpisode.audioFile}`);
      
      audio.src = currentEpisode.audioFile;
      audioSourceRef.current = currentEpisode.audioFile;
      
      if (isPlaying) {
        console.log("Resuming playback after source change");
        audio.play().catch(err => {
          console.error('Playback error after source change:', err);
          setIsPlaying(false);
          setError('Failed to play audio');
        });
      }

      // Clear prefetch if this was a prefetched episode
      if (nextEpisode && nextEpisode._id === currentEpisode._id) {
        console.log("Clearing prefetch flags");
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
    if (!audio) {
      console.error("No audio element available");
      return;
    }
    // if (!audioRef.current) return;
    setIsTransitioning(true);
    console.log("Starting playback transition");

    try {
       // Reset prefetch state when starting new playback
      setNextChapterPrefetched(false);
      setNextEpisode(null);

      // Find the book in our allBooks array to ensure we have the latest data
      const freshBook = allBooks.find(b => b._id === book._id) || book;
      let playEpisode = episode || freshBook.episodes?.[0];

      // console.log(book, allBooks)
  
      // Determine which episode to play with priority:
      // 1. Explicitly passed episode
      // 2. First episode
      // let playEpisode = episode;
      if (!playEpisode && freshBook?.episodes?.length) {
        playEpisode = freshBook.episodes[0];
      }
  
      if (!playEpisode) {
        console.error('No episode available to play');
        setError('No episode available to play');
        return;
      }

      // Check if audio is available offline
      const isAvailableOffline = await idb.isEpisodeAvailableOffline(playEpisode._id);
      let audioSource = playEpisode.audioFile;

      if (isAvailableOffline) {
        audioSource = await idb.getOfflineAudioUrl(playEpisode._id);
      } else if (offlineState.isOffline) {
        throw new Error('Episode not available offline');
      }
  
      // Update state
    console.log("Updating current book and episode");
    setCurrentBook(freshBook);
    setCurrentEpisode(playEpisode);
    
    // Set audio source
    console.log("Setting audio source:", playEpisode.audioFile);
    audio.currentTime = 0;
    audio.src = audioSource;
    audioSourceRef.current = audioSource
    
    // Update listen history
    console.log("Updating listen history");
    await updateListenHistory(freshBook._id, 0, playEpisode._id);

    // Start playback
    console.log("Starting playback");
    await audio.play();
    setIsPlaying(true);
    console.log("Playback started successfully");
      
    } catch (err) {
      console.error('Playback failed:', err);
      setError(offlineState.isOffline 
        ? 'Cannot play - content not available offline'
        : 'Failed to start playback');
      setIsPlaying(false);
    } finally {
      setIsTransitioning(false);
      console.log("Finished playback transition");
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

  const contextValue = useMemo(() => ({
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
    isTransitioning,
    downloadForOffline,
    isOffline: offlineState.isOffline,
    queuedActions: offlineState.queuedActions,
    retryQueuedActions,
  }), [
    allBooks, currentBook, currentEpisode, isPlaying, progress, 
    volume, playbackSpeed, loading, error, isTransitioning,
    offlineState.isOffline, offlineState.queuedActions
  ]);

  return (
    <PlayerContext.Provider
      value={contextValue}
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

function showLowStorageWarning() {
  alert('Your device is running low on storage. Please free up some space to continue downloading content.');
}
function downloadForOffline(arg0: any) {
  throw new Error('Function not implemented.');
}

