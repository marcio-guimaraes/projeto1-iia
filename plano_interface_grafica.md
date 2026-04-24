# Plano de Implementação — Interface Gráfica Web
## Sistema de Recomendação de Livros Nacionais
### UnB — Introdução à Inteligência Artificial — 2026/1

---

> [!IMPORTANT]
> Este documento descreve a interface gráfica a ser implementada **depois** que toda a lógica de backend (já concluída) estiver integrada. O backend está em `/home/marcin/UnB/teste/`.

---

## Stack Tecnológica

| Camada | Escolha | Justificativa |
|---|---|---|
| Frontend | **React + Vite** | SPA moderna, ideal para fluxo multi-etapa |
| Estilização | **Vanilla CSS** (tema escuro) | Glassmorphism, animações, sem dependências extras |
| Backend API | **FastAPI (Python)** | Integra diretamente com o `Recomendador`, async nativo |
| Comunicação | **REST JSON** | Simples, bem suportado nos dois lados |
| Fontes | **Inter + Playfair Display** (Google Fonts) | Elegância adequada ao tema literário |

---

## Paleta de Cores e Design System

```css
/* Tokens de Design */
--color-bg-deep:     #0D1117;           /* fundo escuro profundo */
--color-bg-card:     #161B22;           /* cards principais */
--color-bg-glass:    rgba(22,27,34,0.7);/* glassmorphism */
--color-accent-gold: #D4A853;           /* ouro literário — destaque */
--color-accent-teal: #58A6A6;           /* ciano suave — secundário */
--color-text-primary:#E6EDF3;
--color-text-muted:  #7D8590;
--color-star-filled: #F0A500;
--color-star-empty:  #30363D;
--border-radius:     12px;
--blur:              blur(12px);
```

**Estilo visual**: Glassmorphism escuro com toques dourados — remete à estética de capas de livros clássicos.

---

## Arquitetura de Componentes (React)

```
src/
├── App.jsx                   # Roteador principal (React Router)
├── index.css                 # Design system global
├── api/
│   └── recomendador.js       # Funções fetch para a API FastAPI
├── components/
│   ├── StarRating.jsx         # Widget de avaliação com estrelas clicáveis
│   ├── BookCard.jsx           # Card de livro (catálogo)
│   ├── RecommendCard.jsx      # Card de recomendação (resultado)
│   ├── Navbar.jsx             # Barra de navegação com logo e menu
│   ├── FilterBar.jsx          # Filtros de gênero/estilo/período
│   ├── ModelBadge.jsx         # Badge colorido: Conteúdo / Colaborativo / Híbrido
│   └── LoadingSpinner.jsx     # Spinner animado
└── pages/
    ├── LandingPage.jsx        # Página inicial (hero + CTA)
    ├── CatalogoPage.jsx       # Catálogo completo com busca e filtros
    ├── AvaliacaoPage.jsx      # Wizard de avaliação (3 etapas)
    ├── RecomendacoesPage.jsx  # Resultados dos 3 modelos
    └── SobrePage.jsx          # Explicação do projeto/metodologia
```

---

## Páginas em Detalhe

### 1. LandingPage — Página Inicial

Layout: Hero full-screen, centralizado.

```
┌──────────────────────────────────────────────────────────────┐
│  LEITOR                              [Catálogo] [Sobre] [▶]  │ ← Navbar
│──────────────────────────────────────────────────────────────│
│                                                              │
│         Descubra Seu Próximo Livro Favorito                  │
│    Recomendações inteligentes de literatura nacional         │
│    baseadas no que você leu e nos gostos de leitores         │
│    com perfil similar ao seu.                                │
│                                                              │
│         [  Começar Avaliação  ]  [ Ver Catálogo ]            │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ 55 Livros│  │ 3 Modelos│  │100 Users │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└──────────────────────────────────────────────────────────────┘
```

**Animações**:
- Fade-in sequencial dos elementos via CSS `@keyframes`
- Partículas de livros flutuando no fundo (canvas API)
- Hover nos botões: `scale(1.03)` + `box-shadow` dourado

---

### 2. CatalogoPage — Catálogo de Livros

Layout: Grid responsivo de cards + filtros no topo.

```
┌─────────────────────────────────────────────────────────────┐
│  [Buscar título/autor]  [Gênero ▼]  [Estilo ▼]  [Ordenar ▼]│
│─────────────────────────────────────────────────────────────│
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Dom      │  │ Vidas    │  │  Grande  │                   │
│  │ Casmurro │  │ Secas    │  │  Sertão  │                   │
│  │ ⭐⭐⭐⭐⭐ │  │ ⭐⭐⭐⭐  │  │ ⭐⭐⭐⭐⭐ │                   │
│  │ Romance  │  │Modernismo│  │ Romance  │                   │
│  │ [Avaliar]│  │ [Avaliar]│  │ [Avaliar]│                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
│      3 colunas (desktop) / 2 (tablet) / 1 (mobile)         │
└─────────────────────────────────────────────────────────────┘
```

