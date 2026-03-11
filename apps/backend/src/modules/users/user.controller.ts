import { Request, Response } from 'express';
import { asyncHandler, ApiResponse, ApiError } from '../../utils';
import userService from './user.service';
import { Role } from '@hostelite/shared-types';

export class UserController {
  createUser = asyncHandler(async (req: Request, res: Response) => {
    const creatorRole = req.user!.role as Role;
    const creatorHostelId = req.user!.hostelId?.toString();
    
    const result = await userService.createUser(req.body, creatorRole, creatorHostelId);

    ApiResponse.created(res, result, 'User created successfully');
  });

  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const filters: any = {};
    if (typeof req.query.role === 'string') filters.role = req.query.role;
    if (typeof req.query.search === 'string') filters.search = req.query.search;
    if (typeof req.query.page === 'string') filters.page = Number(req.query.page);
    if (typeof req.query.limit === 'string') filters.limit = Number(req.query.limit);
    
    const result = await userService.getAllUsers(filters);

    if (result.pagination) {
        ApiResponse.paginated(res, result.users, result.pagination, 'Users fetched successfully');
    } else {
        ApiResponse.success(res, result, 'Users fetched successfully');
    }
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.user!.id);
    ApiResponse.success(res, user, 'Profile fetched successfully');
  });

  updateMe = asyncHandler(async (req: Request, res: Response) => {
    const allowedUpdates: any = {};
    const fields = ['name', 'phone', 'avatar'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        allowedUpdates[field] = req.body[field];
      }
    });
    const user = await userService.updateUser(req.user!.id, allowedUpdates);
    ApiResponse.success(res, user, 'Profile updated successfully');
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id);
    ApiResponse.success(res, user, 'User fetched successfully');
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const allowedUpdates: any = {};
    const fields = ['name', 'phone', 'avatar', 'isActive'];
    // Allow role and hostelId updates only if explicit administrative endpoint functionality requires it, 
    // but ideally restricted by validation layers. For general admin patch, we whitelist known safe fields.
    if (req.body.role) allowedUpdates.role = req.body.role;
    if (req.body.hostelId) allowedUpdates.hostelId = req.body.hostelId;
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        allowedUpdates[field] = req.body[field];
      }
    });

    const user = await userService.updateUser(req.params.id, allowedUpdates);
    ApiResponse.success(res, user, 'User updated successfully');
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    await userService.deleteUser(req.params.id);
    ApiResponse.success(res, null, 'User deleted successfully');
  });

  bulkDelete = asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw ApiError.badRequest('No user IDs provided');
    }
    const result = await userService.bulkDeleteUsers(ids);
    ApiResponse.success(res, result, 'Users deleted successfully');
  });
}

export default new UserController();
