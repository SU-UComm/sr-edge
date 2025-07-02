import { readFileSync } from 'fs';
import { globSync } from 'glob';
import path from 'path';
import generateManifestRecord from './manifest-compiler.js';

/**
 * Make a fetch GET request and if it fails retry N times with a X delay between requests
 * @param {String} url url to send the GET request to
 * @param {Object} options additional fetch options object
 * @param {Number} delay delay between requests in ms
 * @param {Number} retryCount max retry count
 * @returns {Promise}
 */
const fetchWithRetry = async (url, options = {}, delay = 200, retryCount = 3) => {
    let attempts = 0;

    const executeRequest = async () => {
        try {
            attempts++;
            const response = await fetch(url, { ...options, method: 'GET' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            if (attempts >= retryCount) {
                throw error;
            }
            const cDelay = delay * attempts * 2;
            console.warn(`Request failed, retrying in ${cDelay}ms... (Attempt ${attempts}/${retryCount})`);
            await new Promise((resolve) => setTimeout(resolve, cDelay));
            return executeRequest();
        }
    };

    return executeRequest();
};

// Component rendering function for Stanford Edge Components
async function renderComponent(componentPath, previewKey = 'raw') {
    try {
        // For Stanford Edge Components, we need to find the full component path with version
        const manifestRecords = JSON.parse(readFileSync('./dev-server/component-service/manifests.json', 'utf-8'));
        
        // Find the component that matches the path (without version)
        const resolvedManifestPath = manifestRecords.find((item) => {
            const [namespace, name] = item.split('/');
            const [inputNamespace, inputName] = componentPath.split('/');
            
            // Handle both "stanford-apb/button" and "button" formats
            if (inputNamespace && inputName) {
                return namespace === inputNamespace && name === inputName;
            } else {
                return name === inputNamespace; // Just the component name
            }
        });
        
        if (!resolvedManifestPath) {
            throw new Error(`Component "${componentPath}" not found in manifest. Available: ${manifestRecords.slice(0, 5).join(', ')}...`);
        }
        
        console.log(`🎯 Resolved component path: ${componentPath} -> ${resolvedManifestPath}`);
        
        // Use the DXP CLI server on port 5555 with the full component path
        const response = await fetchWithRetry(
            `http://localhost:5555/dev/render/${resolvedManifestPath}?_previewKey=${previewKey}`,
            {},
            200,
            3
        );
        const data = await response.text();
        return data;
    } catch (er) {
        console.error(`Error rendering component ${componentPath}:`, er);
        return `<div style="border: 2px dashed #ff0000; padding: 1rem; margin: 1rem; color: #ff0000;">
            <strong>Component Error:</strong> ${componentPath} (${previewKey})
            <br><small>${er.message}</small>
        </div>`;
    }
}

export async function dxp() {
    console.log('🚀 DXP plugin initialized');
    return {
        name: 'dxp-plugin',
        enforce: 'pre',
        configResolved(config) {
            // Generate manifest entries
            generateManifestRecord();
        },
        buildStart() {
            // console.log('#### buildStarts');
        },
        async watchChange(file, { event }) {
            // Regenerate manifest when component files change
            if (file.includes('manifest.json') || file.includes('main.js')) {
                await generateManifestRecord();
            }
        },
        handleHotUpdate({ file, server }) {
            // console.log('#### handleHotUpdate', file);
        },
        async transform(code, id) {
            console.log('🟢 [DXP Plugin] transform called for:', id);
            // Make the file path check more permissive to catch both relative and absolute paths
            if (!id.includes('/pages/') || !id.endsWith('.js')) return;
            
            console.log('🔧 Vite plugin transforming:', id);
            
            // Add component files to watch files so changes are fetched
            const entryFiles = globSync(path.posix.join('.', 'packages', '*', 'main.js'));
            entryFiles.forEach((entryFile) => {
                this.addWatchFile(entryFile);
            });
            
            // Regex to match component patterns: <!--@@ cmp stanford-apb/button default @@-->
            const regex = /<!--@@\\s*cmp\\s+([\\w\/-]+)(?:\\s+([\\w-]+))?\\s*@@-->/g;
            const matches = [...code.matchAll(regex)];
            
            if (matches.length > 0) {
                console.log(`🎯 Found ${matches.length} component references in ${id}`);
            }
            
            let transformedCode = code;
            
            for (const match of matches) {
                const [fullMatch, componentPath, previewKey = 'default'] = match;
                console.log(`🔄 Processing component: ${componentPath} (${previewKey})`);
                
                try {
                    const componentHtml = await renderComponent(componentPath, previewKey);
                    transformedCode = transformedCode.replace(fullMatch, componentHtml);
                    console.log(`✅ Successfully rendered component: ${componentPath}`);
                } catch (error) {
                    console.error(`❌ Error rendering component ${componentPath}:`, error);
                    const errorHtml = `<div style="border: 2px dashed #ff0000; padding: 1rem; margin: 1rem; color: #ff0000;">
                        <strong>Component Error:</strong> ${componentPath} (${previewKey})
                        <br><small>${error.message}</small>
                    </div>`;
                    transformedCode = transformedCode.replace(fullMatch, errorHtml);
                }
            }
            
            return transformedCode;
        },
    };
} 