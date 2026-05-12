import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';
import { httpStatus } from '../utils/httpStatus.js';

interface MongoDuplicateError extends Error {
  code?: number;
  keyValue?: Record<string, string>;
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors
    });
    return;
  }

  const mongoError = error as MongoDuplicateError;
  if (mongoError.code === 11000) {
    const duplicateField = Object.keys(mongoError.keyValue ?? {})[0] ?? 'field';
    res.status(httpStatus.CONFLICT).json({
      success: false,
      message: `${duplicateField} already exists`
    });
    return;
  }

  console.error(error);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal server error'
  });
};
