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

export async function searchServers(query: string): Promise<Server[]> {
    const response = await fetch(`/api/servers/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
        throw new Error('Failed to search servers');
    }
    const data: ServerResponse = await response.json();
    return data.data;
}

export async function filterServers(filters: { status?: 'pending' | 'online' | 'offline'; map?: string; minPlayers?: number; maxPlayers?: number }): Promise<Server[]> {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.map) params.append('map', filters.map);
    if (filters.minPlayers !== undefined) params.append('minPlayers', filters.minPlayers.toString());
    if (filters.maxPlayers !== undefined) params.append('maxPlayers', filters.maxPlayers.toString());

    const response = await fetch(`/api/servers/filter?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to filter servers');
    }
    const data: ServerResponse = await response.json();
    return data.data;
}
