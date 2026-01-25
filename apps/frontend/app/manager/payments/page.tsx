'use client';

import { useState } from 'react';
import { useGetAllPaymentsQuery, useVerifyPaymentMutation } from '@/lib/services/paymentApi';
import { useGetManagerQuery, useGetManagerMeQuery } from '@/lib/services/managerApi';
import { toast } from 'react-hot-toast';
import { HiCheck, HiX, HiExternalLink, HiSearch, HiExclamationCircle, HiCollection } from 'react-icons/hi';
import Image from 'next/image';

export default function ManagerPaymentsPage() {
  const { data: managerData } = useGetManagerMeQuery();
  const hostelId = managerData?.data?.hostelId;

  // Tabs state
  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'DEFAULTERS'>('REQUESTS');

  const { data: paymentsData, isLoading, refetch } = useGetAllPaymentsQuery(
    { hostelId }, 
    { skip: !hostelId }
  );

  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const payments = paymentsData?.data || [];

  // Filter based on Tab
  const tabFilteredPayments = payments.filter((payment: any) => {
      if (activeTab === 'REQUESTS') {
          // Show PENDING (Under Review) and COMPLETED (History)
          // Hide plain UNPAID unless they uploaded a proof (which makes them PENDING usually, but just in case)
          // Actually, if paymentProof exists, it should be here.
          return payment.status === 'PENDING' || payment.status === 'COMPLETED' || payment.paymentProof;
      } else {
          // DEFAULTERS / UNPAID
          // Show UNPAID and OVERDUE where NO proof is uploaded yet.
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
      // Sort logic
      if (activeTab === 'REQUESTS') {
          // Prioritize Pending Verification
          const aPending = !a.isVerified;
          const bPending = !b.isVerified;
          if (aPending && !bPending) return -1;
          if (!aPending && bPending) return 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleVerify = async (id: string) => {
      if (!confirm('Are you sure you want to verify this payment? This will maximize the student\'s invoice as PAID.')) return;
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

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading payments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments & Dues</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage invoices and verify payment requests</p>
        </div>
      </div>

      {/* Tabs / Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
          <button 
            onClick={() => setActiveTab('REQUESTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'REQUESTS' ? 'bg-[#2c1b13] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
              <HiCollection /> Payment Requests
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-2">
                  {payments.filter((p: any) => p.paymentProof && !p.isVerified).length} Pending
              </span>
          </button>
          <button 
            onClick={() => setActiveTab('DEFAULTERS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'DEFAULTERS' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
              <HiExclamationCircle /> Unpaid / Defaulters
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-2">
                  {payments.filter((p: any) => (p.status === 'UNPAID' || p.status === 'OVERDUE') && !p.paymentProof).length}
              </span>
          </button>

          <div className="flex-1 sm:text-right relative">
             <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 sm:left-auto sm:right-full sm:-mr-8 z-10" />
             <input 
                type="text" 
                placeholder="Search..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-[#2c1b13]"
             />
          </div>
      </div>

      <div className="grid gap-6">
          {finalFilteredPayments.length === 0 && (
              <div className="p-12 text-center bg-gray-50 rounded-lg border border-dashed">
                  <p className="text-gray-500">No records found in this category.</p>
              </div>
          )}

          {finalFilteredPayments.map((payment: any) => (
             <div key={payment._id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 transition-all ${payment.paymentProof && !payment.isVerified ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-gray-100 dark:border-gray-700'}`}>
                 <div className="flex flex-col md:flex-row gap-6">
                     
                     {/* Data Column */}
                     <div className="flex-1 space-y-4">
                         <div className="flex justify-between items-start">
                             <div>
                                 <div className="flex items-center gap-2 mb-1">
                                     <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{payment.receiptNumber}</span>
                                     <span className="text-xs text-gray-400">
                                         {new Date(payment.createdAt).toLocaleDateString()}
                                         {/* Show Month Name explicitly if useful */}
                                          - {new Date(payment.year, payment.month - 1).toLocaleString('default', { month: 'short' })} '{payment.year.toString().slice(-2)}
                                     </span>
                                 </div>
                                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">{payment.studentId?.fullName || "Unknown Student"}</h3>
                                 <p className="text-sm text-gray-600">Room: {payment.studentId?.roomId?.roomNumber || "N/A"} / Bed: {payment.studentId?.bedNumber || "N/A"}</p>
                             </div>
                             <div className="text-right">
                                 <div className="text-xl font-bold font-mono text-gray-900 dark:text-white">PKR {payment.amount.toLocaleString()}</div>
                                 <div className="text-xs uppercase tracking-wider font-semibold text-gray-500">{payment.paymentType}</div>
                             </div>
                         </div>

                         <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                             <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                 payment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                 payment.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                                 payment.status === 'UNPAID' ? 'bg-gray-100 text-gray-700' :
                                 payment.status === 'OVERDUE' ? 'bg-red-50 text-red-600 border border-red-200' :
                                 'bg-amber-100 text-amber-700'
                             }`}>
                                 {payment.status}
                             </div>
                             {payment.isVerified && (
                                 <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                     <HiCheck /> Verified by Manager
                                 </div>
                             )}
                         </div>
                     </div>

                     {/* Proof & Action Column - Only if Proof exists */}
                     {payment.paymentProof ? (
                         <div className="md:w-64 flex flex-col gap-4 border-l border-gray-100 dark:border-gray-700 pl-6">
                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-bold text-gray-500 uppercase">Attached Proof</p>
                                <button 
                                   onClick={() => setSelectedImage(payment.paymentProof)}
                                   className="relative h-32 w-full rounded-lg overflow-hidden border border-gray-200 group bg-gray-50"
                                >
                                    <img 
                                       src={payment.paymentProof} 
                                       alt="Proof" 
                                       className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <HiExternalLink className="text-white opacity-0 group-hover:opacity-100" />
                                    </div>
                                </button>
                                
                                {!payment.isVerified && (
                                    <button
                                       onClick={() => handleVerify(payment._id)}
                                       disabled={isVerifying && verifyingId === payment._id}
                                       className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isVerifying && verifyingId === payment._id ? 'Verifying...' : (
                                            <>
                                                <HiCheck size={16} /> Verify Payment
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                         </div>
                     ) : (
                         <div className="md:w-64 flex items-center justify-center border-l border-gray-100 dark:border-gray-700 pl-6">
                             <div className="text-center p-4 bg-gray-50 rounded text-gray-400 text-xs">
                                 No payment proof uploaded.
                             </div>
                         </div>
                     )}
                 </div>
             </div>
          ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setSelectedImage(null)}>
              <button className="absolute top-4 right-4 text-white hover:text-gray-300">
                  <HiX size={32} />
              </button>
              <img 
                 src={selectedImage} 
                 alt="Full Proof" 
                 className="max-h-[90vh] max-w-full rounded shadow-2xl" 
                 onClick={(e) => e.stopPropagation()} 
              />
          </div>
      )}
    </div>
  );
}
