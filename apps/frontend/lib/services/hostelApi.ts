import { baseApi } from './api';
import { IHostel } from '@hostelite/shared-types';
import { CreateHostelInput } from '@hostelite/shared-validators';
import { ApiResponse } from './authApi';

export interface HostelStats {
  totalHostels: number;
  totalRooms: number;
  totalBeds: number;
  totalStudents: number;
  occupancyRate: number;
  pendingComplaints: number;
  revenue: number;
}

export const hostelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerHostels: builder.query<ApiResponse<IHostel[]>, void>({
      query: () => ({
        url: '/hostels',
        method: 'GET',
      }),
      providesTags: ['Hostel'],
    }),
    getHostelStats: builder.query<ApiResponse<HostelStats>, void>({
      query: () => ({
        url: '/hostels/stats',
        method: 'GET',
      }),
      providesTags: ['Hostel'],
    }),
    createHostel: builder.mutation<ApiResponse<IHostel>, CreateHostelInput>({
      query: (data) => ({
        url: '/hostels',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Hostel'],
    }),
    updateHostel: builder.mutation<ApiResponse<IHostel>, { id: string; data: Partial<CreateHostelInput> }>({
      query: ({ id, data }) => ({
        url: `/hostels/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Hostel'],
    }),
  }),
});

export const {
  useGetOwnerHostelsQuery,
  useGetHostelStatsQuery,
  useCreateHostelMutation,
  useUpdateHostelMutation,
} = hostelApi;
