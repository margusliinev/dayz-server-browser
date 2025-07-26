import { test, describe, beforeEach } from 'node:test';
import { app } from '../setup.ts';
import assert from 'node:assert';
import { db } from '../../src/database/index.ts';
import { serversTable } from '../../src/database/schema.ts';

describe('GET /api/servers', () => {
    beforeEach(async () => {
        await db.delete(serversTable);

        await db.insert(serversTable).values([
            {
                map: 'Chernarus',
                name: 'Test Server 1',
                address: '193.25.252.55:27016',
                players: 60,
                maxPlayers: 100,
                status: 'online',
                queried_at: new Date(),
            },
            {
                map: 'Livonia',
                name: 'Test Server 2',
                address: '193.25.252.82:27016',
                players: 75,
                maxPlayers: 80,
                status: 'online',
                queried_at: new Date(),
            },
            {
                map: null,
                name: null,
                address: '192.168.1.1:27016',
                players: 0,
                maxPlayers: 0,
                status: 'pending',
                queried_at: null,
            },
        ]);
    });

    test('should return 200 response with success true and array of online servers only', async () => {
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
            assert.strictEqual(typeof server.address, 'string');
            assert.strictEqual(typeof server.players, 'number');
            assert.strictEqual(typeof server.maxPlayers, 'number');
            assert.strictEqual(typeof server.created_at, 'string');
            assert.strictEqual(typeof server.updated_at, 'string');
            assert.strictEqual(server.status, 'online');

            if (server.status === 'online') {
                assert.strictEqual(typeof server.name, 'string');
                assert.strictEqual(typeof server.map, 'string');
            }
        });
    });
});
