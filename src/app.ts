import type { FastifyInstance } from 'fastify';
import { loggerConfig } from './helpers/logger.ts';
import { registerCrons } from './crons/index.ts';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import autoload from '@fastify/autoload';
import fastifyStatic from '@fastify/static';
import fastifyCron from 'fastify-cron';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastify from 'fastify';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function buildApp(): Promise<FastifyInstance> {
    const app = fastify({
        logger: loggerConfig,
        disableRequestLogging: true,
        requestIdLogLabel: 'request_id',
        genReqId: () => randomUUID(),
    });

    await app.register(fastifyHelmet);
    await app.register(fastifyCors, {
        origin: 'https://dayz-server-browser.up.railway.app',
    });

    await app.register(fastifyRateLimit, {
        max: 100,
        timeWindow: '1 minute',
        allowList: [],
        ban: 2,
        addHeaders: {
            'x-ratelimit-limit': true,
            'x-ratelimit-remaining': true,
            'x-ratelimit-reset': true,
        },
    });

    await app.register(autoload, {
        dir: join(__dirname, 'routes'),
        options: { prefix: '/api' },
    });

    if (process.env.NODE_ENV === 'production') {
        app.register(fastifyStatic, {
            root: join(__dirname, '..', 'ui', 'build'),
            prefix: '/',
            index: 'index.html',
        });

        app.register(fastifyCron.default, {
            jobs: registerCrons(app),
        });
    }

    app.setNotFoundHandler((request, reply) => {
        request.log.warn('Not Found: %s', request.raw.url);

        return reply.status(404).send({
            success: false,
            message: 'Not Found',
        });
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

    return app;
}
