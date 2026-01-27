import mongoose, { Schema, Document } from 'mongoose';

export interface IExpenseDocument extends Document {
  hostelId: mongoose.Types.ObjectId;
  managerId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  date: Date;
  category: 'UTILITIES' | 'MAINTENANCE' | 'SALARY' | 'MISC' | 'FOOD' | 'INTERNET' | 'RENT';
  receiptUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpenseDocument>(
  {
    hostelId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Hostel',
      required: true,
      index: true,
    },
    managerId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Manager',
      required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    category: {
      type: String,
      enum: ['UTILITIES', 'MAINTENANCE', 'SALARY', 'MISC', 'FOOD', 'INTERNET', 'RENT'],
      required: true,
    },
    receiptUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Expense = mongoose.model<IExpenseDocument>('Expense', expenseSchema);
export default Expense;
