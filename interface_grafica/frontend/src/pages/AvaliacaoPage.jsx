import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAvaliacao } from '../context/AvaliacaoContext';
import { fetchPopulares } from '../api/recomendador';
import BookCard from '../components/BookCard';

const AvaliacaoPage = () => {
  const [step, setStep] = useState(1);
  const { nome, setNome, generosFavoritos, setGenerosFavoritos, historico } = useAvaliacao();
  const [populares, setPopulares] = useState([]);
  const [pesoConteudo, setPesoConteudo] = useState(40);
  const navigate = useNavigate();

  const avaliadosCount = Object.keys(historico).length;

  useEffect(() => {
    if (step === 2 && populares.length === 0) {
      fetchPopulares(15).then(res => setPopulares(res.recomendacoes || []));
    }
  }, [step]);

  const toggleGenero = (g) => {
    if (generosFavoritos.includes(g)) {
      setGenerosFavoritos(generosFavoritos.filter(x => x !== g));
    } else {
      setGenerosFavoritos([...generosFavoritos, g]);
    }
  };

  const submitToRecomendacoes = (modelo) => {
    navigate(`/recomendacoes?modelo=${modelo}&peso=${pesoConteudo/100}`);
  };

  const progress = (step / 3) * 100;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Progresso</span>
          <span>Etapa {step} de 3</span>
        </div>
        <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--color-accent-gold)', transition: 'width 0.3s' }} />
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '40px' }}>
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ marginBottom: '20px' }}>Etapa 1: Seu Perfil</h2>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--color-text-muted)' }}>Nome (opcional)</label>
              <input 
                type="text" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como gosta de ser chamado?"
                style={{ width: '100%', maxWidth: '400px' }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '15px', color: 'var(--color-text-muted)' }}>O que você costuma ler?</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['Romance', 'Poesia', 'Ficção Científica', 'Conto', 'Teatro', 'Fábula', 'Fantasia'].map(g => (
                  <button 
                    key={g}
                    type="button"
                    onClick={() => toggleGenero(g)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      backgroundColor: generosFavoritos.includes(g) ? 'var(--color-accent-teal)' : 'transparent',
                      color: generosFavoritos.includes(g) ? '#000' : 'var(--color-text-primary)',
                      border: `1px solid ${generosFavoritos.includes(g) ? 'var(--color-accent-teal)' : 'var(--color-text-muted)'}`
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-primary" onClick={() => setStep(2)}>Próximo →</button>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ marginBottom: '10px' }}>Etapa 2: Avalie Livros</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '25px' }}>
              Sugerimos alguns livros conhecidos. Avalie pelo menos 3 para boas recomendações. <br/>
              <b>Avaliados: {avaliadosCount}</b>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px', marginBottom: '30px', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
              {populares.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-secondary" onClick={() => setStep(1)}>← Anterior</button>
              <button 
                className="btn-primary" 
                onClick={() => setStep(3)}
                disabled={avaliadosCount < 3}
                style={{ opacity: avaliadosCount < 3 ? 0.5 : 1 }}
              >
                {avaliadosCount < 3 ? `Avalie mais ${3 - avaliadosCount}` : 'Próximo →'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ marginBottom: '20px' }}>Etapa 3: Escolha o Modelo</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
              
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => submitToRecomendacoes('conteudo')}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>Baseado em Conteúdo (TF-IDF)</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Recomenda livros estritamente similares aos que você curtiu.</p>
              </div>

              <div className="card" style={{ cursor: 'pointer' }} onClick={() => submitToRecomendacoes('colaborativo')}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>Filtragem Colaborativa (kNN)</h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Recomenda baseado no que usuários com os mesmos gostos que você também gostaram.</p>
              </div>

              <div className="card" style={{ cursor: 'pointer', borderColor: 'var(--color-accent-gold)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--color-accent-gold)' }}>Híbrido (Recomendado)</h3>
                  <button className="btn-primary" style={{ padding: '4px 12px', fontSize: '0.8rem' }} onClick={() => submitToRecomendacoes('hibrido')}>Gerar ✨</button>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '15px' }}>Combina os dois modelos anteriores.</p>
                
                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    <span>Peso do Conteúdo</span>
                    <span>{pesoConteudo}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="90" 
                    value={pesoConteudo}
                    onChange={(e) => setPesoConteudo(e.target.value)}
                    style={{ width: '100%', marginTop: '5px', accentColor: 'var(--color-accent-gold)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    <span>Mais Colaborativo</span>
                    <span>Mais Conteúdo</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="btn-secondary" onClick={() => setStep(2)}>← Voltar para Avaliações</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvaliacaoPage;
