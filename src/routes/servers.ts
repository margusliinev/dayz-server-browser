import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { updateServerDetails } from '../crons/update-server-details.ts';
import { findNewServers } from '../crons/find-new-servers.ts';
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

    app.post('/servers/discover', {
        handler: async (request, reply) => {
            try {
                const result = await findNewServers(app);

                return reply.status(200).send({
                    success: true,
                    data: result,
                });
            } catch (error) {
                request.log.error(error, 'Server discovery job failed');
                return reply.status(500).send({
                    success: false,
                    error: 'Failed to discover servers',
                });
            }
        },
    });

    app.post('/servers/update', {
        handler: async (request, reply) => {
            try {
                const result = await updateServerDetails(app);

                return reply.status(200).send({
                    success: true,
                    data: result,
                });
            } catch (error) {
                request.log.error(error, 'Server update job failed');
                return reply.status(500).send({
                    success: false,
                    error: 'Failed to update server details',
                });
            }
        },
    });
};

export default servers;
