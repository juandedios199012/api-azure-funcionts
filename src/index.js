import { app, input, output } from '@azure/functions';
import namesHandler, { namesListInput, namesOutput } from './functions/names.js';

// Registro único del endpoint /api/names con bindings Cosmos DB definidos en el handler
app.http('names', {
  route: 'names',
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  extraInputs: [namesListInput],
  extraOutputs: [namesOutput]
}, namesHandler);
