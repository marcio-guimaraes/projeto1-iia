import React, { useEffect, useState } from 'react';
import { fetchLivros, fetchFiltros } from '../api/recomendador';
import BookCard from '../components/BookCard';

// Skeleton de carregamento
const BookSkeleton = () => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div className="skeleton" style={{ height: '20px', width: '75%', borderRadius: 'var(--radius-sm)' }} />
    <div className="skeleton" style={{ height: '14px', width: '50%', borderRadius: 'var(--radius-sm)' }} />
    <div style={{ display: 'flex', gap: '6px' }}>
      <div className="skeleton" style={{ height: '20px', width: '70px', borderRadius: 'var(--radius-pill)' }} />
      <div className="skeleton" style={{ height: '20px', width: '80px', borderRadius: 'var(--radius-pill)' }} />
    </div>
    <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between' }}>
      <div className="skeleton" style={{ height: '14px', width: '60px', borderRadius: 'var(--radius-sm)' }} />
      <div className="skeleton" style={{ height: '18px', width: '90px', borderRadius: 'var(--radius-sm)' }} />
    </div>
  </div>
);

const CatalogoPage = () => {
  const [livros, setLivros] = useState([]);
  const [filtros, setFiltros] = useState({ generos: [], periodos: [], estilos: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenero, setSelectedGenero] = useState('');
  const [selectedEstilo, setSelectedEstilo] = useState('');
  const [selectedPeriodo, setSelectedPeriodo] = useState('');

  useEffect(() => {
    Promise.all([fetchLivros(), fetchFiltros()])
      .then(([livrosRes, filtrosRes]) => {
        setLivros(livrosRes.livros || []);
        setFiltros({
          generos: filtrosRes.generos || [],
          periodos: filtrosRes.periodos || [],
          estilos: filtrosRes.estilos || [],
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hasFilters = searchTerm || selectedGenero || selectedEstilo || selectedPeriodo;

  const filteredLivros = livros.filter((l) => {
    const term = searchTerm.toLowerCase();
    const matchTerm = !term || l.titulo.toLowerCase().includes(term) || l.autor.toLowerCase().includes(term);
    const matchGenero = !selectedGenero || l.genero === selectedGenero;
    const matchEstilo = !selectedEstilo || l.estilo === selectedEstilo;
    const matchPeriodo = !selectedPeriodo || l.periodo === selectedPeriodo;
    return matchTerm && matchGenero && matchEstilo && matchPeriodo;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenero('');
    setSelectedEstilo('');
    setSelectedPeriodo('');
  };

  return (
    <div style={{ padding: '36px 40px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Cabeçalho */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '6px' }}>Catálogo</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          {loading
            ? 'Carregando livros...'
            : `${filteredLivros.length} de ${livros.length} livros`
          }
        </p>
      </div>

      {/* Área de filtros */}
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <input
          type="search"
          placeholder="Buscar por título ou autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ minWidth: '220px', flex: '1', maxWidth: '320px' }}
          id="catalogo-search"
        />

        <select
          value={selectedGenero}
          onChange={(e) => setSelectedGenero(e.target.value)}
          style={{ minWidth: '150px' }}
          id="catalogo-genero"
        >
          <option value="">Todos os gêneros</option>
          {filtros.generos.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>

        <select
          value={selectedEstilo}
          onChange={(e) => setSelectedEstilo(e.target.value)}
          style={{ minWidth: '150px' }}
          id="catalogo-estilo"
        >
          <option value="">Todos os estilos</option>
          {filtros.estilos.map((e_) => <option key={e_} value={e_}>{e_}</option>)}
        </select>

        <select
          value={selectedPeriodo}
          onChange={(e) => setSelectedPeriodo(e.target.value)}
          style={{ minWidth: '150px' }}
          id="catalogo-periodo"
        >
          <option value="">Todos os períodos</option>
          {filtros.periodos.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        {hasFilters && (
          <button
            className="btn-ghost"
            onClick={clearFilters}
            style={{
              color: 'var(--accent-warm)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              fontWeight: 600,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
            }}
          >
            Limpar filtros ✕
          </button>
        )}
      </div>

      {/* Grid de livros */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '18px',
        }}>
          {Array.from({ length: 9 }).map((_, i) => <BookSkeleton key={i} />)}
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '18px',
          }}
          className="animate-fade"
          >
            {filteredLivros.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {filteredLivros.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: 'var(--text-muted)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📚</div>
              <p style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                Nenhum livro encontrado
              </p>
              <p style={{ fontSize: '0.875rem', marginTop: '6px' }}>
                Tente ajustar os filtros ou limpar a busca.
              </p>
              <button
                className="btn-secondary"
                onClick={clearFilters}
                style={{ marginTop: '20px' }}
              >
                Limpar filtros
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CatalogoPage;
