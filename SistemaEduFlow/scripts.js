// ===================================================================
// 1. SETUP E VARIÁVEIS GLOBAIS
// ===================================================================
const $ = id => document.getElementById(id);
let users = [], currentUser = null, turmas = [], alunos = [], atividades = [], entregas = [];
let relatoriosGeradosCount = 0;
// ===================================================================
// 2. PERSISTÊNCIA DE DADOS (LocalStorage)
// ===================================================================
const generateUniqueId = () => Date.now() + Math.floor(Math.random() * 1000);

function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('turmas', JSON.stringify(turmas));
    localStorage.setItem('alunos', JSON.stringify(alunos));
    localStorage.setItem('atividades', JSON.stringify(atividades));
    localStorage.setItem('entregas', JSON.stringify(entregas));
    localStorage.setItem('relatoriosGerados', relatoriosGeradosCount);
}

function loadData() {
    // Carrega os dados guardados. Se não existirem, inicia com dados padrão.
    const storedUsers = localStorage.getItem('users');
    const storedAlunos = localStorage.getItem('alunos');

    if (!storedUsers || !storedAlunos) {
        // Se for a primeira vez que a aplicação corre, cria dados de exemplo.
        const prof = { email: 'prof@unip.br', password: '123456', name: 'Prof. Ana', role: 'professor' };
        const joao = { email: 'joaosilva@unip.br', password: '123456', name: 'João Silva', role: 'aluno' };
        const maria = { email: 'mariaisabel@unip.br', password: '123456', name: 'Maria Isabel', role: 'aluno' };

        users = [prof, joao, maria];

        const turmaExemploId = generateUniqueId();
        turmas = [{ id: turmaExemploId, turmaNome: "ADS 2025", turmaDisciplina: "Eng. de Software", turmaAnoSemestre: "2025/2" }];

        alunos = [
            { id: generateUniqueId(), alunoNome: "João Silva", alunoMatricula: "123456", alunoEmail: "joaosilva@unip.br", alunoTurma: turmaExemploId },
            { id: generateUniqueId(), alunoNome: "Maria Isabel", alunoMatricula: "123456", alunoEmail: "mariaisabel@unip.br", alunoTurma: turmaExemploId }
        ];
        saveData(); // Guarda os dados iniciais
    } else {
        // Se já existirem dados, apenas os carrega
        users = JSON.parse(storedUsers);
        alunos = JSON.parse(storedAlunos);
        turmas = JSON.parse(localStorage.getItem('turmas') || '[]');
        atividades = JSON.parse(localStorage.getItem('atividades') || '[]');
        entregas = JSON.parse(localStorage.getItem('entregas') || '[]');
        relatoriosGeradosCount = parseInt(localStorage.getItem('relatoriosGerados') || '0');
    }
}


// ===================================================================
// 3. AUTENTICAÇÃO E NAVEGAÇÃO
// ===================================================================
$('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = $('emailInput').value.trim();
    const pass = $('passwordInput').value.trim();
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
        currentUser = user;
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        loadDashboard();
    } else {
        $('errorMsg').textContent = 'Email ou RA incorretos.';
        $('errorMsg').style.display = 'block';
    }
});

function logout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    window.location.reload(); // Recarrega a página para garantir que tudo seja limpo
}

function loadDashboard() {
    $('loginPage').style.display = 'none';
    $('dashboardPage').style.display = 'block';
    const userProfile = alunos.find(a => a.alunoEmail === currentUser.email);
    const displayName = (currentUser.role === 'professor') ? currentUser.name : (userProfile?.alunoNome || currentUser.name);
    $('userName').textContent = displayName;
    $('userEmail').textContent = currentUser.email;
    $('userAvatar').textContent = displayName.charAt(0).toUpperCase();
    buildMenu();
    showSection('dashboardSection', document.querySelector('.menu-item'));
}

