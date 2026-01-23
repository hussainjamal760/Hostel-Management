'use client';

import { useGetOwnerHostelsQuery } from '@/lib/services/hostelApi';
import { HiOutlineHome, HiOutlineUserGroup, HiOutlineOfficeBuilding } from 'react-icons/hi';
import Link from 'next/link';

export default function ManagerDashboard() {
  const { data: hostelsResponse, isLoading } = useGetOwnerHostelsQuery();
  const hostels = hostelsResponse?.data || [];
  
  // Since we fetch "Owner Hostels" using manager's context, backend filters to allowed hostels (Owner's hostels)
  // For overview, we aggregate
  const totalHostels = hostels.length;
  const totalRooms = hostels.reduce((acc, h) => acc + h.totalRooms, 0);
  const totalBeds = hostels.reduce((acc, h) => acc + h.totalBeds, 0);

  if (isLoading) {
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
        <p className="text-gray-500 dark:text-gray-400">Here is the overview of the hostels you supervise.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Hostels</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalHostels}</h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
              <HiOutlineOfficeBuilding size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Rooms</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalRooms}</h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
              <HiOutlineHome size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Beds</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalBeds}</h3>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
              <HiOutlineUserGroup size={24} />
            </div>
          </div>
        </div>
      </div>

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
