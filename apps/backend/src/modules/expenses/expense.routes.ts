import { Router } from 'express';
import expenseController from './expense.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { upload } from '../../middlewares/upload.middleware';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('MANAGER', 'ADMIN'),
  upload.single('receipt'),
  expenseController.create
);

router.get(
  '/',
  authenticate,
  authorize('MANAGER', 'OWNER', 'ADMIN'),
  expenseController.getAll
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('OWNER', 'ADMIN'),
  expenseController.updateStatus
);

router.get(
  '/stats',
  authenticate,
  authorize('MANAGER', 'OWNER', 'ADMIN'),
  expenseController.getStats
);

export default router;
