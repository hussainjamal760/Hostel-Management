import mongoose, { Schema, Document } from 'mongoose';
import { IHostel } from '@hostelite/shared-types';

export interface IHostelDocument extends Omit<IHostel, '_id'>, Document {}

const addressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },


    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { _id: false }
);

const hostelSchema = new Schema<IHostelDocument>(
  {
    name: {
      type: String,
      required: [true, 'Hostel name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      minlength: [10, 'Phone number must be at least 10 characters'],
      maxlength: [15, 'Phone number cannot exceed 15 characters'],
    },
    code: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [4, 'Code must be exactly 4 characters'],
      maxlength: [4, 'Code must be exactly 4 characters'],
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      index: true,
    },
    address: {
      type: addressSchema,
      required: [true, 'Address is required'],
    },
    totalRooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalBeds: {
      type: Number,
      default: 0,
      min: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    monthlyRent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [0, 'Rent cannot be negative'],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    paymentDetails: {
      bankName: { type: String },
      accountTitle: { type: String },
      accountNumber: { type: String },
      instructions: { type: String },
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

hostelSchema.index({ ownerId: 1, isActive: 1 });
hostelSchema.index({ 'address.city': 1 });

hostelSchema.pre('save', async function (this: IHostelDocument, next) {
  if (!this.code) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.code = code;
  }
  next();
});

export const Hostel = mongoose.model<IHostelDocument>('Hostel', hostelSchema);

export default Hostel;
