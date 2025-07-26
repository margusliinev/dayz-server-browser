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

    test('should return empty array when no online servers exist', async () => {
        await db.delete(serversTable);
        await db.insert(serversTable).values([
            {
                map: 'Chernarus',
                name: 'Offline Server',
                address: '192.168.1.1:27016',
                players: 0,
                maxPlayers: 60,
                status: 'offline',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Livonia',
                name: 'Pending Server',
                address: '192.168.1.2:27016',
                players: 0,
                maxPlayers: 40,
                status: 'pending',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
        ]);

        const response = await app.inject({
            method: 'GET',
            url: '/api/servers',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.data.length, 0);
    });
});

describe('GET /api/servers/search', () => {
    test('should return servers matching search term', async () => {
        await db.delete(serversTable);
        await db.insert(serversTable).values([
            {
                map: 'Chernarus',
                name: 'DayZ Community Server',
                address: '193.25.252.55:27016',
                players: 60,
                maxPlayers: 100,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Livonia',
                name: 'Test Server',
                address: '193.25.252.82:27016',
                players: 75,
                maxPlayers: 80,
                status: 'online',
                queried_at: new Date('2025-01-01T13:00:00Z'),
            },
            {
                map: 'Chernarus',
                name: 'Another Server',
                address: '192.168.1.2:27016',
                players: 10,
                maxPlayers: 50,
                status: 'offline',
                queried_at: new Date('2025-01-01T10:00:00Z'),
            },
        ]);

        const response = await app.inject({
            method: 'GET',
            url: '/api/servers/search?q=Community',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.data.length, 1);
        assert.strictEqual(body.data[0].name, 'DayZ Community Server');
        assert.strictEqual(body.data[0].status, 'online');
    });

    test('should return 400 for empty search query', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/api/servers/search?q=',
        });

        assert.strictEqual(response.statusCode, 400);
    });

    test('should search by map name', async () => {
        await db.delete(serversTable);
        await db.insert(serversTable).values([
            {
                map: 'Chernarus',
                name: 'Server A',
                address: '192.168.1.1:27016',
                players: 30,
                maxPlayers: 60,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Livonia',
                name: 'Server B',
                address: '192.168.1.2:27016',
                players: 20,
                maxPlayers: 40,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
        ]);

        const response = await app.inject({
            method: 'GET',
            url: '/api/servers/search?q=Livonia',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.data.length, 1);
        assert.strictEqual(body.data[0].map, 'Livonia');
    });

    test('should search by server address', async () => {
        await db.delete(serversTable);
        await db.insert(serversTable).values([
            {
                map: 'Chernarus',
                name: 'Test Server',
                address: '192.168.1.100:27016',
                players: 30,
                maxPlayers: 60,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Livonia',
                name: 'Another Server',
                address: '10.0.0.1:27016',
                players: 20,
                maxPlayers: 40,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
        ]);

        const response = await app.inject({
            method: 'GET',
            url: '/api/servers/search?q=192.168.1.100',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.data.length, 1);
        assert.strictEqual(body.data[0].address, '192.168.1.100:27016');
    });

    test('should return empty array when no servers match search', async () => {
        await db.delete(serversTable);
        await db.insert(serversTable).values([
            {
                map: 'Chernarus',
                name: 'Test Server',
                address: '192.168.1.1:27016',
                players: 30,
                maxPlayers: 60,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
        ]);

        const response = await app.inject({
            method: 'GET',
            url: '/api/servers/search?q=NonExistentServer',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.data.length, 0);
    });

    test('should handle case-insensitive partial matching', async () => {
        await db.delete(serversTable);
        await db.insert(serversTable).values([
            {
                map: 'Chernarus',
                name: 'DayZ Community Server [VANILLA]',
                address: '192.168.1.1:27016',
                players: 30,
                maxPlayers: 60,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Livonia',
                name: 'PvP Server',
                address: '192.168.1.2:27016',
                players: 20,
                maxPlayers: 40,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
        ]);

        const response = await app.inject({
            method: 'GET',
            url: '/api/servers/search?q=community',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.data.length, 1);
        assert.strictEqual(body.data[0].name, 'DayZ Community Server [VANILLA]');
    });
});

describe('GET /api/servers/filter', () => {
    test('should return servers matching filter criteria', async () => {
        await db.delete(serversTable);
        await db.insert(serversTable).values([
            {
                map: 'Chernarus',
                name: 'High Pop Server',
                address: '193.25.252.55:27016',
                players: 80,
                maxPlayers: 100,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Livonia',
                name: 'Low Pop Server',
                address: '193.25.252.82:27016',
                players: 5,
                maxPlayers: 80,
                status: 'online',
                queried_at: new Date('2025-01-01T13:00:00Z'),
            },
            {
                map: 'Chernarus',
                name: 'Offline Server',
                address: '192.168.1.2:27016',
                players: 0,
                maxPlayers: 50,
                status: 'offline',
                queried_at: new Date('2025-01-01T10:00:00Z'),
            },
        ]);

        const response = await app.inject({
            method: 'GET',
            url: '/api/servers/filter?status=online&minPlayers=50',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.data.length, 1);
        assert.strictEqual(body.data[0].name, 'High Pop Server');
        assert.strictEqual(body.data[0].players, 80);
    });

    test('should filter by map only', async () => {
        await db.delete(serversTable);
        await db.insert(serversTable).values([
            {
                map: 'Chernarus',
                name: 'Cherno Server 1',
                address: '192.168.1.1:27016',
                players: 30,
                maxPlayers: 60,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Chernarus',
                name: 'Cherno Server 2',
                address: '192.168.1.2:27016',
                players: 45,
                maxPlayers: 80,
                status: 'offline',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Livonia',
                name: 'Livonia Server',
                address: '192.168.1.3:27016',
                players: 20,
                maxPlayers: 40,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
        ]);

        const response = await app.inject({
            method: 'GET',
            url: '/api/servers/filter?map=Chernarus',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.data.length, 2);
        body.data.forEach((server: any) => {
            assert.strictEqual(server.map, 'Chernarus');
        });
    });

    test('should filter by multiple criteria', async () => {
        await db.delete(serversTable);
        await db.insert(serversTable).values([
            {
                map: 'Chernarus',
                name: 'Perfect Match',
                address: '192.168.1.1:27016',
                players: 75,
                maxPlayers: 100,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Chernarus',
                name: 'Wrong Status',
                address: '192.168.1.2:27016',
                players: 80,
                maxPlayers: 100,
                status: 'offline',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Livonia',
                name: 'Wrong Map',
                address: '192.168.1.3:27016',
                players: 80,
                maxPlayers: 100,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Chernarus',
                name: 'Too Few Players',
                address: '192.168.1.4:27016',
                players: 10,
                maxPlayers: 100,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
        ]);

        const response = await app.inject({
            method: 'GET',
            url: '/api/servers/filter?status=online&map=Chernarus&minPlayers=50',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.data.length, 1);
        assert.strictEqual(body.data[0].name, 'Perfect Match');
    });

    test('should filter by player count range', async () => {
        await db.delete(serversTable);
        await db.insert(serversTable).values([
            {
                map: 'Chernarus',
                name: 'Low Pop',
                address: '192.168.1.1:27016',
                players: 5,
                maxPlayers: 60,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Chernarus',
                name: 'Medium Pop',
                address: '192.168.1.2:27016',
                players: 25,
                maxPlayers: 60,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Chernarus',
                name: 'High Pop',
                address: '192.168.1.3:27016',
                players: 55,
                maxPlayers: 60,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
        ]);

        const response = await app.inject({
            method: 'GET',
            url: '/api/servers/filter?minPlayers=20&maxPlayers=30',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.data.length, 1);
        assert.strictEqual(body.data[0].name, 'Medium Pop');
        assert.strictEqual(body.data[0].players, 25);
    });

    test('should return empty array when no servers match filters', async () => {
        await db.delete(serversTable);
        await db.insert(serversTable).values([
            {
                map: 'Chernarus',
                name: 'Test Server',
                address: '192.168.1.1:27016',
                players: 10,
                maxPlayers: 60,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
        ]);

        const response = await app.inject({
            method: 'GET',
            url: '/api/servers/filter?status=offline&map=Livonia',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.data.length, 0);
    });

    test('should return all servers when no filters are provided', async () => {
        await db.delete(serversTable);
        await db.insert(serversTable).values([
            {
                map: 'Chernarus',
                name: 'Server 1',
                address: '192.168.1.1:27016',
                players: 30,
                maxPlayers: 60,
                status: 'online',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Livonia',
                name: 'Server 2',
                address: '192.168.1.2:27016',
                players: 0,
                maxPlayers: 40,
                status: 'offline',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
            {
                map: 'Namalsk',
                name: 'Server 3',
                address: '192.168.1.3:27016',
                players: 15,
                maxPlayers: 32,
                status: 'pending',
                queried_at: new Date('2025-01-01T12:00:00Z'),
            },
        ]);

        const response = await app.inject({
            method: 'GET',
            url: '/api/servers/filter',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.data.length, 3);
    });
});

describe('GET /api/servers/:id', () => {
    test('should return specific server by id', async () => {
        await db.delete(serversTable);
        const [insertResult] = await db.insert(serversTable).values({
            map: 'Chernarus',
            name: 'Specific Server',
            address: '193.25.252.55:27016',
            players: 60,
            maxPlayers: 100,
            status: 'online',
            queried_at: new Date('2025-01-01T12:00:00Z'),
        });

        const response = await app.inject({
            method: 'GET',
            url: `/api/servers/${insertResult.insertId}`,
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(body.success, true);
        assert.strictEqual(body.data.name, 'Specific Server');
        assert.strictEqual(body.data.id, insertResult.insertId);
    });

    test('should return 400 for invalid server id', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/api/servers/invalid',
        });

        assert.strictEqual(response.statusCode, 400);
    });

    test('should return 404 for non-existent server id', async () => {
        await db.delete(serversTable);

        const response = await app.inject({
            method: 'GET',
            url: '/api/servers/99999',
        });

        const body = await response.json();

        assert.strictEqual(response.statusCode, 404);
        assert.strictEqual(body.success, false);
        assert.strictEqual(body.error, 'Server not found');
    });
});
