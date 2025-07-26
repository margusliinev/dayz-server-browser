import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { queryMasterServer, REGIONS } from 'steam-server-query';
import { serversTable } from '../database/schema.ts';
import { db } from '../database/index.ts';
import { inArray } from 'drizzle-orm';

const discoverServers: FastifyPluginAsync = async (app: FastifyInstance) => {
    app.get('/discover-servers', {
        handler: async (request) => {
            try {
                request.log.info('Starting server discovery from Steam master server');

                // DayZ APP ID is 221100
                // Password 0 means servers that are not password protected
                // Empty 1 means servers that are not empty
                // 5000 is the timeout in milliseconds
                // 500 is the maximum number of servers to return
                const serverAddresses = await queryMasterServer('hl2master.steampowered.com:27011', REGIONS.ALL, { appid: 221100, password: 0, empty: 1 }, 5000, 100);

                const existingAddresses = await db.select({ address: serversTable.address }).from(serversTable).where(inArray(serversTable.address, serverAddresses));

                const existingAddressSet = new Set(existingAddresses.map((row) => row.address));
                const newServerAddresses = serverAddresses.filter((addr) => !existingAddressSet.has(addr));
                const newServerRecords = newServerAddresses.map((address) => ({
                    address,
                    status: 'pending' as const,
                }));

                let insertedCount = 0;
                if (newServerRecords.length > 0) {
                    await db.insert(serversTable).values(newServerRecords);
                    insertedCount = newServerRecords.length;
                }

                const skippedCount = serverAddresses.length - insertedCount;

                return {
                    success: true,
                    data: {
                        discovered: serverAddresses.length,
                        new: insertedCount,
                        existing: skippedCount,
                        servers: serverAddresses,
                    },
                };
            } catch (error) {
                request.log.error(error, 'Failed to discover servers');
                throw error;
            }
        },
    });
};

export default discoverServers;
