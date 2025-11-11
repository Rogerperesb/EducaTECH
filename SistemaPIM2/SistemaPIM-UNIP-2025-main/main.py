"""
main.py - Interface de terminal (menu) do sistema acadêmico
Parte integrante do PIM Acadêmico

Permite gerenciar alunos e turmas via menu de texto.
Os dados são persistidos em JSON (storage.py)
e a lógica de cálculo usa o módulo C (c_wrapper.py).
Insights automáticos são gerados pela IA (ai_module.py).
"""

# Importando todos os módulos essenciais para o sistema funcionar:
import sys #Comandos do sistema
from models import Aluno, Turma #Estrutura de dados dos alunos e turmas
import storage #Salvar/carregar dados do JSON
import c_wrapper #Calcular média via código C
import ai_module #Gerar feedback automático do aluno
# from SistemaEduFlow import scripts #Scripts adicionais do sistema

# Caminho do arquivo de dados
DB_FILE = "dados.json"

# ---------------------------------------------------------
# Funções auxiliares
# ---------------------------------------------------------
def pausar():
    input("\nPressione ENTER para continuar...")


def listar_alunos(alunos):
    if not alunos:
        print("Nenhum aluno cadastrado.")
    else:
        for i, a in enumerate(alunos, 1):
            print(f"{i}. {a.get('nome')} | Média: {a.get('media', 0):.2f} | Status: {a.get('status', '---')}")


def listar_turmas(turmas):
    if not turmas:
        print("Nenhuma turma cadastrada.")
    else:
        for i, t in enumerate(turmas, 1):
            print(f"{i}. Turma: {t.get('codigo')} | {len(t.get('alunos', []))} alunos")


# ---------------------------------------------------------
# Menu de Alunos
# ---------------------------------------------------------
def menu_alunos(db):
    while True:
        print("\n=== MENU DE ALUNOS ===")
        print("1. Listar alunos")
        print("2. Cadastrar novo aluno")
        print("3. Calcular média (C)")
        print("0. Voltar ao menu principal")
        op = input("Escolha: ")

        if op == "1":
            listar_alunos(db["alunos"])
            pausar()

        elif op == "2":
            nome = input("Nome do aluno: ").strip()
            matricula = input("Matrícula: ").strip()
            curso = input("Curso: ").strip()
            notas = input("Notas separadas por vírgula (ex: 7,8,6): ").split(",")
            notas = [float(n.strip()) for n in notas if n.strip()]

            # Envia para o módulo C calcular média
            aluno_dict = {"nome": nome, "matricula": matricula, "curso": curso, "notas": notas}
            aluno_dict = c_wrapper.processar_aluno_c(aluno_dict)

            # Gera insights com IA
            aluno_dict["insight"] = ai_module.gerar_insight(aluno_dict)

            db["alunos"].append(aluno_dict)
            storage.salvar_json(db, DB_FILE)
            print(f"\nAluno {nome} cadastrado com sucesso!")
            print(f"Média: {aluno_dict['media']:.2f} | Status: {aluno_dict['status']}")
            print(f"Insight da IA: {aluno_dict['insight']}")
            pausar()

        elif op == "3":
            listar_alunos(db["alunos"])
            idx = int(input("Escolha o número do aluno: ")) - 1
            if 0 <= idx < len(db["alunos"]):
                aluno = db["alunos"][idx]
                aluno = c_wrapper.processar_aluno_c(aluno)
                aluno["insight"] = ai_module.gerar_insight(aluno)
                db["alunos"][idx] = aluno
                storage.salvar_json(db, DB_FILE)
                print(f"\nRecalculado: {aluno['nome']} | Média: {aluno['media']:.2f} | Status: {aluno['status']}")
                print(f"Insight da IA: {aluno['insight']}")
            else:
                print("Aluno inválido!")
            pausar()

        elif op == "0":
            break
        else:
            print("Opção inválida!")


# ---------------------------------------------------------
# Menu de Turmas
# ---------------------------------------------------------
def menu_turmas(db):
    while True:
        print("\n=== MENU DE TURMAS ===")
        print("1. Listar turmas")
        print("2. Criar nova turma")
        print("3. Adicionar aluno a turma")
        print("0. Voltar ao menu principal")
        op = input("Escolha: ")

        if op == "1":
            listar_turmas(db["turmas"])
            pausar()

        elif op == "2":
            codigo = input("Código da turma: ").strip()
            disciplina = input("Disciplina: ").strip()
            nova_turma = {"codigo": codigo, "disciplina": disciplina, "alunos": []}
            db["turmas"].append(nova_turma)
            storage.salvar_json(db, DB_FILE)
            print(f"Turma {codigo} criada com sucesso!")
            pausar()

        elif op == "3":
            if not db["alunos"] or not db["turmas"]:
                print("Cadastre ao menos um aluno e uma turma primeiro.")
                pausar()
                continue

            listar_turmas(db["turmas"])
            tidx = int(input("Escolha o número da turma: ")) - 1
            listar_alunos(db["alunos"])
            aidx = int(input("Escolha o número do aluno: ")) - 1

            if 0 <= tidx < len(db["turmas"]) and 0 <= aidx < len(db["alunos"]):
                db["turmas"][tidx]["alunos"].append(db["alunos"][aidx])
                storage.salvar_json(db, DB_FILE)
                print(f"Aluno adicionado à turma {db['turmas'][tidx]['codigo']} com sucesso!")
            else:
                print("Opção inválida!")
            pausar()

        elif op == "0":
            break
        else:
            print("Opção inválida!")


# ---------------------------------------------------------
# Programa principal
# ---------------------------------------------------------
def main():
    print("=== SISTEMA ACADÊMICO PIM UNIP ===")

    db = storage.carregar_json(DB_FILE)
    db.setdefault("alunos", [])
    db.setdefault("turmas", [])

    while True:
        print("\n=== MENU PRINCIPAL ===")
        print("1. Gerenciar alunos")
        print("2. Gerenciar turmas")
        print("0. Sair")
        op = input("Escolha: ")

        if op == "1":
            menu_alunos(db)
        elif op == "2":
            menu_turmas(db)
        elif op == "0":
            print("\nSaindo... Dados salvos.")
            storage.salvar_json(db, DB_FILE)
            sys.exit(0)
        else:
            print("Opção inválida!")


if __name__ == "__main__":
    main()

