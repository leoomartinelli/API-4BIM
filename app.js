const express = require('express');
const path = require('path');  // Módulo para manipular caminhos de arquivo

// Importando os roteadores
const LoginRouter = require('./router/LoginRouter');
const AlunoRouter = require('./router/AlunoRouter');
const ProfessorRouter = require('./router/ProfessorRouter');
const TurmaRouter = require('./router/TurmaRouter');
const MeuTokenJWT = require('./model/MeuTokenJWT');


const app = express();
const portaServico = 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'view'))); // Configura a pasta 'view' como estática

// Instanciando os roteadores
const loginRouter = new LoginRouter();
const alunoRouter = new AlunoRouter();
const professorRouter = new ProfessorRouter();
const turmaRouter = new TurmaRouter();

app.post('/token/novo', (req, res) => {
    const meuToken = new MeuTokenJWT();

    // Supondo que você tenha um usuário já definido, gere um novo token
    const payload = {
        email: "maria.souza@escola.com",
        role: "admin",
        name: "Professora Maria",
        idFuncionario: 1  // Usar ID real ou fictício
    };

    const novoToken = meuToken.gerarToken(payload);

    res.status(200).send({
        status: true,
        token: novoToken
    });
});


// Definindo as rotas para cada roteador
app.use('/login',
    loginRouter.createRoutes()
);

app.use('/alunos',
    alunoRouter.createRoutes()
);

app.use('/professores',
    professorRouter.createRoutes()
);

app.use('/turmas',
    turmaRouter.createRoutes()
);

// Inicia o servidor, escutando na porta definida, e exibe uma mensagem no console com a URL onde o servidor está rodando.
app.listen(portaServico, () => {
    console.log(`API rodando no endereço: http://localhost:${portaServico}/`);
});
