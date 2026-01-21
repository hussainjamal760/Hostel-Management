import { Router } from 'express';
import { authRoutes } from '../modules/auth';
import { userRoutes } from '../modules/users';
import { API_VERSION } from '@hostelite/shared-constants';

const router = Router();

/**
 * API Routes
 * All routes are prefixed with /api/v1
 */

// Health check
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: API_VERSION,
  });
});

// Auth routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
// router.use('/hostels', hostelRoutes);
// router.use('/rooms', roomRoutes);
// router.use('/students', studentRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/rewards', rewardRoutes);
// router.use('/complaints', complaintRoutes);
// router.use('/notifications', notificationRoutes);

export default router;
