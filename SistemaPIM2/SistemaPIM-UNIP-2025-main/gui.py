"""
gui.py
Interface Gráfica (Tkinter) do Sistema Acadêmico - PIM II
-----------------------------------------------------------
CORREÇÃO: Acesso aos dados do aluno agora é feito como
dicionário (ex: aluno['nome']) para evitar erros.

** NOVO: Adicionado widget de Métricas de Sustentabilidade **
-----------------------------------------------------------"""

import tkinter as tk
from tkinter import ttk, messagebox
import storage

DB_FILE = "dados.json"

class SistemaGUI(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Sistema Acadêmico - PIM II")
        # Aumentamos a altura para caber o novo widget
        self.geometry("700x520") 
        self.config(bg="#f0f0f0")

        # --- Início do Widget de Sustentabilidade ---
        
        # Estilo para o frame do widget (verde claro)
        s = ttk.Style(self)
        s.configure(
            "Widget.TFrame",
            background="#eefaf7",
            borderwidth=1,
            relief="solid",
            padding=10
        )
        
        # Frame principal do widget
        widget_frame = ttk.Frame(self, style="Widget.TFrame")
        widget_frame.pack(fill="x", padx=20, pady=(15, 10))

        ttk.Label(
            widget_frame,
            text="♻️ Métricas de Sustentabilidade",
            font=("Arial", 14, "bold"),
            background="#eefaf7", # Fundo igual ao frame
            foreground="#1a535c"  # Cor verde escura
        ).pack(anchor="w")

        # Label que será atualizado com os dados
        self.label_metrica = ttk.Label(
            widget_frame,
            text="Calculando métricas...",
            font=("Arial", 11),
            background="#eefaf7"
        )
        self.label_metrica.pack(anchor="w", pady=(5, 0))
        
        # --- Fim do Widget ---

        tk.Label(self, text="Alunos Sincronizados", font=("Arial", 16, "bold"), bg="#f0f0f0").pack(pady=(10, 5))

        # Adicionada coluna para o "Insight" da IA
        self.tree = ttk.Treeview(self, columns=("nome", "media", "status", "insight"), show="headings")

        colunas = {
            "nome": ("Nome", 200),
            "media": ("Média", 80),
            "status": ("Status", 150),
            "insight": ("Feedback da IA", 250)
        }
        for col_id, (text, width) in colunas.items():
            self.tree.heading(col_id, text=text)
            self.tree.column(col_id, anchor="center", width=width)

        self.tree.pack(expand=True, fill="both", padx=20, pady=(5, 10))

        tk.Button(self, text="🔄 Atualizar", command=self.atualizar, bg="#007acc", fg="white").pack(pady=10)
        
        # Chama a atualização inicial
        self.atualizar()

    def atualizar(self):
        """Recarrega os dados do JSON e atualiza a tabela e o widget."""
        try:
            db = storage.carregar_json(DB_FILE)
            alunos = db.get("alunos", [])
            turmas = db.get("turmas", [])
            aulas = db.get("aulas", []) # Carrega as aulas
        except Exception as e:
            messagebox.showerror("Erro de Leitura", f"Não foi possível ler o arquivo de dados:\n{e}")
            return

        # --- Lógica de Cálculo do Widget ---
        total_alunos = len(alunos)
        total_turmas = len(turmas)
        total_aulas = len(aulas)
        
        # Cálculo simplificado (1 ação = 1 folha)
        total_acoes_digitais = total_alunos + total_turmas + total_aulas
        folhas_economizadas = total_acoes_digitais
        
        texto_metrica = (
            f"Este sistema já economizou {folhas_economizadas} folhas de papel.\n"
            f"({total_alunos} alunos, {total_turmas} turmas e {total_aulas} aulas registradas)"
        )
        self.label_metrica.config(text=texto_metrica)
        
        # --- Atualização da Tabela de Alunos ---
        for item in self.tree.get_children():
            self.tree.delete(item)

        if not alunos:
            # Mostra uma mensagem na própria tabela se estiver vazia
            self.tree.insert("", "end", values=("", "Nenhum aluno sincronizado ainda.", "", ""))
            return

        # CORREÇÃO: Acessa os dados como dicionário
        for aluno in alunos:
            self.tree.insert("", "end", values=(
                aluno.get('nome', 'N/A'),
                f"{aluno.get('media', 0.0):.2f}",
                aluno.get('status', 'N/A'),
                aluno.get('insight', 'N/A')
            ))

if __name__ == "__main__":
    app = SistemaGUI()
    app.mainloop()