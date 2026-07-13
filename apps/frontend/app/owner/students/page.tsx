'use client';

import { useState } from 'react';
import { useGetStudentsQuery } from '@/lib/services/studentApi';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-1">Student Directory</h2>
          <p className="text-on-surface-variant font-body-md opacity-80">View and manage students across all your properties</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors pointer-events-none">search</span>
                <input 
                    type="text" 
                    placeholder="Search by name or phone..." 
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-full sm:w-64 pl-12 pr-4 py-3.5 rounded-2xl border-2 border-outline-variant/50 bg-surface focus:border-primary focus:ring-0 transition-all text-primary font-body-md hover:border-outline-variant"
                />
            </div>
            
            <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors pointer-events-none z-10">filter_list</span>
                <select 
                    className="w-full sm:w-48 pl-12 pr-10 py-3.5 rounded-2xl border-2 border-outline-variant/50 bg-surface focus:border-primary focus:ring-0 transition-all text-primary font-body-md hover:border-outline-variant appearance-none cursor-pointer"
                    value={feeStatus}
                    onChange={(e) => { setFeeStatus(e.target.value); setPage(1); }}
                >
                    <option value="ALL">All Fee Status</option>
                    <option value="PAID">Paid Only</option>
                    <option value="DUE">Due Only</option>
                    <option value="OVERDUE">Overdue Only</option>
                    <option value="PARTIAL">Partial Only</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-on-surface-variant/70">expand_more</span>
            </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center">
             <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
             <p className="text-on-surface-variant font-label-md uppercase tracking-widest">Loading student records...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-16 text-center text-on-surface-variant flex flex-col items-center">
            <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">person_search</span>
            <p className="font-headline-sm text-primary mb-1">No students found</p>
            <p className="font-body-md">Try adjusting your search or filter settings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low text-[11px] uppercase text-on-surface-variant font-label-lg tracking-widest">
                    <tr>
                        <th className="px-8 py-5 whitespace-nowrap">Student Profile</th>
                        <th className="px-8 py-5 whitespace-nowrap">Property & Room</th>
                        <th className="px-8 py-5 whitespace-nowrap">Fee Status</th>
                        <th className="px-8 py-5 text-right whitespace-nowrap">Financials</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                    {students.map((student: any) => (
                        <tr key={student._id} className="hover:bg-surface-container-lowest transition-colors group">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-headline-sm uppercase border border-primary/20">
                                        {student.fullName ? student.fullName.charAt(0) : <span className="material-symbols-outlined">person</span>}
                                    </div>
                                    <div>
                                        <div className="font-headline-sm text-primary mb-1 group-hover:text-primary transition-colors">{student.fullName}</div>
                                        <div className="text-xs font-label-md text-on-surface-variant tracking-wider">{student.phone}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-2 text-sm text-primary font-medium mb-1">
                                    <span className="material-symbols-outlined text-[18px] text-outline-variant">domain</span>
                                    {student.hostelId?.name || 'Unknown Hostel'}
                                </div>
                                <div className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-widest pl-[26px]">
                                    Room {student.roomId?.roomNumber || 'N/A'} <span className="mx-1">•</span> {student.roomId?.roomType || 'Standard'}
                                </div>
                            </td>
                            <td className="px-8 py-5">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                    student.feeStatus === 'PAID' ? 'bg-green-100 text-green-700 border-green-200' :
                                    student.feeStatus === 'OVERDUE' ? 'bg-red-100 text-red-700 border-red-200' :
                                    student.feeStatus === 'PARTIAL' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                    'bg-orange-100 text-orange-700 border-orange-200'
                                }`}>
                                    <span className="material-symbols-outlined text-[14px]">
                                      {student.feeStatus === 'PAID' ? 'check_circle' : 
                                       student.feeStatus === 'OVERDUE' ? 'error' : 
                                       student.feeStatus === 'PARTIAL' ? 'timelapse' : 'schedule'}
                                    </span>
                                    {student.feeStatus}
                                </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <div className="text-sm font-mono font-bold mb-1">
                                    {student.feeStatus === 'PAID' 
                                        ? <span className="text-green-600">{formatCurrency(student.monthlyFee)}</span>
                                        : <span className="text-error">{formatCurrency(student.totalDue || student.monthlyFee)}</span>
                                    }
                                </div>
                                <div className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-widest">
                                  Base Rent: {formatCurrency(student.monthlyFee)}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        )}
        
        {pagination && pagination.totalPages > 1 && (
             <div className="p-6 border-t border-outline-variant/50 bg-surface-container-low/50 flex justify-between items-center">
                <button 
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 bg-surface border border-outline-variant rounded-xl text-[11px] font-label-lg uppercase tracking-widest disabled:opacity-50 hover:bg-surface-container transition-colors flex items-center gap-1 text-primary"
                >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span> Prev
                </button>
                <div className="text-sm font-label-md text-on-surface-variant uppercase tracking-widest">
                    Page <span className="font-bold text-primary mx-1">{pagination.page}</span> of {pagination.totalPages}
                </div>
                <button
                  disabled={!pagination.hasNext}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-surface border border-outline-variant rounded-xl text-[11px] font-label-lg uppercase tracking-widest disabled:opacity-50 hover:bg-surface-container transition-colors flex items-center gap-1 text-primary"
                >
                    Next <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
            </div>
        )}
      </div>
    </div>
  );
}
