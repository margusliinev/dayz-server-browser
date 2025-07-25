import { test, describe } from 'node:test';
import { app } from '../setup.ts';
import assert from 'node:assert';

describe('GET /api/servers', () => {
    test('should return success response with servers array', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/api/servers',
        });

        const body = await response.json();

        assert.strictEqual(Array.isArray(body.data), true);
        assert.strictEqual(body.data.length, 2);
    });

    test('should return servers with correct properties', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/api/servers',
        });

        const body = await response.json();

        body.data.forEach((server: any) => {
            assert.strictEqual(typeof server.id, 'string');
            assert.strictEqual(typeof server.name, 'string');
            assert.strictEqual(typeof server.players, 'number');
            assert.strictEqual(typeof server.maxPlayers, 'number');
            assert.strictEqual(typeof server.map, 'string');
            assert.strictEqual(typeof server.status, 'string');

            assert.ok(server.players >= 0);
            assert.ok(server.maxPlayers > 0);
            assert.ok(server.players <= server.maxPlayers);
        });
    });
});
