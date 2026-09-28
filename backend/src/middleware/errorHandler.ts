import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message || err);
  let status = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose validation
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e: any) => e.message).join(', ');
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `This ${field} is already registered. Please login or use a different one.`;
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'MongooseError' || err.message?.includes('buffering timed out') || err.name === 'MongoServerSelectionError' || err.name === 'MongoTimeoutError') {
    status = 503;
    message = 'Database connection timed out. Please try again in a moment.';
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
