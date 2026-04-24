import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AvaliacaoProvider } from './context/AvaliacaoContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import CatalogoPage from './pages/CatalogoPage';
import AvaliacaoPage from './pages/AvaliacaoPage';
import RecomendacoesPage from './pages/RecomendacoesPage';
import SobrePage from './pages/SobrePage';

function App() {
  return (
    <AvaliacaoProvider>
      <Router>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 70px)' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/catalogo" element={<CatalogoPage />} />
            <Route path="/avaliacao" element={<AvaliacaoPage />} />
            <Route path="/recomendacoes" element={<RecomendacoesPage />} />
            <Route path="/sobre" element={<SobrePage />} />
          </Routes>
        </main>
      </Router>
    </AvaliacaoProvider>
  );
}

export default App;
