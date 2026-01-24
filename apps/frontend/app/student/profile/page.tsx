'use client';

import { useGetStudentMeQuery } from '@/lib/services/studentApi';

export default function StudentProfilePage() {
  const { data: studentResponse } = useGetStudentMeQuery();
  const student = studentResponse?.data;

  if (!student) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">My Profile</h2>
      {/* Reusing the grid layout from dashboard for now */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-lg font-medium">{student.fullName}</p>
                </div>
                <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
                    <p className="text-sm text-gray-500">Father's Name</p>
                    <p className="text-lg font-medium">{student.fatherName}</p>
                </div>
                <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
                    <p className="text-sm text-gray-500">CNIC</p>
                    <p className="text-lg font-medium">{student.cnic}</p>
                </div>
                 <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
                    <p className="text-sm text-gray-500">Guardian Contact</p>
                    <p className="text-lg font-medium">{student.fatherPhone}</p>
                </div>
            </div>
            <div className="space-y-6">
                <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-medium">{(student.userId as any)?.email}</p>
                </div>
                <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-lg font-medium">{(student.userId as any)?.phone}</p>
                </div>
                <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
                    <p className="text-sm text-gray-500">Permanent Address</p>
                    <p className="text-lg font-medium">{student.permanentAddress}</p>
                </div>
            </div>
        </div>
    </div>
  );
}
