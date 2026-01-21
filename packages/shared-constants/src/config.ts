export const API_VERSION = 'v1';

export const API_ROUTES = {
  AUTH: '/auth',
  USERS: '/users',
  ADMIN: '/admin',
  HOSTELS: '/hostels',
  ROOMS: '/rooms',
  STUDENTS: '/students',
  PAYMENTS: '/payments',
  COMPLAINTS: '/complaints',
  NOTIFICATIONS: '/notifications',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const TOKEN_EXPIRY = {
  ACCESS: '15m',
  REFRESH: '7d',
} as const;

export const PASSWORD_CONFIG = {
  MIN_LENGTH: 6,
  MAX_LENGTH: 50,
  SALT_ROUNDS: 12,
} as const;
