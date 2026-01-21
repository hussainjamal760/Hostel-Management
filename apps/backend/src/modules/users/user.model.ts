import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser, Role } from '@hostelite/shared-types';
import { ROLES } from '@hostelite/shared-constants';

/**
 * User Document Interface
 */
export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User Model Interface (for statics)
 */
export interface IUserModel extends Model<IUserDocument> {
  findByUsername(username: string): Promise<IUserDocument | null>;
  countByRole(role: Role, hostelId?: string): Promise<number>;
}

/**
 * User Schema
 */
const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true, // Allows multiple null values
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Don't include in queries by default
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: [true, 'Role is required'],
      index: true,
    },
    hostelId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Hostel',
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLoginAt: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    fcmToken: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete (ret as any).password;
        delete (ret as any).refreshToken;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Indexes for common queries
userSchema.index({ role: 1, hostelId: 1 });
userSchema.index({ createdBy: 1 });
userSchema.index({ isActive: 1, role: 1 });

/**
 * Static Methods
 */
userSchema.statics.findByUsername = function (username: string) {
  return this.findOne({ username: username.toLowerCase() });
};

userSchema.statics.countByRole = function (role: Role, hostelId?: string) {
  const query: { role: Role; hostelId?: mongoose.Types.ObjectId } = { role };
  if (hostelId) {
    query.hostelId = new mongoose.Types.ObjectId(hostelId);
  }
  return this.countDocuments(query);
};

/**
 * User Model
 */
export const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User;
