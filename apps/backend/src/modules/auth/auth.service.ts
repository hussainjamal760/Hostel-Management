import { User } from '../users/user.model';
import {
  hashPassword,
  comparePassword,
  generateTokens,
  verifyRefreshToken,
  ApiError,
  generatePin,
  mailService,
} from '../../utils';
import { logger } from '../../config';
import {
  LoginInput,
  SignupInput,
  VerifyEmailInput,
  ChangePasswordInput,
} from '@hostelite/shared-validators';

export class AuthService {
  async signup(data: SignupInput) {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw ApiError.badRequest('Email already registered');
    }

    const verificationCode = generatePin(6);
    const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const hashedPassword = await hashPassword(data.password);

    const user = new User({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: 'STUDENT', // Default role
      isEmailVerified: false,
      verificationCode,
      verificationCodeExpiresAt,
      isActive: true,
      username: data.email, // Use email as username by default
    });

    await user.save();
    await mailService.sendVerificationEmail(data.email, verificationCode);

    return { message: 'Signup successful. Verification code sent to email.' };
  }

  async verifyEmail(data: VerifyEmailInput) {
    const user = await User.findOne({ 
      email: data.email.toLowerCase(),
      verificationCode: data.code,
      verificationCodeExpiresAt: { $gt: new Date() }
    }).select('+verificationCode +verificationCodeExpiresAt');

    if (!user) {
      throw ApiError.badRequest('Invalid or expired verification code');
    }

    user.isEmailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    await user.save();

    return { message: 'Email verified successfully. You can now login.' };
  }

  async login(data: LoginInput) {
    const user = await User.findOne({ email: data.email.toLowerCase() })
      .select('+password +refreshToken')
      .exec();

    if (!user) {
      logger.warn(`Login failed: User not found [${data.email}]`);
      throw ApiError.unauthorized('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw ApiError.forbidden('Email not verified. Please verify your email first.');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account is deactivated. Contact administrator.');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      logger.warn(`Login failed: Invalid password for [${data.email}]`);
      throw ApiError.unauthorized('Invalid credentials');
    }

    const tokens = generateTokens({
      id: user._id.toString(),
      role: user.role,
      hostelId: user.hostelId?.toString(),
    });

    user.refreshToken = tokens.refreshToken;
    user.lastLoginAt = new Date();
    await user.save();

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hostelId: user.hostelId,
        isFirstLogin: user.isFirstLogin,
        phone: user.phone,
        avatar: user.avatar,
      },
      tokens,
    };
  }

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

      const tokens = generateTokens({
        id: user._id.toString(),
        role: user.role,
        hostelId: user.hostelId?.toString(),
      });

      user.refreshToken = tokens.refreshToken;
      await user.save();

      return tokens;
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

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
}

export default new AuthService();
