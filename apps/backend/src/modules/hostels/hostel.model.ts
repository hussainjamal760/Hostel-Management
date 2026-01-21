import mongoose, { Schema, Document } from 'mongoose';
import { IHostel } from '@hostelite/shared-types';

/**
 * Hostel Document Interface
 */
export interface IHostelDocument extends Omit<IHostel, '_id'>, Document {}

/**
 * Address Sub-Schema
 */
const addressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { _id: false }
);

/**
 * Hostel Schema
 */
const hostelSchema = new Schema<IHostelDocument>(
  {
    name: {
      type: String,
      required: [true, 'Hostel name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Hostel code is required'],
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
      required: [true, 'Owner is required'],
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
    securityDeposit: {
      type: Number,
      default: 0,
      min: [0, 'Security deposit cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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
hostelSchema.index({ ownerId: 1, isActive: 1 });
hostelSchema.index({ 'address.city': 1 });

/**
 * Generate unique hostel code
 */
hostelSchema.pre('save', async function (this: IHostelDocument, next) {
  if (!this.code) {
    // Generate a random 4-character code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.code = code;
  }
  next();
});

/**
 * Hostel Model
 */
export const Hostel = mongoose.model<IHostelDocument>('Hostel', hostelSchema);

export default Hostel;
