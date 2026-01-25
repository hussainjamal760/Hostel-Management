export type PaymentStatus = 'UNPAID' | 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'OVERDUE';
export type PaymentMethod =
  | 'CASH'
  | 'JAZZCASH'
  | 'EASYPAISA'
  | 'BANK_TRANSFER'
  | '1BILL';
export type PaymentType = 'RENT' | 'SECURITY' | 'FINE' | 'OTHER';

export interface IPayment {
  _id: string;
  studentId: string;
  hostelId: string;
  amount: number;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  gatewayResponse?: object;
  month: number;
  year: number;
  status: PaymentStatus;
  paidAt?: Date;
  collectedBy: string;
  receiptNumber: string;
  notes?: string;
  paymentProof?: string;
  isVerified?: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
