import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { serversTable } from '../database/schema.ts';
import { db } from '../database/index.ts';
import { Type } from '@sinclair/typebox';
import { eq, or } from 'drizzle-orm';

const servers: FastifyPluginAsync = async (app: FastifyInstance) => {
    app.get('/servers', {
        handler: async (request, reply) => {
            try {
                const notPendingServers = await db
                    .select()
                    .from(serversTable)
                    .where(or(eq(serversTable.status, 'online'), eq(serversTable.status, 'offline')));

                return reply.status(200).send({
                    success: true,
                    data: notPendingServers,
                });
            } catch (error) {
                request.log.error(error, 'Failed to fetch servers');
                return reply.status(500).send({
                    success: false,
                    error: 'Failed to fetch servers',
                });
            }
        },
    });

    app.get('/servers/:id', {
        schema: {
            params: Type.Object({
                id: Type.Number(),
            }),
        },
        handler: async (request, reply) => {
            try {
                const { id } = request.params as { id: number };

                const server = await db.select().from(serversTable).where(eq(serversTable.id, id)).limit(1);

                if (server.length === 0) {
                    return reply.status(404).send({
                        success: false,
                        error: 'Server not found',
                    });
                }

                return reply.status(200).send({
                    success: true,
                    data: server[0],
                });
            } catch (error) {
                request.log.error(error, 'Failed to fetch server');
                return reply.status(500).send({
                    success: false,
                    error: 'Failed to fetch server',
                });
            }
        },
    });
};

export default servers;
