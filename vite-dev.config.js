import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, statSync, readFileSync } from 'fs';
import process from 'process';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import handlebars from 'vite-plugin-handlebars';
import helpers from './global/hbs/helpers/helpers';
import Handlebars from 'handlebars';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tailwindNesting from 'tailwindcss/nesting';
import viteSass from 'vite-plugin-sass-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Dynamically get the list of components from the packages directory
const components = readdirSync(resolve(__dirname, 'packages')).filter((dir) => {
    return statSync(resolve(__dirname, 'packages', dir)).isDirectory();
});

// Custom plugin to handle CSS files
function cssPlugin() {
    return {
        name: 'css-handler',
        transform(code, id) {
            if (id.endsWith('.css')) {
                return {
                    code: `export default ${JSON.stringify(code)}`,
                    map: null
                };
            }
        }
    };
}

// Custom Vite plugin to precompile Handlebars templates
function handlebarsPrecompile() {
    // Register custom library for helpers to use
    const regularFALibDir = resolve(__dirname, 'global', 'js', 'libraries', 'fontawesome', 'regular.js');
    const solidFALibDir = resolve(__dirname, 'global', 'js', 'libraries', 'fontawesome', 'solid.js');
    const regularFALib = readFileSync(regularFALibDir, 'utf8');
    const solidFALib = readFileSync(solidFALibDir, 'utf8');

    // Register custom helpers
    Object.keys(helpers).forEach((key) => {
        Handlebars.registerHelper(key, helpers[key]);
    });

    const icons = {};
    const globalHbsIconDir = resolve(__dirname, 'global', 'hbs', 'icons');
    // Load icons from directories
    const iconDirs = readdirSync(globalHbsIconDir);

    iconDirs.forEach(iconName => {
        const iconDir = resolve(globalHbsIconDir, iconName);
        if (statSync(iconDir).isDirectory()) {
            const iconPath = resolve(iconDir, `${iconName}.hbs`);
            try {
                const content = readFileSync(iconPath, 'utf8');
                icons[iconName] = content.trim().replace(/\s{2,}/g, ' ').replace(/\s*\n\s*/g, '').replace(/>\s+</g, '><').replace(/>\s+/g, '>').replace(/\s+</g, '<');
            } catch (e) {
                console.error(`✗ Error loading icon ${iconName}:`, e.message);
            }
        }
    });

    const letters = {};
    const globalHbsLettersDir = resolve(__dirname, 'global', 'hbs', 'letters');
    // Load letters from directories
    const lettersDirs = readdirSync(globalHbsLettersDir);

    lettersDirs.forEach(letterName => {
        const letterDir = resolve(globalHbsLettersDir, letterName);
        if (statSync(letterDir).isDirectory()) {
            const letterPath = resolve(letterDir, `${letterName}.hbs`);
            try {
                const content = readFileSync(letterPath, 'utf8');
                letters[letterName] = content.trim().replace(/\s{2,}/g, ' ').replace(/\s*\n\s*/g, '').replace(/>\s+</g, '><').replace(/>\s+/g, '>').replace(/\s+</g, '<');
            } catch (e) {
                console.error(`✗ Error loading letter ${letterName}:`, e.message);
            }
        }
    });

    const partials = {};
    const globalHbsDir = resolve(__dirname, 'global', 'hbs', 'partials');
    // Load partials from directories
    const partialDirs = readdirSync(globalHbsDir);

    partialDirs.forEach(partialName => {
        const partialDir = resolve(globalHbsDir, partialName);
        if (statSync(partialDir).isDirectory()) {
            const partialPath = resolve(partialDir, `${partialName}.hbs`);
            try {
                const content = readFileSync(partialPath, 'utf8');
                partials[partialName] = content.trim().replace(/\s{2,}/g, ' ').replace(/\s*\n\s*/g, '').replace(/>\s+</g, '><').replace(/>\s+/g, '>').replace(/\s+</g, '<');
            } catch (e) {
                if( e.path.includes('SVG-library')) {
                    return 
                }
                console.log(e)
                console.error(`✗ Error loading partial ${partialName}:`, e.message);
            }
        }
    });

    return {
        name: 'vite-plugin-handlebars-precompile',
        enforce: 'pre',
        transform(src, id) {
            if (id.endsWith('.hbs')) {
                const templateSpec = Handlebars.precompile(src.trim().replace(/\s{2,}/g, ' ').replace(/\s*\n\s*/g, '').replace(/>\s+</g, '><').replace(/>\s+/g, '>').replace(/\s+</g, '<'));
                // Helpers registration code
                const helpersCode = Object.keys(helpers)
                    .map(
                        (key) =>
                            `Handlebars.registerHelper('${key}', ${helpers[key].toString()});`,
                    )
                    .join('\n');

                
                // Icons registration code
                const iconsCode = Object.entries(icons)
                    .map(([key, content]) => {
                        const compiled = Handlebars.precompile(content);
                        // Pass the compiled object directly to Handlebars.template
                        return `Handlebars.partials['${key}'] = Handlebars.template(${compiled});`;
                    })
                    .join('\n');

                // Letters registration code
                const lettersCode = Object.entries(letters)
                    .map(([key, content]) => {
                        const compiled = Handlebars.precompile(content);
                        // Pass the compiled object directly to Handlebars.template
                        return `Handlebars.partials['${key}'] = Handlebars.template(${compiled});`;
                    })
                    .join('\n');

                // Partials registration code
                const partialsCode = Object.entries(partials)
                    .map(([key, content]) => {
                        const compiled = Handlebars.precompile(content);
                        // Pass the compiled object directly to Handlebars.template
                        return `Handlebars.partials['${key}'] = Handlebars.template(${compiled});`;
                    })
                    .join('\n');

                return {
                    code: `import Handlebars from 'handlebars/runtime';\n${helpersCode}\n${regularFALib}\n${solidFALib}\n${iconsCode}\n${lettersCode}\n${partialsCode}\nexport default Handlebars.template(${templateSpec});`,
                    map: null,
                };
            }
        },
    };
}

