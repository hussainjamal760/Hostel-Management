import { Router } from 'express';
import notificationController from './notification.controller';
import { authenticate, authorize } from '../../middlewares';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.getMyNotifications);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);

router.post(
  '/',
  authorize('ADMIN'),
  notificationController.sendNotification
);

export default router;
