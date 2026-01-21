import { Request, Response } from 'express';
import { asyncHandler, ApiResponse } from '../../utils';
import authService from './auth.service';

export class AuthController {
  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    ApiResponse.success(res, result, 'Login successful');
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    ApiResponse.success(res, tokens, 'Tokens refreshed');
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.user!.id);
    ApiResponse.success(res, null, 'Logged out successfully');
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.changePassword(req.user!.id, req.body);
    ApiResponse.success(res, result, 'Password changed successfully');
  });
}

export default new AuthController();
