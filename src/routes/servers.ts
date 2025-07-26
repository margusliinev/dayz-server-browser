import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { findNewServers } from '../crons/find-new-servers.ts';
import { updateServerDetails } from '../crons/update-server-details.ts';
import { serversTable } from '../database/schema.ts';
import { db } from '../database/index.ts';
import { eq } from 'drizzle-orm';

const servers: FastifyPluginAsync = async (app: FastifyInstance) => {
    app.get('/servers', {
        handler: async (request, reply) => {
            try {
                const onlineServers = await db.select().from(serversTable).where(eq(serversTable.status, 'online'));

                return reply.status(200).send({
                    success: true,
                    data: onlineServers,
                });
            } catch (error) {
                request.log.error(error, 'Failed to fetch online servers');
                return reply.status(500).send({
                    success: false,
                    error: 'Failed to fetch servers',
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
