"""
storage.py
Módulo de persistência de dados do Sistema Acadêmico 
----------------------------------------------------------------
Responsável por salvar e carregar informações de alunos e turmas
em arquivos JSON. Também pode gerar relatórios automáticos.
Este módulo garante que os dados sejam mantidos mesmo após o
fechamento do programa (armazenamento permanente).
----------------------------------------------------------------"""

import json
from models import Aluno, Turma


# === Função para salvar dados no arquivo JSON ===
def salvar_json(dados, caminho_arquivo="dados.json"):

#Salva os dados fornecidos (dicionário com turmas e alunos) 
# em formato JSON no arquivo especificado."

    with open(caminho_arquivo, "w", encoding="utf-8") as f:
        json.dump(dados, f, indent=4, ensure_ascii=False)
    print(f"✅ Dados salvos em: {caminho_arquivo}")


# === Função para carregar dados do arquivo JSON ===
def carregar_json(caminho_arquivo="dados.json"):

    #Carrega os dados do arquivo JSON (se existir).
    #Caso o arquivo não exista, cria uma estrutura padrão vazia.

    try:
        with open(caminho_arquivo, "r", encoding="utf-8") as f:
            dados = json.load(f)
    except FileNotFoundError:

        # Caso o arquivo ainda não exista, cria estrutura base
        dados = {"alunos": [], "turmas": []}
        salvar_json(dados, caminho_arquivo)
        print("📂 Arquivo JSON não encontrado. Novo arquivo criado.")

    return dados


# === Função para converter objetos em formato JSON ===
def preparar_para_json(turmas):

    #Converte objetos do tipo Turma e Aluno em dicionários simples
    #(necessário antes de salvar no arquivo JSON).

    return {
        "turmas": [
            {
                 "codigo": turma.codigo,
                 "alunos": [
                    {
                        "nome": aluno.nome,
                        "notas": aluno.notas,
                        "media": aluno.media,
                        "status": aluno.status
                    }
                    for aluno in turma.alunos
                 ]
            }
            for turma in turmas
        ]
    }


# === Teste manual (executar no terminal) ===

if __name__ == "__main__":
    print("= Teste manual do módulo de armazenamento =")

    # Cria exemplo de turma e aluno
    aluno_exemplo = Aluno(nome="Gabriel", notas=[8.0, 7.5, 9.0], media=8.16, status="Aprovado")
    turma_exemplo = Turma(codigo="ADS2025", alunos=[aluno_exemplo])

    # Prepara os dados e salva no arquivo
    dados_json = preparar_para_json([turma_exemplo])
    salvar_json(dados_json)

    # Carrega e exibe o resultado
    dados_carregados = carregar_json()
    print("📘 Dados carregados do JSON:", dados_carregados)


