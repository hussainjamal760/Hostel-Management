import { baseApi as api } from './api';

export interface PaymentCard {
  _id: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  instructions: string;
  createdAt: string;
}

export const paymentCardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentCards: builder.query<{ success: boolean; data: PaymentCard[] }, void>({
      query: () => '/payment-cards',
      providesTags: ['PaymentCard'],
    }),
    createPaymentCard: builder.mutation<{ success: boolean; data: PaymentCard }, Partial<PaymentCard>>({
      query: (data) => ({
        url: '/payment-cards',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PaymentCard'],
    }),
    deletePaymentCard: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/payment-cards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PaymentCard'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPaymentCardsQuery,
  useCreatePaymentCardMutation,
  useDeletePaymentCardMutation,
} = paymentCardApi;
