import { Router } from 'express';
import paymentController from './payment.controller';
import { authenticate, authorize, validate } from '../../middlewares';
import { createPaymentSchema, updatePaymentSchema } from '@hostelite/shared-validators';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize('ADMIN', 'OWNER', 'MANAGER'),
  validate(createPaymentSchema),
  paymentController.createPayment
);

router.get(
  '/',
  authorize('ADMIN', 'OWNER', 'MANAGER'),
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

export default router;
