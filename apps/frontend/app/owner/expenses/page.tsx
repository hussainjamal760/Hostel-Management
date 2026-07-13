'use client';

import React, { useState } from 'react';
import { useGetExpensesQuery, useUpdateExpenseStatusMutation } from '@/lib/services/expenseApi';
import { useGetOwnerHostelsQuery } from '@/lib/services/hostelApi';
import ExpenseStatusBadge from '@/components/ExpenseStatusBadge';
import { toast } from 'react-hot-toast';

export default function OwnerExpensesPage() {
  const [selectedHostelId, setSelectedHostelId] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'PENDING' | 'HISTORY'>('PENDING');
  const [rejectionModalApi, setRejectionModalApi] = useState<{ open: boolean; expenseId: string | null }>({ open: false, expenseId: null });
  const [rejectionReason, setRejectionReason] = useState('');

  const { data: hostelsResponse } = useGetOwnerHostelsQuery();
  const hostels = hostelsResponse?.data || [];
  
  const queryParams = {
    hostelId: selectedHostelId === 'ALL' ? undefined : selectedHostelId,
    status: activeTab === 'PENDING' ? 'PENDING' : undefined,
    limit: 50
  };

  const { data: expensesResponse, isLoading, refetch } = useGetExpensesQuery(queryParams);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateExpenseStatusMutation();

  const expenses = expensesResponse?.data || [];

  const handleApprove = async (id: string) => {
    try {
        await updateStatus({ id, status: 'APPROVED' }).unwrap();
        toast.success('Expense approved successfully');
        refetch();
    } catch (err: any) {
        toast.error('Failed to approve expense');
    }
  };

  const handleRejectClick = (id: string) => {
      setRejectionModalApi({ open: true, expenseId: id });
  };

  const submitRejection = async () => {
      if (!rejectionModalApi.expenseId) return;
      if (!rejectionReason) return toast.error('Please provide a reason');

      try {
          await updateStatus({ 
              id: rejectionModalApi.expenseId, 
              status: 'REJECTED', 
              reason: rejectionReason 
          }).unwrap();
          toast.success('Expense rejected');
          setRejectionModalApi({ open: false, expenseId: null });
          setRejectionReason('');
          refetch();
      } catch (err: any) {
          toast.error('Failed to reject expense');
      }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
           <h2 className="font-headline-lg text-headline-lg text-primary mb-1">Expense Approvals</h2>
           <p className="text-on-surface-variant font-body-md opacity-80">Review, approve, or reject hostel operational expenses.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative group w-full sm:w-auto">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 material-symbols-outlined group-focus-within:text-primary transition-colors pointer-events-none z-10">domain</span>
                <select 
                    value={selectedHostelId}
                    onChange={(e) => setSelectedHostelId(e.target.value)}
                    className="w-full sm:w-64 pl-12 pr-10 py-3.5 rounded-2xl border-2 border-outline-variant/50 bg-surface focus:border-primary focus:ring-0 transition-all text-primary font-body-md hover:border-outline-variant appearance-none cursor-pointer"
                >
                    <option value="ALL">All Properties</option>
                    {hostels.map((h: any) => <option key={h._id} value={h._id}>{h.name}</option>)}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined pointer-events-none text-on-surface-variant/70">expand_more</span>
            </div>
            
            <button 
                onClick={() => refetch()} 
                className="p-3.5 bg-surface border-2 border-outline-variant/50 rounded-2xl hover:bg-surface-container hover:border-outline-variant transition-all text-primary flex items-center justify-center group w-full sm:w-auto"
                title="Refresh"
            >
                <span className="material-symbols-outlined group-active:rotate-180 transition-transform duration-300">refresh</span>
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-4">
        <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-5 py-2.5 rounded-xl font-label-lg uppercase tracking-widest text-[11px] transition-all flex items-center gap-2 ${
                activeTab === 'PENDING'
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
        >
            <span className="material-symbols-outlined text-[18px]">pending_actions</span>
            Pending Approval
            {activeTab === 'PENDING' && !isLoading && expenses.length > 0 && (
                 <span className="flex items-center justify-center bg-error text-on-error h-5 min-w-[20px] px-1.5 rounded-full text-[10px] font-bold">
                     {expenses.length}
                 </span>
            )}
        </button>
        <button
            onClick={() => setActiveTab('HISTORY')}
            className={`px-5 py-2.5 rounded-xl font-label-lg uppercase tracking-widest text-[11px] transition-all flex items-center gap-2 ${
                activeTab === 'HISTORY'
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-transparent text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
        >
            <span className="material-symbols-outlined text-[18px]">history</span>
            History Log
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low text-[11px] uppercase text-on-surface-variant font-label-lg tracking-widest">
                    <tr>
                        <th className="px-8 py-5 whitespace-nowrap">Date & Property</th>
                        <th className="px-8 py-5 whitespace-nowrap">Expense Details</th>
                        <th className="px-8 py-5 whitespace-nowrap text-right">Amount</th>
                        <th className="px-8 py-5 whitespace-nowrap text-center">Receipt</th>
                        <th className="px-8 py-5 whitespace-nowrap text-right">Status / Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} className="p-16 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                                    <p className="text-on-surface-variant font-label-md uppercase tracking-widest">Loading expenses...</p>
                                </div>
                            </td>
                        </tr>
                    ) : expenses.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-16 text-center text-on-surface-variant">
                                <div className="flex flex-col items-center">
                                    <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">receipt_long</span>
                                    <p className="font-headline-sm text-primary mb-1">No expenses found</p>
                                    <p className="font-body-md">There are no {activeTab === 'PENDING' ? 'pending' : 'historical'} expenses matching your filters.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        expenses.map((expense: any) => (
                            <tr key={expense._id} className="hover:bg-surface-container-lowest transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors border border-outline-variant/30">
                                            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                                        </div>
                                        <div>
                                            <div className="font-mono text-sm text-primary font-bold mb-0.5">
                                                {new Date(expense.date).toLocaleDateString()}
                                            </div>
                                            <div className="text-[11px] font-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">domain</span>
                                                {expense.hostelId?.name || 'Unknown Property'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="font-headline-sm text-primary mb-1">{expense.title}</div>
                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-low border border-outline-variant/50 text-[10px] font-label-lg text-on-surface-variant uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-[14px]">category</span>
                                        {expense.category}
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <span className="font-mono text-sm font-bold text-tertiary">
                                        {formatCurrency(expense.amount)}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    {expense.receiptUrl ? (
                                        <a 
                                            href={expense.receiptUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all"
                                            title="View Receipt Document"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">receipt</span>
                                            View
                                        </a>
                                    ) : (
                                        <span className="text-on-surface-variant/50 italic text-xs font-label-md">No receipt attached</span>
                                    )}
                                </td>
                                <td className="px-8 py-5 text-right">
                                    {expense.status === 'PENDING' ? (
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleApprove(expense._id)}
                                                className="w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-full transition-colors border border-green-200" 
                                                title="Approve Expense"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">check</span>
                                            </button>
                                            <button 
                                                onClick={() => handleRejectClick(expense._id)}
                                                className="w-10 h-10 flex items-center justify-center bg-error-container text-error hover:bg-error hover:text-on-error rounded-full transition-colors border border-error/20" 
                                                title="Reject Expense"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">close</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-end gap-2">
                                            <ExpenseStatusBadge status={expense.status} />
                                            {expense.status === 'REJECTED' && (
                                                <div className="flex items-center gap-1 text-[10px] text-error bg-error-container/50 px-2 py-1 rounded">
                                                    <span className="material-symbols-outlined text-[12px]">info</span>
                                                    {expense.rejectionReason}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

       {/* Rejection Modal */}
       {rejectionModalApi.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <div className="bg-surface-container-lowest rounded-[32px] w-full max-w-sm shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-outline-variant/50 overflow-hidden">
                 <div className="p-8 border-b border-outline-variant/40">
                     <h3 className="font-headline-sm text-primary flex items-center gap-2">
                        <span className="material-symbols-outlined text-[24px] text-error">cancel</span>
                        Reject Expense
                     </h3>
                     <p className="text-xs font-label-md text-on-surface-variant uppercase tracking-wider mt-2">
                        Please provide a reason for rejecting this expense. This will be visible to the manager.
                     </p>
                 </div>
                 
                 <div className="p-8">
                     <div className="relative group mb-8">
                        <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-error">
                          Rejection Reason
                        </label>
                        <textarea 
                            className="w-full h-24 p-4 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-error focus:ring-0 transition-all text-primary font-body-md hover:border-outline-variant resize-none"
                            placeholder="State clearly why this was rejected..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                     </div>

                     <div className="flex justify-end gap-3">
                        <button 
                             onClick={() => setRejectionModalApi({ open: false, expenseId: null })}
                             className="px-6 py-3 font-label-md uppercase tracking-widest text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                             onClick={submitRejection}
                             disabled={isUpdating}
                             className="px-6 py-3 font-label-md uppercase tracking-widest bg-error hover:bg-error/90 text-on-error rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:active:translate-y-0 flex items-center gap-2"
                        >
                            {isUpdating ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            )}
                            Reject Expense
                        </button>
                     </div>
                 </div>
            </div>
        </div>
       )}
    </div>
  );
}
