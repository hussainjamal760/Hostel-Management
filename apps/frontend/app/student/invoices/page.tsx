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
        <div className={`relative bg-surface rounded-2xl overflow-hidden shadow-lg border transition-all ${
            statusDisplay === 'OVERDUE' ? 'border-error' : 'border-outline-variant/40'
        } max-w-4xl mx-auto flex flex-col md:flex-row mb-8`}>
            
            {/* Main Invoice Ticket */}
            <div className="flex-1 flex flex-col relative bg-white min-h-[450px]">
                {/* Background Watermark Stamp */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 flex items-center justify-center">
                   {statusDisplay === 'COMPLETED' && <div className="text-[120px] md:text-[180px] text-green-500/10 font-black -rotate-12 select-none uppercase tracking-widest border-8 border-green-500/10 rounded-3xl px-8">PAID</div>}
                   {statusDisplay === 'UNDER_REVIEW' && <div className="text-[100px] md:text-[140px] text-secondary/10 font-black -rotate-12 select-none uppercase tracking-widest border-8 border-secondary/10 rounded-3xl px-8">REVIEW</div>}
                   {statusDisplay === 'OVERDUE' && <div className="text-[100px] md:text-[150px] text-error/10 font-black -rotate-12 select-none uppercase tracking-widest border-8 border-error/10 rounded-3xl px-8">OVERDUE</div>}
                   {statusDisplay === 'UNPAID' && <div className="text-[100px] md:text-[150px] text-on-surface-variant/5 font-black -rotate-12 select-none uppercase tracking-widest border-8 border-on-surface-variant/5 rounded-3xl px-8">UNPAID</div>}
                </div>

                {/* Header Section */}
                <div className={`p-8 pb-6 flex justify-between items-start relative z-20 ${
                    statusDisplay === 'OVERDUE' ? 'bg-error text-white' : 'bg-primary text-white'
                }`}>
                    <div>
                        <h2 className="text-display-sm font-black uppercase tracking-widest mb-1">Hostel Fee Challan</h2>
                        <div className="text-label-lg font-medium opacity-90">{hostelData?.data?.name || "Official Receipt"}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-1">Receipt No.</div>
                        <div className="font-mono text-xl font-bold">{invoice.receiptNumber}</div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="px-8 py-6 relative z-20 grid grid-cols-2 gap-8 border-b border-dashed border-outline-variant/40">
                    <div>
                        <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Billed To</div>
                        <div className="text-body-lg font-bold text-on-surface">{student?.fullName}</div>
                        <div className="text-body-sm text-on-surface-variant font-medium mt-1">Room {student?.roomId?.roomNumber} / Bed {student?.bedNumber}</div>
                        {student?.rollNumber && <div className="text-body-sm text-on-surface-variant font-medium">Roll No: {student.rollNumber}</div>}
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Billing Period</div>
                        <div className="text-body-lg font-bold text-on-surface">{monthName} {displayYear}</div>
                        
                        <div className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1 mt-4">Issue Date</div>
                        <div className="text-body-sm font-bold text-on-surface">{new Date(invoice.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="px-8 py-6 relative z-20 flex-1">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-outline-variant/50">
                                <th className="pb-3 text-[11px] uppercase tracking-widest text-on-surface-variant font-black text-left">Description</th>
                                <th className="pb-3 text-[11px] uppercase tracking-widest text-on-surface-variant font-black text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="font-bold text-on-surface text-body-lg">
                            <tr>
                                <td className="py-5">Hostel Accommodation Fee</td>
                                <td className="py-5 text-right font-mono tracking-tight">PKR {displayAmount.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Total Footer */}
                <div className="px-8 py-6 bg-surface-container-lowest border-t-2 border-outline-variant/50 flex justify-between items-center relative z-20 mt-auto">
                    <div className="text-label-lg uppercase tracking-widest text-on-surface-variant font-black">Total Payable</div>
                    <div className="text-display-sm font-black text-primary tracking-tighter">PKR {displayAmount.toLocaleString()}</div>
                </div>
            </div>

            {/* Middle Perforation Effect (Desktop Only) */}
            <div className="hidden md:flex flex-col justify-between items-center w-6 relative -mx-3 z-30 pointer-events-none">
                <div className="w-6 h-6 rounded-full bg-[#f8f9fa] -mt-3 shadow-inner border border-outline-variant/30"></div>
                <div className="w-px h-full border-r-[3px] border-dashed border-outline-variant/30"></div>
                <div className="w-6 h-6 rounded-full bg-[#f8f9fa] -mb-3 shadow-inner border border-outline-variant/30"></div>
            </div>
            
            {/* Mobile Perforation Effect (Mobile Only) */}
            <div className="md:hidden flex justify-between items-center h-6 relative -my-3 z-30 pointer-events-none">
                <div className="w-6 h-6 rounded-full bg-[#f8f9fa] -ml-3 shadow-inner border border-outline-variant/30"></div>
                <div className="h-px w-full border-b-[3px] border-dashed border-outline-variant/30"></div>
                <div className="w-6 h-6 rounded-full bg-[#f8f9fa] -mr-3 shadow-inner border border-outline-variant/30"></div>
            </div>

            {/* Action / Payment Panel */}
            <div className="md:w-[340px] bg-surface-container-low p-8 flex flex-col relative z-20">
                
                <div className="mb-8 flex justify-between items-center">
                    <h3 className="text-[11px] uppercase font-black tracking-widest text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">account_balance</span> Payment Info
                    </h3>
                    <button 
                        onClick={handlePrint} 
                        className="w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all shadow-sm" 
                        title="Download PDF"
                    >
                        <span className="material-symbols-outlined text-[20px]">print</span>
                    </button>
                </div>

                {paymentDetails?.bankName ? (
                    <div className="bg-white rounded-2xl p-6 border border-outline-variant/50 shadow-sm mb-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-2 -mt-2"></div>
                        
                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Bank / Provider</div>
                        <div className="text-body-lg font-bold text-on-surface mb-4">{paymentDetails.bankName}</div>
                        
                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Account Number</div>
                        <div className="font-mono text-xl font-black text-primary break-all mb-4 tracking-tighter">{paymentDetails.accountNumber}</div>
                        
                        <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Account Title</div>
                        <div className="text-body-sm font-bold text-on-surface">{paymentDetails.accountTitle}</div>
                        
                        {paymentDetails.instructions && (
                            <div className="mt-5 text-[11px] font-medium text-on-surface-variant border-t border-dashed border-outline-variant/50 pt-4 leading-relaxed">
                                <span className="material-symbols-outlined text-[14px] align-middle mr-1 text-primary">info</span>
                                {paymentDetails.instructions}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-6 border-2 border-dashed border-outline-variant/50 rounded-2xl mb-6 text-center text-on-surface-variant/70 bg-white">
                        <span className="material-symbols-outlined text-[32px] mb-2 opacity-50">money_off</span>
                        <div className="text-[11px] font-black uppercase tracking-widest">No Bank Details Given</div>
                    </div>
                )}

                <div className="mt-auto">
                    {/* Status Alerts */}
                    {statusDisplay === 'UNDER_REVIEW' && (
                        <div className="mb-5 p-4 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary text-xs font-black text-center uppercase tracking-widest flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">pending</span> Verification Pending
                        </div>
                    )}
                    {statusDisplay === 'COMPLETED' && (
                        <div className="mb-5 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-700 text-xs font-black text-center uppercase tracking-widest flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">check_circle</span> Payment Verified
                        </div>
                    )}
                    {statusDisplay === 'OVERDUE' && (
                        <div className="mb-5 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-xs font-black text-center uppercase tracking-widest flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">warning</span> Payment Overdue
                        </div>
                    )}

                    {effectiveProof && (
                        <div className="mb-5 relative aspect-[4/3] rounded-xl overflow-hidden border border-outline-variant/50 shadow-sm group bg-white">
                            <img src={effectiveProof} alt="Receipt Proof" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                                <span className="text-xs text-white uppercase font-black tracking-widest flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">visibility</span> Proof Attached
                                </span>
                            </div>
                        </div>
                    )}

                    {(statusDisplay === 'UNPAID' || statusDisplay === 'OVERDUE' || (statusDisplay === 'UNDER_REVIEW' && !uploading)) && (
                        <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary cursor-pointer rounded-xl transition-all shadow-sm group">
                            <span className="material-symbols-outlined text-[28px] mb-2 group-hover:-translate-y-1 transition-transform">
                                {uploading ? 'cloud_sync' : (effectiveProof ? 'published_with_changes' : 'cloud_upload')}
                            </span>
                            <span className="text-[11px] font-black uppercase tracking-widest text-center">
                                {uploading ? 'Uploading...' : (effectiveProof ? 'Change Receipt' : 'Upload Receipt')}
                            </span>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*,.pdf"
                                onChange={(e) => e.target.files && onUpload(e.target.files[0])}
                                disabled={uploading}
                            />
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
}
