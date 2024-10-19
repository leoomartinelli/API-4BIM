// Importa o modelo Aluno para verificar se o aluno já existe no banco de dados.
const Aluno = require('../model/Aluno');

// Exporta a classe AlunoMiddleware, que contém funções de validação para as requisições.
module.exports = class AlunoMiddleware {

    // Método para validar o nome do aluno antes de prosseguir com a criação ou atualização.
    async validar_NomeAluno(request, response, next) {
        // Recupera o nome do aluno enviado no corpo da requisição (request body).
        const nomeAluno = request.body.aluno.nome;

        // Verifica se o nome do aluno tem menos de 3 caracteres.
        if (nomeAluno.length < 3) {
            // Se o nome for inválido, cria um objeto de resposta com o status falso e a mensagem de erro.
            const objResposta = {
                status: false,
                msg: "O nome deve ter mais do que 3 letras"
            };
            // Envia a resposta com status HTTP 400 e a mensagem de erro.
            response.status(400).send(objResposta);
        } else {
            // Caso o nome seja válido, chama o próximo middleware ou a rota definida.
            next(); // Chama o próximo middleware ou rota
        }
    }

    // Método assíncrono para verificar se já existe um aluno com o mesmo email cadastrado.
    async isNotAlunoByEmail(request, response, next) {
        // Recupera o email do aluno enviado no corpo da requisição (request body).
        const emailAluno = request.body.aluno.email;

        // Cria uma nova instância do modelo Aluno.
        const objAluno = new Aluno();
        // Define o email do aluno na instância do modelo.
        objAluno.email = emailAluno;

        // Verifica se o aluno já existe no banco de dados chamando o método isAlunoByEmail().
        const alunoExiste = await objAluno.isAlunoByEmail();

        // Se o aluno não existir no banco de dados, chama o próximo middleware ou rota.
        if (!alunoExiste) {
            next(); // Chama o próximo middleware ou rota
        } else {
            const objResposta = {
                status: false,
                msg: "Não é possível cadastrar um aluno com o mesmo email de um aluno existente"
            };
            response.status(400).send(objResposta);
        }
    }

    // Método assíncrono para verificar se existe um aluno pelo ID.
    async isAlunoById(request, response, next) {
        // Recupera o ID do aluno enviado no corpo da requisição (request body).
        const idAluno = request.body.idAluno;

        // Cria uma nova instância do modelo Aluno.
        const objAluno = new Aluno();

        // Verifica se o aluno existe no banco de dados chamando o método isAlunoById().
        const alunoExiste = await objAluno.isAlunoById(idAluno);

        // Se o aluno existir, chama o próximo middleware ou rota.
        if (alunoExiste) {
            next();
        } else {
            const objResposta = {
                status: false,
                msg: "Aluno não encontrado"
            };
            response.status(400).send(objResposta);
        }
    }

    async validate_idTurma(request, response, next) {
        const idTurma = request.body.aluno.idTurma;
    
        if (!idTurma) {
            return response.status(400).send({
                status: false,
                msg: 'O campo idTurma é obrigatório.'
            });
        }
    
        next();  // Se o idTurma foi fornecido, continua para a próxima operação
    }
    
};
