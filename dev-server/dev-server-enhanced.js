import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pagesConfig } from './pages-config.js';
import { registerPageRoutes } from './utils/route-register.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createEnhancedServer() {
  const app = express();

  // Create Vite server in middleware mode for development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    configFile: join(__dirname, '../vite-dev.config.js')
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // Serve static files
  app.use('/mysource_files', express.static(join(__dirname, '../mysource_files')));
  app.use('/global', express.static(join(__dirname, '../global')));
  app.use('/dist', express.static(join(__dirname, '../dist')));

  // Register all page routes from configuration
  registerPageRoutes(app, pagesConfig);

  // Development-specific routes
  app.get('/dev-status', (req, res) => {
    res.json({
      status: 'running',
      timestamp: new Date().toISOString(),
      pages: Object.keys(pagesConfig),
      vite: 'integrated'
    });
  });

  // Fallback route for undefined pages
  app.get('*', (req, res) => {
    res.status(404).send(`
      <h1>404 - Page Not Found</h1>
      <p>The page "${req.path}" was not found.</p>
      <p><a href="/">Go to Home</a></p>
      <p><a href="/dev-status">Development Status</a></p>
    `);
  });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🚀 Enhanced dev server running at http://localhost:${port}`);
    console.log(`📊 Development status: http://localhost:${port}/dev-status`);
    console.log(`⚡ Vite dev server integrated for hot reload`);
    console.log(`📁 Available pages: ${Object.keys(pagesConfig).join(', ')}`);
  });

  return { app, vite };
}

createEnhancedServer().catch(console.error); 