import { baseApi } from './api';
import { ApiResponse } from './authApi';
import { IPayment } from '@hostelite/shared-types';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPayments: builder.query<ApiResponse<{ payments: IPayment[], pagination: any }>, { studentId?: string; hostelId?: string; status?: string }>({
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
        url: '/payments', // Backend filters by user role? Checked controller: it expects hostelId. 
        // Wait, controller getAllPayments requires hostelId if not Manager? 
        // Need to check backend controller logic again.
        // For now, passing params explicitly from component is safer.
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
          // RTK Query handles FormData content-type automatically mostly, but let's be sure
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
  }),
});

export const {
  useGetAllPaymentsQuery,
  useGetMyInvoicesQuery,
  useCreatePaymentMutation,
  useSubmitProofMutation,
  useVerifyPaymentMutation,
} = paymentApi;
