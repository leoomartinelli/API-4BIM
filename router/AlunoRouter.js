
const express = require('express');

const AlunoControl = require('../control/AlunoControl');

const AlunoMiddleware = require('../middleware/AlunoMiddleware');
const JWTMiddleware = require('../middleware/JWTMiddleware');

module.exports = class AlunoRouter {

    constructor() {
        this._router = express.Router();
        this._jwtMiddleware = new JWTMiddleware();
        this._alunoControl = new AlunoControl(); 
        this._alunoMiddleware = new AlunoMiddleware();
    }
    
    createRoutes() {
        const multer = require('multer');
        const upload = multer({ dest: 'uploads/' }); // Configura o multer para armazenar os arquivos na pasta 'uploads'
        
        //Rota para cadastrar alunos a partir de um arquivo CSV
        this.router.post('/csv',
            this.jwtMiddleware.validate,
            upload.single('variavelArquivo'), // Nome da variável definida no JavaScript ou no Insomnia
            this.alunoControl.create
        );
        
        // Rota para obter todos os alunos
        
        this.router.get('/',
            this.jwtMiddleware.validate,
            this.alunoControl.readAll
        );
        
        

        // Rota para obter um aluno por ID
        this.router.get('/:idAluno',
            this.jwtMiddleware.validate,
            this.alunoControl.readAllById
        );

        // Rota para criar um novo aluno
        this.router.post('/',
            this.jwtMiddleware.validate,
            this.alunoMiddleware.validar_NomeAluno,
            this.alunoMiddleware.isNotAlunoByEmail,
            this.alunoControl.create
        );

        // Rota para excluir um aluno por ID
        this.router.delete('/:idAluno',
            this.jwtMiddleware.validate,
            this.alunoControl.delete
        );

        // Rota para atualizar um aluno por ID
        this.router.put('/:idAluno',
            this.jwtMiddleware.validate,
            this.alunoControl.update
        );

        return this.router;
    }

    get router() {
        return this._router;
    }

    // Setter para _router
    set router(newRouter) {
        this._router = newRouter;
    }

    // Getter para _jwtMiddleware
    get jwtMiddleware() {
        return this._jwtMiddleware;
    }

    // Setter para _jwtMiddleware
    set jwtMiddleware(newJwtMiddleware) {
        this._jwtMiddleware = newJwtMiddleware;
    }

    // Getter para _alunoControl
    get alunoControl() {
        return this._alunoControl;
    }

    // Setter para _alunoControl
    set alunoControl(newAlunoControl) {
        this._alunoControl = newAlunoControl;
    }

    // Getter para _alunoMiddleware
    get alunoMiddleware() {
        return this._alunoMiddleware;
    }

    // Setter para _alunoMiddleware
    set alunoMiddleware(newAlunoMiddleware) {
        this._alunoMiddleware = newAlunoMiddleware;
    }
}
