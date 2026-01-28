import { Role } from '@hostelite/shared-types';

export const generateUsername = (
  role: Role,
  hostelCode: string,
  sequence: number
): string => {
  const paddedSeq = sequence.toString().padStart(3, '0');
  return `${role.toLowerCase()}-${hostelCode.toLowerCase()}-${paddedSeq}`;
};

export const generateAdminUsername = (sequence: number): string => {
  const paddedSeq = sequence.toString().padStart(3, '0');
  return `admin-${paddedSeq}`;
};

export const extractSequence = (username: string): number => {
  const parts = username.split('-');
  const seq = parts[parts.length - 1];
  return parseInt(seq, 10) || 0;
};

export default {
  generateUsername,
  generateAdminUsername,
  extractSequence,
};
