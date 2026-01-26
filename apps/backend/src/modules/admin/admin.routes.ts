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

router.post(
  '/maintenance/fix-db',
  authenticate,
  authorize('ADMIN'),
  adminController.fixDatabase
);

export default router;
