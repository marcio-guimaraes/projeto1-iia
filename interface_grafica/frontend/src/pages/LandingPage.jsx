import React from 'react';
import { Link } from 'react-router-dom';

const STATS = [
  { value: '55', label: 'Livros', sublabel: 'todos nacionais' },
  { value: '3', label: 'Modelos de IA', sublabel: 'TF-IDF · kNN · Híbrido' },
  { value: '500+', label: 'Usuários', sublabel: 'na base de treino' },
];

const LandingPage = () => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* HERO */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '80px 40px 60px',
        width: '100%',
      }}
      className="hero-grid"
      >
        {/* Coluna de texto */}
        <div className="animate-slide">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(45, 106, 79, 0.1)',
            border: '1px solid rgba(45, 106, 79, 0.25)',
            borderRadius: 'var(--radius-pill)',
            padding: '5px 14px',
            marginBottom: '24px',
          }}>
            <span style={{
              width: '7px', height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-forest)',
              display: 'inline-block',
            }} />
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--accent-forest)',
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Projeto 1 · IIA · UnB 2026/1
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            marginBottom: '20px',
          }}>
            Descubra seu próximo{' '}
            <span style={{
              color: 'var(--accent-forest)',
              fontStyle: 'italic',
            }}>
              livro favorito
            </span>
          </h1>

          <p style={{
            fontSize: '1.08rem',
            color: 'var(--text-secondary)',
            maxWidth: '480px',
            marginBottom: '36px',
            lineHeight: 1.7,
          }}>
            Recomendações personalizadas de literatura brasileira, baseadas no que você já leu e nos gostos de leitores com perfil similar.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link
              to="/avaliacao"
              className="btn-primary"
              style={{ padding: '13px 28px', fontSize: '1rem' }}
            >
              Começar avaliação →
            </Link>
            <Link
              to="/catalogo"
              className="btn-secondary"
              style={{ padding: '13px 28px', fontSize: '1rem' }}
            >
              Ver catálogo
            </Link>
          </div>
        </div>

        {/* Coluna visual: cartões de livros decorativos */}
        <div
          className="animate-fade"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            height: '340px',
          }}
        >
          {/* Stack de livros estilizado */}
          {[
            { title: 'Grande Sertão: Veredas', author: 'João Guimarães Rosa', color: '#2D6A4F', rot: '-8deg', x: '-60px', y: '20px', z: 1 },
            { title: 'Memórias Póstumas', author: 'Machado de Assis', color: '#B5621E', rot: '4deg', x: '30px', y: '-10px', z: 2 },
            { title: 'Dom Casmurro', author: 'Machado de Assis', color: '#5C3A1E', rot: '-2deg', x: '0', y: '0', z: 3 },
          ].map((book, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '200px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: book.color,
                padding: '22px 18px',
                transform: `rotate(${book.rot}) translate(${book.x}, ${book.y})`,
                zIndex: book.z,
                boxShadow: 'var(--shadow-lg)',
                cursor: 'default',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = `rotate(${book.rot}) translate(${book.x}, calc(${book.y} - 8px)) scale(1.03)`;
                e.currentTarget.style.zIndex = '10';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = `rotate(${book.rot}) translate(${book.x}, ${book.y})`;
                e.currentTarget.style.zIndex = book.z;
              }}
            >
              {/* Lombada decorativa */}
              <div style={{
                position: 'absolute',
                left: 0, top: 0, bottom: 0,
                width: '10px',
                backgroundColor: 'rgba(0,0,0,0.18)',
                borderRadius: 'var(--radius-lg) 0 0 var(--radius-lg)',
              }} />
              <p style={{
                fontFamily: 'var(--font-title)',
                fontStyle: 'italic',
                fontSize: '0.95rem',
                color: 'rgba(255,255,255,0.95)',
                lineHeight: 1.4,
                marginBottom: '12px',
                fontWeight: 600,
                paddingLeft: '4px',
              }}>
                {book.title}
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.65)',
                paddingLeft: '4px',
              }}>
                {book.author}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-light)',
        borderBottom: '1px solid var(--border-light)',
        padding: '28px 40px',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          {STATS.map((stat, i) => (
            <React.Fragment key={i}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'var(--accent-forest)',
                  lineHeight: 1,
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
                  marginTop: '4px',
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  marginTop: '2px',
                }}>
                  {stat.sublabel}
                </div>
              </div>
              {i < STATS.length - 1 && (
                <div style={{
                  width: '1px',
                  height: '50px',
                  backgroundColor: 'var(--border-light)',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '60px 40px',
        width: '100%',
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '10px',
          fontFamily: 'var(--font-title)',
          fontSize: '1.7rem',
          color: 'var(--text-primary)',
        }}>
          Como funciona?
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          marginBottom: '40px',
          fontSize: '0.95rem',
        }}>
          Três passos simples para descobrir sua próxima leitura
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
        }}>
          {[
            {
              step: '01',
              title: 'Avalie livros',
              desc: 'Dê notas de 1 a 5 estrelas para livros que você já leu. Mínimo de 3 avaliações.',
            },
            {
              step: '02',
              title: 'Escolha o modelo',
              desc: 'Conteúdo (TF-IDF), Colaborativo (kNN) ou Híbrido — você decide a abordagem.',
            },
            {
              step: '03',
              title: 'Receba recomendações',
              desc: 'A IA seleciona os 5 livros mais compatíveis com o seu perfil de leitor.',
            },
          ].map((item, i) => (
            <div key={i} className="card" style={{ textAlign: 'left' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--accent-forest)',
                letterSpacing: '0.08em',
                marginBottom: '12px',
                opacity: 0.8,
              }}>
                PASSO {item.step}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-title)',
                fontSize: '1.1rem',
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Responsive styles via style tag */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
            padding: 40px 20px !important;
          }
          .hero-grid > div:last-child {
            height: 220px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
