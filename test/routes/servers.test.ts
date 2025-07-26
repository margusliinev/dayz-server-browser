import { test, describe } from 'node:test';
import { app } from '../setup.ts';
import assert from 'node:assert';

describe('GET /api/servers', () => {
    test('should return 200 response with success true and array of servers', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/api/servers',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.data.length, 2);

        body.data.forEach((server: any) => {
            assert.strictEqual(typeof server.id, 'number');
            assert.strictEqual(typeof server.map, 'string');
            assert.strictEqual(typeof server.name, 'string');
            assert.strictEqual(typeof server.address, 'string');
            assert.strictEqual(typeof server.players, 'number');
            assert.strictEqual(typeof server.maxPlayers, 'number');
            assert.strictEqual(typeof server.created_at, 'string');
            assert.strictEqual(typeof server.updated_at, 'string');
        });
    });
});
