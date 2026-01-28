'use client';

import { useGetStudentMeQuery } from '@/lib/services/studentApi';
import { HiOutlineUser, HiOutlineCash, HiOutlineOfficeBuilding, HiOutlineBriefcase } from 'react-icons/hi';

export default function StudentDashboard() {
  const { data: studentResponse, isLoading } = useGetStudentMeQuery();
  const student = studentResponse?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold text-red-500">Student Profile Not Found</h3>
        <p className="text-gray-500">Please contact your hostel manager.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-brand-primary to-brand-primary/80 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {student.fullName.split(' ')[0]}!</h1>
        <p className="opacity-90">Here's your hostel overview.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">My Room</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {(student.roomId as any)?.roomNumber || 'N/A'}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
              <HiOutlineOfficeBuilding size={24} />
            </div>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Bed Number: </span>
            <span className="font-bold text-gray-900 dark:text-white">{student.bedNumber}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fee Status</p>
              <h3 className={`text-2xl font-bold mt-1 ${
                student.feeStatus === 'PAID' ? 'text-green-600' : 
                student.feeStatus === 'OVERDUE' ? 'text-red-600' : 'text-orange-500'
              }`}>
                {student.feeStatus}
              </h3>
            </div>
            <div className={`p-3 rounded-lg ${
                student.feeStatus === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
            }`}>
              <HiOutlineCash size={24} />
            </div>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Monthly Fee: </span>
            <span className="font-bold text-gray-900 dark:text-white">Rs {student.monthlyFee.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Agreement Date</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {new Date(student.agreementDate).toLocaleDateString()}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
              <HiOutlineBriefcase size={24} />
            </div>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Security Deposit: </span>
            <span className="font-bold text-gray-900 dark:text-white">Rs {student.securityDeposit.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-gray-500">Full Name</span>
                    <span className="font-medium">{student.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium">{(student.userId as any)?.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-gray-500">CNIC</span>
                    <span className="font-medium">{student.cnic}</span>
                </div>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-gray-500">Father's Name</span>
                    <span className="font-medium">{student.fatherName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-gray-500">Emergency Contact</span>
                    <span className="font-medium">{student.emergencyContact.phone}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-gray-500">Address</span>
                    <span className="font-medium truncate max-w-[200px]" title={student.permanentAddress}>{student.permanentAddress}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
