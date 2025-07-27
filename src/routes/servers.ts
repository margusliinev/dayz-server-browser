import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { getAllServers, getServerById, updateServerPlayerCount } from '../queries/index.ts';
import { playerCountCache, serverIdCache } from '../helpers/cache.ts';
import { queryGameServerPlayer } from 'steam-server-query';
import { Type } from '@sinclair/typebox';

const SERVER_ID_CACHE_TTL_MS = 10 * 1000;
const PLAYER_COUNT_CACHE_TTL_MS = 5 * 1000;

const servers: FastifyPluginAsync = async (app: FastifyInstance) => {
    app.get('/servers', async (request, reply) => {
        try {
            const servers = await getAllServers();

            return reply.status(200).send({ success: true, data: servers });
        } catch (error) {
            request.log.error(error);
            return reply.status(500).send({ success: false, error: 'Failed to fetch servers' });
        }
    });

    app.get('/servers/:id', {
        schema: { params: Type.Object({ id: Type.Number() }) },
        handler: async (request, reply) => {
            const { id } = request.params as { id: number };
            const now = Date.now();
            const cached = serverIdCache.get(id);

            if (cached && now - cached.timestamp < SERVER_ID_CACHE_TTL_MS) {
                return reply.status(200).send({ success: true, data: cached.data });
            }

            try {
                const server = await getServerById(id);
                if (!server) {
                    return reply.status(404).send({ success: false, error: 'Server not found' });
                }

                serverIdCache.set(id, { data: server, timestamp: now });
                return reply.status(200).send({ success: true, data: server });
            } catch (error) {
                request.log.error(error);
                return reply.status(500).send({ success: false, error: 'Failed to fetch server' });
            }
        },
    });

    app.post('/servers/:id/refresh', {
        schema: { params: Type.Object({ id: Type.Number() }) },
        handler: async (request, reply) => {
            const { id } = request.params as { id: number };
            const now = Date.now();
            const cached = playerCountCache.get(id);

            if (cached && now - cached.timestamp < PLAYER_COUNT_CACHE_TTL_MS) {
                return reply.status(200).send({ success: true, playerCount: cached.playerCount });
            }

            try {
                const server = await getServerById(id);
                if (!server) {
                    return reply.status(404).send({ success: false, error: 'Server not found' });
                }

                const serverInfo = await queryGameServerPlayer(server.address);
                await updateServerPlayerCount(id, serverInfo.playerCount);

                playerCountCache.set(id, { playerCount: serverInfo.playerCount, timestamp: now });
                return reply.status(200).send({ success: true, playerCount: serverInfo.playerCount });
            } catch (error) {
                request.log.error(error);
                return reply.status(500).send({ success: false, error: 'Failed to refresh server' });
            }
        },
    });
};

export default servers;
