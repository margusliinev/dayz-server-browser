import { buildApp } from './app.ts';
import { runMigrations } from './database/index.ts';

const start = async () => {
    try {
        await runMigrations();
        const PORT = parseInt(process.env.PORT || '3000');

        const app = await buildApp();
        await app.listen({ port: PORT, host: '127.0.0.1' });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
