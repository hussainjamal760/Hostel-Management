import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required').max(200),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  pincode: z
    .string()
    .regex(/^[0-9]{5}$/, 'Invalid Pakistani postal code (5 digits)'),
  coordinates: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
});

export const createHostelSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  code: z
    .string()
    .length(4, 'Hostel code must be exactly 4 characters')
    .regex(/^[A-Z0-9]+$/, 'Code must be uppercase alphanumeric')
    .optional(),
  address: addressSchema,
  amenities: z.array(z.string()).optional(),
  monthlyRent: z.number().positive('Monthly rent must be positive'),
  securityDeposit: z.number().nonnegative('Security deposit cannot be negative'),
});

export const updateHostelSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  address: addressSchema.partial().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  monthlyRent: z.number().positive().optional(),
  securityDeposit: z.number().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

export type CreateHostelInput = z.infer<typeof createHostelSchema>;
export type UpdateHostelInput = z.infer<typeof updateHostelSchema>;