function buildMenu() {
    const menu = $('menuContainer');
    const professorItems = [{ id: 'dashboardSection', label: 'Dashboard', icon: '📊' },
    { id: 'turmasSection', label: 'Turmas', icon: '📚' },
    { id: 'alunosSection', label: 'Alunos', icon: '👨‍🎓' },
    { id: 'atividadesSection', label: 'Atividades', icon: '📋' },
    { id: 'notasSectionProfessor', label: 'Avaliar Entregas', icon: '✅' },
    { id: 'relatoriosSection', label: 'Gerar Relatórios', icon: '📄' },
    { id: 'botAuxiliarSection', label: 'Bot Auxiliar', icon: '🤖' }];
    const alunoItems = [{ id: 'dashboardSection', label: 'Dashboard', icon: '📊' }, { id: 'atividadesAlunoSection', label: 'Minhas Atividades', icon: '📋' }, { id: 'notasAlunoSection', label: 'Minhas Notas', icon: '⭐' }];
    const items = (currentUser.role === 'professor') ? professorItems : alunoItems;
    menu.innerHTML = items.map(item => `<div class="menu-item" onclick="showSection('${item.id}', this)">${item.icon} ${item.label}</div>`).join('');
}

function showSection(id, menuItemElement) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    $(id).classList.add('active');
    if (menuItemElement) menuItemElement.classList.add('active');
    // ... (dentro da função showSection)
    const sectionLoaders = {
        turmasSection: loadTurmas,
        alunosSection: loadAlunos,
        atividadesSection: loadAtividades,
        notasSectionProfessor: loadEntregas,
        atividadesAlunoSection: loadAtividadesAluno,
        notasAlunoSection: loadNotasAluno,
        dashboardSection: loadStats,
        relatoriosSection: loadRelatoriosSection,
        botAuxiliarSection: loadBotAuxiliar // <-- ADICIONE ESTA LINHA
    };
    if (sectionLoaders[id]) sectionLoaders[id]();
    // ... (resto da função)
}

// ... (O resto do seu código, como a lógica de CRUD e sincronização, permanece aqui)
// ... Vou omitir por brevidade, mas o seu código completo deve ser mantido a partir daqui.
function openModal(title, fields, onSave) { $('modalTitle').textContent = title; const container = $('modalFields'); container.innerHTML = fields.map(f => { let inputHtml = ''; const required = f.required ? 'required' : ''; const commonAttrs = `id="mf_${f.id}" class="form-group" value="${f.value || ''}" ${required}`; switch (f.type) { case 'select': inputHtml = `<select id="mf_${f.id}" class="form-group" ${required}>${f.options.map(o => `<option value="${o.value}" ${f.value == o.value ? 'selected' : ''}>${o.text}</option>`).join('')}</select>`; break; case 'textarea': inputHtml = `<textarea id="mf_${f.id}" class="form-group" rows="4" ${required}>${f.value || ''}</textarea>`; break; case 'number': inputHtml = `<input type="number" ${commonAttrs} min="${f.min || 0}" max="${f.max}" step="${f.step || '0.1'}">`; break; default: inputHtml = `<input type="${f.type}" ${commonAttrs}>`; } return `<div class="form-group"><label for="mf_${f.id}">${f.label}</label>${inputHtml}</div>`; }).join(''); $('genericModal').classList.add('show'); $('modalForm').onsubmit = e => { e.preventDefault(); const data = {}; fields.forEach(f => data[f.id] = $(`mf_${f.id}`).value); if (onSave(data) !== false) closeModal(); }; }
const closeModal = () => $('genericModal').classList.remove('show');
const toggleSidebar = () => document.querySelector('.sidebar').classList.toggle('open');

