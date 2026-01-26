'use client';

import { useState } from 'react';
import { useGetAllPaymentsQuery, useTriggerMonthlyDuesMutation, useVerifyPaymentMutation } from '@/lib/services/paymentApi';
import { toast } from 'react-hot-toast';
import { HiCheck, HiX, HiExternalLink, HiSearch, HiExclamationCircle, HiCollection, HiLightningBolt, HiOfficeBuilding } from 'react-icons/hi';
// import { useGetHostelsQuery } from '@/lib/services/hostelApi'; // Not used yet

export default function AdminPaymentsPage() {
  // State for Invoice Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [triggerMonthlyDues] = useTriggerMonthlyDuesMutation();
  
  // We probably want to fetch payments for *all* hostels. 
  // The backend getAllPayments controller takes a hostelId query.
  // If I pass nothing, does it return all? 
  // Controller: 
  // if (!hostelId) throw ApiError.badRequest('Hostel ID is required');
  // So I might need to fetch hostels first and let admin pick one, OR update backend to allow fetching all for Admin.
  // For now, let's just implement the "Generate" button primarily, and maybe a list of recent payments if I can get a hostel ID.
  // Actually, if I can't see payments without a hostel ID, I should probably add a Hostel Selector.
  
  // Let's stub the list part or try to fetch for "all" (Requires backend check).
  // The backend controller: `let hostelId = req.query.hostelId as string; ... if (!hostelId) throw ...`
  // So I MUST provide a hostelId to see payments.

  // Let's just implement the Generate Button and a placeholder for the list or a Hostel Selector.
  // Since the user request is specifically about "ADMIN click generate invoice", I will prioritize that.
  
  const handleGenerateInvoices = async () => {
      const confirmMsg = "Are you sure you want to generate monthly dues for ALL active students in ALL active hostels? This will create UNPAID invoices for the current month.";
      if (!confirm(confirmMsg)) return;

      setIsGenerating(true);
      try {
          const today = new Date();
          // Generate for current month
          await triggerMonthlyDues({
              month: today.getMonth() + 1, // 1-12
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Global Payments Administration</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage system-wide billing and invoices</p>
        </div>
        
        <button
            onClick={handleGenerateInvoices}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${
                isGenerating 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/30'
            }`}
        >
            {isGenerating ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating...
                </>
            ) : (
                <>
                    <HiLightningBolt className="text-xl" />
                    Generate Monthly Invoices
                </>
            )}
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-800 mb-2">Automated Billing Control</h3>
          <p className="text-yellow-700">
              The "Generate Monthly Invoices" button above will manually trigger the billing cycle for the current month.
              <br />
              This affects <strong>ALL Active Hostels</strong> and their active students. 
              <br />
              Please ensure all student data is up-to-date before running this action.
          </p>
      </div>
      
      {/* 
          TODO: Add Payment List with Hostel Filter. 
          For now, this page fulfills the core requirement: "ADMIN click generate invoice".
      */}
      
    </div>
  );
}
