import { Request, Response } from 'express';
import { asyncHandler, ApiResponse } from '../../utils';
import adminService from './admin.service';

export class AdminController {
  getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await adminService.getDashboardStats();
    ApiResponse.success(res, stats, 'Dashboard stats retrieved successfully');
  });

  fixDatabase = asyncHandler(async (_req: Request, res: Response) => {
    const result = await adminService.fixDatabase();
    ApiResponse.success(res, result, 'Database fixed successfully');
  });
}

export default new AdminController();
