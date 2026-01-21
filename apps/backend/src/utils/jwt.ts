import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../config';
import { Role } from '@hostelite/shared-types';

export interface TokenPayload extends JwtPayload {
  id: string;
  role: Role;
  hostelId?: string;
}

/**
 * Generate Access Token
 * Short-lived token for API access
 */
export const generateAccessToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRY as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET as Secret, options);
};

/**
 * Generate Refresh Token
 * Long-lived token for refreshing access tokens
 */
export const generateRefreshToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRY as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, options);
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
};

/**
 * Generate both tokens
 */
export const generateTokens = (
  payload: Omit<TokenPayload, 'iat' | 'exp'>
): { accessToken: string; refreshToken: string } => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokens,
};
