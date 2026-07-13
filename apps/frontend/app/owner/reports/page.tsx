'use client';

import React, { useState, useRef } from 'react';
import { useGetMonthlyReportQuery } from '@/lib/services/hostelApi';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const { data: reportResponse, isLoading, isFetching } = useGetMonthlyReportQuery({
    month: selectedMonth,
    year: selectedYear
  });

  const report = reportResponse?.data;
  const printRef = useRef<HTMLDivElement>(null);

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
    { value: 12, label: 'December' }
  ];

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text(`Monthly Report: ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`, 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    doc.setFontSize(12);
    doc.text('Summary', 14, 45);
    
    const summaryData = [
      ['Total Students', report?.meta?.totalStudents || 0],
      ['Total Revenue', formatCurrency(report?.summary?.totalRevenue || 0)],
      ['Total Pending', formatCurrency(report?.summary?.totalPending || 0)],
      ['Collected Count', report?.summary?.collectedCount || 0],
      ['Pending Count', report?.summary?.pendingCount || 0],
    ];
    
    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [66, 66, 66] }
    });
    
    doc.text('Student Details', 14, (doc as any).lastAutoTable.finalY + 15);
    
    const tableData = report?.students?.map((s: any) => [
      s.name,
      s.contactNumber || '-',
      s.hostelName || '-',
      s.roomNumber || '-',
      s.status,
      s.status === 'COMPLETED' ? formatCurrency(s.paidAmount) : formatCurrency(s.dueAmount)
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Student Name', 'Contact', 'Hostel', 'Room', 'Status', 'Amount']],
      body: tableData || [],
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`report_${selectedMonth}_${selectedYear}.pdf`);
  };

  return (
    <div className="space-y-8">
      {/* Header & Controls (Hidden when printing) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 print:hidden">
        <div>
           <h2 className="font-headline-lg text-headline-lg text-primary mb-1">Financial Reports</h2>
           <p className="text-on-surface-variant font-body-md opacity-80">Analyze monthly revenue and generate detailed PDFs.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Filter Group */}
            <div className="flex items-center gap-2 bg-surface-container-low p-2 rounded-2xl border border-outline-variant/50 shadow-inner">
               <span className="material-symbols-outlined text-on-surface-variant/50 pl-2">calendar_month</span>
               <select 
                 className="bg-transparent border-none focus:ring-0 text-primary font-body-md cursor-pointer outline-none pl-1 pr-6"
                 value={selectedMonth}
                 onChange={(e) => setSelectedMonth(Number(e.target.value))}
               >
                 {months.map(m => (
                   <option key={m.value} value={m.value}>{m.label}</option>
                 ))}
               </select>
               <span className="w-px h-6 bg-outline-variant/30"></span>
               <select 
                 className="bg-transparent border-none focus:ring-0 text-primary font-body-md cursor-pointer outline-none pl-2 pr-6"
                 value={selectedYear}
                 onChange={(e) => setSelectedYear(Number(e.target.value))}
               >
                 {[2024, 2025, 2026, 2027].map(y => (
                   <option key={y} value={y}>{y}</option>
                 ))}
               </select>
            </div>
            
            {/* Actions Group */}
            <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={handleDownloadPDF}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-surface border-2 border-outline-variant/50 rounded-2xl hover:bg-surface-container hover:border-outline-variant transition-all text-primary font-label-md uppercase tracking-widest"
                  title="Download as PDF"
                >
                  <span className="material-symbols-outlined text-[20px]">download</span>
                  <span>PDF</span>
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-on-primary rounded-2xl font-label-md uppercase tracking-widest hover:bg-primary/90 transition-all shadow-[0_4px_10px_-2px_rgba(var(--color-primary-rgb),0.4)] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  title="Print Report"
                >
                  <span className="material-symbols-outlined text-[20px]">print</span>
                  <span>Print</span>
                </button>
            </div>
        </div>
      </div>

      {isLoading || isFetching ? (
         <div className="p-16 flex flex-col items-center justify-center bg-surface-container-lowest rounded-[32px] border border-outline-variant shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)]">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-on-surface-variant font-label-md uppercase tracking-widest">Compiling report data...</p>
         </div>
      ) : (
        <div ref={printRef} className="bg-surface-container-lowest rounded-[32px] shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] border border-outline-variant overflow-hidden print:shadow-none print:border-none print:rounded-none bg-white text-black">
           
           {/* Report Header (Visible in Print) */}
           <div className="p-8 lg:p-12 border-b border-outline-variant/40 bg-surface-container-low/50 print:bg-white text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2 print:hidden"></div>
              
              <h2 className="font-headline-lg text-primary print:text-black uppercase tracking-widest mb-2">
                {months.find(m => m.value === selectedMonth)?.label} {selectedYear} Report
              </h2>
              <p className="text-on-surface-variant font-label-md uppercase tracking-widest opacity-70 print:text-black">Generated on {new Date().toLocaleDateString()}</p>
              
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 text-left">
                 
                 <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm print:border-black print:shadow-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-[48px] text-tertiary print:hidden">account_balance_wallet</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant uppercase font-bold tracking-widest mb-2 flex items-center gap-1.5 print:text-black">
                       <span className="material-symbols-outlined text-[14px] text-tertiary print:hidden">arrow_upward</span>
                       Total Revenue
                    </p>
                    <p className="font-mono text-2xl font-bold text-tertiary print:text-black">{formatCurrency(report?.summary?.totalRevenue || 0)}</p>
                 </div>
                 
                 <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm print:border-black print:shadow-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-[48px] text-error print:hidden">warning</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant uppercase font-bold tracking-widest mb-2 flex items-center gap-1.5 print:text-black">
                       <span className="material-symbols-outlined text-[14px] text-error print:hidden">arrow_downward</span>
                       Total Pending
                    </p>
                    <p className="font-mono text-2xl font-bold text-error print:text-black">{formatCurrency(report?.summary?.totalPending || 0)}</p>
                 </div>
                 
                 <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm print:border-black print:shadow-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-[48px] text-primary print:hidden">fact_check</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant uppercase font-bold tracking-widest mb-2 flex items-center gap-1.5 print:text-black">
                       <span className="material-symbols-outlined text-[14px] text-primary print:hidden">receipt_long</span>
                       Collected Count
                    </p>
                    <p className="font-headline-md font-bold text-primary print:text-black">{report?.summary?.collectedCount || 0}</p>
                 </div>
                 
                 <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant shadow-sm print:border-black print:shadow-none relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-[48px] text-primary print:hidden">groups</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant uppercase font-bold tracking-widest mb-2 flex items-center gap-1.5 print:text-black">
                       <span className="material-symbols-outlined text-[14px] text-primary print:hidden">person</span>
                       Total Students
                    </p>
                    <p className="font-headline-md font-bold text-primary print:text-black">{report?.meta?.totalStudents || 0}</p>
                 </div>

              </div>
           </div>
           
           {/* Detailed Table */}
           <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low text-[11px] uppercase text-on-surface-variant font-label-lg tracking-widest print:bg-white print:text-black">
                  <tr>
                    <th className="px-8 py-5 whitespace-nowrap">Student Name</th>
                    <th className="px-8 py-5 whitespace-nowrap">Contact</th>
                    <th className="px-8 py-5 whitespace-nowrap">Property</th>
                    <th className="px-8 py-5 whitespace-nowrap text-center">Room</th>
                    <th className="px-8 py-5 whitespace-nowrap text-center">Status</th>
                    <th className="px-8 py-5 whitespace-nowrap text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50 print:divide-black/20">
                  {report?.students?.length > 0 ? (
                    report.students.map((student: any) => (
                      <tr key={student.studentId} className="hover:bg-surface-container-lowest transition-colors print:hover:bg-white group">
                        <td className="px-8 py-5 font-headline-sm text-primary print:text-black">{student.name}</td>
                        <td className="px-8 py-5 font-mono text-sm text-on-surface-variant print:text-black truncate">{student.contactNumber}</td>
                        <td className="px-8 py-5 font-body-md text-on-surface-variant print:text-black">{student.hostelName || '-'}</td>
                        <td className="px-8 py-5 font-mono text-sm text-on-surface-variant text-center print:text-black">{student.roomNumber || '-'}</td>
                        <td className="px-8 py-5 text-center">
                           <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border print:border-none print:bg-transparent print:p-0
                             ${student.status === 'COMPLETED' 
                               ? 'bg-green-100 text-green-700 border-green-200 print:text-black' 
                               : 'bg-error-container text-error border-error/20 print:text-black'
                             }`}>
                             <span className="material-symbols-outlined text-[14px] print:hidden">
                               {student.status === 'COMPLETED' ? 'check_circle' : 'error'}
                             </span>
                             {student.status}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-right font-mono text-sm font-bold print:text-black">
                           {student.status === 'COMPLETED' ? (
                             <span className="text-tertiary print:text-black">{formatCurrency(student.paidAmount)}</span>
                           ) : (
                             <span className="text-error print:text-black">{formatCurrency(student.dueAmount)}</span>
                           )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-8 py-16 text-center text-on-surface-variant">
                         <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4 print:hidden">description</span>
                            <p className="font-headline-sm text-primary mb-1 print:text-black">No records found</p>
                            <p className="font-body-md print:hidden">There is no financial data available for this month.</p>
                         </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>
      )}
      
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page { margin: 20mm; }
          body { -webkit-print-color-adjust: exact; background-color: white !important; }
          nav, aside, footer, button { display: none !important; }
        }
      `}} />
    </div>
  );
}
