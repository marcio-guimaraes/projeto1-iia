"""
Núcleo do sistema de recomendação de livros.

Implementa DOIS modelos complementares:
  1. Filtragem Baseada em Conteúdo usando TF-IDF
     - Representa cada livro como um vetor de características
     - Usa similaridade de cosseno para recomendar itens parecidos com os
       que o usuário já gostou (nota >= limiar).
     - Referência: Salton & McGill (1983). Introduction to Modern
       Information Retrieval. McGraw-Hill; Bishop (2006) Pattern
       Recognition and Machine Learning, cap. 14.

  2. Filtragem Colaborativa (User-Based)
     - Encontra usuários similares ao novo usuário via similaridade de
       cosseno na matriz de utilidade (após centralização pela média).
     - Prediz notas como média ponderada das notas dos vizinhos mais
       próximos (kNN).
     - Referência: Resnick et al. (1994). GroupLens: An Open Architecture
       for Collaborative Filtering of Netnews. CSCW.

Uso externo:
  from recomendador import Recomendador
  rec = Recomendador()
  sugestoes = rec.recomendar_conteudo(perfil_usuario, top_n=5)
  sugestoes = rec.recomendar_colaborativo(historico_usuario, top_n=5)
"""
import os
import sys
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Optional, Tuple

# Caminho base
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from dados.livros import LIVROS, LIVROS_POR_ID

MATRIZ_PATH = os.path.join(BASE_DIR, "dados", "matriz_utilidade.csv")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _construir_documento(livro: dict) -> str:
    """
    Converte as 3 características de um livro em um 'documento' de texto
    para o TF-IDF. Cada característica é repetida para aumentar seu peso.
    """
    return f"{livro['genero']} {livro['genero']} {livro['periodo']} {livro['estilo']} {livro['estilo']}"


# ---------------------------------------------------------------------------
# Classe principal
# ---------------------------------------------------------------------------

