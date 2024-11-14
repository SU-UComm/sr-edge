import { resolve, relative } from 'path';
import { defineConfig } from 'vite'
import viteSass from 'vite-plugin-sass-dts';
import { readdirSync, existsSync, writeFileSync, unlinkSync} from 'fs';

function getAllScripts() {
    const packageDir = resolve(__dirname, 'packages');
    const folders = readdirSync(packageDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => resolve(packageDir, dirent.name, 'scripts.js'))
        .filter(filePath => existsSync(filePath));

    return folders;
}

function getAllStyles() {
    const globalStyles = resolve(__dirname, 'global/css/global.css');
    const packageDir = resolve(__dirname, 'packages');
    const folders = readdirSync(packageDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => resolve(packageDir, dirent.name, 'styles.scss'))
      .filter(filePath => existsSync(filePath));
  
    folders.push(globalStyles);
    return folders;
  }

// https://vitejs.dev/config/
export default defineConfig({
    define: { 'process.env.NODE_ENV': '"production"' },
    resolve: {
        alias: {
            '@components': resolve(__dirname, 'packages'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler'
            }
        }
    },
    build: {
        rollupOptions: {
            input: {
                js: resolve(__dirname, 'temp-entry-js.js'),
                css: resolve(__dirname, 'temp-entry-scss.scss')
            },
            output: {
                dir: resolve(__dirname, 'dist/global'),
                format: 'es',
                entryFileNames: 'bundle.js',
                assetFileNames: 'bundle.css',
            }
        }
    },
    plugins: [
        viteSass(),
        {
            name: 'generate-temp-entries',
            buildStart() {
                const scripts = getAllScripts();
                const styles = getAllStyles();

                // Create temp JS entry
                const tempEntryJsPath = resolve(__dirname, 'temp-entry-js.js');
                const tempEntryJsContent = scripts.map(filePath => `import '${filePath}';`).join('\n');
                writeFileSync(tempEntryJsPath, tempEntryJsContent);

                // Create temp SCSS entry
                const tempEntryScssPath = resolve(__dirname, 'temp-entry-scss.scss');
                const tempEntryScssContent = styles.map((filePath) => {
                    const relativePath = relative(resolve(__dirname, 'packages'), filePath).replace(/\\/g, '/');
                    const validAlias = filePath.split('/').slice(-2, -1)[0];
                    return `@use '@components/${relativePath.replace('.scss', '')}' as ${validAlias};`;
                }).join('\n');
                writeFileSync(tempEntryScssPath, tempEntryScssContent);
            },
            buildEnd() {
                // Clean up the temporary entry files after the build
                const tempEntryJsPath = resolve(__dirname, 'temp-entry-js.js');
                const tempEntryScssPath = resolve(__dirname, 'temp-entry-scss.scss');
                if (existsSync(tempEntryJsPath)) unlinkSync(tempEntryJsPath);
                if (existsSync(tempEntryScssPath)) unlinkSync(tempEntryScssPath);
            }
        }
    ],
    esbuild: {
        target: 'es2015',
    }
});