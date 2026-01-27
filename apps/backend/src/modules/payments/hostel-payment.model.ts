import mongoose, { Schema, Document } from 'mongoose';

export interface IHostelPaymentDocument extends Document {
    hostelId: mongoose.Types.ObjectId;
    amount: number;
    studentCount: number;
    ratePerStudent: number;
    month: number;
    year: number;
    status: 'PENDING' | 'COMPLETED';
    paidAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const hostelPaymentSchema = new Schema<IHostelPaymentDocument>(
    {
        hostelId: {
            type: Schema.Types.ObjectId as any,
            ref: 'Hostel',
            required: true,
            index: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        studentCount: {
            type: Number,
            required: true,
            min: 0
        },
        ratePerStudent: {
            type: Number,
            required: true,
            min: 0
        },
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12
        },
        year: {
            type: Number,
            required: true,
            min: 2024
        },
        status: {
            type: String,
            enum: ['PENDING', 'COMPLETED'],
            default: 'PENDING',
            index: true
        },
        paidAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate invoices for the same month/hostel
hostelPaymentSchema.index({ hostelId: 1, month: 1, year: 1 }, { unique: true });

export const HostelPayment = mongoose.model<IHostelPaymentDocument>('HostelPayment', hostelPaymentSchema);
export default HostelPayment;
