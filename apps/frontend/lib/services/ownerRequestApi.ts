import { baseApi } from './api';

export interface OwnerRequest {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    createdAt: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  reason: string;
  adminNotes?: string;
  reviewedBy?: { _id: string; name: string };
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOwnerRequestInput {
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  reason: string;
}

export interface ReviewRequestInput {
  status: 'APPROVED' | 'REJECTED';
  adminNotes?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    requests: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  statusCode: number;
}

export const ownerRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // User endpoints
    createOwnerRequest: builder.mutation<ApiResponse<OwnerRequest>, CreateOwnerRequestInput>({
      query: (data) => ({
        url: '/owner-requests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getMyLatestRequest: builder.query<ApiResponse<OwnerRequest | null>, void>({
      query: () => '/owner-requests/my/latest',
    }),
    getMyRequests: builder.query<ApiResponse<OwnerRequest[]>, void>({
      query: () => '/owner-requests/my',
    }),

    // Admin endpoints
    getPendingRequests: builder.query<PaginatedResponse<OwnerRequest>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/owner-requests/pending?page=${page}&limit=${limit}`,
    }),
    getAllOwnerRequests: builder.query<PaginatedResponse<OwnerRequest>, { status?: string; page?: number; limit?: number }>({
      query: ({ status, page = 1, limit = 10 }) => 
        `/owner-requests?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`,
    }),
    reviewOwnerRequest: builder.mutation<ApiResponse<OwnerRequest>, { id: string; data: ReviewRequestInput }>({
      query: ({ id, data }) => ({
        url: `/owner-requests/${id}/review`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getPendingCount: builder.query<ApiResponse<{ count: number }>, void>({
      query: () => '/owner-requests/pending/count',
    }),
  }),
});

export const {
  useCreateOwnerRequestMutation,
  useGetMyLatestRequestQuery,
  useGetMyRequestsQuery,
  useGetPendingRequestsQuery,
  useGetAllOwnerRequestsQuery,
  useReviewOwnerRequestMutation,
  useGetPendingCountQuery,
} = ownerRequestApi;
