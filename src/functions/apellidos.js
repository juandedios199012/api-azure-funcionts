import { input, output } from '@azure/functions';
import { randomUUID } from 'crypto';

// Configuración de Cosmos DB desde variables de entorno (obligatorias)
export const COSMOS_CONNECTION = 'CosmosDBConnection';
export const COSMOS_DATABASE = process.env.COSMOS_DATABASE;
export const COSMOS_CONTAINER = process.env.COSMOS_CONTAINER;

// Input binding: lista completa de documentos (GET)
export const apellidosListInput = input.cosmosDB({
  connection: COSMOS_CONNECTION,
  databaseName: COSMOS_DATABASE,
  containerName: COSMOS_CONTAINER,
  name: 'apellidosInput',
  sqlQuery: 'SELECT * FROM c WHERE c.tipo = "apellido"' // solo apellidos
});

// Output binding: documento a insertar (POST)
export const apellidosOutput = output.cosmosDB({
  connection: COSMOS_CONNECTION,
  databaseName: COSMOS_DATABASE,
  containerName: COSMOS_CONTAINER,
  name: 'newApellido'
});

export default async function (context, req) {
  context.log('apellidos(v4) Cosmos handler');

  if (req.method === 'GET') {
    const items = context.extraInputs.get(apellidosListInput) || [];
    return new Response(JSON.stringify(items), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const apellido = body.Apellido || body.apellido;
    if (!apellido || typeof apellido !== 'string') {
      return new Response(JSON.stringify({ error: 'Se requiere el campo Apellido (string).' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const doc = {
      id: randomUUID(),
      Apellido: apellido,
      tipo: 'apellido', // para distinguir de nombres
      createdAt: new Date().toISOString()
    };
    context.extraOutputs.set(apellidosOutput, doc);
    return new Response(JSON.stringify(doc), { status: 201, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ error: 'Método no permitido' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
}
