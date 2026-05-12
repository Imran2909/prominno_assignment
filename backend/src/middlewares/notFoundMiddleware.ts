import type { RequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';
import { httpStatus } from '../utils/httpStatus.js';

export const notFoundMiddleware: RequestHandler = (req, _res, next) => {
  next(new AppError(httpStatus.NOT_FOUND, `Route not found: ${req.method} ${req.originalUrl}`));
};
