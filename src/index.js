import { app } from '@azure/functions';
import testHandler from './functions/test.js';

// Solo función de test para diagnóstico
app.http('test', {
  route: 'test',
  methods: ['GET', 'POST'],
  authLevel: 'anonymous'
}, testHandler);

// TODO: Agregar otras funciones después de solucionar el problema base
