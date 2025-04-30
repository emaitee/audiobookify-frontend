'use client'
import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApiHelper } from '@/app/utils/api';

interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  audioFile: string;
  duration: number;
}

interface Book {
  id: string;
  title: string;
  author: string;
  narrator: string;
  coverImage: string;
  description?: string;
  duration?: number;
  isSeries: boolean;
  seriesName?: string;
  episodeNumber?: number;
  totalEpisodes?: number;
  hasNextEpisode?: boolean;
  hasPreviousEpisode?: boolean;
  episodes?: Episode[];
  currentEpisode?: Episode;
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

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApiHelper.get('/books');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllBooks(data.books);
      
      // If there's a current book being played, update it with fresh data
      if (currentBook) {
        const updatedBook = data.books.find((b: Book) => b.id === currentBook.id);
        if (updatedBook) {
          setCurrentBook(updatedBook);
          // Also update current episode if it exists
          if (currentEpisode) {
            const updatedEpisode = updatedBook.episodes?.find(
              (ep: Episode) => ep.id === currentEpisode.id
            );
            if (updatedEpisode) {
              setCurrentEpisode(updatedEpisode);
              // Update audio source if playing
              if (audioRef.current && isPlaying) {
                audioRef.current.src = updatedEpisode.audioFile;
              }
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize audio element and fetch books
  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.playbackRate = playbackSpeed;

    // Fetch books from API
    fetchBooks();

    const updateProgress = () => {
      if (audioRef.current) {
        const newProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(isNaN(newProgress) ? 0 : newProgress);
      }
    };

    const interval = setInterval(updateProgress, 1000);

    // Handle audio events
    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-play next episode if available
      if (currentBook?.isSeries && currentEpisode) {
        const nextEp = currentBook.episodes?.find(ep => 
          ep.episodeNumber === (currentEpisode.episodeNumber + 1)
        );
        if (nextEp) {
          play(currentBook, nextEp);
        }
      }
    };

    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current = null;
      }
      clearInterval(interval);
    };
  }, []);

  // Update playback speed when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const play = (book: Book, episode?: Episode) => {
    if (!audioRef.current) return;

    // Find the book in our allBooks array to ensure we have the latest data
    const freshBook = allBooks.find(b => b.id === book.id) || book;

    // Determine which episode to play
    let playEpisode = episode;
    if (!playEpisode && freshBook.episodes) {
      // If no episode specified, play first episode or resume last played
      playEpisode = freshBook.episodes[0];
    }

    if (!playEpisode) {
      console.error('No episode available to play');
      return;
    }

    setCurrentBook(freshBook);
    setCurrentEpisode(playEpisode);
    audioRef.current.src = playEpisode.audioFile;
    audioRef.current.currentTime = 0;
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(err => console.error('Playback failed:', err));
  };

  const togglePlay = () => {
    if (!currentBook || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Playback failed:', err));
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (time: number) => {
    if (!audioRef.current || !currentEpisode) return;

    const duration = currentEpisode.duration || 0;
    const seekTime = (time / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setProgress(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
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
    const currentIndex = allBooks.findIndex(b => b.id === currentBook.id);
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
    const currentIndex = allBooks.findIndex(b => b.id === currentBook.id);
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
        refreshLibrary
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