const Professor = require('../model/Professor');

module.exports = class LoginControlProfessor {
    async loginProfessor(request, response) {
        try {
            const { email, senha } = request.body;

            // Verificação de administrador
            if (email === 'admin@admin.com' && senha === 'admin123@') {
                const professor = new Professor();
                return response.status(200).send({
                    status: true,
                    msg: 'Login realizado como Administrador',
                    token: professor.login.token,
                    redirect: 'admin.html' // Redireciona para a página de administrador
                });
            }

            // Autenticação de professor
            const professor = new Professor();
            professor.email = email;
            professor.senha = senha;

            // Executa o login do professor
            const loginResult = await professor.login();

            if (loginResult.success) {
                return response.status(200).send({
                    status: true,
                    msg: 'Login realizado com sucesso',
                    token: loginResult.token, // Retorna o token para o usuário
                    redirect: 'Professor.html' // Redireciona para a página do professor
                });
            } else {
                return response.status(401).send({
                    status: false,
                    msg: 'Credenciais inválidas'
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
