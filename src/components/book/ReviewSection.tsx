// import { useState, useEffect } from 'react';
// import { Star, ChevronUp, ChevronDown } from 'lucide-react';
// import ReviewModal from './ReviewModal';
// import { authApiHelper } from '@/app/utils/api';
// import { useAuth } from '@/context/AuthContext';
// import { StarRating } from '@/app/[locale]/playing/page';

// interface ReviewsSectionProps {
//   bookId: string;
//   slug: string;
// }

// const ReviewsSection = ({ bookId, slug }: ReviewsSectionProps) => {
//   const { user } = useAuth();
//   interface Review {
//     _id: string;
//     user: {
//       _id: string;
//       name: string;
//       profilePicture?: string;
//     };
//     rating: number;
//     comment: string;
//     date: string;
//     likes?: string[];
//   }
  
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [averageRating, setAverageRating] = useState(0);
//   const [reviewCount, setReviewCount] = useState(0);
//   const [showMoreReviews, setShowMoreReviews] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [userReview, setUserReview] = useState<Review | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch reviews and book rating
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [reviewsResRaw, bookResRaw] = await Promise.all([
//           authApiHelper.get(`/reviews/book/${bookId}`),
//           authApiHelper.get(`/books/${slug}`)
//         ]);

//         const bookRes = await bookResRaw?.json();
//         const reviewsRes = await reviewsResRaw?.json();

//         setReviews(Array.isArray(reviewsRes) ? reviewsRes : []);
//         setAverageRating(bookRes.averageRating ?? 0);
//         setReviewCount(bookRes?.ratingsCount ?? 0);
        
//         // Check if user has already reviewed this book
//         if (user) {
//           const userReview: Review | undefined = reviewsRes.find((r: Review) => r.user._id === user._id);
//           setUserReview(userReview || null);
//         }
//       } catch (error) {
//         console.error('Error fetching reviews:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [bookId, user]);

// interface ReviewSubmitResponse {
//     data: Review;
// }

// const handleReviewSubmit = async (rating: number, comment: string): Promise<void> => {
//     try {
//         const response = await authApiHelper.post('/reviews', {
//             audiobook: bookId,
//             rating,
//             comment
//         });

//         if (!response) {
//             throw new Error('Failed to submit review: No response received');
//         }

//         const responseData: ReviewSubmitResponse = await response.json();

//         // Update local state
//         if (userReview) {
//             // Update existing review
//             setReviews(reviews.map(r => 
//                 r._id === userReview._id ? response.data : r
//             ));
//         } else {
//             // Add new review
//             setReviews([response.data, ...reviews]);
//             setReviewCount(prev => prev + 1);
//         }

//         // Update average rating
//         const newAverage = reviews.reduce((sum, r) => {
//             return sum + (r._id === userReview?._id ? rating : r.rating);
//         }, 0) / (userReview ? reviews.length : reviews.length + 1);
        
//         setAverageRating(parseFloat(newAverage.toFixed(1)));
//         setUserReview(response.data);
//         setIsModalOpen(false);
//     } catch (error) {
//         console.error('Error submitting review:', error);
//     }
// };

//   const handleDeleteReview = async () => {
//     try {
//       await authApiHelper.delete(`/reviews/${userReview._id}`);
      
//       // Update local state
//       setReviews(reviews.filter(r => r._id !== userReview._id));
//       setReviewCount(prev => prev - 1);
      
//       // Recalculate average rating
//       const newAverage = reviews.length > 1 
//         ? reviews.reduce((sum, r) => sum + (r._id === userReview._id ? 0 : r.rating), 0) / (reviews.length - 1)
//         : 0;
      
//       setAverageRating(parseFloat(newAverage.toFixed(1)));
//       setUserReview(null);
//     } catch (error) {
//       console.error('Error deleting review:', error);
//     }
//   };

//   const handleLikeReview = async (reviewId) => {
//     try {
//       const response = await authApiHelper.post(`/reviews/${reviewId}/like`);
      
//       setReviews(reviews.map(review => {
//         if (review._id === reviewId) {
//           return {
//             ...review,
//             likes: response.data.isLiked 
//               ? [...review.likes, user._id]
//               : review.likes.filter((id: string) => id !== user._id)
//           };
//         }
//         return review;
//       }));
//     } catch (error) {
//       console.error('Error liking review:', error);
//     }
//   };

//   const formatRelativeTime = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInSeconds = Math.floor((now - date) / 1000);
    
//     if (diffInSeconds < 60) return 'Just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//     if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
//     return date.toLocaleDateString();
//   };

//   if (isLoading) {
//     return <div>Loading reviews...</div>;
//   }

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold hidden md:block">Reviews & Comments</h3>
//         {user && (
//           <button 
//             className="text-indigo-600 text-sm font-medium hover:text-indigo-800 hidden md:block"
//             onClick={() => setIsModalOpen(true)}
//           >
//             {userReview ? 'Edit Review' : 'Write a Review'}
//           </button>
//         )}
//       </div>
      
//       <div className="bg-white p-4 rounded-lg border border-gray-100 mb-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-baseline">
//             <span className="text-2xl md:text-3xl font-bold">{averageRating || 0}</span>
//             <span className="text-gray-500 ml-1">/ 5</span>
//           </div>
//           <div className="flex">
//             <StarRating rating={averageRating || 0} size={20} />
//           </div>
//         </div>
//         <p className="text-sm text-gray-500 mt-1">Based on {reviewCount} reviews</p>
//       </div>
      
//       <div className="space-y-4">
//         {reviews.slice(0, showMoreReviews ? reviews.length : 2).map((review) => (
//           <div key={review._id} className="bg-white p-3 md:p-4 rounded-lg border border-gray-100">
//             <div className="flex justify-between items-center mb-2">
//               <div className="flex items-center">
//                 <img 
//                   src={review.user.profilePicture || '/default-avatar.png'} 
//                   alt={review.user.name} 
//                   className="w-8 h-8 rounded-full mr-2"
//                 />
//                 <span className="font-medium">{review.user.name}</span>
//               </div>
//               <span className="text-gray-500 text-xs md:text-sm">
//                 {formatRelativeTime(review.date)}
//               </span>
//             </div>
//             <div className="flex mb-2">
//               <StarRating rating={review.rating} size={14} />
//             </div>
//             <p className="text-gray-700 text-sm mb-3">{review.comment}</p>
            
//             {/* Like button */}
//             <div className="flex items-center">
//               <button 
//                 onClick={() => handleLikeReview(review._id)}
//                 className="flex items-center text-gray-500 hover:text-indigo-600"
//               >
//                 <Star 
//                   size={14} 
//                   className={`mr-1 ${review.likes?.includes(user?._id) ? 'fill-indigo-600 text-indigo-600' : ''}`}
//                 />
//                 <span className="text-xs">
//                   {review.likes?.length || 0} {review.likes?.length === 1 ? 'like' : 'likes'}
//                 </span>
//               </button>
              
//               {/* Delete button (for user's own reviews) */}
//               {user && review.user._id === user._id && (
//                 <button 
//                   onClick={handleDeleteReview}
//                   className="ml-4 text-xs text-red-500 hover:text-red-700"
//                 >
//                   Delete
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {reviews.length > 2 && (
//         <button 
//           className="mt-4 text-indigo-600 flex items-center hover:text-indigo-800"
//           onClick={() => setShowMoreReviews(!showMoreReviews)}
//         >
//           {showMoreReviews ? (
//             <>
//               <ChevronUp size={16} className="mr-1" />
//               Show less reviews
//             </>
//           ) : (
//             <>
//               <ChevronDown size={16} className="mr-1" />
//               Show all {reviews.length} reviews
//             </>
//           )}
//         </button>
//       )}
      
//       <ReviewModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={handleReviewSubmit}
//         initialRating={userReview?.rating}
//         initialComment={userReview?.comment}
//       />
//     </div>
//   );
// };

// export default ReviewsSection;