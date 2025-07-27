import type { Server } from '@backend/database/schema';

interface ServerResponse {
    success: boolean;
    data: Server[];
}

interface SingleServerResponse {
    success: boolean;
    data: Server;
}

export async function getServers(): Promise<Server[]> {
    const response = await fetch('/api/servers');
    if (!response.ok) {
        throw new Error('Failed to fetch servers');
    }
    const data: ServerResponse = await response.json();
    return data.data;
}

export async function getServer(id: number): Promise<Server> {
    const response = await fetch(`/api/servers/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch server with id ${id}`);
    }
    const data: SingleServerResponse = await response.json();
    return data.data;
}

export async function refreshServer(id: number): Promise<number> {
    const response = await fetch(`/api/servers/${id}/refresh`, {
        method: 'POST',
        body: JSON.stringify({}),
    });
    if (!response.ok) {
        throw new Error(`Failed to refresh server with id ${id}`);
    }
    const data = await response.json();
    return data.playerCount;
}