// Development-focused configuration
export default defineConfig({
    define: { 'process.env.NODE_ENV': '"development"' },
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
    optimizeDeps: {
        include: ['@fortawesome/fontawesome-svg-core/styles.css']
    },
    build: {
        target: 'es2015',
        minify: false, // Faster builds in development
        ssr: true,
        emptyOutDir: false,
        rollupOptions: {
            input: {
                // Component builds
                ...components.reduce((acc, component) => {
                    acc[component] = resolve(__dirname, `packages/${component}/main.js`);
                    return acc;
                }, {}),
                // Global bundle
                global: resolve(__dirname, 'global/css/global.css')
            },
            output: {
                dir: resolve(__dirname, 'dist'),
                format: 'es',
                entryFileNames: '[name]/bundle.js',
                chunkFileNames: '[name]-[hash].js',
                assetFileNames: '[name]/[name].[ext]'
            },
        },
    },
    plugins: [
        viteSass(),
        cssPlugin(),
        handlebarsPrecompile(),
        handlebars({
            partialDirectory: resolve(__dirname, 'global/hbs/partials'),
        }),
        viteStaticCopy({
            targets: [
                {
                    src: 'packages/*/previews/*.html',
                    dest: 'previews'
                },
                {
                    src: 'packages/*/example-data/*.json',
                    dest: 'example-data'
                }
            ]
        }),
        {
            name: 'dev-server-integration',
            configureServer(server) {
                // Enable HMR for better development experience
                server.watcher.add('packages/**/*.{js,scss,hbs,html}');
                server.watcher.add('global/**/*.{js,css,scss}');
            }
        }
    ],
    resolve: {
        alias: {
            '@components': resolve(__dirname, 'packages'),
            '@global': resolve(__dirname, 'global'),
        },
    },
    server: {
        port: 4001, // Different port to avoid conflicts
        hmr: true,
        watch: {
            usePolling: false,
            interval: 100
        }
    }
}); 