import dotenv from 'dotenv';
dotenv.config();
import app from '../backend/dist/app.js';
import connectDB from '../backend/dist/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('MongoDB connection error in serverless handler:', err);
  }
  return app(req, res);
}
