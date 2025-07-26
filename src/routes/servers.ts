import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';
import { db } from '../database/index.ts';
import { serversTable } from '../database/schema.ts';
import { eq } from 'drizzle-orm';

const ServerSchema = Type.Object({
    id: Type.Number(),
    address: Type.String({ maxLength: 255 }),
    name: Type.Union([Type.String({ maxLength: 255 }), Type.Null()]),
    map: Type.Union([Type.String({ maxLength: 255 }), Type.Null()]),
    players: Type.Number({ minimum: 0 }),
    maxPlayers: Type.Number({ minimum: 0 }),
    status: Type.Union([Type.Literal('pending'), Type.Literal('online'), Type.Literal('offline')]),
    queried_at: Type.Union([Type.String({ format: 'date-time' }), Type.Null()]),
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
        handler: async (request, reply) => {
            try {
                const onlineServers = await db.select().from(serversTable).where(eq(serversTable.status, 'online'));

                return reply.status(200).send({
                    success: true,
                    data: onlineServers,
                });
            } catch (error) {
                request.log.error(error, 'Failed to fetch servers');
                throw error;
            }
        },
    });
};

export default servers;
