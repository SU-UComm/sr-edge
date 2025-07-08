#!/usr/bin/env node

import fetch from 'node-fetch';
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
    AMAPI_BASE_URL: process.env.AMAPI_BASE_URL || 'https://news.stanford.edu/__management_api/v1',
    // Authorization token
    AUTH_TOKEN: process.env.MANAGEMENT_API_KEY,
    // Path to packages directory relative to script location
    PACKAGES_DIR: path.join(__dirname, '..', '..', 'packages'),
    // Path to component info JSON file
    COMPONENT_INFO_PATH: path.join(__dirname, 'component-info.json')
};

/**
 * Parse command line arguments to extract component names
 * @returns {Object} Object with components array and showSummary flag
 */
function parseCommandLineArgs() {
    const args = process.argv.slice(2);
    const components = [];
    let showSummary = false;
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--summary' || args[i] === '--list') {
            showSummary = true;
        } else if (args[i] === '--cmp') {
            if (i + 1 < args.length) {
                const component = args[i + 1];
                if (component === 'all') {
                    return { components: getAllComponents(), showSummary };
                }
                components.push(component);
                i++; // Skip the next argument since we consumed it
            }
        } else if (args[i].startsWith('--cmp=')) {
            const component = args[i].substring(6); // Remove '--cmp='
            if (component === 'all') {
                return { components: getAllComponents(), showSummary };
            }
            components.push(component);
        }
    }
    
    return { components, showSummary };
}

/**
 * Get all available components from the packages directory
 * @returns {string[]} Array of all component names
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
 * Get a summary of all example data files across all components
 * @returns {Promise<Object>} Summary object with component names and their JSON files
 */
async function getExampleDataSummary() {
    try {
        const components = await getAllComponents();
        const summary = {};
        
        for (const componentName of components) {
            const exampleDataArray = await loadAllExampleData(componentName);
            if (exampleDataArray.length > 0) {
                summary[componentName] = exampleDataArray.map(item => item.filename);
            }
        }
        
        return summary;
    } catch (error) {
        console.error('Error generating example data summary:', error.message);
        return {};
    }
}

/**
 * Load component info from the JSON file
 * @returns {Promise<Array>} Array of component assets
 */
async function fetchPageAssets() {
    try {
        console.log('Loading component assets from component-info.json...');
        
        const data = await fs.readFile(CONFIG.COMPONENT_INFO_PATH, 'utf8');
        const componentAssets = JSON.parse(data);
        
        console.log(`Found ${componentAssets.length} component assets`);
        return componentAssets;
    } catch (error) {
        console.error('Error loading component assets:', error.message);
        return [];
    }
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
            console.log(`No example-data directory found for ${componentName}`);
            return [];
        }
        
        // Read all files in the example-data directory
        const files = await fs.readdir(exampleDataDir);
        
        // Filter for JSON files
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        if (jsonFiles.length === 0) {
            console.log(`No JSON files found in example-data for ${componentName}`);
            return [];
        }
        
        console.log(`Found ${jsonFiles.length} JSON files for ${componentName}: ${jsonFiles.join(', ')}`);
        
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
                
                console.log(`✓ Loaded ${jsonFile} for ${componentName}`);
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
 * Update page content with new data
 * @param {string} assetId - The asset ID to update
 * @param {Object} newContent - The new content to set
 * @returns {Promise<boolean>} Success status
 */
