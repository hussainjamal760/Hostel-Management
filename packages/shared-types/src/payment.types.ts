/**
 * Payment Types
 * Payment entity and related types
 */

export type PaymentType = 'RENT' | 'SECURITY' | 'FINE' | 'OTHER';
export type PaymentMethod = 'CASH' | 'JAZZCASH' | 'EASYPAISA' | 'BANK_TRANSFER' | '1BILL';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface IPayment {
  _id: string;
  studentId: string;
  hostelId: string;

  amount: number;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;

  // For online payments
  transactionId?: string;
  gatewayResponse?: Record<string, unknown>;

  month: number;
  year: number;

  status: PaymentStatus;
  paidAt?: Date;

  collectedBy: string;
  receiptNumber: string;
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentCreate {
  studentId: string;
  amount: number;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  month: number;
  year: number;
  transactionId?: string;
  notes?: string;
}

export interface IPaymentUpdate {
  status?: PaymentStatus;
  transactionId?: string;
  gatewayResponse?: Record<string, unknown>;
  paidAt?: Date;
  notes?: string;
}
