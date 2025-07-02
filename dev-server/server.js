import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { transformComponentSyntax } from './utils/component-transform.js';

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
  app.use('/packages', express.static(join(__dirname, '../packages')));

  // Proxy component requests to DXP CLI server
  app.use('/api/components', (req, res, next) => {
    const targetUrl = `http://localhost:5555${req.url}`;
    console.log('Proxying to DXP CLI:', targetUrl);
    next();
  });

  app.use('/api/components', async (req, res) => {
    try {
      const response = await fetch(`http://localhost:5555${req.url}`);
      const data = await response.text();
      res.set('Content-Type', response.headers.get('content-type'));
      res.send(data);
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).send('Proxy error');
    }
  });

  // Simple test route for page-preview
  app.get('/page-preview', async (req, res) => {
    try {
      const pagePreview = await import('./pages/page-preview.js');
      const html = await pagePreview.default();
      
      // Apply component transformation
      const transformedHtml = await transformComponentSyntax(html, process.cwd());
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(transformedHtml);
    } catch (e) {
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  // Default route
  app.get('/', (req, res) => {
    res.send(`
      <h1>Stanford Edge Components - Enhanced Dev Server</h1>
      <p>Server is running!</p>
      <a href="/page-preview">Test Page Preview</a>
    `);
  });

  app.listen(4000, () => {
    console.log('Enhanced dev server running at http://localhost:4000');
    console.log('DXP CLI server should be running at http://localhost:5555');
  });
}

createServer(); 