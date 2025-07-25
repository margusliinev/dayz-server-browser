import { test, describe } from 'node:test';
import { app } from './setup.ts';
import assert from 'node:assert';

describe('App', () => {
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

        const body = await response.json();

        assert.strictEqual(response.statusCode, 404);
        assert.strictEqual(body.success, false);
        assert.strictEqual(body.message, 'Route not found');
    });

    test('should handle errors with custom error handler', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/error-handler-test',
            payload: 'invalid json',
            headers: {
                'content-type': 'application/json',
            },
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 400);
        assert.strictEqual(body.success, false);
    });
});
