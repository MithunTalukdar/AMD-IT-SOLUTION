import mongoose from 'mongoose';
import connectDB from '../config/db.js';

export const isDBConnected = (): boolean => mongoose.connection.readyState >= 1;

export const requireDB = (res: any): boolean => {
  if (mongoose.connection.readyState === 0) {
    connectDB().catch(console.warn);
  }
  // Allow processing to proceed with buffered queries / active connections
  return true;
};
