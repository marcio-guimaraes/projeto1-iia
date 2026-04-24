from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import sys, os

# Adiciona o diretório raiz ao PYTHONPATH para poder importar o recomendador
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from recomendador import Recomendador
from dados.livros import LIVROS, GENEROS, PERIODOS, ESTILOS

app = FastAPI(title="Book Recommender API", version="1.0")

# Permitir CORS para o frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # em produção restrija para o domínio real
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instância global do Recomendador (carregado em mémoria na inicialização da API)
rec = Recomendador()


# --- Modelos Pydantic para validação ---
class HistoricoRequest(BaseModel):
    historico: Dict[str, int]
    top_n: int = 5

class ConteudoRequest(BaseModel):
    curtidos: List[int]
    top_n: int = 5

class HibridoRequest(BaseModel):
    curtidos: List[int]
    historico: Dict[str, int]
    top_n: int = 5
    peso: float = 0.4


# --- Helper para respostas padronizadas ---
def _formatar_resposta(modelo: str, recomendacoes, id_col="id", score_col="score_similaridade"):
    # recomendacoes df -> lista de dicts
    # precisamos limpar NaN ou converter para None se necessário, mas o df.to_dict faz isso de alguma forma
    recs_list = []
    for rank, (index, row) in enumerate(recomendacoes.iterrows(), 1):
        recs_list.append({
            "id": int(row[id_col]),
            "titulo": row["titulo"],
            "autor": row["autor"],
            "genero": row["genero"],
            "periodo": row["periodo"],
            "estilo": row["estilo"],
            "score": round(float(row[score_col]), 4) if score_col in row else None,
            "rank": rank
        })
    
    return {
        "status": "ok",
        "modelo": modelo,
        "top_n": len(recs_list),
        "recomendacoes": recs_list
    }


# --- Endpoints ---

@app.get("/livros")
def listar_livros():
    """Lista todos os livros disponíveis."""
    return {"status": "ok", "livros": LIVROS}

@app.get("/livros/{livro_id}")
def obter_livro(livro_id: int):
    """Retorna detalhes de um livro específico."""
    for livro in LIVROS:
        if livro["id"] == livro_id:
            return {"status": "ok", "livro": livro}
    raise HTTPException(status_code=404, detail="Livro não encontrado")

@app.get("/filtros")
def listar_filtros():
    """Retorna as opções disponíveis para gêneros, períodos e estilos."""
    return {
        "status": "ok", 
        "generos": GENEROS,
        "periodos": PERIODOS,
        "estilos": ESTILOS
    }

@app.get("/livros/filtrar")
def filtrar_livros(genero: Optional[str] = None, periodo: Optional[str] = None, estilo: Optional[str] = None):
    """Retorna livros filtrados."""
    filtrados = LIVROS
    if genero:
        filtrados = [l for l in filtrados if l["genero"] == genero]
    if periodo:
        filtrados = [l for l in filtrados if l["periodo"] == periodo]
    if estilo:
        filtrados = [l for l in filtrados if l["estilo"] == estilo]
    return {"status": "ok", "livros": filtrados}

@app.get("/populares")
def populares(top_n: int = 10):
    """Retorna os livros com as maiores notas médias."""
    df_populares = rec._mais_populares(top_n)
    return _formatar_resposta("popularidade", df_populares, score_col="nota_prevista")

@app.post("/recomendar/conteudo")
def recomendar_conteudo(req: ConteudoRequest):
    """Recomendação baseada em Conteúdo (TF-IDF)."""
    df_res = rec.recomendar_conteudo(req.curtidos, top_n=req.top_n)
    return _formatar_resposta("conteudo", df_res, score_col="score_similaridade")

@app.post("/recomendar/colaborativo")
def recomendar_colaborativo(req: HistoricoRequest):
    """Recomendação Colaborativa (kNN)."""
    historico_int = {int(k): v for k, v in req.historico.items()}
    df_res = rec.recomendar_colaborativo(historico_int, top_n=req.top_n)
    return _formatar_resposta("colaborativo", df_res, score_col="nota_prevista")

@app.post("/recomendar/hibrido")
def recomendar_hibrido(req: HibridoRequest):
    """Recomendação Híbrida."""
    historico_int = {int(k): v for k, v in req.historico.items()}
    df_res = rec.recomendar_hibrido(req.curtidos, historico_int, top_n=req.top_n, peso_conteudo=req.peso)
    return _formatar_resposta("hibrido", df_res, score_col="score_final")

@app.get("/avaliar")
def avaliar_modelos(top_k: int = 5, n_usuarios: int = 30):
    """Retorna as métricas de avaliação dos modelos."""
    # Como as métricas podem demorar um pouco, poderia ser pre-calculado, 
    # mas aqui calculamos na hora ou chamamos o que está no arquivo avaliacao.py.
    # Para economizar tempo em cada chamada de frontend, poderíamos mocar resultados estáticos se ficar lento,
    # mas a API fará a chamada real:
    from avaliacao import validar_colaborativo_loo, validar_conteudo
    met_col = validar_colaborativo_loo(rec, n_usuarios=n_usuarios, top_k=top_k)
    met_con = validar_conteudo(rec, n_usuarios=n_usuarios, top_k=top_k)
    
    return {
        "status": "ok",
        "metricas": {
            "colaborativo": met_col,
            "conteudo": met_con
        }
    }
