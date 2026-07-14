'use client';

import { useState } from 'react';
import { useGetAllPaymentsQuery, useVerifyPaymentMutation } from '@/lib/services/paymentApi';
import { useGetManagerQuery, useGetManagerMeQuery } from '@/lib/services/managerApi';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function ManagerPaymentsPage() {
  const { data: managerData } = useGetManagerMeQuery();
  const hostelId = managerData?.data?.hostelId;

  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'DEFAULTERS'>('REQUESTS');

  const { data: paymentsData, isLoading, refetch, isFetching } = useGetAllPaymentsQuery(
    { hostelId }, 
    { skip: !hostelId }
  );

  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const payments = paymentsData?.data || [];

  const tabFilteredPayments = payments.filter((payment: any) => {
      if (activeTab === 'REQUESTS') {
          return payment.status === 'PENDING' || payment.status === 'COMPLETED' || payment.paymentProof;
      } else {
          return (payment.status === 'UNPAID' || payment.status === 'OVERDUE') && !payment.paymentProof;
      }
  });

  const finalFilteredPayments = tabFilteredPayments.filter((payment: any) => {
      if(!search) return true;
      const searchLower = search.toLowerCase();
      return (
          payment.studentId?.fullName?.toLowerCase().includes(searchLower) ||
          payment.receiptNumber?.toLowerCase().includes(searchLower) ||
          payment.studentId?.roomId?.roomNumber?.toLowerCase().includes(searchLower)
      );
  }).sort((a: any, b: any) => {
      if (activeTab === 'REQUESTS') {
          const aPending = !a.isVerified;
          const bPending = !b.isVerified;
          if (aPending && !bPending) return -1;
          if (!aPending && bPending) return 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleVerify = async (id: string) => {
      if (!confirm('Are you sure you want to verify this payment? This will mark the student\'s invoice as PAID.')) return;
      try {
          setVerifyingId(id);
          await verifyPayment(id).unwrap();
          toast.success('Payment verified successfully');
          refetch();
      } catch (error: any) {
          toast.error(error?.data?.message || 'Failed to verify payment');
      } finally {
          setVerifyingId(null);
      }
  };

  return (
    <div className="space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-display-lg-mobile md:text-display-lg text-primary flex items-center gap-3">
              <span className="material-symbols-outlined text-[36px] text-secondary">payments</span>
              Payments & Dues
          </h1>
          <p className="text-body-lg text-on-surface-variant mt-1">Manage invoices and verify payment requests</p>
        </div>

        <button 
            onClick={() => refetch()}
            className={`p-3 bg-surface border border-outline-variant rounded-2xl text-on-surface-variant hover:text-primary hover:border-primary transition-colors shadow-sm flex items-center justify-center ${isFetching ? 'animate-spin text-primary border-primary' : ''}`}
            title="Refresh Data"
        >
            <span className="material-symbols-outlined">refresh</span>
        </button>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col md:flex-row gap-4 border-b border-outline-variant pb-6">
          <div className="flex gap-2 bg-surface-container-low p-1 rounded-2xl w-full md:w-auto">
              <button 
                onClick={() => setActiveTab('REQUESTS')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold tracking-wide transition-all ${activeTab === 'REQUESTS' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary hover:bg-surface'}`}
              >
                  <span className="material-symbols-outlined text-[20px]">mark_email_unread</span>
                  Requests
                  <span className={`ml-2 px-2 py-0.5 rounded-lg text-label-sm ${activeTab === 'REQUESTS' ? 'bg-on-primary/20' : 'bg-surface-container-highest'}`}>
                      {payments.filter((p: any) => p.paymentProof && !p.isVerified).length}
                  </span>
              </button>
              <button 
                onClick={() => setActiveTab('DEFAULTERS')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold tracking-wide transition-all ${activeTab === 'DEFAULTERS' ? 'bg-error text-onError shadow-sm' : 'text-on-surface-variant hover:text-error hover:bg-error-container/20'}`}
              >
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  Defaulters
                  <span className={`ml-2 px-2 py-0.5 rounded-lg text-label-sm ${activeTab === 'DEFAULTERS' ? 'bg-onError/20' : 'bg-surface-container-highest'}`}>
                      {payments.filter((p: any) => (p.status === 'UNPAID' || p.status === 'OVERDUE') && !p.paymentProof).length}
                  </span>
              </button>
          </div>

          <div className="flex-1 relative md:max-w-xs ml-auto">
             <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
             <input 
                type="text" 
                placeholder="Search payments..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant rounded-2xl text-primary font-bold outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
             />
          </div>
      </div>

      <div className="grid gap-6">
          {isLoading && (
              <div className="p-16 text-center flex flex-col items-center bg-surface rounded-3xl border border-outline-variant shadow-sm">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary mb-4"></div>
                  <p className="text-body-lg text-on-surface-variant font-medium">Loading payments...</p>
              </div>
          )}

          {!isLoading && finalFilteredPayments.length === 0 && (
              <div className="p-16 text-center flex flex-col items-center bg-surface rounded-3xl border border-dashed border-outline-variant shadow-sm">
                  <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[40px]">{activeTab === 'REQUESTS' ? 'receipt_long' : 'sentiment_satisfied'}</span>
                  </div>
                  <h3 className="text-display-sm text-primary mb-2">No {activeTab === 'REQUESTS' ? 'Requests' : 'Defaulters'} Found</h3>
                  <p className="text-body-lg text-on-surface-variant max-w-md">
                      {search ? 'No records match your search criteria.' : activeTab === 'REQUESTS' ? 'All caught up! There are no pending payment requests.' : 'Great news! There are no unpaid or overdue invoices.'}
                  </p>
              </div>
          )}

          {finalFilteredPayments.map((payment: any) => (
             <div key={payment._id} className={`bg-surface rounded-3xl shadow-sm border p-6 md:p-8 transition-all group hover:shadow-md ${payment.paymentProof && !payment.isVerified ? 'border-primary ring-1 ring-primary/20' : 'border-outline-variant'}`}>
                 <div className="flex flex-col md:flex-row gap-8">
                     
                     {/* Payment Details */}
                     <div className="flex-1 flex flex-col justify-between">
                         <div>
                             <div className="flex items-center gap-3 mb-4">
                                 <span className="font-mono text-label-md text-on-surface-variant bg-surface-container-highest px-3 py-1 rounded-lg uppercase tracking-wider">{payment.receiptNumber}</span>
                                 <span className="text-body-sm text-on-surface-variant flex items-center gap-1.5">
                                     <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                     {new Date(payment.createdAt).toLocaleDateString()}
                                      - {new Date(payment.year, payment.month - 1).toLocaleString('default', { month: 'long' })} '{payment.year.toString().slice(-2)}
                                 </span>
                             </div>
                             
                             <div className="flex justify-between items-start gap-4">
                                 <div>
                                    <h3 className="text-display-sm text-primary group-hover:text-secondary transition-colors">{payment.studentId?.fullName || "Unknown Student"}</h3>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-body-md font-bold text-on-surface-variant flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1 rounded-lg border border-outline-variant/50">
                                            <span className="material-symbols-outlined text-[18px]">meeting_room</span>
                                            Room: {payment.studentId?.roomId?.roomNumber || "N/A"}
                                        </span>
                                        <span className="text-body-md font-bold text-on-surface-variant flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1 rounded-lg border border-outline-variant/50">
                                            <span className="material-symbols-outlined text-[18px]">bed</span>
                                            Bed: {payment.studentId?.bedNumber || "N/A"}
                                        </span>
                                    </div>
                                 </div>
                                 <div className="text-right shrink-0">
                                     <div className="text-display-sm font-mono text-primary bg-primary-container/20 px-4 py-2 rounded-xl">
                                         PKR {payment.amount.toLocaleString()}
                                     </div>
                                     <div className="text-label-md uppercase tracking-widest font-bold text-on-surface-variant mt-2 flex items-center justify-end gap-1">
                                         <span className="material-symbols-outlined text-[16px]">account_balance</span>
                                         {payment.paymentType}
                                     </div>
                                 </div>
                             </div>
                         </div>

                         <div className="flex items-center gap-4 mt-8 pt-6 border-t border-outline-variant/50">
                             <div className={`px-4 py-1.5 rounded-xl text-label-md font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                 payment.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border border-green-200' :
                                 payment.status === 'FAILED' ? 'bg-error-container text-error border border-error/20' :
                                 payment.status === 'UNPAID' ? 'bg-surface-container text-on-surface border border-outline-variant' :
                                 payment.status === 'OVERDUE' ? 'bg-error-container text-error border border-error/20 ring-1 ring-error' :
                                 'bg-secondary-container text-secondary border border-secondary/20'
                             }`}>
                                 <span className="material-symbols-outlined text-[18px]">
                                     {payment.status === 'COMPLETED' ? 'check_circle' : 
                                      payment.status === 'FAILED' || payment.status === 'OVERDUE' ? 'error' : 
                                      payment.status === 'UNPAID' ? 'schedule' : 'hourglass_top'}
                                 </span>
                                 {payment.status}
                             </div>
                             {payment.isVerified && (
                                 <div className="flex items-center gap-1.5 text-label-md uppercase tracking-wider text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-xl border border-green-200">
                                     <span className="material-symbols-outlined text-[18px]">verified_user</span> 
                                     Verified by Manager
                                 </div>
                             )}
                         </div>
                     </div>

                     {/* Action / Proof Section */}
                     {payment.paymentProof ? (
                         <div className="md:w-72 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-outline-variant/50 pt-6 md:pt-0 md:pl-8">
                            <div className="flex flex-col gap-3 h-full justify-center">
                                <p className="text-label-sm font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[16px]">attachment</span>
                                    Attached Proof
                                </p>
                                <button 
                                   onClick={() => setSelectedImage(payment.paymentProof)}
                                   className="relative h-40 w-full rounded-2xl overflow-hidden border-2 border-outline-variant group bg-surface-container-lowest transition-all hover:border-primary shadow-sm"
                                >
                                    <img 
                                       src={payment.paymentProof} 
                                       alt="Proof" 
                                       className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100">
                                        <div className="bg-surface text-primary p-3 rounded-full shadow-lg flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                                            <span className="material-symbols-outlined">zoom_in</span>
                                        </div>
                                    </div>
                                </button>
                                
                                {!payment.isVerified && (
                                    <button
                                       onClick={() => handleVerify(payment._id)}
                                       disabled={isVerifying && verifyingId === payment._id}
                                       className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-body-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-auto"
                                    >
                                        {isVerifying && verifyingId === payment._id ? (
                                            <>
                                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">verified</span> 
                                                Verify Payment
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                         </div>
                     ) : (
                         <div className="md:w-72 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-outline-variant/50 pt-6 md:pt-0 md:pl-8">
                             <div className="text-center p-6 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant flex flex-col items-center w-full">
                                 <span className="material-symbols-outlined text-[32px] text-on-surface-variant/50 mb-3">image_not_supported</span>
                                 <span className="text-on-surface-variant font-medium text-body-md">No payment proof</span>
                                 <span className="text-on-surface-variant/70 text-body-sm mt-1">Student hasn't uploaded receipt yet.</span>
                             </div>
                         </div>
                     )}
                 </div>
             </div>
          ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-container-highest/90 backdrop-blur-sm p-4" onClick={() => setSelectedImage(null)}>
              <button className="absolute top-6 right-6 text-on-surface-variant hover:text-primary bg-surface p-3 rounded-full shadow-lg transition-colors">
                  <span className="material-symbols-outlined">close</span>
              </button>
              <img 
                 src={selectedImage} 
                 alt="Full Proof" 
                 className="max-h-[90vh] max-w-full rounded-3xl shadow-2xl border border-outline-variant" 
                 onClick={(e) => e.stopPropagation()} 
              />
          </div>
      )}
    </div>
  );
}
