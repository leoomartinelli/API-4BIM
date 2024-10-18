const apiUrl = 'http://localhost:8080/alunos';  // Substitua pelo endpoint correto da sua API

document.addEventListener('DOMContentLoaded', () => {
    const alunoForm = document.getElementById('aluno-form');
    const alunosTableBody = document.querySelector('#alunos-table tbody');

    // Função para carregar alunos
    const carregarAlunos = async () => {
        const response = await fetch(apiUrl);
        const alunos = await response.json();
        alunosTableBody.innerHTML = ''; // Limpa a tabela

        alunos.forEach(aluno => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${aluno.id}</td>
                <td>${aluno.nome}</td>
                <td>${aluno.email}</td>
                <td>${aluno.curso}</td>
                <td>
                    <button onclick="editarAluno(${aluno.id})">Editar</button>
                    <button onclick="deletarAluno(${aluno.id})">Deletar</button>
                </td>
            `;
            alunosTableBody.appendChild(row);
        });
    };

    // Função para adicionar ou atualizar aluno
    alunoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('alunoId').value;
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const curso = document.getElementById('curso').value;
        const senha = document.getElementById('senha').value;

        const aluno = { nome, email, curso, senha };

        if (id) {
            // Atualizar aluno
            await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aluno),
            });
        } else {
            // Adicionar novo aluno
            await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aluno),
            });
        }

        alunoForm.reset(); // Limpa o formulário
        carregarAlunos();  // Atualiza a lista de alunos
    });

    // Função para editar aluno
    window.editarAluno = async (id) => {
        const response = await fetch(`${apiUrl}/${id}`);
        const aluno = await response.json();

        document.getElementById('alunoId').value = aluno.id;
        document.getElementById('nome').value = aluno.nome;
        document.getElementById('email').value = aluno.email;
        document.getElementById('curso').value = aluno.curso;
    };

    // Função para deletar aluno
    window.deletarAluno = async (id) => {
        if (confirm('Tem certeza que deseja excluir este aluno?')) {
            await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
            });
            carregarAlunos(); // Atualiza a lista de alunos
        }
    };

    // Carregar a lista de alunos ao iniciar
    carregarAlunos();
});
