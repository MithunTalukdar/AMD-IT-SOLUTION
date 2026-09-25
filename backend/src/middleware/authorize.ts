import { Request, Response, NextFunction } from 'express';

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    if (!roles.includes(user.role)) {
      return res.status(403).json({ success: false, message: `Forbidden: requires role ${roles.join(' or ')}` });
    }
    next();
  };
};
