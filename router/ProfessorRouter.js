const express = require('express');
const ProfessorControl = require('../control/ProfessorControl');
const ProfessorMiddleware = require('../middleware/ProfessorMiddleware');
const JwtMiddleware = require('../middleware/JWTMiddleware');

module.exports = class ProfessorRouter {
    constructor() {
        this._router = express.Router();
        this._professorControl = new ProfessorControl();
        this._professorMiddleware = new ProfessorMiddleware();
        this._jwtMiddleware = new JwtMiddleware();
    }

    createRoutes() {
        // Rota para obter todos os professores
        this.router.get('/',
            this.jwtMiddleware.validate,
            this.professorControl.readAll
        );

        // Rota para obter um professor por ID
        this.router.get('/:idProfessor',
            this.jwtMiddleware.validate,
            this.professorControl.readById
        );

        // Rota para criar um novo professor
        this.router.post('/',
            this.jwtMiddleware.validate,
            this.professorMiddleware.validate_emailProfessor,
            this.professorMiddleware.validate_nomeProfessor,
            this.professorMiddleware.validate_senhaProfessor,
            this.professorMiddleware.isNotEmailCadastrado,
            this.professorControl.create
        );

        // Rota para excluir um professor por ID
        this.router.delete('/:idProfessor',
            this.jwtMiddleware.validate,
            this.professorControl.delete
        );

        // Rota para atualizar um professor por ID
        this.router.put('/:idProfessor',
            this.jwtMiddleware.validate,
            this.professorMiddleware.validate_nomeProfessor,
            this.professorMiddleware.validate_emailProfessor,
            this.professorMiddleware.validate_senhaProfessor,
            this.professorControl.update
        );

        return this._router;
    }

    get router() {
        return this._router;
    }

    set router(newRouter) {
        this._router = newRouter;
    }

    // Getter e Setter para _professorControl
    get professorControl() {
        return this._professorControl;
    }

    set professorControl(newProfessorControl) {
        this._professorControl = newProfessorControl;
    }

    // Getter e Setter para _professorMiddleware
    get professorMiddleware() {
        return this._professorMiddleware;
    }

    set professorMiddleware(newProfessorMiddleware) {
        this._professorMiddleware = newProfessorMiddleware;
    }

    // Getter e Setter para _JWTMiddleware
    get jwtMiddleware() {
        return this._jwtMiddleware;
    }

    set jwtMiddleware(newJWTMiddleware) {
        this._jwtMiddleware = newJWTMiddleware;
    }
}
