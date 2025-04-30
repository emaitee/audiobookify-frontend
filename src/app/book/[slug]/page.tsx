'use client'
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

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

interface BookDetails {
  _id: string;
  title: string;
  author: string;
  narrator: string;
  coverImage: string;
  description: string;
  category: string;
  releaseDate: string;
  publisher: string;
  language: string;
  duration: number;
  averageRating: number;
  ratings: {
    count: number;
    distribution: number[];
  };
  chapters: {
    title: string;
    duration: number;
    position: number;
  }[];
  similarBooks?: {
    _id: string;
    title: string;
    author: string;
    coverImage: string;
  }[];
}

export default function BookView() {
  const router = useRouter();
  const [book, setBook] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('chapters');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Mock data for example - would be fetched from API in real implementation
  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        // In a real implementation, you would get the book ID from the URL
        // const bookId = router.query.id;
        // const response = await authApiHelper.get(`/books/${bookId}`);
        
        // Mock data for demonstration
        setTimeout(() => {
          setBook({
            _id: '1234567890',
            title: 'The Midnight Library',
            author: 'Matt Haig',
            narrator: 'Carey Mulligan',
            coverImage: '/api/placeholder/400/600',
            description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets? Somewhere out beyond the edge of the universe there is a library that contains an infinite number of books, each one the story of another reality. One tells the story of your life as it is, along with another book for the other life you could have lived if you had made a different choice at any point in your life. While we all wonder how our lives might have been, what if you had the chance to go to the library and see for yourself? Would any of these other lives truly be better?',
            category: 'Fiction',
            releaseDate: '2020-08-13',
            publisher: 'Penguin Audio',
            language: 'English',
            duration: 28800, // 8 hours in seconds
            averageRating: 4.5,
            ratings: {
              count: 2547,
              distribution: [15, 48, 234, 892, 1358]
            },
            chapters: [
              { title: 'The Only Way to Learn Is to Live', duration: 1260, position: 1 },
              { title: 'The Midnight Library', duration: 2520, position: 2 },
              { title: 'The Book of Regrets', duration: 1980, position: 3 },
              { title: 'The Root of the Problem', duration: 2340, position: 4 },
              { title: 'The Man at the Pub Who Could Have Been', duration: 3060, position: 5 },
              { title: 'The Other Life of Perfect Days', duration: 2880, position: 6 },
              { title: 'A Life I Could Live', duration: 3240, position: 7 },
              { title: 'Trying Not to Try', duration: 2700, position: 8 },
              { title: 'A Life Beyond the Impossible', duration: 3120, position: 9 },
              { title: 'The Last Book', duration: 2580, position: 10 },
              { title: 'The Final Decision', duration: 3120, position: 11 }
            ],
            similarBooks: [
              { _id: '1', title: 'A Man Called Ove', author: 'Fredrik Backman', coverImage: '/api/placeholder/200/300' },
              { _id: '2', title: 'The Silent Patient', author: 'Alex Michaelides', coverImage: '/api/placeholder/200/300' },
              { _id: '3', title: 'Anxious People', author: 'Fredrik Backman', coverImage: '/api/placeholder/200/300' },
              { _id: '4', title: 'Where the Crawdads Sing', author: 'Delia Owens', coverImage: '/api/placeholder/200/300' }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Failed to fetch book details', err);
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

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

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would call an API to update the user's favorites
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-indigo-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-indigo-50 to-white">
        <h2 className="text-2xl font-bold text-gray-800">Book not found</h2>
        <button 
          onClick={() => router.push('/search')}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex items-center"
        >
          <ChevronLeft size={18} className="mr-1" /> Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800 pb-32">
      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onEnded={() => setIsPlaying(false)}
      >
        <source src="/sample-audio.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      {/* Header with back button */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-lg shadow-sm z-20 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => router.push('/search')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ChevronLeft size={24} />
            <span className="ml-1 font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleFavorite}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                size={22} 
                className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"} 
              />
            </button>
            
            <button 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Share this book"
            >
              <Share2 size={22} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Book cover and info section */}
      <section className="px-6 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book cover */}
            <div className="md:w-1/3 flex justify-center">
              <div className="relative">
                <img 
                  src={book.coverImage} 
                  alt={book.title}
                  className="rounded-xl shadow-lg h-auto max-w-full md:max-w-xs object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md text-xs font-medium flex items-center">
                  <Clock size={14} className="mr-1 text-indigo-600" />
                  {formatFullDuration(book.duration)}
                </div>
              </div>
            </div>
            
            {/* Book info */}
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-700 mb-4">{book.author}</p>
              <p className="text-gray-600 mb-6">Narrated by <span className="font-medium">{book.narrator}</span></p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                  {book.category}
                </span>
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star size={14} className="mr-1 fill-amber-500 text-amber-500" />
                  {book.averageRating} ({book.ratings.count} ratings)
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {book.language}
                </span>
              </div>
              
              <div className="mb-6">
                <p className={`text-gray-700 leading-relaxed ${!showFullDescription && 'line-clamp-3'}`}>
                  {book.description}
                </p>
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2"
                >
                  {showFullDescription ? 'Show Less' : 'Read More'}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500">Publisher</p>
                  <p className="font-medium">{book.publisher}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500">Release Date</p>
                  <p className="font-medium">{book.releaseDate}</p>
                </div>
              </div>
              
              <button 
                onClick={togglePlay}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full py-3 flex items-center justify-center transition-colors shadow-md"
              >
                {isPlaying ? (
                  <>
                    <PauseCircle size={24} className="mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayCircle size={24} className="mr-2" />
                    Play Sample
                  </>
                )}
              </button>
              
              <div className="flex justify-between mt-4">
                <button className="flex items-center text-indigo-600 hover:text-indigo-800">
                  <Download size={18} className="mr-1" />
                  <span className="text-sm font-medium">Download</span>
                </button>
                <button className="flex items-center text-indigo-600 hover:text-indigo-800">
                  <Plus size={18} className="mr-1" />
                  <span className="text-sm font-medium">Add to Library</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Player progress bar */}
      <section className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30 px-6 pt-2 pb-6">
        <div className="max-w-4xl mx-auto">
          <div 
            ref={progressBarRef}
            className="h-2 bg-gray-200 rounded-full mb-3 cursor-pointer"
            onClick={seekAudio}
          >
            <div 
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${(currentTime / book.duration) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src={book.coverImage} 
                alt={book.title}
                className="h-12 w-12 rounded-md object-cover"
              />
              <div>
                <p className="font-medium text-sm truncate max-w-[120px]">{book.title}</p>
                <p className="text-xs text-gray-600 truncate max-w-[120px]">{book.author}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSkipBackward}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Rewind size={20} className="text-gray-700" />
              </button>
              
              <button 
                onClick={togglePlay}
                className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              >
                {isPlaying ? (
                  <PauseCircle size={28} />
                ) : (
                  <PlayCircle size={28} />
                )}
              </button>
              
              <button 
                onClick={handleSkipForward}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FastForward size={20} className="text-gray-700" />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {formatTime(currentTime)} / {formatTime(book.duration)}
              </div>
              
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Volume2 size={20} className="text-gray-600" />
              </button>
              
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Settings size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tabs section */}
      <section className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'chapters' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('chapters')}
            >
              Chapters
            </button>
            <button 
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'details' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button 
              className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'ratings' 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('ratings')}
            >
              Ratings
            </button>
          </div>
          
          {/* Chapters tab */}
          {activeTab === 'chapters' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {book.chapters.map((chapter, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-4 ${
                    index < book.chapters.length - 1 && 'border-b border-gray-100'
                  } hover:bg-gray-50 transition-colors cursor-pointer`}
                  onClick={() => {
                    setCurrentTime(0); // In real app would set to chapter start time
                    setIsPlaying(true);
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-medium mr-3">
                      {chapter.position}
                    </div>
                    <div>
                      <p className="font-medium">{chapter.title}</p>
                      <p className="text-sm text-gray-600">{formatTime(chapter.duration)}</p>
                    </div>
                  </div>
                  <PlayCircle size={24} className="text-indigo-600" />
                </div>
              ))}
            </div>
          )}
          
          {/* Details tab */}
          {activeTab === 'details' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <BookOpen size={18} className="mr-2 text-indigo-600" />
                    Book Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium">{book.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Author:</span>
                      <span className="font-medium">{book.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Narrator:</span>
                      <span className="font-medium">{book.narrator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Publisher:</span>
                      <span className="font-medium">{book.publisher}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Release Date:</span>
                      <span className="font-medium">{book.releaseDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Language:</span>
                      <span className="font-medium">{book.language}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Award size={18} className="mr-2 text-indigo-600" />
                    Audiobook Specs
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{formatFullDuration(book.duration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chapters:</span>
                      <span className="font-medium">{book.chapters.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Format:</span>
                      <span className="font-medium">AAC/MP3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">File Size:</span>
                      <span className="font-medium">285 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Version:</span>
                      <span className="font-medium">Unabridged</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Ratings tab */}
          {activeTab === 'ratings' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-indigo-600 mb-2">
                    {book.averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={20} 
                        className={i < Math.round(book.averageRating) 
                          ? "fill-amber-400 text-amber-400" 
                          : "text-gray-300"} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{book.ratings.count} ratings</p>
                </div>
                
                <div className="md:w-2/3">
                  {book.ratings.distribution.map((count, index) => {
                    const stars = 5 - index;
                    const percentage = (count / book.ratings.count) * 100;
                    
                    return (
                      <div key={index} className="flex items-center mb-2">
                        <div className="flex items-center w-16">
                          <span className="text-sm font-medium">{stars}</span>
                          <Star size={14} className="ml-1 fill-amber-400 text-amber-400" />
                        </div>
                        <div className="flex-1 h-3 mx-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-right text-sm text-gray-600">
                          {Math.round(percentage)}%
                        </div>
                      </div>
                    );
                  }).reverse()}
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
            <h2 className="text-xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {book.similarBooks.map((similar) => (
                <div 
                  key={similar._id}
                  className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/book/${similar._id}`)}
                >
                  <div className="relative pb-[140%] mb-2">
                    <img 
                      src={similar.coverImage} 
                      alt={similar.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="font-medium text-sm line-clamp-1">{similar.title}</h3>
                  <p className="text-xs text-gray-600">{similar.author}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}