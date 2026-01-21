import bcrypt from 'bcrypt';
import { PASSWORD_CONFIG } from '@hostelite/shared-constants';

/**
 * Hash Password
 * Uses bcrypt with configurable salt rounds
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, PASSWORD_CONFIG.SALT_ROUNDS);
};

/**
 * Compare Password
 * Verifies password against hash
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
