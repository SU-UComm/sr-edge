#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
    // Base URL for the Asset Management API
    AMAPI_BASE_URL: process.env.AMAPI_BASE_URL,
    // Authorization token
    AUTH_TOKEN: process.env.MANAGEMENT_API_KEY,
    // Path to packages directory relative to script location
    PACKAGES_DIR: path.join(__dirname, '..', '..', 'packages'),
    // Replacement asset IDs
    REPLACEMENT_IDS: {
        links: '29389',
        images: '172387',
        default: '29389'
    }
};

/**
 * Extract asset IDs from matrix-asset URIs
 * @param {string} text - Text to search for matrix-asset URIs
 * @returns {Array} Array of found asset IDs
 */
function extractAssetIds(text) {
    if (typeof text !== 'string') return [];
    
    const matrixAssetRegex = /matrix-asset:\/\/[^\/]+\/(\d+)/g;
    const matches = [];
    let match;
    
    while ((match = matrixAssetRegex.exec(text)) !== null) {
        matches.push({
            fullUri: match[0],
            assetId: match[1],
            context: text.substring(Math.max(0, match.index - 50), match.index + match[0].length + 50)
        });
    }
    
    return matches;
}

/**
 * Check if an asset ID exists (with caching)
 * @param {string} assetId - Asset ID to check
 * @param {Map} assetCache - Cache for asset validation results
 * @param {Object} stats - Statistics object with apiCallsMade and cacheHits
 * @returns {Promise<boolean>} True if asset exists, false otherwise
 */
async function checkAssetExists(assetId, assetCache, stats) {
    // Check cache first
    if (assetCache.has(assetId)) {
        const cachedResult = assetCache.get(assetId);
        stats.cacheHits++;
        console.log(`    📋 Cached result for ${assetId}: ${cachedResult ? '✅ Valid' : '❌ Broken'}`);
        return cachedResult;
    }
    
    try {
        const url = `${CONFIG.AMAPI_BASE_URL}/assets/${assetId}`;
        stats.apiCallsMade++;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CONFIG.AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`    Making GET request to: ${url}`);
        console.log(`    Response status: ${response.status} ${response.statusText}`);
        const data = await response.json();

        let result = false;

        if(!data.id) {
            console.log(`    ❌ Asset ${assetId} not found`);
            result = false;
        } else {
            console.log(`    ✅ Asset ${data.id} exists`);
            result = true;
        }
    
        // Cache the result
        assetCache.set(assetId, result);
        return result;
    } catch (error) {
        console.error(`    ❌ Error checking asset ${assetId}:`, error.message);
    }
}

/**
 * Determine the type of asset based on context
 * @param {string} context - Context around the asset URI
 * @param {string} fieldName - Name of the field containing the URI
 * @returns {string} Asset type ('links', 'images', or 'default')
 */
function determineAssetType(context, fieldName) {
    const lowerContext = context.toLowerCase();
    const lowerFieldName = fieldName.toLowerCase();
    
    // Check for image-related keywords
    if (lowerContext.includes('image') || 
        lowerFieldName.includes('image') || 
        lowerFieldName.includes('photo') ||
        lowerFieldName.includes('picture') ||
        lowerFieldName.includes('img')) {
        return 'images';
    }
    
    // Check for link-related keywords
    if (lowerContext.includes('link') || 
        lowerFieldName.includes('link') || 
        lowerFieldName.includes('url') ||
        lowerFieldName.includes('href') ||
        lowerContext.includes('href=')) {
        return 'links';
    }
    
    return 'default';
}

/**
 * Recursively search for matrix-asset URIs in an object
 * @param {Object} obj - Object to search
 * @param {string} path - Current path in the object
 * @returns {Array} Array of found asset references
 */
