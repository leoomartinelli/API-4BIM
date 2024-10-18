const Aluno = require('../model/Aluno');

module.exports = class LoginControl {
    async login(request, response) {
        try {
            const { email, senha } = request.body;

            const aluno = new Aluno();
            aluno.email = email;
            aluno.senha = senha;

            const loginResult = await aluno.login();

            if (loginResult.success) {
                return response.status(200).send({
                    status: true,
                    msg: 'Login realizado com sucesso',
                    token: loginResult.token // Retorna o token para o usuário
                });
            } else {
                return response.status(401).send({
                    status: false,
                    msg: loginResult.msg
                });
            }
        } catch (error) {
            console.error('Erro no login:', error);
            return response.status(500).send({
                status: false,
                msg: 'Erro interno do servidor'
            });
        }
    }
};
