import type { FastifyInstance } from 'fastify';
import { runMigrations } from './database/index.ts';
import { loggerConfig } from './helpers/logger.ts';
import { registerCrons } from './crons/index.ts';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import autoload from '@fastify/autoload';
import fastifyCron from 'fastify-cron';
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

    if (process.env.NODE_ENV === 'production') {
        app.register(fastifyCron.default, {
            jobs: registerCrons(app),
        });
    }

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
