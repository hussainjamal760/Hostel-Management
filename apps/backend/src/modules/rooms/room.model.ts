import mongoose, { Schema, Document } from 'mongoose';
import { IRoom } from '@hostelite/shared-types';
import { ROOM_TYPES } from '@hostelite/shared-constants';

/**
 * Room Document Interface
 */
export interface IRoomDocument extends Omit<IRoom, '_id'>, Document {}

/**
 * Room Schema
 */
const roomSchema = new Schema<IRoomDocument>(
  {
    hostelId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Hostel',
      required: [true, 'Hostel is required'],
      index: true,
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
      maxlength: [20, 'Room number cannot exceed 20 characters'],
    },
    floor: {
      type: Number,
      required: [true, 'Floor is required'],
      min: [0, 'Floor cannot be negative'],
    },
    roomType: {
      type: String,
      enum: Object.values(ROOM_TYPES),
      required: [true, 'Room type is required'],
    },
    totalBeds: {
      type: Number,
      required: [true, 'Total beds is required'],
      min: [1, 'Must have at least 1 bed'],
    },
    occupiedBeds: {
      type: Number,
      default: 0,
      min: [0, 'Occupied beds cannot be negative'],
    },
    rent: {
      type: Number,
      required: [true, 'Rent is required'],
      min: [0, 'Rent cannot be negative'],
    },
    amenities: {
      type: [String],
      default: [],
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
      virtuals: true,
      transform(_doc, ret) {
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Compound unique index for room number within hostel
roomSchema.index({ hostelId: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ hostelId: 1, floor: 1 });
roomSchema.index({ hostelId: 1, isActive: 1 });

/**
 * Virtual for available beds
 */
roomSchema.virtual('availableBeds').get(function () {
  return this.totalBeds - this.occupiedBeds;
});

/**
 * Virtual for occupancy rate
 */
roomSchema.virtual('occupancyRate').get(function () {
  return this.totalBeds > 0 ? (this.occupiedBeds / this.totalBeds) * 100 : 0;
});

/**
 * Room Model
 */
export const Room = mongoose.model<IRoomDocument>('Room', roomSchema);

export default Room;
