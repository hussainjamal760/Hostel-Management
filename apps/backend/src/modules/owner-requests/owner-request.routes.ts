import { Router } from 'express';
import ownerRequestController from './owner-request.controller';
import { authenticate, authorize } from '../../middlewares';

const router = Router();


router.post('/', authenticate, ownerRequestController.createRequest);
router.get('/my', authenticate, ownerRequestController.getMyRequests);
router.get('/my/latest', authenticate, ownerRequestController.getMyLatestRequest);
router.get('/pending/count', authenticate, authorize('ADMIN'), ownerRequestController.getPendingCount);
router.get('/pending', authenticate, authorize('ADMIN'), ownerRequestController.getPendingRequests);
router.get('/', authenticate, authorize('ADMIN'), ownerRequestController.getAllRequests);
router.put('/:id/review', authenticate, authorize('ADMIN'), ownerRequestController.reviewRequest);

export default router;
