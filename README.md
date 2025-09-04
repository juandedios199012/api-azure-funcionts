- `src/index.js` - punto de registro (app.http) para las funciones v4.
- `src/functions/names.js` - handler ESM para GET/POST con bindings de Cosmos DB.
- `host.json` - configuración de host para Azure Functions.


Azure Functions simple: NamesFunction (Node.js programming model v4 + Cosmos DB)

Descripción
- API HTTP mínima que expone GET y POST en `/api/names`. Cada documento se guarda en Azure Cosmos DB (contiene `id`, `Nombre`, `createdAt`).

Estructura y componentes
- `src/index.js`: registro de funciones con `app.http` (modelo v4, ESM).
- `src/functions/names.js`: handler principal; GET devuelve todos los documentos (query simple) y POST crea un documento nuevo en Cosmos DB.
- `host.json`: configuración de host para Azure Functions.
- `package.json`: metadata y scripts.

Ejemplos
-------

Ejemplo POST (crear una entrada):

```bash
curl -X POST http://localhost:7071/api/names \
	-H "Content-Type: application/json" \
	-d '{ "Nombre": "María" }'
```

Respuesta esperada (201 Created):

```json
{
	"Nombre": "María",
	"createdAt": "2025-09-02T23:00:00.000Z"
}
```

Ejemplo GET (listar entradas):

```bash
curl http://localhost:7071/api/names
```

Respuesta esperada (200 OK):

```json
[
	{ "Nombre": "Juan", "createdAt": "2025-09-02T22:45:56.537Z" },
	{ "Nombre": "María", "createdAt": "2025-09-02T23:00:00.000Z" }
]
```

Diagrama simple
--------------

Request -> Function (POST / GET) -> Bindings Cosmos (`namesInput` / `newName`) -> Cosmos DB



Configuración en Azure
-------------------

1. Crea un Azure Function App (Linux/Windows) con Node 18+.
2. Crea una cuenta Cosmos DB y contenedor:
   - Database: `NamesDB`
   - Container: `Names`  
   - Partition key: `/id`
3. En el Function App, ve a **Configuration** → **Environment variables** → **App settings**:
   - Añade: `CosmosDBConnection` = `AccountEndpoint=https://tu-cuenta.documents.azure.com:443/;AccountKey=tu-key;`
4. Despliega el código usando VS Code, `func azure functionapp publish` o CI/CD.

Endpoint de producción: `https://tu-function-app.azurewebsites.net/api/names`

Notas y recomendaciones
- Ajusta la partición del contenedor Cosmos (ej. `/Nombre`) si esperas muchas consultas filtradas por ese campo.
- La query actual (`SELECT * FROM c`) es de demostración; para producción añade paginación o filtros.
- Usa variables de entorno seguras / Azure Key Vault para la cadena de conexión.
- Siguientes mejoras posibles:
	- Añadir validación adicional.
	- Implementar paginación (continuation tokens).
	- Añadir filtros por `Nombre` usando parámetros en la query.

Contacto
- Si necesitas que haga alguna de las tareas anteriores, indícalo y lo implemento.
