import mongoose, { Schema, Document } from 'mongoose';

export interface IOwnerRequestDocument extends Document {
  userId: mongoose.Types.ObjectId;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  reason: string;
  adminNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ownerRequestSchema = new Schema<IOwnerRequestDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [100, 'Business name cannot exceed 100 characters'],
    },
    businessPhone: {
      type: String,
      required: [true, 'Business phone is required'],
      trim: true,
    },
    businessAddress: {
      type: String,
      required: [true, 'Business address is required'],
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      maxlength: [1000, 'Reason cannot exceed 1000 characters'],
    },
    adminNotes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    reviewedBy: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
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

// Index for querying pending requests
ownerRequestSchema.index({ status: 1, createdAt: -1 });

export const OwnerRequest = mongoose.model<IOwnerRequestDocument>('OwnerRequest', ownerRequestSchema);

export default OwnerRequest;
