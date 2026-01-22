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
  }),
});

export const { useGetMeQuery, useUpdateMeMutation } = userApi;
