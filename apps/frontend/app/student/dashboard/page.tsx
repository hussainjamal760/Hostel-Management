'use client';

import { useGetStudentMeQuery, useGetDueWarningQuery } from '@/lib/services/studentApi';
import Link from 'next/link';

export default function StudentDashboard() {
  const { data: studentResponse, isLoading } = useGetStudentMeQuery();
  const { data: dueWarningResponse } = useGetDueWarningQuery();
  const student = studentResponse?.data;
  const dueWarning = dueWarningResponse?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] bg-surface rounded-3xl border border-outline-variant shadow-sm">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-primary mb-4"></div>
        <p className="text-body-lg text-on-surface-variant font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-16 bg-surface rounded-3xl border border-outline-variant shadow-sm flex flex-col items-center">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6 text-error">
            <span className="material-symbols-outlined text-[40px]">person_off</span>
        </div>
        <h3 className="text-display-sm font-bold text-error mb-2">Student Profile Not Found</h3>
        <p className="text-body-lg text-on-surface-variant max-w-md">We couldn't load your profile. Please contact your hostel manager for assistance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Due Warning Alert */}
      {dueWarning && (dueWarning.hasOverdue || dueWarning.pendingCount > 0) && (
        <div className={`p-6 md:p-8 rounded-3xl border-2 shadow-sm relative overflow-hidden group bg-surface ${
            dueWarning.hasOverdue ? 'border-error/30' : 'border-secondary/30'
        }`}>
          {/* Subtle background highlight instead of harsh gradient */}
          <div className={`absolute inset-0 opacity-5 ${dueWarning.hasOverdue ? 'bg-error' : 'bg-secondary'}`}></div>
          
          {/* Decorative side accent */}
          <div className={`absolute left-0 top-0 bottom-0 w-2 ${dueWarning.hasOverdue ? 'bg-error' : 'bg-secondary'}`}></div>

          <div className="absolute right-0 top-0 w-48 h-48 rounded-bl-full flex items-center justify-center opacity-5 pointer-events-none transition-transform duration-700 group-hover:scale-110">
              <span className={`material-symbols-outlined text-[120px] mb-8 ml-8 ${dueWarning.hasOverdue ? 'text-error' : 'text-secondary'}`}>
                  warning
              </span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10 pl-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                dueWarning.hasOverdue ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'
              }`}>
              <span className="material-symbols-outlined text-[32px]">
                  {dueWarning.hasOverdue ? 'error' : 'schedule'}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                  <h3 className={`text-display-sm font-bold ${dueWarning.hasOverdue ? 'text-error' : 'text-secondary'}`}>
                    {dueWarning.hasOverdue ? 'Payment Overdue!' : 'Payment Due'}
                  </h3>
                  {dueWarning.hasOverdue && (
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
                      </span>
                  )}
              </div>
              <p className="text-body-lg font-medium text-on-surface-variant mb-4">
                You have <span className="font-bold text-on-surface">{dueWarning.pendingCount}</span> pending challan{dueWarning.pendingCount > 1 ? 's' : ''}
                {dueWarning.hasOverdue && <span className="text-error font-bold"> ({dueWarning.overdueCount} overdue)</span>}.
              </p>
              
              <div className="flex flex-wrap items-center gap-3">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold border ${
                      dueWarning.hasOverdue ? 'bg-error-container/50 text-error border-error/20' : 'bg-secondary-container/50 text-secondary border-secondary/20'
                  }`}>
                      <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                      <span className="text-xl">Rs {dueWarning.totalDueAmount.toLocaleString()}</span>
                  </div>
                  {dueWarning.oldestDueDate && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant text-on-surface-variant font-bold text-label-sm uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      Due: {new Date(dueWarning.oldestDueDate).toLocaleDateString()}
                    </div>
                  )}
              </div>
            </div>

            <Link
              href="/student/invoices"
              className={`mt-4 md:mt-0 px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm w-full md:w-auto hover:-translate-y-1 ${
                  dueWarning.hasOverdue
                  ? 'bg-error text-white hover:bg-error/90 hover:shadow-error/30'
                  : 'bg-secondary text-on-secondary hover:bg-secondary/90 hover:shadow-secondary/30'
                }`}
            >
              <span className="material-symbols-outlined">receipt_long</span>
              View & Pay
            </Link>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-primary rounded-3xl p-8 md:p-10 text-on-primary shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-64 h-64 bg-on-primary/5 rounded-bl-full transition-transform duration-700 group-hover:scale-110"></div>
        <div className="absolute right-10 bottom-10 w-32 h-32 bg-on-primary/10 rounded-full transition-transform duration-700 group-hover:-translate-y-4"></div>
        <div className="relative z-10">
            <h1 className="text-display-lg font-bold mb-2 flex items-center gap-3">
                Welcome back, {student.fullName.split(' ')[0]}!
                <span className="text-[40px] animate-bounce origin-bottom">👋</span>
            </h1>
            <p className="text-body-lg opacity-90 font-medium">Here's your real-time hostel overview.</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface p-8 rounded-3xl shadow-sm border border-outline-variant relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-primary mb-4 ml-4 text-[32px]">meeting_room</span>
          </div>
          <p className="text-label-md text-on-surface-variant font-bold uppercase tracking-wider mb-2">My Room</p>
          <h3 className="text-display-md font-bold text-primary mb-4">
            {(student.roomId as any)?.roomNumber || 'N/A'}
          </h3>
          <div className="inline-flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-xl border border-outline-variant/50">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">single_bed</span>
            <span className="text-body-md text-on-surface-variant font-medium">Bed Number: <strong className="text-on-surface ml-1">{student.bedNumber}</strong></span>
          </div>
        </div>

        <div className="bg-surface p-8 rounded-3xl shadow-sm border border-outline-variant relative overflow-hidden group">
          <div className={`absolute right-0 top-0 w-24 h-24 rounded-bl-full flex items-center justify-center transition-transform group-hover:scale-110 ${
              student.feeStatus === 'PAID' ? 'bg-green-50' : 
              student.feeStatus === 'OVERDUE' ? 'bg-error/5' : 'bg-secondary/5'
          }`}>
              <span className={`material-symbols-outlined mb-4 ml-4 text-[32px] ${
                  student.feeStatus === 'PAID' ? 'text-green-600' : 
                  student.feeStatus === 'OVERDUE' ? 'text-error' : 'text-secondary'
              }`}>payments</span>
          </div>
          <p className="text-label-md text-on-surface-variant font-bold uppercase tracking-wider mb-2">Fee Status</p>
          <h3 className={`text-display-md font-bold mb-4 ${student.feeStatus === 'PAID' ? 'text-green-600' :
              student.feeStatus === 'OVERDUE' ? 'text-error' : 'text-secondary'
            }`}>
            {student.feeStatus}
          </h3>
          <div className="inline-flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-xl border border-outline-variant/50">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">account_balance_wallet</span>
            <span className="text-body-md text-on-surface-variant font-medium">Monthly Fee: <strong className="text-on-surface ml-1">Rs {student.monthlyFee.toLocaleString()}</strong></span>
          </div>
        </div>

        <div className="bg-surface p-8 rounded-3xl shadow-sm border border-outline-variant relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-tertiary/5 rounded-bl-full flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-tertiary mb-4 ml-4 text-[32px]">assignment</span>
          </div>
          <p className="text-label-md text-on-surface-variant font-bold uppercase tracking-wider mb-2">Agreement Date</p>
          <h3 className="text-display-sm font-bold text-on-surface mb-4">
            {new Date(student.agreementDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
          <div className="inline-flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-xl border border-outline-variant/50">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">verified_user</span>
            <span className="text-body-md text-on-surface-variant font-medium">Security Deposit: <strong className="text-on-surface ml-1">Rs {student.securityDeposit.toLocaleString()}</strong></span>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-surface rounded-3xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="p-6 md:p-8 border-b border-outline-variant bg-surface-container-lowest flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px] text-primary">badge</span>
            <h3 className="text-display-sm font-bold text-primary">Personal Details</h3>
        </div>
        <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-outline-variant/50 pb-4">
                  <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-1 sm:mb-0">Full Name</span>
                  <span className="text-body-lg font-bold text-on-surface">{student.fullName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-outline-variant/50 pb-4">
                  <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-1 sm:mb-0">Phone</span>
                  <span className="text-body-lg font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">phone_iphone</span>
                      {(student.userId as any)?.phone || 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-outline-variant/50 pb-4">
                  <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-1 sm:mb-0">CNIC</span>
                  <span className="text-body-lg font-bold text-on-surface font-mono">{student.cnic}</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-outline-variant/50 pb-4">
                  <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-1 sm:mb-0">Father's Name</span>
                  <span className="text-body-lg font-bold text-on-surface">{student.fatherName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-outline-variant/50 pb-4">
                  <span className="text-label-md font-bold text-error uppercase tracking-wider mb-1 sm:mb-0 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">emergency</span>
                      Emergency Contact
                  </span>
                  <span className="text-body-lg font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-error text-[18px]">call</span>
                      {student.emergencyContact.phone}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-outline-variant/50 pb-4">
                  <span className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-1 sm:mb-0 shrink-0">Address</span>
                  <span className="text-body-lg font-bold text-on-surface sm:text-right sm:max-w-[250px] leading-relaxed" title={student.permanentAddress}>{student.permanentAddress}</span>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
