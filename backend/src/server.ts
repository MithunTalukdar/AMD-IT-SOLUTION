import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectDB from './config/db.js';

const PORT = parseInt(process.env.PORT || '5000', 10);

await connectDB();

app.listen(PORT, () => {
  console.log(`✅ AMD IT SOLUTION backend running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   API:    http://localhost:${PORT}/api/health`);
});
