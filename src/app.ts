import type { FastifyInstance } from 'fastify';
import fastify from 'fastify';
import autoload from '@fastify/autoload';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function buildApp(): Promise<FastifyInstance> {
    const app = fastify({ logger: false });

    await app.register(autoload, {
        dir: join(__dirname, 'routes'),
        options: { prefix: '/api' },
    });

    app.get('/health', async () => {
        return { success: true, message: 'OK' };
    });

    return app;
}
