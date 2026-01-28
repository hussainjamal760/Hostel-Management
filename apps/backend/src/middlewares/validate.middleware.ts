import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils';

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = req[source];
      const result = schema.parse(data);

      req[source] = result;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        
        console.error('[Validation Warning] Zod Error:', JSON.stringify(errors, null, 2));

        next(ApiError.badRequest('Validation failed', errors));
      } else {
        next(error);
      }
    }
  };
};


export const validateRequest = (schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: Record<string, string> = {};

    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });

        next(ApiError.badRequest('Validation failed', errors));
      } else {
        next(error);
      }
    }
  };
};

export default validate;