**Funcionalidades**:
- Busca em tempo real, client-side
- Filtros combinados: gênero AND período AND estilo
- Ordenação: A-Z, Melhor Avaliado, Mais Popular
- Estrelas clicáveis em cada card salvam nota no estado global
- Badge colorido por gênero (Romance → ouro, Poesia → lilás)

---

### 3. AvaliacaoPage — Wizard de Avaliação (3 Etapas)

```
Progresso: ████████████░░░░░░░░  Etapa 2 de 3

Etapa 1 — Seu Perfil
  Nome (opcional): [_______________________]
  Gêneros favoritos:
  [x] Romance  [ ] Poesia  [ ] Ficção Científica  [ ] Conto

Etapa 2 — Avalie Livros
  ┌──────────────────────────────────────────────────────┐
  │  Dom Casmurro  — Machado de Assis                   │
  │  [ ☆ ][ ☆ ][ ★ ][ ★ ][ ★ ]   Nota: 3 / 5         │
  └──────────────────────────────────────────────────────┘
  [ Anterior ]  [ Próximo ]   (10 livros por página)

Etapa 3 — Escolha o Modelo
  ( ) Baseado em Conteúdo (TF-IDF)
  ( ) Filtragem Colaborativa (kNN)
  (*) Híbrido — Recomendado
  Peso conteúdo: [━━━●──────────] 40%
  [ Ver Minhas Recomendações ]
```

**Lógica**:
- Estado global com `useState` + `useContext`
- Etapa 2 sugere os livros mais populares da matriz
- Slider ajusta `peso_conteudo` do modelo híbrido (default: 0.4)
- Mínimo 3 avaliações para liberar o botão final

---

### 4. RecomendacoesPage — Resultados

```
┌─────────────────────────────────────────────────────────────┐
│  Recomendações para "Maria"                                 │
│  [Conteúdo]  [Colaborativo]  [Híbrido ← ativo]             │
│─────────────────────────────────────────────────────────────│
│  ┌──────────────────────────────────────────────────────┐   │
│  │ #1  Gabriela, Cravo e Canela — Jorge Amado          │   │
│  │      Romance · Modernismo · Século XX               │   │
│  │      Score: ████████████░░  0.910                   │   │
│  │      [Por que recomendado?]                         │   │
│  │      [Salvar]  [Ver Detalhes]                       │   │
│  └──────────────────────────────────────────────────────┘   │
│  [ Recomendar Novamente ]  [ Ver Métricas dos Modelos ]      │
└─────────────────────────────────────────────────────────────┘
```

**Funcionalidades**:
- Barra de score animada (CSS `@keyframes` de 0 → valor final)
- Tooltip "Por que recomendado?" explica a lógica do modelo
- Aba "Métricas" exibe Precision@5, Recall@5, RMSE, MAE
- Botão "Recomendar Novamente" retorna à etapa 2

---

### 5. SobrePage — Sobre o Projeto

Página estática informativa:
- Explicação dos 3 modelos em acordeão expansível
- Referências bibliográficas completas
- Nomes e matrículas dos integrantes
- Links para o notebook Jupyter e repositório

---

## API FastAPI — Especificação Completa

### Arquivo: `interface_grafica/backend/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import sys, os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from recomendador import Recomendador

