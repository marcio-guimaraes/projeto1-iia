import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ initialRating = 0, onRatingChange, readonly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(initialRating);

  const handleMouseEnter = (index) => {
    if (!readonly) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!readonly) setHoverRating(0);
  };

  const handleClick = (index) => {
    if (!readonly) {
      setRating(index);
      if (onRatingChange) onRatingChange(index);
    }
  };

  return (
    <div 
      style={{ display: 'flex', gap: '2px' }} 
      onMouseLeave={handleMouseLeave}
      role="radiogroup"
      aria-label="Avaliação"
    >
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = index <= (hoverRating || rating);
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: readonly ? 'default' : 'pointer',
              color: isFilled ? 'var(--color-star-filled)' : 'var(--color-star-empty)',
              transition: 'transform 0.1s',
              transform: isFilled && !readonly && hoverRating === index ? 'scale(1.1)' : 'scale(1)'
            }}
            aria-label={`${index} Estrelas`}
            aria-checked={rating === index}
            role="radio"
            disabled={readonly}
          >
            <Star fill={isFilled ? 'currentColor' : 'none'} size={18} />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
