# Mock API Server

Servidor para prover endpoints para "mockar" respostas e callbacks.

## Detalhes técnicos:

- Framework: NestJs
- Database: In-memory
- Testing framework: Jest

## Instalação:

- Baixe o repositório
- `docker-compose up`

# Pre-cadastrando usando arquivo json

Editar o arquivo `./mocks/mocks.json` com as rotas a serem implementadas.
Seguir o exemplo já presente no arquivo e na documentação abaixo.

# Interagindo pela API:

## Cadastrando um novo endpoint para mock:

Suponhamos que queira criar um mock do endpoint: `/melhorenvio/boleto`

- Fazer um POST para: `/config/melhorenvio/boleto` (toda rota após /config/ será gravada como chave do registro)

- Payload (Especificar os métodos que o endpoint irá aceitar e parametros):
- Caso queira que a resposta contenha alguma informação vinda do POST, você pode identicar usando `<chave-do-post>`.
  Ex: No body do POST vc enviou {"id":1} então no corpo abaixo a resposta ficaria:

```json
{
  "method": {
    "POST": {
      "response_status": 201,
      "response_data": {
        "externalId": "<id>",
        "message": "Record created successfully"
      }
    },
    "GET": {
      "response_status": 200,
      "response_data": [{ "paid": true, "code": "0001" }]
    }
  }
}
```

## Verificando informações cadastradas para rota:

- Fazer um GET para a rota cadastrada prefixado com `config`.
  Exemplo GET->`/config/melhorenvio/boleto`.

## Acessando o endpoint cadastrado:

- Cadastramos os métodos POST e GET. Então ao acessar o endpoint `http://localhost/melhorenvio/boleto` com GET teremos a resposta cadastrada em `response_data` com o status `response_status`.

O mesmo é válido para o caso do método POST cadastrado.

## Atualizando o endpoint cadastrado:

- Fazer um PATCH para a rota cadastrada prefixado com `config`.
  Exemplo PATCH->`/config/melhorenvio/boleto`. O payload deve seguir o formato usado no cadastro.

## Deletando uma rota cadastrada:

- Fazer um DELETE para a rota cadastrada prefixado com `config`.
  Exemplo DELETE->`/config/melhorenvio/boleto`.

<br />

# Usando callbacks para retorno:

Além de cadastrar uma rota de mock, é possível cadastrar um callback para a rota responder asíncronamente, simulando um callback do servidor a ser "mockado".
Para cadastrar um endpoint com callback fazer o processo de cadastro mas incluir as seguintes informações no payload:

Payload:

```json
{
  "method": {
    "POST": {
      "response_status": 200,
      "response_data": {
        "hello": "world"
      },
      "callback": {
        "url": "http://melhorenvio.com/boleto/callback",
        "payload": {
          "boleto_id": "001",
          "status": "paid"
        },
        "method": "GET",
        // Delay em milliseconds para chamada do callback
        "delay_ms": 2000
      }
    }
  }
}
```
