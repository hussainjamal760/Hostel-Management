import { baseApi } from './api';

import { LoginInput, SignupInput, VerifyEmailInput } from '@hostelite/shared-validators';

export type LoginRequest = LoginInput;

export type SignupRequest = SignupInput;

export type VerifyEmailRequest = VerifyEmailInput;

export interface AuthData {
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    hostelId?: string;
    isFirstLogin?: boolean;
    avatar?: {
      url: string;
      publicId: string;
    } | string; 
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export type AuthResponse = ApiResponse<AuthData>;
export type MessageResponse = ApiResponse<{ message: string }>;

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation<MessageResponse, SignupRequest>({
      query: (data) => ({
        url: '/auth/signup',
        method: 'POST',
        body: data,
      }),
    }),
    verifyEmail: builder.mutation<MessageResponse, VerifyEmailRequest>({
      query: (data) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    changePassword: builder.mutation<MessageResponse, any>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyEmailMutation,
  useLogoutMutation,
  useChangePasswordMutation,
} = authApi;
