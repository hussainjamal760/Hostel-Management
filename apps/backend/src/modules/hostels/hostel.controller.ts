import { Request, Response } from 'express';
import { asyncHandler, ApiResponse } from '../../utils';
import hostelService from './hostel.service';
import { Role } from '@hostelite/shared-types';

export class HostelController {

  createHostel = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!._id;
    const result = await hostelService.createHostel(req.body, ownerId);

    ApiResponse.created(res, result, 'Hostel created successfully');
  });

  getAllHostels = asyncHandler(async (req: Request, res: Response) => {
    const filters: any = {
      ...req.query,
    };

    if (req.user?.role === 'OWNER') {
      filters.ownerId = req.user._id;
    }
    
    const result = await hostelService.getAllHostels(filters);

    ApiResponse.success(res, result, 'Hostels fetched successfully');
  });


  getHostelById = asyncHandler(async (req: Request, res: Response) => {
    const result = await hostelService.getHostelById(req.params.id);
    ApiResponse.success(res, result, 'Hostel fetched successfully');
  });

  updateHostel = asyncHandler(async (req: Request, res: Response) => {
    const result = await hostelService.updateHostel(
      req.params.id,
      req.body,
      req.user!._id,
      req.user!.role as Role
    );
    ApiResponse.success(res, result, 'Hostel updated successfully');
  });

  deleteHostel = asyncHandler(async (req: Request, res: Response) => {
    await hostelService.deleteHostel(
      req.params.id,
      req.user!._id,
      req.user!.role as Role
    );
    ApiResponse.success(res, null, 'Hostel deleted successfully');
  });
}

export default new HostelController();
