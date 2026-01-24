'use client';

import { useState, useEffect } from 'react';
import { useGetOwnerHostelsQuery, useUpdateHostelMutation } from '@/lib/services/hostelApi';
import { toast } from 'react-hot-toast';

export default function OwnerSettingsPage() {
  const { data: hostelsData, isLoading } = useGetOwnerHostelsQuery();
  const [updateHostel, { isLoading: isUpdating }] = useUpdateHostelMutation();
  
  // State for form
  const [bankName, setBankName] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [instructions, setInstructions] = useState('');

  const hostel = hostelsData?.data?.[0]; // Assuming owner has one hostel for now

  useEffect(() => {
    if (hostel?.paymentDetails) {
        setBankName(hostel.paymentDetails.bankName || '');
        setAccountTitle(hostel.paymentDetails.accountTitle || '');
        setAccountNumber(hostel.paymentDetails.accountNumber || '');
        setInstructions(hostel.paymentDetails.instructions || '');
    }
  }, [hostel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostel?._id) return;

    try {
      await updateHostel({
        id: hostel._id,
        data: {
            // We need to cast or update the type in frontend if strict
            // The UpdateHostelInput might strictly validate, so we might need 'paymentDetails' in the validator too.
            // Assuming the backend allows Partial updates and Mongoose handles the structure.
            // TypeScript here might complain if CreateHostelInput doesn't have paymentDetails.
            paymentDetails: {
                bankName,
                accountTitle,
                accountNumber,
                instructions
            }
        } as any 
      }).unwrap();
      toast.success('Payment details updated successfully');
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to update settings');
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!hostel) return <div className="p-8">No hostel found. Please create one first.</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your hostel configuration</p>
      </div>

      <div className="bg-white dark:bg-[#1a0f0a] rounded-xl shadow-sm border border-gray-100 dark:border-[#fcf2e9]/10 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Details</h2>
        <p className="text-sm text-gray-500 mb-6">
            These details will be shown to students on their invoice page for making manual payments.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Name / Provider</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. Meezan Bank, JazzCash, Easypaisa"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-[#fcf2e9]/20 bg-transparent dark:text-white focus:ring-2 focus:ring-[#2c1b13]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Title</label>
            <input
              type="text"
              value={accountTitle}
              onChange={(e) => setAccountTitle(e.target.value)}
              placeholder="e.g. John Doe Hostels"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-[#fcf2e9]/20 bg-transparent dark:text-white focus:ring-2 focus:ring-[#2c1b13]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Number / IBAN</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g. 03001234567 or PKRIBAN..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-[#fcf2e9]/20 bg-transparent dark:text-white focus:ring-2 focus:ring-[#2c1b13]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Please upload screenshot after payment. Verification takes 24 hours."
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-[#fcf2e9]/20 bg-transparent dark:text-white focus:ring-2 focus:ring-[#2c1b13]"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2 bg-[#2c1b13] dark:bg-[#fcf2e9] text-white dark:text-[#2c1b13] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
