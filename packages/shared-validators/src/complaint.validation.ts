import { z } from 'zod';

/**
 * Complaint Validation Schemas
 */

export const createComplaintSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  category: z.enum(['MAINTENANCE', 'FOOD', 'SECURITY', 'CLEANLINESS', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional().default('MEDIUM'),
  attachments: z.array(z.string().url()).max(5, 'Maximum 5 attachments allowed').optional(),
});

export const updateComplaintSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedTo: z.string().optional(),
  resolution: z.string().max(2000).optional(),
});

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;
export type UpdateComplaintInput = z.infer<typeof updateComplaintSchema>;
