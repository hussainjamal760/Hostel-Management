/**
 * Hostelite HMS - Shared Validators
 * Central export for all Zod validation schemas
 */

export * from './auth.validation';
export * from './user.validation';
export * from './hostel.validation';
export * from './room.validation';
export * from './student.validation';
export * from './payment.validation';
export * from './reward.validation';
export * from './complaint.validation';
export * from './common.validation';

// Re-export zod for convenience
export { z } from 'zod';
