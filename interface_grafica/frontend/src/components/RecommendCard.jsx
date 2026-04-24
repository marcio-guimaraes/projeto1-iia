import React from 'react';
import { Bookmark, Info } from 'lucide-react';

const RecommendCard = ({ book, index, tooltipText }) => {
  // Animating the score bar width based on rank/score
  const scorePct = book.score ? Math.min(book.score * 100, 100) : 0;
  
  return (
    <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'var(--color-bg-deep)',
        WebkitTextStroke: '1px var(--color-accent-gold)',
        minWidth: '40px',
        textAlign: 'center'
      }}>
        #{index + 1}
      </div>
      
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{book.titulo}</h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>
          {book.autor} • {book.genero} • {book.estilo}
        </p>
        
        {book.score !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', width: '45px' }}>Score:</span>
            <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${scorePct}%`, 
                  height: '100%', 
                  backgroundColor: 'var(--color-accent-gold)',
                  transition: 'width 1s ease-out'
                }} 
              />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{book.score.toFixed(3)}</span>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button className="btn-secondary" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }} title={tooltipText}>
          <Info size={16} /> Por que?
        </button>
        <button className="btn-primary" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
          <Bookmark size={16} /> Salvar
        </button>
      </div>
    </div>
  );
};

export default RecommendCard;
