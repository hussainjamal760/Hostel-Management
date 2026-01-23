import { Request, Response } from 'express';
import { asyncHandler, ApiResponse } from '../../utils';
import hostelService from './hostel.service';
import { Role } from '@hostelite/shared-types';

export class HostelController {
  createHostel = asyncHandler(async (req: Request, res: Response) => {
    const requesterId = req.user!.id;
    const requesterRole = req.user!.role as Role;
    const result = await hostelService.createHostel(req.body, requesterId, requesterRole);

    ApiResponse.created(res, result, 'Hostel created successfully');
  });

  getAllHostels = asyncHandler(async (req: Request, res: Response) => {
    const filters: any = {
      ...req.query,
    };

    if (req.user?.role === 'OWNER') {
      filters.ownerId = req.user.id;
    } else if (req.user?.role === 'MANAGER') {
      // Find the manager record to get ownerId
      // We need to import Manager model. Since we can't easily add top-level imports in this tool, 
      // we'll assume manager service or model availability, or better, we ask service to handle it.
      // But for quick controller logic:
      const manager = await import('../managers/manager.model.js').then(m => m.Manager.findOne({ userId: req.user!.id }));
      if (manager) {
        filters.ownerId = manager.ownerId;
      } else {
         // Should not happen for valid manager
         filters.ownerId = null; 
      }
    }

    const result = await hostelService.getAllHostels(filters);
    ApiResponse.paginated(res, result.hostels, result.pagination, 'Hostels fetched successfully');
  });

  getStats = asyncHandler(async (req: Request, res: Response) => {
    const result = await hostelService.getStats(req.user!.id);
    ApiResponse.success(res, result, 'Stats fetched successfully');
  });

  getHostelById = asyncHandler(async (req: Request, res: Response) => {
    const result = await hostelService.getHostelById(req.params.id);
    ApiResponse.success(res, result, 'Hostel fetched successfully');
  });

  updateHostel = asyncHandler(async (req: Request, res: Response) => {
    const result = await hostelService.updateHostel(
      req.params.id,
      req.body,
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
}

export default new HostelController();

