import { Router } from 'express';
import hostelPaymentController from './hostel-payment.controller';
import { authenticate, authorize } from '../../middlewares';

const router = Router();

// Apply Auth globally to these routes
router.use(authenticate);
router.use(authorize('ADMIN'));

router.post('/generate', hostelPaymentController.generateInvoice);
router.patch('/:id/pay', hostelPaymentController.markAsPaid);
router.patch('/hostels/:hostelId/rate', hostelPaymentController.updateRate);
router.get('/pending', hostelPaymentController.getPending);
router.get('/stats', hostelPaymentController.getAdminStats);

export default router;
