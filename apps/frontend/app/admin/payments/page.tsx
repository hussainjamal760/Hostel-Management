'use client';

import React, { useState } from 'react';
import { useTriggerMonthlyDuesMutation } from '@/lib/services/paymentApi';
import { toast } from 'react-hot-toast';

export default function AdminPaymentsPage() {
  const [triggerMonthlyDues] = useTriggerMonthlyDuesMutation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmAction = async () => {
    setIsModalOpen(false);
    setIsGenerating(true);
    try {
      const today = new Date();
      await triggerMonthlyDues({
        month: today.getMonth() + 1,
        year: today.getFullYear()
      }).unwrap();
      
      toast.success('Invoices generated successfully for all active hostels!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to trigger invoice generation');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6 w-full">
        <div>
          <h2 className="text-3xl font-bold text-[#5C4033] mb-2">Billing Control</h2>
          <p className="text-[#7A5C4D]">Manually trigger the monthly billing cycle if the automated system fails.</p>
        </div>

        <div className="bg-[#F8F5F0] border border-[#d4c3bd] rounded-2xl p-6 md:p-8 w-full">
          <div className="flex flex-col md:flex-row gap-6 items-start w-full">
            <div className="w-16 h-16 bg-[#eaddd7] text-[#432a1e] rounded-2xl flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl">request_quote</span>
            </div>
            
            <div className="flex-1 min-w-0 w-full">
              <h3 className="text-xl font-bold text-[#5C4033] mb-3">Dispatch Global Payments</h3>
              <p className="text-[#7A5C4D] leading-relaxed mb-6 w-full">
                This action will forcefully generate monthly dues for all active students across all active hostels. Use this manual trigger only if the automated beginning-of-month billing system fails to execute.
              </p>

              <button 
                onClick={() => setIsModalOpen(true)}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#5C4033] text-white hover:bg-[#432a1e] transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Generating Invoices...' : 'Trigger Invoices Now'}
              </button>
            </div>
          </div>

          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-start md:items-center w-full">
            <span className="material-symbols-outlined text-red-600 shrink-0">warning</span>
            <p className="text-red-800 text-sm font-medium w-full">
              Important: Clicking the button above creates actual financial records (UNPAID invoices). Ensure no duplicate jobs have already run.
            </p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 border border-red-100">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Dispatch</h3>
            <p className="text-gray-600 mb-8 w-full">
              Are you sure you want to generate monthly dues for ALL active students? This will instantly create UNPAID invoices for the current month.
            </p>

            <div className="flex justify-end gap-3 w-full">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmAction}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Yes, Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
