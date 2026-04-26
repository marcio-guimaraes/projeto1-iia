import React, { useState } from 'react';

const MODELS = [
  {
    id: 'conteudo',
    title: 'Baseado em Conteúdo',
    tech: 'TF-IDF',
    color: 'var(--accent-forest)',
    description:
      'Cada livro é representado como um vetor de características (gênero, período, estilo) ponderadas por TF-IDF. O sistema recomenda os itens com maior similaridade de cosseno em relação aos livros bem avaliados pelo usuário.',
  },
  {
    id: 'colaborativo',
    title: 'Filtragem Colaborativa',
    tech: 'kNN User-Based',
    color: '#7C3AED',
    description:
      'A matriz de utilidade (100 usuários × 55 livros) é centralizada por usuário para remover vieses. O sistema encontra os k vizinhos mais próximos do novo usuário e prediz notas como média ponderada pela similaridade de cosseno.',
  },
  {
    id: 'hibrido',
    title: 'Híbrido',
    tech: 'Conteúdo + Colaborativo',
    color: 'var(--accent-warm)',
    description:
      'Combina as predições normalizadas dos dois modelos via média ponderada ajustável. Minimiza o problema de cold-start do colaborativo enquanto dilui a limitação de diversidade do baseado em conteúdo.',
  },
];

const REFS = [
  'Salton, G. & McGill, M. J. (1983). Introduction to Modern Information Retrieval. McGraw-Hill.',
  'Resnick, P. et al. (1994). GroupLens: An Open Architecture for Collaborative Filtering. CSCW.',
  'Herlocker, J. et al. (2004). Evaluating Collaborative Filtering Recommender Systems. ACM TOIS.',
  'Bishop, C. M. (2006). Pattern Recognition and Machine Learning. Springer.',
];

const SobrePage = () => {
  const [openModel, setOpenModel] = useState('hibrido');

  return (
    <div style={{ maxWidth: '820px', margin: '40px auto', padding: '0 24px 60px' }}>

      {/* Cabeçalho */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{
          fontSize: '0.78rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-forest)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          Projeto 1 · Introdução à IA · UnB 2026/1
        </p>
        <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '12px' }}>Sobre o sistema</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '680px', fontSize: '1rem' }}>
          Sistema de recomendação de livros nacionais desenvolvido como Projeto 1 da disciplina de
          Introdução à Inteligência Artificial. O catálogo conta com {' '}
          <strong style={{ color: 'var(--text-primary)' }}>55 obras da literatura brasileira</strong>,
          cada uma com 3 características de perfil, e uma matriz de utilidade com{' '}
          <strong style={{ color: 'var(--text-primary)' }}>500 usuários de treino</strong>.
        </p>
      </div>

      <hr className="divider" />

      {/* Modelos */}
      <section style={{ marginBottom: '40px' }}>
        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', marginBottom: '18px', color: 'var(--text-primary)' }}>
          Como os modelos funcionam
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {MODELS.map((m) => {
            const isOpen = openModel === m.id;
            return (
              <div
                key={m.id}
                className="card"
                style={{
                  cursor: 'pointer',
                  borderLeft: `3px solid ${isOpen ? m.color : 'var(--border-light)'}`,
                  transition: 'border-left-color 0.25s',
                }}
                onClick={() => setOpenModel(isOpen ? null : m.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h4 style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
                      margin: 0,
                      transition: 'color 0.2s',
                    }}>
                      {m.title}
                    </h4>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: m.color,
                      backgroundColor: `${m.color}15`,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      letterSpacing: '0.04em',
                    }}>
                      {m.tech}
                    </span>
                  </div>
                  <span style={{
                    color: 'var(--text-muted)',
                    fontSize: '1.1rem',
                    fontWeight: 300,
                    transition: 'transform 0.2s',
                    display: 'inline-block',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                  }}>
                    ↓
                  </span>
                </div>

                {isOpen && (
                  <p className="animate-fade" style={{
                    marginTop: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.65,
                    fontSize: '0.9rem',
                  }}>
                    {m.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <hr className="divider" />

      {/* Referências */}
      <section>
        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
          Referências
        </h3>
        <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {REFS.map((ref, i) => (
            <li key={i} style={{
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              lineHeight: 1.6,
            }}>
              {ref}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default SobrePage;
