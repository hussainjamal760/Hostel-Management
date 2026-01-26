'use client';

import { useState, useEffect } from 'react';
import { useGetOwnerHostelsQuery, useUpdateHostelMutation } from '@/lib/services/hostelApi';
import { useTriggerMonthlyDuesMutation } from '@/lib/services/paymentApi';
import { toast } from 'react-hot-toast';
import { HiLightningBolt, HiLockClosed, HiCheckCircle } from 'react-icons/hi';

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
      


      {/* Payment Details Form */}
      <div className="bg-white dark:bg-[#1a0f0a] rounded-xl shadow-sm border border-gray-100 dark:border-[#fcf2e9]/10 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h2>
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

function MonthlyInvoiceGenerator() {
    const [triggerMonthlyDues, { isLoading, error, isSuccess }] = useTriggerMonthlyDuesMutation();
    
    // Testing Adjustment: Target Next Month
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    
    const currentMonthName = date.toLocaleString('default', { month: 'long' });
    const currentYear = date.getFullYear();


    const isLocked = isSuccess || (error && (error as any)?.data?.message?.includes('already exist'));

    const handleGenerate = async () => {
        if (!confirm(`Are you sure you want to generate invoices for ${currentMonthName} ${currentYear}? This action cannot be undone.`)) return;
        
        try {
            // Note: date.getMonth() is 0-indexed, so adding 1 makes it 1-12 for backend.
            const args = { month: date.getMonth() + 1, year: currentYear };
            console.log('Sending Trigger Args:', args);
            await triggerMonthlyDues(args).unwrap();
            toast.success(`Invoices for ${currentMonthName} generated successfully!`);
        } catch (err: any) {
             if (err?.data?.message?.includes('already exist')) {
                 toast('Invoices for this month were already generated.', { icon: '🔒' });
             } else {
                 toast.error('Failed to generate invoices');
             }
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#2c1b13] to-[#4a2e22] rounded-xl shadow-lg p-6 text-white overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <HiLightningBolt size={120} />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold mb-1">Monthly Invoice Generation</h2>
                        <p className="text-white/80 text-sm mb-6 max-w-md">
                            Generate rent invoices for all active students for <strong>{currentMonthName} {currentYear}</strong>. 
                            This action effectively starts the billing cycle for this month.
                        </p>
                    </div>
                    {isLocked && (
                        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/20">
                            <HiCheckCircle className="text-green-400" size={20} />
                            <span className="text-sm font-semibold">Generated</span>
                        </div>
                    )}
                </div>

                {isLocked ? (
                    <button 
                        disabled 
                        className="w-full sm:w-auto px-6 py-3 bg-white/10 border border-white/10 text-white/50 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                        <HiLockClosed />
                        Cycle Locked for {currentMonthName}
                    </button>
                ) : (
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full sm:w-auto px-6 py-3 bg-white text-[#2c1b13] rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#2c1b13] border-t-transparent"></div>
                                Generating...
                            </>
                        ) : (
                            <>
                                <HiLightningBolt />
                                Generate Invoices for {currentMonthName}
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
