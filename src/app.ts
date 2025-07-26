import type { FastifyInstance } from 'fastify';
import { runMigrations } from './database/index.ts';
import { loggerConfig } from './helpers/logger.ts';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import autoload from '@fastify/autoload';
import fastify from 'fastify';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function buildApp(): Promise<FastifyInstance> {
    await runMigrations();

    const app = fastify({
        logger: loggerConfig,
        disableRequestLogging: true,
        requestIdLogLabel: 'request_id',
        genReqId: () => crypto.randomUUID(),
    });

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
            message: 'Not Found',
        });
    });

    return app;
}
