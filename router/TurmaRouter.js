const express = require('express');
const TurmaControl = require('../control/TurmaControl');
const TurmaMiddleware = require('../middleware/TurmaMiddleware');
const JwtMiddleware = require('../middleware/JWTMiddleware');

module.exports = class TurmaRouter {
    constructor() {
        this._router = express.Router();
        this._turmaControl = new TurmaControl();
        this._turmaMiddleware = new TurmaMiddleware();
        this._jwtMiddleware = new JwtMiddleware();
    }

    createRoutes() {
        // Rota para obter todas as turmas
        this.router.get('/',
            this.jwtMiddleware.validate,
            this.turmaControl.readAll
        );

        // Rota para obter uma turma por ID
        this.router.get('/:idTurma',
            this.jwtMiddleware.validate,
            this.turmaControl.readById
        );

        // Rota para criar uma nova turma
        this.router.post('/',
            this.jwtMiddleware.validate,
            this.turmaMiddleware.validate_nome,  // Valida o nome da turma
            this.turmaMiddleware.isNotNomeCadastrado,  // Verifica se o nome já está cadastrado
            this.turmaControl.create
        );

        // Rota para excluir uma turma por ID
        this.router.delete('/:idTurma',
            this.jwtMiddleware.validate,
            this.turmaControl.delete
        );

        // Rota para atualizar uma turma por ID
        this.router.put('/:idTurma',
            this.jwtMiddleware.validate,
            this.turmaMiddleware.validate_nome,  // Valida o nome da turma
            this.turmaControl.update
        );

        return this._router;
    }

    get router() {
        return this._router;
    }

    set router(newRouter) {
        this._router = newRouter;
    }

    // Getter e Setter para _turmaControl
    get turmaControl() {
        return this._turmaControl;
    }

    set turmaControl(newTurmaControl) {
        this._turmaControl = newTurmaControl;
    }

    // Getter e Setter para _turmaMiddleware
    get turmaMiddleware() {
        return this._turmaMiddleware;
    }

    set turmaMiddleware(newTurmaMiddleware) {
        this._turmaMiddleware = newTurmaMiddleware;
    }

    // Getter e Setter para _jwtMiddleware
    get jwtMiddleware() {
        return this._jwtMiddleware;
    }

    set jwtMiddleware(newJWTMiddleware) {
        this._jwtMiddleware = newJWTMiddleware;
    }
}
