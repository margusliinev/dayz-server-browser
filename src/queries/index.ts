import type { NewServer, Server } from '../database/schema.ts';
import { serversTable } from '../database/schema.ts';
import { db } from '../database/index.ts';
import { eq, or } from 'drizzle-orm';

export async function getServersToUpdate(limit: number) {
    return db.select().from(serversTable).orderBy(serversTable.queried_at).limit(limit);
}

export async function updateServerDetailsById(serverId: number, data: Partial<Server>) {
    await db.update(serversTable).set(data).where(eq(serversTable.id, serverId));
}

export async function getExistingServerAddresses() {
    return db.select({ address: serversTable.address }).from(serversTable);
}

export async function insertNewServersBatch(batch: NewServer[]) {
    await db
        .insert(serversTable)
        .values(batch)
        .onDuplicateKeyUpdate({ set: { updated_at: new Date() } });
}

export async function getAllServers(): Promise<Server[]> {
    return db
        .select()
        .from(serversTable)
        .where(or(eq(serversTable.status, 'online'), eq(serversTable.status, 'offline')));
}

export async function getServerById(id: number): Promise<Server | null> {
    const server = await db.select().from(serversTable).where(eq(serversTable.id, id)).limit(1);
    return server[0] || null;
}

export async function updateServerPlayerCount(id: number, playerCount: number): Promise<void> {
    await db.update(serversTable).set({ players: playerCount }).where(eq(serversTable.id, id));
}
