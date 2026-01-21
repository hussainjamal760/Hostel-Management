import { z } from 'zod';

/**
 * Reward Validation Schemas
 */

export const createRewardSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  points: z.number().int().nonzero('Points cannot be zero'),
  reason: z.string().min(5, 'Reason must be at least 5 characters').max(500),
  category: z.enum(['CLEANLINESS', 'PUNCTUALITY', 'BEHAVIOR', 'PARTICIPATION', 'PENALTY']),
});

export type CreateRewardInput = z.infer<typeof createRewardSchema>;
