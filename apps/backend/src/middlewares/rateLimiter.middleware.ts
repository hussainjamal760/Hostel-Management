import rateLimit from 'express-rate-limit';
import { env } from '../config';
import { ApiError } from '../utils';

/**
 * General Rate Limiter
 * Applies to all routes
 */
export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests('Too many requests, please try again later'));
  },
});

/**
 * Auth Rate Limiter
 * Stricter limits for auth routes
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests('Too many login attempts, please try again later'));
  },
});

/**
 * Create User Rate Limiter
 * Limit user creation to prevent abuse
 */
export const createUserLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 users per hour
  message: 'User creation limit reached',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(ApiError.tooManyRequests('User creation limit reached, please try again later'));
  },
});

export default generalLimiter;
