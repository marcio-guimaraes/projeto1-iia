import React from 'react';
import StarRating from './StarRating';
import { useAvaliacao } from '../context/AvaliacaoContext';

const BADGE_COLORS = {
  'Romance':            { bg: '#FEF3E2', text: '#92400E' },
  'Poesia':             { bg: '#F3E8FF', text: '#6B21A8' },
  'Conto':              { bg: '#E0F2FE', text: '#0369A1' },
  'Teatro':             { bg: '#FFE4E6', text: '#9F1239' },
  'Fantasia':           { bg: '#DCFCE7', text: '#166534' },
  'Nao-Ficcao':         { bg: '#F1F5F9', text: '#475569' },
  'Ficcao Cientifica':  { bg: '#D1FAE5', text: '#065F46' },
  'Narrativa':          { bg: '#FEF9C3', text: '#854D0E' },
  'Fábula':             { bg: '#FFF7ED', text: '#C2410C' },
};

const BookCard = ({ book }) => {
  const { historico, avaliarLivro } = useAvaliacao();
  const currentRating = historico[book.id] || 0;
  const badge = BADGE_COLORS[book.genero] || { bg: '#F0FDF4', text: '#166534' };
  const isRated = currentRating > 0;

  const handleRemoveRating = (e) => {
    e.stopPropagation();
    avaliarLivro(book.id, 0);
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        borderLeft: isRated
          ? '3px solid var(--accent-forest)'
          : '3px solid transparent',
        transition: 'border-left-color 0.25s',
      }}
    >
      {/* Cabeçalho: título + badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <h3 style={{
          fontFamily: 'var(--font-title)',
          fontSize: '1rem',
          color: 'var(--text-primary)',
          lineHeight: 1.3,
          flex: 1,
        }}>
          {book.titulo}
        </h3>
        <span style={{
          backgroundColor: badge.bg,
          color: badge.text,
          padding: '3px 9px',
          borderRadius: 'var(--radius-pill)',
          fontSize: '0.7rem',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          letterSpacing: '0.02em',
          flexShrink: 0,
        }}>
          {book.genero}
        </span>
      </div>

      {/* Autor */}
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0, fontFamily: 'var(--font-body)' }}>
        {book.autor}
      </p>

      {/* Meta (período + estilo) */}
      <div style={{ display: 'flex', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
        <span style={{
          backgroundColor: 'var(--bg-base)',
          padding: '2px 8px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-light)',
        }}>
          {book.periodo}
        </span>
        <span style={{
          backgroundColor: 'var(--bg-base)',
          padding: '2px 8px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-light)',
        }}>
          {book.estilo}
        </span>
      </div>

      {/* Avaliação + botão remover */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-light)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: '0.82rem',
            color: isRated ? 'var(--accent-forest)' : 'var(--text-muted)',
            fontWeight: isRated ? 600 : 400,
          }}>
            {isRated ? `Nota: ${currentRating}★` : 'Avalie este livro'}
          </span>
          <StarRating
            initialRating={currentRating}
            onRatingChange={(nota) => avaliarLivro(book.id, nota)}
          />
        </div>

        {/* Botão remover avaliação — aparece só quando há avaliação */}
        {isRated && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              onClick={handleRemoveRating}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-body)',
                padding: '2px 4px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'underline',
                textDecorationStyle: 'dotted',
                transition: 'color var(--transition)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#DC2626'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              title="Remover minha avaliação deste livro"
            >
              ✕ Remover avaliação
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
