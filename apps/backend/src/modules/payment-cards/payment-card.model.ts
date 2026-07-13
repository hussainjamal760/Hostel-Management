import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentCardDocument extends Document {
  userId: mongoose.Types.ObjectId;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentCardSchema = new Schema<IPaymentCardDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    bankName: {
      type: String,
      required: [true, 'Bank name is required'],
      trim: true,
    },
    accountTitle: {
      type: String,
      required: [true, 'Account title is required'],
      trim: true,
    },
    accountNumber: {
      type: String,
      required: [true, 'Account number is required'],
      trim: true,
    },
    instructions: {
      type: String,
      trim: true,
      default: '',
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

export const PaymentCard = mongoose.model<IPaymentCardDocument>('PaymentCard', paymentCardSchema);
export default PaymentCard;
