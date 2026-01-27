import { baseApi } from './api';

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  hostelId?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PaginatedApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<ApiResponse<User>, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    updateMe: builder.mutation<ApiResponse<User>, UpdateProfileRequest>({
      query: (data) => ({
        url: '/users/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getAllUsers: builder.query<PaginatedApiResponse<User>, { role?: string; search?: string; page?: number; limit?: number }>({
      query: (params) => ({
        url: '/users',
        method: 'GET',
        params,
      }),
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<ApiResponse<User>, { id: string; data: Partial<User> }>({
        query: ({ id, data }) => ({
            url: `/users/${id}`,
            method: 'PATCH',
            body: data,
        }),
        invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation<ApiResponse<void>, string>({
        query: (id) => ({
            url: `/users/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['User'],
    }),
    bulkDeleteUsers: builder.mutation<ApiResponse<{ count: number }>, string[]>({
        query: (ids) => ({
            url: '/users/bulk-delete',
            method: 'POST',
            body: { ids },
        }),
        invalidatesTags: ['User'],
    }),
  }),
});

export const { 
    useGetMeQuery, 
    useUpdateMeMutation, 
    useGetAllUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useBulkDeleteUsersMutation,
    useLazyGetAllUsersQuery
} = userApi;
