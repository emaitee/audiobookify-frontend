'use client';
import { useState, useEffect } from 'react';
import { Star, StarHalf, ChevronUp, ChevronDown, MessageSquare, ThumbsUp, Edit, Trash2, X, Moon, Sun } from 'lucide-react';
import { authApiHelper } from '@/app/utils/api';
import { useTheme } from 'next-themes';

interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  darkMode?: boolean;
}

// Helper component for displaying star ratings
const StarRating = ({ rating, size = 16, interactive = false, onChange, darkMode = false }: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const inactiveColor = darkMode ? "#4B5563" : "#CBD5E0";
    
    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        stars.push(
          <span
            key={i}
            className="cursor-pointer"
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onChange && onChange(i)}
          >
            <Star
              size={size}
              fill={(hoverRating || rating) >= i ? "#FFD700" : "none"}
              stroke={(hoverRating || rating) >= i ? "#FFD700" : inactiveColor}
              className="transition-colors"
            />
          </span>
        );
      } else {
        if (i <= fullStars) {
          stars.push(<Star key={i} size={size} fill="#FFD700" stroke="#FFD700" />);
        } else if (i === fullStars + 1 && hasHalfStar) {
          stars.push(<StarHalf key={i} size={size} fill="#FFD700" stroke="#FFD700" />);
        } else {
          stars.push(<Star key={i} size={size} stroke={inactiveColor} />);
        }
      }
    }
    return stars;
  };

  return (
    <div className="flex">
      {renderStars()}
    </div>
  );
};

// Format relative time for reviews
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

interface User {
  _id: string;
  name: string;
  profilePicture?: string;
}

interface Review {
  _id: string;
  user: User;
  rating: number;
  comment: string;
  date: string;
  likes?: string[];
  createdAt: string;
}

interface CurrentUser {
  _id: string;
  name: string;
  profilePicture?: string;
}

interface NewReviewSectionProps {
  bookId: string;
  currentUser?: CurrentUser;
  onReviewAdded?: (review: Review) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const NewReviewSection: React.FC<NewReviewSectionProps> = ({ 
  bookId, 
  currentUser, 
  onReviewAdded = () => {},
  onToggleDarkMode
}) => {
    const { theme } = useTheme();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const darkMode = theme === 'dark';

  
  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await authApiHelper.get(`/reviews/book/${bookId}`);
        const data: Review[] = await response?.json();
        if (Array.isArray(data)) {
          setReviews(data);
          
          if (data.length > 0) {
            const avgRating = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
            setAverageRating(parseFloat(avgRating.toFixed(1)));
          }
          
          setReviewCount(data.length);
          
          // Check if user has already reviewed
          if (currentUser) {
            const userReviewData = data.find(review => review.user._id === currentUser._id);
            if (userReviewData) {
              setUserReview(userReviewData);
              setRating(userReviewData.rating);
              setComment(userReviewData.comment);
            }
          }
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    
    if (bookId) {
      fetchReviews();
    }
  }, [bookId, currentUser]);
  
