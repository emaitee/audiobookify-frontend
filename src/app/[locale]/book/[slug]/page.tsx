'use client'
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  PlayCircle, 
  PauseCircle, 
  ChevronLeft, 
  Heart, 
  Share2, 
  Clock, 
  BookOpen, 
  Award, 
  Star, 
  Plus, 
  Volume2, 
  Download, 
  ListMusic,
  FastForward,
  Rewind,
  Settings
} from 'lucide-react';
import { authApiHelper } from '../../../utils/api';
import { Book } from '../../page';
import { usePlayer } from '@/context/PlayerContext';

interface Rating {
    user: string,
    rating: number,
    review: String,
    date: string
}

export default function BookView() {
    const { theme } = useTheme();
    const params = useParams()
    const router = useRouter();
    const { currentBook, play, setCurrentBook, togglePlay } = usePlayer()
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isPlaying = currentBook?._id === book?._id
    const [currentTime, setCurrentTime] = useState(0);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [activeTab, setActiveTab] = useState('chapters');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await authApiHelper.get(`/books/${params.slug}`);
        if (!response?.ok) {
          throw new Error('Failed to fetch book details');
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [params.slug]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFullDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const seekAudio = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !book) return;
    
    const progressBar = progressBarRef.current;
    const position = e.clientX - progressBar.getBoundingClientRect().left;
    const percentage = position / progressBar.offsetWidth;
    const seekTime = percentage * book.duration;
    
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current && book) {
      const newTime = Math.min(currentTime + 30, book.duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current) {
      const newTime = Math.max(currentTime - 10, 0);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

    const handlePlay = (book: Book) => {
      // Check if this is the currently playing book
      if (currentBook?._id === book._id) {
        // Toggle play/pause for the current book
        play(currentBook);
        return;
      }
  
      if (book.isSeries) {
        // Handle series - play the first episode or last listened episode
        const episodeToPlay = book.episodes?.[0]; // Default to first episode
        // Or get the last listened episode from user history
        
        if (!episodeToPlay) {
          console.error('No episodes available for this series');
          return;
        }
  
        play({
                  _id: book._id,
                  episodeId: episodeToPlay._id,
                  title: `${book.title} - ${episodeToPlay.title}`,
                  author: book.author,
                  coverImage: book.coverImage,
                  audioFile: episodeToPlay.audioFile,
                  duration: episodeToPlay.duration,
                  isSeries: true,
                  episodeNumber: episodeToPlay.episodeNumber,
                  narrator: book.narrator,
                  averageRating: book.averageRating,
                  language: book.language,
                  ratings: book.ratings
                }, episodeToPlay);
      } else {
        // Handle single audiobook
        play({
          _id: book._id,
          title: book.title,
          author: book.author,
          coverImage: book.coverImage,
          audioFile: book.episodes?.[0]?.audioFile || '', // Assuming single books have one episode
          duration: book.episodes?.[0]?.duration || 0,
          narrator: book.narrator || 'Unknown',
          isSeries: book.isSeries || false,
          averageRating: book.averageRating || '0',
          language: book.language || 'Unknown',
          ratings: book.ratings || []
        });
      }
    };

  const toggleFavorite = async () => {
    if (!book) return;
    
    try {
        const endpoint = `/users/favorites/${book._id}`;
        let response;
        if (book.isFavorite) {
          response = await authApiHelper.delete(endpoint);
        } else {
          response = await authApiHelper.post(endpoint);
        }

      if (!(response?.ok??false)) throw new Error('Failed to update favorite status');
      
      setBook({
        ...book,
        isFavorite: !book.isFavorite
      });
    } catch (err) {
      console.error('Error updating favorite:', err);
      setError(err instanceof Error ? err.message : 'Failed to update favorite');
    }
  };

  const toggleLibrary = async () => {
    if (!book) return;
    
    try {
        const endpoint = `/users/library/${book._id}`;
        let response;
        if (book.inLibrary) {
          response = await authApiHelper.delete(endpoint);
        } else {
          response = await authApiHelper.post(endpoint);
        }
    //   const method = book.inLibrary ? 'DELETE' : 'POST';

    //   const response = await authApiHelper.request(endpoint, { method });
      if (!(response?.ok??false)) throw new Error('Failed to update library status');
      
      setBook({
        ...book,
        inLibrary: !book.inLibrary
      });
    } catch (err) {
      console.error('Error updating library:', err);
      setError(err instanceof Error ? err.message : 'Failed to update library');
    }
  };
    if (loading) {
        return (
            <div className={`flex justify-center items-center h-screen ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-indigo-50 to-white'
            }`}>
                <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${
                    theme === 'dark' ? 'border-indigo-400' : 'border-indigo-600'
                }`}></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex flex-col items-center justify-center h-screen p-4 ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-indigo-50 to-white'
            }`}>
                <h2 className={`text-2xl font-bold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Error loading book</h2>
                <p className={`mb-6 text-center ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>{error}</p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => router.push('/search')}
                        className={`px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors flex items-center ${
                            theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'
                        }`}
                    >
                        <ChevronLeft size={18} className="mr-1" /> Back to Search
                    </button>
                    <button 
                        onClick={() => window.location.reload()}
                        className={`px-6 py-2 rounded-full transition-colors ${
                            theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className={`flex flex-col items-center justify-center h-screen ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-indigo-50 to-white'
            }`}>
                <h2 className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Book not found</h2>
                <button 
                    onClick={() => router.push('/search')}
                    className={`mt-4 px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors flex items-center ${
                        theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'
                    }`}
                >
                    <ChevronLeft size={18} className="mr-1" /> Back to Search
                </button>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pb-32 ${
            theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'
        }`}>
            {/* Header with back button */}
            <header className={`sticky top-0 backdrop-blur-lg z-20 md:px-6 md:py-4 ${
                theme === 'dark' ? 'bg-gray-900/90 border-b border-gray-700' : 'bg-white/90 shadow-sm'
            }`}>
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <button 
                        onClick={() => router.back()}
                        className={`flex items-center transition-colors ${
                            theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                        }`}
                    >
                        <ChevronLeft size={24} />
                        <span className="ml-1 font-medium">Back</span>
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleFavorite}
                            className={`p-2 rounded-full transition-colors ${
                                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                            aria-label={book.isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            <Heart 
                                size={22} 
                                className={book.isFavorite ? "fill-red-500 text-red-500" : theme === 'dark' ? "text-gray-400" : "text-gray-600"} 
                            />
                        </button>
                        
                        <button 
                            className={`p-2 rounded-full transition-colors ${
                                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                            }`}
                            aria-label="Share this book"
                        >
                            <Share2 size={22} className={theme === 'dark' ? "text-gray-400" : "text-gray-600"} />
                        </button>
                    </div>
                </div>
            </header>
            
            {/* Book cover and info section */}
            <section className="md:px-6 pt-8 pb-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Book cover */}
                        <div className="md:w-1/3 flex justify-center">
                            <div className="relative">
                                <img 
                                    src={book.coverImage || '/default-book-cover.jpg'} 
                                    alt={book.title}
                                    className="rounded-xl shadow-lg h-auto max-w-full md:max-w-xs object-cover"
                                />
                                <div className={`absolute top-4 right-4 backdrop-blur-sm px-3 py-1 rounded-full shadow-md text-xs font-medium flex items-center ${
                                    theme === 'dark' ? 'bg-gray-700/90 text-white' : 'bg-white/90 text-gray-800'
                                }`}>
                                    <Clock size={14} className={`mr-1 ${
                                        theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                                    }`} />
                                    {formatFullDuration(book.duration)}
                                </div>
                            </div>
                        </div>
                        
                        {/* Book info */}
                        <div className="md:w-2/3">
                            <h1 className={`text-3xl font-bold mb-2 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-800'
                            }`}>{book.title}</h1>
                            <p className={`text-xl mb-4 ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>{book.author}</p>
                            <p className={`mb-6 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>Narrated by <span className="font-medium">{book.narrator}</span></p>
                            
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    theme === 'dark' ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                                }`}>
                                    {book.category}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                                    theme === 'dark' ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    <Star size={14} className={`mr-1 ${
                                        theme === 'dark' ? 'fill-amber-300 text-amber-300' : 'fill-amber-500 text-amber-500'
                                    }`} />
                                    {Number(book.averageRating).toFixed(1)} ({book.ratings.length} ratings)
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    theme === 'dark' ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                                }`}>
                                    {book.language}
                                </span>
                            </div>
                            
                            <div className="mb-6">
                                <p className={`leading-relaxed ${!showFullDescription && 'line-clamp-3'} ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    {book.description}
                                </p>
                                <button 
                                    onClick={() => setShowFullDescription(!showFullDescription)}
                                    className={`text-sm font-medium mt-2 ${
                                        theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                                    }`}
                                >
                                    {showFullDescription ? 'Show Less' : 'Read More'}
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className={`p-4 rounded-xl shadow-sm border ${
                                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                                }`}>
                                    <p className={`text-sm ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>Publisher</p>
                                    <p className="font-medium">{book.publisher}</p>
                                </div>
                                <div className={`p-4 rounded-xl shadow-sm border ${
                                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                                }`}>
                                    <p className={`text-sm ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>Release Date</p>
                                    <p className="font-medium">{book.releaseDate ? new Date(book.releaseDate).toLocaleDateString() : 'Unknown'}</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => {
                                    if(!currentBook){
                                        setCurrentBook(book);
                                        handlePlay(book)
                                    } else {
                                        togglePlay()
                                    }
                                }}
                                className={`w-full rounded-full py-3 flex items-center justify-center transition-colors shadow-md ${
                                    theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-600 hover:bg-indigo-700'
                                } text-white`}
                            >
                                {isPlaying ? (
                                    <>
                                        <PauseCircle size={24} className="mr-2" />
                                        Pause
                                    </>
                                ) : (
                                    <>
                                        <PlayCircle size={24} className="mr-2" />
                                        Play 
                                    </>
                                )}
                            </button>
                            
                            <div className="flex justify-between mt-4">
                                <button className={`flex items-center ${
                                    theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                                }`}>
                                    <Download size={18} className="mr-1" />
                                    <span className="text-sm font-medium">Download</span>
                                </button>
                                <button 
                                    className={`flex items-center ${
                                        theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                                    }`}
                                    onClick={toggleLibrary}
                                >
                                    <Plus size={18} className="mr-1" />
                                    <span className="text-sm font-medium">
                                        {book.inLibrary ? 'Remove from Library' : 'Add to Library'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Tabs section */}
            <section className="md:px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className={`flex border-b ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    } mb-6`}>
                        <button 
                            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'chapters' 
                                    ? theme === 'dark' 
                                        ? 'border-indigo-500 text-indigo-400' 
                                        : 'border-indigo-600 text-indigo-600' 
                                    : theme === 'dark' 
                                        ? 'border-transparent text-gray-400 hover:text-gray-300' 
                                        : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                            onClick={() => setActiveTab('chapters')}
                        >
                            Episodes
                        </button>
                        <button 
                            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'details' 
                                    ? theme === 'dark' 
                                        ? 'border-indigo-500 text-indigo-400' 
                                        : 'border-indigo-600 text-indigo-600' 
                                    : theme === 'dark' 
                                        ? 'border-transparent text-gray-400 hover:text-gray-300' 
                                        : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                            onClick={() => setActiveTab('details')}
                        >
                            Details
                        </button>
                        <button 
                            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'ratings' 
                                    ? theme === 'dark' 
                                        ? 'border-indigo-500 text-indigo-400' 
                                        : 'border-indigo-600 text-indigo-600' 
                                    : theme === 'dark' 
                                        ? 'border-transparent text-gray-400 hover:text-gray-300' 
                                        : 'border-transparent text-gray-600 hover:text-gray-800'
                            }`}
                            onClick={() => setActiveTab('ratings')}
                        >
                            Ratings
                        </button>
                    </div>
                    
                    {/* Chapters tab */}
                    {activeTab === 'chapters' && (
                        <div className={`rounded-xl shadow-sm border overflow-hidden ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                        }`}>
                            {book?.episodes?.map((chapter, index) => (
                                <div 
                                    key={index}
                                    className={`flex items-center justify-between p-4 transition-colors cursor-pointer ${
                                        index < (book?.episodes?.length ?? 0) - 1 && `border-b ${
                                            theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                                        }`
                                    } ${
                                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => {
                                        play(book, chapter)
                                    }}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-medium mr-3 ${
                                            theme === 'dark' ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                                        }`}>
                                            {chapter.position}
                                        </div>
                                        <div>
                                            <p className="font-medium">{chapter.title}</p>
                                            <p className={`text-sm ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                            }`}>{formatTime(chapter.duration)}</p>
                                        </div>
                                    </div>
                                    <PlayCircle size={24} className={
                                        theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                                    } />
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Details tab */}
                    {activeTab === 'details' && (
                        <div className={`rounded-xl shadow-sm border p-6 ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                        }`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className={`text-lg font-medium mb-4 flex items-center ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                                    }`}>
                                        <BookOpen size={18} className={`mr-2 ${
                                            theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                                        }`} />
                                        Book Information
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Title:", value: book.title },
                                            { label: "Author:", value: book.author },
                                            { label: "Narrator:", value: book.narrator },
                                            { label: "Publisher:", value: book.publisher },
                                            { label: "Release Date:", value: book.releaseDate ? new Date(book.releaseDate).toLocaleDateString() : 'Unknown' },
                                            { label: "Language:", value: book.language }
                                        ].map((item) => (
                                            <div className="flex justify-between" key={item.label}>
                                                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{item.label}</span>
                                                <span className="font-medium">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className={`text-lg font-medium mb-4 flex items-center ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                                    }`}>
                                        <Award size={18} className={`mr-2 ${
                                            theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                                        }`} />
                                        Audiobook Specs
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Duration:", value: formatFullDuration(book.duration) },
                                            { label: "Chapters:", value: book?.episodes?.length },
                                            { label: "Format:", value: "AAC/MP3" },
                                            { label: "File Size:", value: `${Math.round(book.duration * 0.01)} MB` },
                                            { label: "Version:", value: "Unabridged" }
                                        ].map((item) => (
                                            <div className="flex justify-between" key={item.label}>
                                                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{item.label}</span>
                                                <span className="font-medium">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Ratings tab */}
                    {activeTab === 'ratings' && (
                        <div className={`rounded-xl shadow-sm border p-6 ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                        }`}>
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="md:w-1/3 flex flex-col items-center justify-center">
                                    <div className={`text-5xl font-bold mb-2 ${
                                        theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                                    }`}>
                                        {Number(book.averageRating)?.toFixed(1)}
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={20} 
                                                className={i < Math.round(Number(book.averageRating)) 
                                                    ? "fill-amber-400 text-amber-400" 
                                                    : theme === 'dark' ? "text-gray-600" : "text-gray-300"} 
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-sm ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                    }`}>{book.ratings.length} ratings</p>
                                </div>
                                
                                <div className="md:w-2/3">
                                    {[5, 4, 3, 2, 1].map((stars) => {
                                        const count = book.ratings.filter(rating => rating.rating === stars).length;
                                        const percentage = (count / book.ratings.length) * 100;

                                        return (
                                            <div key={stars} className="flex items-center mb-2">
                                                <div className="flex items-center w-16">
                                                    <span className="text-sm font-medium">{stars}</span>
                                                    <Star size={14} className={`ml-1 ${
                                                        theme === 'dark' ? 'fill-amber-400 text-amber-400' : 'fill-amber-400 text-amber-400'
                                                    }`} />
                                                </div>
                                                <div className={`flex-1 h-3 mx-2 rounded-full overflow-hidden ${
                                                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                                }`}>
                                                    <div 
                                                        className="h-full bg-amber-400 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className={`w-12 text-right text-sm ${
                                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                    {Math.round(percentage)}%
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            
            {/* Similar books section */}
            {book.similarBooks && book.similarBooks.length > 0 && (
                <section className="px-6 py-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className={`text-xl font-bold mb-6 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>You May Also Like</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {book.similarBooks.map((similar) => (
                                <div 
                                    key={similar._id}
                                    className={`p-3 rounded-xl shadow-sm border transition-shadow cursor-pointer ${
                                        theme === 'dark' 
                                            ? 'bg-gray-800 border-gray-700 hover:shadow-lg' 
                                            : 'bg-white border-gray-100 hover:shadow-md'
                                    }`}
                                    onClick={() => router.push(`/book/${similar._id}`)}
                                >
                                    <div className="relative pb-[140%] mb-2">
                                        <img 
                                            src={similar.coverImage || '/default-book-cover.jpg'} 
                                            alt={similar.title}
                                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                    <h3 className={`font-medium text-sm line-clamp-1 ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                                    }`}>{similar.title}</h3>
                                    <p className={`text-xs ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                    }`}>{similar.author}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}