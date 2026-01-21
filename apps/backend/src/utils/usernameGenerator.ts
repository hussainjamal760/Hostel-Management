import { Role } from '@hostelite/shared-types';

/**
 * Username Generator
 * Generates unique usernames in format: role-hostelCode-sequence
 * Example: manager-HST1-001, student-HST1-042
 */
export const generateUsername = (
  role: Role,
  hostelCode: string,
  sequence: number
): string => {
  const paddedSeq = sequence.toString().padStart(3, '0');
  return `${role.toLowerCase()}-${hostelCode.toLowerCase()}-${paddedSeq}`;
};

/**
 * Generate Admin Username
 * For platform admins (no hostel code)
 */
export const generateAdminUsername = (sequence: number): string => {
  const paddedSeq = sequence.toString().padStart(3, '0');
  return `admin-${paddedSeq}`;
};

/**
 * Extract sequence from username
 */
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
