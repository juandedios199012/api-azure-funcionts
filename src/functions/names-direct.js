import { app } from '@azure/functions';
import { CosmosClient } from '@azure/cosmos';
import crypto from 'crypto';

// Función que se conecta directamente a Cosmos DB sin bindings
export async function namesDirectHandler(request, context) {
  context.log('names-direct function executed');
  
  try {
    // Configuración de Cosmos DB
    const cosmosClient = new CosmosClient(process.env.CosmosDBConnection);
    const database = cosmosClient.database(process.env.COSMOS_DATABASE);
    const container = database.container(process.env.COSMOS_CONTAINER);
    
    if (request.method === 'GET') {
      // Obtener todos los nombres
      const { resources: items } = await container.items.readAll().fetchAll();
      
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
      
      // Crear el documento en Cosmos DB
      const { resource: createdItem } = await container.items.create(doc);
      
      return { 
        status: 201, 
        jsonBody: createdItem 
      };
    }

    return { 
      status: 405, 
      jsonBody: { error: 'Método no permitido' } 
    };
    
  } catch (error) {
    context.log('Error:', error);
    return {
      status: 500,
      jsonBody: { 
        error: 'Error interno del servidor',
        details: error.message 
      }
    };
  }
}

// Registro de la función SIN bindings complejos
app.http('names-direct', {
  route: 'names',  // Mismo route que la función original
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: namesDirectHandler
});
