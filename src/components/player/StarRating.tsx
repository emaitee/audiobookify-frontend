'use client'
import { useState } from 'react';
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
}

export const StarRating = ({ 
  rating, 
  setRating,
  size = 20, 
  interactive = false 
}: StarRatingProps) => {
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
export default StarRating;