# Financial Mock API Server

Servidor para prover endpoints para "mockar" respostas e callbacks dos serviços usados pelo time financeiro.

## Detalhes técnicos:

- Framework: NestJs
- Database: MongoDB?
- Testing framework: Jest (SWC transpiler)

## Instalação:

- Baixe o repositório
- `docker-compose up`

# Cadastrando um novo endpoint para mock:

Suponhamos que queira cadastrar o endpoint: `/yapay/boleto`

- Fazer um POST para: `/config/yapay/boleto` (toda rota após /config/ será gravada como chave do registro)

- Payload (Especificar os métodos que o endpoint irá aceitar e parametros):

```json
{
  "method": {
    "POST": {
      "response_status": 201,
      "response_data": {
        "message": "Record created successfully"
      }
    },
    "GET": {
      "response_status": 200,
      "response_data": [{ "paid": true, "code": "xyz" }]
    }
  }
}
```

## Verificando informações cadastradas para rota:

- Fazer um GET para a rota cadastrada prefixado com `config`.
  Exemplo GET->`/config/yapay/boleto`.

## Acessando o endpoint cadastrado:

- Cadastramos os métodos POST e GET. Então ao acessar o endpoint `http://localhost/yapay/boleto` com GET teremos a resposta cadastrada em `response_data` com o status `response_status`.

O mesmo é válido para o caso do método POST cadastrado.

## Atualizando o endpoint cadastrado:

- Fazer um PATCH para a rota cadastrada prefixado com `config`.
  Exemplo PATCH->`/config/yapay/boleto`. O payload deve seguir o formato usado no cadastro.

## Deletando uma rota cadastrada:

- Fazer um DELETE para a rota cadastrada prefixado com `config`.
  Exemplo DELETE->`/config/yapay/boleto`.

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
        "url": "http://melhorenvio.com/yapay/callback",
        "payload": {
          "boleto_id": "xyz",
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
