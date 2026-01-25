/**
 * Entity Status Constants
 */

export const FEE_STATUS = {
  PAID: 'PAID',
  PARTIAL: 'PARTIAL',
  DUE: 'DUE',
  OVERDUE: 'OVERDUE',
} as const;

export const PAYMENT_STATUS = {
  UNPAID: 'UNPAID', // Initial state when invoice is generated
  PENDING: 'PENDING', // Proof uploaded, waiting for verification (was PENDING/UNDER_REVIEW)
  COMPLETED: 'COMPLETED', // Verified and Paid
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  OVERDUE: 'OVERDUE', // Explicit overdue status
} as const;

export const COMPLAINT_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;

export const ROOM_TYPES = {
  SINGLE: 'SINGLE',
  DOUBLE: 'DOUBLE',
  TRIPLE: 'TRIPLE',
  DORMITORY: 'DORMITORY',
} as const;

export const GENDERS = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;
