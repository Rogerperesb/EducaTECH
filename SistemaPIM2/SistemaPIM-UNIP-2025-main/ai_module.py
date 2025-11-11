"""
ai_module.py
Módulo de "inteligência" acadêmica do PIM
------------------------------------------------
Responsável por gerar feedback textual com base
na média do aluno.
------------------------------------------------"""

#Gera uma mensagem automática baseada na média.

def gerar_feedback(media):
    if media >= 8:
        return("Aprovado, Excelente desempenho!")
    elif media >= 6:
        return("Bom, mas pode melhorar.")
    elif media >= 5:
        return("Atenção! Revise conteúdos para melhorar sua média.")
    else:
        return("Desempenho insuficiente, precisa reforçar os estudos.")

#Gera um insight textual com base nos dados do aluno,
#Esta função é usada pelo main.py para complementar os cálculos.

def gerar_insight(aluno):

    media = aluno.get("media", 0)
    return gerar_feedback(media)


# === testes unitários (executar diretamente no terminal) ===
if __name__ == "__main__":
    print("= Teste manual do módulo de IA (Feedback) =")
    
    while True:
        try:
            media_str = input("Digite a média do aluno: ").strip()
            if media_str == "":
                break

            media = float(media_str)
            feedback = gerar_feedback(media)
            print(f"Sua Média: {media:.2f} → Feedback: {feedback}\n")

        except ValueError:
            print("⚠️ Valor inválido! Digite um número (ex: 7.5)")
