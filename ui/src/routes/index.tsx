import { createFileRoute } from '@tanstack/react-router';
import { getServers } from '@/api';

export const Route = createFileRoute('/')({
    component: App,
    loader: async () => await getServers(),
});

function App() {
    const servers = Route.useLoaderData();
    return (
        <div>
            <h1>DayZ Server Browser</h1>
            <p>Found {servers.length} servers</p>
            {servers.map((server) => (
                <div key={server.id}>
                    <h3>{server.name || 'Unknown Server'}</h3>
                    <p>Map: {server.map || 'Unknown'}</p>
                    <p>
                        Players: {server.players}/{server.maxPlayers}
                    </p>
                    <p>Status: {server.status}</p>
                </div>
            ))}
        </div>
    );
}
