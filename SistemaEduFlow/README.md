# 🚀 EducaTECH - Sistema de Gestão Acadêmica Fullstack (PIM UNIP)

![Status](https://img.shields.io/badge/Status-Completo%20(v1.0)-success)
![license](https://img.shields.io/badge/License-MIT-blue.svg)

**EducaTECH** é um projeto fullstack que demonstra a integração de um frontend web moderno (`SistemaEduFlow`) com um backend robusto em Python (`SistemaPIM-UNIP-2025-main`). O sistema gerencia alunos, turmas, atividades e notas, com o processamento de dados (cálculo de médias e classificação) sendo delegado a um módulo de alta performance escrito em **Linguagem C**.

## 🏛️ Arquitetura do Sistema

O projeto é dividido em dois componentes principais que se comunicam via API REST:

1.  **`SistemaEduFlow` (Frontend):** A interface do usuário (UI) construída com HTML, CSS e JavaScript. É por onde professores e alunos interagem com o sistema.
2.  **`SistemaPIM-UNIP-2025-main` (Backend):** O servidor em Python (Flask) que recebe os dados, os processa (usando o módulo C), gera insights (com o `ai_module`) e os persiste em disco (`dados.json` e `dados_resumo.txt`).

### Fluxo de Sincronização de Dados

```
  [Frontend (sistema.html)]            [Backend (server.py)]
           |                                     |
(1) Usuário clica em "Sincronizar"         |
           |----(POST /api/sync com JSON)--->|
           |                                | (2) Flask recebe os dados
           |                                |----(c_wrapper.py)----> [Módulo C (avg.dll)]
           |                                |                       |   (3) Calcula Média
           |                                |<---(Média, Status)----|       e Status
           |                                |
           |                                | (4) ai_module.py gera "Insight"
           |                                |
           |                                | (5) storage.py salva "dados.json"
           |                                |      e "dados_resumo.txt"
           |                                |
           |<----(JSON {Sucesso})------------| (6) Resposta 200 OK
```

## ✨ Funcionalidades Principais

### 🖥️ Frontend (SistemaEduFlow)

* **Autenticação de Papéis:** Login separado para Professores e Alunos, com interfaces adaptativas.
* **Gestão de Professores:** CRUD completo (Criar, Ler, Editar, Deletar) para Turmas, Alunos e Atividades.
* **Portal do Aluno:** Permite aos alunos entregar atividades e visualizar suas notas e feedbacks.
* **Bot Auxiliar:** Uma ferramenta proativa para professores que analisa os dados e gera insights sobre:
    * Alunos em risco (média baixa).
    * Sumário de desempenho por turma.
    * Alertas de atividades atrasadas.
* **🌳 Widget de Sustentabilidade:** Um painel no dashboard que calcula e exibe uma estimativa de folhas de papel economizadas pelo uso do sistema digital.
* **Persistência Local:** Utiliza o `localStorage` do navegador para salvar todos os dados, permitindo que a aplicação seja usada offline e os dados persistam ao fechar o navegador.

### 🐍 Backend (SistemaPIM-UNIP-2025-main)

* **API REST:** Um servidor Flask (`server.py`) com CORS configurado que expõe o endpoint `/api/sync` para receber dados do frontend.
* **Integração C/Python:** O `c_wrapper.py` usa `ctypes` para carregar dinamicamente a biblioteca `avg.dll` (compilada em C) e chamar suas funções de cálculo.
* **Cálculo de Performance:** O módulo `avg.c` contém a lógica em C para `calcular_media` e `classificar_media` (Aprovado/Reprovado).
* **Robustez (Fallback):** Se a `avg.dll` falhar, o `c_wrapper.py` executa automaticamente funções de *fallback* em Python puro para garantir que o sistema não pare.
* **Geração de Insights:** O `ai_module.py` fornece feedback textual simples (ex: "Excelente desempenho!") com base na média do aluno.
* **Persistência de Dados:** O `storage.py` salva os dados processados em `dados.json` e gera automaticamente um relatório legível em `dados_resumo.txt`.

## 🛠️ Stack de Tecnologias

| Área | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Frontend** | HTML5 / CSS3 | Estrutura e estilo da interface web. |
| **Frontend** | JavaScript (ES6+) | Lógica da aplicação, manipulação do DOM e `localStorage`. |
| **Backend** | Python 3 | Linguagem principal do servidor. |
| **Backend** | Flask | Micro-framework para criação da API REST (`server.py`). |
| **Backend** | Flask-CORS | Habilita a comunicação cross-origin entre o frontend e o backend. |
| **Core** | Linguagem C | Módulo de performance (`avg.c`) para cálculos matemáticos. |
| **Integração**| `ctypes` (Python) | Biblioteca nativa do Python para carregar e chamar a `.dll` do C. |
| **Visualização** | Tkinter | Usado para a GUI de visualização dos dados do backend (`gui.py`). |
| **DevTools** | Git & GitHub | Controle de versão. |

## 🚀 Como Executar o Sistema Integrado

Siga os passos para rodar o projeto completo localmente.

### 1. Pré-requisitos Iniciais

* **Python 3.x** instalado.
* **Compilador C (MinGW)**: Necessário para compilar o `avg.c`. Certifique-se de que o `gcc` está no PATH do seu sistema.

---

### 2. Dependências do Backend (Python) - OBRIGATÓRIO

Para que o `server.py` funcione, ele precisa de duas bibliotecas essenciais do ecossistema Python. Você deve instalá-las usando o `pip` (gerenciador de pacotes do Python).

Abra seu terminal (CMD, PowerShell ou Git Bash) e execute o comando:

```bash
pip install Flask Flask-CORS
```

#### Por que precisamos destas bibliotecas?

* **`Flask`**
    * **O que é?** É o "motor" do seu servidor backend. É um *micro-framework* web leve e poderoso.
    * **Por que usamos?** O Python, por si só, não sabe como "ouvir" a internet. O Flask é a biblioteca que permite ao seu script `server.py` se transformar em um servidor web. Ele é responsável por:
        1.  **"Ouvir"** em uma porta específica (no seu caso, `http://127.0.0.1:5000`).
        2.  **Criar rotas (endpoints)**, como a rota `/api/sync`.
        3.  **Receber requisições** (como o `POST` enviado pelo seu frontend).
        4.  **Enviar respostas** (como o `jsonify({"mensagem": "Sucesso!"})`).
    * *Sem o Flask, seu `server.py` é apenas um script comum. Com o Flask, ele se torna uma API.*

* **`Flask-CORS`**
    * **O que é?** É uma extensão do Flask que gerencia o **CORS** (Cross-Origin Resource Sharing).
    * **Por que usamos? (Extremamente importante)** Por padrão, os navegadores modernos têm uma política de segurança rígida: um site só pode fazer requisições de API para o **mesmo domínio (origem)** de onde ele foi carregado.
    * **O Problema:** Seu frontend (`sistema.html`) roda em uma origem (ex: `file://` ou `http://127.0.0.1:5500`) e seu backend (`server.py`) roda em *outra* (`http://127.0.0.1:5000`).
    * **A Solução:** Sem o `Flask-CORS`, o navegador **bloquearia** a requisição do `scripts.js` para o `server.py`, e você veria um erro de "CORS Policy" no console. Ao adicionar `CORS(app)`, o seu servidor passa a enviar um "cabeçalho" (header) especial que diz ao navegador: *"Eu autorizo o site `127.0.0.1:5500` a fazer requisições para mim. Está tudo bem."*

---

### 3. Compilar o Módulo C

Abra um terminal na pasta `SistemaPIM-UNIP-2025-main/c_modules` e compile o arquivo C para uma DLL:

```bash
# Navegue até a pasta
cd PIM2/SistemaPIM2/SistemaPIM-UNIP-2025-main/c_modules

# Compile o código C
gcc -shared -o avg.dll avg.c
```
(Isso criará o arquivo `avg.dll` que o `c_wrapper.py` irá carregar).

### 4. Iniciar o Servidor Backend (Python)

Em um terminal, navegue até a pasta `SistemaPIM-UNIP-2025-main` e execute o servidor Flask:

```bash
# Navegue até a pasta
cd PIM2/SistemaPIM2/SistemaPIM-UNIP-2025-main

# Inicie o servidor
python server.py
```
O terminal deve mostrar que o servidor está rodando em `http://127.0.0.1:5000`.

### 5. Iniciar o Frontend (JavaScript)

Abra o arquivo `PIM2/SistemaEduFlow/sistema.html` diretamente no seu navegador.

* **Login (Exemplo):**
    * **Usuário:** `prof@unip.br`
    * **Senha:** `123456`

### 6. Sincronizar e Visualizar

1.  **No Site (Frontend):** Use o sistema para criar alunos, turmas e dar notas.
2.  Clique no botão **"Sincronizar com Backend (PIM)"**.
3.  O alerta `Sucesso!` deve aparecer no site.
4.  **No Backend:** Verifique o `dados.json` e o `dados_resumo.txt`; eles estarão atualizados com os dados do site.

### 7. (Opcional) Visualizar com a GUI Tkinter

Você também pode rodar a interface gráfica antiga do backend (que agora serve como um visualizador de dados) para ver os dados sincronizados.

```bash
# Em um NOVO terminal, na pasta SistemaPIM-UNIP-2025-main
python gui.py
```

## ⚖️ Licença

Este projeto é distribuído sob a Licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---
*Copyright (c) 2025 Rogerperesb*