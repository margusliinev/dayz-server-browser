import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';

declare global {
    var db: MySql2Database | undefined;
}

const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 10,
});

let db: MySql2Database;

if (process.env.NODE_ENV === 'production') {
    db = drizzle({ client: pool });
} else {
    if (!global.db) global.db = drizzle({ client: pool });
    db = global.db;
}

async function runMigrations() {
    try {
        const client = await mysql.createConnection({
            uri: process.env.DATABASE_URL,
            connectionLimit: 1,
        });

        const db = drizzle({ client });
        await migrate(db, { migrationsFolder: './src/database/migrations' });
        console.log('Migrations completed successfully');

        await client.end();
    } catch (error) {
        console.error('Error running migrations:', error);
    }
}

export { db, runMigrations };
