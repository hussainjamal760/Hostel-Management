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
      ['Total Revenue', `PKR ${report?.summary?.totalRevenue?.toLocaleString() || 0}`],
      ['Total Pending', `PKR ${report?.summary?.totalPending?.toLocaleString() || 0}`],
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
      s.status === 'COMPLETED' ? s.paidAmount : s.dueAmount
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
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 print:hidden">
        <div>
           <h1 className="text-display-lg-mobile md:text-display-lg text-primary flex items-center gap-3">
               <span className="material-symbols-outlined text-[36px] text-secondary">analytics</span>
               Monthly Reports
           </h1>
           <p className="text-body-lg text-on-surface-variant mt-1">Generate and print financial reports</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-surface p-1.5 rounded-2xl shadow-sm border border-outline-variant w-full sm:w-auto">
               <span className="material-symbols-outlined text-on-surface-variant pl-2">filter_alt</span>
               
               <div className="relative flex-1 sm:w-32">
                   <select 
                     className="w-full pl-3 pr-8 py-2 bg-transparent text-primary font-bold outline-none appearance-none cursor-pointer"
                     value={selectedMonth}
                     onChange={(e) => setSelectedMonth(Number(e.target.value))}
                   >
                     {months.map(m => (
                       <option key={m.value} value={m.value}>{m.label}</option>
                     ))}
                   </select>
                   <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
               </div>
               
               <div className="w-[1px] h-8 bg-outline-variant/50"></div>
               
               <div className="relative flex-1 sm:w-28">
                   <select 
                     className="w-full pl-3 pr-8 py-2 bg-transparent text-primary font-bold outline-none appearance-none cursor-pointer"
                     value={selectedYear}
                     onChange={(e) => setSelectedYear(Number(e.target.value))}
                   >
                     {[2024, 2025, 2026, 2027].map(y => (
                       <option key={y} value={y}>{y}</option>
                     ))}
                   </select>
                   <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
               </div>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={handleDownloadPDF}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-outline-variant rounded-2xl text-primary font-bold hover:bg-surface-container-low transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined">download</span>
                  PDF
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-2xl hover:bg-on-primary-fixed-variant transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined">print</span>
                  Print
                </button>
            </div>
        </div>
      </div>

      {isLoading || isFetching ? (
         <div className="p-16 text-center flex flex-col items-center bg-surface rounded-3xl border border-outline-variant shadow-sm">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary mb-4"></div>
            <p className="text-body-lg text-on-surface-variant font-medium">Loading report data...</p>
         </div>
      ) : (
        <div ref={printRef} className="bg-surface rounded-3xl shadow-sm border border-outline-variant overflow-hidden print:shadow-none print:border-none">
           <div className="p-8 border-b border-outline-variant bg-surface-container-lowest print:bg-white text-center">
              <h2 className="text-display-md text-primary uppercase tracking-wider flex items-center justify-center gap-3">
                <span className="material-symbols-outlined text-[32px] text-secondary">summarize</span>
                {months.find(m => m.value === selectedMonth)?.label} {selectedYear} Report
              </h2>
              <p className="text-on-surface-variant mt-2 text-body-md font-medium flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  Generated on {new Date().toLocaleDateString()}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 text-left">
                 <div className="bg-background p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-center print:border-gray-300 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-16 h-16 bg-primary/5 rounded-bl-full flex items-center justify-center transition-transform group-hover:scale-110">
                        <span className="material-symbols-outlined text-primary mb-2 ml-2">payments</span>
                    </div>
                    <p className="text-label-md text-on-surface-variant uppercase tracking-wider font-bold mb-2">Total Revenue</p>
                    <p className="text-display-sm font-bold text-green-600">PKR {report?.summary?.totalRevenue?.toLocaleString() || 0}</p>
                 </div>
                 <div className="bg-background p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-center print:border-gray-300 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-16 h-16 bg-error/5 rounded-bl-full flex items-center justify-center transition-transform group-hover:scale-110">
                        <span className="material-symbols-outlined text-error mb-2 ml-2">money_off</span>
                    </div>
                    <p className="text-label-md text-on-surface-variant uppercase tracking-wider font-bold mb-2">Total Pending</p>
                    <p className="text-display-sm font-bold text-error">PKR {report?.summary?.totalPending?.toLocaleString() || 0}</p>
                 </div>
                 <div className="bg-background p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-center print:border-gray-300 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-16 h-16 bg-secondary/5 rounded-bl-full flex items-center justify-center transition-transform group-hover:scale-110">
                        <span className="material-symbols-outlined text-secondary mb-2 ml-2">task_alt</span>
                    </div>
                    <p className="text-label-md text-on-surface-variant uppercase tracking-wider font-bold mb-2">Collected Count</p>
                    <p className="text-display-sm font-bold text-primary">{report?.summary?.collectedCount || 0}</p>
                 </div>
                 <div className="bg-background p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-center print:border-gray-300 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-16 h-16 bg-primary/5 rounded-bl-full flex items-center justify-center transition-transform group-hover:scale-110">
                        <span className="material-symbols-outlined text-primary mb-2 ml-2">group</span>
                    </div>
                    <p className="text-label-md text-on-surface-variant uppercase tracking-wider font-bold mb-2">Total Students</p>
                    <p className="text-display-sm font-bold text-primary">{report?.meta?.totalStudents || 0}</p>
                 </div>
              </div>
           </div>
           
           <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-lowest border-b border-outline-variant">
                  <tr>
                    <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Student Name</th>
                    <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Contact</th>
                    <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Hostel</th>
                    <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Room</th>
                    <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                    <th className="px-6 py-5 text-label-md font-bold uppercase tracking-wider text-on-surface-variant text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {report?.students?.length > 0 ? (
                    report.students.map((student: any) => (
                      <tr key={student.studentId} className="hover:bg-surface-container-lowest transition-colors group">
                        <td className="px-6 py-4 font-bold text-primary text-body-lg group-hover:text-secondary transition-colors">{student.name}</td>
                        <td className="px-6 py-4 text-body-md text-on-surface-variant font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">phone</span>
                            {student.contactNumber || '-'}
                        </td>
                        <td className="px-6 py-4 text-body-md text-on-surface-variant font-medium">{student.hostelName || '-'}</td>
                        <td className="px-6 py-4">
                            <span className="font-bold text-on-surface flex items-center gap-1.5 bg-surface-container-highest/20 px-3 py-1 rounded-lg w-fit">
                                <span className="material-symbols-outlined text-[16px] text-secondary">meeting_room</span>
                                {student.roomNumber || '-'}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-label-sm font-bold uppercase tracking-wider border
                             ${student.status === 'COMPLETED' 
                               ? 'bg-green-100 text-green-700 border-green-200' 
                               : 'bg-error-container text-error border-error/20'
                             }`}>
                             <span className="material-symbols-outlined text-[16px]">
                                 {student.status === 'COMPLETED' ? 'check_circle' : 'error'}
                             </span>
                             {student.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-body-lg">
                           {student.status === 'COMPLETED' ? (
                             <span className="text-green-600 bg-green-50 px-3 py-1.5 rounded-xl">PKR {student.paidAmount.toLocaleString()}</span>
                           ) : (
                             <span className="text-error bg-error-container/50 px-3 py-1.5 rounded-xl">PKR {student.dueAmount.toLocaleString()}</span>
                           )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-16 text-center flex flex-col items-center">
                          <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6 text-on-surface-variant">
                              <span className="material-symbols-outlined text-[40px]">search_off</span>
                          </div>
                          <h3 className="text-display-sm text-primary mb-2">No Records Found</h3>
                          <p className="text-body-lg text-on-surface-variant">There are no financial records for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page { margin: 20mm; }
          body { -webkit-print-color-adjust: exact; }
          nav, aside, footer, button { display: none !important; }
        }
      `}} />
    </div>
  );
}
