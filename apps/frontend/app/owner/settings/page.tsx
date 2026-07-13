'use client';

import { useState } from 'react';
import { useGetPaymentCardsQuery, useCreatePaymentCardMutation, useDeletePaymentCardMutation } from '@/lib/services/paymentCardApi';
import { toast } from 'react-hot-toast';

export default function OwnerSettingsPage() {
  const { data: cardsData, isLoading } = useGetPaymentCardsQuery();
  const [createPaymentCard, { isLoading: isCreating }] = useCreatePaymentCardMutation();
  const [deletePaymentCard] = useDeletePaymentCardMutation();
  
  const paymentCards = cardsData?.data || [];

  const [bankName, setBankName] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleEditClick = (card: any) => {
      setBankName(card.bankName);
      setAccountTitle(card.accountTitle);
      setAccountNumber(card.accountNumber);
      setInstructions(card.instructions || '');
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
      if (!confirm('Are you sure you want to permanently delete this payment card from your library?')) return;
      try {
          await deletePaymentCard(id).unwrap();
          toast.success('Payment card deleted successfully');
      } catch (error) {
          toast.error('Failed to delete payment card');
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPaymentCard({
          bankName,
          accountTitle,
          accountNumber,
          instructions
      }).unwrap();
      
      toast.success('Payment card saved successfully');
      
      // Reset form
      setBankName('');
      setAccountTitle('');
      setAccountNumber('');
      setInstructions('');
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to save payment card');
    }
  };

  if (isLoading) {
    return (
        <div className="p-16 flex flex-col items-center justify-center bg-surface-container-lowest rounded-[32px] border border-outline-variant shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] max-w-5xl mx-auto mt-8">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-on-surface-variant font-label-md uppercase tracking-widest">Loading Library...</p>
        </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary mb-1">Global Payment Cards</h1>
        <p className="text-on-surface-variant font-body-md opacity-80">Manage your library of payment methods. These can be assigned to any of your properties.</p>
      </div>

      {/* Existing Payment Cards Grid */}
      <div className="space-y-6">
          <h2 className="font-headline-sm text-primary flex items-center gap-2">
             <span className="material-symbols-outlined text-tertiary">style</span>
             My Saved Cards
          </h2>
          
          {paymentCards.length === 0 ? (
              <div className="p-8 text-center bg-surface-container-low/50 rounded-[24px] border border-dashed border-outline-variant">
                  <span className="material-symbols-outlined text-[32px] text-outline-variant mb-2">credit_card_off</span>
                  <p className="text-on-surface-variant font-body-md">No payment methods configured yet. Add one below.</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paymentCards.map((card: any) => (
                      <div key={card._id} className="relative aspect-[1.6/1] rounded-[24px] overflow-hidden group shadow-lg hover:shadow-xl transition-shadow">
                          {/* Card Background - Premium Dark */}
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-surface-container-highest to-black z-0"></div>
                          {/* Animated Hover Glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-tertiary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                          
                          <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8 backdrop-blur-sm border border-white/10 rounded-[24px]">
                              
                              {/* Top section */}
                              <div className="flex justify-between items-start w-full">
                                  <div className="flex gap-2 items-center text-white/40">
                                      <span className="material-symbols-outlined text-[24px] rotate-90">sim_card</span>
                                      <span className="material-symbols-outlined text-[20px]">wifi</span>
                                  </div>
                                  
                                  {/* Actions overlay - visible on hover */}
                                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                      <button 
                                        onClick={() => handleEditClick(card)}
                                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all text-white border border-white/10"
                                        title="Edit payment method"
                                      >
                                          <span className="material-symbols-outlined text-[16px]">edit</span>
                                      </button>
                                      <button 
                                        onClick={() => handleDelete(card._id)}
                                        className="w-8 h-8 rounded-full bg-error/60 hover:bg-error backdrop-blur-md flex items-center justify-center transition-all text-white border border-error/50"
                                        title="Remove payment method"
                                      >
                                          <span className="material-symbols-outlined text-[16px]">delete</span>
                                      </button>
                                  </div>
                              </div>

                              {/* Middle Section */}
                              <div className="w-full mt-auto mb-4 drop-shadow-md">
                                  <p className="font-mono text-xl sm:text-2xl text-white tracking-[0.15em] mb-1">{card.accountNumber}</p>
                                  <p className="font-mono text-xs text-white/60 tracking-widest uppercase">{card.accountTitle}</p>
                              </div>

                              {/* Bottom Section */}
                              <div className="w-full flex justify-between items-end border-t border-white/10 pt-4">
                                  <p className="font-bold text-lg text-white/90 drop-shadow-sm">{card.bankName}</p>
                                  <div className="relative w-8 h-5 flex-shrink-0 opacity-80">
                                      <div className="absolute left-0 w-5 h-5 rounded-full bg-error/90 mix-blend-screen"></div>
                                      <div className="absolute right-0 w-5 h-5 rounded-full bg-tertiary/90 mix-blend-screen"></div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>

      {/* Edit/Add Payment Form */}
      <div className="bg-surface-container-lowest rounded-[32px] shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] border border-outline-variant overflow-hidden relative">
        <div className="p-8 md:p-10">
            <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[24px]">add_card</span>
                    </div>
                    <div>
                        <h2 className="font-headline-sm text-primary">Add New Card</h2>
                        <p className="text-sm font-body-md text-on-surface-variant mt-1">
                            Save a new bank account or mobile wallet to your global library.
                        </p>
                    </div>
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
                        required
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
                        required
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
                    required
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
                  disabled={isCreating}
                  className="px-8 py-3.5 bg-primary text-on-primary rounded-xl font-label-md uppercase tracking-widest hover:bg-primary/90 transition-all shadow-[0_4px_10px_-2px_rgba(var(--color-primary-rgb),0.4)] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:active:translate-y-0 flex items-center gap-2"
                >
                  {isCreating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Saving...
                      </>
                  ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        Save Payment Card
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
