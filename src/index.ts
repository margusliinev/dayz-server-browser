import { buildApp } from './app.ts';

const start = async () => {
    try {
        const PORT = parseInt(process.env.PORT || '3000');
        const app = await buildApp({ isTest: false });

        await app.listen({ port: PORT, host: '0.0.0.0' });

        const gracefulShutdown = async (signal: string) => {
            console.log(`Received ${signal}, shutting down gracefully...`);
            try {
                await app.close();
                console.log('Server closed successfully');
                process.exit(0);
            } catch (err) {
                console.error('Error during shutdown:', err);
                process.exit(1);
            }
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
