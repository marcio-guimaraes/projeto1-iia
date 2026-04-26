import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAvaliacao } from '../context/AvaliacaoContext';
import { fetchPopulares, fetchLivros } from '../api/recomendador';
import BookCard from '../components/BookCard';

const GENEROS = ['Romance', 'Poesia', 'Ficção Científica', 'Conto', 'Teatro', 'Fábula', 'Fantasia'];

const MODELOS = [
  {
    id: 'conteudo',
    title: 'Baseado em Conteúdo',
    tech: 'TF-IDF',
    desc: 'Recomenda livros com características estritamente similares aos que você curtiu.',
    color: 'var(--accent-forest)',
  },
  {
    id: 'colaborativo',
    title: 'Filtragem Colaborativa',
    tech: 'kNN',
    desc: 'Recomenda baseado no gosto de leitores com perfil similar ao seu.',
    color: '#7C3AED',
  },
  {
    id: 'hibrido',
    title: 'Híbrido',
    tech: 'Recomendado',
    desc: 'Combina os dois modelos anteriores com pesos ajustáveis.',
    color: 'var(--accent-warm)',
    highlighted: true,
  },
];

const AvaliacaoPage = () => {
  const [step, setStep] = useState(1);
  const { nome, setNome, generosFavoritos, setGenerosFavoritos, historico } = useAvaliacao();

  // Passo 2 — livros
  const [populares, setPopulares] = useState([]);
  const [todosCatalogo, setTodosCatalogo] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('populares'); // 'populares' | 'buscar'
  const searchInputRef = useRef(null);

  const [pesoConteudo, setPesoConteudo] = useState(40);
  const navigate = useNavigate();

  const avaliadosCount = Object.keys(historico).length;

  // Carrega populares + catálogo completo na etapa 2
  useEffect(() => {
    if (step === 2 && populares.length === 0) {
      setLoadingBooks(true);
      Promise.all([
        fetchPopulares(15),
        fetchLivros(),
      ])
        .then(([popRes, livrosRes]) => {
          setPopulares(popRes.recomendacoes || []);
          setTodosCatalogo(livrosRes.livros || []);
        })
        .catch(console.error)
        .finally(() => setLoadingBooks(false));
    }
  }, [step]);

  // Foca no input ao trocar para aba de busca
  useEffect(() => {
    if (activeTab === 'buscar') {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [activeTab]);

  const toggleGenero = (g) => {
    setGenerosFavoritos(
      generosFavoritos.includes(g)
        ? generosFavoritos.filter((x) => x !== g)
        : [...generosFavoritos, g]
    );
  };

  const submitToRecomendacoes = (modelo) => {
    navigate(`/recomendacoes?modelo=${modelo}&peso=${pesoConteudo / 100}`);
  };

  // Livros filtrados pela busca no catálogo completo
  const resultadosBusca = searchTerm.trim().length >= 2
    ? todosCatalogo.filter((l) => {
        const term = searchTerm.toLowerCase();
        return (
          l.titulo.toLowerCase().includes(term) ||
          l.autor.toLowerCase().includes(term)
        );
      })
    : [];

  const livrosExibidos =
    activeTab === 'populares' ? populares : resultadosBusca;

  const STEP_LABELS = ['Seu perfil', 'Avalie livros', 'Escolha o modelo'];

  return (
    <div style={{ maxWidth: '820px', margin: '40px auto', padding: '0 24px' }}>

      {/* Stepper */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '0', marginBottom: '16px' }}>
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <div
                key={i}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative' }}
              >
                {i > 0 && (
                  <div style={{
                    position: 'absolute', left: 0, top: '14px',
                    width: '50%', height: '2px',
                    backgroundColor: isDone || isActive ? 'var(--accent-forest)' : 'var(--border-light)',
                    transition: 'background-color 0.3s',
                  }} />
                )}
                {i < STEP_LABELS.length - 1 && (
                  <div style={{
                    position: 'absolute', right: 0, top: '14px',
                    width: '50%', height: '2px',
                    backgroundColor: isDone ? 'var(--accent-forest)' : 'var(--border-light)',
                    transition: 'background-color 0.3s',
                  }} />
                )}
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: isDone ? 'var(--accent-forest)' : isActive ? 'var(--bg-dark)' : 'var(--border-light)',
                  color: isDone || isActive ? '#fff' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, zIndex: 1, position: 'relative',
                  transition: 'all 0.3s',
                  border: isActive ? '2px solid var(--bg-dark)' : 'none',
                  boxShadow: isActive ? '0 0 0 3px rgba(30, 58, 53, 0.15)' : 'none',
                }}>
                  {isDone ? '✓' : stepNum}
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: 'var(--font-body)',
                  textAlign: 'center',
                }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ────────────── ETAPA 1: Perfil ────────────── */}
      {step === 1 && (
        <div className="glass-panel animate-fade" style={{ padding: '36px' }}>
          <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '6px' }}>Seu perfil de leitor</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '0.9rem' }}>
            Essas informações nos ajudam a personalizar melhor as recomendações.
          </p>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', marginBottom: '8px',
              fontWeight: 600, fontSize: '0.9rem',
              color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
            }}>
              Como gosta de ser chamado?{' '}
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              id="input-nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome ou apelido"
              style={{ maxWidth: '380px' }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block', marginBottom: '12px',
              fontWeight: 600, fontSize: '0.9rem',
              color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
            }}>
              O que você costuma ler?
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {GENEROS.map((g) => {
                const selected = generosFavoritos.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenero(g)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: selected ? 'var(--accent-forest)' : 'var(--bg-base)',
                      color: selected ? '#fff' : 'var(--text-secondary)',
                      border: `1.5px solid ${selected ? 'var(--accent-forest)' : 'var(--border-medium)'}`,
                      fontFamily: 'var(--font-body)',
                      fontWeight: selected ? 600 : 400,
                      fontSize: '0.875rem',
                      transition: 'all var(--transition)',
                      cursor: 'pointer',
                    }}
                  >
                    {selected && <span style={{ marginRight: '4px', fontSize: '0.7rem' }}>✓</span>}
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          <button className="btn-primary" onClick={() => setStep(2)} style={{ padding: '12px 28px' }}>
            Próximo →
          </button>
        </div>
      )}

      {/* ────────────── ETAPA 2: Avalie livros ────────────── */}
      {step === 2 && (
        <div className="animate-fade">

          {/* Cabeçalho do passo */}
          <div className="glass-panel" style={{ padding: '24px 28px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '4px' }}>Avalie livros que você já leu</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                  Dê notas de 1 a 5 estrelas. Avalie pelo menos 3 livros.
                </p>
              </div>

              {/* Contador de avaliados */}
              <div style={{
                backgroundColor: avaliadosCount >= 3 ? 'rgba(45, 106, 79, 0.1)' : 'var(--bg-base)',
                border: `1.5px solid ${avaliadosCount >= 3 ? 'var(--accent-forest)' : 'var(--border-medium)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '10px 20px',
                textAlign: 'center',
                minWidth: '90px',
              }}>
                <div style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: avaliadosCount >= 3 ? 'var(--accent-forest)' : 'var(--text-muted)',
                  lineHeight: 1,
                }}>
                  {avaliadosCount}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  avaliado{avaliadosCount !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs + Busca */}
          <div style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            {/* Tab Pills */}
            <div style={{
              display: 'flex',
              backgroundColor: 'var(--bg-base)',
              borderRadius: 'var(--radius-md)',
              padding: '3px',
              border: '1px solid var(--border-light)',
              flexShrink: 0,
            }}>
              {[
                { key: 'populares', label: 'Populares' },
                { key: 'buscar', label: 'Buscar livro' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 'calc(var(--radius-md) - 2px)',
                    backgroundColor: activeTab === key ? 'var(--bg-dark)' : 'transparent',
                    color: activeTab === key ? '#fff' : 'var(--text-muted)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: activeTab === key ? 600 : 400,
                    fontSize: '0.855rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Campo de busca — sempre visível mas mais proeminente na aba buscar */}
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <svg
                style={{
                  position: 'absolute', left: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
                width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                ref={searchInputRef}
                id="avaliacao-search"
                type="search"
                placeholder="Buscar por título ou autor..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.trim().length >= 2) setActiveTab('buscar');
                }}
                style={{
                  paddingLeft: '36px',
                  opacity: activeTab === 'buscar' ? 1 : 0.6,
                }}
              />
            </div>

            {searchTerm && (
              <button
                className="btn-ghost"
                onClick={() => { setSearchTerm(''); setActiveTab('populares'); }}
                style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '7px 12px', flexShrink: 0 }}
                title="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>

          {/* Info contextual */}
          {activeTab === 'buscar' && searchTerm.trim().length < 2 && (
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '12px 0 4px',
              fontStyle: 'italic',
            }}>
              Digite pelo menos 2 letras para buscar no catálogo completo de {todosCatalogo.length || 55} livros.
            </p>
          )}

          {/* Grid de livros */}
          {loadingBooks ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '14px',
              marginBottom: '24px',
            }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card skeleton" style={{ height: '160px' }} />
              ))}
            </div>
          ) : (
            <>
              {/* Resultado de busca vazio */}
              {activeTab === 'buscar' && searchTerm.trim().length >= 2 && resultadosBusca.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: 'var(--text-muted)',
                }}>
                  <p style={{ fontFamily: 'var(--font-title)', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Nenhum livro encontrado para "{searchTerm}"
                  </p>
                  <p style={{ fontSize: '0.85rem' }}>Tente outro termo.</p>
                </div>
              )}

              {livrosExibidos.length > 0 && (
                <>
                  {/* Label da seção */}
                  <p style={{
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent-forest)',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}>
                    {activeTab === 'populares'
                      ? `${livrosExibidos.length} livros mais populares`
                      : `${livrosExibidos.length} resultado${livrosExibidos.length !== 1 ? 's' : ''} para "${searchTerm}"`
                    }
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '14px',
                    marginBottom: '24px',
                    maxHeight: activeTab === 'populares' ? '520px' : 'none',
                    overflowY: activeTab === 'populares' ? 'auto' : 'visible',
                    paddingRight: activeTab === 'populares' ? '4px' : '0',
                  }}>
                    {livrosExibidos.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <button className="btn-secondary" onClick={() => setStep(1)}>← Anterior</button>
            <button
              className="btn-primary"
              onClick={() => setStep(3)}
              disabled={avaliadosCount < 3}
              style={{ opacity: avaliadosCount < 3 ? 0.5 : 1, cursor: avaliadosCount < 3 ? 'not-allowed' : 'pointer' }}
            >
              {avaliadosCount < 3
                ? `Avalie mais ${3 - avaliadosCount} livro${3 - avaliadosCount > 1 ? 's' : ''}`
                : 'Escolher modelo →'
              }
            </button>
          </div>
        </div>
      )}

      {/* ────────────── ETAPA 3: Escolha do modelo ────────────── */}
      {step === 3 && (
        <div className="animate-fade">
          <div className="glass-panel" style={{ padding: '28px 36px', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '6px' }}>Escolha o modelo de recomendação</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Cada abordagem usa uma estratégia diferente. Clique em "Gerar" para ver seus resultados.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            {MODELOS.map((modelo) => (
              <div
                key={modelo.id}
                className={`card ${modelo.highlighted ? 'card-highlighted' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <h3 style={{
                        fontFamily: 'var(--font-title)', fontSize: '1.05rem',
                        color: 'var(--text-primary)', margin: 0,
                      }}>
                        {modelo.title}
                      </h3>
                      <span style={{
                        backgroundColor: modelo.highlighted ? 'rgba(181, 98, 30, 0.1)' : 'var(--bg-base)',
                        color: modelo.color,
                        border: `1px solid ${modelo.color}33`,
                        padding: '2px 9px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                      }}>
                        {modelo.tech}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
                      {modelo.desc}
                    </p>

                    {modelo.id === 'hibrido' && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Ajuste do peso</span>
                          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-forest)', fontWeight: 700 }}>
                            {pesoConteudo}% conteúdo · {100 - pesoConteudo}% colaborativo
                          </span>
                        </div>
                        <input
                          type="range"
                          min="10" max="90"
                          value={pesoConteudo}
                          onChange={(e) => setPesoConteudo(Number(e.target.value))}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          <span>← Mais colaborativo</span>
                          <span>Mais conteúdo →</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    className="btn-primary"
                    onClick={(e) => { e.stopPropagation(); submitToRecomendacoes(modelo.id); }}
                    style={{
                      padding: '10px 22px',
                      fontSize: '0.9rem',
                      flexShrink: 0,
                      backgroundColor: modelo.highlighted ? 'var(--accent-warm)' : undefined,
                    }}
                    onMouseEnter={modelo.highlighted ? (e) => e.currentTarget.style.backgroundColor = '#C2410C' : undefined}
                    onMouseLeave={modelo.highlighted ? (e) => e.currentTarget.style.backgroundColor = 'var(--accent-warm)' : undefined}
                  >
                    Gerar →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-secondary" onClick={() => setStep(2)}>← Voltar para avaliações</button>
        </div>
      )}
    </div>
  );
};

export default AvaliacaoPage;
