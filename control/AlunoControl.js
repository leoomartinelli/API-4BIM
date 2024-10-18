// Importa o módulo express para criação de APIs.
const express = require('express');
// Importa o modelo Aluno para realizar operações relacionadas à entidade Aluno.
const Aluno = require('../model/Aluno');
// Exporta a classe AlunoControl, que controla as operações de CRUD (Create, Read, Update, Delete) para Aluno.
module.exports = class AlunoControl {
    // Método assíncrono para criar um novo aluno.
   // Função responsável por lidar com o login de alunos

    
    async create(request, response) {
        // Cria uma nova instância do modelo Aluno.
        var aluno = new Aluno();
        // Atribui os valores do aluno passados no corpo da requisição (request body) à instância criada.
        aluno.nome = request.body.aluno.nome;
        aluno.email = request.body.aluno.email;
        aluno.senha = request.body.aluno.senha;
        aluno.turma = request.body.aluno.turma;
        // Chama o método create() do modelo Aluno para inserir o novo aluno no banco de dados.
        const isCreated = await aluno.create();
        // Cria um objeto de resposta contendo o código, status e a mensagem de sucesso ou erro.
        const objResposta = {
            cod: 1,
            status: isCreated,
            msg: isCreated ? 'Aluno criado com sucesso' : 'Erro ao criar o aluno'
        };
        // Envia a resposta HTTP com status 200 e o objeto de resposta.
        response.status(200).send(objResposta);
    }

    // Método assíncrono para excluir um aluno existente.
    async delete(request, response) {
        // Cria uma nova instância do modelo Aluno.
        var aluno = new Aluno();
        // Atribui o ID do aluno passado como parâmetro na URL (request params) à instância criada.
        aluno.idAluno = request.params.idAluno;
        // Chama o método delete() do modelo Aluno para excluir o aluno do banco de dados.
        const isDeleted = await aluno.delete();
        // Cria um objeto de resposta com o código, status e a mensagem de sucesso ou erro.
        const objResposta = {
            cod: 1,
            status: isDeleted,
            msg: isDeleted ? 'Aluno excluído com sucesso' : 'Erro ao excluir o aluno'
        };
        // Envia a resposta HTTP com status 200 e o objeto de resposta.
        response.status(200).send(objResposta);
    }

    // Método assíncrono para atualizar um aluno existente.
    async update(request, response) {
        // Cria uma nova instância do modelo Aluno.
        var aluno = new Aluno();
        // Atribui o ID e as informações do aluno passados na URL e no corpo da requisição, respectivamente.
        aluno.idAluno = request.params.idAluno;
        aluno.nome = request.body.aluno.nome;
        aluno.email = request.body.aluno.email;
        aluno.senha = request.body.aluno.senha;
        aluno.turma = request.body.aluno.turma;
        // Chama o método update() do modelo Aluno para atualizar o aluno no banco de dados.
        const isUpdated = await aluno.update();
        // Cria um objeto de resposta com o código, status e a mensagem de sucesso ou erro.
        const objResposta = {
            cod: 1,
            status: true,
            msg: isUpdated ? 'Aluno atualizado com sucesso' : 'Erro ao atualizar o aluno'
        };
        // Envia a resposta HTTP com status 200 e o objeto de resposta.
        response.status(200).send(objResposta);
    }


   
    async readAll(request, response) {
         // Cria uma nova instância do modelo Aluno.
         var aluno = new Aluno();
         // Chama o método readAll() para buscar todos os alunos no banco de dados.
         const resultado = await aluno.readAll();
         // Cria um objeto de resposta contendo o código, status, mensagem e a lista de alunos.
         const objResposta = {
             cod: 1,
             status: true,
             msg: 'Executado com sucesso',
             alunos: resultado
         };
         // Envia a resposta HTTP com status 200 e o objeto de resposta.
         response.status(200).send(objResposta);
    }
    
    // Método assíncrono para obter um aluno pelo ID.
    async readAllById(request, response) {
        // Cria uma nova instância do modelo Aluno.
        var aluno = new Aluno();
        // Atribui o ID do aluno passado como parâmetro na URL (request params) à instância criada.
        aluno.idAluno = request.params.idAluno;

        // Chama o método readByID() para buscar o aluno pelo ID no banco de dados.
        const resultado = await aluno.readByID();
        // Cria um objeto de resposta contendo o código, status, mensagem e o aluno encontrado (ou não).
        const objResposta = {
            cod: 1,
            status: true,
            msg: resultado ? 'Aluno encontrado' : 'Aluno não encontrado',
            aluno: resultado
        };
        // Envia a resposta HTTP com status 200 e o objeto de resposta.
        response.status(200).send(objResposta);
    }

    // Método assíncrono para criar alunos a partir de um arquivo CSV.
    async createByCSV(request, response) {
        const multer = require('multer'); // npm install multer --save
        const csv = require('csv-parser'); // npm install csv-parser --save
        const fs = require('fs');
        const upload = multer({ dest: 'uploads/' });

        // Verifica se o arquivo foi enviado
        if (!request.file) {
            return response.status(400).send({
                cod: 0,
                status: false,
                msg: "Nenhum arquivo foi enviado."
            });
        }

        const alunos = [];

        await fs.createReadStream(request.file.path)
            .pipe(csv())
            .on('data', (row) => {
                // Para cada linha, cria uma instância de Aluno e atribui os valores do CSV
                const aluno = new Aluno();
                aluno.nome = row.nome;
                aluno.email = row.email;
                aluno.matricula = row.matricula;
                aluno.curso = row.curso;
                alunos.push(aluno);
            })
            .on('end', async () => {
                // Após processar o CSV, faz a inserção de cada aluno
                try {
                    for (let i = 0; i < alunos.length; i++) {
                        await alunos[i].create();
                    }
                    // Responde com sucesso após todos os alunos serem cadastrados
                    return response.status(200).send({
                        cod: 1,
                        status: true,
                        msg: `${alunos.length} alunos cadastrados com sucesso`
                    });
                } catch (error) {
                    return response.status(500).send({
                        cod: 0,
                        status: false,
                        msg: "Erro ao cadastrar alunos",
                        error: error.message
                    });
                }
            });
    }
    
};

