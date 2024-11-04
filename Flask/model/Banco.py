import mysql.connector
from mysql.connector import Error

class Banco:
    HOST = '127.0.0.1'
    USER = 'root'
    PWD = ''
    DB = 'aula_api_2024'
    PORT = 3306
    CONEXAO = None

    @staticmethod
    def conectar():
        # Verifica se já existe uma conexão estabelecida
        if Banco.CONEXAO is None:
            try:
                # Tenta estabelecer uma nova conexão utilizando as informações fornecidas
                Banco.CONEXAO = mysql.connector.connect(
                    host=Banco.HOST,
                    user=Banco.USER,
                    password=Banco.PWD,
                    database=Banco.DB,
                    port=Banco.PORT
                )
                print("Conexão com o banco de dados estabelecida")
            except Error as err:
                obj_resposta = {
                    'cod': 1,
                    'msg': "Erro ao conectar no banco",
                    'erro': str(err)
                }
                print(obj_resposta)  # Log de erro
                exit(1)  # Encerra o script em caso de erro

    # Método público para obter a conexão com o banco de dados
    @staticmethod
    def getConexao():
        # Verifica se já existe uma conexão estabelecida
        if Banco.CONEXAO is None:
            # Se não houver, estabelece uma nova conexão
            Banco.conectar()
        # Retorna a conexão
        return Banco.CONEXAO
