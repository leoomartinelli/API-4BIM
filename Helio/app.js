const express = require('express');
const path = require('path');  // Módulo para manipular caminhos de arquivo
const CargoRouter = require('./router/CargoRouter');
const FuncionarioRouter = require('./router/FuncionarioRouter');
const LoginRouter = require('./router/LoginRouter');

const app = express();

const portaServico = 8080;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'view'))); // Configura a pasta 'view' como estática

const cargoRoteador = new CargoRouter();
const funcionarioRouter = new FuncionarioRouter();
const loginRouter = new LoginRouter();


app.use('/login',
    loginRouter.createRoutes()
);

app.use('/cargos',
    cargoRoteador.createRoutes()
);

app.use('/funcionarios',
    funcionarioRouter.createRoutes()
);

// Inicia o servidor, escutando na porta definida, e exibe uma mensagem no console com a URL onde o servidor está rodando.
app.listen(portaServico, () => {
    console.log(`API rodando no endereço: http://localhost:${portaServico}/`);
});

