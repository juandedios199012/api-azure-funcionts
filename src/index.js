import { app, input, output } from '@azure/functions';
import namesHandler, { namesListInput, namesOutput } from './functions/names.js';
import apellidosHandler, { apellidosListInput, apellidosOutput } from './functions/apellidos.js';
import testHandler from './functions/test.js';

// Función de debug sin Cosmos DB
app.http('test', {
  route: 'test',
  methods: ['GET', 'POST'],
  authLevel: 'anonymous'
}, testHandler);

// Registro del endpoint /api/names
app.http('names', {
  route: 'names',
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  extraInputs: [namesListInput],
  extraOutputs: [namesOutput]
}, namesHandler);

// Registro del endpoint /api/apellidos (para diagnóstico)
app.http('apellidos', {
  route: 'apellidos',
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  extraInputs: [apellidosListInput],
  extraOutputs: [apellidosOutput]
}, apellidosHandler);
