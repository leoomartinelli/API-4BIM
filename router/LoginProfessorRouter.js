
const express = require('express');

const LoginControlProfessor = require('../control/LoginControProfessor');


module.exports = class LoginProfessorRouter {
  
    constructor() {
        
        this._router = express.Router();
        this._loginProfessorControl =  new LoginControlProfessor();
    }

    createRoutes() {

        this._router.post('/',
            this._loginProfessorControl.loginProfessor
        );

        return this._router;
    }
}
