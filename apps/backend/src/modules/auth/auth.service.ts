import { User } from '../users/user.model';
import {
  hashPassword,
  comparePassword,
  generateTokens,
  verifyRefreshToken,
  ApiError,
  mailService,
} from '../../utils';
import { logger } from '../../config';
import {
  LoginInput,
  SignupInput,
  VerifyEmailInput,
  ChangePasswordInput,
} from '@hostelite/shared-validators';
import { PendingUser } from './pendingUser.model';

export class AuthService {
  async signup(data: SignupInput) {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw ApiError.badRequest('Email already registered');
    }

    const hashedPassword = await hashPassword(data.password);

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Upsert pending user
    await PendingUser.findOneAndUpdate(
      { email: data.email.toLowerCase() },
      {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        passwordHash: hashedPassword,
        verificationCode,
        createdAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Send verification email
    await mailService.sendVerificationEmail(data.email, verificationCode);

    return { message: 'Verification code sent to email' };
  }

  async verifyEmail(data: VerifyEmailInput) {
    const pendingUser = await PendingUser.findOne({ 
      email: data.email.toLowerCase(),
      verificationCode: data.code
    });

    if (!pendingUser) {
      throw ApiError.badRequest('Invalid or expired verification code');
    }

    const existingUser = await User.findOne({ email: pendingUser.email });
    if (existingUser) {
      await PendingUser.deleteOne({ _id: pendingUser._id });
      throw ApiError.badRequest('User already registered');
    }

    const user = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      phone: pendingUser.phone,
      password: pendingUser.passwordHash,
      role: 'OWNER', 
      isFirstLogin: false, 
      isEmailVerified: true,
      isActive: true,
      username: pendingUser.email,
    });

    await user.save();
    await PendingUser.deleteOne({ _id: pendingUser._id });

    return { message: 'Email verified successfully. You can now login.' };
  }

  async login(data: LoginInput) {
    const identifier = data.identifier.toLowerCase();
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { username: identifier }] 
    })
      .select('+password')
      .exec();

    if (!user) {
      logger.warn(`Login failed: User not found [${identifier}]`);
      throw ApiError.unauthorized('Invalid credentials');
    }



    if (!user.isActive) {
      throw ApiError.forbidden('Account is deactivated. Contact administrator.');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      logger.warn(`Login failed: Invalid password for [${identifier}]`);
      throw ApiError.unauthorized('Invalid credentials');
    }

    const tokens = generateTokens({
      id: user._id.toString(),
      role: user.role,
      hostelId: user.hostelId?.toString(),
    });

    user.hashedRefreshToken = await hashPassword(tokens.refreshToken);
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

      const user = await User.findById(decoded.id).select('+hashedRefreshToken').exec();

      if (!user || !user.hashedRefreshToken) {
        throw ApiError.unauthorized('Invalid refresh token');
      }

      const isRefreshTokenValid = await comparePassword(refreshToken, user.hashedRefreshToken);
      if (!isRefreshTokenValid) {
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

      user.hashedRefreshToken = await hashPassword(tokens.refreshToken);
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
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { hashedRefreshToken: null });
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
    user.hashedRefreshToken = undefined;
    await user.save();

    return { message: 'Password changed successfully. Please login again.' };
  }

  async getMe(userId: string) {
    const user = await User.findById(userId).exec();
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  async activateStudent(token: string, newPassword: string) {
    const user = await User.findOne({ activationToken: token }).select('+activationToken +activationTokenExpiresAt').exec();

    if (!user) {
      throw ApiError.badRequest('Invalid or expired activation link');
    }

    if (user.activationTokenExpiresAt && user.activationTokenExpiresAt < new Date()) {
      throw ApiError.badRequest('Activation link has expired. Please contact the manager for a new one.');
    }

    user.password = await hashPassword(newPassword);
    user.activationToken = undefined;
    user.activationTokenExpiresAt = undefined;
    user.isEmailVerified = true;
    user.isFirstLogin = false;
    
    await user.save();

    return { message: 'Account activated successfully. You can now login.' };
  }

  async verifyActivationToken(token: string) {
    const user = await User.findOne({ activationToken: token }).select('+activationToken +activationTokenExpiresAt').exec();

    if (!user) {
      throw ApiError.badRequest('Account already activated or invalid link');
    }

    if (user.activationTokenExpiresAt && user.activationTokenExpiresAt < new Date()) {
      throw ApiError.badRequest('Activation link has expired');
    }

    return { valid: true, email: user.email };
  }
}

export default new AuthService();