  // Handle submitting a review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5');
      return;
    }
    
    try {
      setLoading(true);
      
      let response: Review;
      if (isEditing && userReview) {
        // Update existing review
        const res = await authApiHelper.put(`/reviews/${userReview._id}`, {
          rating,
          comment
        });
        if (!res) {
          throw new Error('Failed to fetch response');
        }
        response = await res.json();
      } else {
        // Create new review
        const res = await authApiHelper.post('/reviews', {
          audiobook: bookId,
          rating,
          comment
        });
        if (!res) {
          throw new Error('Failed to fetch response');
        }
        response = await res.json();
      }
      
      // Update the local state
      if (isEditing) {
        setReviews(reviews.map(r => 
          r._id === response._id ? response : r
        ));
      } else {
        setReviews([response, ...reviews]);
      }
      
      // Calculate new average
      const newAvg = (averageRating * reviewCount + rating) / (isEditing ? reviewCount : reviewCount + 1);
      setAverageRating(parseFloat(newAvg.toFixed(1)));
      
      if (!isEditing) {
        setReviewCount(prevCount => prevCount + 1);
      }
      
      setUserReview(response);
      setShowReviewForm(false);
      setIsEditing(false);
      setLoading(false);
      
      // Notify parent component
      onReviewAdded(response);
    } catch (err: any) {
      console.error("Error submitting review:", err);
      setError(err.response?.msg || 'Error submitting review. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle deleting a review
  const handleDeleteReview = async () => {
    if (!userReview) return;
    
    if (!window.confirm('Are you sure you want to delete your review?')) {
      return;
    }
    
    try {
      setLoading(true);
      await authApiHelper.delete(`/reviews/${userReview._id}`);
      
      // Update the state
      setReviews(reviews.filter(r => r._id !== userReview._id));
      setReviewCount(prevCount => prevCount - 1);
      
      // Recalculate average rating
      if (reviewCount > 1) {
        const newTotal = averageRating * reviewCount - userReview.rating;
        setAverageRating(parseFloat((newTotal / (reviewCount - 1)).toFixed(1)));
      } else {
        setAverageRating(0);
      }
      
      setUserReview(null);
      setRating(5);
      setComment('');
      setLoading(false);
    } catch (err) {
      console.error("Error deleting review:", err);
      setLoading(false);
    }
  };
  
  // Handle liking a review
  const handleLikeReview = async (reviewId: string) => {
    if (!currentUser) {
      alert("Please sign in to like reviews");
      return;
    }
    
    try {
      const res = await authApiHelper.post(`/reviews/${reviewId}/like`);
      if (!res) {
        throw new Error('Failed to fetch response');
      }
      const response = await res.json();
      
      // Update the likes count in the state
      setReviews(reviews.map(review => {
        if (review._id === reviewId) {
          const updatedLikes = [...(review.likes || [])];
          
          if (response.isLiked) {
            updatedLikes.push(currentUser._id);
          } else {
            const index = updatedLikes.indexOf(currentUser._id);
            if (index !== -1) {
              updatedLikes.splice(index, 1);
            }
          }
          
          return {
            ...review,
            likes: updatedLikes
          };
        }
        return review;
      }));
    } catch (err) {
      console.error("Error liking review:", err);
    }
  };
  
  // Check if user has liked a review
  const hasUserLiked = (review: Review) => {
    return currentUser && review.likes && review.likes.includes(currentUser._id);
  };
  
  return (
    <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-50 text-gray-900'} p-4 md:p-6 rounded-lg transition-colors duration-200`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Reviews & Comments</h3>
        <div className="flex items-center space-x-4">
          {currentUser && !showReviewForm && !userReview && (
            <button 
              className={`text-sm font-medium hover:text-indigo-400 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
              onClick={() => setShowReviewForm(true)}
            >
              Write a Review
            </button>
          )}
          {currentUser && userReview && !showReviewForm && (
            <div className="flex space-x-2">
              <button
                className={`text-sm font-medium flex items-center hover:text-indigo-400 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
                onClick={() => {
                  setIsEditing(true);
                  setShowReviewForm(true);
                }}
              >
                <Edit size={16} className="mr-1" />
                Edit
              </button>
              <button
                className={`text-sm font-medium flex items-center hover:text-red-400 ${darkMode ? 'text-red-400' : 'text-red-600'}`}
                onClick={handleDeleteReview}
                disabled={loading}
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            </div>
          )}
         
        </div>
      </div>
      
      {/* Display average rating */}
      <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} p-4 rounded-lg border mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl md:text-3xl font-bold">{averageRating}</span>
            <span className={`ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>/ 5</span>
          </div>
          <div className="flex">
            <StarRating rating={averageRating} size={20} darkMode={darkMode} />
          </div>
        </div>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Based on {reviewCount} reviews</p>
      </div>
      
      {/* Review form */}
      {showReviewForm && currentUser && (
        <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'} p-4 rounded-lg border mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">{isEditing ? 'Edit Your Review' : 'Write a Review'}</h4>
            <button 
              className={`hover:text-gray-400 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}
              onClick={() => {
                setShowReviewForm(false);
                setIsEditing(false);
                if (userReview) {
                  setRating(userReview.rating);
                  setComment(userReview.comment);
                }
              }}
            >
              <X size={18} />
            </button>
          </div>
          
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Your Rating
              </label>
              <StarRating 
                rating={rating} 
                size={24} 
                interactive={true} 
                onChange={setRating}
                darkMode={darkMode}
              />
            </div>
            
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Your Review
              </label>
              <textarea
                className={`w-full p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  darkMode 
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                    : 'border-gray-300 text-gray-900'
                }`}
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this audiobook..."
              ></textarea>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm mb-4">{error}</div>
            )}
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Submitting...' : (isEditing ? 'Update Review' : 'Post Review')}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Review list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className={`text-center p-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No reviews yet. Be the first to share your thoughts!
          </div>
        ) : (
          reviews.slice(0, showMoreReviews ? reviews.length : 2).map((review) => (
            <div 
              key={review._id} 
              className={`p-3 md:p-4 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <img 
                    src={review.user.profilePicture || '/default-avatar.png'} 
                    alt={review.user.name} 
                    className="w-8 h-8 rounded-full mr-2"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-avatar.png';
                    }}
                  />
                  <span className="font-medium">{review.user.name}</span>
                </div>
                <span className={`text-xs md:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  {formatRelativeTime(review.createdAt)}
                </span>
              </div>
              <div className="flex mb-2">
                <StarRating rating={review.rating} size={14} darkMode={darkMode} />
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{review.comment}</p>
              
              {/* Like button */}
              <div className="mt-3 flex items-center">
                <button 
                  className={`flex items-center text-xs hover:text-indigo-400 ${
                    hasUserLiked(review) 
                      ? 'text-indigo-500' 
                      : darkMode 
                        ? 'text-gray-400' 
                        : 'text-gray-500'
                  }`}
                  onClick={() => handleLikeReview(review._id)}
                  disabled={!currentUser}
                >
                  <ThumbsUp size={14} className="mr-1" />
                  <span>{review.likes?.length || 0}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Show more/less button */}
      {reviews.length > 2 && (
        <button 
          className={`mt-4 flex items-center hover:text-indigo-400 ${
            darkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`}
          onClick={() => setShowMoreReviews(!showMoreReviews)}
        >
          {showMoreReviews ? (
            <>
              <ChevronUp size={16} className="mr-1" />
              Show less reviews
            </>
          ) : (
            <>
              <ChevronDown size={16} className="mr-1" />
              Show all {reviews.length} reviews
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default NewReviewSection;