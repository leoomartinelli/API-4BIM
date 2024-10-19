const express = require('express');
const Turma = require('../model/Turma');

module.exports = class TurmaControl {

    async readAll(request, response) {
        const turma = new Turma();
        const dadosTurmas = await turma.readAll();
        const objResposta = {
            cod: 1,
            status: true,
            turmas: dadosTurmas
        }
        response.status(200).send(objResposta);
    }

    async readById(request, response) {
        const turma = new Turma();
        const idTurma = request.params.idTurma;

        const dadosTurma = await turma.readByID(idTurma);
        const objResposta = {
            cod: 1,
            status: true,
            turma: dadosTurma
        }
        response.status(200).send(objResposta);
    }

    async create(request, response) {
        const turma = new Turma();

        turma.nomeTurma = request.body.turma.nomeTurma;
        turma.idProfessor = request.body.turma.idProfessor;

        const cadastrou = await turma.create();
        if (cadastrou) {
            return response.status(201).send({
                status: true,
                msg: 'Turma cadastrada com sucesso',
                turma: {
                    idTurma: turma.idTurma,
                    nomeTurma: turma.nomeTurma,
                    idProfessor: turma.idProfessor
                }
            });
        } else {
            return response.status(500).send({
                status: false,
                msg: 'Erro ao cadastrar a turma'
            });
        }
    }

    async update(request, response) {
        const turma = new Turma();

        turma.idTurma = request.params.idTurma;
        turma.nome = request.body.turma.nome;

        const atualizou = await turma.update();
        if (atualizou == true) {
            const objResposta = {
                cod: 1,
                status: true,
                turmas: [{
                    "turma": {
                        "idTurma": turma.idTurma,
                        "nome": turma.nome
                    }
                }]
            }
            response.status(200).send(objResposta);
        } else {
            const objResposta = {
                cod: 1,
                status: false,
                msg: "Falha ao atualizar turma",
                turmas: [{
                    "turma": {
                        "idTurma": turma.idTurma,
                        "nome": turma.nome
                    }
                }]
            }
            response.status(200).send(objResposta);
        }
    }

    async delete(request, response) {
        const turma = new Turma();
        turma.idTurma = request.params.idTurma;

        const hasAlunos = await turma.hasAlunos();
        if (hasAlunos) {
            return response.status(400).send({
                status: false,
                msg: 'Não é possível excluir a turma porque ela possui alunos associados.'
            });
        }

        const excluiu = await turma.delete();
        if (excluiu) {
            return response.status(200).send({
                status: true,
                msg: 'Turma excluída com sucesso'
            });
        } else {
            return response.status(500).send({
                status: false,
                msg: 'Erro ao excluir a turma'
            });
        }
    }

    // Outras operações de CRUD...


    async cadastrarTurmas(request, response) {
        const fs = require('fs');
        const csv = require('csv-parser');
        const turmas = [];

        await fs.createReadStream(request.file.path)
            .pipe(csv())
            .on('data', (row) => {
                // Para cada linha, cria uma instância de Turma e atribui os valores do CSV
                const turma = new Turma();
                turma.nome = row.nome;
                turmas.push(turma);
            })
            .on('end', async () => {
                // Após processar o CSV, faz a inserção de cada turma
                try {
                    for (let i = 0; i < turmas.length; i++) {
                        await turmas[i].create();
                    }
                    // Responde com sucesso após todas as turmas serem cadastradas
                    return response.status(200).send({
                        cod: 1,
                        status: true,
                        msg: `${turmas.length} turmas cadastradas com sucesso`
                    });
                } catch (error) {
                    return response.status(500).send({
                        cod: 0,
                        status: false,
                        msg: "Erro ao cadastrar turmas",
                        error: error.message
                    });
                }
            });
    }
};
