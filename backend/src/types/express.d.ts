import { JwtPayload } from '../utils/jwt.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { _id?: string };
    }
  }
}
export {};
