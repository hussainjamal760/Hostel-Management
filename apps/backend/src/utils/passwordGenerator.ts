const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%&*';

export const generatePassword = (length = 8, includeSpecial = true): string => {
  const charset = LOWERCASE + UPPERCASE + NUMBERS + (includeSpecial ? SPECIAL : '');

  let password = '';
  password += LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)];
  password += UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)];
  password += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];

  if (includeSpecial) {
    password += SPECIAL[Math.floor(Math.random() * SPECIAL.length)];
  }

  const remainingLength = length - password.length;
  for (let i = 0; i < remainingLength; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

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