function loadStats() {
    const grid = $('statsGrid');
    if (currentUser.role === 'professor') {
        const entregasPendentes = entregas.filter(e => e.status === 'Entregue').length;

        // --- INÍCIO DA LÓGICA DE SUSTENTABILIDADE ---
        const folhasPorRelatorio = 1; // Cada relatório digital economiza 1 folha
        const folhasAlunos = alunos.length;
        const folhasTurmas = turmas.length;
        const folhasAtividades = atividades.length;

        // Conta entregas feitas E avaliadas como 1 folha cada
        const folhasEntregas = entregas.filter(e => e.status === 'Entregue' || e.status === 'Avaliado').length;
        const folhasRelatorios = relatoriosGeradosCount * folhasPorRelatorio;
        const folhasEconomizadas = folhasAlunos + folhasTurmas + folhasAtividades + folhasEntregas + folhasRelatorios;
        // HTML do novo widget
        const widgetSustentabilidade = `
            <div class="stat-card sustainability">
                <h3>🌳 Folhas de Papel Economizadas</h3>
                <div class="value">${folhasEconomizadas}</div>
            </div>
        `;
        // --- FIM DA LÓGICA ---

        grid.innerHTML = `
            <div class="stat-card"><h3>Turmas</h3><div class="value">${turmas.length}</div></div>
            <div class="stat-card"><h3>Alunos</h3><div class="value">${alunos.length}</div></div>
            <div class="stat-card"><h3>Atividades</h3><div class="value">${atividades.length}</div></div>
            <div class="stat-card"><h3>Pendentes</h3><div class="value">${entregasPendentes}</div></div>
            ${widgetSustentabilidade}
        `;

    } else {
        // Lógica do aluno (permanece a mesma)
        const alunoAtual = alunos.find(a => a.alunoEmail === currentUser.email);
        const minhasEntregas = alunoAtual ? entregas.filter(e => e.alunoId === alunoAtual.id) : [];
        const pendentes = minhasEntregas.filter(e => e.status === 'Pendente').length;
        const mediaGeral = minhasEntregas.length > 0 ? (minhasEntregas.reduce((acc, e) => acc + (e.nota || 0), 0) / minhasEntregas.filter(e => e.nota !== null).length || 0).toFixed(2) : 'N/A';
        grid.innerHTML = `
            <div class="stat-card"><h3>Atividades Pendentes</h3><div class="value">${pendentes}</div></div>
            <div class="stat-card"><h3>Média Geral</h3><div class="value">${mediaGeral}</div></div>
        `;
    }
}

