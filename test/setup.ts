import type { FastifyInstance } from 'fastify';
import { pool, runMigrations } from '../src/database/index.ts';
import { before, after } from 'node:test';
import { buildApp } from '../src/app.ts';

let app: FastifyInstance;

export async function globalSetup() {
    await runMigrations();
}

before(async () => {
    app = await buildApp();
});

after(async () => {
    await app.close();
    await pool.end();
});

export { app };
