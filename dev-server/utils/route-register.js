import { renderPage } from './page-handler.js';

/**
 * Registers all routes from the pages configuration
 * @param {Express} app - Express app instance
 * @param {Object} pagesConfig - Pages configuration object
 */
export function registerPageRoutes(app, pagesConfig) {
  // Register each route from the configuration
  Object.entries(pagesConfig).forEach(([route, config]) => {
    // Register the main route
    app.get(route, async (req, res) => {
      try {
        const html = await renderPage(config.module);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (error) {
        console.error(`Error serving ${route}:`, error);
        res.status(500).end(error.message);
      }
    });

    // Register aliases if they exist
    if (config.aliases && Array.isArray(config.aliases)) {
      config.aliases.forEach(alias => {
        app.get(alias, async (req, res) => {
          try {
            const html = await renderPage(config.module);
            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
          } catch (error) {
            console.error(`Error serving ${alias}:`, error);
            res.status(500).end(error.message);
          }
        });
      });
    }
  });
} 