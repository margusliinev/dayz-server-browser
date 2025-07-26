// Shared type definitions for Server
// This mirrors the Server type from the backend schema
export interface Server {
    id: number;
    map: string | null;
    name: string | null;
    address: string;
    players: number | null;
    maxPlayers: number | null;
    status: 'pending' | 'online' | 'offline';
    queried_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

export interface ServerResponse {
    success: boolean;
    data: Server[];
}

export interface SingleServerResponse {
    success: boolean;
    data: Server;
}
