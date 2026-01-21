import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  phone: z
    .string()
    .regex(/^(\+92|0)?[0-9]{10}$/, 'Invalid Pakistani phone number')
    .optional(),
  role: z.enum(['ADMIN', 'OWNER', 'MANAGER', 'STUDENT']),
  hostelId: z.string().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  phone: z
    .string()
    .regex(/^(\+92|0)?[0-9]{10}$/, 'Invalid Pakistani phone number')
    .optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  fcmToken: z.string().optional(),
});

export const updateFcmTokenSchema = z.object({
  fcmToken: z.string().min(1, 'FCM token is required'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateFcmTokenInput = z.infer<typeof updateFcmTokenSchema>;
