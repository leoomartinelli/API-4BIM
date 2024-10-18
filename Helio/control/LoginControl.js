// Importa o módulo express para criação de APIs.
const express = require('express');
const Funcionario = require('../model/Funcionario');
const MeuTokenJWT = require('../model/MeuTokenJWT');

module.exports = class LoginControl {

    async login(request, response) {

        const funcionario = new Funcionario();
        funcionario.email = request.body.funcionario.email;
        funcionario.senha = request.body.funcionario.senha;

        const logou = await funcionario.login();

        if (logou == true) {
            const payloadToken = {
                email: funcionario.idFuncionario,
                role: funcionario.cargo.nomeCargo,
                name: funcionario.nomeFuncionario,
                idFuncionario: funcionario.idFuncionario
            }
            const jwt = new MeuTokenJWT();
            const token_string = jwt.gerarToken(payloadToken);

            const objResposta = {
                status: true,
                cod: 1,
                msg: 'logado com sucesso',

                funcionario: {
                    idFuncionario: funcionario.idFuncionario,
                    nome: funcionario.nomeFuncionario,
                    email: funcionario.email,
                    cargo: {
                        idCargo: funcionario.cargo.idCargo,
                        nomeCargo: funcionario.cargo.nomeCargo
                    }
                },
                token: token_string,

            }
            return response.status(200).send(objResposta);
        }else{
            const objResposta={
                status:false,
                msg:'usuário ou senha inválidos'
            }
            return response.status(401).send(objResposta);
        }


    }


};
