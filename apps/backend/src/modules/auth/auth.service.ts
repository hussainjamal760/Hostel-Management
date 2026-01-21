import { User } from '../users/user.model';
import {
  hashPassword,
  comparePassword,
  generateTokens,
  verifyRefreshToken,
  ApiError,
  generateAdminUsername,
} from '../../utils';
import { logger, env } from '../../config';
import { LoginInput, ChangePasswordInput } from '@hostelite/shared-validators';

/**
 * Auth Service
 * Handles authentication logic
 */
export class AuthService {
  /**
   * Login user with username and password
   */
  async login(data: LoginInput) {
    const user = await User.findOne({ username: data.username.toLowerCase() })
      .select('+password +refreshToken')
      .exec();

    if (!user) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account is deactivated. Contact administrator.');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    // Generate tokens
    const tokens = generateTokens({
      id: user._id.toString(),
      role: user.role,
      hostelId: user.hostelId?.toString(),
    });

    // Save refresh token
    user.refreshToken = tokens.refreshToken;
    user.lastLoginAt = new Date();
    await user.save();

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        hostelId: user.hostelId,
        isFirstLogin: user.isFirstLogin,
        avatar: user.avatar,
      },
      tokens,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const user = await User.findById(decoded.id).select('+refreshToken').exec();

      if (!user || user.refreshToken !== refreshToken) {
        throw ApiError.unauthorized('Invalid refresh token');
      }

      if (!user.isActive) {
        throw ApiError.forbidden('Account is deactivated');
      }

      // Generate new tokens
      const tokens = generateTokens({
        id: user._id.toString(),
        role: user.role,
        hostelId: user.hostelId?.toString(),
      });

      // Save new refresh token
      user.refreshToken = tokens.refreshToken;
      await user.save();

      return tokens;
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }
  }

  /**
   * Logout user
   */
  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  /**
   * Change password
   */
  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await User.findById(userId).select('+password').exec();

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const isPasswordValid = await comparePassword(data.currentPassword, user.password);

    if (!isPasswordValid) {
      throw ApiError.badRequest('Current password is incorrect');
    }

    if (data.currentPassword === data.newPassword) {
      throw ApiError.badRequest('New password must be different from current password');
    }

    user.password = await hashPassword(data.newPassword);
    user.isFirstLogin = false;
    user.refreshToken = undefined;
    await user.save();

    return { message: 'Password changed successfully. Please login again.' };
  }

  /**
   * Seed initial admin user
   */
  async seedAdmin() {
    const existingAdmin = await User.findOne({ role: 'ADMIN' });

    if (existingAdmin) {
      logger.info('Admin user already exists');
      return;
    }

    const adminCount = await User.countDocuments({ role: 'ADMIN' });
    const username = generateAdminUsername(adminCount + 1);
    const hashedPassword = await hashPassword(env.ADMIN_PASSWORD);

    const admin = new User({
      username,
      email: env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'ADMIN',
      isFirstLogin: true,
      isActive: true,
    });

    await admin.save();
    logger.info(`✅ Admin user created: ${username}`);
  }
}

export default new AuthService();
