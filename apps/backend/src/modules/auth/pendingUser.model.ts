import mongoose, { Schema, Document } from 'mongoose';
import { SignupInput } from '@hostelite/shared-validators';

export interface IPendingUser extends Omit<SignupInput, 'password'>, Document {
  passwordHash: string;
  verificationCode: string;
  createdAt: Date;
}

const pendingUserSchema = new Schema<IPendingUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // Automatically delete after 10 minutes (600 seconds)
    },
  },
  {
    timestamps: true,
  }
);

// We keep a unique index on email in this collection so they can only have one pending signup
pendingUserSchema.index({ email: 1 }, { unique: true });

export const PendingUser = mongoose.model<IPendingUser>('PendingUser', pendingUserSchema);
