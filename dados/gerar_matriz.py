"""
Gera a matriz de utilidade (utility matrix) com 100 usuários de treinamento.
Avaliações: escala 1-5 (inteiros), com NaN onde o usuário não avaliou.

Estratégia de geração realista:
  - Cada usuário recebe um perfil de preferências aleatório (gêneros e estilos favoritos).
  - Usuários avaliam em média 15-25 livros (esparsidade ~65%).
  - Livros compatíveis com o perfil do usuário têm maior probabilidade de nota alta.
  - Ruído gaussiano é adicionado para tornar os dados mais naturais.
"""

import numpy as np
import pandas as pd
import random
import os
import sys

# Garante acesso ao diretório pai
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dados.livros import LIVROS, GENEROS, PERIODOS, ESTILOS

random.seed(42)
np.random.seed(42)

N_USUARIOS = 100
N_LIVROS = len(LIVROS)

# IDs de livros
livro_ids = [l["id"] for l in LIVROS]

def gerar_perfil_usuario():
    """Gera um perfil aleatório de preferências para um usuário."""
    generos_fav   = random.sample(GENEROS,  k=random.randint(1, 3))
    periodos_fav  = random.sample(PERIODOS, k=random.randint(1, 2))
    estilos_fav   = random.sample(ESTILOS,  k=random.randint(1, 4))
    return generos_fav, periodos_fav, estilos_fav

def nota_base(livro: dict, generos_fav, periodos_fav, estilos_fav) -> float:
    """
    Calcula uma nota base para um livro dado o perfil do usuário.
    Pontuação máxima = 3 (um ponto por característica compatível) → escalonada para 1-5.
    """
    score = 0
    if livro["genero"]  in generos_fav:  score += 1
    if livro["periodo"] in periodos_fav: score += 0.5
    if livro["estilo"]  in estilos_fav:  score += 1
    # baseline 2, max 4.5 → mapeia para 1-5
    nota = 2 + score + np.random.normal(0, 0.5)
    nota = np.clip(nota, 1.0, 5.0)
    return round(nota)

# Constrói a matriz (linhas=usuários, colunas=livros)
dados_brutos = {}
nomes_usuarios = [f"usuario_{i+1:03d}" for i in range(N_USUARIOS)]

for u_idx in range(N_USUARIOS):
    nome = nomes_usuarios[u_idx]
    gf, pf, ef = gerar_perfil_usuario()

    # Quantos livros este usuário vai avaliar
    n_avaliacoes = random.randint(15, 30)
    livros_avaliados = random.sample(livro_ids, k=n_avaliacoes)

    avaliacoes = {}
    for lid in livros_avaliados:
        livro = next(l for l in LIVROS if l["id"] == lid)
        avaliacoes[lid] = nota_base(livro, gf, pf, ef)

    dados_brutos[nome] = avaliacoes

# Monta DataFrame
df = pd.DataFrame(index=nomes_usuarios, columns=livro_ids, dtype=float)
for usuario, avaliacoes in dados_brutos.items():
    for lid, nota in avaliacoes.items():
        df.at[usuario, lid] = nota

# Salva em CSV
output_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(output_dir, "matriz_utilidade.csv")
df.to_csv(output_path)
print(f"Matriz salva em: {output_path}")
print(f"Shape: {df.shape}")
print(f"Esparsidade: {df.isna().sum().sum() / df.size:.1%}")
print(f"\nAmostra (primeiros 5 usuários, primeiros 10 livros):")
print(df.iloc[:5, :10].to_string())
