'use client';

import { useGetOwnerHostelsQuery } from '@/lib/services/hostelApi';
import { useGetStudentStatsQuery, useGetDashboardAnalyticsQuery } from '@/lib/services/studentApi';
import { useAppSelector } from '@/lib/hooks';
import { HiOutlineHome, HiOutlineUserGroup, HiOutlineOfficeBuilding, HiOutlineCurrencyDollar, HiOutlineExclamationCircle, HiOutlineCheckCircle } from 'react-icons/hi';
import Link from 'next/link';
import DashboardCharts from './DashboardCharts';
import RevenueLineChart from './RevenueLineChart';
import ActionCenterWidget from './ActionCenterWidget';

export default function ManagerDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: hostelsResponse, isLoading: isLoadingHostels } = useGetOwnerHostelsQuery();
  const hostels = hostelsResponse?.data || [];
  
  const { data: statsResponse, isLoading: isLoadingStats } = useGetStudentStatsQuery(user?.hostelId!, {
    skip: !user?.hostelId
  });

  const { data: analyticsResponse, isLoading: isLoadingAnalytics } = useGetDashboardAnalyticsQuery(user?.hostelId!, {
    skip: !user?.hostelId
  });

  const stats = statsResponse?.data || {
    totalStudents: 0,
    paidStudents: 0,
    dueStudents: 0,
    totalCollected: 0,
    totalRemaining: 0,
    totalCapacity: 0,
    currentOccupancy: 0
  };

  const analytics = analyticsResponse?.data || {
      actionCenter: {
          pendingPayments: 0,
          openComplaints: 0
      },
      revenueChart: []
  };

  const totalHostels = hostels.length;
  // const totalBeds = hostels.reduce((acc, h) => acc + h.totalBeds, 0);

  // Calculate available beds for widget
  const availableBeds = Math.max(0, stats.totalCapacity - stats.currentOccupancy);
  
  if (isLoadingHostels || isLoadingStats || isLoadingAnalytics) {
    return (
       <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, Manager!</h2>
        <p className="text-gray-500 dark:text-gray-400">Here is the overview of your hostel.</p>
      </div>

      {/* Stats Grid */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Student & Fee Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Total Students - Clickable */}
        <Link href="/manager/students" className="block transition-transform hover:scale-105">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer h-full">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalStudents}</h3>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                <HiOutlineUserGroup size={24} />
                </div>
            </div>
            {/* Occupancy Mini-Bar */}
            <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Occupancy</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                        {stats.totalCapacity > 0 ? Math.round((stats.currentOccupancy / stats.totalCapacity) * 100) : 0}%
                    </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 dark:bg-gray-700 overflow-hidden">
                    <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                        style={{ width: `${stats.totalCapacity > 0 ? (stats.currentOccupancy / stats.totalCapacity) * 100 : 0}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{stats.currentOccupancy} / {stats.totalCapacity} Beds</p>
            </div>
            </div>
        </Link>
        
        {/* Paid Students */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Paid Students</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.paidStudents}</h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
              <HiOutlineCheckCircle size={24} />
            </div>
          </div>
        </div>

        {/* Due Students - Clickable */}
        <Link href="/manager/students?status=DUE" className="block transition-transform hover:scale-105">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer h-full">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fee Due</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.dueStudents}</h3>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                <HiOutlineExclamationCircle size={24} />
                </div>
            </div>
            <p className="text-xs text-orange-500 mt-2 font-medium">Click to view defaulters</p>
            </div>
        </Link>

        {/* Total Collected */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Collected</p>
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">Rs {stats.totalCollected.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
              <HiOutlineCurrencyDollar size={24} />
            </div>
          </div>
        </div>

        {/* Total Remaining */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining</p>
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">Rs {stats.totalRemaining.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
              <HiOutlineCurrencyDollar size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
              <RevenueLineChart data={analytics.revenueChart} />
          </div>
          <div className="lg:col-span-1">
              <ActionCenterWidget 
                  pendingPayments={analytics.actionCenter.pendingPayments}
                  openComplaints={analytics.actionCenter.openComplaints}
                  availableBeds={availableBeds}
              />
          </div>
      </div>

      <DashboardCharts 
        stats={{
            ...stats,
            totalStudents: stats.currentOccupancy
        }} 
        totalBeds={stats.totalCapacity} 
      />

      {/* Hostels List */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Assigned Hostels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {hostels.map(hostel => (
             <div key={hostel._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
               <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-lg">{hostel.name}</h4>
                    <p className="text-sm text-gray-500">{hostel.address.city}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${hostel.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {hostel.isActive ? 'Active' : 'Inactive'}
                  </span>
               </div>
               <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                 <div className="flex justify-between">
                    <span>Rooms:</span>
                    <span className="font-medium">{hostel.totalRooms}</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Beds:</span>
                    <span className="font-medium">{hostel.totalBeds}</span>
                 </div>
               </div>
             </div>
           ))}
           {hostels.length === 0 && (
             <p className="text-gray-500">No hostels found.</p>
           )}
        </div>
      </div>
    </div>
  );
}