function findAssetReferences(obj, path = '') {
    const references = [];
    
    if (typeof obj === 'string') {
        const assetIds = extractAssetIds(obj);
        assetIds.forEach(asset => {
            references.push({
                ...asset,
                path: path,
                value: obj
            });
        });
    } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
            const newPath = path ? `${path}[${index}]` : `[${index}]`;
            references.push(...findAssetReferences(item, newPath));
        });
    } else if (obj && typeof obj === 'object') {
        for (const [key, value] of Object.entries(obj)) {
            const newPath = path ? `${path}.${key}` : key;
            references.push(...findAssetReferences(value, newPath));
        }
    }
    
    return references;
}

/**
 * Load all example data files for a component
 * @param {string} componentName - Name of the component
 * @returns {Promise<Array>} Array of example data objects with their filenames
 */
async function loadAllExampleData(componentName) {
    try {
        const exampleDataDir = path.join(CONFIG.PACKAGES_DIR, componentName, 'example-data');
        
        // Check if example-data directory exists
        try {
            await fs.access(exampleDataDir);
        } catch (error) {
            return [];
        }
        
        // Read all files in the example-data directory
        const files = await fs.readdir(exampleDataDir);
        
        // Filter for JSON files
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        // Load all JSON files
        const exampleDataArray = [];
        for (const jsonFile of jsonFiles) {
            try {
                const filePath = path.join(exampleDataDir, jsonFile);
                const data = await fs.readFile(filePath, 'utf8');
                const parsedData = JSON.parse(data);
                
                exampleDataArray.push({
                    filename: jsonFile,
                    data: parsedData
                });
            } catch (error) {
                console.error(`Error loading ${jsonFile} for ${componentName}:`, error.message);
            }
        }
        
        return exampleDataArray;
    } catch (error) {
        console.error(`Error loading example data for ${componentName}:`, error.message);
        return [];
    }
}

/**
 * Get all available components from the packages directory
 * @returns {Promise<string[]>} Array of all component names
 */
async function getAllComponents() {
    try {
        const packages = await fs.readdir(CONFIG.PACKAGES_DIR);
        return packages.filter(pkg => {
            // Filter out non-directory items and hidden files
            return !pkg.startsWith('.');
        });
    } catch (error) {
        console.error('Error reading packages directory:', error.message);
        return [];
    }
}

/**
 * Generate replacement value for broken asset ID
 * @param {string} assetType - Type of asset ('links', 'images', 'default')
 * @param {string} originalUri - Original matrix-asset URI
 * @returns {string} Replacement URI
 */
function generateReplacementUri(assetType, originalUri) {
    const replacementId = CONFIG.REPLACEMENT_IDS[assetType] || CONFIG.REPLACEMENT_IDS.default;
    
    // Extract the namespace from the original URI
    const namespaceMatch = originalUri.match(/matrix-asset:\/\/([^\/]+)\/\d+/);
    const namespace = namespaceMatch ? namespaceMatch[1] : 'StanfordNews';
    
    return `matrix-asset://${namespace}/${replacementId}`;
}

/**
 * Parse command line arguments
 * @returns {Object} Parsed arguments
 */
function parseCommandLineArgs() {
    const args = process.argv.slice(2);
    const options = {
        help: false
    };
    
    for (const arg of args) {
        if (arg === '--help' || arg === '-h') {
            options.help = true;
        }
    }
    
    return options;
}

/**
 * Main function to validate asset IDs
 */
