import { Router } from 'express';
import adminController from './admin.controller';
import { authenticate, authorize } from '../../middlewares';

const router = Router();

router.get(
  '/dashboard/stats',
  authenticate,
  authorize('ADMIN'),
  adminController.getDashboardStats
);

export default router;
