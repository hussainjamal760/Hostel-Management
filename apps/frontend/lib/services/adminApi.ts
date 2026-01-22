import { baseApi } from './api';

export interface RecentActivity {
  id: string;
  type: 'user' | 'payment' | 'complaint' | 'hostel';
  message: string;
  time: string;
  createdAt: string;
}

export interface DashboardStats {
  totalHostelsOnboarded: number;
  totalActiveHostels: number;
  totalStudents: number;
  monthlyRecurringRevenue: number;
  churnedHostels: number;
  pendingPayments: number;
  pendingPaymentsAmount: number;
  flaggedHostels: number;
  recentTrends: {
    hostelsGrowth: number;
    studentsGrowth: number;
    revenueGrowth: number;
  };
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  hostelsByCity: Array<{ city: string; count: number }>;
  recentActivity: RecentActivity[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => '/admin/dashboard/stats',
      providesTags: ['Hostel', 'Student', 'Payment', 'Complaint'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = adminApi;
