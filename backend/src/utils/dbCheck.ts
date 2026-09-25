import mongoose from 'mongoose';

export const isDBConnected = (): boolean => mongoose.connection.readyState === 1;

export const requireDB = (res: any): boolean => {
  if (!isDBConnected()) {
    res.status(503).json({ success: false, message: 'Database unavailable — please try again later (MONGO_URI not connected)' });
    return false;
  }
  return true;
};
