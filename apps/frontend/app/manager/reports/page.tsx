'use client';

import React, { useState, useRef } from 'react';
import { useGetMonthlyReportQuery } from '@/lib/services/hostelApi';
import { HiPrinter, HiDownload, HiFilter } from 'react-icons/hi';
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
    
    // Header
    doc.setFontSize(20);
    doc.text(`Monthly Report: ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`, 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Summary
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
    
    // Students List
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
           <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Monthly Reports</h1>
           <p className="text-gray-500">Generate and print financial reports</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
           <HiFilter className="text-gray-400" />
           <select 
             className="bg-transparent border-none focus:ring-0 text-sm"
             value={selectedMonth}
             onChange={(e) => setSelectedMonth(Number(e.target.value))}
           >
             {months.map(m => (
               <option key={m.value} value={m.value}>{m.label}</option>
             ))}
           </select>
           <select 
             className="bg-transparent border-none focus:ring-0 text-sm"
             value={selectedYear}
             onChange={(e) => setSelectedYear(Number(e.target.value))}
           >
             {[2024, 2025, 2026, 2027].map(y => (
               <option key={y} value={y}>{y}</option>
             ))}
           </select>
        </div>
        
        <div className="flex gap-2">
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <HiDownload className="text-lg" />
              <span>PDF</span>
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              <HiPrinter className="text-lg" />
              <span>Print</span>
            </button>
        </div>
      </div>

      {isLoading || isFetching ? (
         <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
         </div>
      ) : (
        <div ref={printRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden print:shadow-none print:border-none">
           {/* Report Header (Visible in Print) */}
           <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 print:bg-white text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                {months.find(m => m.value === selectedMonth)?.label} {selectedYear} Report
              </h2>
              <p className="text-gray-500 mt-2 text-sm">Generated on {new Date().toLocaleDateString()}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 text-left">
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 print:border-gray-300">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Total Revenue</p>
                    <p className="text-xl font-bold text-green-600">PKR {report?.summary?.totalRevenue?.toLocaleString() || 0}</p>
                 </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 print:border-gray-300">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Total Pending</p>
                    <p className="text-xl font-bold text-red-500">PKR {report?.summary?.totalPending?.toLocaleString() || 0}</p>
                 </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 print:border-gray-300">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Collected Count</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{report?.summary?.collectedCount || 0}</p>
                 </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 print:border-gray-300">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Total Students</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{report?.meta?.totalStudents || 0}</p>
                 </div>
              </div>
           </div>
           
           {/* Detailed Table */}
           <div className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Student Name</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Contact</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Hostel</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Room</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {report?.students?.length > 0 ? (
                    report.students.map((student: any) => (
                      <tr key={student.studentId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{student.name}</td>
                        <td className="px-6 py-4 text-gray-500 truncate">{student.contactNumber}</td>
                        <td className="px-6 py-4 text-gray-500">{student.hostelName || '-'}</td>
                        <td className="px-6 py-4 text-gray-500">{student.roomNumber || '-'}</td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                             ${student.status === 'COMPLETED' 
                               ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                               : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                             }`}>
                             {student.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                           {student.status === 'COMPLETED' ? (
                             <span className="text-green-600">PKR {student.paidAmount.toLocaleString()}</span>
                           ) : (
                             <span className="text-red-500">PKR {student.dueAmount.toLocaleString()}</span>
                           )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No records found for this month.
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
          body { -webkit-print-color-adjust: exact; }
          nav, aside, footer, button { display: none !important; }
        }
      `}} />
    </div>
  );
}
