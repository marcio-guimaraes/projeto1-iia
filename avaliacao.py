"""
avaliacao.py
============
Métricas de avaliação do sistema de recomendação.

Implementa:
  - RMSE  (Root Mean Squared Error) para notas previstas
  - MAE   (Mean Absolute Error)
  - Precision@K e Recall@K para avaliação de ranking
  - Validação Leave-One-Out sobre a matriz de utilidade

Referência:
  Herlocker et al. (2004). Evaluating Collaborative Filtering
  Recommender Systems. ACM TOIS, 22(1), 5-53.
"""

import os
import sys
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from recomendador import Recomendador
from dados.livros import LIVROS

MATRIZ_PATH = os.path.join(BASE_DIR, "dados", "matriz_utilidade.csv")


# ---------------------------------------------------------------------------
# Métricas de erro pontual
# ---------------------------------------------------------------------------

def rmse(y_real: np.ndarray, y_prev: np.ndarray) -> float:
    """Root Mean Squared Error."""
    return float(np.sqrt(np.mean((y_real - y_prev) ** 2)))


def mae(y_real: np.ndarray, y_prev: np.ndarray) -> float:
    """Mean Absolute Error."""
    return float(np.mean(np.abs(y_real - y_prev)))


# ---------------------------------------------------------------------------
# Métricas de ranking
# ---------------------------------------------------------------------------

def precision_at_k(recomendados: List[int], relevantes: List[int], k: int) -> float:
    """
    Precision@K: fração dos k primeiros recomendados que são relevantes.
    """
    top_k = recomendados[:k]
    hits  = len(set(top_k) & set(relevantes))
    return hits / k if k > 0 else 0.0


def recall_at_k(recomendados: List[int], relevantes: List[int], k: int) -> float:
    """
    Recall@K: fração dos relevantes que aparecem nos k primeiros recomendados.
    """
    top_k = recomendados[:k]
    hits  = len(set(top_k) & set(relevantes))
    return hits / len(relevantes) if relevantes else 0.0


# ---------------------------------------------------------------------------
# Validação Leave-One-Out
# ---------------------------------------------------------------------------

def validar_colaborativo_loo(
    rec: Recomendador,
    n_usuarios: int = 30,
    top_k: int = 5,
    limiar_relevancia: int = 4,
    seed: int = 42,
) -> Dict[str, float]:
    """
    Avalia o modelo colaborativo com validação Leave-One-Out.

    Para cada usuário de teste:
      1. Remove uma avaliação alta aleatória do histórico.
      2. Pede recomendações com o restante.
      3. Verifica se o item removido aparece no top-K.

    Retorna métricas: precision@K, recall@K, RMSE, MAE.
    """
    np.random.seed(seed)
    df_util = pd.read_csv(MATRIZ_PATH, index_col=0)
    df_util.columns = df_util.columns.astype(int)

    usuarios = list(df_util.index)
    usuarios_teste = np.random.choice(usuarios, size=min(n_usuarios, len(usuarios)),
                                       replace=False)

    precisoes, recalls, erros_rmse, erros_mae = [], [], [], []

    for usuario in usuarios_teste:
        serie = df_util.loc[usuario].dropna()
        # Precisa ter ao menos 5 avaliações para fazer o split
        if len(serie) < 5:
            continue

        # Itens com nota alta (relevantes)
        relevantes_serie = serie[serie >= limiar_relevancia]
        if len(relevantes_serie) == 0:
            continue

        # Remove um item aleatório de nota alta
        item_removido = int(np.random.choice(relevantes_serie.index))
        nota_real     = float(serie[item_removido])

        historico = {int(k): int(v)
                     for k, v in serie.drop(item_removido).items()}

        # Recomendações sem o item removido
        df_rec = rec.recomendar_colaborativo(historico, top_n=top_k)
        recomendados = list(df_rec["id"].astype(int))

        # Relevantes (exceto o removido)
        relevantes_ids = [int(k) for k, v in historico.items()
                          if v >= limiar_relevancia]

        precisoes.append(precision_at_k(recomendados, [item_removido], top_k))
        recalls.append(recall_at_k(recomendados, [item_removido], top_k))

        # Erro pontual para o item removido (se apareceu na previsão)
        if item_removido in df_rec["id"].values:
            nota_prev = float(df_rec.loc[df_rec["id"] == item_removido, "nota_prevista"].values[0])
            erros_rmse.append((nota_real - nota_prev) ** 2)
            erros_mae.append(abs(nota_real - nota_prev))

    return {
        f"Precision@{top_k}": round(np.mean(precisoes), 4) if precisoes else 0.0,
        f"Recall@{top_k}":    round(np.mean(recalls),   4) if recalls    else 0.0,
        "RMSE_nota":           round(np.sqrt(np.mean(erros_rmse)), 4) if erros_rmse else None,
        "MAE_nota":            round(np.mean(erros_mae),           4) if erros_mae  else None,
        "n_usuarios_avaliados": len(precisoes),
    }


