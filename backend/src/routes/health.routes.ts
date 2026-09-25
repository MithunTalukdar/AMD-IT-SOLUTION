import { Router } from 'express';
const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Health check passed', timestamp: new Date().toISOString() });
});

router.get('/health/detailed', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), db: 'check /api/health' });
});

export default router;
