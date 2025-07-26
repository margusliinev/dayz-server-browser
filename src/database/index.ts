import { migrate } from 'drizzle-orm/mysql2/migrator';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 10,
});

const db = drizzle({ client: pool });

async function runMigrations() {
    let migrationClient: mysql.Connection | undefined;
    try {
        migrationClient = await mysql.createConnection({
            uri: process.env.DATABASE_URL,
            connectionLimit: 1,
        });
        const migrationDb = drizzle({ client: migrationClient });

        console.info('🚧 Database migrations started');
        await migrate(migrationDb, { migrationsFolder: './src/database/migrations' });
        console.info('✅ Database migrations completed');
    } catch (error) {
        console.error('❌ Database migrations failed');
        throw error;
    } finally {
        if (migrationClient) {
            await migrationClient.end();
        }
    }
}

export { db, pool, runMigrations };
