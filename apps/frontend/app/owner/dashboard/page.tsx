'use client';

import { useGetOwnerHostelsQuery, useGetHostelStatsQuery } from '@/lib/services/hostelApi';
import CreateHostelForm from '@/components/hostel/CreateHostelForm';
import OwnerStatsCard from '../components/OwnerStatsCard';
import QuickActionHub from '../components/QuickActionHub';
import ActivityFeedWidget from '../components/ActivityFeedWidget';
import { useState } from 'react';
import { 
    HiOutlineOfficeBuilding, 
    HiOutlineUsers, 
    HiOutlineCurrencyDollar, 
    HiOutlineClock, 
    HiOutlineExclamationCircle 
} from 'react-icons/hi';
import OwnerCharts from '../components/OwnerCharts';

export default function OwnerDashboard() {
  // State for filter
  const [selectedHostelId, setSelectedHostelId] = useState<string>('ALL');

  const { data: hostelResponse, isLoading: isHostelLoading } = useGetOwnerHostelsQuery();
  const hasHostel = hostelResponse?.data && hostelResponse.data.length > 0;

  // Pass selectedHostelId to stats query (if ALL, pass undefined)
  const statsQueryArg = selectedHostelId === 'ALL' ? undefined : { hostelId: selectedHostelId };
  
  const { data: statsResponse, isLoading: isStatsLoading } = useGetHostelStatsQuery(statsQueryArg, {
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
      {/* Header with Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Dashboard</h1>
           <p className="text-gray-500">Overview of your hostel performance</p>
        </div>
        
        {hostelResponse?.data && hostelResponse.data.length > 0 && (
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Filter by:</span>
                <select 
                    value={selectedHostelId}
                    onChange={(e) => setSelectedHostelId(e.target.value)}
                    className="bg-white dark:bg-dark-card border border-brand-primary/20 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                    <option value="ALL">All Hostels</option>
                    {hostelResponse.data.map(hostel => (
                        <option key={hostel._id} value={hostel._id}>{hostel.name}</option>
                    ))}
                </select>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Stats Column (2/3 width on large screens) */}
          <div className="xl:col-span-2 space-y-6">
             {isStatsLoading ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                    ))}
                 </div>
              ) : stats ? (
                <>
                    {/* Key Efficiency Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            title="Pending Dues (This Month)"
                            value={formatCurrency(stats.currentMonthPending || 0)}
                            icon={HiOutlineClock}
                            iconBg="bg-orange-500"
                            change="Current Month"
                            changeType={(stats.currentMonthPending || 0) > 0 ? 'negative' : 'positive'}
                        />
                         <OwnerStatsCard 
                            title="Pending Complaints"
                            value={stats.pendingComplaints}
                            icon={HiOutlineExclamationCircle}
                            iconBg="bg-red-500"
                            change="Open Issues"
                            changeType={stats.pendingComplaints > 0 ? 'negative' : 'positive'}
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

                    {/* Charts Section */}
                    <OwnerCharts 
                        revenueData={stats.monthlyRevenue || []} 
                        complaintsData={stats.complaintsBreakdown || { open: 0, inProgress: 0, resolved: 0 }} 
                    />
                </>
              ) : (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-100">
                   No stats available at the moment.
                </div>
              )}
          </div>

          {/* Right Sidebar Column (1/3 width) - New Widgets */}
          <div className="space-y-6">
             <QuickActionHub />
             <ActivityFeedWidget />
          </div>
      </div>
    </div>
  );
}
