'use client';

import React, { useState, useRef } from 'react';
import { useGetMonthlyReportQuery, useGetAllHostelsQuery } from '@/lib/services/hostelApi';
import { HiPrinter, HiDownload, HiFilter, HiOfficeBuilding } from 'react-icons/hi';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedHostel, setSelectedHostel] = useState<string>('ALL');
  
  const { data: hostelsResponse } = useGetAllHostelsQuery({ limit: 100 });
  const hostels = hostelsResponse?.data || [];

  const { data: reportResponse, isLoading, isFetching } = useGetMonthlyReportQuery({
    month: selectedMonth,
    year: selectedYear,
    hostelId: selectedHostel
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
    const hostelName = selectedHostel === 'ALL' ? 'All Hostels' : hostels.find((h: any) => h._id === selectedHostel)?.name;
    doc.text(`Monthly Report: ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`, 14, 22);
    doc.setFontSize(14);
    doc.text(`Hostel: ${hostelName}`, 14, 30);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 38);
    
    // Summary
    doc.setFontSize(12);
    doc.text('Summary', 14, 50);
    
    const summaryData = [
      ['Total Students', report?.meta?.totalStudents || 0],
      ['Total Revenue', `PKR ${report?.summary?.totalRevenue?.toLocaleString() || 0}`],
      ['Total Pending', `PKR ${report?.summary?.totalPending?.toLocaleString() || 0}`],
      ['Collected Count', report?.summary?.collectedCount || 0],
      ['Pending Count', report?.summary?.pendingCount || 0],
    ];
    
    autoTable(doc, {
      startY: 55,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [92, 64, 51] } // Deep Walnut Brown
    });
    
    // Students List
    doc.text('Details', 14, (doc as any).lastAutoTable.finalY + 15);
    
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
      headStyles: { fillColor: [122, 92, 77] } // Secondary Brown
    });

    doc.save(`admin_report_${selectedMonth}_${selectedYear}.pdf`);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6 w-full">
        {/* Header Controls */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 print:hidden w-full">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-[#5C4033] tracking-tight">Financial Reports</h1>
            <p className="text-[#7A5C4D]">System-wide financial summary and payment records.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            {/* Filters Box */}
            <div className="flex flex-wrap items-center bg-[#ffffff] p-2 rounded-xl border border-[#d4c3bd] shadow-sm flex-1 xl:flex-none">
              <div className="flex items-center px-3 border-r border-[#f2ded6]">
                <HiOfficeBuilding className="text-[#7A5C4D] mr-2 text-lg" />
                <select 
                  className="bg-transparent border-none focus:ring-0 text-[#5C4033] font-bold text-sm outline-none cursor-pointer pr-4"
                  value={selectedHostel}
                  onChange={(e) => setSelectedHostel(e.target.value)}
                >
                  <option value="ALL">All Hostels</option>
                  {hostels.map((h: any) => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center px-3">
                <HiFilter className="text-[#7A5C4D] mr-2 text-lg" />
                <select 
                  className="bg-transparent border-none focus:ring-0 text-[#5C4033] font-bold text-sm outline-none cursor-pointer pr-4"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {months.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center px-3 border-l border-[#f2ded6]">
                <select 
                  className="bg-transparent border-none focus:ring-0 text-[#5C4033] font-bold text-sm outline-none cursor-pointer pr-4"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {[2024, 2025, 2026, 2027].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#ffffff] border border-[#d4c3bd] text-[#5C4033] rounded-xl hover:bg-[#F8F5F0] font-bold transition-colors shadow-sm"
              >
                <HiDownload className="text-xl" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#5C4033] text-white rounded-xl hover:bg-[#432a1e] font-bold transition-all shadow-md hover:-translate-y-0.5"
              >
                <HiPrinter className="text-xl" />
                <span className="hidden sm:inline">Print Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        {isLoading || isFetching ? (
          <div className="p-12 flex justify-center w-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5C4033]"></div>
          </div>
        ) : (
          <div ref={printRef} className="bg-[#ffffff] rounded-2xl shadow-sm border border-[#d4c3bd] overflow-hidden print:shadow-none print:border-none w-full">
            {/* Report Header (Visible in Print) */}
            <div className="p-8 border-b border-[#f2ded6] bg-[#F8F5F0] print:bg-white text-center">
              <h2 className="text-3xl font-extrabold text-[#5C4033] uppercase tracking-widest mb-2">
                {months.find(m => m.value === selectedMonth)?.label} {selectedYear} Report
              </h2>
              <div className="inline-block px-4 py-1.5 bg-[#ffffff] border border-[#d4c3bd] rounded-full text-[#7A5C4D] font-bold mb-8">
                {selectedHostel === 'ALL' ? 'All Hostels Overview' : hostels.find((h: any) => h._id === selectedHostel)?.name}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left w-full">
                <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#d4c3bd] shadow-sm print:border-gray-300">
                  <div className="w-10 h-10 bg-[#e6f4ea] text-[#1e4620] rounded-full flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-lg">payments</span>
                  </div>
                  <p className="text-xs text-[#7A5C4D] uppercase font-bold tracking-wider mb-1">Total Revenue</p>
                  <p className="text-2xl font-black text-[#1e4620]">PKR {report?.summary?.totalRevenue?.toLocaleString() || 0}</p>
                </div>

                <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#d4c3bd] shadow-sm print:border-gray-300">
                  <div className="w-10 h-10 bg-[#ffdad6] text-[#ba1a1a] rounded-full flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-lg">warning</span>
                  </div>
                  <p className="text-xs text-[#7A5C4D] uppercase font-bold tracking-wider mb-1">Total Pending</p>
                  <p className="text-2xl font-black text-[#ba1a1a]">PKR {report?.summary?.totalPending?.toLocaleString() || 0}</p>
                </div>

                <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#d4c3bd] shadow-sm print:border-gray-300">
                  <div className="w-10 h-10 bg-[#eaddd7] text-[#432a1e] rounded-full flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-lg">receipt_long</span>
                  </div>
                  <p className="text-xs text-[#7A5C4D] uppercase font-bold tracking-wider mb-1">Collected Count</p>
                  <p className="text-2xl font-black text-[#5C4033]">{report?.summary?.collectedCount || 0}</p>
                </div>

                <div className="bg-[#ffffff] p-5 rounded-2xl border border-[#d4c3bd] shadow-sm print:border-gray-300">
                  <div className="w-10 h-10 bg-[#f2ded6] text-[#5c4033] rounded-full flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-lg">group</span>
                  </div>
                  <p className="text-xs text-[#7A5C4D] uppercase font-bold tracking-wider mb-1">Total Students</p>
                  <p className="text-2xl font-black text-[#5C4033]">{report?.meta?.totalStudents || 0}</p>
                </div>
              </div>
            </div>
            
            {/* Detailed Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F8F5F0] border-b border-[#d4c3bd]">
                  <tr>
                    <th className="px-6 py-5 text-xs font-bold text-[#7A5C4D] uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-5 text-xs font-bold text-[#7A5C4D] uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-5 text-xs font-bold text-[#7A5C4D] uppercase tracking-wider">Hostel</th>
                    <th className="px-6 py-5 text-xs font-bold text-[#7A5C4D] uppercase tracking-wider">Room</th>
                    <th className="px-6 py-5 text-xs font-bold text-[#7A5C4D] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-5 text-xs font-bold text-[#7A5C4D] uppercase tracking-wider text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2ded6] bg-[#ffffff]">
                  {report?.students?.length > 0 ? (
                    report.students.map((student: any, idx: number) => (
                      <tr key={`${student.studentId}-${idx}`} className="hover:bg-[#fcfaf8] transition-colors">
                        <td className="px-6 py-4 font-bold text-[#5C4033] whitespace-nowrap">{student.name}</td>
                        <td className="px-6 py-4 text-[#7A5C4D] whitespace-nowrap">{student.contactNumber || '-'}</td>
                        <td className="px-6 py-4 text-[#7A5C4D] whitespace-nowrap">{student.hostelName || '-'}</td>
                        <td className="px-6 py-4 text-[#7A5C4D] whitespace-nowrap">{student.roomNumber || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.status === 'COMPLETED' ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-[#e6f4ea] text-[#1e4620] border border-[#ceead6]">
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-[#ffdad6] text-[#ba1a1a] border border-[#ffb4ab]">
                              Unpaid
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right font-black whitespace-nowrap">
                          {student.status === 'COMPLETED' ? (
                            <span className="text-[#1e4620]">PKR {student.paidAmount?.toLocaleString() || 0}</span>
                          ) : (
                            <span className="text-[#ba1a1a]">PKR {student.dueAmount?.toLocaleString() || 0}</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="w-16 h-16 bg-[#F8F5F0] text-[#7A5C4D] rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="material-symbols-outlined text-3xl">inbox</span>
                        </div>
                        <p className="text-lg font-bold text-[#5C4033]">No records found</p>
                        <p className="text-[#7A5C4D]">No financial records exist for the selected criteria.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-[#F8F5F0] border-t border-[#d4c3bd] text-center text-xs text-[#7A5C4D] font-medium print:block">
              Report automatically generated by Hostelite Admin System
            </div>
          </div>
        )}
      </div>
      
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page { margin: 15mm; }
          body { -webkit-print-color-adjust: exact; background-color: white; }
          nav, aside, footer, button, select { display: none !important; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-none { border: none !important; }
          .print\\:bg-white { background-color: white !important; }
        }
      `}} />
    </>
  );
}
