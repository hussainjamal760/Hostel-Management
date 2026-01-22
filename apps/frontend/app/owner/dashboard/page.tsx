'use client';

import { useGetOwnerHostelsQuery, useGetHostelStatsQuery } from '@/lib/services/hostelApi';
import CreateHostelForm from '@/components/hostel/CreateHostelForm';
import DashboardStats from '@/components/dashboard/DashboardStats';

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

  const statsData = statsResponse?.data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500">Overview of your hostel performance</p>
      </div>

      {isStatsLoading ? (
         <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
         </div>
      ) : statsData ? (
        <DashboardStats stats={statsData} />
      ) : (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg">
          No stats available.
        </div>
      )}
    </div>
  );
}
