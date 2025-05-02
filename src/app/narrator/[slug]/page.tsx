import { useState, JSX } from 'react';
import { Star, BookOpen, User, Clock, Award, ChevronDown, ChevronUp, Play, Heart } from 'lucide-react';

export default function NarratorProfile() {
  const [selectedTab, setSelectedTab] = useState('narrated');
  const [showMoreBio, setShowMoreBio] = useState(false);
  
  // Sample data - would come from API in a real app
  const narrator = {
    name: "James Maxwell",
    avatar: "/api/placeholder/200/200",
    bio: "Award-winning voice actor with over 15 years of experience narrating audiobooks across multiple genres. Known for versatile character voices and engaging storytelling style. James has narrated over 250 titles and has been nominated for Audie Awards three times, winning in 2023 for Best Fiction Narration.",
    followers: 14500,
    rating: 4.8,
    genres: ["Fiction", "Fantasy", "Mystery", "Non-Fiction"],
    stats: {
      totalBooks: 254,
      totalHours: 3642,
      avgRating: 4.8,
      awards: 5
    }
  };
  
  const books = [
    {
      id: 1,
      title: "The Silent Echo",
      cover: "/api/placeholder/120/180",
      genre: "Mystery/Thriller",
      year: 2023,
      duration: "12h 45m",
      rating: 4.9
    },
    {
      id: 2,
      title: "Beyond the Horizon",
      cover: "/api/placeholder/120/180",
      genre: "Science Fiction",
      year: 2022,
      duration: "15h 20m",
      rating: 4.7
    },
    {
      id: 3,
      title: "The Last Kingdom",
      cover: "/api/placeholder/120/180",
      genre: "Historical Fiction",
      year: 2021,
      duration: "18h 15m",
      rating: 4.8
    },
    {
      id: 4,
      title: "Whispers in the Dark",
      cover: "/api/placeholder/120/180",
      genre: "Horror",
      year: 2023,
      duration: "9h 30m",
      rating: 4.6
    }
  ];
  
  const reviews = [
    {
      id: 1,
      user: "BookwormAlex",
      avatar: "/api/placeholder/40/40",
      text: "James brings every character to life with such distinct voices. His narration of 'The Silent Echo' had me completely immersed from start to finish.",
      date: "April 2, 2025",
      rating: 5,
      book: "The Silent Echo"
    },
    {
      id: 2,
      user: "AudioFanatic",
      avatar: "/api/placeholder/40/40",
      text: "The pacing and emotion in James's narration makes even complex stories easy to follow. His work on sci-fi titles is particularly impressive.",
      date: "March 15, 2025",
      rating: 5,
      book: "Beyond the Horizon"
    },
    {
      id: 3,
      user: "ListenerDaily",
      avatar: "/api/placeholder/40/40",
      text: "While his character voices are excellent, sometimes the sound mixing could be better. Still, one of the best narrators in the business.",
      date: "February 27, 2025",
      rating: 4,
      book: "Whispers in the Dark"
    }
  ];
  
interface NarratorStats {
    totalBooks: number;
    totalHours: number;
    avgRating: number;
    awards: number;
}

interface Narrator {
    name: string;
    avatar: string;
    bio: string;
    followers: number;
    rating: number;
    genres: string[];
    stats: NarratorStats;
}

interface Book {
    id: number;
    title: string;
    cover: string;
    genre: string;
    year: number;
    duration: string;
    rating: number;
}

interface Review {
    id: number;
    user: string;
    avatar: string;
    text: string;
    date: string;
    rating: number;
    book: string;
}

const renderStars = (rating: number): JSX.Element[] => {
    return Array(5).fill(0).map((_, i) => (
        <Star 
            key={i} 
            className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
        />
    ));
};
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img 
                src={narrator.avatar} 
                alt={narrator.name} 
                className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-blue-100"
              />
            </div>
            
            {/* Info */}
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{narrator.name}</h1>
                  <div className="flex items-center mt-2">
                    {renderStars(narrator.rating)}
                    <span className="ml-2 text-gray-600">{narrator.rating} • {narrator.followers.toLocaleString()} followers</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {narrator.genres.map((genre, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  <User className="w-4 h-4 mr-2" />
                  Follow
                </button>
              </div>
              
              {/* Bio */}
              <div className="mb-4">
                <p className="text-gray-700">
                  {showMoreBio ? narrator.bio : `${narrator.bio.substring(0, 150)}...`}
                </p>
                <button 
                  onClick={() => setShowMoreBio(!showMoreBio)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1 flex items-center"
                >
                  {showMoreBio ? 'Show less' : 'Read more'}
                  {showMoreBio ? 
                    <ChevronUp className="w-4 h-4 ml-1" /> : 
                    <ChevronDown className="w-4 h-4 ml-1" />
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Narrator Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-2xl font-bold text-gray-800">{narrator.stats.totalBooks}</span>
              <span className="text-sm text-gray-600">Titles Narrated</span>
            </div>
            <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center">
              <Clock className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-2xl font-bold text-gray-800">{narrator.stats.totalHours}</span>
              <span className="text-sm text-gray-600">Hours of Audio</span>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg flex flex-col items-center">
              <Star className="w-8 h-8 text-yellow-600 mb-2" />
              <span className="text-2xl font-bold text-gray-800">{narrator.stats.avgRating}</span>
              <span className="text-sm text-gray-600">Average Rating</span>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg flex flex-col items-center">
              <Award className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-2xl font-bold text-gray-800">{narrator.stats.awards}</span>
              <span className="text-sm text-gray-600">Awards Won</span>
            </div>
          </div>
        </div>
        
        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setSelectedTab('narrated')}
                className={`px-4 py-3 text-sm font-medium ${
                  selectedTab === 'narrated' 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Narrated Books
              </button>
              <button
                onClick={() => setSelectedTab('reviews')}
                className={`px-4 py-3 text-sm font-medium ${
                  selectedTab === 'reviews' 
                    ? 'border-b-2 border-blue-600 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Listener Reviews
              </button>
            </nav>
          </div>
          
          {/* Content based on selected tab */}
          <div className="p-4 sm:p-6">
            {selectedTab === 'narrated' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Notable Titles</h3>
                  <select className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded-md text-sm">
                    <option>Sort by: Recently Added</option>
                    <option>Sort by: Highest Rated</option>
                    <option>Sort by: Most Popular</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {books.map(book => (
                    <div key={book.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 transition-transform hover:scale-105">
                      <div className="relative">
                        <img 
                          src={book.cover} 
                          alt={book.title} 
                          className="w-full h-48 object-cover"
                        />
                        <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-blue-100">
                          <Play className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="absolute bottom-2 left-2 bg-white rounded-full p-2 shadow-md hover:bg-red-100">
                          <Heart className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-gray-800 mb-1 line-clamp-1">{book.title}</h4>
                        <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                          <span>{book.genre}</span>
                          <span>{book.year}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">{book.duration}</span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                            <span>{book.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium px-4 py-2 rounded-lg">
                    View All Books ({narrator.stats.totalBooks})
                  </button>
                </div>
              </div>
            )}
            
            {selectedTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Reviews</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {renderStars(narrator.rating)}
                      <span className="ml-2 text-lg font-semibold">{narrator.rating}</span>
                    </div>
                    <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <img 
                            src={review.avatar} 
                            alt={review.user} 
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <h4 className="font-medium text-gray-800">{review.user}</h4>
                            <p className="text-xs text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-gray-700">{review.text}</p>
                        <p className="text-sm text-gray-500 mt-2">Review for: <span className="font-medium">{review.book}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium px-4 py-2 rounded-lg">
                    View All Reviews
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}