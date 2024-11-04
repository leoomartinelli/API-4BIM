from flask import Flask, jsonify, request
from controle.alunoController import AlunoController
from model import aluno  # Ajuste conforme a localização do arquivo da classe Aluno

# Cria a aplicação Flask
app = Flask("rest_api_aluno")

# Função auxiliar para lidar com erros de validação
def handle_validation_error(e):
    return jsonify({"erro": str(e)}), 400

# Função responsável por obter todos os alunos
# Endpoint: GET /alunos/
@app.route('/alunosf/', methods=['GET'])
def read_all_alunos():
    try:
        aluno_controller = AlunoController()
        return aluno_controller.read_all()
    except ValueError as e:
        return handle_validation_error(e)

@app.route('/alunosf/<int:id>', methods=['GET'])
def read_aluno_by_id(id):
    try:
        aluno_controller = AlunoController()
        return aluno_controller.read_by_id(id)  # Passa o ID corretamente
    except ValueError as e:
        return handle_validation_error(e)
    
# Função responsável por criar um novo aluno
# Endpoint: POST /alunos/
@app.route('/alunosf/', methods=['POST'])
def create_aluno():
    try:
        body = request.get_json()
        aluno_controller = AlunoController()
        aluno_controller.aluno.nome = body['aluno']['nome']
        aluno_controller.aluno.email = body['aluno']['email']
        aluno_controller.aluno.senha = body['aluno']['senha']
        aluno_controller.aluno.idTurma = body['aluno']['idTurma']
        return aluno_controller.create_control()
    except ValueError as e:
        return handle_validation_error(e)

# Função responsável por atualizar um aluno existente
# Endpoint: PUT /alunos/<int:id>
@app.route('/alunosf/<int:id>', methods=['PUT'])
def update_aluno(id):
    try:
        aluno_controller = AlunoController()
        # Passa o ID do aluno para o método update do controlador
        return aluno_controller.update(id)
    except ValueError as e:
        return handle_validation_error(e)

# Função responsável por deletar um aluno pelo ID
# Endpoint: DELETE /alunos/<int:id>
@app.route('/alunosf/<int:id>', methods=['DELETE'])
def delete_aluno(id):
    try:
        aluno_controller = AlunoController()
        # Passa o ID do aluno para o método delete do controlador
        return aluno_controller.delete(id)
    except ValueError as e:
        return handle_validation_error(e)


# Inicia o servidor Flask na porta 8080
app.run(host='0.0.0.0', port=8080)
