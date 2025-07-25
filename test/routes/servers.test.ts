import type { FastifyInstance } from 'fastify';
import { test, describe, before, after } from 'node:test';
import { buildApp } from '../../src/app.ts';
import assert from 'node:assert';

describe('Servers API Tests', () => {
    let app: FastifyInstance;

    before(async () => {
        app = await buildApp();
    });

    after(async () => {
        await app.close();
    });

    test('GET /api/servers should return list of servers', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/api/servers',
        });

        assert.strictEqual(response.statusCode, 200);
    });
});
