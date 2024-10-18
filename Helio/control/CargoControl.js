// Importa o módulo express para criação de APIs.
const express = require('express');
// Importa o modelo Cargo para realizar operações relacionadas à entidade Cargo.
const Cargo = require('../model/Cargo');
// Exporta a classe CargoControl, que controla as operações de CRUD (Create, Read, Update, Delete) para o Cargo.
module.exports = class CargoControl {
    // Método assíncrono para criar um novo cargo.
    async create(request, response) {
        // Cria uma nova instância do modelo Cargo.
        var cargo = new Cargo();
        // Atribui o nome do cargo passado no corpo da requisição (request body) à instância criada.
        cargo.nomeCargo = request.body.cargo.nomeCargo;
        // Chama o método create() do modelo Cargo para inserir o novo cargo no banco de dados.
        const isCreated = await cargo.create();
        // Cria um objeto de resposta contendo o código, status e a mensagem de sucesso ou erro.
        const objResposta = {
            cod: 1,
            status: isCreated,
            msg: isCreated ? 'Cargo criado com sucesso' : 'Erro ao criar o cargo'
        };
        // Envia a resposta HTTP com status 200 e o objeto de resposta.
        response.status(200).send(objResposta);
    }

    // Método assíncrono para excluir um cargo existente.
    async delete(request, response) {
        // Cria uma nova instância do modelo Cargo.
        var cargo = new Cargo();
        // Atribui o ID do cargo passado como parâmetro na URL (request params) à instância criada.
        cargo.idCargo = request.params.idCargo;
        // Chama o método delete() do modelo Cargo para excluir o cargo do banco de dados.
        const isDeleted = await cargo.delete();
        // Cria um objeto de resposta com o código, status e a mensagem de sucesso ou erro.
        const objResposta = {
            cod: 1,
            status: isDeleted,
            msg: isDeleted ? 'Cargo excluído com sucesso' : 'Erro ao excluir o cargo'
        };
        // Envia a resposta HTTP com status 200 e o objeto de resposta.
        response.status(200).send(objResposta);
    }

    // Método assíncrono para atualizar um cargo existente.
    async update(request, response) {
        // Cria uma nova instância do modelo Cargo.
        var cargo = new Cargo();
        // Atribui o ID e o nome do cargo passados na URL e no corpo da requisição, respectivamente.
        cargo.idCargo = request.params.idCargo;
        cargo.nomeCargo = request.body.cargo.nomeCargo;
        // Chama o método update() do modelo Cargo para atualizar o cargo no banco de dados.
        const isUpdated = await cargo.update();
        // Cria um objeto de resposta com o código, status e a mensagem de sucesso ou erro.
        const objResposta = {
            cod: 1,
            status: true,
            msg: isUpdated ? 'Cargo atualizado com sucesso' : 'Erro ao atualizar o cargo'
        };
        // Envia a resposta HTTP com status 200 e o objeto de resposta.
        response.status(200).send(objResposta);
    }

    // Método assíncrono para obter todos os cargos.
    async readAll(request, response) {
        // Cria uma nova instância do modelo Cargo.
        var cargo = new Cargo();
        // Chama o método readAll() para buscar todos os cargos no banco de dados.
        const resultado = await cargo.readAll();
        // Cria um objeto de resposta contendo o código, status, mensagem e a lista de cargos.
        const objResposta = {
            cod: 1,
            status: true,
            msg: 'Executado com sucesso',
            cargos: resultado
        };
        // Envia a resposta HTTP com status 200 e o objeto de resposta.
        response.status(200).send(objResposta);
    }

    // Método assíncrono para obter um cargo pelo ID.
    async realAllById(request, response) {
        // Cria uma nova instância do modelo Cargo.
        var cargo = new Cargo();
        // Atribui o ID do cargo passado como parâmetro na URL (request params) à instância criada.
        cargo.idCargo = request.params.idCargo;

        // Chama o método readByID() para buscar o cargo pelo ID no banco de dados.
        const resultado = await cargo.readByID();
        // Cria um objeto de resposta contendo o código, status, mensagem e o cargo encontrado (ou não).
        const objResposta = {
            cod: 1,
            status: true,
            msg: resultado ? 'Cargo encontrado' : 'Cargo não encontrado',
            cargo: resultado
        };
        // Envia a resposta HTTP com status 200 e o objeto de resposta.
        response.status(200).send(objResposta);
    }

    async createByCSV(request, response) {
        const multer = require('multer'); //npm install multer --save
        const csv = require('csv-parser'); //npm install csv-parser --save
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

        //#############
        const cargos = [];

        fs.readFile(request.file.path, 'utf8', (err, data) => {
            if (err) {
                console.error('Erro ao ler o arquivo CSV:', err);
                return;
            }

            const linhas = data.split('\n');
            // Assumindo que a primeira linha não é um cabeçalho e contém dados
            for (let i = 0; i < linhas.length; i++) {
                const linha = linhas[i].split(',');

                if (linha.length >= 1) { // Verifica se há pelo menos uma coluna
                    const cargo = new Cargo();
                    linha[0] = linha[0].trim();
                    linha[0] = linha[0].replace('\n', '');
                    linha[0] = linha[0].replace('\r', '');
                    if (linha[0].length > 5) {
                        cargo.nomeCargo = linha[0]; // Assumindo que a primeira coluna é 'nome'
                        cargo.create();
                        cargos.push(cargo);
                    }
                }
            }

            const objResposta = {
                cod: 1,
                status: true,
                msg: 'cadastrado com sucesso',
                cargos: cargos
            }
            response.status(201).send(objResposta);

            // console.log('Cargos:', cargos);
        });

        //########################################
        /*  const cargos = [];
  
          // Lê o arquivo CSV e processa linha por linha
          await fs.createReadStream(request.file.path)
              .pipe(csv())
              .on('data', (row) => {
                  // Para cada linha, cria uma instância de Cargo e atribui os valores do CSV
                  const cargo = new Cargo();
                  cargo.nomeCargo = row.nome;
                  cargos.push(cargo);
              })
              .on('end', async () => {
                  // Após processar o CSV, faz a inserção de cada cargo
                  try {
                      for (let i = 0; i < cargos.length; i++) {
                          await cargos[i].create();
                      }
                      // Responde com sucesso após todos os cargos serem cadastrados
                      return response.status(200).send({
                          cod: 1,
                          status: true,
                          msg: `${cargos.length} cargos cadastrados com sucesso`
                      });
                  } catch (error) {
                      return response.status(500).send({
                          cod: 0,
                          status: false,
                          msg: "Erro ao cadastrar cargos",
                          error: error.message
                      });
                  }
              });
              */
    }

};
