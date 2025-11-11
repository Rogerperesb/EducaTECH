10# 🧠 Sistema PIM – Integração com Frontend Web

## 📌 Visão Geral

O **Sistema PIM** evoluiu de uma aplicação **standalone em Python** (executada via terminal ou GUI) para um **backend robusto**, capaz de se comunicar com um **frontend web moderno** — o **SistemaEduFlow**.

Agora, a gestão de alunos, turmas e atividades é feita diretamente pela interface web, enquanto o backend em Python realiza o **processamento, armazenamento e análise de dados**.  
A comunicação entre ambos ocorre por meio de uma **API Flask**.

---

## ⚙️ Estrutura do Projeto

### 🧩 Novo Módulo: `server.py` — *O Coração da Integração*

- **Framework:** [Flask](https://flask.palletsprojects.com/)  
- **Função principal:** Criação da API REST que serve de ponte entre o frontend e o backend.
- **Endpoint principal:** `/api/sync`

#### 🔁 Processo de sincronização:
1. O servidor escuta requisições do frontend (SistemaEduFlow).  
2. Ao receber um `POST`, lê um JSON com listas de alunos e turmas.  
3. Cada aluno é processado com:
   - `c_wrapper.py` → cálculo de média/status.
   - `ai_module.py` → geração de feedback automático.
4. O `storage.py` salva todos os dados em `dados.json`, substituindo os antigos.

#### 🌐 Suporte a CORS
- Implementado com **Flask-CORS** para permitir a comunicação entre navegador e servidor Python com segurança.

---

### 🧮 Módulo `c_wrapper.py` — *Mais Robusto e Portátil*

- **Carregamento Dinâmico:**  
  Detecta automaticamente o sistema operacional e localiza a biblioteca `avg.dll`.
- **Fallback Automático:**  
  Caso a DLL falhe ou não exista, o módulo usa funções Python nativas (`calcular_media_py` e `classificar_media_py`), garantindo a continuidade do sistema.

---

### 💾 Módulo `storage.py` — *Simplificação e Eficiência*

- **Otimizado** para salvar e carregar diretamente estruturas JSON.  
- **Geração automática de relatórios:**  
  Ao salvar `dados.json`, o sistema também cria `dados_resumo.txt`, mantendo os relatórios sempre atualizados.

---

### 🖥️ Módulo `gui.py` — *Interface Gráfica Atualizada*

- **Compatibilidade de Dados:**  
  Passou a ler os dados como dicionários (`aluno.get('nome')`), pois `dados.json` é a fonte principal.
- **Nova Coluna:**  
  Exibe o campo **“Feedback da IA”** com insights gerados durante a sincronização.

---

### ✨ Funcionalidades do Frontend (`SistemaEduFlow`)

O frontend web, desenvolvido com HTML, CSS e JavaScript (`scripts.js`, `styles.css`), oferece a interface principal para interação do usuário e inclui as seguintes funcionalidades chave:

1.  **Autenticação Segura:**
    * Login separado para professores e alunos usando `sessionStorage` para manter a sessão ativa apenas enquanto o navegador está aberto.
    * Interface adaptativa que exibe menus e opções diferentes com base no `role` do usuário (`professor` ou `aluno`).

2.  **Gestão Académica (Professor):**
    * CRUD completo (Criar, Ler, Atualizar, Deletar) para Turmas, Alunos e Atividades.
    * Criação automática de logins para novos alunos.
    * Atribuição automática de "entregas pendentes" ao criar atividades para uma turma.
    * Interface para avaliação de entregas com notas e feedback.

3.  **Portal do Aluno:**
    * Visualização de atividades pendentes ("Minhas Atividades").
    * Funcionalidade para "Entregar" atividades, mudando o status para 'Entregue'.
    * Consulta de notas e feedbacks do professor ("Minhas Notas").

4.  **Relatórios e Sincronização:**
    * Geração de relatórios HTML de alunos com médias e faltas (`gerarRelatorio`).
    * Botão para sincronizar os dados do frontend com o backend Python (`sincronizarComPim`), enviando os dados para a API Flask (`/api/sync`).

5.  **Bot Auxiliar (Professor):**
    * Ferramenta proativa que analisa os dados atuais (`runBotAnalysis`) e gera insights sobre:
        * Alunos em risco (média baixa).
        * Sumário de desempenho por turma.
        * Alertas de atividades atrasadas.
        * Lembretes de atividades próximas do vencimento.

6.  **🌳 Widget de Sustentabilidade (Professor):**
    * **Visão Geral:** Um card no "Dashboard" do professor exibe uma estimativa de folhas de papel economizadas pelo uso do sistema digital.
    * **Lógica de Cálculo:** A função `loadStats` soma o número de alunos, turmas, atividades, entregas (status 'Entregue' ou 'Avaliado') e relatórios gerados (com peso 1) para calcular o total.
    * **Persistência:** O contador de relatórios (`relatoriosGeradosCount`) é salvo no `localStorage` através das funções `saveData` e `loadData`, garantindo que a contagem persiste entre sessões. A função `gerarRelatorio` incrementa este contador.
    * **Estilização:** O widget possui uma classe CSS `.sustainability` em `styles.css` para personalização visual.

7.  **Persistência de Dados (Frontend):**
    * Todos os dados de turmas, alunos, atividades e entregas são salvos no `localStorage` do navegador, permitindo que o usuário continue de onde parou ao reabrir a aplicação.
    * A função `loadData` também cria dados de exemplo na primeira execução.

---

## 🚀 Como Executar o Sistema Integrado

### 🔧 Pré-requisitos

1. **Python 3** instalado.  
2. **Compilador C (MinGW)** configurado nas variáveis de ambiente do Windows.  
3. Instalar dependências:
   ```bash
   pip install Flask Flask-Cors
   ```

4. **Compilar o módulo C:**
   ```bash
   gcc -shared -o c_modules/avg.dll c_modules/avg.c
   ```

---

## 🧠 Passo a Passo de Execução

### 🟩 Passo 1 – Iniciar o Servidor Backend

1. Abra um terminal (CMD, PowerShell ou VS Code).  
2. Navegue até a pasta do backend:
   ```bash
   cd caminho/para/seu/projeto/SistemaPIM-UNIP-2025-main
   ```
3. Execute:
   ```bash
   python server.py
   ```
4. O servidor estará rodando em:  
   **http://127.0.0.1:5000**

---

### 🟦 Passo 2 – Utilizar o Frontend Web

1. Abra o arquivo `sistema.html` (pasta *SistemaEduFlow*).  
2. Faça login (exemplo: `prof@unip.br`).  
3. Crie turmas, adicione alunos e atividades.  
4. Clique em **“Sincronizar com Backend (PIM)”**.  
   - O site exibirá uma mensagem de sucesso.  
   - O terminal do backend mostrará:  
     ```
     SUCESSO: Base de dados sincronizada...
     ```

---

### 🟨 Passo 3 – Visualizar os Dados no Backend

1. Deixe o servidor rodando.  
2. Abra outro terminal e execute:
   ```bash
   python gui.py
   ```
3. A janela **“Sistema Acadêmico - PIM II”** exibirá todos os dados sincronizados.

---

## 📁 Estrutura de Pastas (Resumo)

```
SistemaPIM-UNIP-2025-main/
│
├── server.py
├── gui.py
├── c_wrapper.py
├── storage.py
├── ai_module.py
├── dados.json
├── dados_resumo.txt
└── c_modules/
    └── avg.dll
```

---

## 🧾 Sumário

- [x] 1. Visão Geral da Evolução  
- [x] 2. Alterações no Backend  
  - [x] 2.1 server.py  
  - [x] 2.2 c_wrapper.py  
  - [x] 2.3 storage.py  
  - [x] 2.4 gui.py  
- [x] 3. Execução do Sistema Integrado  

---

## 🧑‍💻 Autor

**SistemaPIM-UNIP-2025**  
Projeto acadêmico de integração entre backend Python e frontend web (SistemaEduFlow).
