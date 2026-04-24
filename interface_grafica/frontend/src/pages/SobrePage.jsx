import React, { useState } from 'react';

const SobrePage = () => {
  const [openModel, setOpenModel] = useState('hibrido');

  const models = [
    {
      id: 'conteudo',
      title: 'Baseado em Conteúdo (TF-IDF)',
      description: 'Representa cada livro como um vetor de características e recomenda itens similares aos que o usuário já apreciou, usando Similaridade de Cosseno.'
    },
    {
      id: 'colaborativo',
      title: 'Filtragem Colaborativa User-Based (kNN)',
      description: 'Encontra usuários similares ao novo usuário via matriz de utilidade (após centralização). Prediz notas como média ponderada das notas dos vizinhos mais próximos.'
    },
    {
      id: 'hibrido',
      title: 'Híbrido (Conteúdo + Colaborativo)',
      description: 'Combina as predições dos dois modelos acima usando médias ponderadas normalizadas. Maximiza as vantagens e dilui as fraquezas de cada abordagem pura.'
    }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Sobre o Projeto</h2>
      
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--color-text-primary)' }}>
          Este é um sistema de recomendação de livros concebido como <strong>Projeto 1</strong> da disciplina de 
          Introdução à Inteligência Artificial (UnB). 
        </p>
        <p style={{ marginTop: '15px', color: 'var(--color-text-muted)' }}>
          Ele implementa três modelos de recomendação em cima de um catálogo de 55 livros nacionais clássicos e contemporâneos.
        </p>
      </div>

      <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'var(--color-accent-teal)' }}>Como os Modelos Funcionam</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
        {models.map(m => (
          <div 
            key={m.id} 
            className="card"
            style={{ 
              cursor: 'pointer', 
              borderColor: openModel === m.id ? 'var(--color-accent-gold)' : 'rgba(255,255,255,0.05)'
            }}
            onClick={() => setOpenModel(m.id === openModel ? null : m.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: openModel === m.id ? 'var(--color-accent-gold)' : 'var(--color-text-primary)' }}>
                {m.title}
              </h4>
              <span style={{ fontSize: '1.2rem' }}>{openModel === m.id ? '−' : '+'}</span>
            </div>
            
            {openModel === m.id && (
              <p style={{ marginTop: '15px', color: 'var(--color-text-muted)', lineHeight: 1.5, animation: 'fadeIn 0.3s' }}>
                {m.description}
              </p>
            )}
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'var(--color-accent-teal)' }}>Referências</h3>
      <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, paddingLeft: '20px' }}>
        <li>Salton, G., & McGill, M. J. (1983). Introduction to Modern Information Retrieval.</li>
        <li>Resnick, P. et al. (1994). GroupLens: Architecture for Collaborative Filtering.</li>
        <li>Herlocker, J. et al. (2004). Evaluating Collaborative Filtering. ACM TOIS.</li>
        <li>Bishop, C. M. (2006). Pattern Recognition and Machine Learning.</li>
      </ul>
    </div>
  );
};

export default SobrePage;
