'use client';

import { useGetOwnerHostelsQuery } from '@/lib/services/hostelApi';
import Link from 'next/link';
import { HiOutlinePencil, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineUserGroup, HiOutlineHome } from 'react-icons/hi';
import MapPicker from '@/components/ui/MapPicker';

export default function MyHostelPage() {
  const { data: hostelResponse, isLoading } = useGetOwnerHostelsQuery();
  const hostel = hostelResponse?.data?.[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">No Hostel Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">You haven't set up your hostel yet.</p>
        <Link 
          href="/owner/dashboard" 
          className="px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors shadow-lg"
        >
          Go to Dashboard to Create
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{hostel.name}</h1>
           <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
               hostel.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
           }`}>
               {hostel.isActive ? 'Active' : 'Inactive'}
           </span>
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 font-medium"
          onClick={() => alert("Edit functionality coming soon!")}
        >
          <HiOutlinePencil size={18} />
          Edit Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <HiOutlineHome className="text-brand-primary" />
                      Basic Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Hostel Code</p>
                          <p className="font-mono text-lg font-medium">{hostel.code}</p>
                      </div>
                      <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Rent</p>
                          <p className="text-lg font-medium text-brand-primary">₨ {hostel.monthlyRent.toLocaleString()}</p>
                      </div>
                      <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Contact Number</p>
                          <div className="flex items-center gap-2">
                              <HiOutlinePhone className="text-gray-400" />
                              <p className="text-lg font-medium">{hostel.phoneNumber}</p>
                          </div>
                      </div>
                  </div>
              </div>

               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <HiOutlineLocationMarker className="text-brand-primary" />
                      Location & Address
                  </h3>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                           <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                           <p className="text-lg">{hostel.address.street}</p>
                      </div>
                       <div>
                           <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                           <p className="text-lg">{hostel.address.city}</p>
                      </div>
                  </div>
                  {hostel.address.coordinates && (
                       <div className="h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 pointer-events-none opacity-90">
                            {/* Read-only map view by passing same correct props but maybe disabling interaction if supported by MapPicker or just showing it */}
                           <MapPicker 
                               coordinates={hostel.address.coordinates} 
                               onLocationChange={() => {}} 
                            />
                       </div>
                  )}
              </div>
          </div>

          <div className="space-y-6">
               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                   <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Capacity & Occupancy</h3>
                   <div className="space-y-4">
                       <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                           <div className="flex items-center gap-3">
                               <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                   <HiOutlineHome size={20} />
                               </div>
                               <span className="text-gray-600 dark:text-gray-300">Total Rooms</span>
                           </div>
                           <span className="font-bold text-xl">{hostel.totalRooms}</span>
                       </div>
                       <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                           <div className="flex items-center gap-3">
                               <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                   <HiOutlineUserGroup size={20} />
                               </div>
                               <span className="text-gray-600 dark:text-gray-300">Total Beds</span>
                           </div>
                           <span className="font-bold text-xl">{hostel.totalBeds}</span>
                       </div>
                   </div>
                   <div className="mt-6">
                        <p className="text-sm text-center text-gray-500">
                            Manage your rooms and beds in the setup section (Coming Soon)
                        </p>
                   </div>
               </div>
          </div>
      </div>
    </div>
  );
}
