
import { baseApi } from './api';
import { IStudent } from '@hostelite/shared-types';
import { ApiResponse } from './authApi';
import { CreateStudentInput, UpdateStudentInput } from '@hostelite/shared-validators';

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

export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<PaginatedApiResponse<IStudent>, { hostelId?: string; roomId?: string; search?: string; feeStatus?: string; page?: number; limit?: number }>({
      query: (params) => ({
        url: '/students',
        method: 'GET',
        params,
      }),
      providesTags: ['Student'],
    }),
    getStudentStats: builder.query<ApiResponse<any>, string>({
      query: (hostelId) => ({
        url: '/students/stats',
        method: 'GET',
        params: { hostelId },
      }),
      providesTags: ['Student'],
    }),
    getStudentMe: builder.query<ApiResponse<IStudent>, void>({
      query: () => ({
        url: '/students/me',
        method: 'GET',
      }),
      providesTags: ['Student'],
    }),
    getStudent: builder.query<ApiResponse<IStudent>, string>({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),
    createStudent: builder.mutation<ApiResponse<{ student: IStudent; user: any; password: string }>, CreateStudentInput>({
      query: (data) => ({
        url: '/students',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Student', 'Room', 'Hostel'],
    }),
    updateStudent: builder.mutation<ApiResponse<IStudent>, { id: string; data: UpdateStudentInput }>({
      query: ({ id, data }) => ({
        url: `/students/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Student', id: arg.id }, 'Student'],
    }),
    deleteStudent: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student', 'Room', 'Hostel'],
    }),
    getDashboardAnalytics: builder.query<ApiResponse<any>, string>({
      query: (hostelId) => ({
        url: '/students/analytics',
        method: 'GET',
        params: { hostelId },
      }),
      providesTags: ['Student', 'Payment', 'Complaint'],
    }),
    getDueWarning: builder.query<ApiResponse<{
      hasOverdue: boolean;
      overdueCount: number;
      pendingCount: number;
      totalDueAmount: number;
      oldestDueDate: string | null;
      challans: Array<{
        id: string;
        amount: number;
        description: string;
        dueDate: string;
        status: string;
      }>;
    }>, void>({
      query: () => ({
        url: '/students/me/due-warning',
        method: 'GET',
      }),
      providesTags: ['Payment'],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentStatsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetStudentMeQuery,
  useGetDashboardAnalyticsQuery,
  useGetDueWarningQuery,
} = studentApi;
