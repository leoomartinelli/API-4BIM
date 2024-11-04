from flask import jsonify, request
from model.aluno import Aluno  # Supondo que você tenha uma classe Aluno com métodos CRUD

class AlunoController:
    # Classe responsável por controlar as operações CRUD para a entidade Aluno.
    
    def __init__(self):
        # Inicializa a classe AlunoController.
        # Cria uma instância da classe Aluno para gerenciar as operações de banco de dados.
        self._aluno = Aluno()

    # Valida o nome do aluno.
    # Levanta uma exceção se o nome do aluno for nulo ou tiver menos de 3 caracteres.
    def validar_nomeAluno(self):
        print(self._aluno.email)
        if self._aluno.nome is None:
            raise ValueError("O nome do aluno não pode ser vazio")
        if len(self._aluno.nome) < 3:
            raise ValueError("O nome do aluno deve ter pelo menos 3 caracteres.")
    
    # Obtém todos os alunos do banco de dados.
    # Retorna um JSON contendo a lista de alunos ou uma mensagem de erro em caso de falha.
    def read_all(self):
        alunos = self._aluno.readAll()
        if alunos is not None:
            return jsonify(alunos), 200
        else:
            return jsonify({"message": "Não foi possível obter os alunos"}), 500
    
    # Obtém um aluno específico pelo ID.
    # Retorna um JSON com os dados do aluno ou uma mensagem de erro caso o aluno não seja encontrado.
    def read_by_id(self, id_aluno):
        aluno_data = self._aluno.readById(id_aluno)  # Passa id_aluno corretamente
        if aluno_data:
            return jsonify(aluno_data), 200
        else:
            return jsonify({"message": "Aluno não encontrado"}), 404


    # Cria um novo aluno no banco de dados.
    # Valida o nome do aluno antes de inserir os dados no banco.
    # Retorna o ID do novo aluno criado ou uma mensagem de erro caso falhe.
    def create_control(self):
        data = request.get_json()
        print(data)
        self._aluno.nome = data["aluno"].get("nome")
        self._aluno.email = data["aluno"].get("email")
        self._aluno.senha = data["aluno"].get("senha")
        self._aluno.id_turma = data["aluno"].get("idTurma")

        self.validar_nomeAluno()  # Valida o nome do aluno antes de prosseguir
        id_novo_aluno = self._aluno.create()  # Tenta criar o novo aluno no banco de dados
        if id_novo_aluno:
            return jsonify({"idAluno": id_novo_aluno, "nome": self._aluno.nome}), 201
        else:
            return jsonify({"message": "Não foi possível criar o aluno"}), 500

    # Atualiza um aluno existente no banco de dados.
    # Valida o nome do aluno antes de atualizar os dados.
    # Retorna os dados do aluno atualizado ou uma mensagem de erro em caso de falha.
    def update(self, id_aluno):
        data = request.get_json()
        self._aluno.idAluno = id_aluno
        self._aluno.nome = data["aluno"].get("nome")
        self._aluno.email = data["aluno"].get("email")
        self._aluno.senha = data["aluno"].get("senha")
        self._aluno.idTurma = data["aluno"].get("idTurma")

        # Valida o nome do aluno
        self.validar_nomeAluno()
        linhas_afetadas = self._aluno.update()  # Atualiza o aluno no banco de dados
        if linhas_afetadas:
            return jsonify({"message": "Aluno atualizado com sucesso"}), 200
        else:
            return jsonify({"message": "Aluno não encontrado"}), 404


    # Exclui um aluno do banco de dados pelo ID.
    # Retorna uma mensagem de sucesso ou erro dependendo do resultado.
    def delete(self, id_aluno):
        self._aluno.idAluno = id_aluno
        qtd_excluidos = self._aluno.delete()  # Chama o método delete da classe Aluno
        if qtd_excluidos:
            return jsonify({"message": "Aluno excluído com sucesso"}), 200
        else:
            return jsonify({"message": "Aluno não encontrado"}), 404


    # Getter para acessar o objeto aluno
    @property
    def aluno(self):
        return self._aluno

    # Setter para modificar o objeto aluno
    @aluno.setter
    def aluno(self, value):
        self._aluno = value