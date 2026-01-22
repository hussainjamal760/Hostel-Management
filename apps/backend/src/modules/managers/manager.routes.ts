import { Router } from 'express';
import { managerController } from './manager.controller';
import { authenticate, authorize, validate } from '../../middlewares';
import { createManagerSchema, updateManagerSchema } from '@hostelite/shared-validators';

const router = Router();

// Protect all routes
router.use(authenticate);

router.post(
  '/',
  authorize('OWNER'),
  validate(createManagerSchema),
  managerController.createManager
);

router.get(
  '/',
  authorize('OWNER', 'MANAGER'),
  managerController.getAllManagers
);

router.get(
  '/:id',
  authorize('OWNER', 'MANAGER'),
  managerController.getManager
);

router.patch(
  '/:id',
  authorize('OWNER'),
  validate(updateManagerSchema),
  managerController.updateManager
);

router.delete(
  '/:id',
  authorize('OWNER'),
  managerController.deleteManager
);

export const managerRoutes = router;
