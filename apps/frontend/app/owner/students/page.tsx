'use client';

import { useState } from 'react';
import { useGetStudentsQuery } from '@/lib/services/studentApi';
import { HiSearch, HiUser, HiOfficeBuilding, HiCurrencyRupee, HiCheckCircle, HiExclamationCircle, HiPrinter } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

export default function AllStudentsPage() {
  const [search, setSearch] = useState('');
  const [feeStatus, setFeeStatus] = useState('ALL');
  const [page, setPage] = useState(1);

  const { data: studentsResponse, isLoading } = useGetStudentsQuery({
    search: search || undefined,
    feeStatus: feeStatus !== 'ALL' ? feeStatus : undefined,
    page,
    limit: 10,
 } as any); 

  const students = studentsResponse?.data || [];
  const pagination = studentsResponse?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Students</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage students across all your hostels</p>
        </div>
        
        <div className="flex gap-2">
            <select 
                className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                value={feeStatus}
                onChange={(e) => { setFeeStatus(e.target.value); setPage(1); }}
            >
                <option value="ALL">All Fee Status</option>
                <option value="PAID">Paid</option>
                <option value="DUE">Due</option>
                <option value="OVERDUE">Overdue</option>
                <option value="PARTIAL">Partial</option>
            </select>
            
            <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search students..." 
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-10 pr-4 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-[#2c1b13]"
                />
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>No students found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 font-semibold">
                    <tr>
                        <th className="px-6 py-4">Student Info</th>
                        <th className="px-6 py-4">Hostel & Room</th>
                        <th className="px-6 py-4">Fee Status</th>
                        <th className="px-6 py-4 text-right">Dues / Paid</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {students.map((student: any) => (
                        <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm">
                                        {student.fullName ? student.fullName.charAt(0).toUpperCase() : <HiUser />}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{student.fullName}</div>
                                        <div className="text-xs text-gray-500">{student.phone}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-sm text-gray-900 dark:text-white font-medium">
                                    <HiOfficeBuilding className="text-gray-400" />
                                    {student.hostelId?.name || 'Unknown Hostel'}
                                </div>
                                <div className="text-xs text-gray-500 ml-5">
                                    Room {student.roomId?.roomNumber || 'N/A'} • {student.roomId?.roomType}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                    student.feeStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                                    student.feeStatus === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {student.feeStatus === 'PAID' ? <HiCheckCircle /> : <HiExclamationCircle />}
                                    {student.feeStatus}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                                    {student.feeStatus === 'PAID' 
                                        ? <span className="text-green-600">Paid: {student.monthlyFee}</span>
                                        : <span className="text-red-600">Due: {student.totalDue || student.monthlyFee}</span>
                                    }
                                </div>
                                <div className="text-xs text-gray-400">Rent: {student.monthlyFee}</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        )}
        
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
