import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAvaliacao } from '../context/AvaliacaoContext';
import { recomendarHibrido, recomendarConteudo, recomendarColaborativo, avaliarModelos } from '../api/recomendador';
import RecommendCard from '../components/RecommendCard';

const MODEL_INFO = {
  hibrido:      { label: 'Híbrido', color: 'var(--accent-warm)', tech: 'Conteúdo + kNN' },
  conteudo:     { label: 'Conteúdo', color: 'var(--accent-forest)', tech: 'TF-IDF' },
  colaborativo: { label: 'Colaborativo', color: '#7C3AED', tech: 'kNN' },
};

// Skeleton de card de recomendação
const RecSkeleton = () => (
  <div className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
    <div className="skeleton" style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div className="skeleton" style={{ height: '18px', width: '65%', borderRadius: 'var(--radius-sm)' }} />
      <div className="skeleton" style={{ height: '13px', width: '45%', borderRadius: 'var(--radius-sm)' }} />
      <div className="skeleton" style={{ height: '10px', width: '30%', borderRadius: 'var(--radius-sm)' }} />
    </div>
    <div className="skeleton" style={{ width: '72px', height: '32px', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
  </div>
);

const RecomendacoesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { historico, nome, getLivrosCurtidos } = useAvaliacao();

  const initialModel = searchParams.get('modelo') || 'hibrido';
  const initialPeso = parseFloat(searchParams.get('peso') || '0.4');

  const [activeModel, setActiveModel] = useState(initialModel);
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState(null);
  const [showMetricas, setShowMetricas] = useState(false);
  const [loadingMetricas, setLoadingMetricas] = useState(false);

  const fetchRecs = async (model) => {
    setLoading(true);
    setRecomendacoes([]);
    try {
      const curtidos = getLivrosCurtidos(4);
      let res;
      if (model === 'hibrido') {
        res = await recomendarHibrido(curtidos, historico, 5, initialPeso);
      } else if (model === 'conteudo') {
        res = await recomendarConteudo(curtidos, 5);
      } else {
        res = await recomendarColaborativo(historico, 5);
      }
      setRecomendacoes(res?.recomendacoes || []);
    } catch (err) {
      console.error('Erro ao buscar recomendações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs(activeModel);
  }, [activeModel]);

  const toggleMetricas = async () => {
    if (!metricas && !showMetricas) {
      setLoadingMetricas(true);
      try {
        const res = await avaliarModelos();
        setMetricas(res.metricas);
      } catch (err) {
        console.error('Erro ao avaliar modelos:', err);
      } finally {
        setLoadingMetricas(false);
      }
    }
    setShowMetricas((v) => !v);
  };

  const getTooltip = (model) => {
    if (model === 'conteudo') return 'Este livro foi selecionado porque tem características muito similares (gênero, estilo, período) aos livros que você avaliou com nota alta.';
    if (model === 'colaborativo') return 'Leitores com avaliações parecidas com as suas também gostaram muito deste livro.';
    return 'Esta recomendação combina similaridade de conteúdo e o gosto de leitores similares ao seu, ponderados pelo peso que você escolheu.';
  };

  const activeInfo = MODEL_INFO[activeModel];
  const histCount = Object.keys(historico).length;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 24px' }}>

      {/* Cabeçalho */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-forest)',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}>
          {histCount} livro{histCount !== 1 ? 's' : ''} avaliado{histCount !== 1 ? 's'  : ''}
        </p>
        <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '4px' }}>
          {nome ? `Recomendações para ${nome}` : 'Suas Recomendações'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Separamos os 5 livros mais compatíveis com o seu perfil.
        </p>
      </div>

      {/* Seletores de modelo */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '28px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '6px',
        width: 'fit-content',
      }}>
        {Object.entries(MODEL_INFO).map(([key, info]) => {
          const isActive = activeModel === key;
          return (
            <button
              key={key}
              id={`model-btn-${key}`}
              onClick={() => setActiveModel(key)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--bg-dark)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {info.label}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                opacity: isActive ? 0.7 : 0.4,
              }}>
                {info.tech}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lista de recomendações */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {Array.from({ length: 5 }).map((_, i) => <RecSkeleton key={i} />)}
        </div>
      ) : recomendacoes.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {recomendacoes.map((rec, i) => (
            <RecommendCard key={rec.id} book={rec} index={i} tooltipText={getTooltip(activeModel)} />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Sem recomendações com este modelo
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Tente avaliar mais livros ou escolher outro modelo.
          </p>
          <button
            className="btn-secondary"
            onClick={() => navigate('/avaliacao')}
            style={{ marginTop: '20px' }}
          >
            Voltar e avaliar mais
          </button>
        </div>
      )}

      {/* Rodapé de ações */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '36px',
        paddingTop: '24px',
        borderTop: '1px solid var(--border-light)',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <button
          className="btn-secondary"
          onClick={() => navigate('/avaliacao')}
        >
          Refazer avaliação
        </button>

        <button
          className="btn-outline-warm"
          onClick={toggleMetricas}
          disabled={loadingMetricas}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          id="btn-metricas"
        >
          {loadingMetricas ? (
            <>
              <span className="spinner" style={{ width: '14px', height: '14px' }} />
              Calculando...
            </>
          ) : (
            showMetricas ? 'Ocultar métricas' : 'Ver avaliação dos modelos (LOO)'
          )}
        </button>
      </div>

      {/* Painel de métricas */}
      {showMetricas && metricas && (
        <div className="glass-panel animate-fade" style={{ marginTop: '20px', padding: '32px' }}>
          <h3 style={{
            fontFamily: 'var(--font-title)',
            fontSize: '1.2rem',
            marginBottom: '20px',
            color: 'var(--text-primary)',
          }}>
            Métricas de avaliação — Leave-One-Out (Top‑5)
          </h3>

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {/* Colaborativo */}
            <div style={{
              flex: 1,
              minWidth: '220px',
              backgroundColor: 'var(--bg-base)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
            }}>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: '#7C3AED',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                Colaborativo (kNN)
              </div>
              {[
                ['Precision@5', metricas.colaborativo?.['Precision@5']],
                ['Recall@5', metricas.colaborativo?.['Recall@5']],
                ['RMSE', metricas.colaborativo?.['RMSE_nota']],
              ].map(([label, val]) => val != null && (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{val}</strong>
                </div>
              ))}
            </div>

            {/* Conteúdo */}
            <div style={{
              flex: 1,
              minWidth: '220px',
              backgroundColor: 'var(--bg-base)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
            }}>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: 'var(--accent-forest)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                Baseado em Conteúdo (TF-IDF)
              </div>
              {[
                ['Precision@5', metricas.conteudo?.['Precision@5']],
                ['Recall@5', metricas.conteudo?.['Recall@5']],
              ].map(([label, val]) => val != null && (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{val}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecomendacoesPage;
