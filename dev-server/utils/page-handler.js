import { transformComponentSyntax } from './component-transform.js';

/**
 * Handles the rendering of a page with component transformation
 * @param {string} modulePath - Path to the page module
 * @param {string} basePath - Base path for component resolution
 * @returns {Promise<string>} - Rendered HTML
 */
export async function renderPage(modulePath, basePath = process.cwd()) {
  try {
    const pageModule = await import(modulePath);
    const html = await pageModule.default();
    
    // Apply component transformation
    const transformedHtml = await transformComponentSyntax(html, basePath);
    
    return transformedHtml;
  } catch (error) {
    console.error(`Error rendering page ${modulePath}:`, error);
    throw error;
  }
} 