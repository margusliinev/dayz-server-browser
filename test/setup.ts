import type { FastifyInstance } from 'fastify';
import { client } from '../src/database/index.ts';
import { before, after } from 'node:test';
import { buildApp } from '../src/app.ts';

let app: FastifyInstance;

before(async () => {
    app = await buildApp();
});

after(async () => {
    await app.close();
    await client.end();
});

export { app };
