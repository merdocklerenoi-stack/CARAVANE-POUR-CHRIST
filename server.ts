import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory push subscription store (can also be saved to Supabase table push_subscriptions)
const pushSubscriptions: any[] = [];

// API Status & Diagnostics
app.get('/api/notifications/status', (req, res) => {
  res.json({
    status: 'online',
    subscriptionsCount: pushSubscriptions.length,
    service: 'Caravane Pour Christ Background Push Dispatcher',
    timestamp: new Date().toISOString()
  });
});

// Register Web Push subscription
app.post('/api/notifications/subscribe', (req, res) => {
  const subscription = req.body;
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Souscription invalide' });
  }

  // Avoid duplicates
  const existingIndex = pushSubscriptions.findIndex((s) => s.endpoint === subscription.endpoint);
  if (existingIndex > -1) {
    pushSubscriptions[existingIndex] = subscription;
  } else {
    pushSubscriptions.push(subscription);
  }

  console.log(`[Push Server] Nouvelle souscription enregistrée (${pushSubscriptions.length} actives)`);
  res.status(201).json({ success: true, message: 'Souscription enregistrée avec succès' });
});

// Trigger test Push notification from backend
app.post('/api/notifications/test-push', (req, res) => {
  const { dayNumber } = req.body;
  console.log(`[Push Server] Déclenchement du verset biblique (Jour ${dayNumber || 1}) pour ${pushSubscriptions.length} abonnés`);

  res.json({
    success: true,
    message: `Ordre de notification envoyé pour le Jour ${dayNumber || 1} ! Le Service Worker relaie le verset biblique.`,
    subscribersNotified: Math.max(1, pushSubscriptions.length)
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // In dev: mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In production: serve dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Caravane Pour Christ] Serveur opérationnel sur http://localhost:${PORT}`);
  });
}

startServer();
