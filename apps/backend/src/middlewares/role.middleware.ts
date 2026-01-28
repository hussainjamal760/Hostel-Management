import { Request, Response, NextFunction } from 'express';
import { Role } from '@hostelite/shared-types';
import { hasPermission } from '@hostelite/shared-constants';
import { ApiError } from '../utils';

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


export const requireHostelAccess = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    return next(ApiError.unauthorized('Authentication required'));
  }

  if (req.user.role === 'ADMIN') {
    return next();
  }
  const requestedHostelId = req.params.hostelId || req.query.hostelId;

  if (requestedHostelId && req.user.hostelId !== requestedHostelId) {
    return next(ApiError.forbidden('Access denied for this hostel'));
  }

  next();
};

export default authorize;
