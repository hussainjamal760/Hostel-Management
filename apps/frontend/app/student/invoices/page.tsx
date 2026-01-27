'use client';

import { useState } from 'react';
import { useGetAllPaymentsQuery, useSubmitProofMutation } from '@/lib/services/paymentApi';
import { useGetStudentMeQuery } from '@/lib/services/studentApi';
import { useGetHostelByIdQuery } from '@/lib/services/hostelApi';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import { HiPrinter, HiDownload } from 'react-icons/hi';

export default function StudentInvoicesPage() {
  const { data: studentData, isLoading: isStudentLoading } = useGetStudentMeQuery();
  
  // Filters
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const { data: invoicesData, isLoading: isInvoicesLoading, refetch } = useGetAllPaymentsQuery(
    { 
        studentId: studentData?.data?._id,
        month: selectedMonth,
        year: selectedYear
    }, 
    { skip: !studentData?.data?._id }
  );

  const [submitProof] = useSubmitProofMutation();
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [localPreviews, setLocalPreviews] = useState<Record<string, string>>({});

  const invoices = [...(invoicesData?.data || [])].sort((a: any, b: any) => {
      // Sort priority: OVERDUE > UNPAID > PENDING > COMPLETED > Newest Date
      const score = (status: string) => {
          if (status === 'OVERDUE') return 4;
          if (status === 'UNPAID') return 3;
          if (status === 'PENDING') return 2;
          return 1;
      };
      const diff = score(b.status) - score(a.status);
      if (diff !== 0) return diff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const isLoading = isStudentLoading || isInvoicesLoading;
  const student = studentData?.data;

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

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  if (isLoading) {
      return <div className="p-8 text-center text-gray-500">Loading invoices...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
           <h1 className="text-3xl font-extrabold text-[#2c1b13]">Hostel Fee Challans</h1>
           <p className="text-gray-500">Official fee receipts and payment portal</p>
        </div>
        
        <div className="flex gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
            <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border-none bg-transparent font-medium focus:ring-0 cursor-pointer"
            >
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <div className="w-px bg-gray-300"></div>
            <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border-none bg-transparent font-medium focus:ring-0 cursor-pointer"
            >
                 {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
        </div>
      </div>
      
      <div className="grid gap-12">
          {invoices.length === 0 && (
            <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
                <p className="text-gray-500 text-xl font-medium">No fee challans found for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}.</p>
                <button onClick={() => { setSelectedMonth(new Date().getMonth() + 1); setSelectedYear(new Date().getFullYear()); }} className="mt-4 text-brand-primary font-bold hover:underline">
                    View Current Month
                </button>
            </div>
          )}

          {invoices.map((invoice: any) => (
            <ChallanForm 
               key={invoice._id}
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
    invoice: any;
    student: any;
    uploading: boolean;
    localPreview?: string;
    onUpload: (file: File) => void;
}

function ChallanForm({ invoice, student, uploading, localPreview, onUpload }: ChallanFormProps) {
    const hostelId = student?.hostelId;
    const { data: hostelData } = useGetHostelByIdQuery(hostelId, { skip: !hostelId });
    const paymentDetails = hostelData?.data?.paymentDetails;

    // Use invoice data directly
    const displayAmount = invoice.amount;
    const displayMonth = invoice.month;
    const displayYear = invoice.year;
    // Handle month name safely
    const monthName = new Date(displayYear, displayMonth - 1).toLocaleString('default', { month: 'long' });
    
    let statusDisplay = invoice.status;
    if (statusDisplay === 'PENDING') statusDisplay = 'UNDER_REVIEW'; // UI Alias

    const effectiveProof = localPreview || invoice.paymentProof;

    const handlePrint = () => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("HOSTEL MANAGEMENT SYSTEM", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(hostelData?.data?.name || "Official Fee Challan", 105, 28, { align: "center" });

        // Invoice Meta
        doc.setFontSize(10);
        doc.text(`Receipt No: ${invoice.receiptNumber}`, 150, 40);
        doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 150, 45);
        doc.text(`Status: ${invoice.status}`, 150, 50);

        // Student Details
        doc.setDrawColor(0);
        doc.line(15, 55, 195, 55);
        
        doc.setFont("helvetica", "bold");
        doc.text("Student Details:", 20, 65);
        
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${student?.fullName}`, 20, 72);
        doc.text(`Roll No: ${student?.rollNumber || '-'}`, 20, 77);
        doc.text(`Room: ${student?.roomId?.roomNumber || '-'} / Bed ${student?.bedNumber || '-'}`, 120, 72);
        doc.text(`Billing Month: ${monthName} ${displayYear}`, 120, 77);

        // Table
        const startY = 90;
        doc.setFillColor(240, 240, 240);
        doc.rect(15, startY, 180, 10, 'F');
        doc.setFont("helvetica", "bold");
        doc.text("Description", 20, startY + 7);
        doc.text("Amount (PKR)", 160, startY + 7);

        doc.setFont("helvetica", "normal");
        doc.text(`Hostel Fee / Rent - ${monthName}`, 20, startY + 20);
        doc.text(`${displayAmount.toLocaleString()}`, 160, startY + 20);

        doc.line(15, startY + 30, 195, startY + 30);
        
        doc.setFont("helvetica", "bold");
        doc.text("Total Payable", 120, startY + 40);
        doc.text(`PKR ${displayAmount.toLocaleString()}`, 160, startY + 40);

        // Bank Details
        if (paymentDetails?.bankName) {
            const bankY = startY + 60;
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("Bank Details for Payment:", 20, bankY);
            doc.setFont("helvetica", "normal");
            doc.text(`Bank: ${paymentDetails.bankName}`, 20, bankY + 7);
            doc.text(`Account Title: ${paymentDetails.accountTitle}`, 20, bankY + 12);
            doc.text(`Account No: ${paymentDetails.accountNumber}`, 20, bankY + 17);
        }

        // Footer
        doc.setFontSize(8);
        doc.text("This is a computer generated receipt and does not require a signature.", 105, 280, { align: "center" });

        doc.save(`${invoice.receiptNumber}.pdf`);
    };

    return (
        <div className={`relative bg-white border-2 rounded-lg overflow-hidden shadow-2xl font-serif ${
            statusDisplay === 'OVERDUE' ? 'border-red-600' : 'border-gray-900'
        }`}>
            {/* ... (Existing Status Stamps) ... */}
            {statusDisplay === 'COMPLETED' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-30deg] opacity-20 pointer-events-none">
                    <div className="border-8 border-green-600 rounded-full px-12 py-6 text-7xl font-black text-green-600 tracking-tighter uppercase">
                        RECEIVED
                    </div>
                </div>
            )}
             {statusDisplay === 'UNDER_REVIEW' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-20deg] opacity-10 pointer-events-none">
                    <div className="border-8 border-amber-600 rounded-xl px-12 py-6 text-4xl font-black text-amber-600 uppercase tracking-tighter text-center">
                        REQUEST SENT<br/>FOR VERIFICATION
                    </div>
                </div>
            )}
             {statusDisplay === 'OVERDUE' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] opacity-10 pointer-events-none">
                    <div className="border-8 border-red-600 rounded-xl px-12 py-6 text-6xl font-black text-red-600 uppercase tracking-tighter text-center">
                        OVERDUE
                    </div>
                </div>
            )}

            {/* Header */}
            <div className={`p-6 border-b-2 flex justify-between items-start ${
                statusDisplay === 'OVERDUE' ? 'bg-red-50 border-red-600' : 'bg-gray-50 border-gray-900'
            }`}>
                <div>
                   <h2 className={`text-2xl font-black uppercase tracking-tight leading-none mb-1 ${
                       statusDisplay === 'OVERDUE' ? 'text-red-900' : 'text-gray-900'
                   }`}>Fee Challan Form</h2>
                   <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">{hostelData?.data?.name || "Hostelite Management System"}</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-2 mb-2">
                        <button 
                            onClick={handlePrint}
                            className="flex items-center gap-1 text-xs font-bold bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-gray-800 transition-colors"
                        >
                            <HiPrinter /> Print / Save PDF
                        </button>
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">Receipt No.</div>
                    <div className="text-lg font-black font-mono tracking-tighter">
                        {invoice.receiptNumber}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className={`flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x-2 ${
                 statusDisplay === 'OVERDUE' ? 'divide-red-600' : 'divide-gray-900'
            }`}>
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

                    <div className={`border-2 ${statusDisplay === 'OVERDUE' ? 'border-red-600' : 'border-gray-900'}`}>
                         <div className={`p-2 border-b-2 font-black text-xs uppercase tracking-widest flex justify-between ${
                             statusDisplay === 'OVERDUE' ? 'bg-red-50 border-red-600 text-red-900' : 'bg-gray-100 border-gray-900'
                         }`}>
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
                    {statusDisplay === 'UNDER_REVIEW' && (
                        <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg flex items-center gap-4">
                            <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-black text-amber-800 uppercase text-xs tracking-widest">Verification Pending</h4>
                                <p className="text-[10px] text-amber-700 font-bold uppercase opacity-70 italic">Proof submitted. Waiting for manager approval.</p>
                            </div>
                        </div>
                    )}

                    {statusDisplay === 'COMPLETED' && (
                        <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-4">
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-black text-green-800 uppercase text-xs tracking-widest">Payment Accepted</h4>
                                <p className="text-[10px] text-green-700 font-bold uppercase opacity-70 italic">Your payment has been verified.</p>
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
                             <div className={`relative aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 group shadow-md ${
                                 statusDisplay === 'OVERDUE' ? 'border-red-600' : 'border-gray-900'
                             }`}>
                                <img src={effectiveProof} alt="Thumbnail" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Preview</span>
                                </div>
                             </div>
                        )}

                        {(statusDisplay === 'UNPAID' || statusDisplay === 'OVERDUE' || (statusDisplay === 'UNDER_REVIEW' && !uploading)) ? (
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
                        ) : statusDisplay === 'COMPLETED' ? (
                            <div className="p-3 bg-green-50 border-2 border-green-600 rounded text-center">
                                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Payment Accepted</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Proof View Section (Full Width Footer) */}
            {effectiveProof && (
                <div className={`p-8 bg-gray-100 border-t-2 ${
                    statusDisplay === 'OVERDUE' ? 'border-red-600' : 'border-gray-900'
                }`}>
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
