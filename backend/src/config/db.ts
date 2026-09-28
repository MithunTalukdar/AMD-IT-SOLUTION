import mongoose from 'mongoose';

let cachedPromise: Promise<typeof mongoose> | null = null;

const DEFAULT_URI = 'mongodb+srv://mithuntalukdar2003_db_user:89fF2BIUFE6YENfM@cluster0.ob3ijdr.mongodb.net/amd_it_solution?retryWrites=true&w=majority';

function sanitizeMongoUri(rawUri?: string): string {
  let uri = (rawUri || '').trim();
  if (!uri) return DEFAULT_URI;
  // If URI ends with cluster0.ob3ijdr.mongodb.net/ without DB name, append db name
  if (/mongodb\.net\/?(\?.*)?$/.test(uri)) {
    uri = uri.replace(/mongodb\.net\/?(\?.*)?$/, 'mongodb.net/amd_it_solution?retryWrites=true&w=majority');
  }
  return uri;
}

// Global Mongoose configurations for fast response and reliability
mongoose.set('bufferTimeoutMS', 3000);

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err?.message || err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Will attempt reconnect on next request.');
  cachedPromise = null;
});

const connectDB = async (): Promise<typeof mongoose | null> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  const uri = sanitizeMongoUri(process.env.MONGODB_URI || process.env.MONGO_URI);

  if (!cachedPromise || mongoose.connection.readyState === 0) {
    cachedPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 2,
    }).then((m) => {
      return m;
    }).catch((err) => {
      cachedPromise = null;
      console.warn('MongoDB connection failed:', (err as Error).message);
      throw err;
    });
  }

  try {
    return await cachedPromise;
  } catch (err) {
    return null;
  }
};

export default connectDB;

