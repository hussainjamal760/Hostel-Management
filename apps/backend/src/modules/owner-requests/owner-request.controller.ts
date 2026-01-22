import { Request, Response } from 'express';
import { asyncHandler, ApiResponse } from '../../utils';
import ownerRequestService from './owner-request.service';

export class OwnerRequestController {
  // User creates a request to become an owner
  createRequest = asyncHandler(async (req: Request, res: Response) => {
    const result = await ownerRequestService.createRequest(req.user!.id, req.body);
    ApiResponse.success(res, result, 'Owner request submitted successfully', 201);
  });

  // User gets their own requests
  getMyRequests = asyncHandler(async (req: Request, res: Response) => {
    const requests = await ownerRequestService.getUserRequests(req.user!.id);
    ApiResponse.success(res, requests, 'Requests retrieved successfully');
  });

  // User gets their latest request status
  getMyLatestRequest = asyncHandler(async (req: Request, res: Response) => {
    const request = await ownerRequestService.getMyLatestRequest(req.user!.id);
    ApiResponse.success(res, request, 'Request retrieved successfully');
  });

  // Admin gets all pending requests
  getPendingRequests = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await ownerRequestService.getAllPendingRequests(page, limit);
    ApiResponse.success(res, result, 'Pending requests retrieved successfully');
  });

  // Admin gets all requests with optional status filter
  getAllRequests = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;
    const result = await ownerRequestService.getAllRequests(status, page, limit);
    ApiResponse.success(res, result, 'Requests retrieved successfully');
  });

  // Admin approves or rejects a request
  reviewRequest = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ownerRequestService.reviewRequest(id, req.user!.id, req.body);
    ApiResponse.success(res, result, `Request ${req.body.status.toLowerCase()} successfully`);
  });

  // Get pending count for admin dashboard
  getPendingCount = asyncHandler(async (_req: Request, res: Response) => {
    const count = await ownerRequestService.getPendingCount();
    ApiResponse.success(res, { count }, 'Pending count retrieved');
  });
}

export default new OwnerRequestController();
