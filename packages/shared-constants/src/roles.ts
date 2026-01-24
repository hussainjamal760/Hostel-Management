/**
 * User Roles
 * Defines the hierarchy: ADMIN > OWNER > MANAGER > STUDENT
 */

export const ROLES = {
  ADMIN: 'ADMIN',
  OWNER: 'OWNER',
  MANAGER: 'MANAGER',
  STUDENT: 'STUDENT',
  CLIENT: 'CLIENT',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Role hierarchy for permission checks
 * Higher index = higher privilege
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  CLIENT: 0,
  STUDENT: 1,
  MANAGER: 2,
  OWNER: 3,
  ADMIN: 4,
};

/**
 * Check if a role has higher or equal privilege than another
 */
export const hasPermission = (userRole: Role, requiredRole: Role): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};
