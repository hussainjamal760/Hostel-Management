import { z } from 'zod';

const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Emergency contact name is required'),
  relation: z.string().min(1, 'Relation is required'),
  phone: z.string().regex(/^(\+92|0)?[0-9]{10}$/, 'Invalid phone number'),
});

export const createStudentSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  bedNumber: z.string().min(1, 'Bed number is required'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  fatherName: z.string().min(2, "Father's name must be at least 2 characters").max(100),
  dateOfBirth: z.coerce.date(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z
    .string()
    .regex(/^(A|B|AB|O)[+-]$/, 'Invalid blood group')
    .optional(),
  emergencyContact: emergencyContactSchema,
  permanentAddress: z.string().min(10, 'Address must be at least 10 characters'),
  institution: z.string().max(200).optional(),
  course: z.string().max(100).optional(),
  // Identity & Contact
  cnic: z.string().regex(/^[0-9]{13}$/, 'Invalid CNIC format (e.g., 12345-1234567-1)'),
  fatherPhone: z.string().regex(/^(\+92|0)?[0-9]{10}$/, 'Invalid phone number'),
  fatherCnic: z.string().regex(/^[0-9]{13}$/, 'Invalid CNIC format'),
  
  // Financials
  monthlyFee: z.number().min(0, 'Fee cannot be negative'),
  securityDeposit: z.number().min(0, 'Security deposit cannot be negative'),
  
  // Dates
  agreementDate: z.coerce.date(),
  joinDate: z.coerce.date().optional(),
  
  // User Account (Consumed by UserService)
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(\+92|0)?[0-9]{10}$/, 'Invalid phone number'),
});

export const updateStudentSchema = z.object({
  roomId: z.string().optional(),
  bedNumber: z.string().optional(),
  fullName: z.string().min(2).max(100).optional(),
  fatherName: z.string().min(2).max(100).optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  bloodGroup: z
    .string()
    .regex(/^(A|B|AB|O)[+-]$/)
    .optional(),
  emergencyContact: emergencyContactSchema.partial().optional(),
  permanentAddress: z.string().min(10).optional(),
  institution: z.string().max(200).optional(),
  course: z.string().max(100).optional(),
  expectedLeaveDate: z.coerce.date().optional(),
  idProof: z.string().url().optional(),
  photo: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^(\+92|0)?[0-9]{10}$/).optional(),
  feeStatus: z.enum(['PAID', 'PARTIAL', 'DUE', 'OVERDUE']).optional(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
