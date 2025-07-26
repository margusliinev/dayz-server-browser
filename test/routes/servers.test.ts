import { test, describe } from 'node:test';
import { serversTable } from '../../src/database/schema.ts';
import { db } from '../../src/database/index.ts';
import { app } from '../setup.ts';
import assert from 'node:assert';

describe('GET /api/servers', () => {
    test('should return 200 response with success true and array of online servers only', async () => {
        await db.delete(serversTable);
        await db.insert(serversTable).values([
            {
                map: 'Chernarus',
                name: 'Test Server 1',
                address: '193.25.252.55:27016',
                players: 60,
                maxPlayers: 100,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Livonia',
                name: 'Test Server 2',
                address: '193.25.252.82:27016',
                players: 75,
                maxPlayers: 80,
                status: 'online',
                queried_at: new Date('2025-01-01T13:00:00Z'),
            },
            {
                map: 'Chernarus',
                name: 'Test Server 3',
                address: '192.168.1.2:27016',
                players: 0,
                maxPlayers: 50,
                status: 'offline',
                queried_at: new Date('2025-01-01T10:00:00Z'),
            },
        ]);

        const response = await app.inject({
            method: 'GET',
            url: '/api/servers',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.data.length, 2);

        body.data.forEach((server: any) => {
            assert.strictEqual(server.status, 'online');
        });
    });
});
