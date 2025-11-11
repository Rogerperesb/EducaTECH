"""
storage.py
Módulo de persistência de dados do Sistema Acadêmico 
---------------------------------------------------------------
Responsável por salvar e carregar informações de alunos, turmas e 
aulas em arquivo JSON e gerar automaticamente um resumo em TXT.
---------------------------------------------------------------"""

import json
import os

# === Função: carregar_json ===
def carregar_json(caminho: str):

    # Lê os dados de um arquivo JSON e devolve como dicionário.
    # Caso o arquivo não exista ou ocorra algum erro na leitura,
    # é retornada uma estrutura padrão com listas vazias.

    if not os.path.exists(caminho):
        return {"alunos": [], "turmas": [], "aulas": []}

    try:
        # Abre e lê o conteúdo do arquivo JSON
        with open(caminho, "r", encoding="utf-8") as f:
            dados = json.load(f)
            return dados
    except Exception as e:
        print(f"[ERRO] Falha ao carregar dados: {e}")
        # Retorna estrutura padrão em caso de falha
        return {"alunos": [], "turmas": [], "aulas": []}


# === Função: salvar_json ===
def salvar_json(dados, caminho: str):
  
   # Salva os dados em formato JSON e gera um resumo em TXT.
   # Também chama automaticamente a função gerar_resumo_txt()
   # após salvar com sucesso o arquivo JSON.

    try:
        # Grava o conteúdo (dados) em formato JSON
        with open(caminho, "w", encoding="utf-8") as f:
            json.dump(dados, f, indent=4, ensure_ascii=False)
        print("[OK] Dados salvos em JSON com sucesso!")

        # Gera o relatório de texto (resumo dos dados)
        gerar_resumo_txt(dados)

    except Exception as e:
        print(f"[ERRO] Falha ao salvar dados: {e}")


# === Função: gerar_resumo_txt ===
def gerar_resumo_txt(dados):
    
    """
    Cria um arquivo texto (dados_resumo.txt) com um resumo dos dados do sistema.
    O relatório contém informações sobre:
      - Alunos cadastrados (nome, notas, média e status)
      - Turmas existentes (código e quantidade de alunos)
      - Aulas registradas (data, conteúdo e turma associada)
    """
    try:
        with open("dados_resumo.txt", "w", encoding="utf-8") as f:
            # Cabeçalho do relatório
            f.write("========================================\n")
            f.write(" RELATÓRIO DE DADOS - SISTEMA ACADÊMICO\n")
            f.write("========================================\n\n")

            # --- Seção: Alunos ---
            f.write("=== ALUNOS CADASTRADOS ===\n")
            alunos = dados.get("alunos", [])
            if not alunos:
                f.write("Nenhum aluno cadastrado.\n")
            else:
                for aluno in alunos:
                    f.write(f"Nome: {aluno.get('nome', '---')}\n")
                    f.write(f"Notas: {aluno.get('notas', [])}\n")
                    f.write(f"Média: {aluno.get('media', 0):.2f}\n")
                    f.write(f"Status: {aluno.get('status', '---')}\n")
                    f.write("-" * 40 + "\n")

            # --- Seção: Turmas ---
            f.write("\n=== TURMAS CADASTRADAS ===\n")
            turmas = dados.get("turmas", [])
            if not turmas:
                f.write("Nenhuma turma cadastrada.\n")
            else:
                for turma in turmas:
                    f.write(f"Código: {turma.get('codigo', '---')}\n")
                    f.write(f"Alunos na turma: {len(turma.get('alunos', []))}\n")
                    f.write("-" * 40 + "\n")

            # --- Seção: Aulas ---
            f.write("\n=== AULAS REGISTRADAS ===\n")
            aulas = dados.get("aulas", [])
            if not aulas:
                f.write("Nenhuma aula registrada.\n")
            else:
                for aula in aulas:
                    f.write(f"Data: {aula.get('data', '---')}\n")
                    f.write(f"Conteúdo: {aula.get('conteudo', '---')}\n")
                    f.write(f"Turma: {aula.get('turma', {}).get('codigo', '---')}\n")
                    f.write("-" * 40 + "\n")

        print("[OK] Resumo salvo em dados_resumo.txt!")
    except Exception as e:
        print(f"[ERRO] Falha ao gerar arquivo TXT: {e}")


# === Teste manual (executar isoladamente no terminal) ===
if __name__ == "__main__":
    print("= Teste manual do módulo de armazenamento =")

    # Estrutura de exemplo (simulando dados reais)
    dados_teste = {
        "alunos": [
            {"nome": "Gabriel", "notas": [8.0, 7.5, 9.0], "media": 8.16, "status": "Aprovado"}
        ],
        "turmas": [
            {"codigo": "ADS2025", "alunos": [{"nome": "Gabriel"}]}
        ],
        "aulas": [
            {"data": "2025-10-04", "conteudo": "Estruturas de Dados", "turma": {"codigo": "ADS2025"}}
        ]
    }

    # Testa o salvamento e a geração do relatório
    salvar_json(dados_teste, "dados.json")

    # Testa o carregamento
    dados_carregados = carregar_json("dados.json")
    print("\n📘 Dados carregados com sucesso:")
    print(dados_carregados)
