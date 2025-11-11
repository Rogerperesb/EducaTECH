// avg.c
// --------------------------------------------------------------
// Módulo em linguagem C responsável por cálculos de média
// e classificação do desempenho do aluno.
// Este código é compilado como uma DLL (avg.dll) para ser usado
// dentro do Python via ctypes (no arquivo c_wrapper.py).
// --------------------------------------------------------------

#include <stdio.h>  // Inclui funções básicas de entrada e saída

// --------------------------------------------------------------
// Função: calcular_media
// Parâmetros:
// - notas[] : vetor com as notas do aluno
// - n       : quantidade de notas
// Retorno:
// - média aritmética das notas (float)
// --------------------------------------------------------------

float calcular_media(float notas[], int n) {
    float soma = 0.0;  // Variável para acumular a soma das notas

    // Percorre todas as notas somando seus valores
    for (int i = 0; i < n; i++)
        soma += notas[i];

    // Retorna a média (soma dividida pela quantidade)
    return soma / n;
}

// --------------------------------------------------------------
// Função: classificar_media
// Parâmetros:
// - media : valor da média calculada
// Retorno:
// - Texto (const char*) indicando o status do aluno
// --------------------------------------------------------------

const char* classificar_media(float media) {
    if (media >= 8.0)
        return "Aprovado!";  // Caso a média seja excelente
    else if (media >= 5.0)
        return "Muito bem, foi APROVADO.";  // Caso esteja na média
    else
        return "Reprovado";  // Caso a média seja insuficiente
}
