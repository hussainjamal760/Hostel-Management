export type NotificationType =
  | 'PAYMENT_DUE'
  | 'PAYMENT_RECEIVED'
  | 'COMPLAINT_UPDATE'
  | 'ANNOUNCEMENT'
  | 'SYSTEM';

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface INotificationCreate {
  userId: string;
  title: string;
  body: string;
  type?: NotificationType;
  data?: Record<string, any>;
}
