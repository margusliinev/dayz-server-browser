import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import type { Server } from '../database/schema.ts';
import { Type } from '@sinclair/typebox';

const ServerSchema = Type.Object({
    id: Type.Number(),
    map: Type.String({ maxLength: 255 }),
    name: Type.String({ maxLength: 255 }),
    address: Type.String({ maxLength: 255 }),
    players: Type.Number({ minimum: 0 }),
    maxPlayers: Type.Number({ minimum: 0 }),
    created_at: Type.String({ format: 'date-time' }),
    updated_at: Type.String({ format: 'date-time' }),
});

const ServersResponseSchema = Type.Object({
    success: Type.Boolean(),
    data: Type.Array(ServerSchema),
});

const servers: FastifyPluginAsync = async (app: FastifyInstance) => {
    app.get('/servers', {
        schema: {
            response: {
                200: ServersResponseSchema,
            },
        },
        handler: async () => {
            const servers: Server[] = [
                {
                    id: 1,
                    map: 'Chernarus',
                    name: 'Mega DayZ Server',
                    address: '193.25.252.55:27016',
                    players: 60,
                    maxPlayers: 100,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    id: 2,
                    map: 'Livonia',
                    name: 'Super DayZ Server',
                    address: '193.25.252.82:27016',
                    players: 75,
                    maxPlayers: 80,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ];

            return {
                success: true,
                data: servers,
            };
        },
    });
};

export default servers;
