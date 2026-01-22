export type Role = 'ADMIN' | 'OWNER' | 'MANAGER' | 'STUDENT';

export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  hostelId?: string;
  createdBy?: string;
  isFirstLogin: boolean;
  isActive: boolean;
  isEmailVerified: boolean;
  verificationCode?: string;
  verificationCodeExpiresAt?: Date;
  lastLoginAt?: Date;
  refreshToken?: string;
  fcmToken?: string;
  avatar?: {
    publicId: string;
    url: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPublic
  extends Omit<IUser, 'password' | 'refreshToken'> {}

export interface IUserCreate {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  hostelId?: string;
}

export interface IUserUpdate {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: {
    publicId: string;
    url: string;
  };
  fcmToken?: string;
}
