
const express = require('express');
const CargoControl = require('../control/CargoControl');
const CargoMiddleware = require('../middleware/CargoMiddleware');
const FuncionarioMiddleware = require('../middleware/FuncionarioMiddleware');
const FuncionarioControl = require('../control/FuncionarioControl');
const JwtMiddleware = require('../middleware/JWTMiddleware');

module.exports = class FuncionarioRouter {
    constructor() {
        this._router = express.Router();
        this._cargoControl = new CargoControl();
        this._cargoMiddleware = new CargoMiddleware();
        this._funcionarioMiddleware = new FuncionarioMiddleware();
        this._funcionarioControl = new FuncionarioControl();
        this._jwtMiddleware = new JwtMiddleware();
    }
    createRoutes() {
        this.router.get('/',
            this.jwtMiddleware.validate,
            this.funcionarioControl.readAll
        );

        this.router.get('/:idFuncionario',
            this.jwtMiddleware.validate,
            this.funcionarioControl.readById
        );

        this.router.post('/',
            this.jwtMiddleware.validate,
            this.funcionarioMiddleware.validate_nomeFuncionario,
            this.funcionarioMiddleware.validate_emailFuncionario,
            this.funcionarioMiddleware.validate_senhaFuncionario,
            this.funcionarioMiddleware.isNotEmailCadastrado,
            this.funcionarioControl.create
        );

        this.router.delete('/:idFuncionario',
            this.jwtMiddleware.validate,
            this.funcionarioControl.delete
        );

        this.router.put('/:idFuncionario',
            this.jwtMiddleware.validate,
            this.funcionarioMiddleware.validate_nomeFuncionario,
            this.funcionarioMiddleware.validate_emailFuncionario,
            this.funcionarioMiddleware.validate_senhaFuncionario,
            this.funcionarioControl.update
        );

        return this._router;
    }

    get router() {
        return this._router;
    }

    set router(newRouter) {
        this._router = newRouter;
    }

    // Getter e Setter para _cargoControl
    get cargoControl() {
        return this._cargoControl;
    }

    set cargoControl(newCargoControl) {
        this._cargoControl = newCargoControl;
    }

    // Getter e Setter para _cargoMiddleware
    get cargoMiddleware() {
        return this._cargoMiddleware;
    }

    set cargoMiddleware(newCargoMiddleware) {
        this._cargoMiddleware = newCargoMiddleware;
    }

    // Getter e Setter para _funcionarioMiddleware
    get funcionarioMiddleware() {
        return this._funcionarioMiddleware;
    }

    set funcionarioMiddleware(newFuncionarioMiddleware) {
        this._funcionarioMiddleware = newFuncionarioMiddleware;
    }

    // Getter e Setter para _funcionarioControl
    get funcionarioControl() {
        return this._funcionarioControl;
    }

    set funcionarioControl(newFuncionarioControl) {
        this._funcionarioControl = newFuncionarioControl;
    }

    // Getter e Setter para _JWTMiddleware
    get jwtMiddleware() {
        return this._jwtMiddleware;
    }

    set jwtMiddleware(newJWTMiddleware) {
        this._jwtMiddleware = newJWTMiddleware;
    }
}