app = FastAPI(title="Book Recommender API", version="1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])
rec = Recomendador()

class HistoricoRequest(BaseModel):
    historico: Dict[str, int]
    top_n: int = 5

class HibridoRequest(BaseModel):
    curtidos: List[int]
    historico: Dict[str, int]
    top_n: int = 5
    peso: float = 0.4

@app.get("/livros")
def listar_livros(): ...

@app.post("/recomendar/conteudo")
def recomendar_conteudo(req: HistoricoRequest): ...

@app.post("/recomendar/colaborativo")
def recomendar_colaborativo(req: HistoricoRequest): ...

@app.post("/recomendar/hibrido")
def recomendar_hibrido(req: HibridoRequest): ...

@app.get("/avaliar")
def avaliar(top_k: int = 5, n_usuarios: int = 30): ...
```

### Endpoints

| Método | Rota | Parâmetros | Resposta |
|---|---|---|---|
| `GET` | `/livros` | — | Lista de todos os livros |
| `GET` | `/livros/{id}` | — | Detalhes de um livro |
| `GET` | `/livros/filtrar` | `?genero=&estilo=&periodo=` | Livros filtrados |
| `GET` | `/populares` | `?top_n=10` | Mais bem avaliados |
| `POST` | `/recomendar/conteudo` | `{"curtidos":[1,2], "top_n":5}` | Recomendações |
| `POST` | `/recomendar/colaborativo` | `{"historico":{"1":5}, "top_n":5}` | Recomendações |
| `POST` | `/recomendar/hibrido` | `{"curtidos":[], "historico":{}, "top_n":5, "peso":0.4}` | Recomendações |
| `GET` | `/avaliar` | `?top_k=5&n_usuarios=30` | Métricas LOO |

### Formato de Resposta (exemplo)

```json
{
  "status": "ok",
  "modelo": "hibrido",
  "top_n": 5,
  "recomendacoes": [
    {
      "id": 19,
      "titulo": "Gabriela Cravo e Canela",
      "autor": "Jorge Amado",
      "genero": "Romance",
      "periodo": "Seculo XX",
      "estilo": "Modernismo",
      "score": 0.910,
      "rank": 1
    }
  ]
}
```

---

## Estrutura de Pastas Final

```
/home/marcin/UnB/teste/
├── dados/
│   ├── livros.py                          [PRONTO] Catálogo (55 livros)
│   ├── gerar_matriz.py                    [PRONTO] Gerador da matriz
│   └── matriz_utilidade.csv               [PRONTO] 100 x 55 usuários
├── recomendador.py                        [PRONTO] TF-IDF + kNN + Híbrido
├── avaliacao.py                           [PRONTO] RMSE, MAE, P@K, R@K
├── cli.py                                 [PRONTO] Interface linha de comando
├── projeto_recomendacao.ipynb             [PRONTO] Notebook entrega
├── figs/                                  [PRONTO] Gráficos do notebook
├── plano_interface_grafica.md             [PRONTO] Este arquivo
└── interface_grafica/                     [A IMPLEMENTAR]
    ├── backend/
    │   ├── main.py                         FastAPI
    │   └── requirements.txt
    └── frontend/
        ├── src/
        │   ├── App.jsx
        │   ├── index.css
        │   ├── api/
        │   │   └── recomendador.js
        │   ├── components/
        │   │   ├── StarRating.jsx
        │   │   ├── BookCard.jsx
        │   │   ├── RecommendCard.jsx
        │   │   ├── Navbar.jsx
        │   │   ├── FilterBar.jsx
        │   │   ├── ModelBadge.jsx
        │   │   └── LoadingSpinner.jsx
        │   └── pages/
        │       ├── LandingPage.jsx
        │       ├── CatalogoPage.jsx
        │       ├── AvaliacaoPage.jsx
        │       ├── RecomendacoesPage.jsx
        │       └── SobrePage.jsx
        ├── package.json
        └── vite.config.js
```

---

## Passos de Implementação

### Passo 1 — Backend FastAPI
```bash
cd /home/marcin/UnB/teste
source .venv/bin/activate
pip install fastapi uvicorn
mkdir -p interface_grafica/backend
cd interface_grafica/backend
# criar main.py conforme especificação acima
uvicorn main:app --reload --port 8000
# Documentação automática: http://localhost:8000/docs
```

### Passo 2 — Frontend React + Vite
```bash
cd /home/marcin/UnB/teste/interface_grafica
mkdir frontend && cd frontend
npm create vite@latest . -- --template react
npm install react-router-dom
npm run dev
# App em: http://localhost:5173
```

### Passo 3 — Integração Frontend → Backend
```js
// src/api/recomendador.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function recomendarHibrido(curtidos, historico, top_n=5, peso=0.4) {
  const res = await fetch(`${API_BASE}/recomendar/hibrido`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({curtidos, historico, top_n, peso})
  });
  return res.json();
}
```

---

## Responsividade

| Breakpoint | Layout |
|---|---|
| `< 480px` | 1 coluna, navegação em bottom bar |
| `480–768px` | 2 colunas, sidebar colapsável |
| `> 768px` | 3 colunas, sidebar fixa |

---

## Acessibilidade (WCAG AA)

- Todos os `<input>` com `aria-label` associado
- `StarRating` usa `role="radiogroup"` com `aria-label`
- Focus trap no modal de detalhes do livro
- Contraste mínimo 4.5:1 em todos os textos

---

## Referências

1. Salton, G., & McGill, M. J. (1983). *Introduction to Modern Information Retrieval*. McGraw-Hill.
2. Resnick, P. et al. (1994). GroupLens. *CSCW*.
3. Herlocker, J. et al. (2004). Evaluating Collaborative Filtering. *ACM TOIS*, 22(1), 5–53.
4. Bishop, C. M. (2006). *Pattern Recognition and Machine Learning*. Springer.
5. Pazzani, M. & Billsus, D. (2007). Content-Based Recommendation Systems. *The Adaptive Web*, LNCS 4321.

---

> [!NOTE]
> O backend Python (`recomendador.py`) **já está completamente implementado e testado**.
> A interface gráfica comunica-se exclusivamente via API REST.
