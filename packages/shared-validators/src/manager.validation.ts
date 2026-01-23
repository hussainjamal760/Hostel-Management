import { z } from 'zod';

export const createManagerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
  cnic: z.string().min(13, 'CNIC must be at least 13 digits').max(15, 'CNIC cannot exceed 15 characters'),
  salary: z.number().nonnegative('Salary cannot be negative'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
    
  // Optional fields
  avatar: z.string().url().optional(),
  cnicImage: z.string().url().optional(),
  
  // IDs will usually be injected by backend or context, but good to have in type
  hostelId: z.string().optional(),
});

export const updateManagerSchema = createManagerSchema.partial();

export type CreateManagerInput = z.infer<typeof createManagerSchema>;
export type UpdateManagerInput = z.infer<typeof updateManagerSchema>;
