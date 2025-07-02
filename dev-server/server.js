import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pagesConfig } from './pages-config.js';
import { registerPageRoutes } from './utils/route-register.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // Serve static files
  app.use('/mysource_files', express.static(join(__dirname, '../mysource_files')));
  app.use('/global', express.static(join(__dirname, '../global')));
  // app.use('/packages', express.static(join(__dirname, '../packages')));

  // Register all page routes from configuration
  registerPageRoutes(app, pagesConfig);

  // Fallback route for undefined pages
  app.get('*', (req, res) => {
    res.status(404).send(`
      <h1>404 - Page Not Found</h1>
      <p>The page "${req.path}" was not found.</p>
      <p><a href="/">Go to Home</a></p>
    `);
  });

  app.listen(4000, () => {
    console.log('Enhanced dev server running at http://localhost:4000');
    console.log('DXP CLI server should be running at http://localhost:5555');
  });
}

createServer(); 