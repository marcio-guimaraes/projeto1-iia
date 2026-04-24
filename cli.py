"""
cli.py
======
Interface de linha de comando para o sistema de recomendação de livros.

Fluxo:
  1. Exibe catálogo e pede que o usuário avalie alguns livros.
  2. Executa os três modelos (conteúdo, colaborativo, híbrido).
  3. Exibe as recomendações formatadas no terminal.
"""

import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from dados.livros import LIVROS, GENEROS, PERIODOS, ESTILOS
from recomendador import Recomendador

# ---------------------------------------------------------------------------
# Utilitários de terminal
# ---------------------------------------------------------------------------

_RESET  = "\033[0m"
_BOLD   = "\033[1m"
_CYAN   = "\033[36m"
_GREEN  = "\033[32m"
_YELLOW = "\033[33m"
_BLUE   = "\033[34m"
_RED    = "\033[31m"
_DIM    = "\033[2m"

def _h(texto: str, cor: str = _CYAN) -> str:
    return f"{_BOLD}{cor}{texto}{_RESET}"

def _linha(char: str = "─", n: int = 70) -> str:
    return char * n

def _input_int(prompt: str, minv: int, maxv: int) -> int:
    while True:
        try:
            v = int(input(prompt))
            if minv <= v <= maxv:
                return v
            print(f"  {_RED}Digite um número entre {minv} e {maxv}.{_RESET}")
        except (ValueError, EOFError):
            print(f"  {_RED}Entrada inválida.{_RESET}")

def _input_yn(prompt: str) -> bool:
    while True:
        r = input(prompt).strip().lower()
        if r in ("s", "sim", "y", "yes", ""):
            return True
        if r in ("n", "nao", "não", "no"):
            return False
        print(f"  {_RED}Responda s ou n.{_RESET}")

# ---------------------------------------------------------------------------
# Exibição do catálogo
# ---------------------------------------------------------------------------

def exibir_catalogo(livros: list, cabecalho: str = "CATÁLOGO", pagina: int = 20):
    """Exibe os livros em páginas de `pagina` itens."""
    total = len(livros)
    inicio = 0
    while inicio < total:
        fim = min(inicio + pagina, total)
        print(f"\n{_h(f'  {cabecalho} — LIVROS {inicio+1} a {fim} de {total}')}")
        print("  " + _linha())
        print(f"  {'ID':>4}  {'TITULO':<42} {'GENERO':<20} {'PERIODO':<12} {'ESTILO'}")
        print("  " + _linha())
        for l in livros[inicio:fim]:
            print(
                f"  {_YELLOW}{l['id']:>4}{_RESET}"
                f"  {l['titulo']:<42}"
                f"  {_DIM}{l['genero']:<20}{_RESET}"
                f"  {l['periodo']:<12}"
                f"  {_DIM}{l['estilo']}{_RESET}"
            )
        print("  " + _linha())
        inicio = fim
        if inicio < total:
            continuar = _input_yn(f"  Ver mais livros? [S/n]: ")
            if not continuar:
                break

# ---------------------------------------------------------------------------
# Coleta de avaliações
# ---------------------------------------------------------------------------

def coletar_historico() -> dict:
    """Pede ao usuário que avalie de 3 a 15 livros."""
    print(f"\n{_h('  AVALIE ALGUNS LIVROS', _GREEN)}")
    print(f"  {_DIM}Dê uma nota de 1 (odiei) a 5 (amei) para os livros que conhece.{_RESET}")
    print(f"  {_DIM}Você pode pular um livro pressionando Enter.{_RESET}\n")

    historico = {}
    n_avaliados = 0

    for livro in LIVROS:
        print(
            f"  [{_YELLOW}{livro['id']:>3}{_RESET}] {livro['titulo']}"
            f"  {_DIM}({livro['genero']}, {livro['estilo']}){_RESET}"
        )
        try:
            entrada = input("        Nota (1-5) ou Enter para pular: ").strip()
        except EOFError:
            break
        if entrada == "":
            continue
        try:
            nota = int(entrada)
            if 1 <= nota <= 5:
                historico[livro["id"]] = nota
                n_avaliados += 1
                if n_avaliados >= 15:
                    print(f"\n  {_GREEN}Você avaliou 15 livros. Prosseguindo...{_RESET}")
                    break
        except ValueError:
            pass  # pula entradas inválidas

    return historico

# ---------------------------------------------------------------------------
# Exibição de recomendações
# ---------------------------------------------------------------------------

