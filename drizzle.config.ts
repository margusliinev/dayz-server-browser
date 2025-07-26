import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'mysql',
    schema: './src/database/schema.ts',
    out: './src/database/migrations',
    migrations: { table: 'migrations' },
    dbCredentials: { url: process.env.DATABASE_URL! },
    verbose: true,
    strict: true,
});
