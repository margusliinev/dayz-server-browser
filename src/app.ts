import type { FastifyInstance } from 'fastify';
import fastify from 'fastify';
import autoload from '@fastify/autoload';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from './helpers/logger.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function buildApp({ isTest }: { isTest: boolean }): Promise<FastifyInstance> {
    if (isTest) {
        process.env.NODE_ENV = 'test';
    }

    const app = fastify({ logger: config, disableRequestLogging: true });

    await app.register(autoload, {
        dir: join(__dirname, 'routes'),
        options: { prefix: '/api' },
    });

    app.get('/health', async (_req, reply) => {
        return reply.send({ success: true, message: 'OK' });
    });

    app.setErrorHandler(async (error, request, reply) => {
        request.log.error(error);

        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';

        return reply.status(statusCode).send({
            success: false,
            message,
        });
    });

    app.setNotFoundHandler(async (_request, reply) => {
        return reply.status(404).send({
            success: false,
            message: 'Route not found',
        });
    });

    return app;
}
