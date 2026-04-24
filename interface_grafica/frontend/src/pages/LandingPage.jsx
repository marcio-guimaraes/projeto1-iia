import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 70px)',
      textAlign: 'center',
      padding: '0 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Particles Simulation */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(circle at center, rgba(212, 168, 83, 0.05) 0%, transparent 70%)',
        zIndex: -1
      }} />

      <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', maxWidth: '800px', lineHeight: 1.2 }}>
        Descubra Seu Próximo <br/>
        <span style={{ color: 'var(--color-text-primary)' }}>Livro Favorito</span>
      </h1>
      
      <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: '600px', marginBottom: '40px', lineHeight: 1.6 }}>
        Recomendações inteligentes de literatura nacional baseadas no que você já leu e nos gostos de leitores com perfil similar ao seu.
      </p>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '60px' }}>
        <Link to="/avaliacao" className="btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
          ✨ Começar Avaliação
        </Link>
        <Link to="/catalogo" className="btn-secondary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
          Ver Catálogo
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: '55 Livros', desc: 'Nacionais' },
          { label: '3 Modelos', desc: 'IA Híbrida' },
          { label: '100% Personalizado', desc: 'Para você' }
        ].map((stat, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px 30px', minWidth: '180px' }}>
            <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{stat.label}</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem' }}>{stat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
