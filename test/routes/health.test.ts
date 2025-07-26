import { test, describe } from 'node:test';
import { app } from '../setup.ts';
import assert from 'node:assert';

describe('GET /api/health', () => {
    test('should return 200 response with success true and ok', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/api/health',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.message, 'OK');
    });
});