async function main() {
    const options = parseCommandLineArgs();
    
    console.log('Starting asset ID validation process...');
    console.log(`Process ID: ${process.pid}\n`);
    
    const components = await getAllComponents();
    console.log(`Found ${components.length} components to process\n`);
    
    // Cache for asset validation results (always start fresh)
    const assetCache = new Map();
    // Force clear any potential global state
    assetCache.clear();
    const stats = {
        apiCallsMade: 0,
        cacheHits: 0
    };
    
    const brokenAssets = [];
    let totalAssetsChecked = 0;
    let totalBrokenAssets = 0;
    
    for (const componentName of components) {
        console.log(`Processing component: ${componentName}`);
        
        const exampleDataArray = await loadAllExampleData(componentName);
        
        for (const exampleDataItem of exampleDataArray) {
            console.log(`  Checking file: ${exampleDataItem.filename}`);
            
            // Find all asset references in the data
            const assetReferences = findAssetReferences(exampleDataItem.data);
            
            for (const assetRef of assetReferences) {
                totalAssetsChecked++;
                console.log(`    Checking asset ID: ${assetRef.assetId}`);
                
                const exists = await checkAssetExists(assetRef.assetId, assetCache, stats);
                
                if (!exists) {
                    totalBrokenAssets++;
                    const assetType = determineAssetType(assetRef.context, assetRef.path);
                    const replacementUri = generateReplacementUri(assetType, assetRef.fullUri);
                    
                    brokenAssets.push({
                        component: componentName,
                        file: exampleDataItem.filename,
                        path: assetRef.path,
                        originalUri: assetRef.fullUri,
                        assetId: assetRef.assetId,
                        assetType: assetType,
                        replacementUri: replacementUri,
                        replacementId: CONFIG.REPLACEMENT_IDS[assetType] || CONFIG.REPLACEMENT_IDS.default,
                        context: assetRef.context
                    });
                    
                    console.log(`      ❌ BROKEN: ${assetRef.assetId} -> ${replacementUri}`);
                } else {
                    console.log(`      ✅ Valid: ${assetRef.assetId}`);
                }
            }
        }
    }
    
    // Generate report
    console.log('\n' + '='.repeat(80));
    console.log('ASSET VALIDATION REPORT');
    console.log('='.repeat(80));
    console.log(`Total assets checked: ${totalAssetsChecked}`);
    console.log(`Total broken assets: ${totalBrokenAssets}`);
    console.log(`Broken assets array length: ${brokenAssets.length}`);
    console.log(`Success rate: ${((totalAssetsChecked - totalBrokenAssets) / totalAssetsChecked * 100).toFixed(1)}%`);
    console.log(`API calls made: ${stats.apiCallsMade}`);
    console.log(`Cache hits: ${stats.cacheHits}`);
    console.log(`Cache efficiency: ${((stats.cacheHits / (stats.apiCallsMade + stats.cacheHits)) * 100).toFixed(1)}%`);
    
    if (brokenAssets.length > 0) {
        console.log('\nBROKEN ASSET DETAILS:');
        console.log('-'.repeat(80));
        
        // Group by component
        const groupedByComponent = {};
        brokenAssets.forEach(asset => {
            if (!groupedByComponent[asset.component]) {
                groupedByComponent[asset.component] = [];
            }
            groupedByComponent[asset.component].push(asset);
        });
        
        for (const [component, assets] of Object.entries(groupedByComponent)) {
            console.log(`\nComponent: ${component}`);
            console.log('  Broken assets:');
            
            assets.forEach(asset => {
                console.log(`    File: ${asset.file}`);
                console.log(`    Path: ${asset.path}`);
                console.log(`    Original: ${asset.originalUri}`);
                console.log(`    Replacement: ${asset.replacementUri} (${asset.assetType})`);
                console.log(`    Context: ${asset.context.trim()}`);
                console.log('');
            });
        }
        
        // Generate JSON report
        const reportData = {
            summary: {
                totalAssetsChecked,
                totalBrokenAssets,
                successRate: ((totalAssetsChecked - totalBrokenAssets) / totalAssetsChecked * 100).toFixed(1)
            },
            brokenAssets: brokenAssets,
            groupedByComponent: groupedByComponent
        };
        
        const reportPath = path.join(__dirname, 'asset-validation-report.json');
        await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));
        console.log(`\nDetailed report saved to: ${reportPath}`);
        
    } else {
        console.log('\n🎉 No broken assets found! All asset IDs are valid.');
    }
    assetCache.clear();
    console.log('\n=== Asset validation completed ===');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('Script failed:', error);
        process.exit(1);
    });
}

export {
    extractAssetIds,
    checkAssetExists,
    determineAssetType,
    findAssetReferences,
    loadAllExampleData,
    getAllComponents,
    generateReplacementUri
}; 