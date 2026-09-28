import mongoose from 'mongoose';

let cachedPromise: Promise<typeof mongoose> | null = null;

const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const uri = (process.env.MONGODB_URI || process.env.MONGO_URI || '').trim() || 'mongodb+srv://mithuntalukdar2003_db_user:89fF2BIUFE6YENfM@cluster0.ob3ijdr.mongodb.net/amd_it_solution?retryWrites=true&w=majority';

  if (!cachedPromise || mongoose.connection.readyState === 0) {
    cachedPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }).then((m) => {
      console.log(`MongoDB connected: ${m.connection.host}`);
      return m;
    }).catch((err) => {
      cachedPromise = null;
      console.warn('MongoDB connection failed:', (err as Error).message);
      throw err;
    });
  }

  try {
    await cachedPromise;
  } catch (err) {
    // allow server to continue running in fallback mode
  }
};

export default connectDB;
