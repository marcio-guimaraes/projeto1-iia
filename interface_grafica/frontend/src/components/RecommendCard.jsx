import React, { useState } from 'react';

// Tooltip nativo com CSS puro (sem biblioteca)
const WHY_TOOLTIP_STYLES = {
  position: 'relative',
  display: 'inline-block',
};

const RELEVANCE_LABELS = ['Baixa', 'Baixa', 'Média', 'Alta', 'Muito Alta'];

function RelevanceIndicator({ score }) {
  // score varia de 0.0 a 1.0 (ou nota prevista ~0-5)
  // Normaliza para 0-4 dots
  const normalized = score !== null && score !== undefined
    ? Math.min(Math.round(score * 4), 4)
    : 2;
  const label = RELEVANCE_LABELS[normalized] || 'Média';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
        Relevância:
      </span>
      <div style={{ display: 'flex', gap: '3px' }}>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: i < normalized
                ? 'var(--accent-forest)'
                : 'var(--border-medium)',
              transition: 'background-color 0.2s',
            }}
          />
        ))}
      </div>
      <span style={{
        fontSize: '0.72rem',
        fontWeight: 600,
        color: normalized >= 3 ? 'var(--accent-forest)' : 'var(--text-muted)',
        fontFamily: 'var(--font-body)',
      }}>
        {label}
      </span>
    </div>
  );
}

// Modal simples "Por que este livro?"
function WhyModal({ book, tooltipText, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(30, 58, 53, 0.45)',
        zIndex: 2000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel animate-slide"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '32px',
          backgroundColor: 'var(--bg-card)',
        }}
      >
        <h3 style={{
          fontFamily: 'var(--font-title)',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          fontSize: '1.2rem',
        }}>
          Por que "{book.titulo}"?
        </h3>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '16px',
        }}>
          {tooltipText}
        </p>
        <div style={{
          backgroundColor: 'var(--bg-base)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          marginBottom: '20px',
          border: '1px solid var(--border-light)',
        }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span><strong style={{ color: 'var(--text-secondary)' }}>Autor:</strong> {book.autor}</span>
            <span><strong style={{ color: 'var(--text-secondary)' }}>Gênero:</strong> {book.genero}</span>
            <span><strong style={{ color: 'var(--text-secondary)' }}>Período:</strong> {book.periodo}</span>
            <span><strong style={{ color: 'var(--text-secondary)' }}>Estilo:</strong> {book.estilo}</span>
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={onClose}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Entendi
        </button>
      </div>
    </div>
  );
}

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

const RecommendCard = ({ book, index, tooltipText }) => {
  const [showModal, setShowModal] = useState(false);
  const badge = BADGE_COLORS[book.genero] || { bg: '#F0FDF4', text: '#166534' };

  return (
    <>
      {showModal && (
        <WhyModal
          book={book}
          tooltipText={tooltipText}
          onClose={() => setShowModal(false)}
        />
      )}

      <div
        className="card animate-fade"
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-start',
          animationDelay: `${index * 0.07}s`,
        }}
      >
        {/* Rank */}
        <div style={{
          minWidth: '42px',
          height: '42px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: index === 0 ? 'var(--accent-forest)' : 'var(--bg-base)',
          color: index === 0 ? '#fff' : 'var(--text-muted)',
          border: `1.5px solid ${index === 0 ? 'var(--accent-forest)' : 'var(--border-light)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-title)',
          fontWeight: '700',
          fontSize: '1rem',
          flexShrink: 0,
        }}>
          #{index + 1}
        </div>

        {/* Conteúdo */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <h3 style={{
              fontFamily: 'var(--font-title)',
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              flex: 1,
              minWidth: '120px',
            }}>
              {book.titulo}
            </h3>
            <span style={{
              backgroundColor: badge.bg,
              color: badge.text,
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.72rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              letterSpacing: '0.02em',
            }}>
              {book.genero}
            </span>
          </div>

          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '2px',
            fontFamily: 'var(--font-body)',
          }}>
            {book.autor}
            {book.estilo && <span style={{ marginLeft: '8px', color: 'var(--border-medium)' }}>·</span>}
            {book.estilo && <span style={{ marginLeft: '8px' }}>{book.estilo}</span>}
          </p>

          <RelevanceIndicator score={book.score} />
        </div>

        {/* Ação */}
        <div style={{ flexShrink: 0 }}>
          <button
            className="btn-ghost"
            onClick={() => setShowModal(true)}
            title="Por que este livro foi recomendado?"
            style={{
              color: 'var(--accent-forest)',
              fontWeight: 600,
              fontSize: '0.82rem',
              padding: '6px 12px',
              border: '1.5px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            Por que?
          </button>
        </div>
      </div>
    </>
  );
};

export default RecommendCard;
