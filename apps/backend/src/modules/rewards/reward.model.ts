import mongoose, { Schema, Document } from 'mongoose';
import { IReward } from '@hostelite/shared-types';
import { REWARD_CATEGORIES } from '@hostelite/shared-constants';

/**
 * Reward Document Interface
 */
export interface IRewardDocument extends Omit<IReward, '_id'>, Document {}

/**
 * Reward Schema
 */
const rewardSchema = new Schema<IRewardDocument>(
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
    points: {
      type: Number,
      required: [true, 'Points are required'],
      validate: {
        validator: (v: number) => v !== 0,
        message: 'Points cannot be zero',
      },
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      minlength: [5, 'Reason must be at least 5 characters'],
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    category: {
      type: String,
      enum: Object.values(REWARD_CATEGORIES),
      required: [true, 'Category is required'],
    },
    awardedBy: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: [true, 'Awarder is required'],
    },
    awardedAt: {
      type: Date,
      default: Date.now,
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
rewardSchema.index({ studentId: 1, awardedAt: -1 });
rewardSchema.index({ hostelId: 1, category: 1 });
rewardSchema.index({ hostelId: 1, awardedAt: -1 });

/**
 * Reward Model
 */
export const Reward = mongoose.model<IRewardDocument>('Reward', rewardSchema);

export default Reward;
