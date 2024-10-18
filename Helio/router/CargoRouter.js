
const express = require('express');

const CargoControl = require('../control/CargoControl');

const CargoMiddleware = require('../middleware/CargoMiddleware');
const JWTMiddleware = require('../middleware/JWTMiddleware');

module.exports = class CargoRouter {

    constructor() {
        this._router = express.Router();
        this._jwtMiddleware = new JWTMiddleware();
        this._cargoControl = new CargoControl();
        this._cargoMiddleware = new CargoMiddleware();
    }

    createRoutes() {
        const multer = require('multer');
        const upload = multer({ dest: 'uploads/' }); // Configura o multer para armazenar os arquivos na pasta 'uploads'
        this.router.post('/csv',
            this.jwtMiddleware.validate,
            upload.single('variavelArquivo'),//nome da variavel definida no javascript ou no insominia
            this.cargoControl.createByCSV
        );

        this.router.get('/',
            this.jwtMiddleware.validate,
            this.cargoControl.readAll
        );

        this.router.get('/:idCargo',
            this.jwtMiddleware.validate,
            this.cargoControl.realAllById
        );

        this.router.post('/',
            this.jwtMiddleware.validate,
            this.cargoMiddleware.validar_NomeCargo,
            this.cargoMiddleware.isNot_cargoByNomeCargo,
            this.cargoControl.create
        );

        this.router.delete('/:idCargo',
            this.jwtMiddleware.validate,
            this.cargoControl.delete
        );

        this.router.put('/:idCargo',
            this.jwtMiddleware.validate,
            this.cargoControl.update
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

    // Getter para _cargoControl
    get cargoControl() {
        return this._cargoControl;
    }

    // Setter para _cargoControl
    set cargoControl(newCargoControl) {
        this._cargoControl = newCargoControl;
    }

    // Getter para _cargoMiddleware
    get cargoMiddleware() {
        return this._cargoMiddleware;
    }

    // Setter para _cargoMiddleware
    set cargoMiddleware(newCargoMiddleware) {
        this._cargoMiddleware = newCargoMiddleware;
    }
}
