import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';

const ServerSchema = Type.Object({
    id: Type.String(),
    name: Type.String(),
    players: Type.Number(),
    maxPlayers: Type.Number(),
    map: Type.String(),
    status: Type.String(),
});

const ServersResponseSchema = Type.Object({
    success: Type.Boolean(),
    data: Type.Array(ServerSchema),
});

const servers: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    fastify.get('/servers', {
        schema: {
            response: {
                200: ServersResponseSchema,
            },
        },
        handler: async () => {
            const servers = [
                {
                    id: '1',
                    name: 'Official DayZ Server',
                    players: 45,
                    maxPlayers: 60,
                    map: 'Chernarus',
                    status: 'online',
                },
                {
                    id: '2',
                    name: 'Community Server',
                    players: 30,
                    maxPlayers: 50,
                    map: 'Livonia',
                    status: 'online',
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
