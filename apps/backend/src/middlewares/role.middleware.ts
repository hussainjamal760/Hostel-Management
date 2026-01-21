import { Request, Response, NextFunction } from 'express';
import { Role } from '@hostelite/shared-types';
import { hasPermission } from '@hostelite/shared-constants';
import { ApiError } from '../utils';

/**
 * Role-Based Access Control Middleware
 * Restricts access based on user roles
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    const userRole = req.user.role as Role;

    if (!allowedRoles.includes(userRole)) {
      return next(
        ApiError.forbidden(`Access denied. Required roles: ${allowedRoles.join(', ')}`)
      );
    }

    next();
  };
};

/**
 * Minimum Role Middleware
 * Allows access if user has at least the specified role level
 */
export const requireMinRole = (minRole: Role) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    const userRole = req.user.role as Role;

    if (!hasPermission(userRole, minRole)) {
      return next(
        ApiError.forbidden(`Access denied. Minimum role required: ${minRole}`)
      );
    }

    next();
  };
};

/**
 * Hostel Access Middleware
 * Ensures user can only access resources from their hostel
 */
export const requireHostelAccess = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  // ADMIN can access all hostels
  if (req.user.role === 'ADMIN') {
    return next();
  }

  // Check if hostelId is in params or query
  const requestedHostelId = req.params.hostelId || req.query.hostelId;

  if (requestedHostelId && req.user.hostelId !== requestedHostelId) {
    return next(ApiError.forbidden('Access denied for this hostel'));
  }

  next();
};

export default authorize;
