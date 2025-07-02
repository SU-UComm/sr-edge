import path from 'path';
import { globSync } from 'glob';
import fs from 'fs';

// Function to compile manifest data for Stanford Edge Components
export default async function generateManifestRecord(file) {
    // If no file is provided, generate the manifest from all packages
    if (!file) {
        console.log('🔄 Generating manifest from all packages...');
    } else if (!file.endsWith('manifest.json')) {
        return;
    }
    
    // Output array of strings: ["namespace/name/version", "..."]
    const content = [];
    
    // Get all manifest.json files from packages directory
    const manifests = globSync(path.posix.join('.', 'packages', '*', 'manifest.json'));

    // Loop through each manifest.json file
    for (const manifestPath of manifests) {
        try {
            // Read and parse the manifest.json file
            const manifestData = JSON.parse(await fs.promises.readFile(manifestPath, 'utf-8'));

            // Extract name, namespace, and version from the manifest file
            const { name, namespace, version } = manifestData;

            // Format it as "namespace/name/version"
            if (name && namespace && version) {
                content.push(`${namespace}/${name}/${version}`);
            } else {
                console.warn(`Missing data in manifest: ${manifestPath}`);
            }
        } catch (error) {
            console.error(`Error reading manifest file: ${manifestPath}`, error);
        }
    }

    // Write the formatted content array to a new file
    try {
        await fs.promises.writeFile(
            './dev-server/component-service/manifests.json', 
            JSON.stringify(content, null, 2), 
            'utf-8'
        );
        console.log(`✅ Manifest compiled: ${content.length} components found`);
    } catch (error) {
        console.error('Error writing manifests.json:', error);
    }
} 