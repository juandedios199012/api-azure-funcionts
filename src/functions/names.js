import { input, output } from '@azure/functions';
import { randomUUID } from 'crypto';

// Configuración de Cosmos DB desde variables de entorno (más seguro)
export const COSMOS_CONNECTION = 'CosmosDBConnection';
export const COSMOS_DATABASE = process.env.COSMOS_DATABASE || 'NamesDB';
export const COSMOS_CONTAINER = process.env.COSMOS_CONTAINER || 'Names';

// Input binding: lista completa de documentos (GET)
export const namesListInput = input.cosmosDB({
  connection: COSMOS_CONNECTION,
  databaseName: COSMOS_DATABASE,
  containerName: COSMOS_CONTAINER,
  name: 'namesInput',
  sqlQuery: 'SELECT * FROM c' // simple full scan (ajustar para filtros o paginación)
});

// Output binding: documento a insertar (POST)
export const namesOutput = output.cosmosDB({
  connection: COSMOS_CONNECTION,
  databaseName: COSMOS_DATABASE,
  containerName: COSMOS_CONTAINER,
  name: 'newName'
});

export default async function (context, req) {
  context.log('names(v4) Cosmos handler');

  if (req.method === 'GET') {
    const items = context.extraInputs.get(namesListInput) || [];
    return new Response(JSON.stringify(items), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const nombre = body.Nombre || body.nombre;
    if (!nombre || typeof nombre !== 'string') {
      return new Response(JSON.stringify({ error: 'Se requiere el campo Nombre (string).' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const doc = {
      id: randomUUID(),
      Nombre: nombre,
      createdAt: new Date().toISOString()
    };
    context.extraOutputs.set(namesOutput, doc);
    return new Response(JSON.stringify(doc), { status: 201, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ error: 'Método no permitido' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
}
