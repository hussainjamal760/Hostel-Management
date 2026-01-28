import bcrypt from 'bcrypt';
import { PASSWORD_CONFIG } from '@hostelite/shared-constants';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, PASSWORD_CONFIG.SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
