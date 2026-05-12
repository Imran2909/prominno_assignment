import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '../types/roles.js';
import { AppError } from '../utils/AppError.js';
import { httpStatus } from '../utils/httpStatus.js';

export const roleMiddleware =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(httpStatus.UNAUTHORIZED, 'Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError(httpStatus.FORBIDDEN, 'You do not have permission to access this resource'));
      return;
    }

    next();
  };
