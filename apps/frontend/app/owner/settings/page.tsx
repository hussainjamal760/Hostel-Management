'use client';

import { useState, useEffect } from 'react';
import { useGetOwnerHostelsQuery, useUpdateHostelMutation } from '@/lib/services/hostelApi';
import { toast } from 'react-hot-toast';

export default function OwnerSettingsPage() {
  const { data: hostelsData, isLoading } = useGetOwnerHostelsQuery();
  const [updateHostel, { isLoading: isUpdating }] = useUpdateHostelMutation();
  
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

  if (isLoading) {
    return (
        <div className="p-16 flex flex-col items-center justify-center bg-surface-container-lowest rounded-[32px] border border-outline-variant shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] max-w-4xl mx-auto mt-8">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-on-surface-variant font-label-md uppercase tracking-widest">Loading Settings...</p>
        </div>
    );
  }
  
  if (!hostel) {
    return (
        <div className="p-16 flex flex-col items-center justify-center bg-surface-container-lowest rounded-[32px] border border-outline-variant shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] max-w-4xl mx-auto mt-8 text-center">
            <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
            <p className="font-headline-sm text-primary mb-1">No Property Found</p>
            <p className="text-on-surface-variant font-body-md">You need to create a property/hostel first before managing settings.</p>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary mb-1">Global Settings</h1>
        <p className="text-on-surface-variant font-body-md opacity-80">Manage property configurations and billing cycles.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-[32px] shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] border border-outline-variant overflow-hidden relative">
        <div className="p-8 md:p-10">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">account_balance</span>
                </div>
                <div>
                    <h2 className="font-headline-sm text-primary">Manual Payment Instructions</h2>
                    <p className="text-sm font-body-md text-on-surface-variant mt-1">
                        Configure the bank or mobile wallet details shown to students when paying rent.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bank Name */}
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                        Provider / Bank Name
                    </label>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors pointer-events-none">
                        <span className="material-symbols-outlined text-[20px]">account_balance</span>
                    </div>
                    <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. Meezan Bank, JazzCash"
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-md hover:border-outline-variant"
                    />
                  </div>

                  {/* Account Title */}
                  <div className="relative group">
                    <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                        Account Title
                    </label>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors pointer-events-none">
                        <span className="material-symbols-outlined text-[20px]">badge</span>
                    </div>
                    <input
                        type="text"
                        value={accountTitle}
                        onChange={(e) => setAccountTitle(e.target.value)}
                        placeholder="e.g. John Doe Hostels"
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-md hover:border-outline-variant"
                    />
                  </div>
              </div>

              {/* Account Number */}
              <div className="relative group">
                <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                    Account Number / IBAN
                </label>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors pointer-events-none">
                    <span className="material-symbols-outlined text-[20px]">tag</span>
                </div>
                <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 03001234567 or PKRIBAN..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-md hover:border-outline-variant"
                />
              </div>

              {/* Instructions */}
              <div className="relative group">
                <label className="absolute -top-2.5 left-4 px-1 bg-surface-container-lowest text-[11px] font-bold text-on-surface-variant uppercase tracking-wider z-10 transition-colors group-focus-within:text-primary">
                    Additional Instructions
                </label>
                <div className="absolute left-4 top-5 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors pointer-events-none">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Please upload a screenshot after payment. Verification takes 24 hours."
                    rows={4}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-outline-variant/50 bg-transparent focus:border-primary focus:ring-0 transition-all text-primary font-body-md hover:border-outline-variant resize-none"
                />
              </div>

              <div className="pt-4 border-t border-outline-variant/40 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-8 py-3.5 bg-primary text-on-primary rounded-xl font-label-md uppercase tracking-widest hover:bg-primary/90 transition-all shadow-[0_4px_10px_-2px_rgba(var(--color-primary-rgb),0.4)] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:active:translate-y-0 flex items-center gap-2"
                >
                  {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Saving...
                      </>
                  ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        Save Configuration
                      </>
                  )}
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}
