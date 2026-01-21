export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: IPaginationMeta;
  error?: string;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: IPaginationMeta;
}

export interface IErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
  stack?: string;
}
