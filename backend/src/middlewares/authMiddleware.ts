import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';
import { httpStatus } from '../utils/httpStatus.js';
import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError(httpStatus.UNAUTHORIZED, 'Authorization token is required'));
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
  }
};