class Recomendador:
    """
    Sistema de recomendação híbrido (conteúdo + colaborativo).

    Parâmetros
    ----------
    n_vizinhos : int
        Número de vizinhos para filtragem colaborativa (default 10).
    limiar_nota : int
        Nota mínima para considerar um livro "curtido" no histórico
        (default 3).
    """

    def __init__(self, n_vizinhos: int = 10, limiar_nota: int = 3):
        self.n_vizinhos = n_vizinhos
        self.limiar_nota = limiar_nota
        self._treinar()

    # ------------------------------------------------------------------
    # Treinamento
    # ------------------------------------------------------------------

    def _treinar(self):
        """Prepara todas as estruturas de dados necessárias."""

        # --- 1. Catálogo de livros como DataFrame ---
        self.df_livros = pd.DataFrame(LIVROS).set_index("id")

        # --- 2. TF-IDF sobre características dos livros ---
        documentos = [_construir_documento(l) for l in LIVROS]
        self.vectorizer = TfidfVectorizer()
        self.tfidf_matrix = self.vectorizer.fit_transform(documentos)
        # Índice: posição no vetor → id do livro
        self.idx_para_id  = {i: l["id"] for i, l in enumerate(LIVROS)}
        self.id_para_idx  = {l["id"]: i for i, l in enumerate(LIVROS)}

        # --- 3. Matriz de utilidade ---
        self.df_util = pd.read_csv(MATRIZ_PATH, index_col=0)
        self.df_util.columns = self.df_util.columns.astype(int)

        # Centraliza pela média por usuário (para o modelo colaborativo)
        self.df_util_central = self.df_util.sub(self.df_util.mean(axis=1), axis=0)

    # ------------------------------------------------------------------
    # API pública
    # ------------------------------------------------------------------

    def recomendar_conteudo(
        self,
        livros_curtidos: List[int],
        top_n: int = 5,
        excluir_conhecidos: bool = True,
    ) -> pd.DataFrame:
        """
        Recomenda livros baseado em conteúdo (TF-IDF + similaridade de cosseno).

        Parâmetros
        ----------
        livros_curtidos : list[int]
            IDs dos livros que o usuário gostou (nota >= limiar).
        top_n : int
            Número de recomendações a retornar.
        excluir_conhecidos : bool
            Se True, remove da lista livros já avaliados pelo usuário.

        Retorna
        -------
        pd.DataFrame com colunas: id, titulo, autor, genero, periodo,
        estilo, score_similaridade.
        """
        if not livros_curtidos:
            # Retorna os mais populares (média mais alta na matriz de utilidade)
            return self._mais_populares(top_n)

        # Perfil do usuário = média dos vetores TF-IDF dos livros curtidos
        indices_curtidos = [self.id_para_idx[lid] for lid in livros_curtidos
                            if lid in self.id_para_idx]
        perfil_usuario = np.asarray(
            self.tfidf_matrix[indices_curtidos].mean(axis=0)
        )

        # Similaridade com todos os livros
        scores = cosine_similarity(perfil_usuario, self.tfidf_matrix)[0]

        # Cria DataFrame de resultados
        resultados = []
        for idx, score in enumerate(scores):
            lid = self.idx_para_id[idx]
            if excluir_conhecidos and lid in livros_curtidos:
                continue
            resultados.append({"id": lid, "score_similaridade": round(float(score), 4)})

        df_res = (
            pd.DataFrame(resultados)
            .sort_values("score_similaridade", ascending=False)
            .head(top_n)
        )
        return self._enriquecer(df_res)

    def recomendar_colaborativo(
        self,
        historico_usuario: Dict[int, int],
        top_n: int = 5,
    ) -> pd.DataFrame:
        """
        Recomenda livros usando filtragem colaborativa User-Based kNN.

        Parâmetros
        ----------
        historico_usuario : dict[int, int]
            Mapeamento {id_livro: nota} das avaliações do novo usuário.
        top_n : int
            Número de recomendações a retornar.

        Retorna
        -------
        pd.DataFrame com colunas: id, titulo, autor, genero, periodo,
        estilo, nota_prevista.
        """
        if not historico_usuario:
            return self._mais_populares(top_n)

        todos_ids = list(self.df_util.columns)

        # Vetor do novo usuário (NaN nos livros não avaliados)
        vetor_novo = pd.Series(np.nan, index=todos_ids)
        for lid, nota in historico_usuario.items():
            if lid in vetor_novo.index:
                vetor_novo[lid] = float(nota)

        media_novo = vetor_novo.mean()
        vetor_central = vetor_novo - media_novo

        # Função de similaridade com cada usuário de treinamento
        similares = self._calcular_similares(vetor_central)

        # Prediz notas para livros não avaliados
        livros_nao_avaliados = [lid for lid in todos_ids
                                 if pd.isna(vetor_novo[lid])]

        predicoes = []
        for lid in livros_nao_avaliados:
            nota_pred = self._prever_nota(lid, media_novo, similares)
            if nota_pred is not None:
                predicoes.append({"id": lid, "nota_prevista": round(nota_pred, 2)})

        if not predicoes:
            return self._mais_populares(top_n)

        df_res = (
            pd.DataFrame(predicoes)
            .sort_values("nota_prevista", ascending=False)
            .head(top_n)
        )
        return self._enriquecer(df_res, col_score="nota_prevista")

    def recomendar_hibrido(
        self,
        livros_curtidos: List[int],
        historico_usuario: Dict[int, int],
        top_n: int = 5,
        peso_conteudo: float = 0.5,
    ) -> pd.DataFrame:
        """
        Recomendação híbrida: combina score de conteúdo e nota prevista
        colaborativa via média ponderada.

        Parâmetros
        ----------
        peso_conteudo : float in [0,1]
            Peso do modelo de conteúdo (1 - peso_conteudo = peso colaborativo).
        """
        df_cont = self.recomendar_conteudo(livros_curtidos, top_n=top_n * 2)
        df_col  = self.recomendar_colaborativo(historico_usuario, top_n=top_n * 2)

        # Normaliza scores para [0, 1]
        if "score_similaridade" in df_cont.columns and len(df_cont) > 0:
            mx = df_cont["score_similaridade"].max() or 1
            df_cont["score_norm"] = df_cont["score_similaridade"] / mx
        else:
            df_cont["score_norm"] = 0.0

        if "nota_prevista" in df_col.columns and len(df_col) > 0:
            df_col["score_norm"] = (df_col["nota_prevista"] - 1) / 4  # escala 1-5
        else:
            df_col["score_norm"] = 0.0

        # Merge
        df_merge = pd.merge(
            df_cont[["id", "score_norm"]].rename(columns={"score_norm": "s_cont"}),
            df_col[["id", "score_norm"]].rename(columns={"score_norm": "s_col"}),
            on="id", how="outer"
        ).fillna(0)

        df_merge["score_hibrido"] = (
            peso_conteudo * df_merge["s_cont"] +
            (1 - peso_conteudo) * df_merge["s_col"]
        )

        df_res = df_merge.sort_values("score_hibrido", ascending=False).head(top_n)
        df_res = df_res.rename(columns={"score_hibrido": "score_final"})
        return self._enriquecer(df_res[["id", "score_final"]], col_score="score_final")

    def obter_perfil_usuario(self, historico: Dict[int, int]) -> Tuple[List[int], List[int]]:
        """
        Divide o histórico em livros curtidos e não curtidos com base no limiar.

        Retorna
        -------
        (curtidos, nao_curtidos) : listas de ids.
        """
        curtidos    = [lid for lid, nota in historico.items() if nota >= self.limiar_nota]
        nao_curtidos = [lid for lid, nota in historico.items() if nota <  self.limiar_nota]
        return curtidos, nao_curtidos

    # ------------------------------------------------------------------
    # Métodos internos
    # ------------------------------------------------------------------

    def _calcular_similares(self, vetor_central_novo: pd.Series) -> pd.DataFrame:
        """
        Calcula a similaridade de cosseno entre o novo usuário e todos os
        usuários de treinamento.
        """
        resultados = []
        for usuario in self.df_util_central.index:
            vetor_treino = self.df_util_central.loc[usuario]

            # Livros avaliados por ambos
            mask = ~vetor_central_novo.isna() & ~vetor_treino.isna()
            if mask.sum() < 2:
                continue

            v_novo   = vetor_central_novo[mask].values
            v_treino = vetor_treino[mask].values

            norm = np.linalg.norm(v_novo) * np.linalg.norm(v_treino)
            if norm == 0:
                continue
            sim = float(np.dot(v_novo, v_treino) / norm)
            resultados.append({"usuario": usuario, "similaridade": sim})

        df_sim = pd.DataFrame(resultados).sort_values(
            "similaridade", ascending=False
        ).head(self.n_vizinhos)
        return df_sim

    def _prever_nota(
        self,
        id_livro: int,
        media_novo: float,
        similares: pd.DataFrame,
    ) -> Optional[float]:
        """
        Prediz a nota do novo usuário para um livro específico usando os
        k vizinhos mais próximos.
        """
        numerador   = 0.0
        denominador = 0.0

        for _, row in similares.iterrows():
            usuario = row["usuario"]
            sim     = row["similaridade"]
            nota    = self.df_util.at[usuario, id_livro]
            media_u = self.df_util.loc[usuario].mean()

            if pd.isna(nota):
                continue

            numerador   += sim * (nota - media_u)
            denominador += abs(sim)

        if denominador == 0:
            return None
        return float(np.clip(media_novo + numerador / denominador, 1.0, 5.0))

    def _mais_populares(self, top_n: int) -> pd.DataFrame:
        """Fallback: retorna os livros com maior média de avaliações."""
        medias = self.df_util.mean().nlargest(top_n)
        df_res = medias.reset_index().rename(columns={"index": "id", 0: "nota_prevista"})
        df_res.columns = ["id", "nota_prevista"]
        df_res["id"] = df_res["id"].astype(int)
        return self._enriquecer(df_res, col_score="nota_prevista")

    def _enriquecer(self, df: pd.DataFrame, col_score: str = "score_similaridade") -> pd.DataFrame:
        """Junta os metadados dos livros ao DataFrame de resultados."""
        df_info = self.df_livros.reset_index()[["id", "titulo", "autor", "genero", "periodo", "estilo"]]
        df_final = df.merge(df_info, on="id", how="left")

        # Reordena colunas
        cols_meta = ["id", "titulo", "autor", "genero", "periodo", "estilo"]
        if col_score in df_final.columns:
            cols = cols_meta + [col_score]
        else:
            cols = cols_meta
        return df_final[[c for c in cols if c in df_final.columns]]


# ---------------------------------------------------------------------------
# Smoke test rápido
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    rec = Recomendador()

    print("=" * 60)
    print("=== TESTE: Recomendação por Conteúdo ===")
    # Usuário curtiu: Dom Casmurro (1), Mem. Póstumas (2), Vidas Secas (10)
    curtidos = [1, 2, 10]
    res_cont = rec.recomendar_conteudo(curtidos, top_n=5)
    print(res_cont.to_string(index=False))

    print("\n" + "=" * 60)
    print("=== TESTE: Recomendação Colaborativa ===")
    historico = {1: 5, 2: 4, 5: 2, 13: 5, 14: 4, 25: 1}
    res_col = rec.recomendar_colaborativo(historico, top_n=5)
    print(res_col.to_string(index=False))

    print("\n" + "=" * 60)
    print("=== TESTE: Recomendação Híbrida ===")
    curtidos, _ = rec.obter_perfil_usuario(historico)
    res_hib = rec.recomendar_hibrido(curtidos, historico, top_n=5)
    print(res_hib.to_string(index=False))
