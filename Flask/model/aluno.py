from model.Banco import Banco
from mysql.connector import Error

class Aluno:
    def __init__(self):
        self._idAluno = None
        self._nome = None
        self._email = None
        self._senha = None
        self._idTurma = None

    def create(self):
        conexao = Banco.getConexao()
        if conexao:
            try:
                cursor = conexao.cursor()
                sql = "INSERT INTO aluno (nome, email, senha, idTurma) VALUES (%s, %s, %s, %s)"
                cursor.execute(sql, (self.nome, self.email, self.senha, self.idTurma))
                conexao.commit()
                self.idAluno = cursor.lastrowid  # Atualiza o idAluno após criação
                return self.idAluno
            except Error as e:
                print(f"Erro ao criar aluno: {e}")
                raise ValueError("Ocorreu um erro ao cadastrar o aluno")
            finally:
                cursor.close()

    def readAll(self):
        conexao = Banco.getConexao()
        if conexao:
            try:
                cursor = conexao.cursor(dictionary=True)
                sql = "SELECT * FROM aluno ORDER BY nome ASC"
                cursor.execute(sql)
                return cursor.fetchall()
            except Error as e:
                print(f"Erro ao obter alunos: {e}")
                raise ValueError("Ocorreu um erro ao selecionar todos os alunos")
            finally:
                cursor.close()

    def readById(self, id_aluno):
            conexao = Banco.getConexao()
            if conexao:
                try:
                    cursor = conexao.cursor(dictionary=True)
                    sql = "SELECT * FROM aluno WHERE idAluno = %s"
                    cursor.execute(sql, (id_aluno,))  # Passa id_aluno como parâmetro
                    linhaRespostaSQL = cursor.fetchone()
                    if linhaRespostaSQL:
                        self.idAluno = linhaRespostaSQL['idAluno']
                        self.nome = linhaRespostaSQL['nome']
                        self.email = linhaRespostaSQL['email']
                        self.senha = linhaRespostaSQL['senha']
                        self.idTurma = linhaRespostaSQL['idTurma']
                    return linhaRespostaSQL
                except Error as e:
                    print(f"Erro ao obter aluno por ID: {e}")
                    return None
                finally:
                    cursor.close()    


    def update(self):
        conexao = Banco.getConexao()
        if conexao:
            try:
                cursor = conexao.cursor()
                sql = "UPDATE aluno SET nome = %s, email = %s, senha = %s, idTurma = %s WHERE idAluno = %s"
                cursor.execute(sql, (self.nome, self.email, self.senha, self.idTurma, self.idAluno))
                conexao.commit()
                return cursor.rowcount
            except Error as e:
                print(f"Erro ao atualizar aluno: {e}")
                raise ValueError("Erro ao atualizar o aluno.")
            finally:
                cursor.close()


    def delete(self):
        conexao = Banco.getConexao()
        if conexao:
            try:
                cursor = conexao.cursor()
                sql = "DELETE FROM aluno WHERE idAluno = %s"
                cursor.execute(sql, (self.idAluno,))
                conexao.commit()
                qtd_excluidos = cursor.rowcount
                return qtd_excluidos
            except Error as e:
                print(f"Erro ao deletar aluno: {e}")
                return None
            finally:
                cursor.close()
                

    # Getters e Setters para atributos da classe
    @property
    def idAluno(self):
        return self._idAluno

    @idAluno.setter
    def idAluno(self, value):
        self._idAluno = value

    @property
    def nome(self):
        return self._nome

    @nome.setter
    def nome(self, value):
        self._nome = value

    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, value):
        self._email = value

    @property
    def senha(self):
        return self._senha

    @senha.setter
    def senha(self, value):
        self._senha = value

    @property
    def idTurma(self):
        return self._idTurma

    @idTurma.setter
    def idTurma(self, value):
        self._idTurma = value
