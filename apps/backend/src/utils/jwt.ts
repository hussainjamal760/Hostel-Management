import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../config';
import { Role } from '@hostelite/shared-types';

export interface TokenPayload extends JwtPayload {
  id: string;
  role: Role;
  hostelId?: string;
}

export const generateAccessToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRY as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET as Secret, options);
};

export const generateRefreshToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRY as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
};

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
