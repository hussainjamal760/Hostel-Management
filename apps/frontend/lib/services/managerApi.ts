import { baseApi } from './api';
import { CreateManagerInput, UpdateManagerInput } from '@hostelite/shared-validators';
import { ApiResponse } from './authApi';

// IManager definition (should ideally be imported from shared-types, but defining here for now if not available)
// Note: IManager interface in frontend might differ slightly (dates as strings)
export interface IManager {
  _id: string;
  name: string;
  phoneNumber: string;
  cnic: string;
  salary: number;
  avatar?: string;
  cnicImage?: string;
  hostelId: string;
  ownerId: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const managerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getManagers: builder.query<ApiResponse<IManager[]>, { hostelId?: string } | void>({
      query: (params) => ({
        url: '/managers',
        method: 'GET',
        params: params || {},
      }),
      providesTags: ['Manager'],
    }),
    getManager: builder.query<ApiResponse<IManager>, string>({
      query: (id) => ({
        url: `/managers/${id}`,
        method: 'GET',
      }),
      providesTags: ['Manager'],
    }),
    createManager: builder.mutation<ApiResponse<IManager>, CreateManagerInput>({
      query: (data) => ({
        url: '/managers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Manager'],
    }),
    updateManager: builder.mutation<ApiResponse<IManager>, { id: string; data: UpdateManagerInput }>({
      query: ({ id, data }) => ({
        url: `/managers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Manager'],
    }),
    deleteManager: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/managers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Manager'],
    }),
  }),
});

export const {
  useGetManagersQuery,
  useGetManagerQuery,
  useCreateManagerMutation,
  useUpdateManagerMutation,
  useDeleteManagerMutation,
} = managerApi;
