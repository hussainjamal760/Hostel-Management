'use client';

import React, { useState } from 'react';
import { useGetExpensesQuery, useUpdateExpenseStatusMutation } from '@/lib/services/expenseApi';
import { useGetOwnerHostelsQuery } from '@/lib/services/hostelApi';
import { HiCheck, HiX, HiReceiptTax, HiSearch, HiRefresh } from 'react-icons/hi';
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
        toast.success('Expense approved');
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expense Approvals</h1>
           <p className="text-gray-500">Review and manage hostel expenses</p>
        </div>
        
        <div className="flex gap-2 items-center">
            <select 
                value={selectedHostelId}
                onChange={(e) => setSelectedHostelId(e.target.value)}
                className="px-4 py-2 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
                <option value="ALL">All Hostels</option>
                {hostels.map((h: any) => <option key={h._id} value={h._id}>{h.name}</option>)}
            </select>
            
            <button onClick={() => refetch()} className="p-2 bg-white dark:bg-gray-800 border rounded-lg hover:bg-gray-50">
                <HiRefresh />
            </button>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
            <button
                onClick={() => setActiveTab('PENDING')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'PENDING'
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
                Pending Approval
                {activeTab === 'PENDING' && !isLoading && expenses.length > 0 && (
                     <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                         {expenses.length}
                     </span>
                )}
            </button>
            <button
                onClick={() => setActiveTab('HISTORY')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'HISTORY'
                        ? 'border-brand-primary text-brand-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
                History (Approved/Rejected)
            </button>
        </nav>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Date</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Hostel</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Title</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Category</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Amount</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Receipt</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Status / Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {isLoading ? (
                        <tr><td colSpan={7} className="p-8 text-center">Loading...</td></tr>
                    ) : expenses.length === 0 ? (
                        <tr><td colSpan={7} className="p-8 text-center text-gray-500">No expenses found.</td></tr>
                    ) : (
                        expenses.map((expense: any) => (
                            <tr key={expense._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 text-gray-500">{new Date(expense.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{expense.hostelId?.name || '-'}</td>
                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{expense.title}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                                    PKR {expense.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    {expense.receiptUrl ? (
                                        <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline flex items-center gap-1">
                                            <HiReceiptTax /> View
                                        </a>
                                    ) : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    {expense.status === 'PENDING' ? (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleApprove(expense._id)}
                                                className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Approve"
                                            >
                                                <HiCheck />
                                            </button>
                                            <button 
                                                onClick={() => handleRejectClick(expense._id)}
                                                className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Reject"
                                            >
                                                <HiX />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            <ExpenseStatusBadge status={expense.status} />
                                            {expense.status === 'REJECTED' && (
                                                <span className="text-xs text-red-500 mt-1">{expense.rejectionReason}</span>
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

       {rejectionModalApi.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-sm shadow-xl p-6">
                 <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Reject Expense?</h3>
                 <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejecting this expense.</p>
                 
                 <textarea 
                    className="w-full h-24 p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 text-sm mb-4 focus:ring-2 focus:ring-red-500"
                    placeholder="Reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                 />

                 <div className="flex justify-end gap-3">
                    <button 
                         onClick={() => setRejectionModalApi({ open: false, expenseId: null })}
                         className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button 
                         onClick={submitRejection}
                         disabled={isUpdating}
                         className="px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Reject Expense
                    </button>
                 </div>
            </div>
        </div>
       )}
    </div>
  );
}
