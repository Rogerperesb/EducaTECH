"""
models.py
Modelos de dados do Sistema Acadêmico 
------------------------------------------------------------
Define as classes principais utilizadas no sistema:
- Aluno: representa um estudante individual.
- Turma: representa um grupo de alunos.
------------------------------------------------------------"""

# Importa ferramentas para criar classes automáticas e tipadas
from dataclasses import dataclass, field
from typing import List


# === Classe Aluno ===
@dataclass
class Aluno:
    """
    Representa um aluno com nome, notas, média e status.
    Usada em todo o sistema para armazenar e manipular dados acadêmicos.
    """
    nome: str                                 # Nome completo do aluno
    notas: List[float] = field(default_factory=list)  # Lista de notas do aluno
    media: float = 0.0                        # Média calculada das notas
    status: str = "Em avaliação"              # Situação inicial do aluno


# === Classe Turma ===
@dataclass
class Turma:
    """
    Representa uma turma, identificada por um código (ex: 'ADS2025'),
    e que contém uma lista de alunos cadastrados.
    """
    codigo: str                               # Código ou nome da turma
    alunos: List[Aluno] = field(default_factory=list)  # Lista de objetos Aluno
