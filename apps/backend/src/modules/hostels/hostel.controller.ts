import { Request, Response } from 'express';
import { asyncHandler, ApiResponse } from '../../utils';
import hostelService from './hostel.service';
import { Role } from '@hostelite/shared-types';
import { Manager } from '../managers/manager.model';

export class HostelController {
  createHostel = asyncHandler(async (req: Request, res: Response) => {
    const requesterId = req.user!.id;
    const requesterRole = req.user!.role as Role;
    const result = await hostelService.createHostel(req.body, requesterId, requesterRole);

    ApiResponse.created(res, result, 'Hostel created successfully');
  });

  getAllHostels = asyncHandler(async (req: Request, res: Response) => {
    const filters: any = {};
    if (typeof req.query.search === 'string') filters.search = req.query.search;
    if (typeof req.query.status === 'string') filters.status = req.query.status;
    if (typeof req.query.page === 'string') filters.page = Number(req.query.page);
    if (typeof req.query.limit === 'string') filters.limit = Number(req.query.limit);

    if (req.user?.role === 'OWNER') {
      filters.ownerId = req.user.id;
    } else if (req.user?.role === 'MANAGER') {
      const manager = await Manager.findOne({ userId: req.user!.id });
      if (manager) {
        filters.ownerId = manager.ownerId;
      } else {
        filters.ownerId = null;
      }
    }

    const result = await hostelService.getAllHostels(filters);
    ApiResponse.paginated(res, result.hostels, result.pagination, 'Hostels fetched successfully');
  });

  getStats = asyncHandler(async (req: Request, res: Response) => {
    const { hostelId } = req.query;
    const result = await hostelService.getStats(req.user!.id, hostelId as string);
    ApiResponse.success(res, result, 'Stats fetched successfully');
  });

  getHostelById = asyncHandler(async (req: Request, res: Response) => {
    const result = await hostelService.getHostelById(req.params.id);
    ApiResponse.success(res, result, 'Hostel fetched successfully');
  });

  updateHostel = asyncHandler(async (req: Request, res: Response) => {
    const allowedUpdates: any = {};
    const safeFields = ['name', 'address', 'phone', 'email', 'capacity', 'amenities', 'status'];
    safeFields.forEach(field => {
      if (req.body[field] !== undefined) {
        allowedUpdates[field] = req.body[field];
      }
    });

    const result = await hostelService.updateHostel(
      req.params.id,
      allowedUpdates,
      req.user!.id,
      req.user!.role as Role
    );
    ApiResponse.success(res, result, 'Hostel updated successfully');
  });

  deleteHostel = asyncHandler(async (req: Request, res: Response) => {
    await hostelService.deleteHostel(
      req.params.id,
      req.user!.id,
      req.user!.role as Role
    );
    ApiResponse.success(res, null, 'Hostel deleted successfully');
  });

  getMonthlyReport = asyncHandler(async (req: Request, res: Response) => {
    const { month, year, hostelId } = req.query;
    const result = await hostelService.getMonthlyReport(
      req.user!.id,
      req.user!.role,
      typeof month === 'string' ? parseInt(month) : undefined,
      typeof year === 'string' ? parseInt(year) : undefined,
      typeof hostelId === 'string' ? hostelId : undefined
    );
    ApiResponse.success(res, result, 'Report generated successfully');
  });
}

export default new HostelController();

