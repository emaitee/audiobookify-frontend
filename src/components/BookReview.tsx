'use client'
import { Edit, Heart, MessageCircleWarning, Star, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Book } from '@/app/[locale]/page';
import { useAuth } from '@/context/AuthContext';
import { apiHelper, authApiHelper } from '@/app/utils/api';

export const defaultAvatar = 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI='

// Review interface updated to match API response
export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
}

// Star Rating Component remains the same
const StarRating = ({ 
  rating, 
  setRating = undefined, 
  size = 20, 
  interactive = false 
}: { 
  rating: number; 
  setRating?: (rating: number) => void; 
  size?: number;
  interactive?: boolean;
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hoverRating !== null ? star <= hoverRating : star <= rating);
        
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${filled ? 'text-yellow-400' : 'text-white/30'}`}
            onClick={() => setRating && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(null)}
          >
            <Star size={size} fill={filled ? "currentColor" : "none"} />
          </button>
        );
      })}
    </div>
  );
};

// Format date to relative time remains the same
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}


function BookReview({ currentBook, setReviewCount }: { currentBook: Book | null, setReviewCount: (count: number) => void }) {
  const {user} = useAuth()
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reviews for the current book
  const fetchReviews = async () => {
    if (!currentBook?._id) return;
    
    try {
      setIsLoading(true);
      const response = await apiHelper.get(`/reviews/book/${currentBook._id}`);
      if (!response?.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      
      // Transform API data to match our interface
      const transformedReviews = data.map((review: any) => ({
        _id: review._id,
        user: {
          _id: review.user._id,
          name: review.user.name,
          avatar: review.user.profilePicture || defaultAvatar
        },
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        likes: review.likes || 0,
        isLiked: false // You'll need to implement this based on your API
      }));
      
      setReviews(transformedReviews);
      setReviewCount(data?.length)
      
      // Check if current user has a review
      if (user?._id) {
        const userReview = transformedReviews.find((r: Review) => r.user._id === user._id);
        if (userReview) {
          setUserRating(userReview.rating);
          setUserComment(userReview.tecommentxt);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentBook?._id, user?._id]);

  // Calculate average rating whenever reviews change
  useEffect(() => {
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating(totalRating / reviews.length);
    } else {
      setAverageRating(0);
    }
  }, [reviews]);

  // Handle submitting a new review or editing existing
  const handleSubmitReview = async () => {
    if (!userRating) {
      alert('Please add a rating');
      return;
    }
    
    if (!user?._id) {
      alert('Please sign in to submit a review');
      return;
    }
    
    setIsSubmittingReview(true);
    
    try {
      const method = editingReviewId ? 'PUT' : 'POST';
      const endpoint = editingReviewId 
        ? `/reviews/${editingReviewId}`
        : '/reviews';

        const formData = {
            audiobook: currentBook?._id,
            rating: userRating,
            comment: userComment
          }
    let response;
    if(editingReviewId) {
        response = await authApiHelper.put(endpoint, formData)
    } else {
        response = await authApiHelper.post(endpoint, formData)
    }
      
      if (!response?.ok) {
        throw new Error(response?.statusText);
      }
      
    //   const result = await response.json();
      
      // Refresh reviews after submission
      await fetchReviews();
      
      // Reset form
      setEditingReviewId(null);
      setUserComment('');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };
  
  // Handle editing review
  const handleEditReview = (reviewId: string) => {
    const reviewToEdit = reviews.find(review => review._id === reviewId);
    if (reviewToEdit) {
      setUserRating(reviewToEdit.rating);
      setUserComment(reviewToEdit.comment);
      setEditingReviewId(reviewId);
    }
  };
  
  // Handle deleting review
  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const response = await authApiHelper.delete(`/reviews/${reviewId}`);
      
      if (!response?.ok) {
        throw new Error(response?.statusText);
      }
      
      // Refresh reviews after deletion
      await fetchReviews();
      
      if (editingReviewId === reviewId) {
        setEditingReviewId(null);
        setUserRating(0);
        setUserComment('');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review');
    }
  };
  
  // Toggle like on a review
  const handleToggleLike = async (reviewId: string) => {
    if (!user?._id) {
      alert('Please sign in to like reviews');
      return;
    }
    
    try {
      // You'll need to implement this endpoint in your API
      const response = await authApiHelper.post(`/reviews/${reviewId}/like`);
      
      if (!response?.ok) {
        throw new Error(response?.statusText);
      }
      
      // Refresh reviews after like
      await fetchReviews();
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('Failed to toggle like');
    }
  };

  if (!currentBook) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <MessageCircleWarning size={32} className="text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No audiobook selected</h2>
          <p className="text-gray-500 max-w-md">Please select an audiobook to see reviews</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        <p>{error}</p>
        <button 
          onClick={fetchReviews}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* {JSON.stringify(user)} */}
      {/* Review form - only show if user is logged in */}
      {user?._id && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
          <h3 className="text-white font-medium mb-3">
            {editingReviewId ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          <StarRating 
            rating={userRating} 
            setRating={setUserRating} 
            interactive={true} 
            size={20} 
          />
          <textarea
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            placeholder="Share your thoughts about this audiobook..."
            className="w-full mt-3 bg-white/10 border border-white/20 rounded-lg p-3 text-white/90 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            {editingReviewId && (
              <button
                onClick={() => {
                  setEditingReviewId(null);
                  setUserRating(0);
                  setUserComment('');
                }}
                className="px-3 py-1 text-sm text-white/70 hover:text-white mr-2"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmitReview}
              disabled={isSubmittingReview || !userRating}
              className={`px-4 py-2 text-sm rounded-full ${userRating ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-white/10 text-white/50 cursor-not-allowed'} transition-colors`}
            >
              {isSubmittingReview ? 'Submitting...' : editingReviewId ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-white/60 text-sm text-center py-4">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <img 
                    src={review.user.avatar} 
                    alt={review.user.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-medium text-sm">{review.user.name}</p>
                    <StarRating rating={review.rating} size={14} />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white/50 text-xs">{formatRelativeTime(review.createdAt)}</span>
                  {review.user._id === user?._id && (
                    <>
                      <button 
                        onClick={() => handleEditReview(review._id)}
                        className="text-white/50 hover:text-white"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-white/50 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>

              </div>
              <p className="text-white/80 text-sm mt-3">{review.comment}</p>
              <div className="flex justify-end mt-3">
                <button 
                  onClick={() => handleToggleLike(review._id)}
                  className={`flex items-center text-xs ${review.isLiked ? 'text-pink-400' : 'text-white/50 hover:text-white'}`}
                >
                  <Heart 
                    size={14} 
                    fill={review.isLiked ? "currentColor" : "none"} 
                    className="mr-1" 
                  />
                  {review.likes && review.likes > 0 && <span>{review.likes}</span>}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BookReview