import React, { useEffect, useState } from 'react';
import { fetchLivros, fetchFiltros } from '../api/recomendador';
import BookCard from '../components/BookCard';

const CatalogoPage = () => {
  const [livros, setLivros] = useState([]);
  const [filtros, setFiltros] = useState({ generos: [], periodos: [], estilos: [] });
  const [loading, setLoading] = useState(true);
  
  // States para busca e seleção
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenero, setSelectedGenero] = useState("");
  const [selectedEstilo, setSelectedEstilo] = useState("");
  const [selectedPeriodo, setSelectedPeriodo] = useState("");

  useEffect(() => {
    Promise.all([fetchLivros(), fetchFiltros()])
      .then(([livrosRes, filtrosRes]) => {
        setLivros(livrosRes.livros || []);
        setFiltros({
          generos: filtrosRes.generos || [],
          periodos: filtrosRes.periodos || [],
          estilos: filtrosRes.estilos || []
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar dados", err);
        setLoading(false);
      });
  }, []);

  const filteredLivros = livros.filter(l => {
    const matchTerm = (l.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       l.autor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchGenero = selectedGenero ? l.genero === selectedGenero : true;
    const matchEstilo = selectedEstilo ? l.estilo === selectedEstilo : true;
    const matchPeriodo = selectedPeriodo ? l.periodo === selectedPeriodo : true;
    
    return matchTerm && matchGenero && matchEstilo && matchPeriodo;
  });

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando catálogo...</div>;

  return (
    <div style={{ padding: '30px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <h2 style={{ fontSize: '2rem', margin: 0 }}>Catálogo</h2>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="🔍 Buscar título/autor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: '250px' }}
          />
          
          <select value={selectedGenero} onChange={e => setSelectedGenero(e.target.value)}>
            <option value="">Todos os Gêneros</option>
            {filtros.generos.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          
          <select value={selectedEstilo} onChange={e => setSelectedEstilo(e.target.value)}>
            <option value="">Todos os Estilos</option>
            {filtros.estilos.map(e_ => <option key={e_} value={e_}>{e_}</option>)}
          </select>

          <select value={selectedPeriodo} onChange={e => setSelectedPeriodo(e.target.value)}>
            <option value="">Todos os Períodos</option>
            {filtros.periodos.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredLivros.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      
      {filteredLivros.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--color-text-muted)' }}>
          Nenhum livro encontrado com os filtros atuais.
        </div>
      )}
    </div>
  );
};

export default CatalogoPage;
