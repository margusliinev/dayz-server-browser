import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';
import { updateServerDetails } from '../crons/update-server-details.ts';
import { eq, like, and, gte, lte, sql, or } from 'drizzle-orm';
import { findNewServers } from '../crons/find-new-servers.ts';
import { serversTable } from '../database/schema.ts';
import { db } from '../database/index.ts';

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

    app.get('/servers/search', {
        schema: {
            querystring: Type.Object({
                q: Type.String({ minLength: 1 }),
            }),
        },
        handler: async (request, reply) => {
            try {
                const { q } = request.query as { q: string };
                const searchTerm = `%${q}%`;

                const servers = await db
                    .select()
                    .from(serversTable)
                    .where(
                        and(eq(serversTable.status, 'online'), sql`(${serversTable.name} LIKE ${searchTerm} OR ${serversTable.map} LIKE ${searchTerm} OR ${serversTable.address} LIKE ${searchTerm})`),
                    );

                return reply.status(200).send({
                    success: true,
                    data: servers,
                });
            } catch (error) {
                request.log.error(error, 'Failed to search servers');
                return reply.status(500).send({
                    success: false,
                    error: 'Failed to search servers',
                });
            }
        },
    });

    app.get('/servers/filter', {
        schema: {
            querystring: Type.Object({
                status: Type.Optional(Type.Union([Type.Literal('pending'), Type.Literal('online'), Type.Literal('offline')])),
                map: Type.Optional(Type.String()),
                minPlayers: Type.Optional(Type.Number({ minimum: 0 })),
                maxPlayers: Type.Optional(Type.Number({ minimum: 0 })),
            }),
        },
        handler: async (request, reply) => {
            try {
                const { status, map, minPlayers, maxPlayers } = request.query as {
                    status?: 'pending' | 'online' | 'offline';
                    map?: string;
                    minPlayers?: number;
                    maxPlayers?: number;
                };

                const conditions = [];

                if (status) {
                    conditions.push(eq(serversTable.status, status));
                }

                if (map) {
                    conditions.push(like(serversTable.map, `%${map}%`));
                }

                if (minPlayers !== undefined) {
                    conditions.push(gte(serversTable.players, minPlayers));
                }

                if (maxPlayers !== undefined) {
                    conditions.push(lte(serversTable.players, maxPlayers));
                }

                const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

                const servers = await db.select().from(serversTable).where(whereClause);

                return reply.status(200).send({
                    success: true,
                    data: servers,
                });
            } catch (error) {
                request.log.error(error, 'Failed to filter servers');
                return reply.status(500).send({
                    success: false,
                    error: 'Failed to filter servers',
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
