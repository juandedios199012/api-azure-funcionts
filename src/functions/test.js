import { app } from '@azure/functions';

export async function testHandler(request, context) {
  context.log('test function executed - basic handler');
  
  return { 
    status: 200,
    jsonBody: {
      message: 'Function is working perfectly!',
      method: request.method,
      timestamp: new Date().toISOString(),
      status: 'OK'
    }
  };
}

// Registro directo en el mismo archivo
app.http('test', {
  route: 'test',
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: testHandler
});
