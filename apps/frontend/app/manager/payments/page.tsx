'use client';

import { useState } from 'react';
import { useGetAllPaymentsQuery, useVerifyPaymentMutation } from '@/lib/services/paymentApi';
import { useGetManagerQuery, useGetManagerMeQuery } from '@/lib/services/managerApi';
import { toast } from 'react-hot-toast';
import { HiCheck, HiX, HiExternalLink, HiSearch } from 'react-icons/hi';
import Image from 'next/image';

export default function ManagerPaymentsPage() {
  const { data: managerData } = useGetManagerMeQuery();
  const hostelId = managerData?.data?.hostelId;

  console.log('Manager Data:', managerData);
  console.log('Hostel ID:', hostelId);

  const { data: paymentsData, isLoading, refetch } = useGetAllPaymentsQuery(
    { hostelId }, 
    { skip: !hostelId }
  );

  console.log('Payments Data:', paymentsData);

  const [verifyPayment, { isLoading: isVerifying }] = useVerifyPaymentMutation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const payments = paymentsData?.data || [];

  // Filter: Show pending proofs first, then verified, then unpaid without proofs
  const filteredPayments = payments.filter((payment: any) => {
      if(!search) return true;
      const searchLower = search.toLowerCase();
      return (
          payment.studentId?.fullName?.toLowerCase().includes(searchLower) ||
          payment.receiptNumber?.toLowerCase().includes(searchLower) ||
          payment.studentId?.roomId?.roomNumber?.toLowerCase().includes(searchLower)
      );
  }).sort((a: any, b: any) => {
      // Prioritize: Has Proof & Not Verified
      const aPending = a.paymentProof && !a.isVerified;
      const bPending = b.paymentProof && !b.isVerified;
      if (aPending && !bPending) return -1;
      if (!aPending && bPending) return 1;
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Requests</h1>
          <p className="text-gray-500 dark:text-gray-400">Verify student fee submissions</p>
        </div>
        <div className="relative">
             <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
                type="text" 
                placeholder="Search student, room, or receipt..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
             />
        </div>
      </div>

      <div className="grid gap-6">
          {filteredPayments.length === 0 && (
              <div className="p-12 text-center bg-gray-50 rounded-lg border border-dashed">
                  <p className="text-gray-500">No payment records found.</p>
              </div>
          )}

          {filteredPayments.map((payment: any) => (
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

                     {/* Proof & Action Column */}
                     <div className="md:w-64 flex flex-col gap-4 border-l border-gray-100 dark:border-gray-700 pl-6">
                         {payment.paymentProof ? (
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
                         ) : (
                             <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg p-4">
                                 <p className="text-xs text-gray-400 text-center">No proof uploaded yet</p>
                             </div>
                         )}
                     </div>
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
