import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
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
                request.log.error(error, 'Failed to fetch servers');
                throw error;
            }
        },
    });
};

export default servers;
