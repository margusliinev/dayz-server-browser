import pino from 'pino';

export const config = {
    base: null,
    level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: { level: (label: string) => ({ level: label }) },
    transport: {
        target: process.env.NODE_ENV === 'development' ? 'pino-pretty' : 'pino/file',
        options: process.env.NODE_ENV === 'development' ? { colorize: true, singleLine: true } : { destination: 1 },
    },
};
