import { Router } from 'express';
import { authRoutes } from '../modules/auth';
import { userRoutes } from '../modules/users';
import { hostelRoutes } from '../modules/hostels';
import { roomRoutes } from '../modules/rooms';
import { studentRoutes } from '../modules/students';
import { paymentRoutes } from '../modules/payments';
import { complaintRoutes } from '../modules/complaints';
import { notificationRoutes } from '../modules/notifications';
import { adminRoutes } from '../modules/admin';
import { ownerRequestRoutes } from '../modules/owner-requests';
import uploadRoutes from '../modules/upload/upload.routes';
import { managerRoutes } from '../modules/managers/manager.routes';
import hostelPaymentRoutes from '../modules/payments/hostel-payment.routes';
import { API_VERSION } from '@hostelite/shared-constants';

import expenseRoutes from '../modules/expenses/expense.routes';

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
router.use('/admin', adminRoutes);
router.use('/owner-requests', ownerRequestRoutes);
router.use('/upload', uploadRoutes);
router.use('/managers', managerRoutes);
router.use('/admin-payments', hostelPaymentRoutes);
router.use('/expenses', expenseRoutes);

export default router;
