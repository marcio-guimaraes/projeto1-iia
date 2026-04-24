import React from 'react';
import { Link } from 'react-router-dom';
import { useAvaliacao } from '../context/AvaliacaoContext';

const Navbar = () => {
  const { historico } = useAvaliacao();
  const avaliacoesCount = Object.keys(historico).length;

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 40px',
      backgroundColor: 'var(--color-bg-card)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.5rem' }}>🔖</span>
        <span style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontWeight: '700', 
          fontSize: '1.2rem',
          color: 'var(--color-accent-gold)'
        }}>
          LEITOR
        </span>
      </Link>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/sobre">Sobre</Link>
        <Link to="/avaliacao" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          {avaliacoesCount > 0 ? `Continuar (${avaliacoesCount})` : 'Avaliar'}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
