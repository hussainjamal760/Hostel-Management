'use client';

import { useState } from 'react';
import { useGetAllPaymentsQuery, useSubmitProofMutation, useCreatePaymentMutation } from '@/lib/services/paymentApi';
import { useGetStudentMeQuery } from '@/lib/services/studentApi';
import { useGetHostelByIdQuery } from '@/lib/services/hostelApi';
import { toast } from 'react-hot-toast';

export default function StudentInvoicesPage() {
  const { data: studentData, isLoading: isStudentLoading } = useGetStudentMeQuery();
  const { data: invoicesData, isLoading: isInvoicesLoading, refetch } = useGetAllPaymentsQuery(
    { studentId: studentData?.data?._id }, 
    { skip: !studentData?.data?._id }
  );

  const [createPayment] = useCreatePaymentMutation();
  const [submitProof] = useSubmitProofMutation();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [localPreviews, setLocalPreviews] = useState<Record<string, string>>({});

  const invoices = invoicesData?.data?.payments || [];
  const isLoading = isStudentLoading || isInvoicesLoading;
  
  const student = studentData?.data;
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const hasCurrentMonthInvoice = invoices.some(inv => inv.month === currentMonth && inv.year === currentYear);
  const showDueCard = student?.feeStatus === 'DUE' && !hasCurrentMonthInvoice;

  const handleCreateAndUpload = async (file: File) => {
    if (!file || !student) return;
    if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLocalPreviews(prev => ({ ...prev, new: previewUrl }));

    try {
        setUploadingId('new');
        const date = new Date();
        const random = Math.floor(1000 + Math.random() * 9000);
        const receiptNumber = `PAY-${currentYear}${currentMonth}-${date.getDate()}-${random}`;
        
        const paymentRes = await createPayment({
            studentId: student._id,
            hostelId: student.hostelId,
            amount: student.totalDue > 0 ? student.totalDue : student.monthlyFee,
            paymentType: 'RENT',
            paymentMethod: 'BANK_TRANSFER',
            month: currentMonth,
            year: currentYear,
            receiptNumber
        }).unwrap();
        
        const paymentId = (paymentRes.data || paymentRes as any)._id;
        await submitProof({ id: paymentId, file }).unwrap();
        
        toast.success('Payment proof uploaded successfully!');
        
        // Transfer preview to the new ID so it stays visible after virtual card disappears
        setLocalPreviews(prev => {
            const next = { ...prev };
            next[paymentId] = previewUrl;
            delete next.new;
            return next;
        });

        await refetch();
        // We keep the local preview for the specific ID until next full refresh or slightly delayed
        // to ensure the server URL has time to propagate to the UI components.
    } catch (error: any) {
        toast.error(error?.data?.message || 'Failed to submit payment');
        setLocalPreviews(prev => {
            const next = { ...prev };
            delete next.new;
            return next;
        });
    } finally {
        setUploadingId(null);
    }
  };

  const handleFileUpload = async (paymentId: string, file: File) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setLocalPreviews(prev => ({ ...prev, [paymentId]: previewUrl }));

    try {
      setUploadingId(paymentId);
      await submitProof({ id: paymentId, file }).unwrap();
      toast.success('Payment proof uploaded successfully!');
      await refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to upload proof');
    } finally {
      setUploadingId(null);
    }
  };

  if (isLoading) {
      return <div className="p-8 text-center text-gray-500">Loading invoices...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-extrabold text-[#2c1b13]">Hostel Fee Challans</h1>
           <p className="text-gray-500">Official fee receipts and payment portal</p>
        </div>
        <button onClick={() => refetch()} className="px-4 py-2 border border-[#2c1b13] text-[#2c1b13] rounded-lg hover:bg-gray-50 transition-colors font-medium">
           Refresh
        </button>
      </div>
      
      <div className="grid gap-12">
          {showDueCard && (
            <ChallanForm 
               type="DUE"
               student={student}
               amount={student.totalDue || student.monthlyFee}
               month={currentMonth}
               year={currentYear}
               uploading={uploadingId === 'new'}
               localPreview={localPreviews.new}
               onUpload={handleCreateAndUpload}
            />
          )}

          {invoices.length === 0 && !showDueCard && (
            <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
                <p className="text-gray-500 text-xl font-medium">No fee challans found.</p>
            </div>
          )}

          {invoices.map((invoice) => (
            <ChallanForm 
               key={invoice._id}
               type="EXISTING"
               invoice={invoice}
               student={student}
               uploading={uploadingId === invoice._id}
               localPreview={localPreviews[invoice._id]}
               onUpload={(file: File) => handleFileUpload(invoice._id, file)}
            />
          ))}
      </div>
    </div>
  );
}

