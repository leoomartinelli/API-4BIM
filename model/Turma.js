const Banco = require('./Banco');


class Turma {
    constructor() {
        this._idTurma = null;
        this._nomeTurma = null;
        this._idProfessor = null;  // Adicionando o ID do professor
    }

    async getTurmasByProfessor(idProfessor) {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT * FROM turma WHERE idProfessor = ?;';

        try {
            const [rows] = await conexao.promise().execute(SQL, [idProfessor]);
            return rows;  // Retorna as turmas encontradas
        } catch (error) {
            console.error('Erro ao buscar turmas do professor:', error);
            return [];
        }
    }
    
    async isTurmaByNome(nomeTurma) {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM turma WHERE nomeTurma = ?;';

        try {
            const [rows] = await conexao.promise().execute(SQL, [nomeTurma]);
            return rows[0].qtd > 0;  // Retorna true se houver uma turma com o nome fornecido
        } catch (error) {
            console.error('Erro ao verificar nome da turma:', error);
            throw error;
        }
    }

    // Método para criar uma nova turma com professor
    async create() {
        const conexao = Banco.getConexao();
        const SQL = 'INSERT INTO turma (nomeTurma, idProfessor) VALUES (?, ?);';

        try {
            if (!this._idProfessor) {
                throw new Error('A turma deve ter um professor associado');
            }

            const [result] = await conexao.promise().execute(SQL, [this._nomeTurma, this._idProfessor]);
            this._idTurma = result.insertId;
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao criar a turma:', error);
            return false;
        }
    }

    

    // Método para deletar uma turma somente se não houver alunos associados
    async delete() {
        const conexao = Banco.getConexao();

        // Verifica se a turma tem alunos ou um professor associado
        const SQL_CHECK = `
            SELECT COUNT(*) AS alunosCount
            FROM aluno
            WHERE idTurma = ?;
        `;

        const SQL_DELETE = 'DELETE FROM turma WHERE idTurma = ?;';

        try {
            // Verifica se há alunos na turma
            const [rows] = await conexao.promise().execute(SQL_CHECK, [this._idTurma]);
            const alunosCount = rows[0].alunosCount;

            if (alunosCount > 0) {
                throw new Error('Não é possível excluir a turma porque ela possui alunos.');
            }

            // Exclui a turma se não houver alunos
            const [result] = await conexao.promise().execute(SQL_DELETE, [this._idTurma]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao excluir a turma:', error);
            return false;
        }
    }

    // Método para atualizar a turma
    async update() {
        const conexao = Banco.getConexao();
        const SQL = 'UPDATE turma SET nomeTurma = ?, idProfessor = ? WHERE idTurma = ?;';

        try {
            const [result] = await conexao.promise().execute(SQL, [
                this._nomeTurma,
                this._idProfessor,
                this._idTurma
            ]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao atualizar a turma:', error);
            return false;
        }
    }

    // Método para ler todas as turmas
    async readAll() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT * FROM turma ORDER BY nomeTurma;';

        try {
            const [rows] = await conexao.promise().execute(SQL);
            return rows;
        } catch (error) {
            console.error('Erro ao ler turmas:', error);
            return [];
        }
    }

    async readByID(idTurma) {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT * FROM turma WHERE idTurma = ?;';

        try {
            const [rows] = await conexao.promise().execute(SQL, [idTurma]);
            return rows.length > 0 ? rows[0] : null;  // Retorna a turma correspondente ao ID
        } catch (error) {
            console.error('Erro ao ler turma pelo ID:', error);
            throw error;
        }
    }

    // Método para verificar se uma turma tem alunos e professor
    async hasAlunos() {
        const conexao = Banco.getConexao();
        const SQL_CHECK_ALUNOS = `
            SELECT COUNT(*) AS alunosCount
            FROM aluno
            WHERE idTurma = ?;
        `;

        try {
            const [rows] = await conexao.promise().execute(SQL_CHECK_ALUNOS, [this._idTurma]);
            return rows[0].alunosCount > 0;
        } catch (error) {
            console.error('Erro ao verificar se a turma tem alunos:', error);
            return false;
        }
    }

    // Getters e setters
    get idTurma() {
        return this._idTurma;
    }

    set idTurma(idTurma) {
        this._idTurma = idTurma;
    }

    get nomeTurma() {
        return this._nomeTurma;
    }

    set nomeTurma(nomeTurma) {
        this._nomeTurma = nomeTurma;
    }

    get idProfessor() {
        return this._idProfessor;
    }

    set idProfessor(idProfessor) {
        this._idProfessor = idProfessor;
    }
}

module.exports = Turma;
