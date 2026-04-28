# Sistema de Recomendação de Livros Nacionais

> **Projeto 1 — Introdução à Inteligência Artificial** | UnB 2026/1 | Prof. Díbio

Sistema inteligente de recomendação de literatura brasileira com três modelos de IA: **Filtragem por Conteúdo (TF-IDF)**, **Filtragem Colaborativa (kNN)** e **Modelo Híbrido**. Inclui interface web (React + FastAPI), CLI interativa e Jupyter Notebook documentado.

---

## Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    Interface Web (React)                     │
│   Landing → Catálogo → Avaliação (3 etapas) → Recomendações │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP (porta 8000)
┌───────────────────────▼─────────────────────────────────────┐
│                    API REST (FastAPI)                        │
│   /livros  /populares  /recomendar/*  /avaliar               │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  Núcleo de IA (Python)                       │
│   recomendador.py → TF-IDF · kNN · Híbrido                  │
│   dados/matriz_utilidade.csv → 500 usuários × 55 livros     │
└─────────────────────────────────────────────────────────────┘
```

---

## Estrutura do Projeto

```
projeto1-iia/
│
├── dados/
│   ├── livros.py              # Catálogo: 55 livros nacionais com gênero, período e estilo
│   ├── gerar_matriz.py        # Gera a matriz de utilidade simulada
│   └── matriz_utilidade.csv   # Matriz de avaliações (500 usuários × 55 livros)
│
├── recomendador.py            # Núcleo de IA: TF-IDF, kNN e modelo híbrido
├── avaliacao.py               # Métricas: RMSE, Precision@K, Recall@K (Leave-One-Out)
├── cli.py                     # Interface de linha de comando interativa
├── gerar_notebook.py          # Regenera o notebook Jupyter
├── projeto_recomendacao.ipynb # Notebook para entrega (com comentários e matrículas)
│
└── interface_grafica/
    ├── run.sh                 # Script de inicialização (backend + frontend juntos)
    ├── backend/
    │   ├── main.py            # API REST com FastAPI
    │   └── requirements.txt   # Dependências Python
    └── frontend/
        ├── package.json       # Dependências Node.js (React 18 + Vite 5)
        └── src/
            ├── pages/         # LandingPage, Catálogo, Avaliação, Recomendações, Sobre
            ├── components/    # Navbar, BookCard, RecommendCard, StarRating, ...
            ├── api/           # Cliente HTTP para a API
            └── context/       # Estado global de avaliações (React Context)
```

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Ferramenta | Versão mínima | Como verificar       |
|------------|---------------|----------------------|
| Python     | 3.10+         | `python --version`   |
| pip        | qualquer      | `pip --version`      |
| Node.js    | 18+           | `node --version`     |
| npm        | 9+            | `npm --version`      |
| Git        | qualquer      | `git --version`      |

> **Linux/macOS**: recomendado. No **Windows**, use o [WSL2](https://learn.microsoft.com/pt-br/windows/wsl/install) ou o Git Bash para os comandos bash.

---

## Instalação

### Passo 1 — Clonar o repositório

```bash
git clone https://github.com/marcio-guimaraes/projeto1-iia
cd projeto1-iia
```

### Passo 2 — Criar e ativar o ambiente virtual Python

```bash
# Cria o ambiente virtual dentro da pasta do projeto
python -m venv .venv

# Ativa o ambiente
source .venv/bin/activate        # Linux / macOS
# .venv\Scripts\activate         # Windows (PowerShell)
# source .venv/Scripts/activate  # Windows (Git Bash)
```

> Quando ativo, você verá `(.venv)` no início do seu terminal.

### Passo 3 — Instalar as dependências Python

```bash
pip install -r interface_grafica/backend/requirements.txt
```

As dependências instaladas são:

| Pacote       | Versão   | Uso                               |
|--------------|----------|-----------------------------------|
| fastapi      | 0.111.0  | Framework da API REST             |
| uvicorn      | 0.29.0   | Servidor ASGI para o FastAPI      |
| pydantic     | 2.7.1    | Validação de dados da API         |
| numpy        | última   | Operações matriciais              |
| pandas       | última   | Manipulação da matriz de utilidade|
| scikit-learn | última   | TF-IDF e kNN                      |

### Passo 4 — Instalar as dependências do frontend

```bash
cd interface_grafica/frontend
npm install
cd ../..
```

> O `npm install` pode levar 1–2 minutos na primeira vez. Ele instala React 18, Vite 5 e o restante das dependências listadas no `package.json`.

---

## Como Rodar

### Opção A — Interface Web completa ✅ (recomendada para a demonstração)

Um único comando sobe o backend e o frontend simultaneamente:

```bash
# 1. Ative o ambiente virtual (se ainda não estiver ativo)
source .venv/bin/activate

# 2. Entre na pasta da interface e execute o script
cd interface_grafica
chmod +x run.sh   # só na primeira vez
./run.sh
```

Após alguns segundos, você verá no terminal:

```
============================================================
✨ SISTEMA DE RECOMENDAÇÃO EM EXECUÇÃO ✨
👉 Frontend em:    http://localhost:5173
👉 Backend API em: http://localhost:8000
👉 Docs da API em: http://localhost:8000/docs
============================================================
Pressione Ctrl+C para encerrar tudo.
```

Abra o navegador em **http://localhost:5173** para usar o sistema.

> Para encerrar, pressione `Ctrl+C` no terminal. O script encerra os dois processos automaticamente.

---

### Opção B — Subir backend e frontend separadamente

Útil para desenvolvimento, quando você quer ver os logs de cada serviço separadamente.

**Terminal 1 — Backend (FastAPI):**

```bash
source .venv/bin/activate
cd interface_grafica/backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend (React/Vite):**

```bash
cd interface_grafica/frontend
npm run dev
```

---

### Opção C — CLI interativa no terminal

Ideal para testar os algoritmos diretamente, sem abrir o navegador:

```bash
source .venv/bin/activate
python cli.py
```

O menu interativo oferece:
1. Ver catálogo completo de livros
2. Avaliar livros (notas 1–5) e receber recomendações
3. Buscar livros por gênero ou estilo

---

### Opção D — Smoke test do algoritmo

Executa um teste rápido do núcleo de IA e imprime resultados no terminal:

```bash
source .venv/bin/activate
python recomendador.py
```

---

### Opção E — Relatório de métricas (RMSE, Precision@K, Recall@K)

Avalia os três modelos com validação Leave-One-Out sobre a matriz de utilidade:

```bash
source .venv/bin/activate
python avaliacao.py
```

---

## Fluxo de Uso da Interface Web

```
1. Acesse http://localhost:5173

2. Clique em "Começar avaliação →"

3. Etapa 1 — Perfil
   └── Informe seu nome (opcional) e selecione gêneros favoritos

4. Etapa 2 — Avalie livros
   ├── Aba "Populares": 15 livros mais bem avaliados para nota rápida
   └── Aba "Buscar livro": pesquise qualquer um dos 55 livros por título ou autor
       ↳ Dê nota de 1 a 5 estrelas (clique na mesma estrela para remover)
       ↳ Avalie pelo menos 3 livros para liberar o próximo passo

5. Etapa 3 — Escolha o modelo
   ├── Baseado em Conteúdo (TF-IDF)
   ├── Filtragem Colaborativa (kNN)
   └── Híbrido (ajuste o peso conteúdo/colaborativo com o slider)
       ↳ Clique em "Gerar →" em qualquer modelo

6. Receba suas 5 recomendações personalizadas
   ├── Alterne entre modelos pelas abas no topo
   ├── Clique em "Por que?" para entender cada recomendação
   └── Clique em "Ver avaliação dos modelos (LOO)" para ver as métricas
```

---

## Endpoints da API

Com o backend rodando em `http://localhost:8000`:

| Método | Endpoint                   | Descrição                              |
|--------|----------------------------|----------------------------------------|
| GET    | `/livros`                  | Lista todos os 55 livros               |
| GET    | `/livros/{id}`             | Detalhes de um livro específico        |
| GET    | `/filtros`                 | Opções de gêneros, períodos e estilos  |
| GET    | `/populares?top_n=10`      | Livros com maiores notas médias        |
| POST   | `/recomendar/conteudo`     | Recomendação por TF-IDF                |
| POST   | `/recomendar/colaborativo` | Recomendação por kNN                   |
| POST   | `/recomendar/hibrido`      | Recomendação híbrida (pesos ajustáveis)|
| GET    | `/avaliar`                 | Métricas LOO dos modelos               |
| GET    | `/docs`                    | Documentação interativa (Swagger UI)   |

---

## Regenerar os Dados

Se você modificar o catálogo (`dados/livros.py`), regenere a matriz e o notebook:

```bash
source .venv/bin/activate

# 1. Regenera a matriz de utilidade (500 usuários simulados)
python dados/gerar_matriz.py

# 2. Regenera o notebook Jupyter com os novos dados
python gerar_notebook.py
```

---

## Solução de Problemas

**`ModuleNotFoundError` ao rodar o backend:**
```bash
# Certifique-se de que o ambiente virtual está ativo
source .venv/bin/activate
pip install -r interface_grafica/backend/requirements.txt
```

**Frontend não conecta ao backend (livros não carregam):**
```bash
# Verifique se o backend está rodando na porta 8000
curl http://localhost:8000/livros
# Se não responder, suba o backend primeiro (Opção B)
```

**Porta 5173 ou 8000 já em uso:**
```bash
# Descubra o processo usando a porta e encerre-o
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

**`npm install` falha com erro de permissão (Linux/macOS):**
```bash
# Nunca use sudo com npm. Configure o npm para pasta local:
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

---

## Como os Modelos Funcionam

### Filtragem por Conteúdo (TF-IDF)
Representa cada livro como um vetor de características (gênero, período literário, estilo) ponderadas por TF-IDF. Calcula a **similaridade de cosseno** entre o perfil do usuário (média dos vetores dos livros bem avaliados) e todos os livros do catálogo.

### Filtragem Colaborativa (User-Based kNN)
Usa a **matriz de utilidade** (500 usuários × 55 livros, centralizada por usuário) para encontrar os *k* vizinhos mais similares ao novo usuário. Prediz notas como média ponderada das avaliações dos vizinhos, pesos proporcionais à similaridade de cosseno.

### Modelo Híbrido
Combina as predições normalizadas dos dois modelos via **média ponderada ajustável**. Minimiza o problema de *cold-start* do colaborativo e a limitação de diversidade do baseado em conteúdo.

---

## Integrantes

<!-- Preencha com os nomes e matrículas dos integrantes -->
| Nome | Matrícula |
|------|-----------|
| Ana Caroline Freitas Brito | 242001526 |
| Márcio Vinícius da Silva Guimarães | 242001553 |
| Vitor Ignacio dos Santos Valcarcel | 242010006 |
