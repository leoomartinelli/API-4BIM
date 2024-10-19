const Turma = require('../model/Turma');

module.exports = class TurmaMiddleware {

    async isNotNomeCadastrado(request, response, next) {
        const nomeTurma = request.body.turma.nomeTurma;
        const turma = new Turma();

        try {
            const nomeExistente = await turma.isTurmaByNome(nomeTurma);

            if (nomeExistente) {
                return response.status(400).send({
                    status: false,
                    msg: "Já existe uma turma cadastrada com este nome."
                });
            }

            next(); // Continua para a próxima operação
        } catch (error) {
            console.error('Erro ao verificar o nome da turma:', error);
            return response.status(500).send({
                status: false,
                msg: "Erro ao verificar nome da turma. Tente novamente mais tarde."
            });
        }
    }
    // Valida se o nome da turma foi fornecido
    async validate_nome(request, response, next) {
        const nomeTurma = request.body.turma.nomeTurma;

        if (!nomeTurma || nomeTurma.length < 3) {
            return response.status(400).send({
                status: false,
                msg: "O nome da turma deve ter pelo menos 3 caracteres."
            });
        }

        next(); // Continua para a próxima operação
    }

    // Verifica se o professor foi fornecido ao criar a turma
    async validate_professor(request, response, next) {
        const idProfessor = request.body.turma.idProfessor;

        if (!idProfessor) {
            return response.status(400).send({
                status: false,
                msg: "É necessário associar um professor à turma."
            });
        }

        next(); // Continua para a próxima operação
    }

    // Verifica se já existe uma turma com o mesmo nome
    async isNotNomeCadastrado(request, response, next) {
        const nomeTurma = request.body.turma.nomeTurma;
        const turma = new Turma();

        try {
            const nomeExistente = await turma.isTurmaByNome(nomeTurma);

            if (nomeExistente) {
                return response.status(400).send({
                    status: false,
                    msg: "Já existe uma turma cadastrada com este nome."
                });
            }

            next(); // Continua para a próxima operação
        } catch (error) {
            console.error('Erro ao verificar o nome da turma:', error);
            return response.status(500).send({
                status: false,
                msg: "Erro ao verificar nome. Tente novamente mais tarde."
            });
        }
    }
}
