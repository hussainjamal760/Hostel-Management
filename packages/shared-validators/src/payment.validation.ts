import { z } from 'zod';

export const createPaymentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  amount: z.number().positive('Amount must be positive'),
  paymentType: z.enum(['RENT', 'SECURITY', 'FINE', 'OTHER']),
  paymentMethod: z.enum(['CASH', 'JAZZCASH', 'EASYPAISA', 'BANK_TRANSFER', '1BILL']),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2024).max(2100),
  transactionId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export const updatePaymentSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).optional(),
  transactionId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
