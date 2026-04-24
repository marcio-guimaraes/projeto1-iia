import React from 'react';
import StarRating from './StarRating';
import { useAvaliacao } from '../context/AvaliacaoContext';

const BADGE_COLORS = {
  'Romance': '#D4A853',
  'Poesia': '#9b59b6',
  'Conto': '#3498db',
  'Teatro': '#e74c3c',
  'Fantasia': '#2ecc71',
  'Nao-Ficcao': '#95a5a6',
  'Ficcao Cientifica': '#1abc9c',
  'Narrativa': '#e67e22',
  'Fábula': '#f1c40f'
};

const BookCard = ({ book }) => {
  const { historico, avaliarLivro } = useAvaliacao();
  const currentRating = historico[book.id] || 0;
  
  const badgeColor = BADGE_COLORS[book.genero] || '#58A6A6';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: '1.2rem', margin: 0, lineHeight: 1.2 }}>{book.titulo}</h3>
        <span style={{
          backgroundColor: `${badgeColor}22`,
          color: badgeColor,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          marginLeft: '10px'
        }}>
          {book.genero}
        </span>
      </div>
      
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
        {book.autor}
      </p>
      
      <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
        <span>{book.periodo}</span>
        <span>•</span>
        <span>{book.estilo}</span>
      </div>
      
      <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem' }}>{currentRating > 0 ? 'Sua nota:' : 'Avaliar:'}</span>
          <StarRating 
            initialRating={currentRating} 
            onRatingChange={(nota) => avaliarLivro(book.id, nota)} 
          />
        </div>
      </div>
    </div>
  );
};

export default BookCard;
