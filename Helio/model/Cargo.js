// Importa o módulo Banco para realizar conexões com o banco de dados.
const Banco = require('./Banco');

// Define a classe Cargo para representar a entidade Cargo.
class Cargo {
    // Construtor da classe Cargo que inicializa as propriedades.
    constructor() {
        this._idCargo = null;  // ID do cargo, inicialmente nulo.
        this._nomeCargo = null;  // Nome do cargo, inicialmente uma string vazia.
    }

    // Método assíncrono para criar um novo cargo no banco de dados.
    async create() {
        const conexao = Banco.getConexao();  // Obtém a conexão com o banco de dados.
        const SQL = 'INSERT INTO cargo (nomeCargo) VALUES (?);';  // Query SQL para inserir o nome do cargo.

        try {
            const [result] = await conexao.promise().execute(SQL, [this._nomeCargo]);  // Executa a query.
            this._idCargo = result.insertId;  // Armazena o ID gerado pelo banco de dados.
            return result.affectedRows > 0;  // Retorna true se a inserção afetou alguma linha.
        } catch (error) {
            console.error('Erro ao criar o cargo:', error);  // Exibe erro no console se houver falha.
            return false;  // Retorna false caso ocorra um erro.
        }
    }

    // Método assíncrono para excluir um cargo do banco de dados.
    async delete() {
        const conexao = Banco.getConexao();  // Obtém a conexão com o banco de dados.
        const SQL = 'DELETE FROM cargo WHERE idCargo = ?;';  // Query SQL para deletar um cargo pelo ID.

        try {
            const [result] = await conexao.promise().execute(SQL, [this._idCargo]);  // Executa a query de exclusão.
            return result.affectedRows > 0;  // Retorna true se alguma linha foi afetada (cargo deletado).
        } catch (error) {
            console.error('Erro ao excluir o cargo:', error);  // Exibe erro no console se houver falha.
            return false;  // Retorna false caso ocorra um erro.
        }
    }

    // Método assíncrono para atualizar os dados de um cargo no banco de dados.
    async update() {
        const conexao = Banco.getConexao();  // Obtém a conexão com o banco de dados.
        const SQL = 'UPDATE cargo SET nomeCargo = ? WHERE idCargo = ?;';  // Query SQL para atualizar o nome de um cargo.

        try {
            const [result] = await conexao.promise().execute(SQL, [this._nomeCargo, this._idCargo]);  // Executa a query de atualização.
            return result.affectedRows > 0;  // Retorna true se a atualização afetou alguma linha.
        } catch (error) {
            console.error('Erro ao atualizar o cargo:', error);  // Exibe erro no console se houver falha.
            return false;  // Retorna false caso ocorra um erro.
        }
    }

    // Método assíncrono para verificar se um cargo já existe no banco de dados.
    async isCargoByNomeCargo() {
        const conexao = Banco.getConexao();  // Obtém a conexão com o banco de dados.
        const SQL = 'SELECT COUNT(*) AS qtd FROM cargo WHERE nomeCargo = ?;';  // Query SQL para contar cargos com o mesmo nome.

        try {
            const [rows] = await conexao.promise().execute(SQL, [this._nomeCargo]);  // Executa a query.
            return rows[0].qtd > 0;  // Retorna true se houver algum cargo com o mesmo nome.
        } catch (error) {
            console.error('Erro ao verificar o cargo:', error);  // Exibe erro no console se houver falha.
            return false;  // Retorna false caso ocorra um erro.
        }
    }

    async isCargoById(idCargo) {
        const conexao = Banco.getConexao();  // Obtém a conexão com o banco de dados.
        const SQL = 'SELECT COUNT(*) AS qtd FROM cargo WHERE idCargo = ?;';  // Query SQL para contar cargos com o mesmo nome.
        try {
            const [rows] = await conexao.promise().execute(SQL, [idCargo]);  // Executa a query.
            return rows[0].qtd > 0;  // Retorna true se houver algum cargo com o mesmo nome.
        } catch (error) {
            console.error('Erro ao verificar o cargo:', error);  // Exibe erro no console se houver falha.
            return false;  // Retorna false caso ocorra um erro.
        }
    }

    // Método assíncrono para ler todos os cargos do banco de dados.
    async readAll() {
        const conexao = Banco.getConexao();  // Obtém a conexão com o banco de dados.
        const SQL = 'SELECT * FROM cargo ORDER BY nomeCargo;';  // Query SQL para selecionar todos os cargos ordenados pelo nome.

        try {
            const [rows] = await conexao.promise().execute(SQL);  // Executa a query de seleção.
            return rows;  // Retorna a lista de cargos.
        } catch (error) {
            console.error('Erro ao ler cargos:', error);  // Exibe erro no console se houver falha.
            return [];  // Retorna uma lista vazia caso ocorra um erro.
        }
    }

    // Método assíncrono para ler um cargo pelo seu ID.
    async readByID() {
        const conexao = Banco.getConexao();  // Obtém a conexão com o banco de dados.
        const SQL = 'SELECT * FROM cargo WHERE idCargo = ?;';  // Query SQL para selecionar um cargo pelo ID.

        try {
            const [rows] = await conexao.promise().execute(SQL, [this._idCargo]);  // Executa a query de seleção.
            return rows;  // Retorna o cargo correspondente ao ID.
        } catch (error) {
            console.error('Erro ao ler cargo pelo ID:', error);  // Exibe erro no console se houver falha.
            return null;  // Retorna null caso ocorra um erro.
        }
    }

    // Getter para obter o valor de idCargo.
    get idCargo() {
        return this._idCargo;
    }

    // Setter para definir o valor de idCargo.
    set idCargo(idCargo) {
        this._idCargo = idCargo;
        return this;  // Retorna a instância atual para permitir encadeamento de chamadas.
    }

    // Getter para obter o valor de nomeCargo.
    get nomeCargo() {
        return this._nomeCargo;
    }

    // Setter para definir o valor de nomeCargo.
    set nomeCargo(nomeCargo) {
        this._nomeCargo = nomeCargo;
        return this;  // Retorna a instância atual para permitir encadeamento de chamadas.
    }
}

// Exporta a classe Cargo para que possa ser utilizada em outros módulos.
module.exports = Cargo;
