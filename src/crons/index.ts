import type { FastifyInstance } from 'fastify';
import { updateServerDetails } from './update-server-details.ts';
import { dailyServerDiscovery } from './daily-server-discovery.ts';

export function registerCrons(app: FastifyInstance) {
    return [
        {
            name: 'daily-server-discovery',
            cronTime: '0 0 * * *',
            onTick: async () => {
                app.log.info('Running daily-server-discovery cron job');
                await dailyServerDiscovery(app);
            },
            start: true,
            timeZone: 'UTC',
        },
        {
            name: 'update-server-details',
            cronTime: '*/10 * * * *',
            onTick: async () => {
                app.log.info('Running update-server-details cron job');
                await updateServerDetails(app);
            },
            start: true,
            timeZone: 'UTC',
        },
    ];
}
