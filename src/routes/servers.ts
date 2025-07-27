import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import type { Server } from '../database/schema.ts';
import { serversTable } from '../database/schema.ts';
import { db } from '../database/index.ts';
import { Type } from '@sinclair/typebox';
import { eq, or } from 'drizzle-orm';

const servers: FastifyPluginAsync = async (app: FastifyInstance) => {
    let cachedServers: Server[] | null = null;
    let cacheTimestamp = 0;
    const CACHE_TTL_MS = 10 * 1000;

    app.get('/servers', {
        handler: async (request, reply) => {
            const now = Date.now();
            if (cachedServers && now - cacheTimestamp < CACHE_TTL_MS) {
                request.log.info('Servers Cache HIT');
                return reply.status(200).send({
                    success: true,
                    data: cachedServers,
                });
            }
            try {
                const notPendingServers = await db
                    .select()
                    .from(serversTable)
                    .where(or(eq(serversTable.status, 'online'), eq(serversTable.status, 'offline')));

                cachedServers = notPendingServers;
                cacheTimestamp = now;

                request.log.info('Servers Cache MISS');
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

    const serverIdCache: Map<number, { data: Server | null | undefined; timestamp: number }> = new Map();

    app.get('/servers/:id', {
        schema: {
            params: Type.Object({
                id: Type.Number(),
            }),
        },
        handler: async (request, reply) => {
            const { id } = request.params as { id: number };
            const now = Date.now();
            const cached = serverIdCache.get(id);
            if (cached && now - cached.timestamp < CACHE_TTL_MS) {
                request.log.info(`Server ${id} Cache HIT`);
                return reply.status(200).send({
                    success: true,
                    data: cached.data,
                });
            }
            try {
                const server = await db.select().from(serversTable).where(eq(serversTable.id, id)).limit(1);

                if (server.length === 0) {
                    return reply.status(404).send({
                        success: false,
                        error: 'Server not found',
                    });
                }

                serverIdCache.set(id, { data: server[0], timestamp: now });
                request.log.info(`Server ${id} Cache MISS`);
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
