# 📚 Sistema de Recomendação de Livros Nacionais

> **Projeto 1 — Introdução à Inteligência Artificial** | UnB — 2026/1 | Prof. Díbio

Sistema inteligente de recomendação de livros brasileiros, com base em três modelos de IA: **Filtragem por Conteúdo (TF-IDF)**, **Filtragem Colaborativa (kNN)** e **Modelo Híbrido**. Inclui interface web (React + FastAPI), CLI interativa e Jupyter Notebook documentado.

---

## 🗂️ Estrutura do Projeto

```
.
├── dados/
│   ├── livros.py              # Catálogo com 55 livros nacionais (gênero, período, estilo)
│   ├── gerar_matriz.py        # Gera a matriz de utilidade com 100 usuários simulados
│   └── matriz_utilidade.csv   # Matriz de avaliações (100 usuários × 55 livros)
│
├── recomendador.py            # Núcleo: TF-IDF, kNN e modelo híbrido
├── avaliacao.py               # Métricas: RMSE, MAE, Precision@K, Recall@K (LOO)
├── cli.py                     # Interface de linha de comando interativa
├── gerar_notebook.py          # Script para regenerar o notebook
├── projeto_recomendacao.ipynb # Notebook Jupyter para entrega
│
└── interface_grafica/
    ├── run.sh                 # Script para subir backend + frontend juntos
    ├── backend/
    │   ├── main.py            # API REST com FastAPI (endpoints de recomendação)
    │   └── requirements.txt   # Dependências Python do backend
    └── frontend/
        ├── package.json       # Dependências Node.js (React 18 + Vite)
        └── src/               # Código-fonte React
```

---

## ⚙️ Pré-requisitos

| Ferramenta | Versão mínima | Verificar com |
|---|---|---|
| Python | 3.10+ | `python --version` |
| pip | qualquer | `pip --version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |

---

## 🚀 Instalação (apenas na primeira vez)

### 1. Clone o repositório e entre na pasta

```bash
git clone <url-do-repositorio>
cd teste
```

### 2. Crie e ative o ambiente virtual Python

```bash
python -m venv .venv
source .venv/bin/activate      # Linux / macOS
# ou: .venv\Scripts\activate   # Windows
```

### 3. Instale as dependências Python

```bash
pip install fastapi==0.111.0 uvicorn==0.29.0 pydantic==2.7.1 numpy pandas scikit-learn
```

> Alternativamente, usando o `requirements.txt` do backend:
> ```bash
> pip install -r interface_grafica/backend/requirements.txt
> ```

### 4. Instale as dependências do frontend

```bash
cd interface_grafica/frontend
npm install
cd ../..
```

---

## ▶️ Como Rodar

### Opção A — Interface Web completa (recomendado para a demonstração)

Sobe o backend (FastAPI na porta 8000) e o frontend (React na porta 5173) com um único comando:

```bash
source .venv/bin/activate
cd interface_grafica
chmod +x run.sh
./run.sh
```

Após alguns segundos, acesse no navegador:

| Serviço | URL |
|---|---|
| 🌐 Interface Web | http://localhost:5173 |
| ⚙️ API REST | http://localhost:8000 |
| 📖 Docs da API (Swagger) | http://localhost:8000/docs |

Para encerrar, pressione `Ctrl+C` no terminal.

---

### Opção B — CLI interativa no terminal

Ideal para testar os algoritmos diretamente sem abrir o navegador:

```bash
source .venv/bin/activate
python cli.py
```

O menu oferece:
1. Ver catálogo completo de livros
2. Avaliar livros (notas 1–5) e receber recomendações dos 3 modelos
3. Buscar livros por gênero ou estilo

---

### Opção C — Testar o algoritmo diretamente

Executa um smoke test rápido com resultados impressos no terminal:

```bash
source .venv/bin/activate
python recomendador.py
```

---

### Opção D — Gerar relatório de métricas (RMSE, MAE, Precision@K)

Avalia os modelos com validação Leave-One-Out sobre a matriz de utilidade:

```bash
source .venv/bin/activate
python avaliacao.py
```

---

## 🔄 Regenerar os Dados

Se você modificar o catálogo de livros (`dados/livros.py`), regenere a matriz e o notebook:

```bash
source .venv/bin/activate

# 1. Regenera a matriz de utilidade (100 usuários simulados)
python dados/gerar_matriz.py

# 2. Regenera o notebook Jupyter com os novos dados
python gerar_notebook.py
```

---

## 🧠 Como os modelos funcionam

### 📄 Filtragem por Conteúdo (TF-IDF)
Transforma as características de cada livro (gênero, período, estilo) em vetores numéricos usando TF-IDF. Calcula a **similaridade de cosseno** entre o perfil do usuário e todos os livros para recomendar os mais parecidos com o que ele já gostou.

### 👥 Filtragem Colaborativa (User-Based kNN)
Encontra os **k usuários mais similares** ao usuário atual (pela matriz de utilidade). Prediz notas para livros não lidos usando média ponderada das notas dos vizinhos mais próximos.

### 🔀 Modelo Híbrido
Combina os dois modelos acima via média ponderada dos scores normalizados, equilibrando preferência de conteúdo e inteligência coletiva.

---

## 🔌 Principais endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/livros` | Lista todos os livros do catálogo |
| GET | `/populares` | Livros com maior nota média |
| POST | `/recomendar/conteudo` | Recomendação por TF-IDF |
| POST | `/recomendar/colaborativo` | Recomendação por kNN |
| POST | `/recomendar/hibrido` | Recomendação híbrida |
| GET | `/avaliar` | Retorna métricas de avaliação dos modelos |
| GET | `/docs` | Documentação interativa (Swagger) |

---

## 👥 Integrantes

<!-- Adicione os nomes e matrículas dos integrantes da dupla/tripla -->
- Nome — Matrícula
- Nome — Matrícula
