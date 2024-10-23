// Importa o módulo Banco para realizar conexões com o banco de dados.
const Banco = require('./Banco');
const jwt = require('jsonwebtoken');
// Define a classe Professor para representar a entidade Professor.
class Professor {
    // Construtor da classe Professor que inicializa as propriedades.
    constructor() {
        this._idProfessor = null;  // ID do professor, inicialmente nulo.
        this._nome = null;  // Nome do professor.
        this._email = null;  // Email do professor.
        this._senha = null;  // Senha do professor.
        this._disciplina = null;  // Disciplina ministrada pelo professor.
    }

    // Método assíncrono para criar um novo professor no banco de dados.
    async create() {
        const conexao = Banco.getConexao();  // Obtém a conexão com o banco de dados.
        const SQL = 'INSERT INTO professor (nome, email, senha, disciplina) VALUES (?, ?, MD5(?), ?);';

        try {
            const [result] = await conexao.promise().execute(SQL, [
                this._nome,
                this._email,
                this._senha,
                this._disciplina
            ]);
            this._idProfessor = result.insertId;  // Armazena o ID gerado pelo banco de dados.
            return result.affectedRows > 0;  // Retorna true se a inserção foi bem-sucedida.
        } catch (error) {
            console.error('Erro ao criar o professor:', error);
            return false;
        }
    }

    // Método assíncrono para excluir um professor do banco de dados.
    async delete() {
        const conexao = Banco.getConexao();
        const SQL = 'DELETE FROM professor WHERE idProfessor = ?;';

        try {
            const [result] = await conexao.promise().execute(SQL, [this._idProfessor]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao excluir o professor:', error);
            return false;
        }
    }

    // Método assíncrono para atualizar os dados de um professor no banco de dados.
    async update() {
        const conexao = Banco.getConexao();
        const SQL = 'UPDATE professor SET nome = ?, email = ?, senha = MD5(?), disciplina = ? WHERE idProfessor = ?;';

        try {
            const [result] = await conexao.promise().execute(SQL, [
                this._nome,
                this._email,
                this._senha,
                this._disciplina,
                this._idProfessor
            ]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao atualizar o professor:', error);
            return false;
        }
    }

    // Método assíncrono para ler todos os professores do banco de dados.
    async readAll() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT * FROM professor ORDER BY nome;';

        try {
            const [rows] = await conexao.promise().execute(SQL);
            return rows;
        } catch (error) {
            console.error('Erro ao ler professores:', error);
            return [];
        }
    }

    // Método assíncrono para ler um professor pelo seu ID.
    async readByID(idProfessor) {
        this._idProfessor = idProfessor;

        const conexao = Banco.getConexao();
        const SQL = 'SELECT * FROM professor WHERE idProfessor = ?;';

        try {
            const [rows] = await conexao.promise().execute(SQL, [this._idProfessor]);
            return rows.length > 0 ? rows[0] : null;  // Retorna o professor correspondente ao ID.
        } catch (error) {
            console.error('Erro ao ler professor pelo ID:', error);
            return null;
        }
    }

    // Método assíncrono para verificar se um professor já existe no banco de dados pelo email.
    async isProfessorByEmail(email) {
        const conexao = Banco.getConexao();  // Obtém a conexão com o banco de dados.
        const SQL = 'SELECT COUNT(*) AS qtd FROM professor WHERE email = ?;';

        try {
            const [rows] = await conexao.promise().execute(SQL, [email]);
            return rows[0].qtd > 0;  // Retorna true se houver algum professor com o mesmo email.
        } catch (error) {
            console.error('Erro ao verificar o email do professor:', error);
            return false;
        }
    }

    async login() {
        const conexao = Banco.getConexao();
        const SQL = `
            SELECT COUNT(*) AS qtd, idProfessor, nome, email, disciplina
            FROM professor 
            WHERE email = ? AND senha = MD5(?);
        `;

        // Verifique se os valores estão definidos antes de executar a consulta
        if (!this._email || !this._senha) {
            console.error("Erro: email ou senha não foram fornecidos.");
            return { success: false, msg: "Email ou senha não fornecidos" };
        }

        try {
            const [rows] = await conexao.promise().execute(SQL, [this._email, this._senha]);

            if (rows.length > 0) {
                const tupla = rows[0];
                this._idProfessor = tupla.idProfessor;
                this._nome = tupla.nome;
                this._email = tupla.email;

                // Aqui geramos o token JWT
                const payload = {
                    id: this._idProfessor,
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
/*
    // Método assíncrono para fazer login de um professor.
    async login() {
        const conexao = Banco.getConexao(); // Obtém a conexão com o banco de dados.
        const SQL = `
            SELECT COUNT(*) AS qtd, idProfessor, nome, email, disciplina
            FROM professor 
            WHERE email = ? AND senha = MD5(?);
        `;

        try {
            // Prepara e executa a consulta SQL com parâmetros.
            const [rows] = await conexao.promise().execute(SQL, [this._email, this._senha]);

            if (rows.length > 0 && rows[0].qtd === 1) {
                const tupla = rows[0];
                // Configura os atributos do professor.
                this._idProfessor = tupla.idProfessor;
                this._nome = tupla.nome;
                this._email = tupla.email;
                this._disciplina = tupla.disciplina;

                return true; // Login bem-sucedido.
            }

            return false; // Login falhou.
        } catch (error) {
            console.error('Erro ao realizar o login do professor:', error);
            return false;
        }
    }
        */

    // Getters e setters para as propriedades da classe.

    get idProfessor() {
        return this._idProfessor;
    }

    set idProfessor(idProfessor) {
        this._idProfessor = idProfessor;
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

    get disciplina() {
        return this._disciplina;
    }

    set disciplina(disciplina) {
        this._disciplina = disciplina;
    }
}

// Exporta a classe Professor para que possa ser utilizada em outros módulos.
module.exports = Professor;
