// Importa o módulo Banco para realizar conexões com o banco de dados.
const Banco = require('./Banco');
const jwt = require('jsonwebtoken');
// Define a classe Aluno para representar a entidade Aluno.
class Aluno {
    // Construtor da classe Aluno que inicializa as propriedades.
    constructor() {
        this._idAluno = null;  // ID do aluno, inicialmente nulo.
        this._nome = null;  // Nome do aluno.
        this._email = null;  // Email do aluno.
        this._senha = null;  // Senha do aluno.
        this._turma = null;  // Turma do aluno.
    }
    
    // Método para login de aluno.
    async login() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT idAluno, nome, email FROM aluno WHERE email = ? AND senha = MD5(?);';

        // Verifique se os valores estão definidos antes de executar a consulta
        if (!this._email || !this._senha) {
            console.error("Erro: email ou senha não foram fornecidos.");
            return { success: false, msg: "Email ou senha não fornecidos" };
        }

        try {
            const [rows] = await conexao.promise().execute(SQL, [this._email, this._senha]);

            if (rows.length > 0) {
                const tupla = rows[0];
                this._idAluno = tupla.idAluno;
                this._nome = tupla.nome;
                this._email = tupla.email;

                // Aqui geramos o token JWT
                const payload = {
                    id: this._idAluno,
                    nome: this._nome,
                    email: this._email
                };

                // A chave secreta deve ser guardada em uma variável de ambiente para segurança
                const secretKey = 'sua_chave_secreta';
                const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });  // Expira em 1 hora

                return { success: true, msg: 'Login realizado com sucesso', token: token };
            }

            return { success: false, msg: 'Credenciais inválidas' };
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return { success: false, msg: 'Erro no servidor' };
        }
    }

    // Método para verificar se o aluno já existe no banco de dados pelo email.
    async isAlunoByEmail() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT COUNT(*) AS qtd FROM aluno WHERE email = ?';

        try {
            const [rows] = await conexao.promise().execute(SQL, [this._email]);

            if (rows.length > 0 && rows[0].qtd === 1) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Erro ao verificar aluno por email:', error);
            throw error;
        }
    }

    // Método assíncrono para criar um novo aluno no banco de dados.
    async create() {
        const conexao = Banco.getConexao();  // Obtém a conexão com o banco de dados.
        const SQL = 'INSERT INTO aluno (nome, email, senha, turma) VALUES (?, ?, MD5(?), ?);';

        try {
            const [result] = await conexao.promise().execute(SQL, [this._nome, this._email, this._senha, this._turma]);
            this._idAluno = result.insertId;  // Armazena o ID gerado pelo banco de dados.
            return result.affectedRows > 0;  // Retorna true se a inserção foi bem-sucedida.
        } catch (error) {
            console.error('Erro ao criar o aluno:', error);
            return false;
        }
    }

    // Método assíncrono para excluir um aluno do banco de dados.
    async delete() {
        const conexao = Banco.getConexao();
        const SQL = 'DELETE FROM aluno WHERE idAluno = ?;';

        try {
            const [result] = await conexao.promise().execute(SQL, [this._idAluno]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao excluir o aluno:', error);
            return false;
        }
    }

    // Método assíncrono para atualizar os dados de um aluno no banco de dados.
    async update() {
        const conexao = Banco.getConexao();
        const SQL = 'UPDATE aluno SET nome = ?, email = ?, senha = MD5(?), turma = ? WHERE idAluno = ?;';

        try {
            const [result] = await conexao.promise().execute(SQL, [this._nome, this._email, this._senha, this._turma, this._idAluno]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao atualizar o aluno:', error);
            return false;
        }
    }

    // Método assíncrono para ler todos os alunos do banco de dados.
    async readAll() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT * FROM aluno ORDER BY nome;';

        try {
            const [rows] = await conexao.promise().execute(SQL);
            return rows;
        } catch (error) {
            console.error('Erro ao ler alunos:', error);
            return [];
        }
    }

    // Método assíncrono para ler um aluno pelo seu ID.
    async readByID() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT * FROM aluno WHERE idAluno = ?;';

        try {
            const [rows] = await conexao.promise().execute(SQL, [this._idAluno]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Erro ao ler aluno pelo ID:', error);
            return null;
        }
    }

    // Getters e setters para as propriedades da classe.
    get idAluno() {
        return this._idAluno;
    }

    set idAluno(idAluno) {
        this._idAluno = idAluno;
    }

    get nome() {
        return this._nome;
    }

    set nome(nome) {
        this._nome = nome;
    }

    get email() {
        return this._email;
    }

    set email(email) {
        this._email = email;
    }

    get senha() {
        return this._senha;
    }

    set senha(senha) {
        this._senha = senha;
    }

    get turma() {
        return this._turma;
    }

    set turma(turma) {
        this._turma = turma;
    }
}

// Exporta a classe Aluno para que possa ser utilizada em outros módulos.
module.exports = Aluno;
