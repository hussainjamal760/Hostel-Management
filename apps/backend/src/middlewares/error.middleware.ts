import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiResponse } from '../utils';
import { logger, env } from '../config';

/**
 * Global Error Handler Middleware
 * Catches all errors and returns standardized response
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log the error
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      logger.error('Server error:', err);
    } else {
      logger.warn(`Client error: ${err.message}`);
    }
  } else {
    logger.error('Unhandled error:', err);
  }

  // Handle ApiError
  if (err instanceof ApiError) {
    ApiResponse.error(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors: Record<string, string> = {};
    const mongooseError = err as unknown as { errors: Record<string, { message: string }> };
    Object.keys(mongooseError.errors).forEach((key) => {
      errors[key] = mongooseError.errors[key].message;
    });
    ApiResponse.error(res, 'Validation failed', 400, errors);
    return;
  }

  // Handle Mongoose duplicate key errors
  if (err.name === 'MongoServerError' && (err as unknown as { code: number }).code === 11000) {
    ApiResponse.error(res, 'Duplicate entry found', 409);
    return;
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    ApiResponse.error(res, 'Invalid ID format', 400);
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    ApiResponse.error(res, 'Invalid token', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    ApiResponse.error(res, 'Token expired', 401);
    return;
  }

  // Default to 500 internal server error
  const message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;

  ApiResponse.error(res, message, 500);
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (_req: Request, res: Response): void => {
  ApiResponse.error(res, 'Route not found', 404);
};

export default errorHandler;
