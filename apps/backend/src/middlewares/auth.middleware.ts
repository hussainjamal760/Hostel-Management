import { Request, Response, NextFunction } from 'express';
import { ApiError, verifyAccessToken, TokenPayload } from '../utils';
import { logger } from '../config';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw ApiError.unauthorized('Invalid token format');
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      logger.error('Auth middleware error:', error);
      next(ApiError.unauthorized('Invalid or expired token'));
    }
  }
};

/**
 * Optional Authentication
 * Attaches user if token is valid, but doesn't require it
 */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
      }
    }

    next();
  } catch {
    // Token invalid, but continue without user
    next();
  }
};

export default authenticate;
