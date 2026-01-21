/**
 * Password Generator
 * Generates secure random passwords for new users
 */

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%&*';

/**
 * Generate a random password
 * @param length Password length (default: 8)
 * @param includeSpecial Include special characters (default: true)
 */
export const generatePassword = (length = 8, includeSpecial = true): string => {
  const charset = LOWERCASE + UPPERCASE + NUMBERS + (includeSpecial ? SPECIAL : '');

  // Ensure at least one of each required type
  let password = '';
  password += LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)];
  password += UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)];
  password += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];

  if (includeSpecial) {
    password += SPECIAL[Math.floor(Math.random() * SPECIAL.length)];
  }

  // Fill remaining length
  const remainingLength = length - password.length;
  for (let i = 0; i < remainingLength; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

/**
 * Generate a simple numeric PIN
 * @param length PIN length (default: 6)
 */
export const generatePin = (length = 6): string => {
  let pin = '';
  for (let i = 0; i < length; i++) {
    pin += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
  }
  return pin;
};

export default {
  generatePassword,
  generatePin,
};
