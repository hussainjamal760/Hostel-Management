import { Request, Response } from 'express';
import { asyncHandler, ApiResponse, ApiError } from '../../utils';
import roomService from './room.service';
import { Role } from '@hostelite/shared-types';

export class RoomController {
  createRoom = asyncHandler(async (req: Request, res: Response) => {
    let hostelId = req.query.hostelId as string;
    
    if (req.user?.role === 'MANAGER') {
      hostelId = req.user.hostelId!;
    }

    if (!hostelId) {
      throw ApiError.badRequest('Hostel ID is required');
    }

    const result = await roomService.createRoom(req.body, hostelId);
    ApiResponse.created(res, result, 'Room created successfully');
  });

  getAllRooms = asyncHandler(async (req: Request, res: Response) => {
    let hostelId = req.query.hostelId as string;

    if (req.user?.role === 'MANAGER') {
      hostelId = req.user.hostelId!;
    }
    
    if (!hostelId) {
       throw ApiError.badRequest('Hostel ID is required');
    }

    const result = await roomService.getAllRooms(hostelId, req.query);
    ApiResponse.paginated(res, result.rooms, result.pagination, 'Rooms fetched successfully');
  });

  getRoomById = asyncHandler(async (req: Request, res: Response) => {
    const result = await roomService.getRoomById(req.params.id);
    
    if (req.user?.role === 'MANAGER' && result.hostelId.toString() !== req.user.hostelId) {
      throw ApiError.forbidden('Access denied');
    }
    
    ApiResponse.success(res, result, 'Room fetched successfully');
  });

  updateRoom = asyncHandler(async (req: Request, res: Response) => {
    const result = await roomService.updateRoom(
      req.params.id,
      req.body,
      req.user!._id,
      req.user!.role as Role,
      req.user!.hostelId
    );
    ApiResponse.success(res, result, 'Room updated successfully');
  });

  deleteRoom = asyncHandler(async (req: Request, res: Response) => {
    await roomService.deleteRoom(
      req.params.id,
      req.user!._id,
      req.user!.role as Role,
      req.user!.hostelId
    );
    ApiResponse.success(res, null, 'Room deleted successfully');
  });
}

export default new RoomController();
