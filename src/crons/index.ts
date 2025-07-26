import type { FastifyInstance } from 'fastify';
import { findNewServers } from './find-new-servers.ts';

export function registerCrons(app: FastifyInstance) {
    return [
        {
            cronTime: '0 0 * * *',
            onTick: async () => {
                app.log.info('Running daily server discovery cron job');
                await findNewServers(app);
            },
            start: true,
            timeZone: 'UTC',
        },
    ];
}
