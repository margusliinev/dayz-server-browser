import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [tanstackRouter({ autoCodeSplitting: true }), viteReact(), tailwindcss()],
    resolve: { alias: { '@': resolve(__dirname, './src') } },
    server: {
        proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: true } },
        host: 'localhost',
        port: 3001,
    },
});
