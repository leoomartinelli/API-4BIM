const express = require('express');
const Diretor = require('../model/Diretor');

module.exports = class DiretoriaControl {
    async login(request, response) {
        const diretor = new Diretor();

        diretor.email = request.body.diretor.email;
        diretor.senha = request.body.diretor.senha;

        const logou = await diretor.login();
        if (logou == true) {
            const objResposta = {
                cod: 1,
                status: logou,
                msg: 'Logado com sucesso'
            };
            response.status(200).send(objResposta);
        } else {
            const objResposta = {
                cod: 2,
                status: false,
                msg: "Erro ao efetuar login"
            };
            response.status(401).send(objResposta);
        }
    }

    async readAll(request, response) {
        const diretor = new Diretor();
        const dadosDiretores = await diretor.readAll();
        const objResposta = {
            cod: 1,
            status: true,
            diretores: dadosDiretores
        }
        response.status(200).send(objResposta);
    }

    async readById(request, response) {
        const diretor = new Diretor();
        const idDiretor = request.params.idDiretor;

        const dadosDiretor = await diretor.readByID(idDiretor);
        const objResposta = {
            cod: 1,
            status: true,
            diretor: dadosDiretor
        }
        response.status(200).send(objResposta);
    }

    async create(request, response) {
        const diretor = new Diretor();

        diretor.nome = request.body.diretor.nome;
        diretor.email = request.body.diretor.email;
        diretor.senha = request.body.diretor.senha;
        diretor.cargo = request.body.diretor.cargo;

        const cadastrou = await diretor.create();
        if (cadastrou == true) {
            const objResposta = {
                cod: 1,
                status: true,
                diretores: [{
                    "diretor": {
                        "idDiretor": diretor.idDiretor,
                        "nome": diretor.nome,
                        "email": diretor.email,
                        "cargo": diretor.cargo
                    }
                }]
            }
            response.status(201).send(objResposta);
        } else {
            const objResposta = {
                cod: 1,
                status: false,
                msg: "Falha ao cadastrar diretor",
                diretores: [{
                    "diretor": {
                        "idDiretor": diretor.idDiretor,
                        "nome": diretor.nome,
                        "email": diretor.email,
                        "cargo": diretor.cargo
                    }
                }]
            }
            response.status(200).send(objResposta);
        }
    }

    async update(request, response) {
        const diretor = new Diretor();

        diretor.idDiretor = request.params.idDiretor;
        diretor.nome = request.body.diretor.nome;
        diretor.email = request.body.diretor.email;
        diretor.senha = request.body.diretor.senha;
        diretor.cargo = request.body.diretor.cargo;

        const atualizou = await diretor.update();
        if (atualizou == true) {
            const objResposta = {
                cod: 1,
                status: true,
                diretores: [{
                    "diretor": {
                        "idDiretor": diretor.idDiretor,
                        "nome": diretor.nome,
                        "email": diretor.email,
                        "cargo": diretor.cargo
                    }
                }]
            }
            response.status(200).send(objResposta);
        } else {
            const objResposta = {
                cod: 1,
                status: false,
                msg: "Falha ao atualizar diretor",
                diretores: [{
                    "diretor": {
                        "idDiretor": diretor.idDiretor,
                        "nome": diretor.nome,
                        "email": diretor.email,
                        "cargo": diretor.cargo
                    }
                }]
            }
            response.status(200).send(objResposta);
        }
    }

    async delete(request, response) {
        const diretor = new Diretor();
        diretor.idDiretor = request.params.idDiretor;

        const excluiu = await diretor.delete();
        if (excluiu == true) {
            const objResposta = {
                cod: 1,
                status: true,
                msg: "Excluído com sucesso",
                diretores: [{
                    "diretor": {
                        "idDiretor": diretor.idDiretor,
                        "nome": diretor.nome,
                        "email": diretor.email,
                        "cargo": diretor.cargo
                    }
                }]
            }
            response.status(200).send(objResposta);
        } else {
            const objResposta = {
                cod: 1,
                status: false,
                msg: "Falha ao excluir diretor",
                diretores: [{
                    "diretor": {
                        "idDiretor": diretor.idDiretor,
                        "nome": diretor.nome,
                        "email": diretor.email,
                        "cargo": diretor.cargo
                    }
                }]
            }
            response.status(200).send(objResposta);
        }
    }

    async cadastrarDiretores(request, response) {
        const fs = require('fs');
        const csv = require('csv-parser');
        const diretores = [];

        await fs.createReadStream(request.file.path)
            .pipe(csv())
            .on('data', (row) => {
                // Para cada linha, cria uma instância de Diretor e atribui os valores do CSV
                const diretor = new Diretor();
                diretor.nome = row.nome;
                diretor.email = row.email;
                diretor.senha = row.senha;
                diretor.cargo = row.cargo;
                diretores.push(diretor);
            })
            .on('end', async () => {
                // Após processar o CSV, faz a inserção de cada diretor
                try {
                    for (let i = 0; i < diretores.length; i++) {
                        await diretores[i].create();
                    }
                    // Responde com sucesso após todos os diretores serem cadastrados
                    return response.status(200).send({
                        cod: 1,
                        status: true,
                        msg: `${diretores.length} diretores cadastrados com sucesso`
                    });
                } catch (error) {
                    return response.status(500).send({
                        cod: 0,
                        status: false,
                        msg: "Erro ao cadastrar diretores",
                        error: error.message
                    });
                }
            });
    }
};

