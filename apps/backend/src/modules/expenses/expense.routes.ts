import { Router } from 'express';
import expenseController from './expense.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { upload } from '../../middlewares/upload.middleware';

const router = Router();

// Manager: Create Expense (with receipt)
router.post(
  '/',
  authenticate,
  authorize('MANAGER', 'ADMIN'),
  upload.single('receipt'),
  expenseController.create
);

// All: Get Expenses
router.get(
  '/',
  authenticate,
  authorize('MANAGER', 'OWNER', 'ADMIN'),
  expenseController.getAll
);

// Owner: Update Status
router.patch(
  '/:id/status',
  authenticate,
  authorize('OWNER', 'ADMIN'),
  expenseController.updateStatus
);

// Get Stats
router.get(
  '/stats',
  authenticate,
  authorize('MANAGER', 'OWNER', 'ADMIN'),
  expenseController.getStats
);

export default router;