function openAddTurmaModal() { openModal('Nova Turma', [{ id: 'turmaNome', label: 'Nome', required: true }, { id: 'turmaDisciplina', label: 'Disciplina', required: true }, { id: 'turmaAnoSemestre', label: 'Ano/Semestre', placeholder: 'Ex: 2025/1', required: true }], data => { turmas.push({ ...data, id: generateUniqueId() }); saveData(); loadTurmas(); loadStats(); }); }
function loadTurmas() { const tbody = $('turmasTable').querySelector('tbody'); tbody.innerHTML = turmas.map(t => `<tr><td>${t.turmaNome}</td><td>${t.turmaDisciplina}</td><td>${t.turmaAnoSemestre}</td><td><button class="btn-small btn-edit" onclick="editTurma(${t.id})">Editar</button><button class="btn-small btn-delete" onclick="deleteTurma(${t.id})">Excluir</button></td></tr>`).join('') || '<tr><td colspan="4" class="text-center">Nenhuma turma cadastrada.</td></tr>'; }
function deleteTurma(id) { if (confirm('Tem certeza?')) { turmas = turmas.filter(t => t.id !== id); saveData(); loadTurmas(); loadStats(); } }
function editTurma(id) { const t = turmas.find(x => x.id === id); if (!t) return; openModal('Editar Turma', [{ id: 'turmaNome', label: 'Nome', value: t.turmaNome, required: true }, { id: 'turmaDisciplina', label: 'Disciplina', value: t.turmaDisciplina, required: true }, { id: 'turmaAnoSemestre', label: 'Ano/Semestre', value: t.turmaAnoSemestre, required: true }], data => { Object.assign(t, data); saveData(); loadTurmas(); }); }
function openAddAlunoModal() { if (turmas.length === 0) return alert('Cadastre uma turma primeiro.'); openModal('Novo Aluno', [{ id: 'alunoNome', label: 'Nome', required: true }, { id: 'alunoMatricula', label: 'Matrícula (senha)', required: true }, { id: 'alunoEmail', label: 'Email (login)', type: 'email', required: true }, { id: 'alunoTurma', label: 'Turma', type: 'select', options: turmas.map(t => ({ value: t.id, text: t.turmaNome })) }], data => { if (users.some(u => u.email === data.alunoEmail)) return alert('Este email já está em uso.'); const novoAlunoId = generateUniqueId(); alunos.push({ ...data, id: novoAlunoId }); users.push({ email: data.alunoEmail, password: data.alunoMatricula, name: data.alunoNome, role: 'aluno' }); saveData(); loadAlunos(); loadStats(); }); }
function loadAlunos() { const tbody = $('alunosTable').querySelector('tbody'); tbody.innerHTML = alunos.map(a => { const turma = turmas.find(t => t.id == a.alunoTurma); return `<tr><td>${a.alunoNome}</td><td>${a.alunoMatricula}</td><td>${a.alunoEmail}</td><td>${turma ? turma.turmaNome : 'N/A'}</td><td><button class="btn-small btn-edit" onclick="editAluno(${a.id})">Editar</button><button class="btn-small btn-delete" onclick="deleteAluno(${a.id})">Excluir</button></td></tr>` }).join('') || '<tr><td colspan="5" class="text-center">Nenhum aluno cadastrado.</td></tr>'; }
function deleteAluno(id) { if (!confirm('Tem certeza?')) return; const aluno = alunos.find(a => a.id === id); if (aluno) users = users.filter(u => u.email !== aluno.alunoEmail); alunos = alunos.filter(a => a.id !== id); saveData(); loadAlunos(); loadStats(); }
function editAluno(id) { const a = alunos.find(x => x.id === id); if (!a) return; const oldEmail = a.alunoEmail; openModal('Editar Aluno', [{ id: 'alunoNome', label: 'Nome', value: a.alunoNome, required: true }, { id: 'alunoMatricula', label: 'Matrícula (senha)', value: a.alunoMatricula, required: true }, { id: 'alunoEmail', label: 'Email (login)', type: 'email', value: a.alunoEmail, required: true }, { id: 'alunoTurma', label: 'Turma', type: 'select', options: turmas.map(t => ({ value: t.id, text: t.turmaNome })), value: a.alunoTurma }], data => { if (data.alunoEmail !== oldEmail && users.some(u => u.email === data.alunoEmail)) return alert('Email já em uso.'); Object.assign(a, data); const user = users.find(u => u.email === oldEmail); if (user) { Object.assign(user, { email: data.alunoEmail, password: data.alunoMatricula, name: data.alunoNome }); } saveData(); loadAlunos(); }); }
function openAddAtividadeModal() { if (turmas.length === 0) return alert('Cadastre uma turma primeiro.'); openModal('Nova Atividade', [{ id: 'ativTitulo', label: 'Título', required: true }, { id: 'ativTipo', label: 'Tipo', type: 'select', options: [{ value: 'Prova', text: 'Prova' }, { value: 'Trabalho', text: 'Trabalho' }] }, { id: 'ativTurma', label: 'Turma', type: 'select', options: turmas.map(t => ({ value: t.id, text: t.turmaNome })), required: true }, { id: 'ativEntrega', label: 'Data de Entrega', type: 'date', required: true }, { id: 'ativValor', label: 'Valor (0 a 10)', type: 'number', required: true, min: 0, max: 10 }], data => { const atividadeId = generateUniqueId(); atividades.push({ ...data, id: atividadeId }); alunos.filter(a => a.alunoTurma == data.ativTurma).forEach(aluno => entregas.push({ id: generateUniqueId(), atividadeId, alunoId: aluno.id, status: 'Pendente' })); saveData(); loadAtividades(); loadStats(); }); }
function loadAtividades() { const tbody = $('atividadesTable').querySelector('tbody'); tbody.innerHTML = atividades.map(a => `<tr><td>${a.ativTitulo}</td><td>${a.ativTipo}</td><td>${turmas.find(t => t.id == a.ativTurma)?.turmaNome || '-'}</td><td>${new Date(a.ativEntrega).toLocaleDateString()}</td><td>${a.ativValor}</td><td><button class="btn-small btn-delete" onclick="deleteAtividade(${a.id})">Excluir</button></td></tr>`).join('') || '<tr><td colspan="6" class="text-center">Nenhuma atividade cadastrada.</td></tr>'; }
function deleteAtividade(id) { if (!confirm('Excluir?')) return; atividades = atividades.filter(a => a.id !== id); entregas = entregas.filter(e => e.atividadeId !== id); saveData(); loadAtividades(); }
function loadEntregas() { const tbody = $('entregasTable').querySelector('tbody'); const paraAvaliar = entregas.filter(e => ['Entregue', 'Avaliado'].includes(e.status)); tbody.innerHTML = paraAvaliar.map(e => { const ativ = atividades.find(a => a.id === e.atividadeId); const aluno = alunos.find(a => a.id === e.alunoId); if (!ativ || !aluno) return ''; return `<tr><td>${ativ.ativTitulo}</td><td>${aluno.alunoNome}</td><td>${new Date(e.dataEntrega).toLocaleDateString()}</td><td class="status-${e.status.toLowerCase()}">${e.status}</td><td>${e.nota ?? '-'}</td><td><button class="btn-small btn-edit" onclick="avaliarEntrega(${e.id})">${e.status === 'Avaliado' ? 'Reavaliar' : 'Avaliar'}</button></td></tr>`; }).join('') || '<tr><td colspan="6" class="text-center">Nenhuma atividade entregue.</td></tr>'; }
function avaliarEntrega(id) { const e = entregas.find(x => x.id === id); const ativ = atividades.find(a => a.id === e.atividadeId); const notaMax = parseFloat(ativ?.ativValor) || 10; openModal('Avaliar Entrega', [{ id: 'nota', label: `Nota (0-${notaMax})`, type: 'number', value: e.nota || '', required: true, max: notaMax }, { id: 'feedback', label: 'Feedback', type: 'textarea', value: e.feedback || '' }], data => { const notaInserida = parseFloat(data.nota); if (isNaN(notaInserida) || notaInserida > notaMax || notaInserida < 0) return alert(`A nota deve ser um número entre 0 e ${notaMax}.`); Object.assign(e, { nota: notaInserida, feedback: data.feedback, status: 'Avaliado' }); saveData(); loadEntregas(); loadStats(); }); }
function loadAtividadesAluno() { const alunoAtual = alunos.find(a => a.alunoEmail === currentUser.email); if (!alunoAtual) return; const tbody = $('atividadesAlunoTable').querySelector('tbody'); const minhasEntregas = entregas.filter(e => e.alunoId === alunoAtual.id); tbody.innerHTML = minhasEntregas.map(e => { const ativ = atividades.find(a => a.id === e.atividadeId); if (!ativ) return ''; return `<tr><td>${ativ.ativTitulo}</td><td>${turmas.find(t => t.id == ativ.ativTurma)?.disciplina || ''}</td><td>${new Date(ativ.ativEntrega).toLocaleDateString()}</td><td class="status-${e.status.toLowerCase()}">${e.status}</td><td>${e.status === 'Pendente' ? `<button class="btn-small btn-edit" onclick="entregarAtividade(${e.id})">Entregar</button>` : '<i>Sem ações</i>'}</td></tr>`; }).join('') || '<tr><td colspan="5" class="text-center">Nenhuma atividade para você.</td></tr>'; }

