import type { FastifyInstance } from 'fastify';
import type { NewServer } from '../database/schema.ts';
import { getExistingServerAddresses, insertNewServersBatch } from '../queries/index.ts';
import { queryMasterServer, REGIONS } from 'steam-server-query';

const MASTER_SERVER_HOST = 'hl2master.steampowered.com:27011';
const DAYZ_APP_ID = 221100;
const QUERY_TIMEOUT = 5000;
const MAX_SERVERS = 5000;
const BATCH_SIZE = 100;
const BATCH_DELAY = 1000;

const QUERY_FILTERS = {
    appid: DAYZ_APP_ID,
    password: 0 as const, // Non-password protected servers
    empty: 1 as const, // Non-empty servers
};

export async function dailyServerDiscovery(app: FastifyInstance) {
    try {
        const serverAddresses = await queryMasterServer(MASTER_SERVER_HOST, REGIONS.ALL, QUERY_FILTERS, QUERY_TIMEOUT, MAX_SERVERS);

        const newServerAddresses = await filterNewServers(serverAddresses);
        const insertedCount = await insertNewServers(newServerAddresses, app);

        const result = {
            discovered: serverAddresses.length,
            new: insertedCount,
            existing: serverAddresses.length - insertedCount,
        };

        app.log.info(`Server discovery completed: ${insertedCount} new, ${result.existing} existing, ${serverAddresses.length} total`);
        return result;
    } catch (error) {
        app.log.error(error, 'Server discovery failed');
        throw error;
    }
}

async function filterNewServers(serverAddresses: string[]): Promise<string[]> {
    if (serverAddresses.length === 0) return [];

    const existingAddresses = await getExistingServerAddresses();

    const existingAddressSet = new Set(existingAddresses.map((server) => server.address));
    return serverAddresses.filter((address) => !existingAddressSet.has(address));
}

async function insertNewServers(addresses: string[], app: FastifyInstance): Promise<number> {
    if (addresses.length === 0) {
        return 0;
    }

    const newServerRecords: NewServer[] = addresses.map((address) => ({
        address,
        status: 'pending' as const,
    }));

    let insertedCount = 0;
    const totalBatches = Math.ceil(newServerRecords.length / BATCH_SIZE);

    for (let i = 0; i < newServerRecords.length; i += BATCH_SIZE) {
        const batch = newServerRecords.slice(i, i + BATCH_SIZE);
        const currentBatch = Math.floor(i / BATCH_SIZE) + 1;

        await insertNewServersBatch(batch);

        insertedCount += batch.length;

        if (currentBatch < totalBatches) {
            await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
        }
    }

    app.log.info(`Inserted ${insertedCount} new servers in ${totalBatches} batches`);
    return insertedCount;
}
