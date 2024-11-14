import { resolve, basename } from 'path'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { existsSync } from 'fs';

function getComponentEntries() {
    const entries = [];
  
    const mainPath = resolve(process.cwd(), 'main.js');
    const scriptPath = resolve(process.cwd(), 'scripts.js');
  
    if (existsSync(mainPath)) { entries.push(mainPath); }
    if (existsSync(scriptPath)) { entries.push(scriptPath); }
  
    return entries;
}

// https://vitejs.dev/config/
export default defineConfig({
    define: { 'process.env.NODE_ENV': '"production"' },
    build: {
        target: 'es2015',
        minify: true,
        lib: {
            entry: getComponentEntries(),
            name: '[name]',
            fileName: '[name]',
            formats: ['es'],
        },
        emptyOutDir: true,
        outDir: '../../dist/' + basename(resolve(process.cwd())),
        ssr: true,
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: resolve(process.cwd(), 'manifest.json'),
                    dest: './',
                },
                {
                    src: resolve(process.cwd(), '*.data.json'),
                    dest: './',
                },
                {
                    src: resolve(process.cwd(), '*.html'),
                    dest: './',
                },
                {
                    src: resolve(process.cwd(), 'previews'),
                    dest: './',
                },
                {
                    src: resolve(process.cwd(), 'mocked-uris'),
                    dest: './',
                },
                {
                    src: resolve(process.cwd(), 'example-data'),
                    dest: './',
                }
            ],
        })
    ]
});