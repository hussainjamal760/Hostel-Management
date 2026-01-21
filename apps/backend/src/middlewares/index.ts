/**
 * Middlewares Module Index
 * Central export for all middlewares
 */

export { authenticate, optionalAuth } from './auth.middleware';
export { authorize, requireMinRole, requireHostelAccess } from './role.middleware';
export { validate, validateRequest } from './validate.middleware';
export { generalLimiter, authLimiter, createUserLimiter } from './rateLimiter.middleware';
export { errorHandler, notFoundHandler } from './error.middleware';
