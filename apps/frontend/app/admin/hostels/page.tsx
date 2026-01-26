'use client';

import { useState } from 'react';
import { useGetOwnerHostelsQuery } from '@/lib/services/hostelApi'; // Note: check API method name
import { HiSearch, HiOfficeBuilding, HiLocationMarker, HiUser, HiPhone } from 'react-icons/hi';
import { useAppSelector } from '@/lib/hooks';

// We need to check if hostelApi uses 'getAllHostels' or 'getOwnerHostels' for admin.
// Inspecting hostelApi.ts... it has 'getOwnerHostels' which calls GET /hostels.
// The backend controller allows fetching all hostels if no filter is applied (or applies role-based filter).
// If I am Admin, calling GET /hostels will return all. 
// However, the RTK Query hook is named `useGetOwnerHostelsQuery`. I should probably rename it or just use it.
// Ideally, I should add a specific `useGetAllHostelsQuery` for clarity if needed, but the endpoint is likely the same.

import { baseApi } from '@/lib/services/api';

// Defining a custom hook for Admin Hostels if standard one is restricted or typed narrowly
const adminHostelApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllHostelsAdmin: builder.query<any, { search?: string; page?: number; limit?: number }>({
            query: (params) => ({
                url: '/hostels',
                method: 'GET',
                params
            }),
            providesTags: ['Hostel']
        })
    }),
    overrideExisting: false, 
});

const { useGetAllHostelsAdminQuery } = adminHostelApi;

export default function AdminHostelsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setTimeout(() => setPage(1), 0); // Reset page immediately on type
      // Simple debounce for query
      const handler = setTimeout(() => {
          setDebouncedSearch(e.target.value);
      }, 500);
      return () => clearTimeout(handler);
  };

  const { data, isLoading } = useGetAllHostelsAdminQuery({
    search: search || undefined,
    page,
    limit: 10
  });

  const hostelList = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hostel Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Directory of all hostels and their management</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="relative">
           <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
             type="text" 
             placeholder="Search by Hostel Name, City, Owner or Manager..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 focus:ring-2 focus:ring-[#2c1b13] focus:bg-white transition-all"
           />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
            <div className="p-12 text-center text-gray-500">Loading hostels...</div>
        ) : hostelList.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No hostels found matching your criteria.</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Hostel Details</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Owner</th>
                            <th className="px-6 py-4">Manager</th>
                            <th className="px-6 py-4 text-center">Stats</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {hostelList.map((hostel: any) => (
                            <tr key={hostel._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[#2c1b13]/10 flex items-center justify-center text-[#2c1b13] font-bold">
                                            <HiOfficeBuilding size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white">{hostel.name}</div>
                                            <div className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-1">
                                                {hostel.code}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                                        <HiLocationMarker className="text-gray-400" />
                                        {hostel.address?.city || 'N/A'}
                                    </div>
                                    <div className="text-xs text-gray-500 ml-5 truncate max-w-[150px]" title={hostel.address?.street}>
                                        {hostel.address?.street}
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    {hostel.ownerId ? (
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                                <HiUser className="text-gray-400" /> {hostel.ownerId.name}
                                            </div>
                                            <div className="text-xs text-gray-500 ml-4">{hostel.ownerId.phone || 'No Phone'}</div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-red-400 italic">No Owner Linked</span>
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    {hostel.manager ? (
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                                <HiUser className="text-gray-400" /> {hostel.manager.name}
                                            </div>
                                            <div className="text-xs text-gray-500 ml-4">{hostel.manager.phoneNumber}</div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Unassigned</span>
                                    )}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <div className="text-xs space-y-1">
                                        <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full inline-block">
                                            {hostel.totalRooms} Rooms
                                        </div>
                                        <br />
                                        <div className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full inline-block">
                                            {hostel.totalBeds} Beds
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        hostel.isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${hostel.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {hostel.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* Pagination Logic */}
        {pagination && pagination.totalPages > 1 && (
             <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <button 
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                    Previous
                </button>
                <div className="text-sm text-gray-500">
                    Page <span className="font-medium text-gray-900">{pagination.page}</span> of {pagination.totalPages}
                </div>
                <button
                  disabled={!pagination.hasNext}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                    Next
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
