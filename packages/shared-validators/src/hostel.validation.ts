import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required').max(200),
  city: z.string().min(1, 'City is required').max(100),


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
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits'),
  code: z
    .string()
    .length(4, 'Hostel code must be exactly 4 characters')
    .regex(/^[A-Z0-9]+$/, 'Code must be uppercase alphanumeric')
    .optional(),
  address: addressSchema,
  amenities: z.array(z.string()).optional(),
  monthlyRent: z.number().positive('Monthly rent must be positive'),

});

export const updateHostelSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phoneNumber: z.string().min(10).max(15).optional(),
  address: addressSchema.partial().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  monthlyRent: z.number().positive().optional(),

  isActive: z.boolean().optional(),
  paymentDetails: z.object({
    bankName: z.string().optional(),
    accountTitle: z.string().optional(),
    accountNumber: z.string().optional(),
    instructions: z.string().optional(),
  }).optional(),
});

export type CreateHostelInput = z.infer<typeof createHostelSchema>;
export type UpdateHostelInput = z.infer<typeof updateHostelSchema>;