interface ChallanFormProps {
    type: 'DUE' | 'EXISTING';
    invoice?: any;
    student: any;
    amount?: number;
    month?: number;
    year?: number;
    uploading: boolean;
    localPreview?: string;
    onUpload: (file: File) => void;
}

function ChallanForm({ type, invoice, student, amount, month, year, uploading, localPreview, onUpload }: ChallanFormProps) {
    const hostelId = student?.hostelId;
    const { data: hostelData } = useGetHostelByIdQuery(hostelId, { skip: !hostelId });
    const paymentDetails = hostelData?.data?.paymentDetails;

    const displayAmount = type === 'DUE' ? amount : invoice.amount;
    const displayMonth = type === 'DUE' ? month : invoice.month;
    const displayYear = type === 'DUE' ? year : invoice.year;
    const monthName = new Date(displayYear, displayMonth - 1).toLocaleString('default', { month: 'long' });
    const status = type === 'DUE' ? 'UNPAID' : (invoice.isVerified ? 'PAID' : (invoice.paymentProof ? 'UNDER_REVIEW' : 'UNPAID'));

    const effectiveProof = localPreview || (type === 'EXISTING' ? invoice.paymentProof : null);

    return (
        <div className="relative bg-white border-2 border-gray-900 rounded-lg overflow-hidden shadow-2xl font-serif">
            {/* Stamp/Status Backdrop */}
            {status === 'PAID' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-30deg] opacity-20 pointer-events-none">
                    <div className="border-8 border-green-600 rounded-full px-12 py-6 text-7xl font-black text-green-600 tracking-tighter uppercase">
                        RECEIVED
                    </div>
                </div>
            )}
            {status === 'UNDER_REVIEW' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-20deg] opacity-10 pointer-events-none">
                    <div className="border-8 border-amber-600 rounded-xl px-12 py-6 text-6xl font-black text-amber-600 uppercase tracking-tighter">
                        PENDING
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="p-6 border-b-2 border-gray-900 flex justify-between items-start bg-gray-50">
                <div>
                   <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 leading-none mb-1">Fee Challan Form</h2>
                   <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">{hostelData?.data?.name || "Hostelite Management System"}</p>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">Receipt No.</div>
                    <div className="text-lg font-black font-mono tracking-tighter">
                        {type === 'EXISTING' ? invoice.receiptNumber : `DRAFT-${Date.now().toString().slice(-6)}`}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x-2 divide-gray-900">
                {/* Left Side: Student & Charge Details */}
                <div className="flex-1 p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                        <div className="col-span-2">
                             <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Student Particulars</div>
                             <div className="text-xl font-bold border-b border-gray-200 pb-1">{student?.fullName}</div>
                        </div>
                        <div>
                             <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Room / Bed</div>
                             <div className="font-bold border-b border-gray-200 pb-1">{student?.roomId?.roomNumber} / {student?.bedNumber}</div>
                        </div>
                        <div>
                             <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">For Period</div>
                             <div className="font-bold border-b border-gray-200 pb-1">{monthName} {displayYear}</div>
                        </div>
                    </div>

                    <div className="border-2 border-gray-900">
                         <div className="bg-gray-100 p-2 border-b-2 border-gray-900 font-black text-xs uppercase tracking-widest flex justify-between">
                            <span>Description</span>
                            <span>Amount</span>
                         </div>
                         <div className="p-3">
                             <div className="flex justify-between items-end mb-1">
                                <span className="text-sm font-bold italic tracking-tight">Accommodation (Hostel Fee)</span>
                                <span className="font-mono font-bold tracking-tighter">PKR {displayAmount.toLocaleString()}</span>
                             </div>
                             <div className="flex justify-between items-end pt-4 border-t border-gray-300 mt-4">
                                <span className="text-sm font-black uppercase tracking-widest">Total Payable</span>
                                <span className="text-xl font-black font-mono tracking-tighter underline underline-offset-4 decoration-2">PKR {displayAmount.toLocaleString()}</span>
                             </div>
                         </div>
                    </div>
                    
                    {/* Visual Signal of payment */}
                    {status !== 'UNPAID' && (
                        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-4">
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-black text-green-800 uppercase text-xs tracking-widest">Payment Submitted</h4>
                                <p className="text-[10px] text-green-700 font-bold uppercase opacity-70 italic">Proof of payment has been recorded.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Bank & Proof Thumbnail */}
                <div className="md:w-72 p-6 flex flex-col justify-between bg-gray-50/50">
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Payment Methods</div>
                        {paymentDetails?.bankName ? (
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] font-bold text-blue-600 uppercase mb-0.5">Bank / Provider</div>
                                    <div className="font-black text-sm uppercase tracking-tight">{paymentDetails.bankName}</div>
                                </div>
                                <div className="p-3 bg-white border border-gray-200 rounded shadow-sm">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Account Number</div>
                                    <div className="font-black font-mono text-lg tracking-tighter text-blue-800 break-all leading-none">{paymentDetails.accountNumber}</div>
                                    <div className="text-[10px] font-bold text-gray-500 mt-2 italic">{paymentDetails.accountTitle}</div>
                                </div>
                                {paymentDetails.instructions && (
                                    <div className="text-[10px] italic text-gray-500 leading-tight">
                                        * {paymentDetails.instructions}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-4 border border-dashed border-gray-300 text-center rounded">
                                <p className="text-[10px] font-medium text-gray-400 uppercase">No Online Details Configured</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex flex-col gap-4">
                        {/* Preview of proof if exists */}
                        {effectiveProof && (
                             <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-900 group shadow-md">
                                <img src={effectiveProof} alt="Thumbnail" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Preview</span>
                                </div>
                             </div>
                        )}

                        {(status === 'UNPAID' || (status === 'UNDER_REVIEW' && !uploading)) ? (
                            <label className="group flex flex-col items-center justify-center p-4 border-2 border-dashed border-blue-400 hover:border-blue-600 bg-white cursor-pointer rounded-xl transition-all shadow-sm">
                                <span className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1 group-hover:scale-110 transition-transform text-center">
                                    {uploading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                                            <span>Uploading...</span>
                                        </div>
                                    ) : (effectiveProof ? 'Change Receipt' : 'Upload Receipt')}
                                </span>
                                <span className="text-[8px] font-medium text-blue-500 uppercase tracking-widest opacity-60">PDF or Images</span>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => e.target.files && onUpload(e.target.files[0])}
                                    disabled={uploading}
                                />
                            </label>
                        ) : status === 'PAID' ? (
                            <div className="p-3 bg-green-50 border-2 border-green-600 rounded text-center">
                                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Payment Accepted</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Proof View Section (Full Width Footer) */}
            {effectiveProof && (
                <div className="p-8 bg-gray-100 border-t-2 border-gray-900">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Original Full-Size Receipt Attached</div>
                        <a href={effectiveProof} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-2">Open in New Tab</a>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border-2 border-gray-900 bg-white p-2 shadow-inner">
                        <img 
                            src={effectiveProof} 
                            alt="Payment Proof" 
                            className="w-full h-auto max-h-[600px] object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
