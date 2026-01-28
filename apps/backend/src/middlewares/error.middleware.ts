import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiResponse } from '../utils';
import { logger, env } from '../config';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      logger.error('Server error:', err);
    } else {
      logger.warn(`Client error: ${err.message}`);
    }
  } else {
    logger.error('Unhandled error:', err);
  }

  if (err instanceof ApiError) {
    ApiResponse.error(res, err.message, err.statusCode, err.errors);
    return;
  }

  if (err.name === 'ValidationError') {
    const errors: Record<string, string> = {};
    const mongooseError = err as unknown as { errors: Record<string, { message: string }> };
    Object.keys(mongooseError.errors).forEach((key) => {
      errors[key] = mongooseError.errors[key].message;
    });
    ApiResponse.error(res, 'Validation failed', 400, errors);
    return;
  }

  if (err.name === 'MongoServerError' && (err as unknown as { code: number }).code === 11000) {
    ApiResponse.error(res, 'Duplicate entry found', 409);
    return;
  }

  if (err.name === 'CastError') {
    ApiResponse.error(res, 'Invalid ID format', 400);
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    ApiResponse.error(res, 'Invalid token', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    ApiResponse.error(res, 'Token expired', 401);
    return;
  }

  const message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  ApiResponse.error(res, message, 500);
};
 
export const notFoundHandler = (_req: Request, res: Response): void => {
  ApiResponse.error(res, 'Route not found', 404);
};

export default errorHandler;
