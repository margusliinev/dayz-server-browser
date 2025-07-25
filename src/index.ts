import { buildApp } from './app.ts';

const start = async () => {
    try {
        const PORT = process.env.PORT || '3000';
        const app = await buildApp();

        await app.listen({ port: parseInt(PORT || '3000') });

        console.log(`🚀 Server running on http://localhost:${PORT}`);
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

start();
