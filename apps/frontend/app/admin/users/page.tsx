'use client';

import { useState } from 'react';
import { useGetAllUsersQuery, useUpdateUserMutation, useDeleteUserMutation, useBulkDeleteUsersMutation, useLazyGetAllUsersQuery } from '@/lib/services/userApi';
import { HiSearch, HiUserGroup, HiAcademicCap, HiOfficeBuilding, HiBriefcase, HiTrash, HiDownload, HiBan, HiCheckCircle, HiDocumentText } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'STUDENT' | 'OWNER' | 'MANAGER'>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading } = useGetAllUsersQuery({
    role: activeTab === 'ALL' ? undefined : activeTab,
    search: search === '' ? undefined : search,
    page,
    limit: 10
  });

  const [triggerGetAllUsers] = useLazyGetAllUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [bulkDelete] = useBulkDeleteUsersMutation();

  const users = data?.data || [];
  const pagination = data?.pagination;

  const fetchAllUsersForExport = async () => {
      try {
          setIsExporting(true);
          const result = await triggerGetAllUsers({
             role: activeTab === 'ALL' ? undefined : activeTab,
             search: search === '' ? undefined : search,
             page: 1,
             limit: 10000 // Fetch all for export
          }).unwrap();
          return result.data;
      } catch (error) {
          toast.error('Failed to fetch data for export');
          return [];
      } finally {
          setIsExporting(false);
      }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          setSelectedUsers(users.map((u: any) => u._id));
      } else {
          setSelectedUsers([]);
      }
  };

  const handleSelectUser = (id: string) => {
      setSelectedUsers(prev => 
        prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
      );
  };

  const handleBulkDelete = async () => {
      if (!confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) return;
      try {
          await bulkDelete(selectedUsers).unwrap();
          toast.success('Users deleted successfully');
          setSelectedUsers([]);
      } catch (err) {
          toast.error('Failed to delete users');
      }
  };

  const handleStatusChange = async (id: string, currentStatus: boolean) => {
      try {
          await updateUser({ id, data: { isActive: !currentStatus } as any }).unwrap(); 
          toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
      } catch (err) {
          toast.error('Failed to update status');
      }
  };

  const handleExportCSV = async () => {
      const allUsers = await fetchAllUsersForExport();
      if (!allUsers.length) return;
      
      const headers = ['Name', 'Email', 'Role', 'Phone', 'Status', 'Hostel', 'Details'];
      const rows = allUsers.map((u: any) => [
          u.name, 
          u.email, 
          u.role, 
          u.phone, 
          u.isActive ? 'Active' : 'Inactive',
          u.profile?.hostelId?.name || '-',
          u.role === 'STUDENT' ? `Room ${u.profile?.roomId?.roomNumber || '-'}` : (u.role === 'OWNER' ? `${u.stats?.totalHostels || 0} Hostels` : '-')
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
          + headers.join(",") + "\n" 
          + rows.map((e: any) => e.join(",")).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleExportPDF = async () => {
      const allUsers = await fetchAllUsersForExport();
      if (!allUsers.length) return;

      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(18);
      doc.text('User List', 14, 22);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Total Users: ${allUsers.length}`, 14, 35);

      const tableColumn = ["Name", "Email", "Role", "Phone", "Status", "Hostel Info"];
      const tableRows: any[] = [];

      allUsers.forEach((user: any) => {
          const hostelInfo = user.profile?.hostelId?.name 
            ? `${user.profile.hostelId.name} (${user.profile?.address?.city || ''})`
            : user.role === 'OWNER' ? `${user.stats?.totalHostels || 0} Hostels` : '-';

          const rowData = [
              user.name,
              user.email,
              user.role,
              user.phone,
              user.isActive ? 'Active' : 'Inactive',
              hostelInfo
          ];
          tableRows.push(rowData);
      });

      autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 40,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [44, 27, 19] } // #2c1b13
      });

      doc.save(`users_export_${new Date().toISOString().split('T')[0]}.pdf`);
  };

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
        
        <div className="flex items-center gap-2">
            {selectedUsers.length > 0 && (
                <button 
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                >
                    <HiTrash /> Delete ({selectedUsers.length})
                </button>
            )}
            
            <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button 
                    onClick={handleExportCSV}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-r border-gray-200 dark:border-gray-700 disabled:opacity-50"
                    title="Export CSV"
                >
                    <HiDownload /> CSV
                </button>
                <button 
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    title="Export PDF"
                >
                    <HiDocumentText /> PDF
                </button>
            </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 justify-between items-end">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setPage(1); setSelectedUsers([]); }}
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
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4 w-10">
                                <input 
                                    type="checkbox" 
                                    onChange={handleSelectAll}
                                    checked={users.length > 0 && selectedUsers.length === users.length}
                                    className="rounded border-gray-300 text-[#2c1b13] focus:ring-[#2c1b13]"
                                />
                            </th>
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
                            
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {users.map((user: any) => (
                            <tr key={user._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${selectedUsers.includes(user._id) ? 'bg-orange-50 dark:bg-orange-900/10' : ''}`}>
                                <td className="px-6 py-4">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedUsers.includes(user._id)}
                                        onChange={() => handleSelectUser(user._id)}
                                        className="rounded border-gray-300 text-[#2c1b13] focus:ring-[#2c1b13]"
                                    />
                                </td>
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

                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        user.isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end items-center gap-2">
                                        <button 
                                            onClick={() => handleStatusChange(user._id, user.isActive)}
                                            className={`text-xs px-2 py-1 rounded border transition-colors ${
                                                user.isActive 
                                                ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                                : 'border-green-200 text-green-600 hover:bg-green-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-1">
                                                {user.isActive ? <HiBan /> : <HiCheckCircle />}
                                                <span>{user.isActive ? 'Ban' : 'Activate'}</span>
                                            </div>
                                        </button>
                                    </div>
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
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                    Previous
                </button>
                <div className="text-sm text-gray-500">Page {pagination.page} of {pagination.totalPages}</div>
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
