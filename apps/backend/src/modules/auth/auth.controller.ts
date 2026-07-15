import { Request, Response } from 'express';
import { asyncHandler, ApiResponse, ApiError } from '../../utils';
import authService from './auth.service';
import { env } from '../../config';

export class AuthController {
  signup = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.signup(req.body);
    ApiResponse.success(res, result, 'Verification code sent to email', 201);
  });

  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.verifyEmail(req.body);
    ApiResponse.success(res, result, 'Email verified successfully');
  });

  activateStudent = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body;
    if (!token || !password) {
      throw ApiError.badRequest('Token and password are required');
    }
    const result = await authService.activateStudent(token, password);
    ApiResponse.success(res, result, 'Account activated successfully');
  });

  verifyActivationToken = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      throw ApiError.badRequest('Token is required');
    }
    const result = await authService.verifyActivationToken(token);
    ApiResponse.success(res, result, 'Token is valid');
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.cookie('token', result.tokens.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: env.COOKIE_ACCESS_MAX_AGE_MS });
    res.cookie('refreshToken', result.tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: env.COOKIE_REFRESH_MAX_AGE_MS });
    ApiResponse.success(res, result, 'Login successful');
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw ApiError.unauthorized('No refresh token provided');
    }
    const result = await authService.refreshToken(refreshToken);
    res.cookie('token', result.tokens.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: env.COOKIE_ACCESS_MAX_AGE_MS });
    res.cookie('refreshToken', result.tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: env.COOKIE_REFRESH_MAX_AGE_MS });
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

  me = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getMe(req.user!.id);
    ApiResponse.success(res, { user }, 'User details retrieved');
  });
}

export default new AuthController();
