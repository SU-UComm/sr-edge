/* eslint-disable no-undef */
import { resolve, relative, dirname, extname } from 'path';
import { defineConfig } from 'vite';
import viteSass from 'vite-plugin-sass-dts';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tailwindNesting from 'tailwindcss/nesting';

import {
    readdirSync,
    existsSync,
    writeFileSync,
    unlinkSync,
    readFileSync,
    statSync,
} from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHANGED_FILE = process.env.CHANGED_FILE || null;

function getAllScripts() {
    const packageDir = resolve(__dirname, 'packages');
    const folders = readdirSync(packageDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => resolve(packageDir, dirent.name, 'scripts.js'))
        .filter((filePath) => existsSync(filePath));

    return folders;
}

function getAllStyles() {
    // First get global styles
    const globalStyles = resolve(__dirname, 'global/css/global.css');
    
    // Then get component styles in a specific order
    const packageDir = resolve(__dirname, 'packages');
    const folders = readdirSync(packageDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => resolve(packageDir, dirent.name, 'styles.scss'))
        .filter((filePath) => existsSync(filePath))
        .sort((a, b) => {
            // Ensure consistent ordering of component styles
            return a.localeCompare(b);
        });

    // Always put global styles first
    return [globalStyles, ...folders];
}

function injectInlineContent() {
    return {
        name: 'inject-inline-content',
        writeBundle() {
            const globalCss = readFileSync(
                resolve(__dirname, 'mysource_files/global/bundle.css'),
                'utf-8',
            );
            const globalJs = readFileSync(
                resolve(__dirname, 'mysource_files/global/bundle.js'),
                'utf-8',
            );

            let components = readdirSync(resolve(__dirname, 'packages')).filter(
                (dir) => {
                    return statSync(
                        resolve(__dirname, 'packages', dir),
                    ).isDirectory();
                },
            );

            let htmlFileToChange;
            if (CHANGED_FILE) {
                console.log('CHANGED_FILE:', CHANGED_FILE);
                const changedFile = process.env.CHANGED_FILE;
                const pathSegments = changedFile.split('/');
                const packagesIndex = pathSegments.indexOf('packages');
                if (
                    packagesIndex !== -1 &&
                    packagesIndex + 1 < pathSegments.length
                ) {
                    htmlFileToChange = pathSegments[packagesIndex + 1];
                }

                components = components.filter(
                    (component) => component === htmlFileToChange,
                );
            }

            components.forEach((component) => {
                // Resolve the directory containing the component's files
                const componentDir = resolve(__dirname, `dist/${component}/previews`);
                
                // Get all `.html` files in the component's directory
                const htmlFiles = readdirSync(componentDir)
                    .filter((file) => extname(file) === '.html') // Only include .html files
                    .map((file) => resolve(componentDir, file)); // Get full paths

                // Process each HTML file
                htmlFiles.forEach((htmlFilePath) => {
                    try {
                        // Read the file content
                        let htmlContent = readFileSync(htmlFilePath, 'utf-8');

                        // Replace placeholders with global styles and scripts
                        htmlContent = htmlContent.split('<!-- [[inline-styles]] -->').join(`<style>${globalCss}</style>`);
                        htmlContent = htmlContent.split('<!-- [[inline-scripts]] -->').join(`<script type="module">${globalJs}</script>`);

                        // Write the modified content back to the file
                        writeFileSync(htmlFilePath, htmlContent);
                    } catch (error) {
                        console.error(`Error processing file ${htmlFilePath}:`, error.message);
                    }
                });
            });
        },
    };
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
        postcss: {
            plugins: [
                postcssImport(),
                tailwindNesting(),
                tailwindcss(),
                autoprefixer()
            ]
        },
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
    },
    build: {
        rollupOptions: {
            input: {
                js: resolve(__dirname, 'temp-entry-js.js'),
                css: resolve(__dirname, 'temp-entry-scss.scss'),
            },
            output: {
                dir: resolve(__dirname, 'mysource_files/global'),
                format: 'es',
                entryFileNames: 'bundle.js',
                assetFileNames: 'bundle.css',
            },
        },
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
                const tempEntryJsContent = scripts
                    .map((filePath) => `import '${filePath}';`)
                    .join('\n');
                writeFileSync(tempEntryJsPath, tempEntryJsContent);

                // Create temp SCSS entry
                const tempEntryScssPath = resolve(
                    __dirname,
                    'temp-entry-scss.scss',
                );

                // First, generate all @use statements for SCSS files
                const useStatements = styles
                    .filter(filePath => filePath.endsWith('.scss'))
                    .map((filePath) => {
                        const relativePath = relative(
                            resolve(__dirname, 'packages'),
                            filePath,
                        ).replace(/\\/g, '/');
                        const validAlias = filePath.split('/').slice(-2, -1)[0];
                        return `@use '@components/${relativePath.replace('.scss', '')}' as ${validAlias};`;
                    })
                    .join('\n');

                // Then, generate all @import statements for CSS files in the original order
                const importStatements = styles
                    .filter(filePath => filePath.endsWith('.css'))
                    .map((filePath) => `@import '${filePath}';`)
                    .join('\n');

                // Combine with @use statements first (to satisfy SCSS), then @import statements
                const tempEntryScssContent = `${useStatements}\n${importStatements}`;
                writeFileSync(tempEntryScssPath, tempEntryScssContent);
            },
            buildEnd() {
                // Clean up the temporary entry files after the build
                const tempEntryJsPath = resolve(__dirname, 'temp-entry-js.js');
                const tempEntryScssPath = resolve(
                    __dirname,
                    'temp-entry-scss.scss',
                );
                if (existsSync(tempEntryJsPath)) unlinkSync(tempEntryJsPath);
                if (existsSync(tempEntryScssPath))
                    unlinkSync(tempEntryScssPath);
            },
        },
        injectInlineContent(),
    ],
    esbuild: {
        target: 'es2015',
    },
});
