// Importa o módulo Banco para realizar conexões com o banco de dados.
const Banco = require('./Banco');

// Define a classe Cargo para utilizar na relação entre Funcionario e Cargo.
const Cargo = require('./Cargo');

// Define a classe Funcionario para representar a entidade Funcionario.
class Funcionario {
    // Construtor da classe Funcionario que inicializa as propriedades.
    constructor() {
        this._idFuncionario = null;  // ID do funcionário, inicialmente nulo.
        this._nomeFuncionario = null;  // Nome do funcionário.
        this._email = null;  // Email do funcionário.
        this._senha = null;  // Senha do funcionário.
        this._recebeValeTransporte = null;  // Indica se o funcionário recebe vale-transporte.
        this._cargo = new Cargo();  // Cargo associado ao funcionário.
    }

    // Método assíncrono para criar um novo funcionário no banco de dados.
    async create() {
        const conexao = Banco.getConexao();  // Obtém a conexão com o banco de dados.
        const SQL = 'INSERT INTO funcionario (nomeFuncionario, email, senha, recebeValeTransporte, Cargo_idCargo) VALUES (?, ?, ?, ?, ?);';

        try {
            const [result] = await conexao.promise().execute(SQL, [this._nomeFuncionario, this._email, this._senha, this._recebeValeTransporte, this._cargo.idCargo]);
            this._idFuncionario = result.insertId;  // Armazena o ID gerado pelo banco de dados.
            return result.affectedRows > 0;  // Retorna true se a inserção foi bem-sucedida.
        } catch (error) {
            console.error('Erro ao criar o funcionário:', error);
            return false;
        }
    }

    // Método assíncrono para excluir um funcionário do banco de dados.
    async delete() {
        const conexao = Banco.getConexao();
        const SQL = 'DELETE FROM funcionario WHERE idFuncionario = ?;';

        try {
            const [result] = await conexao.promise().execute(SQL, [this._idFuncionario]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao excluir o funcionário:', error);
            return false;
        }
    }

    // Método assíncrono para atualizar os dados de um funcionário no banco de dados.
    async update() {
        const conexao = Banco.getConexao();
        const SQL = 'UPDATE funcionario SET nomeFuncionario = ?, email = ?, senha = ?, recebeValeTransporte = ?, Cargo_idCargo = ? WHERE idFuncionario = ?;';
        console.log([this._nomeFuncionario, this._email, this._senha, this._recebeValeTransporte, this._cargo.idCargo, this._idFuncionario]);
        try {
            const [result] = await conexao.promise().execute(SQL, [this._nomeFuncionario, this._email, this._senha, this._recebeValeTransporte, this._cargo.idCargo, this._idFuncionario]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Erro ao atualizar o funcionário:', error);
            return false;
        }
    }

    // Método assíncrono para ler todos os funcionários do banco de dados.
    async readAll() {
        const conexao = Banco.getConexao();
        const SQL = 'SELECT * FROM funcionario join cargo on cargo_idCargo = idcargo ORDER BY nomeFuncionario;';

        try {
            const [rows] = await conexao.promise().execute(SQL);
            return rows;
        } catch (error) {
            console.error('Erro ao ler funcionários:', error);
            return [];
        }
    }

    // Método assíncrono para ler um funcionário pelo seu ID.
    async readByID(idFuncionario) {
        this._idFuncionario = idFuncionario;

        const conexao = Banco.getConexao();
        const SQL = 'SELECT * FROM funcionario join cargo on idCargo = cargo_idCargo WHERE idFuncionario = ?;';
        try {
            const [rows] = await conexao.promise().execute(SQL, [this._idFuncionario]);
            return rows;
        } catch (error) {
            console.error('Erro ao ler funcionário pelo ID:', error);
            return null;
        }
    }

    async isFuncionarioByEmail(email) {
        const conexao = Banco.getConexao();  // Obtém a conexão com o banco de dados.

        const SQL = 'SELECT COUNT(*) AS qtd FROM funcionario WHERE email = ?;';  
        try {
            const [rows] = await conexao.promise().execute(SQL, [email]);  // Executa a query.
            return rows[0].qtd > 0;  // Retorna true se houver algum email no banco
        } catch (error) {
            console.error('Erro ao verificar o email:', error);  // Exibe erro no console se houver falha.
            return false;  // Retorna false caso ocorra um erro.
        }
    }
    async login() {
        const conexao = Banco.getConexao(); // Obtém a conexão com o banco de dados.
        const SQL = `
            SELECT COUNT(*) AS qtd, idFuncionario, nomeFuncionario, email, idCargo, nomeCargo
            FROM funcionario 
            JOIN cargo ON Cargo_idCargo = idCargo
            WHERE email = ? AND senha = MD5(?);
        `; // Query SQL para selecionar o funcionário com base no email e senha.

        try {
            // Prepara e executa a consulta SQL com parâmetros.
            const [rows] = await conexao.promise().execute(SQL, [this._email, this._senha]);

            if (rows.length > 0 && rows[0].qtd === 1) {
                const tupla = rows[0];
                // Configura os atributos do funcionário.
                this._idFuncionario = tupla.idFuncionario;
                this._nomeFuncionario = tupla.nomeFuncionario;
                this._email = tupla.email;
                this._cargo.idCargo = tupla.idCargo;
                this._cargo.nomeCargo = tupla.nomeCargo;

                return true; // Login bem-sucedido.
            }

            return false; // Login falhou.
        } catch (error) {
            console.error('Erro ao realizar o login:', error); // Exibe erro no console se houver falha.
            return false; // Retorna false caso ocorra um erro.
        }
    }

    // Getters e setters para as propriedades da classe.

    get idFuncionario() {
        return this._idFuncionario;
    }

    set idFuncionario(idFuncionario) {
        this._idFuncionario = idFuncionario;

    }

    get nomeFuncionario() {
        return this._nomeFuncionario;
    }

    set nomeFuncionario(nomeFuncionario) {
        this._nomeFuncionario = nomeFuncionario;

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

    get recebeValeTransporte() {
        return this._recebeValeTransporte;
    }

    set recebeValeTransporte(recebeValeTransporte) {
        this._recebeValeTransporte = recebeValeTransporte;
    }

    get cargo() {
        return this._cargo;
    }

    set cargo(cargo) {
        this._cargo = cargo;
    }
}

// Exporta a classe Funcionario para que possa ser utilizada em outros módulos.
module.exports = Funcionario;
