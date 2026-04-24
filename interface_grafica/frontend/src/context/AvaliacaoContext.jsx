import { createContext, useState, useContext } from 'react';

const AvaliacaoContext = createContext();

export function AvaliacaoProvider({ children }) {
  const [historico, setHistorico] = useState({});
  const [nome, setNome] = useState("");
  const [generosFavoritos, setGenerosFavoritos] = useState([]);

  const avaliarLivro = (id, nota) => {
    setHistorico(prev => ({ ...prev, [id]: nota }));
  };

  const getLivrosCurtidos = (limiar = 4) => {
    return Object.keys(historico)
      .filter(id => historico[id] >= limiar)
      .map(id => parseInt(id, 10));
  };

  return (
    <AvaliacaoContext.Provider value={{
      historico,
      setHistorico,
      avaliarLivro,
      nome,
      setNome,
      generosFavoritos,
      setGenerosFavoritos,
      getLivrosCurtidos
    }}>
      {children}
    </AvaliacaoContext.Provider>
  );
}

export function useAvaliacao() {
  return useContext(AvaliacaoContext);
}
