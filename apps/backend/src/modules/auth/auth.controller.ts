import { Request, Response } from 'express';
import { asyncHandler, ApiResponse } from '../../utils';
import authService from './auth.service';

export class AuthController {
  signup = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.signup(req.body);
    ApiResponse.success(res, result, 'Verification code sent to email', 201);
  });

  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.verifyEmail(req.body);
    ApiResponse.success(res, result, 'Email verified successfully');
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.cookie('token', result.tokens.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', result.tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000 });
    ApiResponse.success(res, result, 'Login successful');
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    const result = await authService.refreshToken(refreshToken);
    res.cookie('token', result.tokens.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', result.tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000 });
    ApiResponse.success(res, result, 'Tokens refreshed');
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.user!.id);
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    ApiResponse.success(res, null, 'Logged out successfully');
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.changePassword(req.user!.id, req.body);
    ApiResponse.success(res, result, 'Password changed successfully');
  });
}

export default new AuthController();
