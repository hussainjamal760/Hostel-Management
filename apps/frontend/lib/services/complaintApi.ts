import { baseApi } from './api';
import { IComplaint } from '@hostelite/shared-types';
import { ApiResponse } from './authApi';
import { CreateComplaintInput, UpdateComplaintInput } from '@hostelite/shared-validators';

export const complaintApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComplaints: builder.query<ApiResponse<IComplaint[]>, { status?: string; page?: number; limit?: number }>({
      query: (params) => ({
        url: '/complaints',
        method: 'GET',
        params,
      }),
      providesTags: ['Complaint'],
    }),
    createComplaint: builder.mutation<ApiResponse<IComplaint>, CreateComplaintInput>({
      query: (data) => ({
        url: '/complaints',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Complaint'],
    }),
    updateComplaint: builder.mutation<ApiResponse<IComplaint>, { id: string; data: UpdateComplaintInput }>({
      query: ({ id, data }) => ({
        url: `/complaints/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Complaint'],
    }),
    deleteComplaint: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/complaints/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Complaint'],
    }),
  }),
});

export const {
  useGetComplaintsQuery,
  useCreateComplaintMutation,
  useUpdateComplaintMutation,
  useDeleteComplaintMutation,
} = complaintApi;
