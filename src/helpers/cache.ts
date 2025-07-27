import type { Server } from '../database/schema.ts';

export const serverIdCache: Map<number, { data: Server | null; timestamp: number }> = new Map();
export const playerCountCache: Map<number, { playerCount: number; timestamp: number }> = new Map();
