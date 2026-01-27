import { baseApi } from './api';
import { ApiResponse } from './authApi';

export interface HostelPayment {
    _id: string;
    hostelId: { _id: string; name: string };
    amount: number;
    studentCount: number;
    ratePerStudent: number;
    month: number;
    year: number;
    status: 'PENDING' | 'COMPLETED';
    paidAt?: string;
    createdAt: string;
}

export const adminPaymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateInvoice: builder.mutation<ApiResponse<HostelPayment>, { hostelId: string; month: number; year: number }>({
      query: (data) => ({
        url: '/admin-payments/generate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AdminPayment', 'Hostel'],
    }),
    markAsPaid: builder.mutation<ApiResponse<HostelPayment>, string>({
      query: (id) => ({
        url: `/admin-payments/${id}/pay`,
        method: 'PATCH',
      }),
      invalidatesTags: ['AdminPayment'],
    }),
    updateSubscriptionRate: builder.mutation<ApiResponse<any>, { hostelId: string; rate: number }>({
      query: ({ hostelId, rate }) => ({
        url: `/admin-payments/hostels/${hostelId}/rate`,
        method: 'PATCH',
        body: { rate },
      }),
      invalidatesTags: ['Hostel'],
    }),
    getPendingPayments: builder.query<ApiResponse<HostelPayment[]>, { hostelId?: string }>({
      query: (params) => ({
        url: '/admin-payments/pending',
        method: 'GET',
        params,
      }),
      providesTags: ['AdminPayment'],
    }),
    getAdminStats: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: '/admin-payments/stats',
        method: 'GET',
      }),
      providesTags: ['AdminPayment'],
    }),
  }),
});

export const {
  useGenerateInvoiceMutation,
  useMarkAsPaidMutation,
  useUpdateSubscriptionRateMutation,
  useGetPendingPaymentsQuery,
  useGetAdminStatsQuery
} = adminPaymentApi;
