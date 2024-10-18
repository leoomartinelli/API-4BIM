const Professor = require('../model/Professor');

module.exports = class ProfessorMiddleware {

    // Método para verificar se o email já está cadastrado
    async isNotEmailCadastrado(request, response, next) {
        const email = request.body.professor.email;
        const professor = new Professor();
        const is = await professor.isProfessorByEmail(email);

        if (!is) {
            next();
        } else {
            const objResposta = {
                status: false,
                msg: "Já existe um professor cadastrado com este e-mail"
            }
            response.status(400).send(objResposta);
        }
    }

    // Método para validar o nome do professor
    async validate_nomeProfessor(request, response, next) {
        const nomeProfessor = request.body.professor.nome;

        if (nomeProfessor.length < 3) {
            const objResposta = {
                status: false,
                msg: "O nome deve ter mais do que 3 letras"
            }
            response.status(400).send(objResposta);
        } else {
            next();
        }
    }

    // Método para validar o email do professor
    async validate_emailProfessor(request, response, next) {
        const email = request.body.professor.email;

        // Verifica se o e-mail contém "@" e "."
        const atIndex = email.indexOf('@');
        const dotIndex = email.lastIndexOf('.');

        // Verifica se o "@" vem antes do ".", se ambos existem e se há caracteres suficientes antes e depois
        if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex + 2 >= email.length) {
            const objResposta = {
                status: false,
                msg: "E-mail inválido. Por favor, insira um e-mail válido."
            };
            return response.status(400).send(objResposta);
        }

        // Se todas as verificações passarem, o e-mail é considerado válido
        next();
    }

    // Método para validar a senha do professor
    async validate_senhaProfessor(request, response, next) {
        const senha = request.body.professor.senha;

        // Verifica se a senha tem pelo menos 6 caracteres
        if (senha.length < 6) {
            return response.status(400).send({
                status: false,
                msg: "A senha deve ter no mínimo 6 caracteres."
            });
        }

        // Verifica se a senha contém pelo menos uma letra
        let temLetra = false;
        for (let i = 0; i < senha.length; i++) {
            if (isNaN(senha[i])) {  // isNaN verifica se o caractere não é um número
                temLetra = true;
                break;
            }
        }

        if (!temLetra) {
            return response.status(400).send({
                status: false,
                msg: "A senha deve conter pelo menos uma letra."
            });
        }

        // Verifica se a senha contém pelo menos um caractere especial
        const caracteresEspeciais = "!@#$%^&*()_+-=[]{}|;:'\",.<>?/`~";
        let temCaractereEspecial = false;

        for (let i = 0; i < senha.length; i++) {
            if (caracteresEspeciais.includes(senha[i])) {
                temCaractereEspecial = true;
                break;
            }
        }

        if (!temCaractereEspecial) {
            return response.status(400).send({
                status: false,
                msg: "A senha deve conter pelo menos um caractere especial."
            });
        }

        // Se a senha atender a todos os critérios, continua para o próximo middleware
        next();
    }

}
