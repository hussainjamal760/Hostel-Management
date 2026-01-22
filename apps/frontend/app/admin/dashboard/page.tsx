'use client';

import { useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  HiOutlineOfficeBuilding,
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
  HiOutlineExclamationCircle,
  HiOutlineTrendingDown,
  HiOutlineClock,
  HiOutlineFlag,
} from 'react-icons/hi';
import { useGetDashboardStatsQuery } from '@/lib/services/adminApi';
import StatsCard from '../components/StatsCard';
import {
  ChartCard,
  RevenueChart,
  OccupancyChart,
  RoomDistributionChart,
  PaymentStatusChart,
} from '../components/Charts';
import RecentActivity from '../components/RecentActivity';
import QuickActions from '../components/QuickActions';

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const { data: statsResponse, isLoading, error } = useGetDashboardStatsQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'ADMIN') {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-brand-text dark:text-dark-text">Loading...</div>
      </div>
    );
  }

  const stats = statsResponse?.data;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `₨ ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `₨ ${(amount / 1000).toFixed(0)}K`;
    }
    return `₨ ${amount}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-primary/80 dark:from-dark-primary/20 dark:to-dark-card rounded-2xl p-6 text-white dark:text-dark-text">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="mt-1 text-white/80 dark:text-dark-text/70">
          Here&apos;s your platform overview for today.
        </p>
      </div>

      {/* Stats Grid - 7 cards for the 7 metrics */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-brand-card/20 dark:bg-dark-card/20 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl">
          Failed to load dashboard stats. Please try again.
        </div>
      ) : (
        <>
          {/* First Row - 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Hostels Onboarded"
              value={stats?.totalHostelsOnboarded || 0}
              change={`${stats?.totalActiveHostels || 0} currently active`}
              changeType="neutral"
              icon={HiOutlineOfficeBuilding}
            />
            <StatsCard
              title="Total Active Hostels"
              value={stats?.totalActiveHostels || 0}
              change={stats?.recentTrends?.hostelsGrowth 
                ? `${stats.recentTrends.hostelsGrowth > 0 ? '+' : ''}${stats.recentTrends.hostelsGrowth}% this month`
                : 'Active on platform'}
              changeType={stats?.recentTrends?.hostelsGrowth && stats.recentTrends.hostelsGrowth > 0 ? 'positive' : 'neutral'}
              icon={HiOutlineOfficeBuilding}
              iconBg="bg-green-500"
            />
            <StatsCard
              title="Total Students"
              value={stats?.totalStudents?.toLocaleString() || 0}
              change={stats?.recentTrends?.studentsGrowth 
                ? `${stats.recentTrends.studentsGrowth > 0 ? '+' : ''}${stats.recentTrends.studentsGrowth}% growth`
                : 'Across all hostels'}
              changeType={stats?.recentTrends?.studentsGrowth && stats.recentTrends.studentsGrowth > 0 ? 'positive' : 'neutral'}
              icon={HiOutlineUsers}
              iconBg="bg-blue-500"
            />
            <StatsCard
              title="Monthly Recurring Revenue"
              value={formatCurrency(stats?.monthlyRecurringRevenue || 0)}
              change={stats?.recentTrends?.revenueGrowth 
                ? `${stats.recentTrends.revenueGrowth > 0 ? '+' : ''}${stats.recentTrends.revenueGrowth}% vs last month`
                : 'Current month MRR'}
              changeType={stats?.recentTrends?.revenueGrowth && stats.recentTrends.revenueGrowth > 0 ? 'positive' : 'negative'}
              icon={HiOutlineCurrencyDollar}
              iconBg="bg-emerald-500"
            />
          </div>

          {/* Second Row - 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard
              title="Churned Hostels"
              value={stats?.churnedHostels || 0}
              change="Left the platform"
              changeType="negative"
              icon={HiOutlineTrendingDown}
              iconBg="bg-red-500"
            />
            <StatsCard
              title="Pending Payments"
              value={stats?.pendingPayments || 0}
              change={`${formatCurrency(stats?.pendingPaymentsAmount || 0)} outstanding`}
              changeType="negative"
              icon={HiOutlineClock}
              iconBg="bg-amber-500"
            />
            <StatsCard
              title="Flagged Hostels"
              value={stats?.flaggedHostels || 0}
              change="Have open complaints"
              changeType={stats?.flaggedHostels && stats.flaggedHostels > 0 ? 'negative' : 'positive'}
              icon={HiOutlineFlag}
              iconBg="bg-orange-500"
            />
          </div>
        </>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Overview">
          <RevenueChart monthlyData={stats?.monthlyRevenue} />
        </ChartCard>
        <ChartCard title="Hostels by City">
          <OccupancyChart cityData={stats?.hostelsByCity} />
        </ChartCard>
      </div>

      {/* Charts Row 2 + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ChartCard title="Payment Status">
            <PaymentStatusChart 
              pendingPayments={stats?.pendingPayments || 0}
              totalStudents={stats?.totalStudents || 0}
            />
          </ChartCard>
          <ChartCard title="Hostel Status">
            <RoomDistributionChart 
              active={stats?.totalActiveHostels || 0}
              churned={stats?.churnedHostels || 0}
            />
          </ChartCard>
          <div className="sm:col-span-2">
            <QuickActions />
          </div>
        </div>
        <div>
          <RecentActivity activities={stats?.recentActivity} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
