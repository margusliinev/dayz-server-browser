import type { FastifyInstance } from 'fastify';
import { test, describe, before, after } from 'node:test';
import { buildApp } from '../src/app.ts';
import assert from 'node:assert';

describe('App Tests', () => {
    let app: FastifyInstance;

    before(async () => {
        app = await buildApp();
    });

    after(async () => {
        await app.close();
    });

    test('health check endpoint should work', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/health',
        });

        assert.strictEqual(response.statusCode, 200);
    });
});
