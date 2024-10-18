const Diretor = require('../model/Diretor');

module.exports = class DiretorMiddleware {

    // Verifica se o nome do diretor é válido
    async validate_nome(request, response, next) {
        const nome = request.body.diretor.nome;

        if (nome.length < 3) {
            return response.status(400).send({
                status: false,
                msg: "O nome deve ter pelo menos 3 caracteres."
            });
        }

        next(); // Continua para a próxima operação
    }

    // Verifica se o email do diretor é válido
    async validate_email(request, response, next) {
        const email = request.body.diretor.email;

        // Verifica se o e-mail contém "@" e "."
        const atIndex = email.indexOf('@');
        const dotIndex = email.lastIndexOf('.');

        // Verifica se o "@" vem antes do ".", se ambos existem e se há caracteres suficientes antes e depois
        if (atIndex < 1 || dotIndex < atIndex + 2 || dotIndex + 2 >= email.length) {
            return response.status(400).send({
                status: false,
                msg: "E-mail inválido. Por favor, insira um e-mail válido."
            });
        }

        next(); // Continua para a próxima operação
    }

    // Verifica se a senha do diretor é válida
    async validate_senha(request, response, next) {
        const senha = request.body.diretor.senha;

        // Verifica se a senha tem pelo menos 6 caracteres
        if (senha.length < 6) {
            return response.status(400).send({
                status: false,
                msg: "A senha deve ter no mínimo 6 caracteres."
            });
        }

        // Verifica se a senha contém pelo menos uma letra
        if (!/[a-zA-Z]/.test(senha)) {
            return response.status(400).send({
                status: false,
                msg: "A senha deve conter pelo menos uma letra."
            });
        }

        // Verifica se a senha contém pelo menos um caractere especial
        const caracteresEspeciais = /[!@#$%^&*(),.?":{}|<>]/;
        if (!caracteresEspeciais.test(senha)) {
            return response.status(400).send({
                status: false,
                msg: "A senha deve conter pelo menos um caractere especial."
            });
        }

        next(); // Continua para a próxima operação
    }

    // Verifica se já existe um diretor cadastrado com o mesmo email
    async isNotEmailCadastrado(request, response, next) {
        const email = request.body.diretor.email;
        const diretor = new Diretor();
        
        try {
            const emailExistente = await diretor.isDiretorByEmail(email);

            if (emailExistente) {
                return response.status(400).send({
                    status: false,
                    msg: "Já existe um diretor cadastrado com este e-mail."
                });
            }

            next(); // Continua para a próxima operação
        } catch (error) {
            console.error('Erro ao verificar email:', error);
            return response.status(500).send({
                status: false,
                msg: "Erro ao verificar email. Tente novamente mais tarde."
            });
        }
    }
}
