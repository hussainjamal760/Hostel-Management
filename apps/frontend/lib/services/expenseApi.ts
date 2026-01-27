import { baseApi } from './api';

export const expenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createExpense: builder.mutation<any, FormData>({
        query: (formData) => ({
            url: '/expenses',
            method: 'POST',
            body: formData
        }),
        invalidatesTags: ['Expense', 'HostelStats']
    }),
    getExpenses: builder.query<any, { hostelId?: string; status?: string; page?: number; limit?: number; category?: string }>({
        query: (params) => ({
            url: '/expenses',
            method: 'GET',
            params
        }),
        providesTags: ['Expense']
    }),
    updateExpenseStatus: builder.mutation<any, { id: string; status: 'APPROVED' | 'REJECTED'; reason?: string }>({
        query: ({ id, ...data }) => ({
            url: `/expenses/${id}/status`,
            method: 'PATCH',
            body: data
        }),
        invalidatesTags: ['Expense', 'HostelStats']
    }),
    getExpenseStats: builder.query<any, string | undefined>({
        query: (hostelId) => ({
            url: '/expenses/stats',
            params: { hostelId }
        }),
        providesTags: ['Expense', 'HostelStats']
    })
  })
});

export const {
    useCreateExpenseMutation,
    useGetExpensesQuery,
    useUpdateExpenseStatusMutation,
    useGetExpenseStatsQuery
} = expenseApi;