def validar_conteudo(
    rec: Recomendador,
    n_usuarios: int = 30,
    top_k: int = 5,
    limiar_relevancia: int = 4,
    seed: int = 42,
) -> Dict[str, float]:
    """
    Avalia o modelo de conteúdo com validação Leave-One-Out.
    """
    np.random.seed(seed)
    df_util = pd.read_csv(MATRIZ_PATH, index_col=0)
    df_util.columns = df_util.columns.astype(int)

    usuarios = list(df_util.index)
    usuarios_teste = np.random.choice(usuarios, size=min(n_usuarios, len(usuarios)),
                                       replace=False)

    precisoes, recalls = [], []

    for usuario in usuarios_teste:
        serie = df_util.loc[usuario].dropna()
        if len(serie) < 4:
            continue

        relevantes_serie = serie[serie >= limiar_relevancia]
        if len(relevantes_serie) == 0:
            continue

        item_removido = int(np.random.choice(relevantes_serie.index))
        historico_sem = {int(k): int(v) for k, v in serie.drop(item_removido).items()}

        curtidos = [k for k, v in historico_sem.items() if v >= rec.limiar_nota]
        if not curtidos:
            continue

        df_rec = rec.recomendar_conteudo(curtidos, top_n=top_k)
        recomendados = list(df_rec["id"].astype(int))

        precisoes.append(precision_at_k(recomendados, [item_removido], top_k))
        recalls.append(recall_at_k(recomendados, [item_removido], top_k))

    return {
        f"Precision@{top_k}": round(np.mean(precisoes), 4) if precisoes else 0.0,
        f"Recall@{top_k}":    round(np.mean(recalls),   4) if recalls    else 0.0,
        "n_usuarios_avaliados": len(precisoes),
    }


# ---------------------------------------------------------------------------
# Relatório completo
# ---------------------------------------------------------------------------

def gerar_relatorio(n_usuarios: int = 50, top_k: int = 5) -> str:
    """Gera relatório textual completo de avaliação dos dois modelos."""
    rec = Recomendador()

    print("Avaliando modelo colaborativo (LOO)...")
    metricas_col = validar_colaborativo_loo(rec, n_usuarios=n_usuarios, top_k=top_k)

    print("Avaliando modelo de conteúdo (LOO)...")
    metricas_cont = validar_conteudo(rec, n_usuarios=n_usuarios, top_k=top_k)

    linhas = [
        "=" * 55,
        "  RELATÓRIO DE AVALIAÇÃO DO SISTEMA DE RECOMENDAÇÃO",
        "=" * 55,
        "",
        f"  Validação: Leave-One-Out | Top-K = {top_k}",
        f"  Limiar de relevância: nota >= 4/5",
        "",
        "  MODELO COLABORATIVO (User-Based kNN)",
        "  " + "-" * 45,
    ]
    for k, v in metricas_col.items():
        linhas.append(f"    {k:<30}: {v}")

    linhas += [
        "",
        "  MODELO DE CONTEÚDO (TF-IDF + Cosine Similarity)",
        "  " + "-" * 45,
    ]
    for k, v in metricas_cont.items():
        linhas.append(f"    {k:<30}: {v}")

    linhas += ["", "=" * 55]
    relatorio = "\n".join(linhas)
    print(relatorio)
    return relatorio


if __name__ == "__main__":
    gerar_relatorio()
