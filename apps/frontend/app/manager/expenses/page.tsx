'use client';

import React, { useState, useRef } from 'react';
import { useGetExpensesQuery, useCreateExpenseMutation } from '@/lib/services/expenseApi';
import { useGetOwnerHostelsQuery } from '@/lib/services/hostelApi';
import ExpenseStatusBadge from '@/components/ExpenseStatusBadge';
import { toast } from 'react-hot-toast';

export default function ManagerExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('UTILITIES');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState<File | null>(null);
  const [selectedHostelId, setSelectedHostelId] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: hostelsResponse } = useGetOwnerHostelsQuery();
  const hostels = hostelsResponse?.data || [];
  
  React.useEffect(() => {
    if (hostels.length > 0 && !selectedHostelId) {
        setSelectedHostelId(hostels[0]._id);
    }
  }, [hostels, selectedHostelId]);

  const { data: expensesResponse, isLoading, isFetching, refetch } = useGetExpensesQuery({
    hostelId: selectedHostelId || undefined,
    limit: 20
  }, { skip: !selectedHostelId });

  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();

  const expenses = expensesResponse?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHostelId) return toast.error('Please select a hostel');
    if (!amount) return toast.error('Please enter an amount');
    if (!file) return toast.error('Please upload a receipt');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('amount', amount);
    formData.append('category', category);
    formData.append('date', date);
    formData.append('hostelId', selectedHostelId);
    formData.append('receipt', file);

    try {
        await createExpense(formData).unwrap();
        toast.success('Expense submitted successfully');
        setIsModalOpen(false);
        setTitle('');
        setAmount('');
        setFile(null);
    } catch (err: any) {
        toast.error(err?.data?.message || 'Failed to submit expense');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h1 className="text-display-lg-mobile md:text-display-lg text-primary flex items-center gap-3">
               <span className="material-symbols-outlined text-[36px] text-secondary">account_balance_wallet</span>
               Expense Management
           </h1>
           <p className="text-body-lg text-on-surface-variant mt-1">Track and submit hostel expenses</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
            {hostels.length > 1 && (
                <div className="relative flex-1 md:w-auto">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">apartment</span>
                    <select 
                        value={selectedHostelId}
                        onChange={(e) => setSelectedHostelId(e.target.value)}
                        className="w-full pl-12 pr-10 py-3 rounded-2xl bg-surface border border-outline-variant text-primary font-bold outline-none focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer shadow-sm transition-all hover:border-primary"
                    >
                        {hostels.map((h: any) => <option key={h._id} value={h._id}>{h.name}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
            )}
            
            <button 
                onClick={() => refetch()}
                className={`p-3 bg-surface border border-outline-variant rounded-2xl text-on-surface-variant hover:text-primary hover:border-primary transition-colors shadow-sm flex items-center justify-center ${isFetching ? 'animate-spin text-primary border-primary' : ''}`}
                title="Refresh List"
            >
                <span className="material-symbols-outlined">refresh</span>
            </button>

            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-2xl hover:bg-on-primary-fixed-variant transition-colors shadow-sm flex-1 md:flex-none"
            >
                <span className="material-symbols-outlined">add</span> 
                Add Expense
            </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-lowest border-b border-outline-variant">
                    <tr>
                        <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Expense Title</th>
                        <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Category</th>
                        <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Date</th>
                        <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                        <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant text-right">Amount</th>
                        <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Receipt</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="p-16 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary mb-4"></div>
                                    <p className="text-body-lg text-on-surface-variant font-medium">Loading expenses...</p>
                                </div>
                            </td>
                        </tr>
                    ) : expenses.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-16 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[40px]">receipt_long</span>
                                    </div>
                                    <h3 className="text-display-sm text-primary mb-2">No Expenses Found</h3>
                                    <p className="text-body-lg text-on-surface-variant max-w-md">There are no expenses recorded yet. Click "Add Expense" to submit your first one.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        expenses.map((expense: any) => (
                            <tr key={expense._id} className="hover:bg-surface-container-lowest transition-colors group">
                                <td className="px-6 py-4 font-bold text-primary text-body-lg">{expense.title}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1.5 rounded-xl text-label-sm font-bold tracking-wider uppercase bg-surface-container text-on-surface flex items-center gap-1.5 w-fit">
                                        <span className="material-symbols-outlined text-[14px]">
                                            {expense.category === 'UTILITIES' ? 'bolt' :
                                             expense.category === 'MAINTENANCE' ? 'build' :
                                             expense.category === 'FOOD' ? 'restaurant' :
                                             expense.category === 'INTERNET' ? 'wifi' :
                                             expense.category === 'SALARY' ? 'payments' :
                                             expense.category === 'RENT' ? 'real_estate_agent' : 'category'}
                                        </span>
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-body-md text-on-surface-variant font-medium flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                        {new Date(expense.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <ExpenseStatusBadge status={expense.status} />
                                    {expense.status === 'REJECTED' && expense.rejectionReason && (
                                        <p className="text-label-sm text-error mt-1.5 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]">info</span>
                                            {expense.rejectionReason}
                                        </p>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-primary text-body-lg">
                                    PKR {expense.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    {expense.receiptUrl ? (
                                        <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-label-md uppercase tracking-wider font-bold border border-primary text-primary hover:bg-primary hover:text-on-primary rounded-xl transition-all flex items-center gap-1 w-fit">
                                            <span className="material-symbols-outlined text-[18px]">receipt</span>
                                            View
                                        </a>
                                    ) : (
                                        <span className="text-on-surface-variant/50 text-body-md font-medium">-</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <>
            <div className="fixed inset-0 z-[100] bg-surface-container-highest/80 backdrop-blur-sm" onClick={() => !isCreating && setIsModalOpen(false)} />
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-surface rounded-3xl w-full max-w-lg shadow-2xl p-0 relative border border-outline-variant pointer-events-auto flex flex-col max-h-[90vh]">
                    <div className="p-6 border-b border-outline-variant flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-display-sm text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary">post_add</span>
                                Submit New Expense
                            </h2>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            disabled={isCreating}
                            className="p-2 hover:bg-surface-container text-on-surface-variant rounded-full transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                     
                     <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                        <div className="space-y-2">
                            <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">edit_document</span>
                                Expense Title
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-background border border-outline-variant text-primary font-bold outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-outline"
                                placeholder="e.g. January Electricity Bill"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">payments</span>
                                    Amount (PKR)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-outline-variant text-primary font-bold outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-outline"
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                                    Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-background border border-outline-variant text-primary font-bold outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-outline"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">category</span>
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-background border border-outline-variant text-primary font-bold outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:border-outline appearance-none cursor-pointer"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="UTILITIES">Utilities (Electricity, Gas, Water)</option>
                                    <option value="MAINTENANCE">Maintenance & Repairs</option>
                                    <option value="FOOD">Food & Groceries</option>
                                    <option value="INTERNET">Internet / Wifi</option>
                                    <option value="SALARY">Staff Salaries</option>
                                    <option value="RENT">Rent</option>
                                    <option value="MISC">Miscellaneous</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">receipt</span>
                                Upload Receipt
                            </label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${file ? 'border-primary bg-primary-container/20 hover:bg-primary-container/40' : 'border-outline-variant bg-surface-container-lowest hover:border-primary hover:bg-surface-container'}`}
                            >
                                {file ? (
                                    <div className="text-primary flex flex-col items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-[40px]">check_circle</span>
                                        <span className="font-bold text-body-lg">{file.name}</span>
                                        <span className="text-label-sm uppercase tracking-wider text-on-surface-variant mt-2">Click to change</span>
                                    </div>
                                ) : (
                                    <div className="text-on-surface-variant flex flex-col items-center">
                                        <span className="material-symbols-outlined text-[40px] mb-3 text-secondary">cloud_upload</span>
                                        <span className="font-bold text-body-lg text-primary">Click to upload image</span>
                                        <span className="text-label-sm uppercase tracking-wider mt-2">JPG, PNG only</span>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        if(e.target.files?.[0]) setFile(e.target.files[0]);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-outline-variant flex justify-end gap-3 mt-6">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)}
                                disabled={isCreating}
                                className="px-6 py-3 rounded-xl font-bold bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isCreating}
                                className="px-8 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                            >
                                {isCreating ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">send</span>
                                        Submit Expense
                                    </>
                                )}
                            </button>
                        </div>
                     </form>
                </div>
            </div>
        </>
      )}
    </div>
  );
}
