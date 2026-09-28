import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb+srv://mithuntalukdar2003_db_user:89fF2BIUFE6YENfM@cluster0.ob3ijdr.mongodb.net/amd_it_solution?retryWrites=true&w=majority';

function sanitizeMongoUri(rawUri?: string): string {
  let uri = (rawUri || '').trim();
  if (!uri) return DEFAULT_URI;
  if (/mongodb\.net\/?(\?.*)?$/.test(uri)) {
    uri = uri.replace(/mongodb\.net\/?(\?.*)?$/, 'mongodb.net/amd_it_solution?retryWrites=true&w=majority');
  }
  return uri;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as any)._mongooseCache;
if (!cached) {
  cached = (global as any)._mongooseCache = { conn: null, promise: null };
}

const connectDB = async (): Promise<typeof mongoose | null> => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose;
    return mongoose;
  }

  const uri = sanitizeMongoUri(process.env.MONGODB_URI || process.env.MONGO_URI);

  if (!cached.promise || mongoose.connection.readyState === 0) {
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 1,
    }).then((m) => {
      cached.conn = m;
      return m;
    }).catch((err) => {
      cached.promise = null;
      cached.conn = null;
      console.warn('MongoDB connection note:', (err as Error).message);
      return null as any;
    });
  }

  try {
    const res = await cached.promise;
    if (res && (mongoose.connection.readyState as number) === 1) {
      cached.conn = res;
      return res;
    }
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
  }
  return null;
};

export default connectDB;


