// Importa o módulo Banco para realizar conexões com o banco de dados.
const Banco = require('./Banco');

// Define a classe Diretor para representar a entidade Diretor.
class Diretor {
    // Construtor da classe Diretor que inicializa as propriedades.
    constructor() {
        this._idDiretor = null;  // ID do diretor, inicialmente nulo.
        this._nome = null;  // Nome do diretor.
        this._email = null;  // Email do diretor.
        this._senha = null;  // Senha do diretor.
        this._cargo = null;  // Cargo do diretor (por exemplo, "Diretor Administrativo").
    }

    // Método assíncrono para criar um novo diretor no banco de dados.
    async create() {
        const conexao = Banco.getConexao();  // Obtém a conexão com o banco de dados.
        const SQL = 'INSERT INTO diretor (nome, email, senha, cargo) VALUES (?, ?, MD5(?), ?);';

        try {
            const [result] = await conexao.promise().execute(SQL, [
                this._nome,
                this._email,
                this._senha,
                this._cargo
            ]);
            this._idDiretor = result.insertId;  // Armazena o ID gerado pelo banco de dados.
            return result.affectedRows > 0;  // Retorna true se a inserção foi bem-sucedida.
        } catch (error) {
            console.error('Erro ao criar o diretor:', error);
            return false;
        }
    }

    // Método assíncrono para excluir um diretor do banco de dados.
    async delete() {
        const conexao = Banco.getConexao();
        const SQL = 'DELETE FROM diretor WHERE idDiretor = ?;';

        try {
            const [result] = await conexao.promise().execute(SQL, [this._idDiretor]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao excluir o diretor:', error);
            return false;
        }
    }

    // Método assíncrono para atualizar os dados de um diretor no banco de dados.
    async update() {
        const conexao = Banco.getConexao();
        const SQL = 'UPDATE diretor SET nome = ?, email = ?, senha = MD5(?), cargo = ? WHERE idDiretor = ?;';

        try {
            const [result] = await conexao.promise().execute(SQL, [
                this._nome,
                this._email,
                this._senha,
                this._cargo,
                this._idDiretor
            ]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao atualizar o diretor:', error);
            return false;
        }
    }

    // Método assíncrono para ler todos os diretores do banco de dados.
    async readAll() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT * FROM diretor ORDER BY nome;';

        try {
            const [rows] = await conexao.promise().execute(SQL);
            return rows;
        } catch (error) {
            console.error('Erro ao ler diretores:', error);
            return [];
        }
    }

    // Método assíncrono para ler um diretor pelo seu ID.
    async readByID(idDiretor) {
        this._idDiretor = idDiretor;

        const conexao = Banco.getConexao();
        const SQL = 'SELECT * FROM diretor WHERE idDiretor = ?;';

        try {
            const [rows] = await conexao.promise().execute(SQL, [this._idDiretor]);
            return rows.length > 0 ? rows[0] : null;  // Retorna o diretor correspondente ao ID.
        } catch (error) {
            console.error('Erro ao ler diretor pelo ID:', error);
            return null;
        }
    }

    // Método assíncrono para verificar se um diretor já existe no banco de dados pelo email.
    async isDiretorByEmail(email) {
        const conexao = Banco.getConexao();  // Obtém a conexão com o banco de dados.
        const SQL = 'SELECT COUNT(*) AS qtd FROM diretor WHERE email = ?;';

        try {
            const [rows] = await conexao.promise().execute(SQL, [email]);
            return rows[0].qtd > 0;  // Retorna true se houver algum diretor com o mesmo email.
        } catch (error) {
            console.error('Erro ao verificar o email do diretor:', error);
            return false;
        }
    }

    // Método assíncrono para fazer login de um diretor.
    async login() {
        const conexao = Banco.getConexao(); // Obtém a conexão com o banco de dados.
        const SQL = `
            SELECT COUNT(*) AS qtd, idDiretor, nome, email, cargo
            FROM diretor 
            WHERE email = ? AND senha = MD5(?);
        `;

        try {
            // Prepara e executa a consulta SQL com parâmetros.
            const [rows] = await conexao.promise().execute(SQL, [this._email, this._senha]);

            if (rows.length > 0 && rows[0].qtd === 1) {
                const tupla = rows[0];
                // Configura os atributos do diretor.
                this._idDiretor = tupla.idDiretor;
                this._nome = tupla.nome;
                this._email = tupla.email;
                this._cargo = tupla.cargo;

                return true; // Login bem-sucedido.
            }

            return false; // Login falhou.
        } catch (error) {
            console.error('Erro ao realizar o login do diretor:', error);
            return false;
        }
    }

    // Getters e setters para as propriedades da classe.

    get idDiretor() {
        return this._idDiretor;
    }

    set idDiretor(idDiretor) {
        this._idDiretor = idDiretor;
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

    get cargo() {
        return this._cargo;
    }

    set cargo(cargo) {
        this._cargo = cargo;
    }
}

// Exporta a classe Diretor para que possa ser utilizada em outros módulos.
module.exports = Diretor;
