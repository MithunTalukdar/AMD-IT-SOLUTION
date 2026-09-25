import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amd_it_solution',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_change_me',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('change')) {
  console.warn('⚠️  JWT_SECRET is default/example — set a strong secret in .env for production');
}
if (!env.RAZORPAY_KEY_ID || env.RAZORPAY_KEY_ID.includes('dummy') || env.RAZORPAY_KEY_ID.includes('mock')) {
  console.warn('⚠️  RAZORPAY_KEY_ID is mock/dummy — payments will run in MOCK mode (signature still verified via HMAC). Set real keys in production.');
}
