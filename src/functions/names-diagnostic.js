import { app } from '@azure/functions';

export async function namesDiagnosticHandler(request, context) {
  context.log('names-diagnostic function executed');
  
  return { 
    status: 200,
    jsonBody: {
      message: 'Names function is working (no Cosmos DB)!',
      method: request.method,
      timestamp: new Date().toISOString(),
      env: {
        COSMOS_DATABASE: process.env.COSMOS_DATABASE || 'NOT_SET',
        COSMOS_CONTAINER: process.env.COSMOS_CONTAINER || 'NOT_SET',
        CosmosDBConnection: process.env.CosmosDBConnection ? 'SET' : 'NOT_SET'
      }
    }
  };
}

// Registro sin Cosmos DB bindings
app.http('names-diag', {
  route: 'names-diag',
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: namesDiagnosticHandler
});
