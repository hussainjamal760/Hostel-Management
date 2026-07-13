import { Router } from 'express';
import paymentCardController from './payment-card.controller';
import { authenticate, authorize } from '../../middlewares';

const router = Router();

// Only owners should manage their payment cards
router.use(authenticate);
router.use(authorize('OWNER'));

router.post('/', paymentCardController.createPaymentCard);
router.get('/', paymentCardController.getPaymentCards);
router.delete('/:id', paymentCardController.deletePaymentCard);

export default router;
