import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectDB from './config/db.js';

const PORT = parseInt(process.env.PORT || '5000', 10);

// Connect to MongoDB
connectDB().catch(err => {
  console.warn('Initial DB connection warning:', err?.message || err);
});

// Start standalone HTTP server when not in serverless runtime
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ AMD IT SOLUTION backend running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   API:    http://localhost:${PORT}/api/health`);
  });
}

export default app;
