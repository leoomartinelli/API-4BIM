import jwt
import datetime
import secrets

class TokenJWTAluno:
    def __init__(self):
        self._key = "x9S4q0v+V0IjvHkG20uAxaHx1ijj+q1HWjHKv+ohxp/oK+77qyXkVj/l4QYHHTF3"  # Chave secreta
        self._alg = 'HS256'  # Algoritmo de criptografia
        self._type = 'JWT'
        self._iss = 'http://localhost'  # Emissor do token
        self._aud = 'http://localhost'  # Destinatário do token
        self._sub = "acesso_aluno"  # Assunto do token
        self._duracaoToken = 3600 * 24 * 30  # Duração do token (30 dias)
        self.payload = None

    def gerar_token(self, aluno_claims):
        headers = {
            'alg': self._alg,
            'typ': self._type
        }

        agora = datetime.datetime.now(datetime.timezone.utc)
        payload = {
            'iss': self._iss,  # Emissor do token
            'aud': self._aud,  # Destinatário do token
            'sub': self._sub,  # Assunto do token
            'iat': int(agora.timestamp()),  # Momento de criação (em segundos)
            'exp': int((agora + datetime.timedelta(seconds=self._duracaoToken)).timestamp()),  # Expiração (em segundos)
            'nbf': int(agora.timestamp()),  # Não é válido antes do tempo especificado
            'jti': secrets.token_hex(16),  # Identificador único (jti)
            'email': aluno_claims['email'],  # Claims públicas
            'nome': aluno_claims['nome'],
            'idAluno': aluno_claims['idAluno'],  # Claims privadas
            'turma': aluno_claims['turma']
        }

        # Gera o token utilizando a biblioteca PyJWT
        token = jwt.encode(payload, self._key, algorithm=self._alg, headers=headers)
        return token

    def validar_token(self, string_token):
        if not string_token or string_token.strip() == "":
            return False
        token = string_token.replace("Bearer ", "").strip()
        try:
            decoded = jwt.decode(token, self._key, algorithms=[self._alg], audience=self._aud)
            self.payload = decoded
            return True
        except jwt.ExpiredSignatureError:
            print("Token expirado")
            return False
        except jwt.InvalidTokenError:
            print("Token inválido")
            return False

    def get_payload(self):
        return self.payload

    def set_payload(self, payload):
        self.payload = payload

    def get_alg(self):
        return self._alg

    def set_alg(self, alg):
        self._alg = alg

# Exemplo de uso
if __name__ == "__main__":
    jwt_handler = TokenJWTAluno()
    claims = {
        'email': 'aluno@example.com',
        'nome': 'Maria',
        'idAluno': 123,
        'turma': 'Turma A'
    }

    # Gerar token
    token = jwt_handler.gerar_token(claims)
    print(f"Token JWT: {token}")

    # Validar token
    valid = jwt_handler.validar_token(token)
    print(f"Token válido: {valid}")
    print(f"Payload: {jwt_handler.get_payload()}")
