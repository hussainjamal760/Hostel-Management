import { baseApi } from './api';
import { ApiResponse } from './authApi';
import { IPayment } from '@hostelite/shared-types';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPayments: builder.query<ApiResponse<IPayment[]>, { studentId?: string; hostelId?: string; status?: string; month?: number; year?: number }>({
      query: (params) => ({
        url: '/payments',
        method: 'GET',
        params,
      }),
      providesTags: ['Payment'],
    }),
    createPayment: builder.mutation<ApiResponse<IPayment>, Partial<IPayment>>({
      query: (data) => ({
        url: '/payments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment'],
    }),
    getMyInvoices: builder.query<ApiResponse<{ payments: IPayment[], pagination: any }>, void>({
      query: () => ({
        url: '/payments', 
        method: 'GET',
      }),
      providesTags: ['Payment'],
    }),
    submitProof: builder.mutation<ApiResponse<IPayment>, { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('proof', file);
        return {
          url: `/payments/${id}/proof`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Payment'],
    }),
    verifyPayment: builder.mutation<ApiResponse<IPayment>, string>({
      query: (id) => ({
        url: `/payments/${id}/verify`,
        method: 'POST',
      }),
      invalidatesTags: ['Payment'],
    }),
    triggerMonthlyDues: builder.mutation<ApiResponse<any>, { month: number; year: number }>({
      query: (data) => ({
        url: '/payments/actions/generate-monthly-dues',
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Payment'],
    }),
  }),
});

export const {
  useGetAllPaymentsQuery,
  useGetMyInvoicesQuery,
  useCreatePaymentMutation,
  useSubmitProofMutation,
  useVerifyPaymentMutation,
  useTriggerMonthlyDuesMutation,
} = paymentApi;
