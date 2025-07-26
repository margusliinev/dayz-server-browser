import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const health: FastifyPluginAsync = async (app: FastifyInstance) => {
    app.get('/health', async (_req, reply) => {
        return reply.send({ success: true, message: 'OK' });
    });
};

export default health;
