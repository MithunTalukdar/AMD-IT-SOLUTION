import dotenv from 'dotenv';
dotenv.config();
import app from '../backend/src/app.js';
import connectDB from '../backend/src/config/db.js';

export default async function handler(req: any, res: any) {
  await connectDB();
  return app(req, res);
}
