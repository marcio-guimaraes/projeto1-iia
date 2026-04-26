"""
Catálogo de livros nacionais para o sistema de recomendação.
Cada livro possui 3 características: genero, periodo e estilo.
Avaliações: escala 1 a 5 (inteiros).
"""

LIVROS = [
    # id, titulo, autor, genero, periodo, estilo
    {"id": 1,  "titulo": "Dom Casmurro",                       "autor": "Machado de Assis",        "genero": "Romance",          "periodo": "Seculo XIX",      "estilo": "Realismo"},
    {"id": 2,  "titulo": "Memorias Postumas de Bras Cubas",    "autor": "Machado de Assis",        "genero": "Romance",          "periodo": "Seculo XIX",      "estilo": "Realismo"},
    {"id": 3,  "titulo": "Quincas Borba",                      "autor": "Machado de Assis",        "genero": "Romance",          "periodo": "Seculo XIX",      "estilo": "Realismo"},
    {"id": 4,  "titulo": "O Cortico",                          "autor": "Aloísio de Azevedo",      "genero": "Romance",          "periodo": "Seculo XIX",      "estilo": "Naturalismo"},
    {"id": 5,  "titulo": "Iracema",                            "autor": "José de Alencar",         "genero": "Romance",          "periodo": "Seculo XIX",      "estilo": "Romantismo"},
    {"id": 6,  "titulo": "O Guarani",                          "autor": "José de Alencar",         "genero": "Romance",          "periodo": "Seculo XIX",      "estilo": "Romantismo"},
    {"id": 7,  "titulo": "Senhora",                            "autor": "José de Alencar",         "genero": "Romance",          "periodo": "Seculo XIX",      "estilo": "Romantismo"},
    {"id": 8,  "titulo": "A Moreninha",                        "autor": "Joaquim Manuel de Macedo","genero": "Romance",          "periodo": "Seculo XIX",      "estilo": "Romantismo"},
    {"id": 9,  "titulo": "Triste Fim de Policarpo Quaresma",   "autor": "Lima Barreto",            "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Pre-Modernismo"},
    {"id": 10, "titulo": "Vidas Secas",                        "autor": "Graciliano Ramos",        "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 11, "titulo": "Sao Bernardo",                       "autor": "Graciliano Ramos",        "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 12, "titulo": "Angustia",                           "autor": "Graciliano Ramos",        "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 13, "titulo": "Grande Sertao: Veredas",             "autor": "João Guimarães Rosa",     "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 14, "titulo": "A Hora da Estrela",                  "autor": "Clarice Lispector",       "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 15, "titulo": "Perto do Coracao Selvagem",          "autor": "Clarice Lispector",       "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 16, "titulo": "Macunaima",                          "autor": "Mário de Andrade",        "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 17, "titulo": "Serafim Ponte Grande",               "autor": "Oswald de Andrade",       "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 18, "titulo": "O Quinze",                           "autor": "Rachel de Queiroz",       "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 19, "titulo": "Gabriela Cravo e Canela",            "autor": "Jorge Amado",             "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 20, "titulo": "Tereza Batista Cansada de Guerra",   "autor": "Jorge Amado",             "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 21, "titulo": "Capitaes da Areia",                  "autor": "Jorge Amado",             "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 22, "titulo": "A Pedra do Reino",                   "autor": "Ariano Suassuna",         "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Pos-Modernismo"},
    {"id": 23, "titulo": "Ensaio sobre a Cegueira",            "autor": "José Saramago",           "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Pos-Modernismo"},
    {"id": 24, "titulo": "A Selva",                            "autor": "Ferreira de Castro",      "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Realismo"},
    {"id": 25, "titulo": "A Batalha do Apocalipse",            "autor": "Eduardo Spohr",           "genero": "Fantasia",         "periodo": "Seculo XXI",      "estilo": "Epico"},
    {"id": 26, "titulo": "O Meu Pe de Laranja Lima",           "autor": "José Mauro de Vasconcelos","genero": "Romance",         "periodo": "Seculo XX",       "estilo": "Juvenil"},
    {"id": 27, "titulo": "A Bolsa Amarela",                    "autor": "Lygia Bojunga",           "genero": "Fábula",           "periodo": "Seculo XX",       "estilo": "Juvenil"},
    {"id": 28, "titulo": "Auto da Compadecida",                "autor": "Ariano Suassuna",         "genero": "Teatro",           "periodo": "Seculo XX",       "estilo": "Regionalismo"},
    {"id": 29, "titulo": "Morte e Vida Severina",              "autor": "João Cabral de Melo Neto","genero": "Poesia",           "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 30, "titulo": "Libertinagem",                       "autor": "Manuel Bandeira",         "genero": "Poesia",           "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 31, "titulo": "Alguma Poesia",                      "autor": "Carlos Drummond de Andrade","genero": "Poesia",         "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 32, "titulo": "A Rosa do Povo",                     "autor": "Carlos Drummond de Andrade","genero": "Poesia",         "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 33, "titulo": "Lira dos Vinte Anos",                "autor": "Álvares de Azevedo",      "genero": "Poesia",           "periodo": "Seculo XIX",      "estilo": "Romantismo"},
    {"id": 34, "titulo": "I-Juca-Pirama",                      "autor": "Gonçalves Dias",          "genero": "Poesia",           "periodo": "Seculo XIX",      "estilo": "Romantismo"},
    {"id": 35, "titulo": "Sagarana",                           "autor": "João Guimarães Rosa",     "genero": "Conto",            "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 36, "titulo": "A Terceira Margem do Rio",           "autor": "João Guimarães Rosa",     "genero": "Conto",            "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 37, "titulo": "Felicidade Clandestina",             "autor": "Clarice Lispector",       "genero": "Conto",            "periodo": "Seculo XX",       "estilo": "Modernismo"},
    {"id": 38, "titulo": "Os Melhores Contos de Dalton Trevisan","autor": "Dalton Trevisan",       "genero": "Conto",            "periodo": "Seculo XX",       "estilo": "Realismo"},
    {"id": 39, "titulo": "O Piromaniaco",                      "autor": "Murilo Rubião",           "genero": "Conto",            "periodo": "Seculo XX",       "estilo": "Magico-Realismo"},
    {"id": 40, "titulo": "Contos Gauchescos",                  "autor": "João Simões Lopes Neto",  "genero": "Conto",            "periodo": "Seculo XIX",      "estilo": "Regionalismo"},
    {"id": 41, "titulo": "O Homem que Calculava",              "autor": "Malba Tahan",             "genero": "Conto",            "periodo": "Seculo XX",       "estilo": "Didatico"},
    {"id": 42, "titulo": "Incidente em Antares",               "autor": "Érico Veríssimo",         "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Realismo"},
    {"id": 43, "titulo": "O Tempo e o Vento",                  "autor": "Érico Veríssimo",         "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Realismo"},
    {"id": 44, "titulo": "Cidade de Deus",                     "autor": "Paulo Lins",              "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Realismo"},
    {"id": 45, "titulo": "Estacao Carandiru",                  "autor": "Dráuzio Varella",         "genero": "Narrativa",        "periodo": "Seculo XX",       "estilo": "Documental"},
    {"id": 46, "titulo": "O Caso Morel",                       "autor": "Rubem Fonseca",           "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Policial"},
    {"id": 47, "titulo": "A Grande Arte",                      "autor": "Rubem Fonseca",           "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Policial"},
    {"id": 48, "titulo": "Agosto",                             "autor": "Rubem Fonseca",           "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Policial"},
    {"id": 49, "titulo": "Casa-Grande e Senzala",              "autor": "Gilberto Freyre",         "genero": "Nao-Ficcao",       "periodo": "Seculo XX",       "estilo": "Historico"},
    {"id": 50, "titulo": "O Povo Brasileiro",                  "autor": "Darcy Ribeiro",           "genero": "Nao-Ficcao",       "periodo": "Seculo XX",       "estilo": "Historico"},
    {"id": 51, "titulo": "Nao Veras Pais Nenhum",              "autor": "Ignácio de Loyola Brandão","genero": "Ficcao Cientifica","periodo": "Seculo XX",       "estilo": "Distopia"},
    {"id": 52, "titulo": "A Espinha Dorsal da Memoria",        "autor": "Bráulio Tavares",         "genero": "Ficcao Cientifica","periodo": "Seculo XX",       "estilo": "Distopia"},
    {"id": 53, "titulo": "Zero",                               "autor": "Ignácio de Loyola Brandão","genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Absurdismo"},
    {"id": 54, "titulo": "O Amanuense Belmiro",                "autor": "Cyro dos Anjos",          "genero": "Romance",          "periodo": "Seculo XX",       "estilo": "Existencialismo"},
    {"id": 55, "titulo": "O Ateneu",                           "autor": "Raul Pompéia",            "genero": "Romance",          "periodo": "Seculo XIX",      "estilo": "Naturalismo"},
]

# Mapeamento de IDs para facilitar buscas
LIVROS_POR_ID = {l["id"]: l for l in LIVROS}

# Características disponíveis
GENEROS = sorted(set(l["genero"] for l in LIVROS))
PERIODOS = sorted(set(l["periodo"] for l in LIVROS))
ESTILOS = sorted(set(l["estilo"] for l in LIVROS))

if __name__ == "__main__":
    print(f"Total de livros: {len(LIVROS)}")
    print(f"Gêneros: {GENEROS}")
    print(f"Períodos: {PERIODOS}")
    print(f"Estilos: {ESTILOS}")
