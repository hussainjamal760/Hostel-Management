import { Router } from 'express';
import complaintController from './complaint.controller';
import { authenticate, authorize, validate } from '../../middlewares';
import { createComplaintSchema, updateComplaintSchema } from '@hostelite/shared-validators';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize('STUDENT'),
  validate(createComplaintSchema),
  complaintController.createComplaint
);

router.get(
  '/',
  authorize('ADMIN', 'OWNER', 'MANAGER', 'STUDENT'),
  complaintController.getAllComplaints
);

router.get(
  '/:id',
  authorize('ADMIN', 'OWNER', 'MANAGER', 'STUDENT'),
  complaintController.getComplaintById
);

router.patch(
  '/:id',
  authorize('ADMIN', 'OWNER', 'MANAGER'),
  validate(updateComplaintSchema),
  complaintController.updateComplaint
);

router.delete(
  '/:id',
  authorize('ADMIN', 'OWNER'),
  complaintController.deleteComplaint
);

export default router;
