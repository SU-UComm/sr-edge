/* eslint-disable no-constant-binary-expression */
import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, statSync } from 'fs';
import process from 'process';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import handlebars from 'vite-plugin-handlebars';
import helpers from './handlebars-helpers';
import Handlebars from 'handlebars';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Dynamically get the list of components from the packages directory
const components = readdirSync(resolve(__dirname, 'packages')).filter((dir) => {
    return statSync(resolve(__dirname, 'packages', dir)).isDirectory();
});

// Custom Vite plugin to precompile Handlebars templates
function handlebarsPrecompile() {
    // Register custom helpers
    Object.keys(helpers).forEach((key) => {
        Handlebars.registerHelper(key, helpers[key]);
    });

    return {
        name: 'vite-plugin-handlebars-precompile',
        transform(src, id) {
            if (id.endsWith('.hbs')) {
                const templateSpec = Handlebars.precompile(src);
                const helpersCode = Object.keys(helpers)
                    .map(
                        (key) =>
                            `Handlebars.registerHelper('${key}', ${helpers[
                                key
                            ].toString()});`,
                    )
                    .join('\n');
                return {
                    code: `import Handlebars from 'handlebars/runtime';\n${helpersCode}\nexport default Handlebars.template(${templateSpec});`,
                    map: null,
                };
            }
        },
    };
}

export default defineConfig(() => {
    let componentToBuild = process.env.COMPONENT;

    if (!componentToBuild && process.env.CHANGED_FILE) {
        const changedFile = process.env.CHANGED_FILE;
        const pathSegments = changedFile.split('/');
        const packagesIndex = pathSegments.indexOf('packages');
        if (packagesIndex !== -1 && packagesIndex + 1 < pathSegments.length) {
            componentToBuild = pathSegments[packagesIndex + 1];
        }
    }

    const filteredComponents = componentToBuild
        ? components.filter((component) => component === componentToBuild)
        : components;

    return {
        define: { 'process.env.NODE_ENV': '"production"' },
        build: {
            target: 'es2015',
            minify: true,
            ssr: true,
            emptyOutDir: false,
            rollupOptions: {
                input: filteredComponents.reduce((inputs, component) => {
                    inputs[component] = resolve(
                        __dirname,
                        `packages/${component}/main.js`,
                    );
                    return inputs;
                }, {}),
                output: {
                    format: 'esm',
                    dir: 'dist',
                    entryFileNames: '[name]/main.js',
                },
            },
        },
        plugins: [
            handlebars({
                partialDirectory: resolve(__dirname, 'packages'),
            }),
            viteStaticCopy({
                targets: filteredComponents.flatMap((component) => [
                    {
                        src: `packages/${component}/manifest.json`,
                        dest: component,
                    },
                    {
                        src: `packages/${component}/*.data.json`,
                        dest: component,
                    },
                    {
                        src: `packages/${component}/*.html`,
                        dest: component,
                    },
                    {
                        src: `packages/${component}/previews`,
                        dest: component,
                    },
                    {
                        src: `packages/${component}/mocked-uris`,
                        dest: component,
                    },
                    {
                        src: `packages/${component}/example-data`,
                        dest: component,
                    },
                    {
                        src: `packages/${component}/preview.html`,
                        dest: component,
                    },
                    {
                        src: `packages/${component}/preview.data.json`,
                        dest: component,
                    },
                    {
                        src: `packages/${component}/manifest.json`,
                        dest: component,
                    },
                ]),
            }),
            handlebarsPrecompile(),
        ],
        test: {
            globals: true,
            environment: 'happy-dom' || 'node',
            coverage: {
                reporter: ['text', 'html'],
                include: ['packages/**/main.js', 'packages/**/scripts.js'],
                exclude: [
                    'node_modules',
                    'tests',
                    '**/*.test.js',
                    '**/*.spec.js',
                    'global/js/**/index.js',
                ],
                reportsDirectory: '__coverage__',
                lines: 100,
                branches: 100,
                functions: 100,
                statements: 100,
            },
        },
    };
});
