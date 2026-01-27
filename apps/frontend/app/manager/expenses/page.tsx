'use client';

import React, { useState, useRef } from 'react';
import { useGetExpensesQuery, useCreateExpenseMutation } from '@/lib/services/expenseApi';
import { useGetOwnerHostelsQuery } from '@/lib/services/hostelApi';
import { HiPlus, HiReceiptTax, HiUpload, HiX } from 'react-icons/hi';
import ExpenseStatusBadge from '@/components/ExpenseStatusBadge';
import { toast } from 'react-hot-toast';

export default function ManagerExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('UTILITIES');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState<File | null>(null);
  const [selectedHostelId, setSelectedHostelId] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries
  const { data: hostelsResponse } = useGetOwnerHostelsQuery();
  const hostels = hostelsResponse?.data || [];
  
  // Auto-select first hostel
  React.useEffect(() => {
    if (hostels.length > 0 && !selectedHostelId) {
        setSelectedHostelId(hostels[0]._id);
    }
  }, [hostels, selectedHostelId]);

  const { data: expensesResponse, isLoading } = useGetExpensesQuery({
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
        // Reset form
        setTitle('');
        setAmount('');
        setFile(null);
    } catch (err: any) {
        toast.error(err?.data?.message || 'Failed to submit expense');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expense Managment</h1>
           <p className="text-gray-500">Track and submit hostel expenses</p>
        </div>
        
        <div className="flex gap-2">
            {hostels.length > 1 && (
                <select 
                    value={selectedHostelId}
                    onChange={(e) => setSelectedHostelId(e.target.value)}
                    className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                >
                    {hostels.map((h: any) => <option key={h._id} value={h._id}>{h.name}</option>)}
                </select>
            )}
            
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors shadow-sm"
            >
                <HiPlus /> Add Expense
            </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Title</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Category</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Date</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Status</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Amount</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Receipt</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {isLoading ? (
                        <tr><td colSpan={6} className="p-8 text-center">Loading...</td></tr>
                    ) : expenses.length === 0 ? (
                        <tr><td colSpan={6} className="p-8 text-center text-gray-500">No expenses recorded yet.</td></tr>
                    ) : (
                        expenses.map((expense: any) => (
                            <tr key={expense._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{expense.title}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{new Date(expense.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <ExpenseStatusBadge status={expense.status} />
                                    {expense.status === 'REJECTED' && expense.rejectionReason && (
                                        <p className="text-xs text-red-500 mt-1">{expense.rejectionReason}</p>
                                    )}
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
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
                 <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                 >
                    <HiX className="w-6 h-6" />
                 </button>

                 <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Submit New Expense</h2>
                 
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Expense Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                            placeholder="e.g. January Electricity Bill"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Amount (PKR)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Category</label>
                        <select
                             className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Upload Receipt</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                        >
                            {file ? (
                                <div className="text-green-600 flex items-center justify-center gap-2">
                                    <HiReceiptTax /> {file.name}
                                </div>
                            ) : (
                                <div className="text-gray-500 flex flex-col items-center">
                                    <HiUpload className="w-8 h-8 mb-2" />
                                    <span>Click to upload image</span>
                                    <span className="text-xs mt-1">Images only (JPG, PNG)</span>
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

                    <button 
                        type="submit" 
                        disabled={isCreating}
                        className="w-full py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary/90 transition-colors shadow-lg mt-2"
                    >
                        {isCreating ? 'Submitting...' : 'Submit Expense'}
                    </button>
                 </form>
            </div>
        </div>
      )}
    </div>
  );
}
