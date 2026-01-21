import { Request, Response } from 'express';
import { asyncHandler, ApiResponse } from '../../utils';
import notificationService from './notification.service';
import { INotificationCreate } from '@hostelite/shared-types';

export class NotificationController {
  getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
    const query: any = { ...req.query };
    
    if (req.query.isRead === 'true') query.isRead = true;
    if (req.query.isRead === 'false') query.isRead = false;
    
    const result = await notificationService.getUserNotifications(req.user!._id, query);
    ApiResponse.paginated(res, result.notifications, result.pagination, 'Notifications fetched successfully');
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const result = await notificationService.markAsRead(req.params.id, req.user!._id);
    ApiResponse.success(res, result, 'Notification marked as read');
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAllAsRead(req.user!._id);
    ApiResponse.success(res, null, 'All notifications marked as read');
  });

  sendNotification = asyncHandler(async (req: Request, res: Response) => {
    const data: INotificationCreate = {
        userId: req.body.userId,
        title: req.body.title,
        body: req.body.body,
        type: req.body.type || 'SYSTEM',
        data: req.body.data
    };
    
    const result = await notificationService.createNotification(data);
    ApiResponse.created(res, result, 'Notification sent successfully');
  });
}

export default new NotificationController();
