import { mysqlTable, varchar, timestamp, bigint, smallint, mysqlEnum } from 'drizzle-orm/mysql-core';

export const serversTable = mysqlTable('servers', {
    id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
    map: varchar({ length: 255 }),
    name: varchar({ length: 255 }),
    address: varchar({ length: 255 }).notNull().unique(),
    players: smallint({ unsigned: true }).default(0),
    maxPlayers: smallint({ unsigned: true }).default(0),
    status: mysqlEnum(['pending', 'online', 'offline']).notNull().default('pending'),
    queried_at: timestamp({ mode: 'date' }),
    created_at: timestamp({ mode: 'date' }).notNull().defaultNow(),
    updated_at: timestamp({ mode: 'date' }).notNull().defaultNow().onUpdateNow(),
});

export type Server = typeof serversTable.$inferSelect;
export type NewServer = typeof serversTable.$inferInsert;
