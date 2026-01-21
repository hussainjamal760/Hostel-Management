export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
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
  createdAt: Date;
  updatedAt: Date;
}
