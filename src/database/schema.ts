import { mysqlTable, varchar, timestamp, bigint, smallint } from 'drizzle-orm/mysql-core';

export const serversTable = mysqlTable('servers', {
    id: bigint({ mode: 'number', unsigned: true }).autoincrement().primaryKey(),
    map: varchar({ length: 255 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    address: varchar({ length: 255 }).notNull(),
    players: smallint({ unsigned: true }).notNull().default(0),
    maxPlayers: smallint({ unsigned: true }).notNull().default(0),
    created_at: timestamp({ mode: 'date' }).notNull().defaultNow(),
    updated_at: timestamp({ mode: 'date' }).notNull().defaultNow().onUpdateNow(),
});

export type Server = typeof serversTable.$inferSelect;
export type NewServer = typeof serversTable.$inferInsert;
