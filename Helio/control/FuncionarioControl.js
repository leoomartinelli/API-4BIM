const express = require('express');
const Funcionario = require('../model/Funcionario');

module.exports = class FuncionarioControl {
    async login(request, response) {

        const funcionario = new Funcionario();

        funcionario.email = request.body.funcionario.email
        funcionario.senha = request.body.funcionario.senha

        const logou = funcionario.login();
        if (logou == true) {
            const objResposta = {
                cod: 1,
                status: logou,
                msg: 'logado com sucesso'
            };
            response.status(200).send(objResposta);
        } else {
            const objResposta = {
                cod: 2,
                status: isCreated,
                msg: "erro ao efetuar login"
            };
            response.status(401).send(objResposta);
        }
    }

    async readAll(request, response) {
        const funcionario = new Funcionario();
        const dadosFuncionarios = await funcionario.readAll();
        const objResposta = {
            cod: 1,
            status: true,
            funcionarios: dadosFuncionarios
        }
        response.status(200).send(objResposta);

    }

    async readById(request, response) {
        const funcionario = new Funcionario();
        const idFuncionario = request.params.idFuncionario

        const dadosFuncionarios = await funcionario.readByID(idFuncionario);
        const objResposta = {
            cod: 1,
            status: true,
            funcionarios: dadosFuncionarios
        }
        response.status(200).send(objResposta);
    }

    async create(request, response) {
        const funcionario = new Funcionario();

        funcionario.nomeFuncionario = request.body.funcionario.nomeFuncionario;
        funcionario.email = request.body.funcionario.email;
        funcionario.senha = request.body.funcionario.senha;
        funcionario.recebeValeTransporte = request.body.funcionario.recebeValeTransporte;
        funcionario.cargo.idCargo = request.body.funcionario.Cargo_idCargo;

        const cadastrou = await funcionario.create();
        if (cadastrou == true) {
            const objResposta = {
                cod: 1,
                status: true,
                funcionarios: [{
                    "funcionario": {
                        "idFuncionario": funcionario.idFuncionario,
                        "nomeFuncionario": funcionario.nomeFuncionario,
                        "email": funcionario.email,
                        "recebeValeTransporte": funcionario.recebeValeTransporte,
                        "Cargo_idCargo": funcionario.cargo.idCargo
                    }
                }]
            }
            response.status(201).send(objResposta);
        } else {
            const objResposta = {
                cod: 1,
                status: false,
                msg: "Falha ao cadastrar funcionário",
                funcionarios: [{
                    "funcionario": {
                        "idFuncionario": funcionario.idFuncionario,
                        "nomeFuncionario": funcionario.nomeFuncionario,
                        "email": funcionario.email,
                        "recebeValeTransporte": funcionario.recebeValeTransporte,
                        "Cargo_idCargo": funcionario.cargo.idCargo
                    }
                }]
            }
            response.status(200).send(objResposta);
        }
    }

    async update(request, response) {

        const funcionario = new Funcionario();

        funcionario.idFuncionario = request.params.idFuncionario
        funcionario.nomeFuncionario = request.body.funcionario.nomeFuncionario;
        funcionario.email = request.body.funcionario.email;
        funcionario.senha = request.body.funcionario.senha;
        funcionario.recebeValeTransporte = request.body.funcionario.recebeValeTransporte;
        funcionario.cargo.idCargo = request.body.funcionario.Cargo_idCargo;

        const atualizou = await funcionario.update();
        if (atualizou == true) {
            const objResposta = {
                cod: 1,
                status: true,
                funcionarios: [{
                    "funcionario": {
                        "idFuncionario": funcionario.idFuncionario,
                        "nomeFuncionario": funcionario.nomeFuncionario,
                        "email": funcionario.email,
                        "recebeValeTransporte": funcionario.recebeValeTransporte,
                        "Cargo_idCargo": funcionario.cargo.idCargo
                    }
                }]
            }
            response.status(200).send(objResposta);
        } else {
            const objResposta = {
                cod: 1,
                status: false,
                msg: "Falha ao atualizar funcionário",
                funcionarios: [{
                    "funcionario": {
                        "idFuncionario": funcionario.idFuncionario,
                        "nomeFuncionario": funcionario.nomeFuncionario,
                        "email": funcionario.email,
                        "recebeValeTransporte": funcionario.recebeValeTransporte,
                        "Cargo_idCargo": funcionario.cargo.idCargo
                    }
                }]
            }
            response.status(200).send(objResposta);
        }
    }


    async delete(request, response) {

        const funcionario = new Funcionario();
        funcionario.idFuncionario = request.params.idFuncionario


        const excluiu = await funcionario.delete();
        if (excluiu == true) {
            const objResposta = {
                cod: 1,
                status: true,
                msg: "Excluido com sucesso",
                funcionarios: [{
                    "funcionario": {
                        "idFuncionario": funcionario.idFuncionario,
                        "nomeFuncionario": funcionario.nomeFuncionario,
                        "email": funcionario.email,
                        "recebeValeTransporte": funcionario.recebeValeTransporte,
                        "Cargo_idCargo": funcionario.cargo.idCargo
                    }
                }]
            }
            response.status(200).send(objResposta);
        } else {
            const objResposta = {
                cod: 1,
                status: false,
                msg: "Falha ao excluir funcionário",
                funcionarios: [{
                    "funcionario": {
                        "idFuncionario": funcionario.idFuncionario,
                        "nomeFuncionario": funcionario.nomeFuncionario,
                        "email": funcionario.email,
                        "recebeValeTransporte": funcionario.recebeValeTransporte,
                        "Cargo_idCargo": funcionario.cargo.idCargo
                    }
                }]
            }
            response.status(200).send(objResposta);
        }
    }
};
