import mongoose, { Schema, Document } from 'mongoose';
import {
  IComplaint,
} from '@hostelite/shared-types';
import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_PRIORITIES,
  COMPLAINT_STATUS,
} from '@hostelite/shared-constants';

/**
 * Complaint Document Interface
 */
export interface IComplaintDocument extends Omit<IComplaint, '_id' | 'studentId' | 'hostelId' | 'assignedTo'>, Document {
  studentId: mongoose.Types.ObjectId;
  hostelId: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
}

/**
 * Complaint Schema
 */
const complaintSchema = new Schema<IComplaintDocument>(
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
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      enum: Object.values(COMPLAINT_CATEGORIES),
      required: [true, 'Category is required'],
    },
    priority: {
      type: String,
      enum: Object.values(COMPLAINT_PRIORITIES),
      default: COMPLAINT_PRIORITIES.MEDIUM,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(COMPLAINT_STATUS),
      default: COMPLAINT_STATUS.OPEN,
      index: true,
    },
    attachments: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => v.length <= 5,
        message: 'Maximum 5 attachments allowed',
      },
    },
    assignedTo: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
    },
    resolution: {
      type: String,
      maxlength: [2000, 'Resolution cannot exceed 2000 characters'],
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: { __v?: number }) {
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Indexes
complaintSchema.index({ hostelId: 1, status: 1 });
complaintSchema.index({ hostelId: 1, priority: 1 });
complaintSchema.index({ studentId: 1, createdAt: -1 });
complaintSchema.index({ assignedTo: 1, status: 1 });

/**
 * Complaint Model
 */
export const Complaint = mongoose.model<IComplaintDocument>('Complaint', complaintSchema);

export default Complaint;
