import { Router } from 'express';
import paymentController from './payment.controller';
import { authenticate, authorize, validate } from '../../middlewares';
import { createPaymentSchema, updatePaymentSchema } from '@hostelite/shared-validators';
import { upload } from '../../middlewares/upload.middleware';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize('ADMIN', 'OWNER', 'MANAGER', 'STUDENT'),
  validate(createPaymentSchema),
  paymentController.createPayment
);

router.get(
  '/',
  authorize('ADMIN', 'OWNER', 'MANAGER', 'STUDENT'),
  paymentController.getAllPayments
);

router.get(
  '/:id',
  authorize('ADMIN', 'OWNER', 'MANAGER'),
  paymentController.getPaymentById
);

router.patch(
  '/:id',
  authorize('ADMIN', 'OWNER', 'MANAGER'),
  validate(updatePaymentSchema),
  paymentController.updatePayment
);

// Manual Payment Routes

router.post(
    '/:id/proof',
    authorize('STUDENT'),
    upload.single('proof'), // Middleware handles file
    paymentController.submitPaymentProof
);

router.post(
    '/:id/verify',
    authorize('ADMIN', 'OWNER', 'MANAGER'),
    paymentController.verifyPayment
);

export default router;
