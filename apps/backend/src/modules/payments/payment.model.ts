import mongoose, { Schema, Document } from 'mongoose';
import { IPayment } from '@hostelite/shared-types';
import { PAYMENT_TYPES, PAYMENT_METHODS, PAYMENT_STATUS } from '@hostelite/shared-constants';

/**
 * Payment Document Interface
 */
export interface IPaymentDocument extends Omit<IPayment, '_id'>, Document {}

/**
 * Payment Schema
 */
const paymentSchema = new Schema<IPaymentDocument>(
  {
    studentId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Student',
      required: [true, 'Student is required'],
      index: true,
    },
    hostelId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Hostel',
      required: [true, 'Hostel is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    paymentType: {
      type: String,
      enum: Object.values(PAYMENT_TYPES),
      required: [true, 'Payment type is required'],
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      required: [true, 'Payment method is required'],
    },
    transactionId: {
      type: String,
      sparse: true,
      index: true,
    },
    paymentProof: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    gatewayResponse: {
      type: Schema.Types.Mixed,
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: 2024,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.UNPAID,
      index: true,
    },
    paidAt: {
      type: Date,
    },
    collectedBy: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      // required: [true, 'Collector is required'], // Relaxed for manual flow
    },
    receiptNumber: {
      type: String,
      unique: true,
      required: [true, 'Receipt number is required'],
      index: true,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Indexes
paymentSchema.index({ studentId: 1, month: 1, year: 1 });
paymentSchema.index({ hostelId: 1, status: 1 });
paymentSchema.index({ hostelId: 1, createdAt: -1 });

/**
 * Generate receipt number before save
 */
paymentSchema.pre('save', async function (this: IPaymentDocument, next) {
  if (!this.receiptNumber) {
    const date = new Date();
    const prefix = `RCP-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const count = await mongoose.model('Payment').countDocuments({
      receiptNumber: { $regex: `^${prefix}` },
    });
    this.receiptNumber = `${prefix}-${(count + 1).toString().padStart(5, '0')}`;
  }
  next();
});

/**
 * Payment Model
 */
export const Payment = mongoose.model<IPaymentDocument>('Payment', paymentSchema);

export default Payment;
