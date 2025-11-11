"""
c_wrapper.py
Módulo de integração C/Python do PIM
------------------------------------------------
CORREÇÃO: O caminho da biblioteca agora é dinâmico,
funcionando em qualquer computador.
------------------------------------------------"""
import ctypes
import os
import platform

# === Carregamento dinâmico da biblioteca C ===
def _encontrar_biblioteca():
    """Encontra o caminho da biblioteca (.dll, .so, .dylib) dinamicamente."""
    base_dir = os.path.dirname(__file__)
    c_modules_dir = os.path.join(base_dir, "c_modules")
    system = platform.system()

    if system == "Windows":
        # No Windows, a DLL pode estar na raiz ou na pasta de output
        candidates = [os.path.join(c_modules_dir, "avg.dll"), os.path.join(c_modules_dir, "output", "avg.dll")]
    elif system == "Darwin":  # macOS
        candidates = [os.path.join(c_modules_dir, "libavg.dylib")]
    else:  # Linux/Unix
        candidates = [os.path.join(c_modules_dir, "libavg.so")]

    for path in candidates:
        if os.path.exists(path):
            print(f"Biblioteca C encontrada em: {path}")
            return path
    
    # Fallback para o caminho original se nada for encontrado
    return "C:\Projeto-PIM-main\SistemaPIM2\SistemaPIM-UNIP-2025-main"

try:
    lib_path = _encontrar_biblioteca()
    lib = ctypes.CDLL(lib_path)

    # === Definição dos tipos de parâmetros e retorno ===
    lib.calcular_media.argtypes = [ctypes.POINTER(ctypes.c_float), ctypes.c_int]
    lib.calcular_media.restype = ctypes.c_float

    lib.classificar_media.argtypes = [ctypes.c_float]
    lib.classificar_media.restype = ctypes.c_char_p
    
    _lib_carregada = True
except (OSError, AttributeError) as e:
    print(f"⚠️ AVISO: Não foi possível carregar a biblioteca C. Usando fallback em Python. Erro: {e}")
    _lib_carregada = False


# === Funções de fallback em Python (se a biblioteca C falhar) ===
def calcular_media_py(notas):
    # Filtra qualquer 'None' ou lixo que possa ter passado
    notas_validas = [n for n in notas if isinstance(n, (int, float))]
    if not notas_validas: return 0.0
    return sum(notas_validas) / len(notas_validas)

def classificar_media_py(media):
    if media >= 8.0: return "Aprovado!"
    if media >= 5.0: return "Muito bem, foi APROVADO."
    return "Reprovado"

# === Função principal de integração ===
def processar_aluno_c(aluno_dict):
    """
    Processa um aluno. Tenta usar a biblioteca C; se falhar, usa o fallback em Python.
    """
    if 'notas' not in aluno_dict or not isinstance(aluno_dict['notas'], list):
        aluno_dict['notas'] = []

    if _lib_carregada:
        try:
            notas_c = (ctypes.c_float * len(aluno_dict["notas"]))(*aluno_dict["notas"])
            media = lib.calcular_media(notas_c, len(aluno_dict["notas"]))
            status = lib.classificar_media(media).decode("utf-8")
        except Exception as e:
            print(f"Erro ao chamar a função C, usando fallback Python. Erro: {e}")
            media = calcular_media_py(aluno_dict["notas"])
            status = classificar_media_py(media)
    else:
        media = calcular_media_py(aluno_dict["notas"])
        status = classificar_media_py(media)

    aluno_dict["media"] = round(media, 2)
    aluno_dict["status"] = status
    return aluno_dict

# === Teste manual do módulo ===
if __name__ == "__main__":
    print("= Teste manual do módulo C Wrapper =")
    exemplo = {"nome": "Aluno Teste", "notas": [7.0, 8.5, 6.5]}
    resultado = processar_aluno_c(exemplo)
    print("Resultado do processamento:", resultado)
