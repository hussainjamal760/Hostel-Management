'use client';

import { useGetOwnerHostelsQuery, useGetHostelStatsQuery } from '@/lib/services/hostelApi';
import CreateHostelForm from '@/components/hostel/CreateHostelForm';
import OwnerStatsCard from '../components/OwnerStatsCard';
import { 
    HiOutlineOfficeBuilding, 
    HiOutlineUsers, 
    HiOutlineCurrencyDollar, 
    HiOutlineClock, 
    HiOutlineExclamationCircle 
} from 'react-icons/hi';
import OwnerCharts from '../components/OwnerCharts';

export default function OwnerDashboard() {
  const { data: hostelResponse, isLoading: isHostelLoading } = useGetOwnerHostelsQuery();
  const hasHostel = hostelResponse?.data && hostelResponse.data.length > 0;

  const { data: statsResponse, isLoading: isStatsLoading } = useGetHostelStatsQuery(undefined, {
    skip: !hasHostel,
  });

  if (isHostelLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!hasHostel) {
    return (
      <div className="container mx-auto max-w-5xl">
         <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome, Owner!</h1>
            <p className="text-gray-600 dark:text-gray-400">Let's get started by setting up your first hostel.</p>
         </div>
         <CreateHostelForm />
      </div>
    );
  }

  const stats = statsResponse?.data;

  // Formatting currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `₨ ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `₨ ${(amount / 1000).toFixed(0)}K`;
    }
    return `₨ ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500">Overview of your hostel performance</p>
      </div>

      {isStatsLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
            ))}
         </div>
      ) : stats ? (
        <div className="space-y-6">
            {/* Key Efficiency Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <OwnerStatsCard 
                    title="Total Hostels"
                    value={stats.totalHostels}
                    icon={HiOutlineOfficeBuilding}
                    iconBg="bg-blue-500"
                    change={`${stats.totalRooms} Rooms / ${stats.totalBeds} Beds`}
                    changeType="neutral"
                />
                <OwnerStatsCard 
                    title="Total Students"
                    value={stats.totalStudents}
                    icon={HiOutlineUsers}
                    iconBg="bg-purple-500"
                    change={`Occupancy: ${stats.occupancyRate}%`}
                    changeType={stats.occupancyRate > 80 ? 'positive' : 'neutral'}
                />
                <OwnerStatsCard 
                    title="Total Collected Revenue"
                    value={formatCurrency(stats.revenue)}
                    icon={HiOutlineCurrencyDollar}
                    iconBg="bg-green-500"
                    change="Lifetime Earnings"
                    changeType="positive"
                />
                <OwnerStatsCard 
                    title="Current Month Revenue"
                    value={formatCurrency(stats.currentMonthRevenue || 0)}
                    icon={HiOutlineCurrencyDollar}
                    iconBg="bg-emerald-500"
                    change="This Month"
                    changeType="positive"
                />
                <OwnerStatsCard 
                    title="Pending Dues (This Month)"
                    value={formatCurrency(stats.currentMonthPending || 0)}
                    icon={HiOutlineClock}
                    iconBg="bg-orange-500"
                    change="Current Month"
                    changeType={(stats.currentMonthPending || 0) > 0 ? 'negative' : 'positive'}
                />
                <OwnerStatsCard 
                    title="Total Remaining Dues"
                    value={formatCurrency(stats.totalRemaining || 0)}
                    icon={HiOutlineClock}
                    iconBg="bg-amber-500"
                    change="Pending Payments"
                    changeType={(stats.totalRemaining || 0) > 0 ? 'negative' : 'positive'}
                />
            </div>

            {/* Additional Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <OwnerStatsCard 
                    title="Pending Complaints"
                    value={stats.pendingComplaints}
                    icon={HiOutlineExclamationCircle}
                    iconBg="bg-red-500"
                    change="Open Issues"
                    changeType={stats.pendingComplaints > 0 ? 'negative' : 'positive'}
                />
            </div>

            {/* Charts Section */}
            <OwnerCharts 
                revenueData={stats.monthlyRevenue || []} 
                complaintsData={stats.complaintsBreakdown || { open: 0, inProgress: 0, resolved: 0 }} 
            />
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-100">
           No stats available at the moment.
        </div>
      )}
    </div>
  );
}
