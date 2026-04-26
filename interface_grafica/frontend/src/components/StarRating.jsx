import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ initialRating = 0, onRatingChange, readonly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(initialRating);

  // Sincroniza estado interno quando a prop externa muda (ex: navegação entre abas)
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleMouseEnter = (index) => {
    if (!readonly) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!readonly) setHoverRating(0);
  };

  const handleClick = (index) => {
    if (!readonly) {
      // Clicar na mesma estrela já selecionada → remove a avaliação (vai para 0)
      const newRating = index === rating ? 0 : index;
      setRating(newRating);
      if (onRatingChange) onRatingChange(newRating);
    }
  };

  return (
    <div
      style={{ display: 'flex', gap: '1px' }}
      onMouseLeave={handleMouseLeave}
      role="radiogroup"
      aria-label="Avaliação com estrelas"
    >
      {[1, 2, 3, 4, 5].map((index) => {
        const isFilled = index <= (hoverRating || rating);
        const isCurrentRating = index === rating;
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
              transition: 'transform 0.1s, color 0.15s',
              transform: !readonly && hoverRating === index ? 'scale(1.2)' : 'scale(1)',
            }}
            aria-label={
              isCurrentRating
                ? `Remover avaliação de ${index} estrela${index > 1 ? 's' : ''}`
                : `Avaliar com ${index} estrela${index > 1 ? 's' : ''}`
            }
            aria-checked={rating === index}
            role="radio"
            disabled={readonly}
            title={
              isCurrentRating
                ? 'Clique para remover sua avaliação'
                : `${index} estrela${index > 1 ? 's' : ''}`
            }
          >
            <Star fill={isFilled ? 'currentColor' : 'none'} size={18} />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
