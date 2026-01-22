import { Router } from 'express';
import ownerRequestController from './owner-request.controller';
import { authenticate, authorize } from '../../middlewares';

const router = Router();

/**
 * Owner Request Routes
 * 
 * User routes:
 * POST /api/v1/owner-requests - Submit a request to become owner
 * GET /api/v1/owner-requests/my - Get my requests
 * GET /api/v1/owner-requests/my/latest - Get latest request status
 * 
 * Admin routes:
 * GET /api/v1/owner-requests - Get all requests (with optional status filter)
 * GET /api/v1/owner-requests/pending - Get pending requests
 * GET /api/v1/owner-requests/pending/count - Get pending count
 * PUT /api/v1/owner-requests/:id/review - Approve or reject a request
 */

// User routes
router.post('/', authenticate, ownerRequestController.createRequest);
router.get('/my', authenticate, ownerRequestController.getMyRequests);
router.get('/my/latest', authenticate, ownerRequestController.getMyLatestRequest);

// Admin routes
router.get('/pending/count', authenticate, authorize('ADMIN'), ownerRequestController.getPendingCount);
router.get('/pending', authenticate, authorize('ADMIN'), ownerRequestController.getPendingRequests);
router.get('/', authenticate, authorize('ADMIN'), ownerRequestController.getAllRequests);
router.put('/:id/review', authenticate, authorize('ADMIN'), ownerRequestController.reviewRequest);

export default router;
