# Mock API Server

Mock API server with callback responses

## Tech stack:

- Framework: NestJs
- Database: In-memory
- Testing framework: Jest

## Installlation:

- Clone repo
- `docker-compose up`

# Setup routes and callbacks using a JSON file

Edit the file `./mock_routes/mocks.example.json`.

Follow the example already present in the file to create new routes.

Save a new file and edit the .env option `MOCK_FILE` to point to the new file.

# Interacting with the API:

## Adding new endpoint temporarily using the API:

Supose you want to create a new endpoint: `/credit-card-processor/pay`

- send a POST request to: `/management/credit-card-processor/pay` - anything after management becomes your identifier for this endpoint

Example payload for the example route:

```json
{
  "method": {
    "POST": {
      "response_status": 201,
      "response_data": {
        "externalId": "<id>",
        "message": "Payment created successfully"
      }
    },
    "GET": {
      "response_status": 200,
      "response_data": [{ "paid": true, "code": "0001" }]
    }
  }
}
```

You can setup custom responses from the endpoint by specifying special keys using this notation: `<key>`.
In the example above, every POST request send to this endpoint will response with the `id` sent in the POST request body.

If a POST request to `<server-url>/credit-card-processor/pay` with the body `{id:256}` is sent, then the endpoint will return a status code 201 with the following body `{"externalId": 256, "message": "Payment created successfully"}`

## Check your route configuration:

GET `/management/<your-custom-route>`

Example: GET->`/management/credit-card-processor/pay`.

## Updating the response from a endpoint:

PATCH `/management/<your-custom-route>`

Exemplo PATCH->`/management/credit-card-processor/pay`.
The payload must follow the same format from the add endpoint instructions

## Deleting a route:

DELETE `/management/<your-custom-route>`

<br />

# Callbacks:

This was the main motivation for creating this mock-server.
You can not only create mock routes, but program them to respond assynchronously to your requests.

To add callback to your routes you can especify the callback info when creating a mock route.

Example Payload:

```json
{
  "method": {
    "POST": {
      "response_status": 201,
      "response_data": {
        "externalId": "<id>",
        "message": "Payment created successfully"
      },
      "callback": {
        "url": "http://<respond-to-url>",
        "payload": {
          "payment_id": "001",
          "externalId": "<id>", // Also supports dynamic fields
          "status": "paid",
          "message": "Payment processed successfully"
        },
        "method": "POST",
        "delay_ms": 2000 // Delay in ms before emiting the callback
      }
    },
    "GET": {
      "response_status": 200,
      "response_data": [{ "paid": true, "code": "0001" }]
    }
  }
}
```
