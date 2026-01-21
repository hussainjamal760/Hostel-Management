export type Role = 'ADMIN' | 'OWNER' | 'MANAGER' | 'STUDENT';

export interface IUser {
  _id: string;
  username: string;
  email?: string;
  phone?: string;
  password: string;
  role: Role;
  hostelId?: string;
  createdBy?: string;
  isFirstLogin: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  refreshToken?: string;
  fcmToken?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPublic
  extends Omit<IUser, 'password' | 'refreshToken'> {}

export interface IUserCreate {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  role: Role;
  hostelId?: string;
}

export interface IUserUpdate {
  email?: string;
  phone?: string;
  avatar?: string;
  fcmToken?: string;
}
