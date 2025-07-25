import type { FastifyInstance } from 'fastify';
import { before, after } from 'node:test';
import { buildApp } from '../src/app.ts';

let app: FastifyInstance;

before(async () => {
    app = await buildApp({ isTest: true });
});

after(async () => {
    await app.close();
});

export { app };
