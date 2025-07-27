import type { Server } from '@backend/database/schema';
import { createFileRoute } from '@tanstack/react-router';
import { Header, ServerTable } from '@/components';
import { getServers, refreshServer } from '@/api';
import { useState } from 'react';

export const Route = createFileRoute('/')({
    component: App,
    loader: async () => await getServers(),
});

function App() {
    const initialServers = Route.useLoaderData();
    const [servers, setServers] = useState(initialServers);

    const handleRefreshServer = async (server: Server) => {
        const playerCount = await refreshServer(server.id);
        setServers((prev) => prev.map((s) => (s.id === server.id ? { ...s, players: playerCount } : s)));
        return playerCount;
    };

    return (
        <div className='min-h-screen bg-background'>
            <Header servers={servers} />
            <main className='max-w-screen-2xl mx-auto px-8 py-6'>
                <ServerTable servers={servers} onRefreshServer={handleRefreshServer} />
            </main>
        </div>
    );
}