function entregarAtividade(id) {
    // Pede confirmação ao aluno antes de entregar
    if (!confirm("Confirmar a entrega desta atividade?")) {
        return; // Se o aluno clicar em "Cancelar", não faz nada
    }

    // Encontra a entrega específica na lista 'entregas'
    const entrega = entregas.find(e => e.id === id);

    // Se encontrou a entrega...
    if (entrega) {
        // Atualiza o status para 'Entregue' e guarda a data/hora atual
        Object.assign(entrega, { status: 'Entregue', dataEntrega: new Date().toISOString() });

        // Salva todas as mudanças no localStorage
        saveData();

        // Recarrega a lista de atividades do aluno para mostrar a mudança de status
        loadAtividadesAluno();

        // --- INÍCIO DA MENSAGEM DE SUSTENTABILIDADE ---
        // Mostra o alerta de confirmação e agradecimento
        alert("✅ Sua atividade foi entregue digitalmente.\nObrigado por contribuir com a redução do consumo de papel. 🌍");
        // --- FIM DA MENSAGEM ---

        //Atualiza o widget de sustentabilidade no Dashboard (mesmo que escondido)
        loadStats();
    } else {
        // Se, por algum motivo, a entrega não for encontrada (erro improvável)
        alert("Erro: Não foi possível encontrar a atividade para entregar.");
    }
}
function loadNotasAluno() { const alunoAtual = alunos.find(a => a.alunoEmail === currentUser.email); if (!alunoAtual) return; const tbody = $('notasAlunoTable').querySelector('tbody'); const minhasAvaliadas = entregas.filter(e => e.alunoId === alunoAtual.id && e.status === 'Avaliado'); tbody.innerHTML = minhasAvaliadas.map(e => { const ativ = atividades.find(a => a.id === e.atividadeId); return `<tr><td>${ativ?.ativTitulo || ''}</td><td>${e.nota} / ${ativ?.ativValor || '-'}</td><td>${e.feedback || ''}</td></tr>`; }).join('') || '<tr><td colspan="3" class="text-center">Nenhuma nota lançada.</td></tr>'; }
async function sincronizarComPim() { if (alunos.length === 0 && turmas.length === 0) return alert("Não há dados para sincronizar."); const btn = document.querySelector('[onclick="sincronizarComPim()"]'); btn.innerHTML = 'Sincronizando...'; btn.disabled = true; const payload = { alunos: alunos.map(aluno => ({ nome: aluno.alunoNome, matricula: aluno.alunoMatricula, curso: "Análise e Desenvolvimento de Sistemas", notas: entregas.filter(e => e.alunoId === aluno.id && typeof e.nota === 'number').map(e => e.nota) })), turmas: turmas.map(turma => ({ codigo: turma.turmaNome, disciplina: turma.turmaDisciplina, alunos: alunos.filter(a => a.alunoTurma == turma.id).map(a => ({ nome: a.alunoNome, matricula: a.alunoMatricula })) })) }; try { const response = await fetch('http://127.0.0.1:5000/api/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), }); const result = await response.json(); if (!response.ok) throw new Error(result.erro || "Falha na comunicação"); alert("Sucesso! Dados (alunos e turmas) sincronizados com o backend."); } catch (error) { console.error("Erro ao sincronizar:", error); alert("ERRO: " + error.message); } finally { btn.innerHTML = 'Sincronizar com Backend (PIM)'; btn.disabled = false; } }
window.onload = () => { loadData(); const savedUser = sessionStorage.getItem('currentUser'); if (savedUser) { currentUser = JSON.parse(savedUser); loadDashboard(); } else { $('loginPage').style.display = 'flex'; } };

function loadRelatoriosSection() {
    $('relatorioContainer').innerHTML = '';
}

function gerarRelatorio() {
    const container = $('relatorioContainer');
    if (alunos.length === 0) {
        container.innerHTML = '<p>Não há alunos para gerar relatório.</p>';
        return;
    }

    let relatorioHTML = '<h3>Relatório de Alunos</h3>';
    relatorioHTML += '<table style="width:100%; border-collapse: collapse;">';
    relatorioHTML += '<thead><tr><th>Nome</th><th>Matrícula</th><th>Email</th><th>Turma</th><th>Média</th><th>Faltas</th></tr></thead>';
    relatorioHTML += '<tbody>';
    alunos.forEach(aluno => {
        const turma = turmas.find(t => t.id == aluno.alunoTurma);
        const entregasAluno = entregas.filter(e => e.alunoId === aluno.id && e.nota !== null);
        // Correção para cálculo de média segura
        const notasAvaliadas = entregasAluno.filter(e => typeof e.nota === 'number');
        const media = notasAvaliadas.length > 0
            ? (notasAvaliadas.reduce((acc, e) => acc + (e.nota || 0), 0) / notasAvaliadas.length).toFixed(2)
            : 'N/A';

        relatorioHTML += `<tr><td>${aluno.alunoNome}</td><td>${aluno.alunoMatricula}</td><td>${aluno.alunoEmail}</td><td>${turma ? turma.turmaNome : 'N/A'}</td><td>${media}</td><td>${aluno.faltas || 0}</td></tr>`;
    });
    relatorioHTML += '</tbody></table>';
    container.innerHTML = relatorioHTML;
    // --- LÓGICA DE SUSTENTABILIDADE (Atualizada) ---

    // v-- BLOCO ATUALIZADO --v
    relatoriosGeradosCount++; // Incrementa o contador global
    saveData(); // Salva o novo contador no localStorage
    loadStats(); // Atualiza o widget do dashboard (que está noutra aba)

    const folhasPorRelatorio = 1;
    const folhasEconomizadas = relatoriosGeradosCount * folhasPorRelatorio;

    alert(`🌳\nVocê já gerou ${relatoriosGeradosCount} relatórios digitais!\nCom isso, você poupou um total de ${folhasEconomizadas} folhas. 🌍`);
}


window.onload = () => { loadData(); const savedUser = sessionStorage.getItem('currentUser'); if (savedUser) { currentUser = JSON.parse(savedUser); loadDashboard(); } else { $('loginPage').style.display = 'flex'; } };


// ===================================================================
// 10. LÓGICA DO BOT AUXILIAR (NOVA)
// ===================================================================

/**
 * Prepara a seção do Bot Auxiliar (chamada ao clicar na aba).
 */
function loadBotAuxiliar() {
    const container = $('botResultsContainer');
    if (container) {
        // Limpa resultados anteriores e exibe a mensagem inicial
        container.innerHTML = '<p>Clique no botão "Analisar Dados Atuais" para gerar insights.</p>';
    }
}

/**
 * Executa a análise de dados e exibe os insights no painel.
 * Esta função implementa as 4 regras de negócio solicitadas.
 */
function runBotAnalysis() {
    const container = $('botResultsContainer');
    if (!container) return;

    container.innerHTML = '<h3>🤖 Analisando dados...</h3>';

    let insightsHTML = '';
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Usado para comparar apenas datas

    // --- 1. Sugestões de Recuperação (Média < 5) ---
    const mediaBaixaAlunos = [];
    alunos.forEach(aluno => {
        const entregasAluno = entregas.filter(e => e.alunoId === aluno.id && e.nota !== null);
        const media = entregasAluno.length > 0 ? (entregasAluno.reduce((acc, e) => acc + e.nota, 0) / entregasAluno.length) : 0;

        // Vamos usar Média < 5 como "X"
        if (media > 0 && media < 5) {
            mediaBaixaAlunos.push({ nome: aluno.alunoNome, media: media.toFixed(2) });
        }
    });

    if (mediaBaixaAlunos.length > 0) {
        insightsHTML += `<div class="bot-card warning"><h4>🔔 Alunos em Risco (Média < 5.0)</h4><ul>`;
        mediaBaixaAlunos.forEach(a => {
            insightsHTML += `<li><strong>${a.nome}</strong> (Média: ${a.media}) - Recomendar atividades práticas extras de recuperação.</li>`;
        });
        insightsHTML += `</ul></div>`;
    }

    // --- 2. Sumários Automáticos por Turma ---
    insightsHTML += `<div class="bot-card info"><h4>📊 Sumário das Turmas</h4>`;
    let sumarioTurmasHTML = '';
    turmas.forEach(turma => {
        const alunosDaTurma = alunos.filter(a => a.alunoTurma == turma.id);
        if (alunosDaTurma.length === 0) return;

        let totalFaltas = 0;
        let somaMedias = 0;
        let alunosComMedia = 0;
        let alunosEmRisco = 0;

        alunosDaTurma.forEach(aluno => {
            totalFaltas += (aluno.faltas || 0);
            const entregasAluno = entregas.filter(e => e.alunoId === aluno.id && e.nota !== null);
            const media = entregasAluno.length > 0 ? (entregasAluno.reduce((acc, e) => acc + e.nota, 0) / entregasAluno.length) : 0;

            if (media > 0) {
                somaMedias += media;
                alunosComMedia++;
            }
            if (media > 0 && media < 5) {
                alunosEmRisco++;
            }
        });

        const mediaDaTurma = (alunosComMedia > 0 ? (somaMedias / alunosComMedia) : 0).toFixed(2);
        sumarioTurmasHTML += `<p><strong>Turma: ${turma.turmaNome} (${alunosDaTurma.length} alunos)</strong><br/>
            - Média geral da turma: ${mediaDaTurma}<br/>
            - Total de faltas (somado): ${totalFaltas}<br/>
            - Alunos em risco (Média < 5): ${alunosEmRisco}
        </p>`;
    });
    insightsHTML += (sumarioTurmasHTML || '<p>Nenhuma turma com alunos para sumarizar.</p>') + '</div>';


    // --- 3. Alertas de Atividades Atrasadas ---
    const atrasadas = [];
    atividades.forEach(ativ => {
        const dataEntrega = new Date(ativ.ativEntrega);
        // Verifica se a data de entrega já passou
        if (dataEntrega < today) {
            // Conta quantos alunos daquela turma ainda estão como "Pendente"
            const entregasPendentes = entregas.filter(e =>
                e.atividadeId === ativ.id &&
                e.status === 'Pendente' &&
                alunos.find(a => a.id === e.alunoId && a.alunoTurma == ativ.ativTurma) // Garante que o aluno ainda está na turma
            );
            if (entregasPendentes.length > 0) {
                atrasadas.push({ nome: ativ.ativTitulo, pendentes: entregasPendentes.length });
            }
        }
    });

    if (atrasadas.length > 0) {
        insightsHTML += `<div class="bot-card danger"><h4>❗ Atividades Atrasadas (Prazo Vencido)</h4><ul>`;
        atrasadas.forEach(a => {
            insightsHTML += `<li><strong>${a.nome}</strong>: ${a.pendentes} aluno(s) não entregaram.</li>`;
        });
        insightsHTML += `</ul></div>`;
    }

    // --- 4. Lembretes (Vencendo nos próximos 7 dias) ---
    const lembretes = [];
    atividades.forEach(ativ => {
        const dataEntrega = new Date(ativ.ativEntrega);
        const diffTime = dataEntrega.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Se vence entre hoje e 7 dias no futuro
        if (diffDays >= 0 && diffDays <= 7) {
            const entregasPendentes = entregas.filter(e => e.atividadeId === ativ.id && e.status === 'Pendente').length;
            if (entregasPendentes > 0) {
                lembretes.push({ nome: ativ.ativTitulo, dias: diffDays, pendentes: entregasPendentes });
            }
        }
    });

    if (lembretes.length > 0) {
        insightsHTML += `<div class="bot-card info"><h4>🗓️ Lembretes (Próximos 7 Dias)</h4><ul>`;
        lembretes.forEach(l => {
            let diaTexto = l.dias === 0 ? '<strong>HOJE</strong>' : `em ${l.dias} dia(s)`;
            insightsHTML += `<li><strong>${l.nome}</strong> vence ${diaTexto}. (${l.pendentes} entregas pendentes)</li>`;
        });
        insightsHTML += `</ul></div>`;
    }

    // --- Finalização ---
    if (insightsHTML === '') {
        insightsHTML = '<div class="bot-card info"><h4>✅ Tudo em ordem!</h4><p>Nenhum alerta ou sugestão importante no momento.</p></div>';
    }

    container.innerHTML = insightsHTML;
}
// Fim do arquivo scripts.js