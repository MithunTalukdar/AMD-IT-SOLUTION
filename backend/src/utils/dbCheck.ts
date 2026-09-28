import mongoose from 'mongoose';
import connectDB from '../config/db.js';

export const isDBConnected = (): boolean => mongoose.connection.readyState === 1;

export const requireDB = (res: any): boolean => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  // Try reconnecting in background
  connectDB().catch(() => {});
  res.status(503).json({
    success: false,
    message: 'Database server is initializing or temporarily unavailable. Please retry in a few moments.',
  });
  return false;
};

