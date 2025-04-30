'use client'
import React, { useState, useEffect } from 'react';
import { Book, Headphones, List, Pause, Play, ChevronRight, Clock, Calendar, BookOpen } from 'lucide-react';
import { authApiHelper } from './utils/api';
import { formatTime } from './utils/helpers';
import { usePlayer } from '@/context/PlayerContext';

export const featuredBooks = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtmKvVXY7v2epRmCPTFdvEmfNH8158b-XX0A&s", progress: 65 },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn5xkKB1ByJI59VpGEBBkkFRN0_FJ9COkr2g&s", progress: 23 },
  { id: 3, title: "1984", author: "George Orwell", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKF1ay8V0kUQ9dxj25l1plHNYcIzX80ThxLg&s", progress: 45 },
  { id: 4, title: "Pride and Prejudice", author: "Jane Austen", cover: "https://cdn.kobo.com/book-images/1a735d96-6075-4bca-87b7-15fb97ee50c7/1200/1200/False/pride-and-prejudice-216.jpg", progress: 12 },
];

export const continueListing = [
  { id: 5, title: "Dune", author: "Frank Herbert", cover: "https://cdn.kobo.com/book-images/2bd0e164-5c02-4e40-a43a-17d2fd5451b7/1200/1200/False/dune-2.jpg", progress: 78, remainingTime: "3h 24m" },
  { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm9RoFW1jhDShbA1xYmG05GkgzUGzaEhsNeA&s", progress: 30, remainingTime: "6h 12m" },
];

export const recommendedBooks = [
  { id: 7, title: "Brave New World", author: "Aldous Huxley", cover: "https://cdn.kobo.com/book-images/6f07a0e9-8ca8-4b28-982c-7898ac591744/1200/1200/False/brave-new-world-79.jpg" },
  { id: 8, title: "The Catcher in the Rye", author: "J.D. Salinger", cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVdPsvFMMqa0HJGRWfEcfcxDQ4v3XJ1VcPRA&s" },
  { id: 9, title: "Lord of the Flies", author: "William Golding", cover: "https://m.media-amazon.com/images/I/716MU3GOvJL._SL1200_.jpg" },
];



interface Episode {
  _id: string;
  title: string;
  episodeNumber: number;
  audioFile: string;
  duration: number;
  listenCount: number;
  averageRating: number;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  narrator: string;
  coverImage: string;
  isSeries: boolean;
  episodes?: Episode[];
  totalEpisodes?: number;
  progress?: number;
  currentEpisode?: number;
  remainingTime?: string;
  category?: string;
  isFeatured?: boolean;
}

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl shadow-sm border border-gray-100">
    <Icon className="w-12 h-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
    <p className="text-gray-500 text-center max-w-md">{description}</p>
  </div>
);

const BookCover = ({ book, size = "normal", onClick = null, showPlayButton = true }) => {
  const { currentBook, isPlaying } = usePlayer();
  const isCurrent = currentBook?._id === book._id;
  
  const sizeClasses = {
    small: "h-40 rounded-lg",
    normal: "h-52 rounded-lg",
    large: "h-64 rounded-lg"
  };
  
  return (
    <div className="relative group">
      <div className={`relative overflow-hidden ${sizeClasses[size]} bg-gradient-to-br from-gray-200 to-gray-100`}>
        <img 
          src={book.coverImage || '/default-book-cover.jpg'} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        
        {book.isSeries && (
          <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md font-medium">
            Series
          </div>
        )}
        
        {book.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="w-full bg-gray-600/50 h-1.5 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${book.progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {showPlayButton && (
          <button 
            onClick={onClick}
            className={`absolute ${isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
              isCurrent && isPlaying 
                ? 'bg-white text-indigo-600' 
                : 'bg-indigo-600 text-white'
            } rounded-full p-4 shadow-lg`}
          >
            {isCurrent && isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
        )}
      </div>
    </div>
  );
};

const SectionHeader = ({ title, actionText, onAction }: { title: string; actionText: string; onAction: () => void }) => (
  <div className="flex justify-between items-center mb-5">
    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    <button 
      onClick={onAction}
      className="text-indigo-600 font-medium text-sm flex items-center hover:text-indigo-700 transition-colors"
    >
      {actionText}
      <ChevronRight size={16} className="ml-1" />
    </button>
  </div>
);

const HomeView = () => {
  const { play, setCurrentBook, currentBook } = usePlayer();
  const [continueListening, setContinueListening] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState({
    continue: true,
    featured: true,
    recommended: true
  });
  const [error, setError] = useState({
    continue: null,
    featured: null,
    recommended: null
  });

  useEffect(() => {
    // Fetch continue listening books
    const fetchContinueListening = async () => {
      try {
        const response = await authApiHelper.get('/books-info/continue-listening');
        if (!response.ok) throw new Error('Failed to fetch continue listening');
        const data = await response.json();
        setContinueListening(data.books.map((book: Book) => ({
          ...book,
          progress: calculateProgress(book),
          remainingTime: calculateRemainingTime(book)
        })));
      } catch (err) {
        setError(prev => ({ ...prev, continue: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, continue: false }));
      }
    };

    // Fetch featured books
    const fetchFeaturedBooks = async () => {
      try {
        const response = await authApiHelper.get('/books-info/featured');
        if (!response.ok) throw new Error('Failed to fetch featured books');
        const data = await response.json();
        setFeaturedBooks(data.books);
      } catch (err) {
        setError(prev => ({ ...prev, featured: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, featured: false }));
      }
    };

    // Fetch recommended books
    const fetchRecommendedBooks = async () => {
      try {
        const response = await authApiHelper.get('/books-info/recommended');
        if (!response.ok) throw new Error('Failed to fetch recommended books');
        const data = await response.json();
        setRecommendedBooks(data.books);
      } catch (err) {
        setError(prev => ({ ...prev, recommended: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, recommended: false }));
      }
    };

    fetchContinueListening();
    fetchFeaturedBooks();
    fetchRecommendedBooks();
  }, []);

  const calculateProgress = (book: Book): number => {
    // Calculate based on listening history
    return Math.floor(Math.random() * 100);
  };

  const calculateRemainingTime = (book: Book): string => {
    if (!book.isSeries) {
      if (!book.duration) return 'Unknown';
      const remainingMinutes = Math.floor((book.duration * (100 - (book.progress || 0)) / 100 / 60));
      return `${remainingMinutes} min left`;
    } else {
      // For series, show episode info
      return book.episodes ? `${book.episodes.length}/${book.totalEpisodes} episodes` : 'No episodes';
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
        episodeNumber: episodeToPlay.episodeNumber
      }, episodeToPlay);
    } else {
      // Handle single audiobook
      play({
        _id: book._id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        audioFile: book.episodes?.[0]?.audioFile || '', // Assuming single books have one episode
        duration: book.episodes?.[0]?.duration || 0
      });
    }
  };

  const isCurrentBook = (book: Book) => {
    return currentBook?._id === book._id;
  };

  const getBookStatusText = (book: Book) => {
    if (book.isSeries) {
      if (!book.episodes || book.episodes.length === 0) return 'No episodes';
      return `${book.episodes.length}/${book.totalEpisodes || 0} episodes`;
    }
    return book.remainingTime || calculateRemainingTime(book);
  };

  if (loading.continue || loading.featured || loading.recommended) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-28 text-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome to AudioVerse</h1>
            <p className="text-indigo-100 text-lg mb-6">Discover stories that move with you. Your next great listen awaits.</p>
            <div className="flex gap-4">
              <button className="bg-white text-indigo-900 px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition">
                Browse Library
              </button>
              <button className="bg-indigo-700 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-600 transition border border-indigo-600">
                View Collections
              </button>
            </div>
          </div>
          {/* <div className="flex gap-4 md:w-1/2 justify-end">
            <div className="hidden md:block transform -rotate-6 -translate-y-2">
              <img 
                src={featuredBooks[0]?.coverImage || "/default-book-cover.jpg"} 
                alt="Featured Book" 
                className="h-48 rounded-lg shadow-2xl"
              />
            </div>
            <div className="transform translate-y-4 rotate-6">
              <img 
                src={featuredBooks[1]?.coverImage || "/default-book-cover.jpg"} 
                alt="Featured Book" 
                className="h-56 rounded-lg shadow-2xl"
              />
            </div>
          </div> */}
        </div>
      </section>

      {/* Continue Listening Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <SectionHeader 
          title="Continue Listening" 
          actionText="See All" 
          onAction={() => console.log('Navigate to continue listening')} 
        />
        
        {error.continue ? (
          <div className="text-red-500 p-4 bg-red-50 rounded-lg">
            Error loading continue listening: {error.continue}
          </div>
        ) : continueListening.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2">
            {continueListening.map(book => (
              <BookCard 
              key={book._id}
              book={book}
              onClick={() => {
                // console.log(currentBook?._id , book._id)
                setCurrentBook(book);
                handlePlay(book)
              }}
              isCurrent={currentBook?._id === book._id}
            />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={Headphones} 
            title="Nothing to continue" 
            description="Your listening history is empty. Start listening to some audiobooks!" 
          />
        )}
      </section>

      {/* Featured Audiobooks Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <SectionHeader 
          title="Featured Audiobooks" 
          actionText="More" 
          onAction={() => console.log('Navigate to featured')} 
        />
        
        {error.featured ? (
          <div className="text-red-500 p-4 bg-red-50 rounded-lg">
            Error loading featured books: {error.featured}
          </div>
        ) : featuredBooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.map(book => (
              <BookCard 
              key={book._id}
              book={book}
              onClick={() => {
                // console.log(currentBook?._id , book._id)
                setCurrentBook(book);
                handlePlay(book)
              }}
              isCurrent={currentBook?._id === book._id}
            />))}
            </div>
        ) : (
          <EmptyState
            icon={Book}
            title="No featured books"
            description="Check back later for featured audiobooks"
          />
        )}
      </section>
      
      {/* Recommended For You Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <SectionHeader 
          title="Recommended For You" 
          actionText="See All" 
          onAction={() => console.log('Navigate to recommendations')} 
        />
        
        {error.recommended ? (
          <div className="text-red-500 p-4 bg-red-50 rounded-lg">
            Error loading recommended books: {error.recommended}
          </div>
        ) : recommendedBooks.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2">
            {/* {JSON.stringify(recommendedBooks[0])} */}
            {recommendedBooks.map(book => (
              <BookCard 
                key={book._id}
                book={book}
                onClick={() => {
                  // console.log(currentBook?._id , book._id)
                  setCurrentBook(book);
                  handlePlay(book)
                }}
                isCurrent={currentBook?._id === book._id}
              />
            
              // <div key={book._id} className="flex-shrink-0 w-48 group">
              //   <BookCover 
              //     book={book} 
              //     size="normal" 
              //     onClick={() => handlePlay(book)}
              //   />
              //   <div className="mt-3">
              //     <h3 className="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">{book.title}</h3>
              //     <p className="text-sm text-gray-600">{book.author}</p>
              //     <div className="flex items-center text-xs text-gray-500 mt-1">
              //       {book.isSeries ? (
              //         <>
              //           <Calendar size={14} className="mr-1 text-indigo-500" />
              //           {`${book.episodes?.length || 0} episodes`}
              //         </>
              //       ) : (
              //         <>
              //           <Clock size={14} className="mr-1 text-indigo-500" />
              //           {`${Math.floor((book.episodes?.[0]?.duration || 0) / 60)} min`}
              //         </>
              //       )}
              //     </div>
              //   </div>
              // </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={List}
            title="No recommendations yet"
            description="Listen to more books to get personalized recommendations"
          />
        )}
      </section>
      
      {/* Categories Section */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <SectionHeader 
          title="Browse Categories" 
          actionText="View All" 
          onAction={() => console.log('Navigate to categories')} 
        />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Fiction', 'Non-Fiction', 'Mystery', 'Fantasy', 'Biography', 'Self-Help', 'Science Fiction', 'Romance'].map(category => (
            <div 
              key={category}
              className="bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 transition-colors p-6 rounded-lg text-center cursor-pointer shadow-sm"
            >
              <h3 className="font-medium text-indigo-900">{category}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

interface BookCardProps {
  book: Partial<Book>;
  onClick: () => void;
  isCurrent: boolean;
}

const BookCard = ({ book = {}, onClick, isCurrent }: BookCardProps) => {
  return (
    <div 
    onClick={onClick}
    className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
     isCurrent ? 'ring-2 ring-indigo-500' : ''
    }`}
  >
    <div className="relative h-48 overflow-hidden">
      <img 
        src={book.coverImage || '/placeholder-cover.jpg'} 
        alt={book.title}
        className="w-full h-full object-cover"
      />
      {book.isSeries && (
        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs rounded-full px-2 py-1 flex items-center">
          <BookOpen size={12} className="mr-1" />
          <span>Episode {book.episodeNumber}</span>
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
      <p className="text-gray-600 text-sm">{book.author}</p>
      {book.isSeries && (
        <p className="text-indigo-600 text-xs mt-1">{book.seriesName}</p>
      )}
      <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
        <span>{formatTime(book.duration, true)}</span>
        {isCurrent && (
          <span className="text-indigo-600 font-medium">Now Playing</span>
        )}
      </div>
    </div>
  </div>
  )
}

export default HomeView;