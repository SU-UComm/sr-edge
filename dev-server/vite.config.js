import { defineConfig } from 'vite';
import { resolve } from 'path';
import { dxp } from './component-service/vite-plugins.js';

export default defineConfig({
    root: resolve(__dirname, '.'),
    publicDir: resolve(__dirname, '../dist'),
    server: {
        port: 4000,
        open: false, // Don't auto-open since we're using Express
    },
    resolve: {
        alias: {
            '@dev-server': resolve(__dirname, '.'),
            '@dist': resolve(__dirname, '../dist'),
            '@mysource_files': resolve(__dirname, '../mysource_files'),
            '@packages': resolve(__dirname, '../packages'),
        },
    },
    plugins: [dxp()],
    optimizeDeps: {
        exclude: [
            'packages/**',
            'global/**',
            'mysource_files/**',
        ],
    },
    ssr: {
        noExternal: ['packages/**'],
    },
}); 