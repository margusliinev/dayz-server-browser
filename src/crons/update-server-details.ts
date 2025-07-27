import type { FastifyInstance } from 'fastify';
import type { Server } from '../database/schema.ts';
import { queryGameServerInfo } from 'steam-server-query';
import { getServersToUpdate, updateServerDetailsById } from '../queries/index.ts';

const BATCH_SIZE = 10;

export async function updateServerDetails(app: FastifyInstance) {
    try {
        const serversToUpdate = await getServersToUpdate(BATCH_SIZE);

        const result = await processServerUpdates(serversToUpdate, app);

        app.log.info(`Server update completed: ${result.successful} successful, ${result.failed} failed`);
        return result;
    } catch (error) {
        app.log.error(error, 'Server details update failed');
        throw error;
    }
}

async function processServerUpdates(servers: Server[], app: FastifyInstance) {
    let successful = 0;
    let failed = 0;

    for (const server of servers) {
        try {
            const wasUpdated = await updateSingleServer(server);
            if (wasUpdated) {
                successful++;
            } else {
                failed++;
            }
        } catch (error) {
            app.log.warn(`Failed to update server ${server.address}: ${error}`);
            await updateServerDetailsById(server.id, { queried_at: new Date() });
            failed++;
        }
    }

    return {
        processed: servers.length,
        successful,
        failed,
    };
}

async function updateSingleServer(server: Server) {
    const serverInfo = await queryGameServerInfo(server.address);

    if (!serverInfo) {
        await updateServerDetailsById(server.id, { queried_at: new Date() });
        return false;
    }

    const status = determineServerStatus(serverInfo.players);

    await updateServerDetailsById(server.id, {
        map: serverInfo.map,
        name: serverInfo.name,
        players: serverInfo.players,
        maxPlayers: serverInfo.maxPlayers,
        status,
        queried_at: new Date(),
    });

    return true;
}

function determineServerStatus(playerCount: number): 'online' | 'offline' {
    return playerCount > 0 ? 'online' : 'offline';
}
