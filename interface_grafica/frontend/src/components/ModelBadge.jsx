import React from 'react';

const ModelBadge = ({ modelName, active, onClick }) => {
  const getColors = () => {
    switch(modelName) {
      case 'Conteúdo': return { bg: '#58A6A6', text: '#0D1117' };
      case 'Colaborativo': return { bg: '#9b59b6', text: '#ffffff' };
      case 'Híbrido': return { bg: '#D4A853', text: '#0D1117' };
      default: return { bg: '#333', text: '#fff' };
    }
  };

  const { bg, text } = getColors();

  return (
    <button 
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: '20px',
        backgroundColor: active ? bg : 'transparent',
        color: active ? text : 'var(--color-text-muted)',
        border: `1px solid ${active ? bg : 'rgba(255,255,255,0.2)'}`,
        fontWeight: active ? 'bold' : 'normal',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.3s'
      }}
    >
      {modelName} {active && '✓'}
    </button>
  );
};

export default ModelBadge;
