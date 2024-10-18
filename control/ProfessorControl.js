const express = require('express');
const Professor = require('../model/Professor');

module.exports = class ProfessorControl {
    async login(request, response) {
        const professor = new Professor();

        professor.email = request.body.professor.email;
        professor.senha = request.body.professor.senha;

        const logou = await professor.login();
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
        const professor = new Professor();
        const dadosProfessores = await professor.readAll();
        const objResposta = {
            cod: 1,
            status: true,
            professores: dadosProfessores
        }
        response.status(200).send(objResposta);
    }

    async readById(request, response) {
        const professor = new Professor();
        const idProfessor = request.params.idProfessor;

        const dadosProfessor = await professor.readByID(idProfessor);
        const objResposta = {
            cod: 1,
            status: true,
            professor: dadosProfessor
        }
        response.status(200).send(objResposta);
    }

    async create(request, response) {
        const professor = new Professor();

        professor.nome = request.body.professor.nome;
        professor.email = request.body.professor.email;
        professor.senha = request.body.professor.senha;
        professor.disciplina = request.body.professor.disciplina;

        const cadastrou = await professor.create();
        if (cadastrou == true) {
            const objResposta = {
                cod: 1,
                status: true,
                professores: [{
                    "professor": {
                        "idProfessor": professor.idProfessor,
                        "nome": professor.nome,
                        "email": professor.email,
                        "disciplina": professor.disciplina
                    }
                }]
            }
            response.status(201).send(objResposta);
        } else {
            const objResposta = {
                cod: 1,
                status: false,
                msg: "Falha ao cadastrar professor",
                professores: [{
                    "professor": {
                        "idProfessor": professor.idProfessor,
                        "nome": professor.nome,
                        "email": professor.email,
                        "disciplina": professor.disciplina
                    }
                }]
            }
            response.status(200).send(objResposta);
        }
    }

    async update(request, response) {
        const professor = new Professor();

        professor.idProfessor = request.params.idProfessor;
        professor.nome = request.body.professor.nome;
        professor.email = request.body.professor.email;
        professor.senha = request.body.professor.senha;
        professor.disciplina = request.body.professor.disciplina;

        const atualizou = await professor.update();
        if (atualizou == true) {
            const objResposta = {
                cod: 1,
                status: true,
                professores: [{
                    "professor": {
                        "idProfessor": professor.idProfessor,
                        "nome": professor.nome,
                        "email": professor.email,
                        "disciplina": professor.disciplina
                    }
                }]
            }
            response.status(200).send(objResposta);
        } else {
            const objResposta = {
                cod: 1,
                status: false,
                msg: "Falha ao atualizar professor",
                professores: [{
                    "professor": {
                        "idProfessor": professor.idProfessor,
                        "nome": professor.nome,
                        "email": professor.email,
                        "disciplina": professor.disciplina
                    }
                }]
            }
            response.status(200).send(objResposta);
        }
    }

    async delete(request, response) {
        const professor = new Professor();
        professor.idProfessor = request.params.idProfessor;

        const excluiu = await professor.delete();
        if (excluiu == true) {
            const objResposta = {
                cod: 1,
                status: true,
                msg: "Excluído com sucesso",
                professores: [{
                    "professor": {
                        "idProfessor": professor.idProfessor,
                        "nome": professor.nome,
                        "email": professor.email,
                        "disciplina": professor.disciplina
                    }
                }]
            }
            response.status(200).send(objResposta);
        } else {
            const objResposta = {
                cod: 1,
                status: false,
                msg: "Falha ao excluir professor",
                professores: [{
                    "professor": {
                        "idProfessor": professor.idProfessor,
                        "nome": professor.nome,
                        "email": professor.email,
                        "disciplina": professor.disciplina
                    }
                }]
            }
            response.status(200).send(objResposta);
        }
    }

    async cadastrarProfessores(request, response) {
        const fs = require('fs');
        const csv = require('csv-parser');
        const professores = [];

        await fs.createReadStream(request.file.path)
            .pipe(csv())
            .on('data', (row) => {
                // Para cada linha, cria uma instância de Professor e atribui os valores do CSV
                const professor = new Professor();
                professor.nome = row.nome;
                professor.email = row.email;
                professor.senha = row.senha;
                professor.disciplina = row.disciplina;
                professores.push(professor);
            })
            .on('end', async () => {
                // Após processar o CSV, faz a inserção de cada professor
                try {
                    for (let i = 0; i < professores.length; i++) {
                        await professores[i].create();
                    }
                    // Responde com sucesso após todos os professores serem cadastrados
                    return response.status(200).send({
                        cod: 1,
                        status: true,
                        msg: `${professores.length} professores cadastrados com sucesso`
                    });
                } catch (error) {
                    return response.status(500).send({
                        cod: 0,
                        status: false,
                        msg: "Erro ao cadastrar professores",
                        error: error.message
                    });
                }
            });
    }
};
