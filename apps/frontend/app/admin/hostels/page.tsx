'use client';

import { useState } from 'react';
import { useGetOwnerHostelsQuery, useUpdateHostelMutation } from '@/lib/services/hostelApi';
import { HiSearch, HiOfficeBuilding, HiLocationMarker, HiUser, HiCurrencyDollar, HiCheckCircle, HiRefresh } from 'react-icons/hi';
import { useUpdateSubscriptionRateMutation, useGenerateInvoiceMutation, useMarkAsPaidMutation, useGetPendingPaymentsQuery } from '@/lib/services/adminPaymentApi';
import { toast } from 'react-hot-toast';

import { baseApi } from '@/lib/services/api';
const adminHostelApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllHostelsAdmin: builder.query<any, { search?: string; page?: number; limit?: number; isActive?: string | boolean }>({
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
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ACTIVE');
  
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [tempRate, setTempRate] = useState<number>(0);

  const { data, isLoading } = useGetAllHostelsAdminQuery({
    search: search || undefined,
    page,
    limit: 10,
    isActive: statusFilter === 'ALL' ? 'ALL' : statusFilter === 'ACTIVE' ? 'true' : 'false'
  });

  const { data: pendingResponse } = useGetPendingPaymentsQuery({});
  const pendingPayments = pendingResponse?.data || [];

  const [updateRate] = useUpdateSubscriptionRateMutation();
  const [generateInvoice] = useGenerateInvoiceMutation();
  const [markPaid] = useMarkAsPaidMutation();
  const [updateHostel] = useUpdateHostelMutation();

  const hostelList = data?.data || [];
  const pagination = data?.pagination;

  const handleUpdateRate = async (hostelId: string) => {
      try {
          await updateRate({ hostelId, rate: tempRate }).unwrap();
          toast.success('Rate updated successfully');
          setEditingRateId(null);
      } catch (err) {
          toast.error('Failed to update rate');
      }
  };

  const handleGenerateInvoice = async (hostelId: string) => {
      try {
          const now = new Date();
          await generateInvoice({ 
              hostelId, 
              month: now.getMonth() + 1, 
              year: now.getFullYear() 
          }).unwrap();
          toast.success('Invoice generated');
      } catch (err) {
          toast.error('Failed to generate invoice');
      }
  };

  const handleMarkPaid = async (paymentId: string) => {
      try {
          await markPaid(paymentId).unwrap();
          toast.success('Payment marked as received');
      } catch (err) {
          toast.error('Failed to mark paid');
      }
  };

  const getPendingForHostel = (hostelId: string) => {
      return pendingPayments.filter(p => p.hostelId._id === hostelId || (p.hostelId as any) === hostelId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hostel Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage hostels and platform fees</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 justify-between items-end">
         <div className="flex gap-2">
            {[
                { id: 'ALL', label: 'All Hostels' },
                { id: 'ACTIVE', label: 'Active' },
                { id: 'INACTIVE', label: 'Inactive' }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => { 
                        setStatusFilter(tab.id as any);
                        setPage(1);
                        if (tab.id === 'ALL') setSearch('');
                    }}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        statusFilter === tab.id
                        ? 'bg-[#2c1b13] text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
         </div>

        <div className="relative w-full md:w-64">
           <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
             type="text" 
             placeholder="Search active hostels..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-[#2c1b13]"
           />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
            <div className="p-12 text-center text-gray-500">Loading hostels...</div>
        ) : hostelList.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No hostels found.</div>
        ) : (
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">Hostel</th>
                            <th className="px-6 py-4">Owner</th>
                            <th className="px-6 py-4 text-center">Active Students</th>
                            <th className="px-6 py-4">Rate / Student</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {hostelList.map((hostel: any) => {
                            const pending = getPendingForHostel(hostel._id);
                            const hasPending = pending.length > 0;
                            const activeStudents = hostel.totalStudents || 0;
                            
                            return (
                            <tr key={hostel._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${!hostel.isActive ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900 dark:text-white">{hostel.name}</div>
                                    <div className="text-xs text-gray-500">{hostel.address?.city}</div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium">{hostel.ownerId?.name || 'No Owner'}</div>
                                    <div className="text-xs text-gray-500">{hostel.ownerId?.phone}</div>
                                </td>

                                <td className="px-6 py-4 text-center font-mono">
                                    {hostel.activeStudentCount ?? 'N/A'}
                                </td>

                                <td className="px-6 py-4">
                                    {editingRateId === hostel._id ? (
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                value={tempRate}
                                                onChange={(e) => setTempRate(Number(e.target.value))}
                                                className="w-20 px-2 py-1 border rounded text-sm"
                                            />
                                            <button onClick={() => handleUpdateRate(hostel._id)} className="text-green-600 font-bold text-xs">Save</button>
                                            <button onClick={() => setEditingRateId(null)} className="text-gray-400 text-xs">Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { setEditingRateId(hostel._id); setTempRate(hostel.subscriptionRate || 0); }}>
                                            <span className="font-mono font-bold text-brand-primary">
                                                PKR {hostel.subscriptionRate || 0}
                                            </span>
                                            <span className="opacity-0 group-hover:opacity-100 text-[10px] text-gray-400">Edit</span>
                                        </div>
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    <button 
                                        onClick={async () => {
                                            try {
                                                await updateHostel({ id: hostel._id, data: { isActive: !hostel.isActive } as any }).unwrap();
                                                toast.success(`Hostel ${!hostel.isActive ? 'activated' : 'deactivated'}`);
                                            } catch (err) {
                                                toast.error('Failed to update status');
                                            }
                                        }}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${
                                            hostel.isActive ? 'bg-brand-primary' : 'bg-gray-200'
                                        }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            hostel.isActive ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                    </button>
                                </td>

                                <td className="px-6 py-4">
                                     {hasPending ? (
                                         <div className="flex items-center gap-2">
                                             <div className="text-xs">
                                                <div className="text-red-500 font-bold">Due: PKR {pending[0].amount.toLocaleString()}</div>
                                                <div className="text-gray-400">{pending[0].studentCount} students</div>
                                             </div>
                                             <button 
                                                onClick={() => handleMarkPaid(pending[0]._id)}
                                                className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
                                                title="Mark as Received"
                                              >
                                                <HiCheckCircle /> Receive
                                              </button>
                                         </div>
                                     ) : hostel.currentMonthPaymentStatus === 'COMPLETED' ? (
                                         <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-lg text-xs font-bold border border-green-100">
                                             <HiCheckCircle className="text-sm" /> 
                                             Collected
                                         </div>
                                     ) : (
                                         <button 
                                            onClick={() => handleGenerateInvoice(hostel._id)}
                                            className="bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
                                            title="Generate Invoice for Current Month"
                                         >
                                            <HiCurrencyDollar /> Collect Fee
                                         </button>
                                     )}
                                </td>
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
            </div>
        )}
        
        {/* Pagination Logic */}
        {pagination && pagination.totalPages > 1 && (
             <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <button disabled={!pagination.hasPrev} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Previous</button>
                <div className="text-sm text-gray-500">Page {pagination.page} of {pagination.totalPages}</div>
                <button disabled={!pagination.hasNext} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded text-sm disabled:opacity-50">Next</button>
            </div>
        )}
      </div>
    </div>
  );
}
