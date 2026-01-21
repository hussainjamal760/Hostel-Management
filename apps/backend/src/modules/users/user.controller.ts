import { Request, Response } from 'express';
import { asyncHandler, ApiResponse } from '../../utils';
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
    const filters: any = {
      ...req.query,
    };
    
    const result = await userService.getAllUsers(filters);

    if (result.pagination) {
        ApiResponse.paginated(res, result.users, result.pagination, 'Users fetched successfully');
    } else {
        ApiResponse.success(res, result, 'Users fetched successfully');
    }
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.user!._id.toString());
    ApiResponse.success(res, user, 'Profile fetched successfully');
  });

  updateMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.updateUser(req.user!._id.toString(), req.body);
    ApiResponse.success(res, user, 'Profile updated successfully');
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id);
    ApiResponse.success(res, user, 'User fetched successfully');
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.updateUser(req.params.id, req.body);
    ApiResponse.success(res, user, 'User updated successfully');
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    await userService.deleteUser(req.params.id);
    ApiResponse.success(res, null, 'User deleted successfully');
  });
}

export default new UserController();
