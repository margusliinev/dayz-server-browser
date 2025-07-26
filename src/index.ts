import { runMigrations } from './database/index.ts';
import { buildApp } from './app.ts';

const start = async () => {
    try {
        const PORT = parseInt(process.env.PORT || '3000');
        await runMigrations();

        const app = await buildApp({ isTest: false });
        await app.listen({ port: PORT, host: '127.0.0.1' });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
