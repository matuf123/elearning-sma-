import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'edusphere_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // API Routes for EduSphere persistent database
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      school: 'SMA PGRI 4 GANDRUNGMANGU',
      system: 'EduSphere',
      timestamp: new Date().toISOString(),
    });
  });

  // Read full DB state
  app.get('/api/database', (req, res) => {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return res.json(JSON.parse(data));
      }
      return res.json(null);
    } catch (err: any) {
      console.error('Error reading DB:', err);
      return res.status(500).json({ error: 'Failed to read database', details: err.message });
    }
  });

  // Save / Sync full DB state
  app.post('/api/database', (req, res) => {
    try {
      const payload = req.body;
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
      return res.json({ success: true, timestamp: new Date().toISOString() });
    } catch (err: any) {
      console.error('Error writing DB:', err);
      return res.status(500).json({ error: 'Failed to write database', details: err.message });
    }
  });

  // Attach Vite middleware for SPA
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduSphere SMA PGRI 4 Gandrungmangu server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
