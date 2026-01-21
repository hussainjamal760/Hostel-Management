import { z } from 'zod';

/**
 * Room Validation Schemas
 */

export const createRoomSchema = z.object({
  roomNumber: z
    .string()
    .min(1, 'Room number is required')
    .max(20, 'Room number cannot exceed 20 characters'),
  floor: z.number().int().nonnegative('Floor must be a non-negative integer'),
  roomType: z.enum(['SINGLE', 'DOUBLE', 'TRIPLE', 'DORMITORY']),
  totalBeds: z.number().int().positive('Total beds must be positive'),
  rent: z.number().positive('Rent must be positive'),
  amenities: z.array(z.string()).optional(),
});

export const updateRoomSchema = z.object({
  floor: z.number().int().nonnegative().optional(),
  roomType: z.enum(['SINGLE', 'DOUBLE', 'TRIPLE', 'DORMITORY']).optional(),
  totalBeds: z.number().int().positive().optional(),
  rent: z.number().positive().optional(),
  amenities: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
