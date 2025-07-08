#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
    // Path to packages directory relative to script location
    PACKAGES_DIR: path.join(__dirname, '..', '..', 'packages'),
    // Path to component info JSON file
    COMPONENT_INFO_PATH: path.join(__dirname, 'component-info.json')
};

/**
 * Extract version from a manifest.json file
 * @param {string} manifestPath - Path to the manifest.json file
 * @returns {Promise<string|null>} Version string or null if not found
 */
async function extractVersionFromManifest(manifestPath) {
    try {
        const data = await fs.readFile(manifestPath, 'utf8');
        const manifest = JSON.parse(data);
        return manifest.version || null;
    } catch (error) {
        console.error(`Error reading manifest at ${manifestPath}:`, error.message);
        return null;
    }
}

/**
 * Get all component versions from manifest.json files
 * @returns {Promise<Object>} Object mapping component names to versions
 */
async function getAllComponentVersions() {
    try {
        const packages = await fs.readdir(CONFIG.PACKAGES_DIR);
        const versions = {};
        
        for (const pkg of packages) {
            // Skip hidden files and non-directories
            if (pkg.startsWith('.') || pkg === 'node_modules') {
                continue;
            }
            
            const manifestPath = path.join(CONFIG.PACKAGES_DIR, pkg, 'manifest.json');
            
            try {
                // Check if manifest.json exists
                await fs.access(manifestPath);
                const version = await extractVersionFromManifest(manifestPath);
                if (version) {
                    versions[pkg] = version;
                    console.log(`✓ Found version ${version} for ${pkg}`);
                } else {
                    console.log(`⚠ No version found for ${pkg}`);
                }
            } catch (error) {
                console.log(`⚠ No manifest.json found for ${pkg}`);
            }
        }
        
        return versions;
    } catch (error) {
        console.error('Error reading packages directory:', error.message);
        return {};
    }
}

/**
 * Update component-info.json with version information
 * @param {Object} versions - Object mapping component names to versions
 */
async function updateComponentInfo(versions) {
    try {
        // Read existing component info
        const data = await fs.readFile(CONFIG.COMPONENT_INFO_PATH, 'utf8');
        const componentInfo = JSON.parse(data);
        
        // Update each component with version information
        let updatedCount = 0;
        for (const component of componentInfo) {
            const componentName = component.component_name;
            if (versions[componentName]) {
                component.version = versions[componentName];
                updatedCount++;
                console.log(`✓ Updated ${componentName} with version ${versions[componentName]}`);
            } else {
                console.log(`⚠ No version found for ${componentName} in manifest files`);
            }
        }
        
        // Write updated component info back to file
        await fs.writeFile(CONFIG.COMPONENT_INFO_PATH, JSON.stringify(componentInfo, null, 4));
        
        console.log(`\n=== Summary ===`);
        console.log(`Updated ${updatedCount} components with version information`);
        console.log(`Component info saved to: ${CONFIG.COMPONENT_INFO_PATH}`);
        
    } catch (error) {
        console.error('Error updating component info:', error.message);
    }
}

/**
 * Main function
 */
async function main() {
    console.log('Starting component version update process...\n');
    
    // Get all component versions
    const versions = await getAllComponentVersions();
    
    if (Object.keys(versions).length === 0) {
        console.log('No component versions found. Exiting.');
        return;
    }
    
    console.log(`\nFound ${Object.keys(versions).length} component versions`);
    
    // Update component-info.json
    await updateComponentInfo(versions);
    
    console.log('\n=== Component version update completed ===');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('Script failed:', error);
        process.exit(1);
    });
}

export {
    extractVersionFromManifest,
    getAllComponentVersions,
    updateComponentInfo
}; 