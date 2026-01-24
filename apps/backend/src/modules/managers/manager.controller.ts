import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { managerService } from './manager.service';
import { CreateManagerInput, UpdateManagerInput } from '@hostelite/shared-validators';

class ManagerController {
  createManager = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!.id;
    const input: CreateManagerInput = req.body;
    
    const manager = await managerService.createManager(input, ownerId);
    return ApiResponse.created(res, manager, 'Manager created successfully');
  });

  getAllManagers = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!.id;
    const { hostelId } = req.query;
    
    const managers = await managerService.getAllManagers(ownerId, hostelId as string);
    return ApiResponse.success(res, managers, 'Managers retrieved successfully');
  });

  getManager = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!.id;
    const { id } = req.params;
    
    const manager = await managerService.getManagerById(id, ownerId);
    return ApiResponse.success(res, manager, 'Manager details retrieved successfully');
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const manager = await managerService.getManagerByUserId(userId);
    return ApiResponse.success(res, manager, 'Manager profile retrieved successfully');
  });

  updateManager = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!.id;
    const { id } = req.params;
    const input: UpdateManagerInput = req.body;
    
    const manager = await managerService.updateManager(id, input, ownerId);
    return ApiResponse.success(res, manager, 'Manager updated successfully');
  });

  deleteManager = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!.id;
    const { id } = req.params;
    
    await managerService.deleteManager(id, ownerId);
    return ApiResponse.success(res, null, 'Manager deleted successfully');
  });
}

export const managerController = new ManagerController();
