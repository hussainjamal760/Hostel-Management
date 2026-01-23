'use client';

import { useGetOwnerHostelsQuery } from '@/lib/services/hostelApi';
import { useGetStudentStatsQuery } from '@/lib/services/studentApi';
import { useAppSelector } from '@/lib/hooks';
import { HiOutlineHome, HiOutlineUserGroup, HiOutlineOfficeBuilding, HiOutlineCurrencyDollar, HiOutlineExclamationCircle, HiOutlineCheckCircle } from 'react-icons/hi';
import Link from 'next/link';
import DashboardCharts from './DashboardCharts';

export default function ManagerDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: hostelsResponse, isLoading: isLoadingHostels } = useGetOwnerHostelsQuery();
  const hostels = hostelsResponse?.data || [];
  
  const { data: statsResponse, isLoading: isLoadingStats } = useGetStudentStatsQuery(user?.hostelId!, {
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

  const totalHostels = hostels.length;
  const totalBeds = hostels.reduce((acc, h) => acc + h.totalBeds, 0);
  // const totalRooms = hostels.reduce((acc, h) => acc + h.totalRooms, 0);
  
  if (isLoadingHostels || isLoadingStats) {
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
        {/* Total Students */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalStudents}</h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
              <HiOutlineUserGroup size={24} />
            </div>
          </div>
        </div>
        
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

        {/* Due Students */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fee Due</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.dueStudents}</h3>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
              <HiOutlineExclamationCircle size={24} />
            </div>
          </div>
        </div>

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

      <DashboardCharts 
        stats={{
            ...stats,
            totalStudents: stats.currentOccupancy // Use room occupancy as truth or keep student count? Student count = active students. Occupied beds = room property. Ideally they match. Let's pass the whole stats object if needed, but the chart props expects specific fields.
            // Actually, DashboardCharts takes 'stats' and 'totalBeds'.
            // Let's pass totalCapacity as totalBeds.
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
