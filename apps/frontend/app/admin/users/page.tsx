'use client';

import { useState } from 'react';
import { useGetAllUsersQuery } from '@/lib/services/userApi';
import { HiSearch, HiUserGroup, HiAcademicCap, HiOfficeBuilding, HiBriefcase } from 'react-icons/hi';

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'STUDENT' | 'OWNER' | 'MANAGER'>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllUsersQuery({
    role: activeTab === 'ALL' ? undefined : activeTab,
    search: search || undefined,
    page,
    limit: 10
  });

  const users = data?.data || [];
  const pagination = data?.pagination;

  const tabs = [
    { id: 'ALL', label: 'All Users', icon: HiUserGroup },
    { id: 'STUDENT', label: 'Students', icon: HiAcademicCap },
    { id: 'OWNER', label: 'Owners', icon: HiOfficeBuilding },
    { id: 'MANAGER', label: 'Managers', icon: HiBriefcase },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400">View and manage all system users</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 justify-between items-end">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#2c1b13] text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
           <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input
             type="text"
             placeholder="Search users..."
             value={search}
             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
             className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-[#2c1b13]"
           />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No users found.</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">User Info</th>
                            <th className="px-6 py-4">Role</th>
                            
                            {activeTab === 'STUDENT' && (
                                <>
                                    <th className="px-6 py-4">CNIC / Mobile</th>
                                    <th className="px-6 py-4">Hostel & Room</th>
                                    <th className="px-6 py-4">Rent</th>
                                </>
                            )}
                            
                            {activeTab === 'OWNER' && (
                                <>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Total Hostels</th>
                                </>
                            )}
                            
                            {activeTab === 'MANAGER' && (
                                <>
                                    <th className="px-6 py-4">CNIC / Mobile</th>
                                    <th className="px-6 py-4">Assigned Hostel</th>
                                    <th className="px-6 py-4">Salary</th>
                                </>
                            )}
                            
                            {activeTab === 'ALL' && <th className="px-6 py-4">Details</th>}
                            
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {users.map((user: any) => (
                            <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'OWNER' ? 'bg-blue-100 text-blue-700' :
                                        user.role === 'MANAGER' ? 'bg-amber-100 text-amber-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>

                                {/* STUDENT SPECIFIC */}
                                {activeTab === 'STUDENT' && (
                                    <>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="text-gray-900 dark:text-white">{user.profile?.cnic || 'N/A'}</div>
                                            <div className="text-gray-500 text-xs">{user.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-medium">{user.profile?.hostelId?.name || 'No Hostel'}</div>
                                            <div className="text-xs text-gray-500">
                                                {user.profile?.hostelId?.address?.city}
                                                {user.profile?.roomId?.roomNumber ? ` / Room ${user.profile.roomId.roomNumber}` : ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm">
                                            {user.profile?.monthlyFee ? `PKR ${user.profile.monthlyFee.toLocaleString()}` : '-'}
                                        </td>
                                    </>
                                )}

                                {/* OWNER SPECIFIC */}
                                {activeTab === 'OWNER' && (
                                    <>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="text-gray-900 dark:text-white">{user.phone}</div>
                                            <div className="text-xs text-gray-500">{user.profile?.address?.city || 'City N/A'}</div> 
                                            {/* Note: User model doesn't have address, might need to infer from hostels? Owner doesn't have explicit profile usually unless added? 
                                                Wait, my backend User schema doesn't have city. I'll just show what I have.
                                            */}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">
                                                {user.stats?.totalHostels || 0} Hostels
                                            </span>
                                        </td>
                                    </>
                                )}

                                {/* MANAGER SPECIFIC */}
                                {activeTab === 'MANAGER' && (
                                    <>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="text-gray-900 dark:text-white">{user.profile?.cnic || 'N/A'}</div>
                                            <div className="text-gray-500 text-xs">{user.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-medium">{user.profile?.hostelId?.name || 'Unassigned'}</div>
                                            <div className="text-xs text-gray-500">{user.profile?.hostelId?.address?.city}</div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm">
                                            {user.profile?.salary ? `PKR ${user.profile.salary.toLocaleString()}` : '-'}
                                        </td>
                                    </>
                                )}

                                {/* ALL TABS FALLBACK DETAILS */}
                                {activeTab === 'ALL' && (
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {user.role === 'STUDENT' && user.profile?.hostelId?.name}
                                        {user.role === 'MANAGER' && user.profile?.hostelId?.name}
                                        {user.role === 'OWNER' && `${user.stats?.totalHostels || 0} Hostels`}
                                    </td>
                                )}

                                <td className="px-6 py-4 text-right">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        user.isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
        
        {/* Simple Pagination */}
        {pagination && pagination.totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <button 
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-500">Page {pagination.page} of {pagination.totalPages}</span>
                <button
                  disabled={!pagination.hasNext}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
