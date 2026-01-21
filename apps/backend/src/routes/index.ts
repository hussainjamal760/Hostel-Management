import { Router } from 'express';
import { authRoutes } from '../modules/auth';
import { userRoutes } from '../modules/users';
import { hostelRoutes } from '../modules/hostels';
import { roomRoutes } from '../modules/rooms';
import { studentRoutes } from '../modules/students';
import { paymentRoutes } from '../modules/payments';
import { complaintRoutes } from '../modules/complaints';
import { notificationRoutes } from '../modules/notifications';
import { API_VERSION } from '@hostelite/shared-constants';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: API_VERSION,
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/hostels', hostelRoutes);
router.use('/rooms', roomRoutes);
router.use('/students', studentRoutes);
router.use('/payments', paymentRoutes);
router.use('/complaints', complaintRoutes);
router.use('/notifications', notificationRoutes);

export default router;
