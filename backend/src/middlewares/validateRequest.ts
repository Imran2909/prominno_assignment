import type { NextFunction, Request, Response } from 'express';
import type { ObjectSchema } from 'joi';
import { AppError } from '../utils/AppError.js';
import { httpStatus } from '../utils/httpStatus.js';

interface ValidationSchemas {
  body?: ObjectSchema;
  params?: ObjectSchema;
  query?: ObjectSchema;
}

export const validateRequest =
  (schemas: ValidationSchemas) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        errors.push(...error.details.map((detail) => detail.message));
      } else {
        req.body = value;
      }
    }

    if (schemas.params) {
      const { error, value } = schemas.params.validate(req.params, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        errors.push(...error.details.map((detail) => detail.message));
      } else {
        req.params = value;
      }
    }

    if (schemas.query) {
      const { error, value } = schemas.query.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
        convert: true
      });

      if (error) {
        errors.push(...error.details.map((detail) => detail.message));
      } else {
        req.validatedQuery = value as Record<string, unknown>;
      }
    }

    if (errors.length > 0) {
      next(new AppError(httpStatus.BAD_REQUEST, 'Validation failed', errors));
      return;
    }

    next();
  };