def exibir_recomendacoes(df, titulo: str, col_score: str):
    print(f"\n{_h(f'  {titulo}', _GREEN)}")
    print("  " + _linha())
    if df.empty:
        print(f"  {_RED}Nenhuma recomendação disponível.{_RESET}")
        return
    for _, row in df.iterrows():
        score_str = f"{float(row[col_score]):.3f}" if col_score in row.index else ""
        print(
            f"  {_YELLOW}{'★':2}{_RESET}"
            f"  {row['titulo']:<42}"
            f"  {_DIM}{row['genero']:<20}{_RESET}"
            f"  {_CYAN}{row['estilo']:<18}{_RESET}"
            f"  score: {_GREEN}{score_str}{_RESET}"
        )
    print("  " + _linha())

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    # Cabeçalho
    print("\n" + _linha("═"))
    print(_h("       SISTEMA DE RECOMENDAÇÃO DE LIVROS NACIONAIS", _CYAN))
    print(_h("       UnB — Introdução à Inteligência Artificial — 2026/1", _DIM))
    print(_linha("═"))

    # Carrega o recomendador
    print(f"\n  {_DIM}Carregando modelos...{_RESET}", end="", flush=True)
    rec = Recomendador()
    print(f"  {_GREEN}OK{_RESET}")

    while True:
        print(f"\n  {_h('MENU PRINCIPAL', _BLUE)}")
        print("  1. Ver catálogo completo")
        print("  2. Avaliar livros e receber recomendações")
        print("  3. Buscar livros por gênero / estilo")
        print("  4. Sair")
        opcao = _input_int("\n  Opção: ", 1, 4)

        if opcao == 1:
            exibir_catalogo(LIVROS)

        elif opcao == 2:
            # Filtra o catálogo se o usuário quiser
            print(f"\n  {_DIM}Exibir catálogo antes de avaliar? [S/n]{_RESET}", end=" ")
            mostrar = _input_yn("")
            if mostrar:
                exibir_catalogo(LIVROS, pagina=15)

            historico = coletar_historico()

            if not historico:
                print(f"\n  {_RED}Nenhum livro avaliado. Tente novamente.{_RESET}")
                continue

            curtidos, _ = rec.obter_perfil_usuario(historico)

            print(f"\n  {_DIM}Gerando recomendações...{_RESET}")

            # Modelo de conteúdo
            df_cont = rec.recomendar_conteudo(curtidos, top_n=5)
            exibir_recomendacoes(df_cont, "RECOMENDAÇÕES — Baseadas em Conteúdo (TF-IDF)", "score_similaridade")

            # Modelo colaborativo
            df_col = rec.recomendar_colaborativo(historico, top_n=5)
            exibir_recomendacoes(df_col, "RECOMENDAÇÕES — Filtragem Colaborativa (kNN)", "nota_prevista")

            # Híbrido
            df_hib = rec.recomendar_hibrido(curtidos, historico, top_n=5)
            exibir_recomendacoes(df_hib, "RECOMENDAÇÕES — Modelo Híbrido", "score_final")

        elif opcao == 3:
            print(f"\n  {_h('BUSCA POR FILTRO', _BLUE)}")
            print("\n  Gêneros disponíveis:")
            for i, g in enumerate(GENEROS, 1):
                print(f"    {i}. {g}")
            print(f"    {len(GENEROS)+1}. (ignorar)")
            g_op = _input_int("  Escolha o gênero: ", 1, len(GENEROS)+1)

            genero_filtro = GENEROS[g_op - 1] if g_op <= len(GENEROS) else None

            print("\n  Estilos disponíveis:")
            for i, e in enumerate(ESTILOS, 1):
                print(f"    {i}. {e}")
            print(f"    {len(ESTILOS)+1}. (ignorar)")
            e_op = _input_int("  Escolha o estilo: ", 1, len(ESTILOS)+1)
            estilo_filtro = ESTILOS[e_op - 1] if e_op <= len(ESTILOS) else None

            filtrados = [l for l in LIVROS
                         if (genero_filtro is None or l["genero"] == genero_filtro)
                         and (estilo_filtro is None or l["estilo"] == estilo_filtro)]

            if not filtrados:
                print(f"\n  {_RED}Nenhum livro encontrado com esses filtros.{_RESET}")
            else:
                exibir_catalogo(filtrados, f"LIVROS FILTRADOS ({len(filtrados)} encontrados)")

        else:
            print(f"\n  {_GREEN}Até logo!{_RESET}\n")
            break

if __name__ == "__main__":
    main()
