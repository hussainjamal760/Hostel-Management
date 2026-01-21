import { Response } from 'express';

/**
 * Standardized API Response Helper
 * Ensures consistent response format across all endpoints
 */
export interface ApiResponseData<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class ApiResponse {
  /**
   * Success response
   */
  static success<T>(
    res: Response,
    data: T,
    message = 'Success',
    statusCode = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      statusCode,
    });
  }

  /**
   * Success response with pagination
   */
  static paginated<T>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    message = 'Success'
  ): Response {
    res.setHeader('X-Total-Count', pagination.total.toString());
    res.setHeader('X-Total-Pages', pagination.totalPages.toString());

    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
      statusCode: 200,
    });
  }

  /**
   * Created response (201)
   */
  static created<T>(res: Response, data: T, message = 'Created successfully'): Response {
    return res.status(201).json({
      success: true,
      message,
      data,
      statusCode: 201,
    });
  }

  /**
   * No content response (204)
   */
  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  /**
   * Error response
   */
  static error(
    res: Response,
    message: string,
    statusCode = 500,
    errors?: Record<string, string>
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      statusCode,
    });
  }
}

export default ApiResponse;
