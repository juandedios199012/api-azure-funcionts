import { app, input, output } from '@azure/functions';

// Bindings de Cosmos DB
const namesInput = input.cosmosDB({
  connection: 'CosmosDBConnection',
  databaseName: process.env.COSMOS_DATABASE,
  containerName: process.env.COSMOS_CONTAINER,
  sqlQuery: 'SELECT * FROM c'
});

const namesOutput = output.cosmosDB({
  connection: 'CosmosDBConnection',
  databaseName: process.env.COSMOS_DATABASE,
  containerName: process.env.COSMOS_CONTAINER
});

export async function namesHandler(request, context) {
  context.log('names function executed');
  
  if (request.method === 'GET') {
    const items = context.extraInputs.get(namesInput) || [];
    return { 
      status: 200,
      jsonBody: items
    };
  }

  if (request.method === 'POST') {
    const body = await request.json();
    const nombre = body.Nombre || body.nombre;
    
    if (!nombre || typeof nombre !== 'string') {
      return { 
        status: 400, 
        jsonBody: { error: 'Se requiere el campo Nombre (string).' }
      };
    }

    const doc = {
      id: crypto.randomUUID(),
      Nombre: nombre,
      createdAt: new Date().toISOString()
    };
    
    context.extraOutputs.set(namesOutput, doc);
    return { 
      status: 201, 
      jsonBody: doc 
    };
  }

  return { 
    status: 405, 
    jsonBody: { error: 'Método no permitido' } 
  };
}

// Registro de la función con bindings
app.http('names', {
  route: 'names',
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  extraInputs: [namesInput],
  extraOutputs: [namesOutput],
  handler: namesHandler
});
