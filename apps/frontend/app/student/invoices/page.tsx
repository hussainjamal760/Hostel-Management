'use client';

import { useState } from 'react';
import { useGetAllPaymentsQuery, useSubmitProofMutation } from '@/lib/services/paymentApi';
import { useGetStudentMeQuery } from '@/lib/services/studentApi';
import { useGetHostelByIdQuery } from '@/lib/services/hostelApi';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';

export default function StudentInvoicesPage() {
  const { data: studentData, isLoading: isStudentLoading } = useGetStudentMeQuery();
  
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
      return (
          <div className="flex flex-col items-center justify-center h-[50vh] bg-surface rounded-3xl border border-outline-variant shadow-sm">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary mb-4"></div>
            <p className="text-body-lg text-on-surface-variant font-medium">Loading invoices...</p>
          </div>
      );
  }

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-display-lg-mobile md:text-display-lg text-primary flex items-center gap-3">
                <span className="material-symbols-outlined text-[36px] text-secondary">receipt_long</span>
                Hostel Fee Challans
           </h1>
           <p className="text-body-lg text-on-surface-variant mt-1">Official fee receipts and payment portal</p>
        </div>
        
        <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-2xl shadow-sm border border-outline-variant/50">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant mr-2">calendar_month</span>
            <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border-none bg-transparent font-bold text-on-surface focus:ring-0 cursor-pointer pl-1 pr-6 py-2"
            >
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <div className="w-px h-6 bg-outline-variant mx-2"></div>
            <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border-none bg-transparent font-bold text-on-surface focus:ring-0 cursor-pointer pl-2 pr-6 py-2"
            >
                 {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
        </div>
      </div>
      
      <div className="space-y-12">
          {invoices.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center text-on-surface-variant bg-surface rounded-3xl border border-dashed border-outline-variant shadow-sm">
                <div className="w-20 h-20 bg-surface-container-lowest rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[40px] opacity-50">receipt_long</span>
                </div>
                <p className="text-display-xs font-bold text-on-surface mb-2">No fee challans found</p>
                <p className="text-body-lg mb-6">There are no records for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}.</p>
                <button 
                  onClick={() => { setSelectedMonth(new Date().getMonth() + 1); setSelectedYear(new Date().getFullYear()); }} 
                  className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[20px]">today</span>
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

    const displayAmount = invoice.amount;
    const displayMonth = invoice.month;
    const displayYear = invoice.year;
    const monthName = new Date(displayYear, displayMonth - 1).toLocaleString('default', { month: 'long' });
    
    let statusDisplay = invoice.status;
    if (statusDisplay === 'PENDING') statusDisplay = 'UNDER_REVIEW';

    const effectiveProof = localPreview || invoice.paymentProof;

    const handlePrint = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("HOSTEL MANAGEMENT SYSTEM", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(hostelData?.data?.name || "Official Fee Challan", 105, 28, { align: "center" });

        doc.setFontSize(10);
        doc.text(`Receipt No: ${invoice.receiptNumber}`, 150, 40);
        doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 150, 45);
        doc.text(`Status: ${invoice.status}`, 150, 50);
        doc.setDrawColor(0);
        doc.line(15, 55, 195, 55);
        
        doc.setFont("helvetica", "bold");
        doc.text("Student Details:", 20, 65);
        
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${student?.fullName}`, 20, 72);
        doc.text(`Roll No: ${student?.rollNumber || '-'}`, 20, 77);
        doc.text(`Room: ${student?.roomId?.roomNumber || '-'} / Bed ${student?.bedNumber || '-'}`, 120, 72);
        doc.text(`Billing Month: ${monthName} ${displayYear}`, 120, 77);

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

        doc.setFontSize(8);
        doc.text("This is a computer generated receipt.", 105, 280, { align: "center" });

        doc.save(`${invoice.receiptNumber}.pdf`);
    };

    return (
        <div className={`relative bg-surface rounded-3xl overflow-hidden shadow-sm border transition-all hover:shadow-md ${
            statusDisplay === 'OVERDUE' ? 'border-error border-2' : 'border-outline-variant'
        }`}>
            {statusDisplay === 'COMPLETED' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-20deg] opacity-10 pointer-events-none select-none z-0">
                    <span className="material-symbols-outlined text-[240px] text-green-600">verified</span>
                </div>
            )}
             {statusDisplay === 'UNDER_REVIEW' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-20deg] opacity-5 pointer-events-none select-none z-0">
                    <span className="material-symbols-outlined text-[240px] text-secondary">pending_actions</span>
                </div>
            )}
             {statusDisplay === 'OVERDUE' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] opacity-[0.03] pointer-events-none select-none z-0">
                    <span className="material-symbols-outlined text-[240px] text-error">warning</span>
                </div>
            )}

            <div className={`p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-outline-variant/50 relative z-10 ${
                statusDisplay === 'OVERDUE' ? 'bg-error-container/30' : 'bg-surface-container-lowest'
            }`}>
                <div className="mb-4 md:mb-0">
                   <h2 className={`text-display-md font-bold mb-1 flex items-center gap-3 ${
                       statusDisplay === 'OVERDUE' ? 'text-error' : 'text-on-surface'
                   }`}>
                        <span className="material-symbols-outlined text-[32px]">receipt</span>
                        Fee Challan
                   </h2>
                   <p className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider">{hostelData?.data?.name || "Hostelite Management System"}</p>
                </div>
                <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-xl border border-outline-variant/50">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-tight">Receipt No.</span>
                            <span className="font-mono text-body-lg font-bold text-primary tracking-tighter leading-none mt-0.5">{invoice.receiptNumber}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handlePrint}
                        className="w-full md:w-auto flex items-center justify-center gap-2 text-label-md font-bold bg-primary text-white px-5 py-2.5 rounded-xl hover:shadow-md transition-all shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[18px]">print</span> 
                        Print PDF
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row relative z-10">
                <div className="flex-1 p-6 md:p-8 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/50">
                        <div className="sm:col-span-2 lg:col-span-3 pb-4 border-b border-outline-variant/50">
                             <div className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Student Name</div>
                             <div className="text-display-xs font-bold text-on-surface">{student?.fullName}</div>
                        </div>
                        <div>
                             <div className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Room / Bed</div>
                             <div className="text-body-lg font-bold text-on-surface flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-secondary">meeting_room</span>
                                {student?.roomId?.roomNumber} / {student?.bedNumber}
                             </div>
                        </div>
                        <div>
                             <div className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Billing Month</div>
                             <div className="text-body-lg font-bold text-on-surface flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-secondary">calendar_month</span>
                                {monthName} {displayYear}
                             </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-outline-variant/50 overflow-hidden bg-surface-container-lowest">
                         <div className="px-6 py-4 border-b border-outline-variant/50 bg-surface-container-low flex justify-between items-center">
                            <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Description</span>
                            <span className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Amount</span>
                         </div>
                         <div className="p-6">
                             <div className="flex justify-between items-center mb-6">
                                <span className="text-body-lg font-bold text-on-surface">Accommodation (Hostel Fee)</span>
                                <span className="text-body-lg font-medium text-on-surface">PKR {displayAmount.toLocaleString()}</span>
                             </div>
                             <div className="flex justify-between items-center pt-5 border-t border-dashed border-outline-variant">
                                <span className="text-label-lg font-bold uppercase tracking-wider text-on-surface">Total Payable</span>
                                <span className="text-display-sm font-bold text-primary">PKR {displayAmount.toLocaleString()}</span>
                             </div>
                         </div>
                    </div>
                    
                    {statusDisplay === 'UNDER_REVIEW' && (
                        <div className="p-5 bg-secondary-container border border-secondary/20 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-secondary text-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                <span className="material-symbols-outlined text-[24px]">hourglass_top</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-secondary text-label-lg uppercase tracking-wider mb-1">Verification Pending</h4>
                                <p className="text-body-sm font-medium text-secondary/80">Proof submitted. Waiting for manager approval.</p>
                            </div>
                        </div>
                    )}

                    {statusDisplay === 'COMPLETED' && (
                        <div className="p-5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                                <span className="material-symbols-outlined text-[24px]">verified</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-green-800 text-label-lg uppercase tracking-wider mb-1">Payment Accepted</h4>
                                <p className="text-body-sm font-medium text-green-700/80">Your payment has been successfully verified.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:w-[340px] border-t lg:border-t-0 lg:border-l border-outline-variant/50 bg-surface-container-lowest p-6 md:p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <span className="material-symbols-outlined text-[20px]">account_balance</span>
                            <span className="text-label-md font-bold uppercase tracking-wider">Payment Options</span>
                        </div>

                        {paymentDetails?.bankName ? (
                            <div className="space-y-4">
                                <div>
                                    <div className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Bank / Provider</div>
                                    <div className="text-body-lg font-bold text-on-surface">{paymentDetails.bankName}</div>
                                </div>
                                <div className="p-4 bg-surface border border-outline-variant/50 rounded-2xl shadow-sm">
                                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Account Number</div>
                                    <div className="font-mono text-xl font-bold text-primary break-all mb-3">{paymentDetails.accountNumber}</div>
                                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Account Title</div>
                                    <div className="text-body-sm font-bold text-on-surface">{paymentDetails.accountTitle}</div>
                                </div>
                                {paymentDetails.instructions && (
                                    <div className="p-3 bg-surface-container-low rounded-xl text-body-sm text-on-surface-variant italic border border-outline-variant/50">
                                        <span className="material-symbols-outlined text-[14px] inline-block align-middle mr-1">info</span>
                                        {paymentDetails.instructions}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-6 border border-dashed border-outline-variant text-center rounded-2xl bg-surface">
                                <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-2">money_off</span>
                                <p className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">No Online Details Configured</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex flex-col gap-4">
                        {effectiveProof && (
                             <div className={`relative aspect-[4/3] bg-surface rounded-2xl overflow-hidden border-2 group shadow-sm ${
                                 statusDisplay === 'OVERDUE' ? 'border-error' : 'border-primary/20'
                             }`}>
                                <img src={effectiveProof} alt="Proof" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                     <span className="text-label-md font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                        Preview Attached
                                     </span>
                                </div>
                             </div>
                        )}

                        {(statusDisplay === 'UNPAID' || statusDisplay === 'OVERDUE' || (statusDisplay === 'UNDER_REVIEW' && !uploading)) ? (
                            <label className="group flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 bg-surface cursor-pointer rounded-2xl transition-all shadow-sm">
                                <span className="material-symbols-outlined text-[28px] text-primary mb-2 group-hover:-translate-y-1 transition-transform">
                                    {uploading ? 'cloud_sync' : (effectiveProof ? 'cloud_done' : 'cloud_upload')}
                                </span>
                                <span className="text-label-md font-bold text-primary uppercase tracking-widest mb-1 text-center">
                                    {uploading ? 'Uploading...' : (effectiveProof ? 'Change Receipt' : 'Upload Receipt')}
                                </span>
                                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-70">JPG, PNG, PDF</span>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*,.pdf"
                                    onChange={(e) => e.target.files && onUpload(e.target.files[0])}
                                    disabled={uploading}
                                />
                            </label>
                        ) : statusDisplay === 'COMPLETED' ? (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-center flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-[24px] text-green-600">check_circle</span>
                                <span className="text-label-sm font-bold text-green-700 uppercase tracking-widest">Requirement Met</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
