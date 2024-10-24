const Professor = require('../model/Professor');

module.exports = class LoginControlProfessor {
    async loginProfessor(request, response) {
        try {
            const { email, senha } = request.body;

            if (email === 'admin@admin.com' && senha === 'admin123@') {
                // Se for admin, redireciona para uma página de administrador
                return response.status(200).send({
                    status: true,
                    msg: 'Login realizado como Administrador',
                    redirect: 'Admin.html' // Redireciona para a página de administrador
                });
            }

            const professor = new Professor();
            professor.email = email;
            professor.senha = senha;

            // Chama o método de login do Professor
            const loginResult = await professor.login();

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
            console.error('Erro no login do professor:', error);
            return response.status(500).send({
                status: false,
                msg: 'Erro interno do servidor'
            });
        }
    }
};