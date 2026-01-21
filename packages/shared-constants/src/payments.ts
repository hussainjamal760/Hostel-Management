/**
 * Payment Method Constants
 * Includes Pakistani payment gateways
 */

export const PAYMENT_TYPES = {
  RENT: 'RENT',
  SECURITY: 'SECURITY',
  FINE: 'FINE',
  OTHER: 'OTHER',
} as const;

export const PAYMENT_METHODS = {
  CASH: 'CASH',
  JAZZCASH: 'JAZZCASH',
  EASYPAISA: 'EASYPAISA',
  BANK_TRANSFER: 'BANK_TRANSFER',
  '1BILL': '1BILL',
} as const;

export type PaymentType = (typeof PAYMENT_TYPES)[keyof typeof PAYMENT_TYPES];
export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];
