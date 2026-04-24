import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAvaliacao } from '../context/AvaliacaoContext';
import { recomendarHibrido, recomendarConteudo, recomendarColaborativo, avaliarModelos } from '../api/recomendador';
import RecommendCard from '../components/RecommendCard';
import ModelBadge from '../components/ModelBadge';

const RecomendacoesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { historico, nome, getLivrosCurtidos } = useAvaliacao();
  
  const initialModel = searchParams.get('modelo') || 'hibrido';
  const pesoStr = searchParams.get('peso');
  const initialPeso = pesoStr ? parseFloat(pesoStr) : 0.4;

  const [activeModel, setActiveModel] = useState(initialModel);
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metricas, setMetricas] = useState(null);
  const [showMetricas, setShowMetricas] = useState(false);

  const fetchRecs = async (model) => {
    setLoading(true);
    setRecomendacoes([]);
    try {
      const curtidos = getLivrosCurtidos(4); // Nota >= 4
      let res;
      if (model === 'hibrido') {
        res = await recomendarHibrido(curtidos, historico, 5, initialPeso);
      } else if (model === 'conteudo') {
        res = await recomendarConteudo(curtidos, 5);
      } else if (model === 'colaborativo') {
        res = await recomendarColaborativo(historico, 5);
      }
      setRecomendacoes(res?.recomendacoes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs(activeModel);
  }, [activeModel]);

  const toggleMetricas = async () => {
    if (!metricas && !showMetricas) {
      const res = await avaliarModelos();
      setMetricas(res.metricas);
    }
    setShowMetricas(!showMetricas);
  };

  const getTooltip = (model) => {
    if(model === 'conteudo') return "Livros com perfil estritamente similiar ao que você curtiu.";
    if(model === 'colaborativo') return "Pessoas com as mesmas notas que você também gostam disso.";
    return "Ponderação entre conteúdo literário e avaliações de outros usuários.";
  }

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '5px' }}>
        Suas Recomendações {nome ? `para ${nome}` : ''}
      </h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '30px' }}>
        Você avaliou {Object.keys(historico).length} livros. Aqui está o que separamos para você.
      </p>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <ModelBadge modelName="Híbrido" active={activeModel === 'hibrido'} onClick={() => setActiveModel('hibrido')} />
        <ModelBadge modelName="Conteúdo" active={activeModel === 'conteudo'} onClick={() => setActiveModel('conteudo')} />
        <ModelBadge modelName="Colaborativo" active={activeModel === 'colaborativo'} onClick={() => setActiveModel('colaborativo')} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Gerando recomendações mágicas...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', animation: 'fadeIn 0.5s' }}>
          {recomendacoes.map((rec, i) => (
            <RecommendCard key={rec.id} book={rec} index={i} tooltipText={getTooltip(activeModel)} />
          ))}
          {recomendacoes.length === 0 && (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
              Não conseguimos te recomendar nada com este modelo. Avalie mais livros!
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
        <button className="btn-secondary" onClick={() => navigate('/avaliacao')}>🔄 Recomendar Novamente</button>
        <button className="btn-secondary" style={{ borderColor: 'var(--color-accent-teal)', color: 'var(--color-accent-teal)'}} onClick={toggleMetricas}>
          📊 {showMetricas ? 'Ocultar Métricas' : 'Ver Avaliação dos Modelos (LOO)'}
        </button>
      </div>

      {showMetricas && metricas && (
        <div className="glass-panel" style={{ marginTop: '20px', padding: '30px', animation: 'fadeIn 0.3s' }}>
          <h3 style={{ marginBottom: '20px' }}>Métricas Leave-One-Out (Top-5)</h3>
          
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h4 style={{ color: '#9b59b6', marginBottom: '10px' }}>Filtragem Colaborativa</h4>
              <p>Precision@5: <strong>{metricas.colaborativo['Precision@5']}</strong></p>
              <p>Recall@5: <strong>{metricas.colaborativo['Recall@5']}</strong></p>
              <p>RMSE: <strong>{metricas.colaborativo['RMSE_nota']}</strong></p>
            </div>
            
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h4 style={{ color: '#58A6A6', marginBottom: '10px' }}>Baseado em Conteúdo</h4>
              <p>Precision@5: <strong>{metricas.conteudo['Precision@5']}</strong></p>
              <p>Recall@5: <strong>{metricas.conteudo['Recall@5']}</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecomendacoesPage;
