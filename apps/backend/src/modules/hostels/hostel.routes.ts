import { Router } from 'express';
import hostelController from './hostel.controller';
import { authenticate, authorize, validate } from '../../middlewares';
import { createHostelSchema, updateHostelSchema } from '@hostelite/shared-validators';

const router = Router();
// Force restart 2

router.use(authenticate);

router.post(
  '/',
  authorize('ADMIN', 'OWNER'),
  validate(createHostelSchema),
  hostelController.createHostel
);

router.get(
  '/',
  authorize('ADMIN', 'OWNER'),
  hostelController.getAllHostels
);

router.get(
  '/stats',
  authorize('ADMIN', 'OWNER'),
  hostelController.getStats
);

router.get(
  '/:id',
  authorize('ADMIN', 'OWNER', 'MANAGER', 'STUDENT'),
  hostelController.getHostelById
);

router.patch(
  '/:id',
  authorize('ADMIN', 'OWNER'),
  validate(updateHostelSchema),
  hostelController.updateHostel
);

router.delete(
  '/:id',
  authorize('ADMIN', 'OWNER'),
  hostelController.deleteHostel
);

export default router;
