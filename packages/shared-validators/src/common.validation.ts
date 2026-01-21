import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional(),
});

export const mongoIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId'),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
export type MongoIdInput = z.infer<typeof mongoIdSchema>;
