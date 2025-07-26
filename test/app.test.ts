import { test, describe } from 'node:test';
import { app } from './setup.ts';
import assert from 'node:assert';

describe('App', () => {
    test('should return 404 response with success false and not found', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/non-existent-route',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 404);
        assert.strictEqual(body.success, false);
        assert.strictEqual(body.message, 'Not Found');
    });
});
