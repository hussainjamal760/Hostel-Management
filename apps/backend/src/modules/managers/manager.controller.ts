import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import { managerService } from './manager.service';
import { CreateManagerInput, UpdateManagerInput } from '@hostelite/shared-validators';

class ManagerController {
  createManager = asyncHandler(async (req: Request, res: Response) => {
    const ownerId = req.user!.id;
    const input: CreateManagerInput = req.body;
    
    // If hostelId is not provided in body, but exists on owner's profile, we could infer it?
    // But for now we expect it in body or we might fail if schema requires it but it's optional in schema.
    // Actually schema has it as optional string, but Model requires it.
    // Frontend should send it.
    
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