async function updatePageContent(assetId, newContent) {
    try {
        console.log(`Updating content for asset: ${assetId}`);
        
        const response = await fetch(`${CONFIG.AMAPI_BASE_URL}/assets/${assetId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...(CONFIG.AUTH_TOKEN && { 'Authorization': `Bearer ${CONFIG.AUTH_TOKEN}` })
            },
            body: JSON.stringify(newContent)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log(`Successfully updated asset: ${assetId}`);
        return true;
    } catch (error) {
        console.error(`Error updating content for asset ${assetId}:`, error.message);
        return false;
    }
}

/**
 * Convert HTML string to FormattedText array format
 * @param {string} htmlString - HTML string to convert
 * @returns {Array} FormattedText array format
 */
function convertHtmlToFormattedText(htmlString) {
    if (!htmlString || typeof htmlString !== 'string') {
        return htmlString; // Return as-is if not a string
    }

    // Simple HTML to FormattedText converter
    const result = [];
    
    // Handle paragraph tags
    if (htmlString.includes('<p')) {
        const pMatch = htmlString.match(/<p[^>]*>(.*?)<\/p>/s);
        if (pMatch) {
            const pContent = pMatch[1];
            const children = parseInlineContent(pContent);
            
            result.push({
                type: "tag",
                tag: "p",
                children: children
            });
        }
    } else {
        // If no paragraph tags, wrap the content in a paragraph
        const children = parseInlineContent(htmlString);
        result.push({
            type: "tag",
            tag: "p",
            children: children
        });
    }
    
    return result;
}

/**
 * Parse inline HTML content and convert to children array
 * @param {string} content - HTML content to parse
 * @returns {Array} Array of text and tag objects
 */
function parseInlineContent(content) {
    const children = [];
    let currentText = '';
    let i = 0;
    
    while (i < content.length) {
        if (content[i] === '<') {
            // Save any accumulated text
            if (currentText.trim()) {
                children.push({
                    type: "text",
                    value: currentText
                });
                currentText = '';
            }
            
            // Find the end of the tag
            const tagEnd = content.indexOf('>', i);
            if (tagEnd === -1) break;
            
            const fullTag = content.substring(i, tagEnd + 1);
            const isClosingTag = fullTag.startsWith('</');
            
            if (!isClosingTag) {
                // Handle opening tags
                const tagMatch = fullTag.match(/<(\w+)([^>]*)>/);
                if (tagMatch) {
                    const tagName = tagMatch[1];
                    const tagAttrs = tagMatch[2];
                    
                    // Find the corresponding closing tag
                    const closingTag = `</${tagName}>`;
                    const closingIndex = content.indexOf(closingTag, tagEnd + 1);
                    
                    if (closingIndex !== -1) {
                        // Extract content between tags
                        const innerContent = content.substring(tagEnd + 1, closingIndex);
                        
                        // Handle nested content recursively
                        const innerChildren = parseInlineContent(innerContent);
                        
                        // Create tag object
                        const tagObj = {
                            type: "tag",
                            tag: tagName,
                            children: innerChildren
                        };
                        
                        // Add attributes if present
                        if (tagAttrs.trim()) {
                            const attrs = parseAttributes(tagAttrs);
                            if (Object.keys(attrs).length > 0) {
                                tagObj.attributes = attrs;
                            }
                        }
                        
                        children.push(tagObj);
                        
                        // Skip to after the closing tag
                        i = closingIndex + closingTag.length;
                        continue;
                    }
                }
            }
            
            // Skip the tag
            i = tagEnd + 1;
        } else {
            currentText += content[i];
            i++;
        }
    }
    
    // Add any remaining text
    if (currentText.trim()) {
        children.push({
            type: "text",
            value: currentText
        });
    }
    
    return children;
}

/**
 * Parse HTML attributes string into an object
 * @param {string} attrsString - Attributes string like 'class="left" id="test"'
 * @returns {Object} Attributes object
 */
function parseAttributes(attrsString) {
    const attrs = {};
    const attrRegex = /(\w+)=["']([^"']*)["']/g;
    let match;
    
    while ((match = attrRegex.exec(attrsString)) !== null) {
        attrs[match[1]] = match[2];
    }
    
    return attrs;
}

/**
 * Load component manifest
 * @param {string} componentName - Name of the component
 * @returns {Promise<Object|null>} Component manifest or null if not found
 */
async function loadComponentManifest(componentName) {
    try {
        const manifestPath = path.join(CONFIG.PACKAGES_DIR, componentName, 'manifest.json');
        const data = await fs.readFile(manifestPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error loading manifest for ${componentName}:`, error.message);
        return null;
    }
}

/**
 * Process an object recursively and convert FormattedText fields
 * @param {Object} obj - Object to process
 * @param {Object} manifest - Component manifest for field type information
 * @returns {Object} Processed object with converted FormattedText fields
 */
function processFormattedTextFields(obj, manifest) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    
    const result = { ...obj };
    
    // Get the input schema from manifest
    const inputSchema = manifest?.functions?.[0]?.input?.properties;
    
    for (const [key, value] of Object.entries(result)) {
        if (typeof value === 'string' && inputSchema?.[key]?.type === 'FormattedText') {
            // Convert HTML string to FormattedText array
            console.log(`Converting FormattedText field: ${key}`);
            result[key] = convertHtmlToFormattedText(value);
        } else if (typeof value === 'object' && value !== null) {
            // Recursively process nested objects
            result[key] = processFormattedTextFields(value, manifest);
        }
    }
    
    return result;
}

/**
 * Map component name to asset ID
 * @param {string} componentName - Name of the component
 * @param {Array} pageAssets - Array of all page assets
 * @returns {string|null} Single asset ID for the component or null if not found
 */
