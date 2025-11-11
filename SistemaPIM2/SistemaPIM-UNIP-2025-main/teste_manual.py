import c_wrapper       # Importa o módulo que faz a ponte entre Python e o código C (avg.dll)
import ai_module       # Importa o módulo de inteligência artificial que gera insights sobre o aluno

print("=== TESTE MANUAL DO CÁLCULO ACADÊMICO ===")

# Loop principal — permite testar várias vezes sem reiniciar o programa
while True:
    # Pede que o usuário digite as notas separadas por vírgula
    entrada = input("Notas (ex: 7,8,9) ou ENTER para sair: ").strip()
    
    # Se o usuário apertar ENTER sem digitar nada, o programa encerra
    if not entrada:
        break

    # Converte a entrada (string) em uma lista de floats
    # Exemplo: "7,8,9" → [7.0, 8.0, 9.0]
    notas = [float(n.strip()) for n in entrada.split(",") if n.strip()]

    # Cria um "aluno" fictício com essas notas
    aluno = {"nome": "Teste", "notas": notas}

    # Envia os dados para o módulo C calcular a média e classificar o aluno
    aluno = c_wrapper.processar_aluno_c(aluno)

    # Pede ao módulo de IA gerar um insight sobre o desempenho do aluno
    aluno["insight"] = ai_module.gerar_insight(aluno)

    # Mostra os resultados formatados no terminal
    print(f"Média: {aluno['media']:.2f}")
    print(f"Status (C): {aluno['status']}")
    print(f"Insight (IA): {aluno['insight']}\n")

