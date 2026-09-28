import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGO_URI: process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://mithuntalukdar2003_db_user:89fF2BIUFE6YENfM@cluster0.ob3ijdr.mongodb.net/amd_it_solution?retryWrites=true&w=majority',
  JWT_SECRET: process.env.JWT_SECRET || 'amd_it_solution_dev_secret_2026_change_in_prod_32chars!',
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