function mapComponentToAssetIds(componentName, pageAssets) {
    console.log(`Mapping component '${componentName}' to asset ID...`);
    
    // Filter page assets to find those matching the component name
    const matchingAssets = pageAssets.filter(asset => 
        asset.component_name === componentName
    );
    
    if (matchingAssets.length === 0) {
        console.log(`No assets found for component: ${componentName}`);
        return null;
    }
    
    // Take the first matching asset ID
    const assetId = matchingAssets[0].asset_assetid;
    
    console.log(`Found asset for component '${componentName}': ${assetId}`);
    
    return matchingAssets[0];
}

/**
 * Process a single component
 * @param {string} componentName - Name of the component to process
 * @param {Array} pageAssets - Array of all page assets
 */
async function processComponent(componentName, pageAssets) {
    console.log(`\n=== Processing component: ${componentName} ===`);
    
    // Load component manifest to identify FormattedText fields
    const manifest = await loadComponentManifest(componentName);
    if (!manifest) {
        console.log(`Skipping ${componentName} - could not load manifest`);
        return;
    }
    
    // Load all example data files for the component
    const exampleDataArray = await loadAllExampleData(componentName);
    if (exampleDataArray.length === 0) {
        console.log(`Skipping ${componentName} - no example data found`);
        return;
    }
    
    // Map component to asset ID
    const componentInfo = mapComponentToAssetIds(componentName, pageAssets);
    const assetId = componentInfo?.asset_assetid;
    if (!assetId) {
        console.log(`No asset ID found for component: ${componentName}`);
        return;
    }
    
    // Create payload for all example data files
    const payload = {
        "attributes": {
            "dxp_page_content": {
                "layouts": [
                    {
                        "name": "layout-raw",
                        "content": {
                            "main": []
                        }
                    }
                ]
            }
        }
    };

    // Process each example data file
    for (const exampleDataItem of exampleDataArray) {
        console.log(`\n--- Processing ${exampleDataItem.filename} ---`);
        
        // Process FormattedText fields in the example data
        const processedData = processFormattedTextFields(exampleDataItem.data, manifest);
        
        // Get current page content
        const currentContent = {
            "type": "component",
            "componentType": "edge",
            "componentId": `stanford-apb/${componentInfo.component_name}/${componentInfo.version}`,
            "componentSet": "stanford-apb",
            "contentItem": {
                "content": processedData,
                "schemaName": `stanford-apb/${componentInfo.component_name}/${componentInfo.version}/main`
            }
        }
        payload.attributes.dxp_page_content.layouts[0].content.main.push(currentContent);
    }

    // Update with new content
    const success = await updatePageContent(assetId, payload);
    if (success) {
        console.log(`✓ Successfully updated ${componentName} asset: ${assetId}`);
    } else {
        console.log(`✗ Failed to update ${componentName} asset: ${assetId}`);
    }
}

/**
 * Main function to orchestrate the UAT process
 */
async function main() {
    console.log('Starting UAT content update process...\n');
    
    // Check if auth token is available
    if (!CONFIG.AUTH_TOKEN) {
        console.error('❌ AUTH_TOKEN not found in environment variables.');
        console.error('Please add your authorization token to the .env file:');
        console.error('AUTH_TOKEN=your_actual_token_here');
        process.exit(1);
    }
    
    console.log('✅ Authorization token loaded from .env file');
    
    // Parse command line arguments
    const { components: componentsToProcess, showSummary } = parseCommandLineArgs();
    
    // If --summary flag is provided, show available example data files
    if (showSummary) {
        console.log('=== Available Example Data Files ===\n');
        const summary = await getExampleDataSummary();
        
        if (Object.keys(summary).length === 0) {
            console.log('No example data files found.');
        } else {
            for (const [componentName, files] of Object.entries(summary)) {
                console.log(`${componentName}:`);
                files.forEach(file => console.log(`  - ${file}`));
                console.log('');
            }
        }
        return;
    }
    
    console.log(`Components to process: ${componentsToProcess.join(', ')}`);
    
    // Fetch all page assets
    const pageAssets = await fetchPageAssets();
    
    // Process each component
    for (const componentName of componentsToProcess) {
        await processComponent(componentName, pageAssets);
    }
    
    console.log('\n=== UAT process completed ===');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('Script failed:', error);
        process.exit(1);
    });
}

export {
    parseCommandLineArgs,
    fetchPageAssets,
    loadAllExampleData,
    updatePageContent,
    mapComponentToAssetIds,
    processComponent,
    getExampleDataSummary,
    convertHtmlToFormattedText,
    processFormattedTextFields
}; 