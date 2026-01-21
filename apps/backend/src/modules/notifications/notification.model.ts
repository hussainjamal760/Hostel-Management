import mongoose, { Schema, Document } from 'mongoose';
import { INotification } from '@hostelite/shared-types';
import { NOTIFICATION_TYPES } from '@hostelite/shared-constants';

/**
 * Notification Document Interface
 */
export interface INotificationDocument extends Omit<INotification, '_id'>, Document {}

/**
 * Notification Schema
 */
const notificationSchema = new Schema<INotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
      trim: true,
      maxlength: [500, 'Body cannot exceed 500 characters'],
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: [true, 'Type is required'],
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
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

// Indexes
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

// Auto-delete old notifications after 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

/**
 * Notification Model
 */
export const Notification = mongoose.model<INotificationDocument>(
  'Notification',
  notificationSchema
);

export default Notification;
