/**
 * API Response Types
 * Standardized API response interfaces
 */

export interface IApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface IPaginatedResponse<T> extends IApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginResponse {
  user: {
    _id: string;
    username: string;
    email?: string;
    role: string;
    hostelId?: string;
    isFirstLogin: boolean;
    avatar?: string;
  };
  tokens: IAuthTokens;
}

export interface IQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}
