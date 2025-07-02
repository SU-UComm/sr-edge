import fs from 'fs';
import path from 'path';

// Load component manifests
function loadManifests() {
  try {
    const manifestPath = path.join(process.cwd(), 'dev-server/component-service/manifests.json');
    if (fs.existsSync(manifestPath)) {
      const manifestContent = fs.readFileSync(manifestPath, 'utf8');
      return JSON.parse(manifestContent);
    }
  } catch (error) {
    console.error('Error loading manifests:', error);
  }
  return [];
}

// Component rendering function like kernel example
async function renderComponent(componentPath, previewKey = 'default', version = null) {
  try {
    const manifestRecords = loadManifests();
    console.log('🔍 Looking for component:', componentPath);
    console.log('📋 Available components:', manifestRecords.slice(0, 3));
    
    // Parse the component path to get namespace and component name
    const pathParts = componentPath.split('/');
    const [namespace, componentName] = pathParts;
    
    let resolvedManifestPath;
    
    if (version) {
      // If version is provided, construct the exact path
      resolvedManifestPath = `${namespace}/${componentName}/${version}`;
      console.log('🎯 Using exact version path:', resolvedManifestPath);
    } else {
      // If no version provided, find the component in manifest
      resolvedManifestPath = manifestRecords.find((item) => {
        const matches = item.includes(`${namespace}/${componentName}/`);
        console.log(`🔍 Checking "${item}" includes "${namespace}/${componentName}/": ${matches}`);
        return matches;
      });
    }
    
    if (!resolvedManifestPath) {
      throw new Error(`Component "${componentPath}" not found in manifest. Available: ${manifestRecords.slice(0, 5).join(', ')}...`);
    }
    
    console.log('✅ Found component:', resolvedManifestPath);
    const [resolvedNamespace, resolvedName, resolvedVersion] = resolvedManifestPath.split('/');
    const response = await fetch(`http://localhost:5555/dev/render/${resolvedNamespace}__${resolvedName}__${resolvedVersion}?_previewKey=${previewKey}`);
    const data = await response.text();
    return data;
  } catch (error) {
    console.error(`Error rendering component ${componentPath}:`, error);
    return `<div style="border: 2px dashed #ff0000; padding: 1rem; margin: 1rem; color: #ff0000;">
      <strong>Component Error:</strong> ${componentPath} (${previewKey})
      <br><small>${error.message}</small>
    </div>`;
  }
}

// Transform component syntax in HTML content
export async function transformComponentSyntax(html, basePath = '') {
  // Find all component references with new format: <!--@@ cmp {namespace}/header-component/default 1.0.0 @@-->
  const regex = /<!--@@\s*cmp\s+([^@]+?)\s*@@-->/g;
  const matches = [...html.matchAll(regex)];
  
  if (matches.length === 0) {
    return html;
  }
  
  // Process all component transformations in parallel
  const transformations = matches.map(async (match) => {
    const [fullMatch, componentRef] = match;
    console.log('Transforming component:', componentRef);
    
    // Parse component reference (e.g., "stanford-apb/header-component/default 1.0.0" or "stanford-apb/header-component/default" or "stanford-apb/header-component")
    const parts = componentRef.trim().split(' ');
    const componentPath = parts[0]; // e.g., "stanford-apb/header-component/default"
    const version = parts[1] || null; // e.g., "1.0.0" or null
    
    // Parse the component path
    const pathParts = componentPath.split('/');
    if (pathParts.length < 2) {
      console.warn('Invalid component path format:', componentPath);
      return { fullMatch, replacement: fullMatch };
    }
    
    const namespace = pathParts[0];
    const componentName = pathParts[1];
    const previewKey = pathParts[2] || 'default'; // Use 'default' if no preview key provided
    
    try {
      const componentHtml = await renderComponent(componentPath, previewKey, version);
      console.log('Successfully rendered component:', componentName);
      return { fullMatch, replacement: componentHtml };
    } catch (error) {
      console.error(`Error rendering component ${componentName}:`, error);
      return { fullMatch, replacement: fullMatch };
    }
  });
  
  // Wait for all transformations to complete
  const results = await Promise.all(transformations);
  
  // Replace all matches in the HTML
  let transformedHtml = html;
  results.forEach(({ fullMatch, replacement }) => {
    transformedHtml = transformedHtml.replace(fullMatch, replacement);
  });
  
  return transformedHtml;
} 