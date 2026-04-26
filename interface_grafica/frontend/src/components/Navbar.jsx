import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAvaliacao } from '../context/AvaliacaoContext';

const NAV_LINKS = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/sobre', label: 'Sobre' },
];

const Navbar = () => {
  const { historico } = useAvaliacao();
  const avaliacoesCount = Object.keys(historico).length;
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 40px',
      height: '64px',
      backgroundColor: 'var(--bg-dark)',
      boxShadow: '0 1px 0 rgba(255,255,255,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      {/* Logo */}
      <Link to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
      }}>
        {/* Ícone livro SVG simples */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8FC9A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          <line x1="10" y1="7" x2="16" y2="7"/>
          <line x1="10" y1="11" x2="16" y2="11"/>
        </svg>
        <span style={{
          fontFamily: 'var(--font-title)',
          fontWeight: '700',
          fontSize: '1.2rem',
          color: 'var(--text-inverse)',
          letterSpacing: '0.02em',
        }}>
          Leitor
        </span>
      </Link>

      {/* Links de navegação */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {NAV_LINKS.map(({ to, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              style={{
                color: isActive ? 'var(--accent-sage)' : 'rgba(245, 240, 232, 0.7)',
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.92rem',
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'rgba(143, 201, 169, 0.12)' : 'transparent',
                transition: 'all var(--transition)',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) e.target.style.color = 'var(--text-inverse)';
                if (!isActive) e.target.style.backgroundColor = 'rgba(255,255,255,0.07)';
              }}
              onMouseLeave={e => {
                if (!isActive) e.target.style.color = 'rgba(245, 240, 232, 0.7)';
                if (!isActive) e.target.style.backgroundColor = 'transparent';
              }}
            >
              {label}
            </Link>
          );
        })}

        {/* CTA */}
        <Link
          to="/avaliacao"
          style={{
            marginLeft: '8px',
            backgroundColor: 'var(--accent-forest-light)',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.88rem',
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background-color var(--transition), transform var(--transition)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#3D9970';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'var(--accent-forest-light)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          {avaliacoesCount > 0 ? (
            <>
              Continuar
              <span style={{
                backgroundColor: 'rgba(255,255,255,0.25)',
                borderRadius: 'var(--radius-pill)',
                padding: '1px 7px',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}>
                {avaliacoesCount}
              </span>
            </>
          ) : (
            'Começar →'
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
