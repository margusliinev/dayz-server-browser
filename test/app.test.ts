import { test, describe } from 'node:test';
import { app } from './setup.ts';
import assert from 'node:assert';

describe('GET /health', () => {
    test('health check endpoint should return success response', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/health',
        });

        const body = await response.json();

        assert.strictEqual(body.message, 'OK');
    });

    test('should return 404 for non-existent routes', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/non-existent-route',
        });

        assert.strictEqual(response.statusCode, 404);
    });
});
