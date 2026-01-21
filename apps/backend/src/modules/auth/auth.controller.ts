import { Request, Response } from 'express';
import { asyncHandler, ApiResponse } from '../../utils';
import authService from './auth.service';

/**
 * Auth Controller
 * Handles HTTP requests for authentication
 */
export class AuthController {
  /**
   * POST /api/v1/auth/login
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    ApiResponse.success(res, result, 'Login successful');
  });

  /**
   * POST /api/v1/auth/refresh
   */
  refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    ApiResponse.success(res, tokens, 'Tokens refreshed');
  });

  /**
   * POST /api/v1/auth/logout
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.user!.id);
    ApiResponse.success(res, null, 'Logged out successfully');
  });

  /**
   * POST /api/v1/auth/change-password
   */
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.changePassword(req.user!.id, req.body);
    ApiResponse.success(res, result, 'Password changed successfully');
  });
}

export default new AuthController();
