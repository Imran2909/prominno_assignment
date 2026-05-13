import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError.js';
import { httpStatus } from '../utils/httpStatus.js';

interface MongoDuplicateError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

interface BodyParserError extends Error {
  status?: number;
  type?: string;
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

  const bodyParserError = error as BodyParserError;
  if (bodyParserError.type === 'entity.too.large') {
    res.status(httpStatus.PAYLOAD_TOO_LARGE).json({
      success: false,
      message: 'Request body is too large'
    });
    return;
  }

  if (bodyParserError instanceof SyntaxError && bodyParserError.status === httpStatus.BAD_REQUEST) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Invalid JSON payload'
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

  if (error instanceof mongoose.Error.CastError) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Invalid id format'
    });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors: Object.values(error.errors).map((validationError) => validationError.message)
    });
    return;
  }

  console.error(error);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal server error'
  });
};
