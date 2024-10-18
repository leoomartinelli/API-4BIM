// Importa o modelo Cargo para verificar se o nome já existe no banco de dados.
const Cargo = require('../model/Cargo');
// Exporta a classe CargoMiddleware, que contém funções de validação para as requisições.
module.exports = class CargoMiddleware {
    // Método para validar o nome do cargo antes de prosseguir com a criação ou atualização.
    async validar_NomeCargo(request, response, next) {

        // Recupera o nome do cargo enviado no corpo da requisição (request body).
        const nomeCargo = request.body.cargo.nomeCargo;
        // Verifica se o nome do cargo tem menos de 3 caracteres.
        if (nomeCargo.length < 3) {
            // Se o nome for inválido, cria um objeto de resposta com o status falso e a mensagem de erro.
            const objResposta = {
                status: false,
                msg: "O nome deve ter mais do que 3 letras"
            }
            // Envia a resposta com status HTTP 400 e a mensagem de erro.
            response.status(400).send(objResposta);
        } else {
            // Caso o nome seja válido, chama o próximo middleware ou a rota definida.
            next(); // Chama o próximo middleware ou rota
        }
    }
    // Método assíncrono para verificar se já existe um cargo com o mesmo nome cadastrado.
    async isNot_cargoByNomeCargo(request, response, next) {
        // Recupera o nome do cargo enviado no corpo da requisição (request body).
        const nomeCargo = request.body.cargo.nomeCargo;
        // Cria uma nova instância do modelo Cargo.
        const objCargo = new Cargo();
        // Define o nome do cargo na instância do modelo.
        objCargo.nomeCargo = nomeCargo;
        // Verifica se o cargo já existe no banco de dados chamando o método isCargo().
        const cargoExiste = await objCargo.isCargoByNomeCargo();
        // Se o cargo já existir no banco de dados, cria um objeto de resposta com o status falso e uma mensagem de erro.
        if (cargoExiste == false) {
            next(); // Chama o próximo middleware ou rota
        } else {
            const objResposta = {
                status: false,
                msg: "Não é possível cadastrar um cargo com o mesmo nome de um cargo existente"
            }
            response.status(400).send(objResposta);
        }
    }
    async isCargoById(request, response, next) {

        const idCargo = request.body.idCargo

        const objCargo = new Cargo();

        const cargoExiste = await objCargo.isCargoById(idCargo);

        if (cargoExiste == true) {
            next();

        } else {
            const objResposta = {
                status: false,
                msg: "Cargo Não Existe"
            }

            response.status(400).send(objResposta);
        }
    }
}
