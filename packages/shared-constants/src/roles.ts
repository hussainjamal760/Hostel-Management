/**
 * User Roles
 * Defines the hierarchy: ADMIN > OWNER > MANAGER > STUDENT
 */

export const ROLES = {
  ADMIN: 'ADMIN',
  OWNER: 'OWNER',
  MANAGER: 'MANAGER',
  STUDENT: 'STUDENT',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Role hierarchy for permission checks
 * Higher index = higher privilege
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  STUDENT: 0,
  MANAGER: 1,
  OWNER: 2,
  ADMIN: 3,
};

/**
 * Check if a role has higher or equal privilege than another
 */
export const hasPermission = (userRole: Role, requiredRole: Role): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};
