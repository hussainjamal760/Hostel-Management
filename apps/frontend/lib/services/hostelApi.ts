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
  totalRemaining: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  complaintsBreakdown: {
    open: number;
    inProgress: number;
    resolved: number;
  };
  currentMonthRevenue: number;
  currentMonthPending: number;
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
    getHostelById: builder.query<ApiResponse<IHostel>, string>({
      query: (id) => ({
        url: `/hostels/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Hostel', id }],
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
    deleteHostel: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/hostels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Hostel'],
    }),
    getAllHostels: builder.query<ApiResponse<IHostel[]>, { limit?: number } | undefined>({
      query: (params) => ({
        url: '/hostels',
        method: 'GET',
        params: params || undefined,     
      }),
      providesTags: ['Hostel'],
    }),
    getMonthlyReport: builder.query<ApiResponse<any>, { month?: number; year?: number; hostelId?: string }>({
      query: (params) => ({
        url: '/hostels/reports/monthly',
        method: 'GET',
        params,
      }),
      providesTags: ['Hostel', 'Payment', 'Student'],
    }),
  }),
});

export const {
  useGetOwnerHostelsQuery,
  useGetHostelStatsQuery,
  useGetHostelByIdQuery,
  useCreateHostelMutation,
  useUpdateHostelMutation,
  useDeleteHostelMutation,
  useGetMonthlyReportQuery,
  useGetAllHostelsQuery,
} = hostelApi;
