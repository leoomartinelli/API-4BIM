const express = require('express');
const DiretorControl = require('../control/DiretoriaControl');
const DiretorMiddleware = require('../middleware/DiretorMiddleware');
const JwtMiddleware = require('../middleware/JWTMiddleware');

module.exports = class DiretoriaRouter {
    constructor() {
        this._router = express.Router();
        this._diretorControl = new DiretorControl();
        this._diretorMiddleware = new DiretorMiddleware();
        this._jwtMiddleware = new JwtMiddleware();
    }

    createRoutes() {
        // Rota para obter todos os diretores
        this.router.get('/',
            this.jwtMiddleware.validate,
            this.diretorControl.readAll
        );

        // Rota para obter um diretor por ID
        this.router.get('/:idDiretor',
            this.jwtMiddleware.validate,
            this.diretorControl.readById
        );

        // Rota para criar um novo diretor
        this.router.post('/',
            this.jwtMiddleware.validate,
            this.diretorMiddleware.validate_nome,
            this.diretorMiddleware.validate_email,
            this.diretorMiddleware.validate_senha,
            this.diretorMiddleware.isNotEmailCadastrado,
            this.diretorControl.create
        );

        // Rota para excluir um diretor por ID
        this.router.delete('/:idDiretor',
            this.jwtMiddleware.validate,
            this.diretorControl.delete
        );

        // Rota para atualizar um diretor por ID
        this.router.put('/:idDiretor',
            this.jwtMiddleware.validate,
            this.diretorMiddleware.validate_nome,
            this.diretorMiddleware.validate_email,
            this.diretorMiddleware.validate_senha,
            this.diretorControl.update
        );

        return this._router;
    }

    get router() {
        return this._router;
    }

    set router(newRouter) {
        this._router = newRouter;
    }

    // Getter e Setter para _diretorControl
    get diretorControl() {
        return this._diretorControl;
    }

    set diretorControl(newDiretorControl) {
        this._diretorControl = newDiretorControl;
    }

    // Getter e Setter para _diretorMiddleware
    get diretorMiddleware() {
        return this._diretorMiddleware;
    }

    set diretorMiddleware(newDiretorMiddleware) {
        this._diretorMiddleware = newDiretorMiddleware;
    }

    // Getter e Setter para _jwtMiddleware
    get jwtMiddleware() {
        return this._jwtMiddleware;
    }

    set jwtMiddleware(newJWTMiddleware) {
        this._jwtMiddleware = newJWTMiddleware;
    }
}
