import { runMigrations } from './database/index.ts';
import { buildApp } from './app.ts';

const start = async () => {
    try {
        await runMigrations();
        const PORT = parseInt(process.env.PORT || '3000');
        const HOST = process.env.NODE_ENV === 'production' ? '::' : '127.0.0.1';

        const app = await buildApp();
        await app.listen({ port: PORT, host: HOST });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
