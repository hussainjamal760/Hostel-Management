import { FilterQuery } from 'mongoose';
import { Notification, INotificationDocument } from './notification.model';
import { ApiError } from '../../utils';
import { INotificationCreate } from '@hostelite/shared-types';

export class NotificationService {
  async createNotification(data: INotificationCreate) {
    const notification = await Notification.create({
      ...data,
      isRead: false
    });
    return notification;
  }

  async getUserNotifications(
    userId: string,
    query: {
      isRead?: boolean;
      type?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const { isRead, type, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<INotificationDocument> = { userId };
    
    if (typeof isRead === 'boolean') filter.isRead = isRead; 
    if (type) filter.type = type;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });
    const totalPages = Math.ceil(total / limit);

    return {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async markAsRead(id: string, userId: string) {
    const notification = await Notification.findOne({ _id: id, userId });
    if (!notification) {
      throw ApiError.notFound('Notification not found');
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return notification;
  }

  async markAllAsRead(userId: string) {
    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
    return { success: true };
  }
}

export default new NotificationService();
