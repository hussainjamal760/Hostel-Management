import mongoose, { Schema, Document } from 'mongoose';

export interface IManager extends Document {
  name: string;
  phoneNumber: string;
  cnic: string;
  salary: number;
  avatar?: string;
  cnicImage?: string;
  hostelId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const managerSchema = new Schema<IManager>(
  {
    name: {
      type: String,
      required: [true, 'Manager name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      minlength: [10, 'Phone number must be at least 10 characters'],
      maxlength: [15, 'Phone number cannot exceed 15 characters'],
    },
    cnic: {
      type: String,
      required: [true, 'CNIC is required'],
      trim: true,
      minlength: [13, 'CNIC must be at least 13 digits'],
      maxlength: [15, 'CNIC cannot exceed 15 characters'],
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [0, 'Salary cannot be negative'],
    },
    avatar: {
      type: String,
      default: '',
    },
    cnicImage: {
      type: String,
      default: '',
    },
    hostelId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Hostel',
      required: [true, 'Hostel ID is required'],
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: [true, 'Owner ID is required'],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Index for efficiently querying managers by owner and hostel
managerSchema.index({ ownerId: 1, hostelId: 1 });

export const Manager = mongoose.model<IManager>('Manager', managerSchema);
export default Manager;
